import React, { useState } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  HelpCircle,
  X,
  Compass,
  SlidersHorizontal,
  Layers,
} from "lucide-react";
import { useVoiceCommand } from "../../context/VoiceCommandContext";
import { useLocale } from "../../context/LocaleContext";

export default function VoiceCommandBar() {
  const {
    isSupported,
    isListening,
    transcript,
    lastMatched,
    recognitionError,
    speechFeedbackEnabled,
    setSpeechFeedbackEnabled,
    toggleListening,
    processSpokenText,
  } = useVoiceCommand();

  const { locale, t } = useLocale();
  const [showHelp, setShowHelp] = useState(false);
  const [minimized, setMinimized] = useState(false);

  // Quick suggestions based on locale
  const suggestions = {
    en: [
      { text: "Open Mandi Prices", category: "nav" },
      { text: "Filter Cotton", category: "input" },
      { text: "Open Storage", category: "nav" },
      { text: "Switch to Hindi", category: "ui" },
    ],
    hi: [
      { text: "मंडी भाव खोलो", category: "nav" },
      { text: "कपास चुनो", category: "input" },
      { text: "गोदाम दिखाओ", category: "nav" },
      { text: "ગુજરાતી કરો", category: "ui" },
    ],
    mr: [
      { text: "बाजार भाव उघडा", category: "nav" },
      { text: "कापूस निवडा", category: "input" },
      { text: "गोदाम नियोजन", category: "nav" },
      { text: "इंग्रजी करा", category: "ui" },
    ],
    gu: [
      { text: "બજાર ભાવ ખોલો", category: "nav" },
      { text: "કપાસ પસંદ કરો", category: "input" },
      { text: "વેરહાઉસ સંગ્રહ", category: "nav" },
      { text: "હિન્દી કરો", category: "ui" },
    ],
  }[locale] || [
    { text: "Open Mandi Prices", category: "nav" },
    { text: "Filter Cotton", category: "input" },
    { text: "Open Storage", category: "nav" },
  ];

  if (!isSupported) {
    return null; // Gracefully hidden if browser doesn't support Web Speech
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case "navigation":
        return <Compass className="w-3.5 h-3.5 text-harvest-400" />;
      case "form_input":
        return <SlidersHorizontal className="w-3.5 h-3.5 text-signal-good" />;
      case "ui_state":
        return <Layers className="w-3.5 h-3.5 text-blue-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-harvest-400" />;
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-2xl">
      <div
        className={`rounded-2xl bg-canopy-950/95 backdrop-blur-md text-white border border-canopy-700/80 shadow-2xl transition-all duration-300 p-3 sm:p-3.5 ${
          isListening ? "ring-2 ring-harvest-400/80 shadow-harvest-500/20" : ""
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          {/* Mic Button & Wave Visualizer */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={toggleListening}
              className={`relative flex items-center justify-center w-11 h-11 rounded-xl font-bold transition-all shadow-md ${
                isListening
                  ? "bg-signal-bad text-white animate-pulse"
                  : "bg-harvest-500 hover:bg-harvest-400 text-canopy-950"
              }`}
              title={isListening ? "Stop Listening" : "Start Voice Command"}
              aria-label="Voice Command Mic"
            >
              {isListening ? (
                <MicOff className="w-5 h-5 animate-bounce" />
              ) : (
                <Mic className="w-5 h-5" />
              )}

              {isListening && (
                <span className="absolute -inset-1 rounded-xl bg-signal-bad/30 animate-ping pointer-events-none" />
              )}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-harvest-300 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-harvest-400" />
                  {t("voiceCommandTitle", "Voice Command HUD")}
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                    isListening
                      ? "bg-signal-bad/20 text-signal-bad border border-signal-bad/40"
                      : "bg-canopy-800 text-soil-300"
                  }`}
                >
                  {isListening ? "Listening..." : "Ready"}
                </span>
              </div>
              <p className="text-[11px] text-soil-300 truncate max-w-[180px] sm:max-w-xs">
                {isListening
                  ? transcript || "Speak: e.g. 'Open Mandi', 'Filter Cotton'..."
                  : lastMatched?.label
                  ? `Executed: ${lastMatched.label}`
                  : "Tap mic or say command to navigate & control"}
              </p>
            </div>
          </div>

          {/* Controls: Audio synthesis toggle, Help, Minimize */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={() => setSpeechFeedbackEnabled(!speechFeedbackEnabled)}
              className={`p-2 rounded-lg border transition-colors ${
                speechFeedbackEnabled
                  ? "bg-canopy-800 text-harvest-300 border-canopy-700"
                  : "bg-canopy-900 text-soil-500 border-canopy-800"
              }`}
              title={speechFeedbackEnabled ? "Mute Voice Feedback" : "Enable Voice Feedback"}
            >
              {speechFeedbackEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => setShowHelp(!showHelp)}
              className={`p-2 rounded-lg border transition-colors ${
                showHelp
                  ? "bg-harvest-500 text-canopy-950 border-harvest-400"
                  : "bg-canopy-800 text-soil-300 border-canopy-700 hover:text-white"
              }`}
              title="Voice Commands Guide"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <button
              onClick={() => setMinimized(!minimized)}
              className="p-2 rounded-lg bg-canopy-800 text-soil-300 border border-canopy-700 hover:text-white sm:hidden"
              title="Toggle Size"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Feedback Toast if command executed recently */}
        {lastMatched && !minimized && (
          <div className="mt-2.5 pt-2 border-t border-canopy-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="p-1 rounded bg-canopy-800 shrink-0">
                {getCategoryIcon(lastMatched.category)}
              </span>
              <span className="font-semibold text-harvest-300 shrink-0">
                {lastMatched.label}:
              </span>
              <span className="text-soil-200 truncate text-[11px]">
                {lastMatched.feedbackText}
              </span>
            </div>
          </div>
        )}

        {/* Error notice if speech error occurred */}
        {recognitionError && (
          <div className="mt-2 text-[11px] text-signal-bad bg-signal-bad/10 px-2 py-1 rounded border border-signal-bad/20">
            Microphone notice: {recognitionError}
          </div>
        )}

        {/* Quick Suggestion Chips (Voice & Clickable) */}
        {!minimized && (
          <div className="mt-2.5 pt-2 border-t border-canopy-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] uppercase font-bold text-soil-400 shrink-0 mr-1">
              Say or Tap:
            </span>
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                onClick={() => processSpokenText(item.text)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-canopy-800/80 hover:bg-canopy-700 text-soil-200 hover:text-harvest-300 border border-canopy-700/60 transition-all shrink-0 active:scale-95"
              >
                <span>{item.text}</span>
                <ArrowRight className="w-2.5 h-2.5 text-harvest-400 opacity-60" />
              </button>
            ))}
          </div>
        )}

        {/* Help Modal / Drawer */}
        {showHelp && (
          <div className="mt-3 pt-3 border-t border-canopy-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-harvest-400 uppercase tracking-wider text-[11px]">
                Voice Command Mapping System
              </span>
              <button
                onClick={() => setShowHelp(false)}
                className="text-soil-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="p-2 rounded bg-canopy-900 border border-canopy-800">
                <strong className="text-harvest-300 block mb-1">🧭 Navigation</strong>
                <p className="text-soil-300">
                  "Open Mandi Prices", "Dashboard", "Quality Grading", "Storage Planner", "Transport"
                </p>
              </div>
              <div className="p-2 rounded bg-canopy-900 border border-canopy-800">
                <strong className="text-signal-good block mb-1">📝 Form Inputs</strong>
                <p className="text-soil-300">
                  "Filter Cotton", "Select Onion", "Hold 45 Days", "Select Tractor", "Search Anand"
                </p>
              </div>
              <div className="p-2 rounded bg-canopy-900 border border-canopy-800">
                <strong className="text-blue-400 block mb-1">⚙️ UI State Changes</strong>
                <p className="text-soil-300">
                  "Switch to Hindi", "ગુજરાતી કરો", "Take photo", "Sync prices", "Close modal"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
