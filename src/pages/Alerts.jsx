import React from "react";
import {
  TrendingUp,
  CloudRain,
  Package,
  Clock,
  Sparkles
} from "lucide-react";
import { useApp } from "../store/AppContext";
import WeatherWarningWidget from "../components/weather/WeatherWarningWidget";

export default function Alerts() {
  const { t, marketAlerts, language } = useApp();

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-soil-200">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-emerald-950 tracking-tight">
          {t("navAlerts")}
        </h1>
        <p className="text-xs sm:text-sm text-soil-600 mt-1">
          {language === "gu"
            ? "વાસ્તવિક સમયના બજાર ભાવ ઉછાળા, ઓપન વેધર વરસાદની આગાહી અને મંડી આવકની તાત્કાલિક ચેતવણીઓ."
            : language === "hi"
            ? "मंडी भाव में तेजी, ओपन वेदर बारिश पूर्वानुमान और आवक की तत्काल सूचनाएं।"
            : "Instant notifications on sudden mandi price surges, real-time open weather advisories, and arrival volumes."}
        </p>
      </div>

      {/* Real-Time Meteorological Agromet Widget */}
      <WeatherWarningWidget />

      {/* Market & Weather Notifications List */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-700" />
          <h2 className="font-display font-bold text-base text-soil-950">
            {language === "gu" ? "સક્રિય બજાર અને મોસમ એલાર્મ્સ" : language === "hi" ? "सक्रिय बाजार व मौसम अलार्म" : "Active Market & Harvest Alarms"}
          </h2>
        </div>

        {marketAlerts.map((alert) => {
          const title =
            language === "gu" && alert.title_gu
              ? alert.title_gu
              : language === "hi" && alert.title_hi
              ? alert.title_hi
              : language === "mr" && alert.title_mr
              ? alert.title_mr
              : alert.title;

          const desc =
            language === "gu" && alert.desc_gu
              ? alert.desc_gu
              : language === "hi" && alert.desc_hi
              ? alert.desc_hi
              : language === "mr" && alert.desc_mr
              ? alert.desc_mr
              : alert.desc;

          return (
            <div
              key={alert.id}
              className={`p-4 sm:p-5 rounded-2xl bg-white border shadow-2xs space-y-2.5 transition-all ${
                alert.severity === "good"
                  ? "border-emerald-300 hover:border-emerald-500"
                  : alert.severity === "warn"
                  ? "border-amber-300 hover:border-amber-400"
                  : "border-soil-200"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      alert.severity === "good"
                        ? "bg-emerald-100 text-emerald-800"
                        : alert.severity === "warn"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {alert.type === "price-spike" ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : alert.type === "weather" ? (
                      <CloudRain className="w-5 h-5" />
                    ) : (
                      <Package className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm sm:text-base text-soil-950">
                      {title}
                    </h3>
                    <span className="text-[11px] text-soil-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-soil-400" />
                      {alert.time} • Crop: {alert.crop}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                    alert.severity === "good"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : alert.severity === "warn"
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-soil-100 text-soil-600"
                  }`}
                >
                  {alert.severity === "good"
                    ? language === "gu" ? "નફો તક" : "OPPORTUNITY"
                    : alert.severity === "warn"
                    ? language === "gu" ? "હવામાન ચેતવણી" : "WEATHER ALERT"
                    : "INFO"}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-soil-700 leading-relaxed pl-11">
                {desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
