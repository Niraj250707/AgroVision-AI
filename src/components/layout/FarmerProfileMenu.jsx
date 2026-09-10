import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  ChevronDown,
  Check,
  MapPin
} from "lucide-react";
import { useApp } from "../../store/AppContext";
import { farmerPersonas } from "../../data/farmerProfiles";

export default function FarmerProfileMenu() {
  const { currentUser, loginWithPersona, logout, t, language } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwitch = (personaId) => {
    loginWithPersona(personaId);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-soil-200 bg-white hover:bg-soil-50 transition-all text-left"
        aria-label="Farmer Profile Menu"
      >
        <div className="w-8 h-8 rounded-full bg-canopy-100 text-canopy-900 border border-canopy-200 flex items-center justify-center font-bold text-xs shrink-0">
          {currentUser.avatarInitials || "KP"}
        </div>
        <div className="hidden lg:flex flex-col min-w-0">
          <span className="text-xs font-bold text-soil-950 truncate">
            {language === "hi" || language === "mr" ? currentUser.nativeName : currentUser.name}
          </span>
          <span className="text-[10px] text-soil-500 truncate flex items-center gap-0.5">
            <MapPin className="w-2.5 h-2.5 text-canopy-600 shrink-0" />
            {currentUser.village}
          </span>
        </div>
        <ChevronDown className="w-3 h-3 text-soil-400 hidden sm:block" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-soil-200 py-2 z-40 animate-fadeIn">
          {/* Header section of dropdown */}
          <div className="px-4 py-3 border-b border-soil-100 bg-soil-50/70">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-soil-950">
                {currentUser.name}
              </span>
              <span className="text-[9px] bg-canopy-100 text-canopy-900 px-1.5 py-0.5 rounded font-semibold border border-canopy-200">
                {currentUser.badge || "Verified"}
              </span>
            </div>
            <p className="text-[11px] text-soil-600 mt-0.5">
              {currentUser.role}
            </p>
            <div className="mt-2 text-[11px] font-mono text-soil-500 bg-white p-2 rounded-lg border border-soil-200 space-y-1">
              <div className="flex justify-between">
                <span>e-NAM ID:</span>
                <span className="font-bold text-soil-800">{currentUser.enamId}</span>
              </div>
              <div className="flex justify-between">
                <span>KCC Limit:</span>
                <span className="font-bold text-signal-good">{currentUser.kccLimit}</span>
              </div>
              <div className="flex justify-between text-[10px] text-soil-400">
                <span>Bank:</span>
                <span className="truncate max-w-[140px]">{currentUser.kccBank}</span>
              </div>
            </div>
          </div>

          {/* Switch Farmer Section */}
          <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-soil-400">
            {t("switchFarmer")}
          </div>

          <div className="space-y-0.5 px-2">
            {farmerPersonas.map((persona) => {
              const isSelected = currentUser.id === persona.id;
              return (
                <button
                  key={persona.id}
                  onClick={() => handleSwitch(persona.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                    isSelected
                      ? "bg-canopy-50 text-canopy-900 font-semibold"
                      : "text-soil-700 hover:bg-soil-50"
                  }`}
                >
                  <div className="flex items-center gap-2 text-left min-w-0">
                    <div className="w-6 h-6 rounded-full bg-soil-200 text-soil-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {persona.avatarInitials}
                    </div>
                    <div className="truncate">
                      <span className="block truncate font-medium">
                        {persona.name}
                      </span>
                      <span className="text-[10px] text-soil-400 block truncate">
                        {persona.state} • {persona.cropsManaged.join(", ")}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-canopy-700 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Logout button */}
          <div className="pt-2 mt-2 border-t border-soil-100 px-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t("logout")}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
