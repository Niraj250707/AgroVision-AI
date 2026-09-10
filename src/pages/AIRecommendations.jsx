import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Camera,
  Volume2,
  VolumeX,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Send,
  Check,
  Sprout,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  Droplets,
  HelpCircle,
  Clock,
  Wheat
} from "lucide-react";
import { useApp } from "../store/AppContext";
import { generateCropRecommendations, SOIL_PRESETS } from "../services/cropRecommendationService";

export default function AIRecommendations() {
  const {
    t,
    activeCrop,
    openGradingModal,
    language,
    isPlayingAudio,
    playAudioAdvisory,
    stopAudioAdvisory,
    currentUser,
    buyerBids,
    acceptBuyerBid,
    submitCounterOffer
  } = useApp();

  // Mode: 'crop-sowing' | 'selling-strategy'
  const [activeTab, setActiveTab] = useState("crop-sowing");

  // Crop Recommendation Inputs State
  const [selectedPresetId, setSelectedPresetId] = useState("anand-alluvial");
  const [soilType, setSoilType] = useState("Alluvial Loam");
  const [ph, setPh] = useState(7.2);
  const [nitrogen, setNitrogen] = useState(240);
  const [phosphorus, setPhosphorus] = useState(28);
  const [potassium, setPotassium] = useState(310);
  const [season, setSeason] = useState("Kharif");
  const [rainfallPattern, setRainfallPattern] = useState("Normal");

  // Apply Soil Preset
  const handleApplyPreset = (presetId) => {
    setSelectedPresetId(presetId);
    const p = SOIL_PRESETS.find((preset) => preset.id === presetId);
    if (p) {
      setSoilType(p.soilType);
      setPh(p.ph);
      setNitrogen(p.nitrogen);
      setPhosphorus(p.phosphorus);
      setPotassium(p.potassium);
    }
  };

  // Compute recommendations
  const cropRecs = useMemo(() => {
    return generateCropRecommendations({
      soilType,
      ph,
      nitrogen,
      phosphorus,
      potassium,
      season,
      rainfallPattern,
    });
  }, [soilType, ph, nitrogen, phosphorus, potassium, season, rainfallPattern]);

  // Selling Strategy State
  const [selectedStrategyId, setSelectedStrategyId] = useState(null);
  const [negotiatingBidId, setNegotiatingBidId] = useState(null);
  const [counterValue, setCounterValue] = useState("");
  const [actionNotice, setActionNotice] = useState("");

  const quantity = Math.max(0, Number(activeCrop?.quantity) || 0);
  const localRate = Math.max(0, Number(activeCrop?.baseMandiPrice) || 0);
  const marketRate = Math.max(localRate, Number(activeCrop?.potentialPrice) || Math.round(localRate * 1.08));
  const cropName = activeCrop?.cropType || activeCrop?.name || "your produce";

  const strategyInputs = [
    {
      id: "strategy-1",
      strategyKey: "sellNow",
      type: "Sell Now",
      name: language === "gu" ? "વ્યૂહરચના ૧: તાત્કાલિક વેચાણ (સ્થાનિક મંડી)" : `Sell Now (${activeCrop?.storageLocation || "Local Mandi"})`,
      timing: language === "gu" ? "આજે / આવતીકાલે તાત્કાલિક" : "Immediate (today / tomorrow)",
      sellingLocation: "Anand APMC (8 km)",
      offeredPrice: localRate,
      transportCost: quantity * 40,
      storageCost: 0,
      riskLevel: language === "gu" ? "શૂન્ય બજાર જોખમ" : "Zero market risk",
      confidence: "98%",
      highlight: language === "gu" ? "તાત્કાલિક રોકડ ઉપલબ્ધતા, સંગ્રહનું કોઈ જોખમ નહીં." : "Immediate cash flow with no storage exposure.",
    },
    {
      id: "strategy-2",
      strategyKey: "distantMandi",
      type: "Better Market",
      name: language === "gu" ? "વ્યૂહરચના ૨: ટર્મિનલ મંડી (વડોદરા)" : "Sell to the best nearby market",
      timing: language === "gu" ? "૪૮ કલાકની અંદર" : "Within 48 hours",
      sellingLocation: "Vadodara APMC (42 km)",
      offeredPrice: marketRate,
      transportCost: quantity * 160,
      storageCost: 0,
      riskLevel: language === "gu" ? "ઓછું પરિવહન જોખમ" : "Low transport risk",
      confidence: "94%",
      highlight: language === "gu" ? "ટ્રાન્સપોર્ટ ખર્ચ બાદ કરતા વધારાનો ચોખ્ખો નફો મળે છે." : "Captures the current price premium after transport and mandi costs.",
    },
    {
      id: "strategy-3",
      strategyKey: "storeAndWait",
      type: "Store & Wait",
      name: language === "gu" ? "વ્યૂહરચના ૩: વેરહાઉસ સંગ્રહ અને તેજીની રાહ" : "Store for a stronger price window",
      timing: language === "gu" ? "૩૦-૪૫ દિવસ સાચવો" : "Hold for 30 days",
      sellingLocation: "Anand CWC Warehouse",
      offeredPrice: Math.round(marketRate * 1.06),
      transportCost: quantity * 50,
      storageCost: quantity * 200,
      riskLevel: language === "gu" ? "મધ્યમ ભાવ વધઘટ" : "Moderate price volatility",
      confidence: "82%",
      highlight: language === "gu" ? "ભાવ વધે ત્યાં સુધી ૭% વ્યાજે e-NWR બેંક લોન મેળવી શકાય છે." : "Higher upside, balanced against storage fees and expected weight loss.",
    },
  ];

  const calculatedStrategies = strategyInputs.map((strategy) => {
    const grossValue = quantity * strategy.offeredPrice;
    const weightLossDeduction = strategy.id === "strategy-3" ? Math.round(grossValue * 0.01) : 0;
    const mandiCess = Math.round(grossValue * 0.01);
    const netProfit = Math.max(
      0,
      Math.round(grossValue - strategy.transportCost - strategy.storageCost - weightLossDeduction - mandiCess)
    );
    return { ...strategy, crop: cropName, quantity, grossValue, weightLossDeduction, mandiCess, netProfit, netPerQtl: quantity ? Math.round(netProfit / quantity) : 0 };
  });

  // Audio speech advisory for crop recommendations
  const getCropAdvisoryText = () => {
    const top = cropRecs.topRecommendation;
    if (!top) return "";
    if (language === "gu") {
      return `નમસ્તે ${currentUser?.name || "ખેડૂત"} જી. તમારી ${soilType} જમીન અને ${season === "Kharif" ? "ચોમાસુ" : "શિયાળુ"} ઋતુ માટે AI એ સર્વોચ્ચ ${top.suitabilityScore}% સુસંગતતા સાથે ${top.name} ની ભલામણ કરી છે. વાવણીનો શ્રેષ્ઠ સમય: ${top.plantingWindowGu}. અંદાજિત ઉત્પાદન: ${top.yieldRange}. ખાતર સલાહ: ${top.fertilizerDoseGu}`;
    }
    if (language === "hi") {
      return `नमस्ते ${currentUser?.name || "किसान"} जी। आपकी ${soilType} मिट्टी और ${season} मौसम के लिए AI ने ${top.suitabilityScore}% मैच के साथ ${top.name} की सिफारिश की है। बुवाई का सही समय: ${top.plantingWindowHi}. अनुमानित उपज: ${top.yieldRange}. खाद प्रबंधन: ${top.fertilizerDoseHi}`;
    }
    return `Namaste ${currentUser?.name || "Farmer"} ji. Based on your ${soilType} and ${season} climate, AI strongly recommends planting ${top.name} with a ${top.suitabilityScore}% match. Optimal planting schedule: ${top.plantingWindowEn}. Expected yield: ${top.yieldRange}.`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-soil-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
              {currentUser.village}, {currentUser.state} • ICAR & Agromet Engine
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-emerald-950 tracking-tight">
            {language === "gu"
              ? "AI કૃષિ ભલામણો અને આયોજન કેન્દ્ર"
              : language === "hi"
              ? "AI कृषि अनुशंसा एवं रोपण योजना"
              : "AI Agricultural Planning & Recommendations"}
          </h1>
          <p className="text-xs sm:text-sm text-soil-600 mt-0.5">
            {language === "gu"
              ? "જમીનની ગુણવત્તા અને ઐતિહાસિક આબોહવાના આધારે પાક વાવણી અને લણણી પછીની શ્રેષ્ઠ વ્યૂહરચનાઓ."
              : "Data-driven crop planting schedules from soil test metrics and post-harvest net profit maximization."}
          </p>
        </div>

        {/* Audio Advisory & Camera Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() =>
              isPlayingAudio ? stopAudioAdvisory() : playAudioAdvisory(getCropAdvisoryText())
            }
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all shadow-xs cursor-pointer ${
              isPlayingAudio
                ? "bg-harvest-500 text-emerald-950 border-harvest-400 animate-pulse"
                : "bg-white text-emerald-900 border-emerald-200 hover:bg-emerald-50"
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>{language === "gu" ? "ઓડિયો બંધ કરો" : "Stop Audio"}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-700" />
                <span>{language === "gu" ? "સલાહ સાંભળો" : language === "hi" ? "सलाह सुनें" : "Listen Advisory"}</span>
              </>
            )}
          </button>

          <button
            onClick={() => openGradingModal()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <Camera className="w-4 h-4 text-harvest-400" />
            <span>{t("gradeProduceButton")}</span>
          </button>
        </div>
      </div>

      {/* Main Tab Switcher: 1) Sowing & Soil Engine  |  2) Post-Harvest Selling Strategies */}
      <div className="flex items-center gap-2 p-1 rounded-2xl bg-emerald-100/60 max-w-lg border border-emerald-200/80">
        <button
          onClick={() => setActiveTab("crop-sowing")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "crop-sowing"
              ? "bg-white text-emerald-950 shadow-sm"
              : "text-emerald-800 hover:text-emerald-950"
          }`}
        >
          <Sprout className="w-4 h-4 text-emerald-600" />
          <span>{language === "gu" ? "૧. જમીન અને પાક વાવણી સલાહ" : language === "hi" ? "1. मिट्टी व फसल बुवाई इंजन" : "1. Crop Sowing Engine"}</span>
        </button>

        <button
          onClick={() => setActiveTab("selling-strategy")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "selling-strategy"
              ? "bg-white text-emerald-950 shadow-sm"
              : "text-emerald-800 hover:text-emerald-950"
          }`}
        >
          <TrendingUp className="w-4 h-4 text-harvest-600" />
          <span>{language === "gu" ? "૨. લણેલા માલનું વેચાણ પ્લાનર" : language === "hi" ? "2. कटाई पश्चात बिक्री रणनीति" : "2. Post-Harvest Selling"}</span>
        </button>
      </div>

      {/* TAB 1: AI CROP SOWING & PLANTING RECOMMENDATION ENGINE */}
      {activeTab === "crop-sowing" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Soil Quality & Climate Configuration Panel */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-emerald-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-soil-100">
              <div>
                <h2 className="font-display font-bold text-base sm:text-lg text-emerald-950 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-700" />
                  <span>
                    {language === "gu"
                      ? "જમીનની ગુણવત્તા અને ઐતિહાસિક આબોહવા ડેટા"
                      : "Soil Health Quality & Agro-Climatic Parameters"}
                  </span>
                </h2>
                <p className="text-xs text-soil-500 mt-0.5">
                  {language === "gu"
                    ? "૧-ક્લિક પ્રાદેશિક જમીન પસંદ કરો અથવા સોઇલ હેલ્થ કાર્ડ મુજબ વિગતો ગોઠવો:"
                    : "Select 1-click regional presets or adjust soil test parameters for precision recommendations:"}
                </p>
              </div>

              {/* 1-Click Regional Preset Selector */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-soil-500 uppercase">
                  {language === "gu" ? "પ્રાદેશિક જમીન:" : "Preset:"}
                </span>
                <select
                  value={selectedPresetId}
                  onChange={(e) => handleApplyPreset(e.target.value)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  {SOIL_PRESETS.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Interactive Inputs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              {/* Soil Type */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-soil-700 block">
                  {language === "gu" ? "જમીનનો પ્રકાર" : "Soil Type"}
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-soil-300 bg-white font-medium text-soil-900 focus:outline-none focus:border-emerald-600"
                >
                  <option value="Alluvial Loam">Alluvial Loam (કાંપવાળી)</option>
                  <option value="Deep Black Cotton Soil">Deep Black (કાળી કપાસ)</option>
                  <option value="Clay Loam">Clay Loam (ચીકણી ગોરાડુ)</option>
                  <option value="Red Sandy Loam">Red Sandy Loam (લાલ)</option>
                </select>
              </div>

              {/* Soil pH */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-soil-700">
                    {language === "gu" ? "જમીન pH" : "Soil pH"}
                  </label>
                  <span className="font-mono font-bold text-emerald-800">{ph}</span>
                </div>
                <input
                  type="range"
                  min="5.5"
                  max="8.5"
                  step="0.1"
                  value={ph}
                  onChange={(e) => setPh(parseFloat(e.target.value))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
                <span className="text-[10px] text-soil-400 block">
                  {ph < 6.5 ? "Acidic" : ph > 7.5 ? "Alkaline" : "Neutral / Ideal"}
                </span>
              </div>

              {/* Nitrogen */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-soil-700 block">
                  {language === "gu" ? "નાઇટ્રોજન (N)" : "Nitrogen (N)"}
                </label>
                <input
                  type="number"
                  value={nitrogen}
                  onChange={(e) => setNitrogen(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-soil-300 bg-white font-mono text-soil-900 focus:outline-none focus:border-emerald-600"
                />
                <span className="text-[10px] text-soil-400 block">kg/hectare</span>
              </div>

              {/* Phosphorus */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-soil-700 block">
                  {language === "gu" ? "ફોસ્ફરસ (P)" : "Phosphorus (P)"}
                </label>
                <input
                  type="number"
                  value={phosphorus}
                  onChange={(e) => setPhosphorus(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-soil-300 bg-white font-mono text-soil-900 focus:outline-none focus:border-emerald-600"
                />
                <span className="text-[10px] text-soil-400 block">kg/hectare</span>
              </div>

              {/* Potassium */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-soil-700 block">
                  {language === "gu" ? "પોટાશ (K)" : "Potassium (K)"}
                </label>
                <input
                  type="number"
                  value={potassium}
                  onChange={(e) => setPotassium(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-soil-300 bg-white font-mono text-soil-900 focus:outline-none focus:border-emerald-600"
                />
                <span className="text-[10px] text-soil-400 block">kg/hectare</span>
              </div>

              {/* Target Season */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-soil-700 block">
                  {language === "gu" ? "વાવેતર ઋતુ" : "Target Season"}
                </label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-soil-300 bg-white font-medium text-soil-900 focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  <option value="Kharif">{language === "gu" ? "ચોમાસું (Kharif)" : "Kharif (Monsoon)"}</option>
                  <option value="Rabi">{language === "gu" ? "શિયાળુ (Rabi)" : "Rabi (Winter)"}</option>
                  <option value="Zaid">{language === "gu" ? "ઉનાળુ (Zaid)" : "Zaid (Summer)"}</option>
                </select>
              </div>
            </div>
          </div>

          {/* AI Output Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-700" />
              <h3 className="font-display font-bold text-lg text-emerald-950">
                {language === "gu"
                  ? `તમારી જમીન માટે ટોચના ભલામણ કરેલ પાક (${cropRecs.recommendedCrops.length})`
                  : `Top Recommended Crops for Your Soil Profile (${cropRecs.recommendedCrops.length})`}
              </h3>
            </div>
            <span className="text-xs text-soil-500">
              {language === "gu" ? "અગ્રતા ક્રમ: સુસંગતતા સ્કોર" : "Ranked by AI Suitability Score"}
            </span>
          </div>

          {/* Recommended Crops Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {cropRecs.recommendedCrops.map((crop, idx) => {
              const isTop = idx === 0;
              const plantingWindow =
                language === "gu"
                  ? crop.plantingWindowGu
                  : language === "hi"
                  ? crop.plantingWindowHi
                  : crop.plantingWindowEn;

              const harvestWindow =
                language === "gu"
                  ? crop.harvestWindowGu
                  : language === "hi"
                  ? crop.harvestWindowHi
                  : crop.harvestWindowEn;

              const fertilizerDose =
                language === "gu"
                  ? crop.fertilizerDoseGu
                  : language === "hi"
                  ? crop.fertilizerDoseHi
                  : crop.fertilizerDoseEn;

              const whyRecommended =
                language === "gu"
                  ? crop.whyRecommendedGu
                  : language === "hi"
                  ? crop.whyRecommendedHi
                  : crop.whyRecommendedEn;

              return (
                <div
                  key={crop.id}
                  className={`p-5 rounded-2xl bg-white border transition-all flex flex-col justify-between space-y-4 ${
                    isTop
                      ? "border-2 border-emerald-600 shadow-md ring-2 ring-emerald-500/10"
                      : "border-soil-200 shadow-2xs hover:shadow-xs"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Title + Suitability Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        {isTop && (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 mb-1">
                            ⭐ {language === "gu" ? "શ્રેષ્ઠ પાક ભલામણ" : "TOP SUITABILITY MATCH"}
                          </span>
                        )}
                        <h4 className="font-display font-bold text-lg text-soil-950">
                          {crop.name}
                        </h4>
                        <p className="text-xs text-soil-500">
                          {crop.variety} • {crop.growthDays}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-soil-400 block uppercase font-bold">
                          {language === "gu" ? "સુસંગતતા" : "Match Score"}
                        </span>
                        <span className="font-display font-bold text-xl text-emerald-800">
                          {crop.suitabilityScore}%
                        </span>
                      </div>
                    </div>

                    {/* Sowing & Harvesting Dates Strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/50 text-xs">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-emerald-800 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-emerald-600" />
                          {language === "gu" ? "શ્રેષ્ઠ વાવણી સમય" : "Optimal Sowing Window"}
                        </span>
                        <span className="font-semibold text-soil-900 block mt-0.5">
                          {plantingWindow}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-emerald-800 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-600" />
                          {language === "gu" ? "અંદાજિત લણણી" : "Expected Harvest"}
                        </span>
                        <span className="font-semibold text-soil-900 block mt-0.5">
                          {harvestWindow}
                        </span>
                      </div>
                    </div>

                    {/* Expected Yield & Projected Return */}
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-soil-100 text-xs">
                      <div>
                        <span className="text-[10px] text-soil-500 block uppercase">
                          {language === "gu" ? "અંદાજિત ઉપજ" : "Expected Yield"}
                        </span>
                        <strong className="text-soil-900">{crop.yieldRange}</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-soil-500 block uppercase">
                          {language === "gu" ? "અંદાજિત આવક / એકર" : "Projected Return"}
                        </span>
                        <strong className="text-emerald-800 text-sm font-mono">
                          {crop.projectedReturn}
                        </strong>
                      </div>
                    </div>

                    {/* Why this crop reasoning */}
                    <div className="p-3 bg-soil-50 rounded-xl text-xs text-soil-700 border border-soil-200">
                      <strong className="text-emerald-950">
                        {language === "gu" ? "શા માટે અનુકૂળ: " : "Why this crop: "}
                      </strong>
                      <span>{whyRecommended}</span>
                    </div>

                    {/* Fertilizer & Soil Health Advice */}
                    <div className="p-3 bg-white rounded-xl border border-emerald-200/80 text-xs space-y-1">
                      <span className="font-bold text-emerald-900 text-[11px] uppercase tracking-wider block">
                        🌱 {language === "gu" ? "ખાતર વ્યવસ્થાપન માર્ગદર્શિકા:" : "Fertilizer & Soil Nutrition Plan:"}
                      </span>
                      <p className="text-soil-700 leading-relaxed text-[11px]">
                        {fertilizerDose}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-soil-100 flex items-center justify-between text-xs">
                    <span className="text-soil-500 flex items-center gap-1 text-[11px]">
                      <Droplets className="w-3.5 h-3.5 text-blue-500" />
                      {crop.waterRequirement}
                    </span>
                    <button
                      onClick={() =>
                        playAudioAdvisory(
                          language === "gu"
                            ? `${crop.name} ની વાવણીનો શ્રેષ્ઠ સમય ${plantingWindow} છે. અંદાજિત ઉપજ ${crop.yieldRange}. ખાતર: ${fertilizerDose}`
                            : `Optimal sowing for ${crop.name} is ${plantingWindow}. Yield is ${crop.yieldRange}. Fertilizer: ${fertilizerDose}`
                        )
                      }
                      className="font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{language === "gu" ? "સાંભળો" : "Listen"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: POST-HARVEST SELLING STRATEGIES & BUYER DESK */}
      {activeTab === "selling-strategy" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-5 rounded-2xl bg-white border border-soil-200 shadow-2xs space-y-3">
            <h3 className="font-display font-bold text-lg text-emerald-950">
              {language === "gu"
                ? "લણેલા માલ માટે ૪ ચોખ્ખા નફા વેચાણ વિકલ્પો"
                : "4 Post-Harvest Realization Strategies (After Freight & Storage)"}
            </h3>
            <p className="text-xs text-soil-600">
              {language === "gu"
                ? `તમારા લણેલા ${cropName} (${quantity} ક્વિન્ટલ) માટે વાસ્તવિક ખર્ચ બાદ કર્યા પછી ચોખ્ખો નફો:`
                : `Calculated for your tracked ${cropName} batch (${quantity} Quintals) comparing local sale vs distant mandi vs warehouse holding:`}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {calculatedStrategies.map((strategy) => (
                <div
                  key={strategy.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    strategy.id === "strategy-2"
                      ? "border-2 border-emerald-600 bg-emerald-50/20 shadow-xs"
                      : "border-soil-200 bg-white"
                  }`}
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {strategy.type}
                    </span>
                    <h4 className="font-display font-bold text-base text-soil-950">
                      {strategy.name}
                    </h4>
                    <p className="text-xs text-soil-500">{strategy.timing} • {strategy.sellingLocation}</p>

                    <div className="p-2.5 bg-soil-50 rounded-lg space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-soil-500">Mandi Rate:</span>
                        <strong className="text-soil-900">₹{strategy.offeredPrice}/qtl</strong>
                      </div>
                      <div className="flex justify-between text-signal-bad">
                        <span>Transport & Fees:</span>
                        <span>-₹{strategy.transportCost + strategy.storageCost}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-soil-200">
                        <span className="font-bold text-soil-900">Net Return:</span>
                        <strong className="text-emerald-800 font-display text-sm">₹{strategy.netProfit.toLocaleString("en-IN")}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-soil-100 text-xs text-soil-600">
                    {strategy.highlight}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Institutional Procurement Desk */}
          <div className="p-5 rounded-2xl bg-white border border-soil-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-emerald-950">
                  {t("buyerDeskTitle", "Institutional Buyer Procurement Desk")}
                </h3>
                <p className="text-xs text-soil-500">
                  {t("buyerDeskSubtitle", "Direct millers and food processors with guaranteed payment terms")}
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                {buyerBids.length} Active Bids
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {buyerBids.map((bid) => (
                <div
                  key={bid.id}
                  className="p-4 rounded-xl border border-soil-200 hover:border-emerald-600 transition-all bg-soil-50/40 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-soil-950">{bid.companyName}</h4>
                      <p className="text-xs text-soil-500">{bid.crop} • {bid.buyerType}</p>
                      <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                        <CheckCircle2 className="w-3 h-3 text-signal-good" />
                        {bid.paymentTerms}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-soil-400 block uppercase font-bold">Offered Rate</span>
                      <strong className="font-display font-bold text-base text-emerald-900 font-mono">
                        ₹{bid.offeredPricePerQtl}/qtl
                      </strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-soil-200 flex items-center justify-between">
                    <button
                      onClick={() => acceptBuyerBid(bid.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors"
                    >
                      {bid.status === "Accepted & Dispatched" ? "Accepted ✓" : "Accept Bid"}
                    </button>
                    <span className="text-[11px] text-soil-500">{bid.deliveryPoint}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
