import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "./LocaleContext";
import {
  matchVoiceCommand,
  speakFeedback,
  createSpeechRecognizer,
  COMMAND_CATEGORIES,
} from "../services/voiceCommandService";

const VoiceCommandContext = createContext(null);

export function VoiceCommandProvider({ children }) {
  const navigate = useNavigate();
  const { locale, setLocale } = useLocale();

  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [lastMatched, setLastMatched] = useState(null);
  const [commandHistory, setCommandHistory] = useState([]);
  const [speechFeedbackEnabled, setSpeechFeedbackEnabled] = useState(true);
  const [recognitionError, setRecognitionError] = useState(null);

  const recognitionRef = useRef(null);
  const activeLocaleRef = useRef(locale);
  activeLocaleRef.current = locale;

  // Check Web Speech API availability
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSpeech = !!(
        window.SpeechRecognition || window.webkitSpeechRecognition
      );
      setIsSupported(hasSpeech);
    }
  }, []);

  // Dispatch and execute matched voice command
  const executeCommand = useCallback(
    (matched) => {
      if (!matched) return;

      setLastMatched(matched);
      setCommandHistory((prev) => [matched, ...prev.slice(0, 9)]);

      // 1. Voice feedback synthesis
      if (speechFeedbackEnabled && matched.feedbackText) {
        speakFeedback(matched.feedbackText, activeLocaleRef.current);
      }

      // 2. Navigation Actions
      if (matched.action === "NAVIGATE" && matched.target) {
        navigate(matched.target);
      }

      // 3. UI State Actions
      else if (matched.action === "SET_LANGUAGE" && matched.payload?.locale) {
        setLocale(matched.payload.locale);
      }

      // 4. Dispatch general window event for form inputs & UI listeners
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("agrovision:voice-command", {
            detail: matched,
          })
        );
      }
    },
    [navigate, setLocale, speechFeedbackEnabled]
  );

  // Process text manually or from recognition
  const processSpokenText = useCallback(
    (rawText) => {
      if (!rawText) return;
      const matched = matchVoiceCommand(rawText, activeLocaleRef.current);
      if (matched) {
        executeCommand(matched);
      } else {
        // Fallback advisory or command unrecognized
        setLastMatched({
          id: "unrecognized",
          action: "NONE",
          category: COMMAND_CATEGORIES.ADVISORY,
          label: "Voice Query",
          rawText,
          feedbackText: `Recognized: "${rawText}". Try saying "Open Mandi Prices", "Filter Cotton", or "Open Storage".`,
          timestamp: Date.now(),
        });
        if (speechFeedbackEnabled) {
          speakFeedback(`Heard: ${rawText}`, activeLocaleRef.current);
        }
      }
    },
    [executeCommand, speechFeedbackEnabled]
  );

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  }, []);

  // Start listening
  const startListening = useCallback(() => {
    if (!isSupported) return;
    setRecognitionError(null);
    setTranscript("");

    // Clean up existing instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
    }

    const recognizer = createSpeechRecognizer({
      locale: activeLocaleRef.current,
      onStart: () => {
        setIsListening(true);
      },
      onResult: ({ finalText, interimText, isFinal }) => {
        const currentText = finalText || interimText;
        setTranscript(currentText);

        if (isFinal && finalText) {
          processSpokenText(finalText);
          setIsListening(false);
        }
      },
      onError: (err) => {
        console.warn("Speech recognition error:", err);
        setRecognitionError(err.error || "Speech recognition encountered an issue.");
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      },
    });

    if (recognizer) {
      recognitionRef.current = recognizer;
      try {
        recognizer.start();
      } catch (e) {
        console.warn("Error starting speech recognition:", e);
        setIsListening(false);
      }
    }
  }, [isSupported, processSpokenText]);

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return (
    <VoiceCommandContext.Provider
      value={{
        isSupported,
        isListening,
        transcript,
        lastMatched,
        commandHistory,
        recognitionError,
        speechFeedbackEnabled,
        setSpeechFeedbackEnabled,
        startListening,
        stopListening,
        toggleListening,
        processSpokenText,
      }}
    >
      {children}
    </VoiceCommandContext.Provider>
  );
}

export function useVoiceCommand() {
  const context = useContext(VoiceCommandContext);
  if (!context) {
    throw new Error(
      "useVoiceCommand must be used within a VoiceCommandProvider"
    );
  }
  return context;
}

export default VoiceCommandContext;
