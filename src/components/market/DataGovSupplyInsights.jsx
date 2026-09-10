import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Sparkles,
  Store,
  CheckCircle2,
} from "lucide-react";
import { fetchSupplyInsights } from "../../services/dataGovApi";
import { useLocale } from "../../context/LocaleContext";

export default function DataGovSupplyInsights({ selectedCrop = "Cotton" }) {
  const { locale, formatCurrency, formatCropName } = useLocale();

  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const ins = await fetchSupplyInsights({ commodity: selectedCrop });
      setInsights(ins);
    } catch (e) {
      console.warn("Supply insights load error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCrop]);

  const tSupply = {
    title: {
      gu: "બજાર પુરવઠો અને શ્રેષ્ઠ વેચાણ તક",
      hi: "मंडी आपूर्ति व सर्वोत्तम बिक्री विश्लेषण",
      mr: "बाजार पुरवठा व सर्वोत्तम विक्री विश्लेषण",
      en: "Mandi Supply & High-Value Selling Insights",
    },
    subtitle: {
      gu: `તમારા ${formatCropName(selectedCrop)} માટે દૈનિક મોડલ ભાવ, આવક અને શ્રેષ્ઠ નફો આપતી મંડીનું વિશ્લેષણ.`,
      hi: `आपकी ${formatCropName(selectedCrop)} फसल के लिए दैनिक मॉडल भाव, आवક और सर्वोत्तम लाभ देने वाली मंडी का विश्लेषण।`,
      mr: `आपल्या ${formatCropName(selectedCrop)} पिकासाठी दैनिक मॉडेल भाव, आवक व सर्वाधिक नफा देणाऱ्या बाजार समितीचे विश्लेषण.`,
      en: `Official daily modal prices, arrival volumes, and spatial arbitrage for ${formatCropName(selectedCrop)}.`,
    },
    sync: {
      gu: "ભાવ અપડેટ કરો",
      hi: "भाव रीफ्रेश करें",
      mr: "दर ताजे करा",
      en: "Sync Rates",
    },
    syncing: {
      gu: "અપડેટ ચાલુ છે...",
      hi: "अपडेट हो रहा है...",
      mr: "अपडेट होत आहे...",
      en: "Syncing...",
    },
    verifiedLive: {
      gu: "e-NAM અધિકૃત દરો",
      hi: "e-NAM अधिकृत भाव",
      mr: "e-NAM अधिकृत दर",
      en: "e-NAM Verified Mandis",
    },
    regionalAvg: {
      gu: "વિસ્તારીય સરેરાશ મોડલ ભાવ",
      hi: "क्षेत्रीय औसत मॉडल भाव",
      mr: "प्रादेशिक सरासरी मॉडेल दर",
      en: "Regional Modal Average",
    },
    verifiedYards: {
      gu: "ચકાસાયેલ APMC યાર્ડ મુજબ",
      hi: "सत्यापित APMC मंडियों अनुसार",
      mr: "पडताळणी केलेल्या बाजार समित्या",
      en: "Across verified APMC yards",
    },
    totalArrivals: {
      gu: "આજની નોંધાયેલ આવક",
      hi: "आज की कुल पंजीकृत आवक",
      mr: "आजची एकूण नोंदणीकृत आवक",
      en: "Total Recorded Arrivals",
    },
    todayInflow: {
      gu: "આજની મંડી આવક વોલ્યુમ",
      hi: "आज की मंडी आवक मात्रा",
      mr: "आजची बाजार आवक",
      en: "Today's mandi inflow",
    },
    priceSpread: {
      gu: "મંડી ભાવ તફાવત (સ્પ્રેડ)",
      hi: "मंडी मूल्य अंतर (स्प्रेड)",
      mr: "बाजारभाव फरक (स्प्रेड)",
      en: "Mandi Price Spread",
    },
    spreadDesc: {
      gu: "સૌથી ઊંચા અને નીચા ભાવનો તફાવત",
      hi: "उच्चतम व न्यूनतम भाव का अंतर",
      mr: "कमाल व किमान दरांतील फरक",
      en: "Spread between lowest & highest",
    },
    marketPressure: {
      gu: "બજાર સ્થિતિ અને સલાહ",
      hi: "बाजार स्थिति व सलाह",
      mr: "बाजार परिस्थिती व सल्ला",
      en: "Market Supply Condition",
    },
    harvestGlut: {
      gu: "ભારે આવક (માલ સાચવો)",
      hi: "अधिक आवक (स्टॉक रोकें)",
      mr: "जास्त आवक (माल साठवा)",
      en: "Harvest Glut (Hold Stock)",
    },
    highDemand: {
      gu: "ઊંચી માંગ (વેચવા શ્રેષ્ઠ સમય)",
      hi: "उच्च मांग (बेचने का उत्तम समय)",
      mr: "उच्च मागणी (विक्रीसाठी उत्तम वेळ)",
      en: "High Demand (Good to Sell)",
    },
    arbitrageBadge: {
      gu: "સૌથી વધુ નફો આપતી મંડી તક",
      hi: "अधिक लाभ देने वाला मंडी अंतर",
      mr: "जास्त नफा देणारी बाजार संधी",
      en: "Detected Mandi Arbitrage Opportunity",
    },
    topDemandTitle: {
      gu: "સૌથી વધુ ચોખ્ખો નફો આપતી મંડીઓ (ભાડું બાદ કર્યા પછી હાથમાં મળતી રકમ)",
      hi: "सर्वोच्च शुद्ध लाभ देने वाली मंडियाँ (भाड़ा घटाने के बाद हाथ में राशि)",
      mr: "सर्वाधिक निव्वळ नफा देणाऱ्या बाजार समित्या (वाहतूक वजा करून)",
      en: "High-Value Demand Mandis (Highest Net Returns After Freight)",
    },
    rank: {
      gu: "ક્રમ",
      hi: "रैंक",
      mr: "क्रमांक",
      en: "Rank",
    },
    modalRate: {
      gu: "મોડલ ભાવ",
      hi: "मॉडल भाव",
      mr: "मॉडेल दर",
      en: "Modal Rate",
    },
    netInHand: {
      gu: "હાથમાં ચોખ્ખી રકમ",
      hi: "हाथ में शुद्ध बचत",
      mr: "हातात निव्वळ रक्कम",
      en: "Net in Hand",
    },
  };

  const getLoc = (key) => tSupply[key]?.[locale] || tSupply[key]?.en || "";

  // Localized mandi name helper
  const getMandiName = (mandi) => {
    if (!mandi) return "";
    if (locale === "gu" && mandi.mandiNameGu) return mandi.mandiNameGu;
    if (locale === "hi" && mandi.mandiNameHi) return mandi.mandiNameHi;
    return mandi.mandiName;
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-emerald-100 shadow-xs space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-soil-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="font-display font-bold text-lg text-emerald-950 flex items-center gap-2">
              <Store className="w-5 h-5 text-emerald-600" />
              <span>{getLoc("title")}</span>
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {getLoc("verifiedLive")}
            </span>
          </div>
          <p className="text-xs text-soil-600">
            {getLoc("subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            title="Refresh Mandi Intelligence"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? getLoc("syncing") : getLoc("sync")}</span>
          </button>
        </div>
      </div>

      {/* 4 Clean Metric Cards */}
      {insights && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Regional Modal Average */}
          <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100/80">
            <span className="text-[11px] font-semibold text-soil-600 uppercase tracking-wide block">
              {getLoc("regionalAvg")}
            </span>
            <span className="font-display font-bold text-xl text-emerald-950 mt-0.5 block">
              {formatCurrency(insights.averageModalRate)}
              <span className="text-xs font-normal text-soil-500"> / qtl</span>
            </span>
            <span className="text-[10px] text-soil-500 mt-1 block">
              {getLoc("verifiedYards")}
            </span>
          </div>

          {/* Total Arrivals */}
          <div className="p-3.5 rounded-xl bg-soil-50 border border-soil-200">
            <span className="text-[11px] font-semibold text-soil-600 uppercase tracking-wide block">
              {getLoc("totalArrivals")}
            </span>
            <span className="font-display font-bold text-xl text-soil-900 mt-0.5 block">
              {insights.totalArrivalsQuintals.toLocaleString("en-IN")}
              <span className="text-xs font-normal text-soil-500"> qtl</span>
            </span>
            <span className="text-[10px] text-soil-500 mt-1 block">
              {getLoc("todayInflow")}
            </span>
          </div>

          {/* Price Spread */}
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80">
            <span className="text-[11px] font-semibold text-soil-600 uppercase tracking-wide block">
              {getLoc("priceSpread")}
            </span>
            <span className="font-display font-bold text-xl text-amber-700 mt-0.5 block">
              {formatCurrency(insights.priceSpread)}
            </span>
            <span className="text-[10px] text-soil-500 mt-1 block">
              {getLoc("spreadDesc")}
            </span>
          </div>

          {/* Market Supply Condition */}
          <div className="p-3.5 rounded-xl bg-emerald-900 text-white border border-emerald-800 shadow-2xs">
            <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wide block">
              {getLoc("marketPressure")}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              {insights.supplyCondition === "HIGH_SUPPLY_GLUT" ? (
                <TrendingDown className="w-4 h-4 text-amber-300 shrink-0" />
              ) : (
                <TrendingUp className="w-4 h-4 text-emerald-300 shrink-0" />
              )}
              <span className="font-display font-bold text-sm text-white truncate">
                {insights.supplyCondition === "HIGH_SUPPLY_GLUT"
                  ? getLoc("harvestGlut")
                  : getLoc("highDemand")}
              </span>
            </div>
            <span className="text-[10px] text-emerald-100/90 mt-1 line-clamp-1 block">
              {locale === "gu"
                ? (insights.supplyCondition === "HIGH_SUPPLY_GLUT" ? "આવક વધુ હોવાથી સ્ટોક સાચવો અથવા e-NWR લોન લો." : "બજારમાં ખરીદદારોની ઊંચી સ્પર્ધા છે, સારો ભાવ મળશે.")
                : locale === "hi"
                ? (insights.supplyCondition === "HIGH_SUPPLY_GLUT" ? "भारी आवक है, भंडारण या ई-NWR लोन लें।" : "खरीदारों की अधिक मांग है, अच्छे भाव मिलेंगे।")
                : insights.supplyMessage}
            </span>
          </div>
        </div>
      )}

      {/* Spatial Arbitrage Opportunity Callout */}
      {insights?.arbitrageOpportunities?.[0]?.recommended && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 mt-0.5 shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                {getLoc("arbitrageBadge")}
              </span>
              <p className="text-xs text-soil-700 mt-0.5">
                {locale === "gu" ? (
                  <>
                    <strong>{insights.arbitrageOpportunities[0].fromMandi}</strong> ના બદલે{" "}
                    <strong>{insights.arbitrageOpportunities[0].toMandi}</strong> માં વેચવાથી વાહન ભાડું બાદ કર્યા પછી પણ પ્રતિ ક્વિન્ટલ{" "}
                    <strong className="text-emerald-700">
                      +{formatCurrency(insights.arbitrageOpportunities[0].netGainPerQtl)}/ક્વિન્ટલ
                    </strong>{" "}
                    વધુ ચોખ્ખી રકમ હાથમાં મળશે!
                  </>
                ) : locale === "hi" ? (
                  <>
                    <strong>{insights.arbitrageOpportunities[0].fromMandi}</strong> के बजाय{" "}
                    <strong>{insights.arbitrageOpportunities[0].toMandi}</strong> में बेचने पर परिवहन भाड़ा घटाने के बाद भी प्रति क्विंटल{" "}
                    <strong className="text-emerald-700">
                      +{formatCurrency(insights.arbitrageOpportunities[0].netGainPerQtl)}/क्विंटल
                    </strong>{" "}
                    अतिरिक्त शुद्ध लाभ मिलेगा!
                  </>
                ) : (
                  <>
                    Selling in <strong>{insights.arbitrageOpportunities[0].toMandi}</strong> instead of{" "}
                    <strong>{insights.arbitrageOpportunities[0].fromMandi}</strong> yields an extra{" "}
                    <strong className="text-emerald-700">
                      +{formatCurrency(insights.arbitrageOpportunities[0].netGainPerQtl)}/quintal
                    </strong>{" "}
                    net in hand even after all transportation and freight costs!
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 inline-block whitespace-nowrap">
              +{formatCurrency(insights.arbitrageOpportunities[0].netGainPerQtl * 50)} {locale === "gu" ? "ચોખ્ખો વધારો (૫૦ ક્વિન્ટલ)" : "Net Gain (50 Qtl)"}
            </span>
          </div>
        </div>
      )}

      {/* Top Demand Mandis Cards */}
      {insights?.highDemandMandis?.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-bold text-soil-800">
            {getLoc("topDemandTitle")}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {insights.highDemandMandis.map((mandi, idx) => (
              <div
                key={mandi.id || idx}
                className="p-3.5 rounded-xl border border-emerald-100 hover:border-emerald-400 bg-white transition-all flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-emerald-950">
                      {getMandiName(mandi)}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {getLoc("rank")} #{idx + 1}
                    </span>
                  </div>
                  <span className="text-xs text-soil-500 block mt-0.5">
                    {mandi.state} • {mandi.distanceKm} km
                  </span>
                </div>

                <div className="mt-3 pt-2.5 border-t border-soil-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-soil-500 block uppercase font-medium">{getLoc("modalRate")}</span>
                    <strong className="text-soil-900">{formatCurrency(mandi.modalPrice)}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-700 block uppercase font-bold">
                      {getLoc("netInHand")}
                    </span>
                    <strong className="text-emerald-700 text-sm font-bold">
                      {formatCurrency(mandi.netReturnPerQtl)}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
