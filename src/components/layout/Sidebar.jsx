import React from "react";
import { NavLink } from "react-router-dom";
import { X, Camera, Sparkles, ShieldCheck } from "lucide-react";
import { navItems } from "./navConfig";
import { useApp } from "../../store/AppContext";

export default function Sidebar({ isOpen, onClose }) {
  const { t, openGradingModal, language } = useApp();

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-emerald-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-emerald-900 text-emerald-50 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-emerald-700/60 shadow-xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="h-16 px-5 flex items-center justify-between border-b border-emerald-800/80 bg-emerald-950/30">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#e4b86d] to-[#d49a42] text-emerald-950 flex items-center justify-center font-bold shadow-md">
                🌾
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-base text-white tracking-tight">
                  {t("appName")}
                </span>
                <span className="text-[10px] text-emerald-200 font-medium">
                  {t("tagline")}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-emerald-200 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-3">
            <div className="p-3 rounded-2xl bg-emerald-800/60 border border-emerald-700/80 flex flex-col gap-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-harvest-300 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-harvest-300" />
                  AI Vision
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/50 text-emerald-200 font-mono">
                  AGMARK
                </span>
              </div>
              <p className="text-[11px] text-emerald-100 leading-snug">
                {language === "hi"
                  ? "कैमरे से फसल की फोटो लें और गुणवत्ता जांचें"
                  : language === "mr"
                  ? "कॅमेऱ्याने मालाचा फोटो काढून प्रतवारी तपासा"
                  : language === "gu"
                  ? "કેમેરાથી પાકની તસવીર લો અને ગુણવત્તા ચકાસો"
                  : "Photograph produce to get instant quality grade & mandi price premium."}
              </p>
              <button
                onClick={() => {
                  openGradingModal();
                  if (onClose) onClose();
                }}
                className="w-full mt-1 py-1.5 px-3 rounded-xl bg-harvest-500 hover:bg-harvest-400 text-emerald-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{t("gradeProduceButton")}</span>
              </button>
            </div>
          </div>

          <nav className="px-3 py-1 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] scrollbar-thin">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => {
                    if (onClose) onClose();
                  }}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-emerald-700/80 text-white shadow-sm border border-emerald-500/40 ring-1 ring-emerald-400/30"
                        : "text-emerald-100 hover:bg-emerald-800/70 hover:text-white"
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{t(item.key)}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-950/60 text-harvest-300 border border-emerald-600/40 font-bold">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-emerald-800/80 bg-emerald-950/40">
          <div className="flex items-center justify-between text-[11px] text-emerald-200">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              e-NAM & APMC Link
            </span>
            <span className="font-mono text-[10px] text-harvest-300 uppercase font-bold">
              {language}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}

