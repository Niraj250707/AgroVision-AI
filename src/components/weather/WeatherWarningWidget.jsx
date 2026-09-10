import React, { useState, useEffect } from "react";
import {
  CloudRain,
  Sun,
  Wind,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Volume2,
  VolumeX,
  MapPin,
  ShieldAlert,
  Calendar,
  Sparkles,
  SprayCan,
  Wheat
} from "lucide-react";
import { useApp } from "../../store/AppContext";
import { fetchLiveWeatherData } from "../../services/weatherService";

export default function WeatherWarningWidget() {
  const { currentUser, language, playAudioAdvisory, stopAudioAdvisory, isPlayingAudio } = useApp();
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("Just now");
  const [activeTab, setActiveTab] = useState("forecast"); // 'forecast' | 'humidity' | 'decisions'

  const loadWeatherData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchLiveWeatherData({
        district: currentUser?.district || currentUser?.village || "Anand",
      });
      setWeather(data);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    } catch (err) {
      console.warn("Error loading weather data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherData();
  }, [currentUser?.district]);

  if (!weather && isLoading) {
    return (
      <div className="p-6 rounded-2xl bg-white border border-emerald-100 shadow-xs flex items-center justify-center gap-3 text-emerald-800">
        <RefreshCw className="w-5 h-5 animate-spin text-emerald-600" />
        <span className="text-xs font-semibold">
          {language === "gu" ? "ઓપન વેધર API થી લાઈવ હવામાન લોડ થઈ રહ્યું છે..." : "Loading real-time Open Weather data..."}
        </span>
      </div>
    );
  }

  if (!weather) return null;

  // Localized spoken text for voice button
  const getLocalizedSpokenText = () => {
    const loc = currentUser?.district || "આણંદ";
    if (language === "gu") {
      return `નમસ્તે ${currentUser?.name || "ખેડૂત"} જી. ${loc} માં લાઈવ હવામાન: તાપમાન ${weather.temperature} ડિગ્રી, ભેજ ${weather.humidity} ટકા અને વરસાદની શક્યતા ${weather.rainProbability} ટકા છે. લણણી નિર્ણય: ${weather.harvestDecision.textGu}. દવા છંટકાવ: ${weather.sprayingAdvice.gu}`;
    }
    if (language === "hi") {
      return `नमस्ते ${currentUser?.name || "किसान"} जी। ${loc} में लाइव मौसम: तापमान ${weather.temperature}°C, नमी ${weather.humidity}% और बारिश की संभावना ${weather.rainProbability}% है। कटाई सलाह: ${weather.harvestDecision.textHi}. छिड़काव सलाह: ${weather.sprayingAdvice.hi}`;
    }
    if (language === "mr") {
      return `नमस्कार ${currentUser?.name || "शेतकरी"} जी. ${loc} मधील हवामान: तापमान ${weather.temperature}°C, आर्द्रता ${weather.humidity}% आणि पावसाची शक्यता ${weather.rainProbability}% आहे. कापणी सल्ला: ${weather.harvestDecision.textMr}. फवारणी: ${weather.sprayingAdvice.mr}`;
    }
    return `Namaste ${currentUser?.name || "Farmer"} ji. Weather advisory for ${loc}: Temperature is ${weather.temperature}°C, humidity is ${weather.humidity}%, rain probability is ${weather.rainProbability}%. Harvest decision: ${weather.harvestDecision.textEn}. Spraying advice: ${weather.sprayingAdvice.en}`;
  };

  const conditionText =
    language === "gu"
      ? weather.conditionTextGu
      : language === "hi"
      ? weather.conditionTextHi
      : language === "mr"
      ? weather.conditionTextMr
      : weather.conditionTextEn;

  return (
    <div className="rounded-2xl border border-emerald-200/80 bg-white p-4 sm:p-5 shadow-xs transition-all space-y-4">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-2xs">
            {weather.rainProbability > 40 ? (
              <CloudRain className="w-5 h-5 text-blue-600 animate-pulse" />
            ) : (
              <Sun className="w-5 h-5 text-amber-500" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm sm:text-base text-soil-950">
                {language === "gu"
                  ? "રિયલ-ટાઇમ ઓપન વેધર અને કૃષિ ચેતવણી"
                  : language === "hi"
                  ? "रीयल-टाइम ओपन वेदर एवं कृषि मौसम अलर्ट"
                  : "Real-Time Open Weather & Agromet Advisory"}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300/40">
                LIVE METEO
              </span>
            </div>
            <p className="text-xs text-soil-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>{weather.location}</span>
              <span className="text-soil-300">•</span>
              <span className="text-[11px] text-soil-400">
                {conditionText} ({lastUpdated})
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls: Audio advisory + Refresh */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() =>
              isPlayingAudio ? stopAudioAdvisory() : playAudioAdvisory(getLocalizedSpokenText())
            }
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
              isPlayingAudio
                ? "bg-harvest-500 text-emerald-950 border-harvest-400 animate-pulse"
                : "bg-emerald-50 text-emerald-900 border-emerald-300/80 hover:bg-emerald-100"
            }`}
            title="Listen to Weather Advisory in your language"
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>{language === "gu" ? "બંધ કરો" : "Stop Audio"}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>{language === "gu" ? "ઓડિયો સાંભળો" : language === "hi" ? "ऑडियो सुनें" : "Audio Alert"}</span>
              </>
            )}
          </button>

          <button
            onClick={loadWeatherData}
            disabled={isLoading}
            className="p-1.5 rounded-xl bg-soil-50 border border-soil-300 hover:bg-soil-100 text-soil-700 transition-colors cursor-pointer"
            title="Refresh Live Forecast"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-emerald-700" : ""}`} />
          </button>
        </div>
      </div>

      {/* Metrics Row: Temp, Rain Prob, Humidity, Wind */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/60">
          <div className="flex items-center gap-1 text-soil-500 text-[11px]">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === "gu" ? "તાપમાન" : language === "hi" ? "तापमान" : "Temperature"}</span>
          </div>
          <div className="font-display font-bold text-lg sm:text-xl text-soil-950 mt-1">
            {weather.temperature}°C
          </div>
          <span className="text-[10px] text-soil-500">
            {language === "gu" ? "અનુભવ" : "Feels"}: {weather.apparentTemperature}°C
          </span>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/60">
          <div className="flex items-center gap-1 text-soil-500 text-[11px]">
            <CloudRain className="w-3.5 h-3.5 text-blue-500" />
            <span>{language === "gu" ? "વરસાદની શક્યતા" : language === "hi" ? "बारिश संभावना" : "Rain Chance"}</span>
          </div>
          <div className={`font-display font-bold text-lg sm:text-xl mt-1 ${weather.rainProbability >= 40 ? "text-signal-bad" : "text-signal-good"}`}>
            {weather.rainProbability}%
          </div>
          <span className="text-[10px] text-soil-500">
            {weather.rainProbability >= 40
              ? language === "gu" ? "વરસાદનું જોખમ" : "High Rain Risk"
              : language === "gu" ? "સૂકું વાતાવરણ" : "Dry Window"}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/60">
          <div className="flex items-center gap-1 text-soil-500 text-[11px]">
            <Droplets className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === "gu" ? "હવામાં ભેજ" : language === "hi" ? "सापेक्ष आर्द्रता" : "Humidity Index"}</span>
          </div>
          <div className={`font-display font-bold text-lg sm:text-xl mt-1 ${weather.humidity >= 75 ? "text-amber-600" : "text-emerald-900"}`}>
            {weather.humidity}%
          </div>
          <span className="text-[10px] text-soil-500">
            {weather.moldRisk.level === "CRITICAL"
              ? language === "gu" ? "ફૂગ/સડો જોખમ" : "Mold Risk High"
              : language === "gu" ? "સંગ્રહ માટે યોગ્ય" : "Optimal Storage"}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/60">
          <div className="flex items-center gap-1 text-soil-500 text-[11px]">
            <Wind className="w-3.5 h-3.5 text-teal-600" />
            <span>{language === "gu" ? "પવનની ગતિ" : language === "hi" ? "हवा की गति" : "Wind Speed"}</span>
          </div>
          <div className="font-display font-bold text-lg sm:text-xl text-soil-950 mt-1">
            {weather.windSpeed}
          </div>
          <span className="text-[10px] text-soil-500">
            {weather.windSpeedNum <= 15
              ? language === "gu" ? "છંટકાવ અનુકૂળ" : "Safe for spraying"
              : language === "gu" ? "વધુ પવન" : "Gusty"}
          </span>
        </div>
      </div>

      {/* Interactive Tabs: 7-Day Rainfall Forecast | Humidity & Mold Indices | Farming Decisions */}
      <div className="pt-2 border-t border-emerald-100">
        <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveTab("forecast")}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer ${
              activeTab === "forecast"
                ? "bg-emerald-800 text-white shadow-xs"
                : "bg-soil-100 text-soil-700 hover:bg-soil-200"
            }`}
          >
            🌧️ {language === "gu" ? "૭-દિવસ વરસાદ આગાહી" : language === "hi" ? "7-दिवसीय वर्षा पूर्वानुमान" : "7-Day Rainfall Forecast"}
          </button>
          <button
            onClick={() => setActiveTab("humidity")}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer ${
              activeTab === "humidity"
                ? "bg-emerald-800 text-white shadow-xs"
                : "bg-soil-100 text-soil-700 hover:bg-soil-200"
            }`}
          >
            💧 {language === "gu" ? "ભેજ અને ફૂગ જોખમ ઇન્ડેક્સ" : language === "hi" ? "नमी व फफूंद जोखिम इंडेक्स" : "Humidity & Mold Indices"}
          </button>
          <button
            onClick={() => setActiveTab("decisions")}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer ${
              activeTab === "decisions"
                ? "bg-emerald-800 text-white shadow-xs"
                : "bg-soil-100 text-soil-700 hover:bg-soil-200"
            }`}
          >
            🌱 {language === "gu" ? "ખેતી નિર્ણયો (લણણી/પિયત/દવા)" : language === "hi" ? "कृषि निर्णय (कटाई/सिंचाई)" : "Data-Driven Farming Decisions"}
          </button>
        </div>

        {/* Tab 1: 7-Day Rainfall Forecast Bars */}
        {activeTab === "forecast" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-soil-600 font-semibold px-1">
              <span>{language === "gu" ? "આગામી ૭ દિવસનો વરસાદ અને સંભાવના:" : "Next 7 Days Rainfall & Precipitation Probability:"}</span>
              <span className="text-emerald-800 font-bold">
                {language === "gu" ? `અઠવાડિયાનો કુલ વરસાદ: ${weather.weekRainSum} મીમી` : `Total Week Rain: ${weather.weekRainSum} mm`}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-1">
              {weather.dailyForecast.map((day, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-xl border text-center transition-all flex flex-col justify-between ${
                    day.isRainy
                      ? "bg-blue-50/80 border-blue-200 shadow-2xs"
                      : "bg-emerald-50/40 border-emerald-100"
                  }`}
                >
                  <span className="text-[11px] font-bold text-soil-800 block">
                    {language === "gu" ? day.dayNameGu : language === "hi" ? day.dayNameHi : day.dayName}
                  </span>
                  <div className="my-1.5 flex justify-center">
                    {day.isRainy ? (
                      <CloudRain className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Sun className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <div>
                    <span className={`text-[11px] font-bold block ${day.rainProb >= 40 ? "text-blue-700" : "text-soil-600"}`}>
                      {day.rainProb}%
                    </span>
                    <span className="text-[9px] text-soil-500 font-mono block">
                      {day.rainSum} mm
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Humidity Indices & Crop Disease/Storage Risk */}
        {activeTab === "humidity" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Storage Mold Risk Card */}
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-emerald-700" />
                  {language === "gu" ? "અનાજ સંગ્રહ અને સડો જોખમ" : "Grain Storage Mold Risk"}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  weather.moldRisk.level === "CRITICAL"
                    ? "bg-red-100 text-red-800 border border-red-200"
                    : weather.moldRisk.level === "MODERATE"
                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                    : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                }`}>
                  {weather.moldRisk.level}
                </span>
              </div>
              <p className="text-xs text-soil-700 leading-relaxed">
                {language === "gu"
                  ? weather.moldRisk.textGu
                  : language === "hi"
                  ? weather.moldRisk.textHi
                  : weather.moldRisk.textEn}
              </p>
            </div>

            {/* Disease & Pest Vulnerability Index */}
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  {language === "gu" ? "રોગ અને જીવાત અનુકૂળતા ઇન્ડેક્સ" : "Crop Disease & Pest Vulnerability"}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  IPM MONITOR
                </span>
              </div>
              <p className="text-xs text-soil-700 leading-relaxed">
                {language === "gu"
                  ? "કપાસમાં ગુલાબી ઇયળ અને ડુંગળીમાં જાંબલી ચરમી (Purple Blotch) માટે સતર્ક રહો. ૭૦% થી વધુ ભેજમાં ટ્રાઇકોડર્મા અથવા જૈવિક દ્રાવણ ઉપયોગી રહેશે."
                  : "Watch for Purple Blotch in onions and Pink Bollworm in cotton. High relative humidity promotes fungal spore spread. Apply bio-fungicide or neem oil preventive spray."}
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Data-Driven Farming Decisions (Harvest, Spray, Irrigate) */}
        {activeTab === "decisions" && (
          <div className="space-y-2.5">
            {/* Harvest Decision */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
              {weather.harvestDecision.status === "SAFE" ? (
                <CheckCircle2 className="w-4 h-4 text-signal-good shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="text-xs leading-relaxed">
                <strong className="text-emerald-950">
                  {language === "gu" ? "🌾 લણણી નિર્ણય: " : "🌾 Harvest Decision: "}
                </strong>
                <span className="text-soil-800">
                  {language === "gu"
                    ? weather.harvestDecision.textGu
                    : language === "hi"
                    ? weather.harvestDecision.textHi
                    : weather.harvestDecision.textEn}
                </span>
              </div>
            </div>

            {/* Spraying Advice */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <strong className="text-emerald-950">
                  {language === "gu" ? "🚜 દવા છંટકાવ વિન્ડો: " : "🚜 Spraying Feasibility: "}
                </strong>
                <span className="text-soil-800">
                  {language === "gu"
                    ? weather.sprayingAdvice.gu
                    : language === "hi"
                    ? weather.sprayingAdvice.hi
                    : weather.sprayingAdvice.en}
                </span>
              </div>
            </div>

            {/* Irrigation Guidance */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
              <Droplets className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <strong className="text-emerald-950">
                  {language === "gu" ? "💧 પિયત આયોજન: " : "💧 Irrigation Guidance: "}
                </strong>
                <span className="text-soil-800">
                  {language === "gu"
                    ? weather.irrigationAdvice.gu
                    : language === "hi"
                    ? weather.irrigationAdvice.hi
                    : weather.irrigationAdvice.en}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
