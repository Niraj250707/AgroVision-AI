import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  ArrowUpRight,
  Filter,
  RefreshCw,
  CheckCircle2,
  Volume2,
  VolumeX,
  Store,
  Sparkles
} from "lucide-react";
import { useApp } from "../store/AppContext";
import { useLocale } from "../context/LocaleContext";
import DataGovSupplyInsights from "../components/market/DataGovSupplyInsights";
import HistoricalPriceTrendsChart from "../components/market/HistoricalPriceTrendsChart";

export default function MarketPrices() {
  const navigate = useNavigate();
  const {
    marketPrices,
    refreshMandiPrices,
    isLoadingMandi,
    isPlayingAudio,
    playAudioAdvisory,
    stopAudioAdvisory,
    language,
  } = useApp();
  const { locale, t, formatCropName, formatCurrency } = useLocale();
  const [selectedCropFilter, setSelectedCropFilter] = useState("All");

  // Dynamic voice command listener for form inputs and actions
  useEffect(() => {
    const handleVoiceCommand = (event) => {
      const detail = event.detail;
      if (!detail) return;

      if (detail.action === "SET_CROP_FILTER" && detail.payload?.crop) {
        setSelectedCropFilter(detail.payload.crop);
      } else if (detail.action === "REFRESH_PRICES") {
        refreshMandiPrices();
      }
    };

    window.addEventListener("agrovision:voice-command", handleVoiceCommand);
    return () => {
      window.removeEventListener("agrovision:voice-command", handleVoiceCommand);
    };
  }, [refreshMandiPrices]);

  // Comprehensive Crop Matching
  const filteredPrices =
    selectedCropFilter === "All"
      ? marketPrices
      : marketPrices.filter((m) => {
          const mCrop = (m.crop || "").toLowerCase();
          const target = selectedCropFilter.toLowerCase();
          return (
            mCrop === target ||
            mCrop.includes(target) ||
            target.includes(mCrop) ||
            (target === "cotton" && mCrop.includes("cotton")) ||
            (target === "onion" && mCrop.includes("onion")) ||
            (target === "soybean" && (mCrop.includes("soy") || mCrop.includes("soybean"))) ||
            (target === "wheat" && mCrop.includes("wheat")) ||
            (target === "maize" && mCrop.includes("maize")) ||
            (target === "potato" && mCrop.includes("potato")) ||
            (target === "tomato" && mCrop.includes("tomato")) ||
            (target === "mustard" && mCrop.includes("mustard"))
          );
        });

  // Localized mandi name helper
  const getMandiName = (mandi) => {
    if (!mandi) return "";
    if (locale === "gu" && mandi.mandiNameGu) return mandi.mandiNameGu;
    if (locale === "hi" && mandi.mandiNameHi) return mandi.mandiNameHi;
    return mandi.mandiName;
  };

  // Audio advisory generation for market prices
  const topMandi = filteredPrices.find((m) => m.recommended) || filteredPrices[0];
  const audioText =
    locale === "gu"
      ? selectedCropFilter === "All"
        ? `નમસ્તે ખેડૂત મિત્ર. આજના બજાર ભાવમાં સૌથી શ્રેષ્ઠ નફો આપતી મંડી ${getMandiName(topMandi)} છે, જ્યાં મોડલ ભાવ ₹${topMandi?.modalPrice} અને વાહન ભાડું બાદ કર્યા પછી હાથમાં ₹${topMandi?.netReturnPerQtl} પ્રતિ ક્વિન્ટલ ચોખ્ખી રકમ મળશે.`
        : `${formatCropName(selectedCropFilter)} માટે આજના સૌથી શ્રેષ્ઠ દરો ${getMandiName(topMandi)} માં છે. મોડલ ભાવ ₹${topMandi?.modalPrice} છે અને વાહન ખર્ચ બાદ કરતાં હાથમાં ₹${topMandi?.netReturnPerQtl} મળશે.`
      : locale === "hi"
      ? selectedCropFilter === "All"
        ? `नमस्ते किसान भाई। आज के मंडी भाव में सर्वोच्च शुद्ध लाभ देने वाली मंडी ${getMandiName(topMandi)} है, जहाँ मॉडल भाव ₹${topMandi?.modalPrice} और परिवहन घटाकर हाथ में ₹${topMandi?.netReturnPerQtl} प्रति क्विंटल मिलेंगे।`
        : `${formatCropName(selectedCropFilter)} के लिए आज का श्रेष्ठ भाव ${getMandiName(topMandi)} में है, जहाँ शुद्ध बचत ₹${topMandi?.netReturnPerQtl} प्रति क्विंटल है।`
      : locale === "mr"
      ? `नमस्कार शेतकरी बंधूंनो. आजच्या बाजारभावात सर्वाधिक निव्वळ नफा देणारी बाजार समिती ${getMandiName(topMandi)} आहे, जिथे वाहतूक खर्च वजा करून हातात ₹${topMandi?.netReturnPerQtl} प्रति क्विंटल मिळतील.`
      : `Namaste farmer friend. Today's highest net realization mandi for ${selectedCropFilter === "All" ? "your crops" : selectedCropFilter} is ${topMandi?.mandiName}, offering ₹${topMandi?.modalPrice}/quintal modal rate and ₹${topMandi?.netReturnPerQtl}/quintal net realization in hand after freight deductions.`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-soil-200">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-emerald-950 tracking-tight">
              {t("liveMandiPrices")}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-800 text-white shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              {locale === "gu" ? "e-NAM અધિકૃત દરો" : locale === "hi" ? "e-NAM अधिकृत भाव" : "e-NAM Verified Mandi Rates"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-soil-600 mt-1">
            {locale === "gu"
              ? "સ્થાનિક અને ટર્મિનલ માર્કેટ યાર્ડના મોડલ દરો અને વાહન ભાડું બાદ કર્યા પછી ખેડૂતને હાથમાં મળતી ચોખ્ખી રકમ."
              : locale === "hi"
              ? "स्थानीय एवं टर्मिनल मंडियों के वास्तविक मॉडल भाव एवं परिवहन लागत घटाकर शुद्ध लाभ।"
              : locale === "mr"
              ? "स्थानिक व प्रमुख बाजार समित्यांचे थेट दर आणि वाहतूक खर्च वजा जाता हातात मिळणारा निव्वळ नफा."
              : t("mandiSubtitle", "Real-time e-NAM and APMC mandi modal rates with deducted freight costs for net-profit realization.")}
          </p>
        </div>

        {/* Filter, Audio & Refresh Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Audio Advisory Playback Button */}
          <button
            onClick={() => (isPlayingAudio ? stopAudioAdvisory() : playAudioAdvisory(audioText))}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border transition-all shadow-2xs cursor-pointer ${
              isPlayingAudio
                ? "bg-emerald-600 text-white border-emerald-500 animate-pulse"
                : "bg-white text-emerald-900 border-emerald-200 hover:bg-emerald-50"
            }`}
            title="Listen to Live Market Rates Advisory"
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-4 h-4 text-white" />
                <span>{t("playingAudio", "Speaking...")}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-700" />
                <span>{locale === "gu" ? "ભાવ સાંભળો" : locale === "hi" ? "भाव सुनें" : locale === "mr" ? "दर ऐका" : "Listen Rates"}</span>
              </>
            )}
          </button>

          {/* Sync Button */}
          <button
            onClick={refreshMandiPrices}
            disabled={isLoadingMandi}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-white border border-soil-300 text-soil-800 hover:bg-soil-50 transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
            title="Sync Latest Rates"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${isLoadingMandi ? "animate-spin" : ""}`} />
            <span>{isLoadingMandi ? t("refreshingData", "Refreshing...") : t("refreshPrices", "Sync Rates")}</span>
          </button>

          {/* Crop Filter Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-soil-400" />
            <select
              value={selectedCropFilter}
              onChange={(e) => setSelectedCropFilter(e.target.value)}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-white border border-emerald-200 text-soil-800 focus:outline-none focus:border-emerald-600 shadow-2xs cursor-pointer"
            >
              <option value="All">{t("allCrops", "All Crops")}</option>
              <option value="Cotton">{locale === "gu" ? "કપાસ (Cotton)" : locale === "hi" ? "कपास (Cotton)" : "Cotton"}</option>
              <option value="Wheat">{locale === "gu" ? "ઘઉં (Wheat)" : locale === "hi" ? "गेहूं (Wheat)" : "Wheat"}</option>
              <option value="Onion">{locale === "gu" ? "ડુંગળી (Onion)" : locale === "hi" ? "प्याज (Onion)" : "Red Onion"}</option>
              <option value="Soybean">{locale === "gu" ? "સોયાબીન (Soybean)" : locale === "hi" ? "सोयाबीन (Soybean)" : "Soybean"}</option>
              <option value="Maize">{locale === "gu" ? "મકાઈ (Maize)" : locale === "hi" ? "मक्का (Maize)" : "Maize"}</option>
              <option value="Potato">{locale === "gu" ? "બટાકા (Potato)" : locale === "hi" ? "आलू (Potato)" : "Potato"}</option>
              <option value="Tomato">{locale === "gu" ? "ટામેટા (Tomato)" : locale === "hi" ? "टमाटर (Tomato)" : "Tomato"}</option>
              <option value="Mustard">{locale === "gu" ? "રાયડો (Mustard)" : locale === "hi" ? "सरसों (Mustard)" : "Mustard"}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Price Trends Chart */}
      <HistoricalPriceTrendsChart
        initialCommodity={selectedCropFilter === "All" ? "Cotton" : selectedCropFilter}
      />

      {/* Supply & Market Intelligence Layer (Clean farmer view) */}
      <DataGovSupplyInsights
        selectedCrop={selectedCropFilter === "All" ? "Cotton" : selectedCropFilter}
      />

      {/* Mandis Comparison Table & Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPrices.map((mandi) => (
          <div
            key={mandi.id}
            className={`p-5 rounded-2xl bg-white border transition-all flex flex-col justify-between ${
              mandi.recommended
                ? "border-2 border-emerald-600 shadow-md ring-2 ring-emerald-500/10"
                : "border-soil-200 shadow-2xs hover:shadow-xs"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-bold text-base text-emerald-950">
                      {getMandiName(mandi)}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {formatCropName(mandi.crop)}
                    </span>
                  </div>
                  <p className="text-xs text-soil-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{mandi.state}</span>
                    <span>•</span>
                    <span>{mandi.distanceKm} {locale === "gu" ? "કિમી (ખેતરથી)" : locale === "hi" ? "किमी (खेत से)" : t("kmFromFarm", "km from farm")}</span>
                  </p>
                </div>

                {mandi.recommended && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 whitespace-nowrap flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    {locale === "gu" ? "શ્રેષ્ઠ ચોખ્ખો નફો" : locale === "hi" ? "सर्वोत्तम लाभ" : t("topNetValue", "TOP NET VALUE")}
                  </span>
                )}
              </div>

              {/* Price Breakdown Block */}
              <div className="p-3 bg-soil-50 rounded-xl space-y-2 text-xs border border-soil-100">
                <div className="flex justify-between items-center">
                  <span className="text-soil-600 font-medium">
                    {locale === "gu" ? "મંડી મોડલ દર:" : locale === "hi" ? "मंडी मॉडल भाव:" : t("mandiModalRate", "Mandi Modal Rate") + ":"}
                  </span>
                  <span className="font-display font-bold text-base text-soil-950">
                    {formatCurrency(mandi.modalPrice)}/qtl
                  </span>
                </div>
                <div className="flex justify-between items-center text-soil-500">
                  <span>
                    {locale === "gu" ? "ભાવ રેન્જ (ઓછા - વધુ):" : locale === "hi" ? "भाव अंतर (न्यूनतम - अधिकतम):" : t("priceRange", "Price Range") + ":"}
                  </span>
                  <span className="font-mono font-medium">₹{mandi.minPrice} - ₹{mandi.maxPrice}</span>
                </div>
                <div className="flex justify-between items-center text-rose-600 font-medium">
                  <span>
                    {locale === "gu" ? "અંદાજિત વાહન ભાડું:" : locale === "hi" ? "अनुमानित परिवहन खर्च:" : t("estimatedFreight", "Estimated Freight") + ":"}
                  </span>
                  <span>-₹{mandi.transportCostPerQtl}/qtl</span>
                </div>
              </div>

              {/* Net Return Highlight */}
              <div className="p-3.5 bg-emerald-900 text-white rounded-xl flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] text-emerald-200 uppercase font-bold tracking-wider block">
                    {locale === "gu" ? "હાથમાં મળતી ચોખ્ખી રકમ" : locale === "hi" ? "हाथ में वास्तविक शुद्ध बचत" : t("netRealization", "Actual Net Realization")}
                  </span>
                  <span className="font-display font-bold text-xl text-white">
                    {formatCurrency(mandi.netReturnPerQtl)}
                    <span className="text-xs font-normal text-emerald-200"> / {locale === "gu" ? "ક્વિન્ટલ" : locale === "hi" ? "क्विंटल" : "quintal"}</span>
                  </span>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${mandi.change?.startsWith("+") ? "bg-emerald-700 text-emerald-100" : "bg-rose-700 text-white"}`}>
                  {mandi.change}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-soil-100 flex items-center justify-between text-xs">
              <span className="text-soil-600 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {mandi.verifiedBuyersCount} {locale === "gu" ? "લાયસન્સ ધરાવતા વેપારીઓ" : locale === "hi" ? "पंजीकृत व्यापारी" : t("licensedTraders", "Licensed Traders")}
              </span>
              <button
                onClick={() => navigate("/transport")}
                className="font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>{locale === "gu" ? "વાહન બુક કરો" : locale === "hi" ? "गाड़ी बुक करें" : t("bookFreight", "Book Freight")}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
