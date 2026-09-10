import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Globe,
  Camera,
  Check,
  ChevronDown,
  UserCheck,
  Building2,
  Briefcase,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  CloudSun,
  Warehouse,
  Truck,
  Package,
  Sparkles,
  X
} from "lucide-react";
import { useApp } from "../../store/AppContext";
import FarmerProfileMenu from "./FarmerProfileMenu";
import NotificationCenter from "../notifications/NotificationCenter";
import PWAInstallButton from "../common/PWAInstallButton";

export default function TopHeader({ onMenuClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, t, openGradingModal, currentRole, switchRole } = useApp();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const langMenuRef = useRef(null);
  const roleMenuRef = useRef(null);
  const searchContainerRef = useRef(null);

  const languages = [
    { code: "en", label: "English", native: "English", region: "India" },
    { code: "hi", label: "Hindi", native: "हिन्दी", region: "भारत" },
    { code: "mr", label: "Marathi", native: "मराठी", region: "महाराष्ट्र" },
    { code: "gu", label: "Gujarati", native: "ગુજરાતી", region: "ગુજરાત" },
  ];

  const roles = [
    {
      id: "farmer",
      title: "Farmer (કિસાન)",
      sub: "Produce, Grading & Mandis",
      icon: UserCheck,
      color: "text-[#1c5240] bg-[#ebf5ef] border-[#cfe3d7]",
    },
    {
      id: "fpo",
      title: "FPO Collective",
      sub: "Aggregated Lots & Pooling",
      icon: Building2,
      color: "text-[#234d7a] bg-[#edf5ff] border-[#ceddf3]",
    },
    {
      id: "buyer",
      title: "Institutional Buyer",
      sub: "Millers, Exporters & Tenders",
      icon: Briefcase,
      color: "text-[#8c6321] bg-[#fff3dc] border-[#ead49a]",
    },
    {
      id: "admin",
      title: "APMC / Govt Nodal",
      sub: "MSP Compliance & Heatmaps",
      icon: ShieldAlert,
      color: "text-[#69439b] bg-[#f3ebff] border-[#d9caef]",
    },
  ];

  const currentRoleObj = roles.find((r) => r.id === currentRole) || roles[0];
  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  // Comprehensive Search Items
  const searchableItems = [
    { type: "crop", title: "Cotton (कपास / કપાસ)", sub: "₹7,820/qtl • Vadodara & Rajkot APMC", path: "/markets", icon: Package, keywords: ["cotton", "kapas", "કપાસ", "shankar", "रेशीम", "कापूस"] },
    { type: "crop", title: "Wheat (गेहूं / શરબતી ઘઉં)", sub: "₹2,650/qtl • Anand & Khanna APMC", path: "/markets", icon: Package, keywords: ["wheat", "gehu", "ઘઉં", "sharbati", "ગહું"] },
    { type: "crop", title: "Red Onion (कांदा / ડુંગળી)", sub: "₹3,200/qtl • Lasalgaon & Mahuva APMC", path: "/markets", icon: Package, keywords: ["onion", "kanda", "ડુંગળી", "લાલ ડુંગળી", "nashik"] },
    { type: "crop", title: "Soybean (सोयाबीन)", sub: "₹4,920/qtl • Indore & Latur APMC", path: "/markets", icon: Package, keywords: ["soybean", "soy", "सोयाबीन", "js-335"] },
    { type: "crop", title: "Tomato (टमाटर / ટામેટા)", sub: "₹2,680/qtl • Kolar & Surat APMC", path: "/markets", icon: Package, keywords: ["tomato", "tamatar", "ટામેટા"] },
    { type: "crop", title: "Potato (आलू / બટાકા)", sub: "₹1,560/qtl • Agra & Deesa APMC", path: "/markets", icon: Package, keywords: ["potato", "aloo", "બટાકા", "deesa"] },
    { type: "crop", title: "Mustard (सरसों / રાયડો)", sub: "₹5,450/qtl • Bharatpur & Alwar APMC", path: "/markets", icon: Package, keywords: ["mustard", "sarson", "રાયડો", "રાઈ"] },
    { type: "mandi", title: "Anand APMC Mandi", sub: "Local Anand Yard • 8 km from farm", path: "/markets", icon: TrendingUp, keywords: ["anand", "આણંદ", "apmc", "મંડી"] },
    { type: "mandi", title: "Vadodara Terminal Mandi", sub: "Surge Rate: ₹8,120/qtl for Cotton", path: "/markets", icon: TrendingUp, keywords: ["vadodara", "વડોદરા", "baroda"] },
    { type: "mandi", title: "Rajkot APMC", sub: "Highest modal rates in Saurashtra", path: "/markets", icon: TrendingUp, keywords: ["rajkot", "રાજકોટ"] },
    { type: "feature", title: "Weather & Rainfall Forecast", sub: "7-Day IMD Agromet & Rain Forecast", path: "/alerts", icon: CloudSun, keywords: ["weather", "rain", "forecast", "हवामान", "હવામાન", "વરસાદ", "alert"] },
    { type: "feature", title: "AI Crop Planting Recommendations", sub: "Soil Health & Seasonal Sowing Engine", path: "/recommendations", icon: Sparkles, keywords: ["recommend", "soil", "sowing", "planting", "વાવણી", "જમીન", "ખાતર"] },
    { type: "feature", title: "AI Produce Quality Grading", sub: "Instant AGMARK & e-NAM Camera Scan", path: "/grading", icon: Camera, keywords: ["grading", "camera", "quality", "तपासणी", "ગ્રેડિંગ", "કેમેરા"] },
    { type: "feature", title: "WDRA Warehouse Storage Planner", sub: "Pledge loan at 7% on e-NWR receipts", path: "/storage", icon: Warehouse, keywords: ["storage", "warehouse", "enwr", "ગોદામ", "વેરહાઉસ"] },
    { type: "feature", title: "Transport Distance & Gate Pass", sub: "Book tractor/truck and print QR pass", path: "/transport", icon: Truck, keywords: ["transport", "gatepass", "freight", "વાહન", "ભાડું"] },
  ];

  const filteredSearchResults = searchQuery.trim()
    ? searchableItems.filter((item) => {
        const q = searchQuery.toLowerCase().trim();
        return (
          item.title.toLowerCase().includes(q) ||
          item.sub.toLowerCase().includes(q) ||
          item.keywords.some((k) => k.toLowerCase().includes(q))
        );
      })
    : [];

  const handleSelectSearchItem = (path) => {
    setIsSearchOpen(false);
    setMobileSearchOpen(false);
    setSearchQuery("");
    navigate(path);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setLangMenuOpen(false);
      }
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target)) {
        setRoleMenuOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Map route to active title
  const getPageTitle = () => {
    const p = location.pathname;
    if (p === "/" || p === "") return language === "gu" ? "ડેશબોર્ડ" : language === "hi" ? "डैशबोर्ड" : language === "mr" ? "डॅशबोर्ड" : "Dashboard";
    if (p.startsWith("/grading")) return language === "gu" ? "ગુણવત્તા ગ્રેડિંગ" : language === "hi" ? "गुणवत्ता ग्रेडिंग" : "Quality Grading";
    if (p.startsWith("/recommendations")) return language === "gu" ? "AI પાક ભલામણો" : language === "hi" ? "AI सिफारिशें" : "AI Crop Recommendations";
    if (p.startsWith("/crops")) return language === "gu" ? "મારા પાક અને લોટ્સ" : language === "hi" ? "मेरी फसलें" : "My Harvested Crops";
    if (p.startsWith("/markets")) return language === "gu" ? "મંડી બજાર ભાવ" : language === "hi" ? "मंडी भाव" : "Mandi Market Prices";
    if (p.startsWith("/storage")) return language === "gu" ? "વેરહાઉસ સંગ્રહ પ્લાનર" : language === "hi" ? "भंडारण योजना" : "Storage & e-NWR";
    if (p.startsWith("/transport")) return language === "gu" ? "પરિવહન અને ગેટ પાસ" : language === "hi" ? "परिवहन और गेट पास" : "Transport Logistics";
    if (p.startsWith("/alerts")) return language === "gu" ? "હવામાન અને બજાર ચેતવણી" : language === "hi" ? "मौसम व मंडी अलर्ट" : "Weather & Market Alerts";
    if (p.startsWith("/reports")) return language === "gu" ? "નફા અહેવાલ" : language === "hi" ? "लाभ रिपोर्ट" : "Net Profit Reports";
    return "AgroVision AI";
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-emerald-700/20 bg-white/90 px-3 backdrop-blur-md sm:px-6 flex items-center justify-between gap-2 sm:gap-4 shadow-sm">
      {/* Left side: Hamburger for mobile + Active Section Badge + Search */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-xl" ref={searchContainerRef}>
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50"
          aria-label="Toggle Navigation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Current Active Section Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-bold shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{getPageTitle()}</span>
        </div>

        {/* Search Bar with live dropdown */}
        <div className="relative w-full hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-700/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder={language === "gu" ? "શોધો: કપાસ, ઘઉં, મંડી, હવામાન, સંગ્રહ..." : language === "hi" ? "खोजें: कपास, गेहूं, मंडी भाव, मौसम..." : "Search crops, mandis, weather, storage..."}
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-emerald-50/40 border border-emerald-200/70 rounded-xl text-soil-950 placeholder:text-soil-400 focus:outline-none focus:bg-white focus:border-emerald-600 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-soil-400 hover:text-soil-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Search Results Dropdown */}
          {isSearchOpen && searchQuery.trim() && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-emerald-100 py-2 z-50 animate-fadeIn max-h-96 overflow-y-auto">
              <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800/70 border-b border-soil-100 flex items-center justify-between">
                <span>{language === "gu" ? "શોધ પરિણામો" : language === "hi" ? "खोज परिणाम" : "Search Results"} ({filteredSearchResults.length})</span>
                <span className="text-[9px] text-soil-400 font-normal">Click to open</span>
              </div>

              {filteredSearchResults.length > 0 ? (
                <div className="p-1 space-y-0.5">
                  {filteredSearchResults.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectSearchItem(item.path)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-emerald-50 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-soil-900 group-hover:text-emerald-900">{item.title}</div>
                            <div className="text-[10px] text-soil-500">{item.sub}</div>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-soil-500">
                  {language === "gu" ? `"${searchQuery}" માટે કંઈ મળ્યું નથી. બીજો શબ્દ અજમાવો.` : `No direct match for "${searchQuery}". Try "Cotton", "Wheat", "Mandi", or "Weather".`}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Search Toggle Icon */}
        <button
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          className="md:hidden p-2 rounded-xl text-emerald-800 hover:bg-emerald-50"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Right side: SIH Role Switcher, Language Switcher, Camera Action, Alerts, Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* SIH Role Switcher Pill */}
        <div className="relative" ref={roleMenuRef}>
          <button
            onClick={() => setRoleMenuOpen((prev) => !prev)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-xl border transition-all shadow-sm ${currentRoleObj.color}`}
            title="Switch SIH User Role (Farmer / FPO / Buyer / Admin)"
          >
            <currentRoleObj.icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{currentRoleObj.title}</span>
            <span className="sm:hidden">{currentRole.toUpperCase()}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-2xl shadow-2xl border border-soil-200 py-1.5 z-40 animate-fadeIn">
              <div className="px-3.5 py-1.5 text-[10px] font-bold tracking-wider uppercase text-soil-400 border-b border-soil-100 flex items-center justify-between">
                <span>SIH26132 Role View</span>
                <span className="text-[9px] text-harvest-600 font-semibold">KrishiLink</span>
              </div>
              <div className="p-1 space-y-0.5">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = currentRole === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        switchRole(r.id);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                        isSelected ? "bg-canopy-50 text-canopy-950 font-bold" : "text-soil-700 hover:bg-soil-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg border ${r.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-soil-900">{r.title}</div>
                          <div className="text-[10px] text-soil-500">{r.sub}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-canopy-700" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Language Switcher Dropdown */}
        <div className="relative" ref={langMenuRef}>
          <button
            onClick={() => setLangMenuOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl border border-soil-200 bg-soil-50 hover:bg-soil-100/80 text-soil-800 transition-all shadow-2xs"
            aria-label="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-canopy-700" />
            <span className="font-medium text-soil-950">{currentLangObj.native}</span>
            <ChevronDown className="w-3 h-3 text-soil-400" />
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-soil-200 py-1 z-40 animate-fadeIn">
              <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase text-soil-400 border-b border-soil-100">
                {t("switchLanguage")} / ભાષા પસંદ કરો
              </div>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setLangMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                    language === lang.code
                      ? "bg-canopy-50 text-canopy-900 font-semibold"
                      : "text-soil-700 hover:bg-soil-50"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs">{lang.native}</span>
                    <span className="text-[10px] text-soil-400">{lang.label}</span>
                  </div>
                  {language === lang.code && (
                    <Check className="w-3.5 h-3.5 text-canopy-700" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PWA Install Button */}
        <PWAInstallButton />

        {/* Camera Produce Grading Primary CTA */}
        <button
          onClick={() => openGradingModal()}
          className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-bold rounded-xl bg-canopy-900 hover:bg-canopy-800 text-white shadow-xs transition-all active:scale-95 group"
          title="Grade produce using AI camera"
        >
          <Camera className="w-3.5 h-3.5 text-harvest-400 group-hover:rotate-12 transition-transform" />
          <span className="hidden md:inline">{t("gradeProduceButton")}</span>
          <span className="md:hidden">{t("quickScan")}</span>
        </button>

        {/* Interactive Working Notification Center */}
        <NotificationCenter />

        {/* Farmer Profile with interactive dropdown */}
        <FarmerProfileMenu />
      </div>

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-emerald-100 p-3 shadow-lg md:hidden z-50">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-700/60" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === "gu" ? "શોધો: કપાસ, ઘઉં, મંડી..." : "Search crops, mandis, weather..."}
              className="w-full pl-9 pr-8 py-2 text-xs bg-emerald-50/50 border border-emerald-200 rounded-xl text-soil-950 focus:outline-none focus:border-emerald-600"
            />
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-soil-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {searchQuery.trim() && (
            <div className="mt-2 bg-white rounded-xl border border-emerald-100 max-h-64 overflow-y-auto">
              {filteredSearchResults.length > 0 ? (
                filteredSearchResults.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectSearchItem(item.path)}
                      className="w-full flex items-center justify-between p-2 text-left border-b border-soil-50 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-emerald-700 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-soil-900">{item.title}</div>
                          <div className="text-[10px] text-soil-500">{item.sub}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                    </button>
                  );
                })
              ) : (
                <div className="p-3 text-center text-xs text-soil-500">No matches found.</div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}

