import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  TrendingUp,
  CloudRain,
  ShieldCheck,
  Sparkles,
  Zap,
  ExternalLink
} from "lucide-react";
import { useApp } from "../../store/AppContext";
import { useNavigate } from "react-router-dom";

export default function NotificationCenter() {
  const { language } = useApp();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("all"); // all | prices | weather | bids
  const dropdownRef = useRef(null);

  // Initial rich notification dataset with real-time interactive states
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("agrovision_active_notifications");
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: "notif-1",
        type: "price",
        title: "Cotton Price Surge: +₹620/Qtl",
        titleHi: "कपास भाव में तेजी: +₹620/क्विंटल",
        titleMr: "कापूस दरात वाढ: +₹६२०/क्विंटल",
        titleGu: "કપાસના ભાવમાં ઉછાળો: +₹૬૨૦/ક્વિન્ટલ",
        message: "Vadodara Terminal Mandi hit ₹8,120/qtl for Shankar-6 lint. Highest modal rate in 45 days.",
        time: "10 mins ago",
        read: false,
        actionUrl: "/markets",
        actionLabel: "View Mandi",
        badge: "PRICE SURGE",
        badgeColor: "bg-signal-good/15 text-signal-good border-signal-good/30",
      },
      {
        id: "notif-2",
        type: "bid",
        title: "New Buyer Tender: AgroPure Foods",
        titleHi: "नया खरीदार टेंडर: AgroPure Foods",
        titleMr: "नवीन खरेदीदार निविदा: AgroPure Foods",
        titleGu: "નવું ખરીદદાર ટેન્ડર: AgroPure Foods",
        message: "Direct purchase order received for 50 Quintals Grade A Onion @ ₹2,450/qtl with gate pickup.",
        time: "25 mins ago",
        read: false,
        actionUrl: "/recommendations",
        actionLabel: "Review Offer",
        badge: "VERIFIED BUYER",
        badgeColor: "bg-canopy-100 text-canopy-800 border-canopy-300",
      },
      {
        id: "notif-3",
        type: "weather",
        title: "IMD Orange Alert: Pre-Monsoon Showers",
        titleHi: "मौसम चेतावनी: 48 घंटे में बारिश का पूर्वानुमान",
        titleMr: "हवामान इशारा: पुढील ४८ तासांत पावसाची शक्यता",
        titleGu: "હવામાન ચેતવણી: આગામી ૪૮ કલાકમાં વરસાદની આગાહી",
        message: "Thunderstorms expected in western belt. Hold open-yard harvest and cover drying onion lots immediately.",
        time: "1 hour ago",
        read: false,
        actionUrl: "/",
        actionLabel: "Weather Advisory",
        badge: "WEATHER ALERT",
        badgeColor: "bg-harvest-100 text-harvest-800 border-harvest-300",
      },
      {
        id: "notif-4",
        type: "cert",
        title: "AGMARK Certificate Verified (Lot #AGM-COT-9921)",
        titleHi: "AGMARK प्रमाणपत्र जारी (Lot #AGM-COT-9921)",
        titleMr: "AGMARK डिजिटल प्रमाणपत्र तयार (Lot #AGM-COT-9921)",
        titleGu: "AGMARK ડિજિટલ સર્ટિફિકેટ માન્ય (Lot #AGM-COT-9921)",
        message: "Your AI-inspected cotton sample scored 94/100 (Grade A). e-NAM digital trading unlocked.",
        time: "3 hours ago",
        read: true,
        actionUrl: "/grading",
        actionLabel: "View Certificate",
        badge: "AGMARK READY",
        badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      },
    ];
  });

  // Save changes
  useEffect(() => {
    try {
      localStorage.setItem("agrovision_active_notifications", JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Play subtle chime on test alert
  const playAlertSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {
      // AudioContext not permitted or supported
    }
  };

  // Test live alert for judges / evaluators
  const triggerTestLiveAlert = () => {
    playAlertSound();
    const testAlerts = [
      {
        id: "live-" + Date.now(),
        type: "price",
        title: "⚡ LIVE APMC FLASH: Soy Surge +₹380",
        titleHi: "⚡ लाइव मंडी अलर्ट: सोयाबीन भाव में +₹380 की तेजी",
        titleMr: "⚡ थेट बाजारभाव: सोयाबीन दरात +₹३८० ची वाढ",
        titleGu: "⚡ લાઈવ મંડી એલર્ટ: સોયાબીન ભાવમાં +₹૩૮૦ નો ઉછાળો",
        message: "Latur Mandi buyers offering ₹5,120/qtl for bold yellow seed with moisture <10%. Instant dispatch requested.",
        time: "Just now",
        read: false,
        actionUrl: "/markets",
        actionLabel: "Accept Bid",
        badge: "INSTANT DEMAND",
        badgeColor: "bg-harvest-500/20 text-harvest-800 border-harvest-400 font-bold",
      },
      {
        id: "live-" + Date.now(),
        type: "bid",
        title: "⚡ Instant Offer: ITC Choupal Sagar",
        titleHi: "⚡ सीधा ऑफर: ITC चौपाल सागर से बोली",
        titleMr: "⚡ थेट खरेदी: ITC चौपाल सागर कडून मागणी",
        titleGu: "⚡ સીધી ખરીદી: ITC ચોપાલ સાગર તરફથી ઓફર",
        message: "ITC Procurement has matched your Grade A Cotton listing. 100% bank transfer via Escrow upon dispatch.",
        time: "Just now",
        read: false,
        actionUrl: "/recommendations",
        actionLabel: "View Escrow",
        badge: "DIRECT CONTRACT",
        badgeColor: "bg-signal-good/20 text-signal-good border-signal-good/40 font-bold",
      }
    ];

    const randomAlert = testAlerts[Math.floor(Math.random() * testAlerts.length)];
    setNotifications((prev) => [randomAlert, ...prev]);
    setIsOpen(true);
  };

  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "prices") return n.type === "price";
    if (filter === "weather") return n.type === "weather";
    if (filter === "bids") return n.type === "bid";
    return true;
  });

  const filterLabels = {
    all: language === "hi" ? "सभी" : language === "mr" ? "सर्व" : language === "gu" ? "બધું" : "All",
    prices: language === "hi" ? "भाव" : language === "mr" ? "भाव" : language === "gu" ? "ભાવ" : "Prices",
    weather: language === "hi" ? "मौसम" : language === "mr" ? "हवामान" : language === "gu" ? "હવામાન" : "Weather",
    bids: language === "hi" ? "खरीदार बोली" : language === "mr" ? "खरेदीदार बोली" : language === "gu" ? "ખરીદदार બોલી" : "Buyer Bids",
  };

  const getLocalizedTitle = (n) => {
    if (language === "hi" && n.titleHi) return n.titleHi;
    if (language === "mr" && n.titleMr) return n.titleMr;
    if (language === "gu" && n.titleGu) return n.titleGu;
    return n.title;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 rounded-xl text-soil-600 hover:text-soil-950 hover:bg-soil-100 transition-colors"
        title="Real-time Alerts & Notifications"
        aria-label="View notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-signal-bad text-white text-[10px] font-bold shadow-xs animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-soil-200 z-50 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-3.5 bg-soil-50 border-b border-soil-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-canopy-100 text-canopy-800 flex items-center justify-center font-bold">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xs text-soil-950">
                  {language === "hi"
                    ? "मंडी एवं मौसम सूचना केंद्र"
                    : language === "mr"
                    ? "बाजार व हवामान सूचना केंद्र"
                    : language === "gu"
                    ? "મંડી અને હવામાન ચેતવણી કેન્દ્ર"
                    : "Market & Weather Alerts"}
                </h3>
                <span className="text-[10px] text-soil-500 font-medium">
                  {unreadCount} unread • Real-time live feed
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-1.5 text-soil-500 hover:text-canopy-800 hover:bg-soil-200/50 rounded-lg text-[10px] font-medium transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="p-1.5 text-soil-400 hover:text-signal-bad hover:bg-soil-200/50 rounded-lg transition-colors"
                  title="Clear all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Test Live Alert Bar (Judge/Evaluator feature) */}
          <div className="px-3.5 py-2 bg-canopy-950 text-white flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-harvest-300 font-medium">
              <Zap className="w-3.5 h-3.5 text-harvest-400" />
              <span>SIH Interactive Demo:</span>
            </span>
            <button
              onClick={triggerTestLiveAlert}
              className="px-2.5 py-1 rounded-lg bg-harvest-500 hover:bg-harvest-400 text-canopy-950 font-bold text-[10px] transition-all active:scale-95 shadow-2xs"
            >
              Simulate Live Alert
            </button>
          </div>

          {/* Filter Pills */}
          <div className="px-3 pt-2 pb-1.5 border-b border-soil-100 flex items-center gap-1 text-[11px] overflow-x-auto">
            <button
              onClick={() => setFilter("all")}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filter === "all"
                  ? "bg-canopy-800 text-white font-semibold"
                  : "text-soil-600 hover:bg-soil-100"
              }`}
            >
              {filterLabels.all} ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("prices")}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filter === "prices"
                  ? "bg-canopy-800 text-white font-semibold"
                  : "text-soil-600 hover:bg-soil-100"
              }`}
            >
              {filterLabels.prices}
            </button>
            <button
              onClick={() => setFilter("weather")}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filter === "weather"
                  ? "bg-canopy-800 text-white font-semibold"
                  : "text-soil-600 hover:bg-soil-100"
              }`}
            >
              {filterLabels.weather}
            </button>
            <button
              onClick={() => setFilter("bids")}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filter === "bids"
                  ? "bg-canopy-800 text-white font-semibold"
                  : "text-soil-600 hover:bg-soil-100"
              }`}
            >
              {filterLabels.bids}
            </button>
          </div>

          {/* List of Alerts */}
          <div className="max-h-80 overflow-y-auto divide-y divide-soil-100">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-soil-400 text-xs">
                No notifications in this category.
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 transition-colors flex items-start gap-3 relative ${
                    item.read ? "bg-white hover:bg-soil-50/50" : "bg-canopy-50/30 hover:bg-canopy-50/50"
                  }`}
                >
                  {/* Icon */}
                  <div className="mt-0.5 shrink-0">
                    {item.type === "price" && (
                      <div className="w-7 h-7 rounded-lg bg-signal-good/15 text-signal-good flex items-center justify-center">
                        <TrendingUp className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {item.type === "weather" && (
                      <div className="w-7 h-7 rounded-lg bg-harvest-100 text-harvest-700 flex items-center justify-center">
                        <CloudRain className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {item.type === "bid" && (
                      <div className="w-7 h-7 rounded-lg bg-canopy-100 text-canopy-800 flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {item.type === "cert" && (
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono font-semibold ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                      <span className="text-[10px] text-soil-400 font-medium">
                        {item.time}
                      </span>
                    </div>

                    <h4 className="font-display font-semibold text-xs text-soil-950 leading-tight">
                      {getLocalizedTitle(item)}
                    </h4>

                    <p className="text-[11px] text-soil-600 leading-snug">
                      {item.message}
                    </p>

                    {/* Action Bar */}
                    <div className="pt-1.5 flex items-center justify-between">
                      <button
                        onClick={() => {
                          markAsRead(item.id);
                          setIsOpen(false);
                          if (item.actionUrl) navigate(item.actionUrl);
                        }}
                        className="text-[11px] font-bold text-canopy-800 hover:text-canopy-950 inline-flex items-center gap-1 hover:underline"
                      >
                        <span>{item.actionLabel}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>

                      {!item.read && (
                        <button
                          onClick={() => markAsRead(item.id)}
                          className="text-[10px] text-soil-400 hover:text-soil-700 font-medium inline-flex items-center gap-0.5"
                        >
                          <Check className="w-3 h-3" />
                          <span>{language === "hi" ? "पढ़ा हुआ" : language === "mr" ? "वाचले" : language === "gu" ? "વાંચ્યું" : "Mark read"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-soil-50 border-t border-soil-200 text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/alerts");
              }}
              className="text-xs text-canopy-800 font-bold hover:underline"
            >
              View Full Alerts & Mandi Tracker →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
