import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  User,
  X,
  ShieldCheck,
  Compass,
  ArrowRight,
  Sparkles,
  Camera,
  Store,
  Truck,
  CloudSun,
  FileText
} from "lucide-react";
import { useApp } from "../../store/AppContext";
import { getVoiceLanguage, getPreferredSpeechVoice, normalizeLanguageCode } from "../../store/AppContext";
import aiAgentAvatar from "../../assets/ai.png";

export default function KrishiMitraChatModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const {
    currentUser,
    language,
    setLanguage,
    t,
    openGradingModal,
    activeCrop
  } = useApp();

  const [messages, setMessages] = useState(() => [
    {
      id: "msg-welcome",
      sender: "ai",
      text:
        language === "hi"
          ? `नमस्ते ${currentUser?.name || "किसान"} जी! 🙏 मैं 'कृषि जार्विस AI' हूँ — आपका वॉयस नेविगेटर व कृषि विशेषज्ञ। बोलें "मंडी खोलो", "कैमरा खोलो", "गोदाम दिखाओ", "मौसम बताओ" या कोई भी सवाल पूछें!`
          : language === "mr"
          ? `नमस्कार ${currentUser?.name || "शेतकरी"} जी! 🙏 मी 'कृषी जार्व्हिस AI' आहे — आपला व्हॉइस नेव्हिगेटर व सल्लागार. "मंडी दाखवा", "कॅमेरा उघडा", "गोदाम उघडा", "हवामान सांगा" असे बोला आणि मी ते त्वरित उघडेन!`
          : language === "gu"
          ? `નમસ્તે ${currentUser?.name || "ખેડૂત"} જી! 🙏 હું 'કૃષિ જાર્વિસ AI' છું — તમારો વૉઇસ નેવિગેટર અને સલાહકાર. "બજાર ખોલો", "કૅમેરા ખોલો", "વેરહાઉસ બતાવો", "હવામાન કેવું છે" બોલો અને તે જાતે જ ખુલી જશે!`
          : `Namaste ${currentUser?.name || "Farmer"} ji! 🙏 I am 'Krishi Jarvis AI' — your voice-activated navigator & agronomist. Say "Open Mandi", "Open Camera", "Check Storage", "Weather forecast" or ask any question!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState("");
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [lastExecutedAction, setLastExecutedAction] = useState(null);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, speechTranscript]);

  // Clean up speech synthesis on unmount or close
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Quick Jarvis Voice Action Prompts
  const quickVoiceActions = [
    {
      label: language === "hi" ? "मंडी खोलो" : language === "mr" ? "बाजार उघडा" : language === "gu" ? "બજાર ખોલો" : "Open Mandi",
      command: language === "hi" ? "मंडी खोलो" : language === "mr" ? "मंडी उघडा" : language === "gu" ? "બજાર ભાવ ખોલો" : "Open Mandi",
      icon: Store,
    },
    {
      label: language === "hi" ? "कैमरा खोलो" : language === "mr" ? "कॅमेरा सुरू करा" : language === "gu" ? "કૅમેરા ખોલો" : "Grade Produce",
      command: language === "hi" ? "कैमरा खोलो" : language === "mr" ? "कॅमेरा उघडा" : language === "gu" ? "કૅમેરા ગ્રેડિંગ ખોલો" : "Open Camera",
      icon: Camera,
    },
    {
      label: language === "hi" ? "मौसम बताओ" : language === "mr" ? "हवामान सांगा" : language === "gu" ? "હવામાન બતાવો" : "Weather Forecast",
      command: language === "hi" ? "आज का मौसम बताओ" : language === "mr" ? "हवामान सांगा" : language === "gu" ? "આજનું હવામાન કેવું છે" : "Check Weather",
      icon: CloudSun,
    },
    {
      label: language === "hi" ? "गोदाम देखो" : language === "mr" ? "गोदाम उघडा" : language === "gu" ? "વેરહાઉસ જુઓ" : "Storage Planner",
      command: language === "hi" ? "गोदाम स्टोरेज खोलो" : language === "mr" ? "गोदाम दाखवा" : language === "gu" ? "વેરહાઉસ ખોલો" : "Open Storage",
      icon: ShieldCheck,
    },
    {
      label: language === "hi" ? "गाड़ी बुक करो" : language === "mr" ? "वाहतूक बुक करा" : language === "gu" ? "વાહન બુક કરો" : "Book Transport",
      command: language === "hi" ? "ट्रांसपोर्ट खोलो" : language === "mr" ? "वाहतूक उघडा" : language === "gu" ? "પરિવહન ખોલો" : "Open Transport",
      icon: Truck,
    },
    {
      label: language === "hi" ? "फसल बुवाई" : language === "mr" ? "पीक पेरणी" : language === "gu" ? "પાક વાવેતર" : "Crop Sowing",
      command: language === "hi" ? "फसल बुवाई और खाद की सलाह" : language === "mr" ? "पीक पेरणी व खतांचा सल्ला" : language === "gu" ? "પાક વાવેતર અને ખાતર ભલામણ" : "AI Crop Sowing",
      icon: Sparkles,
    },
    {
      label: language === "hi" ? "रिपोर्ट दिखाओ" : language === "mr" ? "अहवाल दाखवा" : language === "gu" ? "ઓડિટ અહેવાલ" : "Show Reports",
      command: language === "hi" ? "ऑडिट रिपोर्ट दिखाओ" : language === "mr" ? "अहवाल दाखवा" : language === "gu" ? "ઓડિટ રિપોર્ટ બતાવો" : "Show Reports",
      icon: FileText,
    },
  ];

  // Speech Recognition (Web Speech API)
  const toggleVoiceRecognition = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use Google Chrome or Edge.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.lang = getVoiceLanguage(language);
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechTranscript("");
      };

      recognition.onresult = (event) => {
        let interim = "";
        let final = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const text = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += text;
          } else {
            interim += text;
          }
        }
        const current = final || interim;
        setSpeechTranscript(current);
        if (final) {
          setInputText(final);
          handleProcessCommand(final, true);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn("Recognition start failed:", err);
      setIsListening(false);
    }
  };

  // Text to Speech (Web Speech API)
  const speakMessage = (msgId, text) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/[*_#`[\]()]/g, "")
      .replace(/\n+/g, ". ");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const speechLanguage = normalizeLanguageCode(language);
    const preferredVoice = getPreferredSpeechVoice(speechLanguage);

    utterance.lang = getVoiceLanguage(speechLanguage);
    utterance.rate = 0.95;
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setSpeakingMessageId(msgId);
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    window.speechSynthesis.speak(utterance);
  };

  // Execute an action triggered by Jarvis voice
  const executeJarvisAction = (action) => {
    if (!action) return;
    setLastExecutedAction(action);

    if (action.type === "NAVIGATE" && action.target) {
      navigate(action.target);
      // Briefly show notice and keep modal open or close based on context
      setTimeout(() => {
        onClose();
      }, 1400);
    } else if (action.type === "OPEN_GRADING") {
      onClose();
      setTimeout(() => {
        openGradingModal();
      }, 300);
    } else if ((action.type === "SWITCH_LANGUAGE" && action.lang) || (action.type === "SET_LANGUAGE" && action.target)) {
      setLanguage(action.lang || action.target);
    } else if (action.type === "REFRESH_PRICES") {
      navigate("/markets");
    } else if (action.type === "CHECK_WEATHER") {
      navigate("/alerts");
    }
  };

  // Process command through Jarvis voice backend
  const handleProcessCommand = async (commandToSend = null, autoSpeak = false) => {
    const query = (commandToSend || inputText).trim();
    if (!query || isLoading) return;

    setInputText("");
    setSpeechTranscript("");
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    }

    const userMsg = {
      id: "usr-" + Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // First try the Jarvis Command Engine
      const jarvisRes = await fetch("/api/jarvis/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: query,
          language,
          activeCrop,
          farmerContext: {
            name: currentUser?.name,
            state: currentUser?.state,
            district: currentUser?.district || currentUser?.village,
            crops: currentUser?.primaryCrops || currentUser?.cropsManaged,
          },
        }),
      });

      const jarvisData = await jarvisRes.json();

      let botReply = "";
      let actionExecuted = null;

      if (jarvisData && jarvisData.success && (jarvisData.reply || jarvisData.spokenReply)) {
        botReply = jarvisData.reply || jarvisData.spokenReply;
        if (jarvisData.action) {
          actionExecuted = jarvisData.action;
          executeJarvisAction(jarvisData.action);
        }
      } else {
        // Fallback to agri-chat endpoint
        const chatRes = await fetch("/api/agri-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: query,
            language,
            farmerContext: {
              name: currentUser?.name,
              state: currentUser?.state,
              district: currentUser?.district || currentUser?.village,
              crops: currentUser?.primaryCrops || currentUser?.cropsManaged,
            },
          }),
        });
        const chatData = await chatRes.json();
        botReply = chatData.reply || "Advice recorded. Consult local Krishi Vigyan Kendra.";
      }

      const aiMsg = {
        id: "ai-" + Date.now(),
        sender: "ai",
        text: botReply,
        action: actionExecuted,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Automatically speak Jarvis reply
      if (autoSpeak || commandToSend) {
        const spokenExcerpt = botReply.split("\n")[0] || botReply;
        speakMessage(aiMsg.id, spokenExcerpt);
      }
    } catch (err) {
      console.warn("Jarvis command failed:", err);
      const fallbackMsg = {
        id: "ai-" + Date.now(),
        sender: "ai",
        text:
          language === "hi"
            ? "आदेश स्वीकार किया गया। आप शीर्ष मेनू से सीधे मंडी भाव, ग्रेडिंग या गोदाम खोल सकते हैं।"
            : language === "mr"
            ? "आदेश स्वीकारला. आपण मेनूमधून थेट बाजारभाव, प्रतवारी किंवा गोदाम उघडू शकता."
            : language === "gu"
            ? "આદેશ સ્વીકાર્યો. તમે ઉપરના મેનુમાંથી સીધા જ બજાર ભાવ, ગ્રેડિંગ કે વેરહાઉસ ખોલી શકો છો."
            : "Command accepted. You can also directly open Mandi prices, Grading camera, or Storage planner from the navigation.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-soil-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-soil-200 flex flex-col h-[90vh] sm:h-[680px] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-canopy-950 text-white flex items-center justify-between border-b border-canopy-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-harvest-400 shadow-md bg-soil-900 flex items-center justify-center">
                <img
                  src={aiAgentAvatar}
                  alt="Krishi Jarvis AI"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-signal-good border-2 border-canopy-950 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base text-white tracking-tight">
                  {t("jarvisVoiceTitle", "Krishi Jarvis AI")}
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-harvest-400/20 text-harvest-300 border border-harvest-400/40">
                  <Sparkles className="w-2.5 h-2.5 text-harvest-400" />
                  VOICE NAVIGATED
                </span>
              </div>
              <p className="text-xs text-soil-300">
                {t("jarvisVoiceSubtitle", "Say 'Open Mandi', 'Open Camera', 'Check Weather', or ask any query.")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Multi-language Selector */}
            <div className="flex items-center bg-canopy-900/90 rounded-xl p-0.5 border border-canopy-700 text-xs shadow-inner">
              <button
                onClick={() => setLanguage("en")}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  language === "en" ? "bg-white text-canopy-950 font-bold shadow-xs" : "text-soil-300 hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("hi")}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  language === "hi" ? "bg-white text-canopy-950 font-bold shadow-xs" : "text-soil-300 hover:text-white"
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLanguage("mr")}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  language === "mr" ? "bg-white text-canopy-950 font-bold shadow-xs" : "text-soil-300 hover:text-white"
                }`}
              >
                मराठी
              </button>
              <button
                onClick={() => setLanguage("gu")}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  language === "gu" ? "bg-white text-canopy-950 font-bold shadow-xs" : "text-soil-300 hover:text-white"
                }`}
              >
                ગુજરાતી
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-soil-400 hover:text-white hover:bg-canopy-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Farmer Context & Voice Status Banner */}
        <div className="px-4 py-2 bg-soil-100/80 border-b border-soil-200 flex items-center justify-between text-[11px] text-soil-700 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-soil-900">{currentUser?.name}</span>
            <span>•</span>
            <span>{currentUser?.village || currentUser?.district}, {currentUser?.state}</span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-canopy-800">
            <Compass className="w-3.5 h-3.5 text-canopy-600 animate-spin" />
            <span>Jarvis Voice Engine Active</span>
          </div>
        </div>

        {/* Action Executed Banner */}
        {lastExecutedAction && (
          <div className="px-4 py-2 bg-harvest-100 border-b border-harvest-300 text-xs font-semibold text-canopy-950 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-harvest-600" />
              <span>
                {t("jarvisActionRecognized", "Voice Command Executed")}: {lastExecutedAction.label || lastExecutedAction.type}
              </span>
            </div>
            <span className="text-[10px] text-canopy-800 uppercase tracking-wider">
              {t("jarvisNavigatingTo", "Navigating to")} {lastExecutedAction.target || "Requested Feature"}
            </span>
          </div>
        )}

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-soil-50/60">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "ai" && (
                <div className="w-9 h-9 rounded-xl overflow-hidden border border-harvest-300 shadow-xs shrink-0 mt-0.5 bg-canopy-950">
                  <img
                    src={aiAgentAvatar}
                    alt="Jarvis"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3.5 text-xs shadow-2xs ${
                  msg.sender === "user"
                    ? "bg-canopy-900 text-white rounded-tr-xs"
                    : "bg-white border border-soil-200 text-soil-900 rounded-tl-xs"
                }`}
              >
                {/* Message Content */}
                <div className="whitespace-pre-line leading-relaxed">
                  {msg.text}
                </div>

                {/* Optional Action Badge */}
                {msg.action && (
                  <div className="mt-2.5 p-2 rounded-xl bg-canopy-50 border border-canopy-200 flex items-center justify-between text-[11px] text-canopy-900 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-canopy-700" />
                      {msg.action.label || msg.action.type}
                    </span>
                    <span className="inline-flex items-center gap-1 text-canopy-700">
                      Open <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                )}

                {/* Footer Strip */}
                <div
                  className={`mt-2 pt-1.5 flex items-center justify-between text-[10px] ${
                    msg.sender === "user"
                      ? "text-canopy-200 border-t border-canopy-800/80"
                      : "text-soil-400 border-t border-soil-100"
                  }`}
                >
                  <span>{msg.timestamp}</span>

                  {msg.sender === "ai" && (
                    <button
                      onClick={() => speakMessage(msg.id, msg.text)}
                      className="flex items-center gap-1 font-semibold text-canopy-800 hover:text-canopy-950 px-2 py-0.5 rounded-md hover:bg-soil-100 transition-colors"
                      title="Listen with Text-to-Speech"
                    >
                      {speakingMessageId === msg.id ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-signal-bad" />
                          <span className="text-signal-bad">
                            {language === "hi" ? "आवाज़ रोकें" : language === "mr" ? "आवाज थांबवा" : language === "gu" ? "અવાજ અટકાવો" : "Stop"}
                          </span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-canopy-700" />
                          <span>
                            {language === "hi" ? "सुनें" : language === "mr" ? "ऐका" : language === "gu" ? "સાંભળો" : "Speak"}
                          </span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {msg.sender === "user" && (
                <div className="w-8 h-8 rounded-xl bg-harvest-500 text-canopy-950 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs shadow-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 items-center">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-harvest-300 bg-canopy-950 shrink-0">
                <img src={aiAgentAvatar} alt="Jarvis" className="w-full h-full object-cover animate-pulse" />
              </div>
              <div className="bg-white border border-soil-200 rounded-2xl px-4 py-3 text-xs text-soil-600 flex items-center gap-2 shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full bg-canopy-600 animate-ping" />
                <span>Jarvis is processing your command & fetching live data...</span>
              </div>
            </div>
          )}

          {/* Live Voice Speech Recognition Feedback */}
          {isListening && (
            <div className="p-3.5 rounded-2xl bg-harvest-100/90 border border-harvest-300 text-xs text-harvest-950 flex items-center gap-3 shadow-sm animate-pulse">
              <div className="w-3 h-3 rounded-full bg-signal-bad animate-ping" />
              <div className="flex-1 font-medium">
                {t("jarvisListening", "Listening... Speak your command")} ({language.toUpperCase()})
                {speechTranscript && (
                  <p className="font-bold text-soil-950 text-sm mt-0.5">"{speechTranscript}"</p>
                )}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Jarvis One-Tap Voice Actions Bar */}
        <div className="px-4 py-2.5 bg-white border-t border-soil-200 shrink-0 overflow-x-auto flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-soil-500 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-harvest-500" />
            Jarvis Actions:
          </span>
          {quickVoiceActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                onClick={() => handleProcessCommand(action.command, true)}
                className="px-3 py-1.5 rounded-xl text-xs bg-soil-100/80 hover:bg-canopy-900 hover:text-white text-soil-800 font-semibold border border-soil-200 whitespace-nowrap transition-all flex items-center gap-1.5 shadow-2xs hover:shadow-xs active:scale-95"
              >
                <Icon className="w-3.5 h-3.5 text-harvest-500" />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>

        {/* Chat Input & Voice Trigger Bar */}
        <div className="p-3 bg-white border-t border-soil-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleProcessCommand();
            }}
            className="flex items-center gap-2"
          >
            {/* Voice Mic Button (Jarvis Voice Trigger) */}
            <button
              type="button"
              onClick={toggleVoiceRecognition}
              className={`p-3 rounded-2xl border transition-all active:scale-95 shrink-0 shadow-sm ${
                isListening
                  ? "bg-signal-bad text-white border-signal-bad animate-pulse shadow-lg scale-105"
                  : "bg-harvest-500 hover:bg-harvest-400 text-canopy-950 border-harvest-400"
              }`}
              title={isListening ? "Stop listening" : "Tap to Speak (Jarvis Voice Navigation)"}
              aria-label="Voice Query"
            >
              {isListening ? (
                <MicOff className="w-5 h-5 text-white" />
              ) : (
                <Mic className="w-5 h-5 text-canopy-950" />
              )}
            </button>

            {/* Input Field */}
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                language === "hi"
                  ? "बोलें या लिखें: 'मंडी खोलो', 'कैमरा खोलो', 'मौसम बताओ'..."
                  : language === "mr"
                  ? "बोला किंवा लिहा: 'मंडी दाखवा', 'कॅमेरा उघडा', 'हवामान सांगा'..."
                  : language === "gu"
                  ? "બોલો અથવા લખો: 'બજાર ખોલો', 'કૅમેરા ખોલો', 'હવામાન બતાવો'..."
                  : "Say or type: 'Open Mandi', 'Open Camera', 'Check Weather'..."
              }
              className="flex-1 px-4 py-2.5 text-xs bg-soil-50 border border-soil-300 rounded-xl text-soil-900 placeholder:text-soil-400 focus:outline-none focus:bg-white focus:border-canopy-600 transition-all"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="px-4 py-2.5 rounded-xl bg-canopy-950 hover:bg-canopy-900 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-xs shrink-0"
              aria-label="Execute command"
            >
              <span>{language === "gu" ? "આદેશ આપો" : language === "hi" ? "आदेश दें" : language === "mr" ? "आदेश द्या" : "Execute"}</span>
              <Send className="w-3.5 h-3.5 text-harvest-400" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
