import React, { useState } from "react";
import { Mic, Sparkles } from "lucide-react";
import { useApp } from "../../store/AppContext";
import KrishiMitraChatModal from "./KrishiMitraChatModal";
import aiAgentAvatar from "../../assets/ai.png";

export default function KrishiMitraFloatingButton() {
  const { language } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const buttonLabel =
    language === "hi"
      ? "कृषि जार्विस AI"
      : language === "mr"
      ? "कृषी जार्व्हिस AI"
      : language === "gu"
      ? "કૃષિ જાર્વિસ AI"
      : "Krishi Jarvis AI";

  return (
    <>
      {/* Floating Trigger Widget */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xl border border-emerald-500/60 transition-all duration-200 hover:scale-105 active:scale-95 ring-2 ring-emerald-400/30 cursor-pointer"
          title="Krishi Jarvis AI - Voice Navigation & Advice"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-emerald-300 shadow-md bg-emerald-950 flex items-center justify-center">
              <img
                src={aiAgentAvatar}
                alt="Krishi Jarvis AI"
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border-2 border-emerald-900" />
            </span>
          </div>

          <div className="text-left hidden sm:block">
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-200 font-mono uppercase tracking-wider font-semibold">
              <Sparkles className="w-2.5 h-2.5 text-emerald-300 animate-pulse" />
              Voice Jarvis
            </span>
            <span className="block font-display text-xs font-bold text-white tracking-tight">
              {buttonLabel}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-emerald-900/80 text-emerald-200 group-hover:bg-emerald-500 group-hover:text-white transition-colors shadow-xs">
            <Mic className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* Modal Dialog */}
      <KrishiMitraChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
