import React from "react";
import {
  Sparkles,
  TrendingUp,
  Package,
  Bell,
  Upload,
  ArrowRight,
  ShieldCheck,
  Volume2,
  VolumeX,
  FileCheck,
  Building2,
  CheckCircle2
} from "lucide-react";
import { useApp } from "../store/AppContext";
import { Link } from "react-router-dom";
import WeatherWarningWidget from "../components/weather/WeatherWarningWidget";
import RoleDashboardOverlay from "../components/roles/RoleDashboardOverlay";
import HistoricalPriceTrendsChart from "../components/market/HistoricalPriceTrendsChart";

export default function Dashboard() {
  const {
    t,
    crops,
    marketPrices,
    sellingStrategies,
    marketAlerts,
    openGradingModal,
    gradingHistory,
    openCertificate,
    language,
    isPlayingAudio,
    playAudioAdvisory,
    stopAudioAdvisory,
    currentUser,
    buyerBids
  } = useApp();

  const totalValue = crops.reduce((acc, c) => acc + (c.estimatedTotal || 0), 0);
  const bestStrategy = sellingStrategies.find((s) => s.isRecommended) || sellingStrategies[1];

  const advisoryText =
    language === "hi"
      ? `नमस्ते ${currentUser.name} जी। आपके कटी हुई फसल के लिए आज की शीर्ष सिफारिश है: ${bestStrategy.name}। स्थानीय भाव के मुकाबले आपको ₹${(bestStrategy.netProfit - 460720).toLocaleString("en-IN")} का सीधा अतिरिक्त शुद्ध लाभ मिलेगा। अपनी उपज का AGMARK डिजिटल सर्टिफिकेट तुरंत डाउनलोड करें।`
      : language === "mr"
      ? `नमस्कार ${currentUser.name} जी. आपल्या शेतमालासाठी आजचा सर्वोत्तम सल्ला आहे: ${bestStrategy.name}. स्थानिक बाजारापेक्षा आपल्याला ₹${(bestStrategy.netProfit - 460720).toLocaleString("en-IN")} अधिक नफा होईल. आपला AGMARK डिजिटल दाखला त्वरित मिळवा.`
      : language === "gu"
      ? `નમસ્તે ${currentUser.name} જી. તમારા પાક માટે આજની શ્રેષ્ઠ સલાહ છે: ${bestStrategy.name}. સ્થાનિક ભાવ કરતા તમને ₹${(bestStrategy.netProfit - 460720).toLocaleString("en-IN")} નો ચોખ્ખો વધારાનો નફો મળશે. તમારું AGMARK ડિજિટલ પ્રમાણપત્ર તાત્કાલિક મેળવો.`
      : `Namaste ${currentUser.name} ji. For your harvested produce, today's top AI strategy is: ${bestStrategy.name}. It yields an estimated net gain of ₹${(bestStrategy.netProfit - 460720).toLocaleString("en-IN")} over local distress sale. You can inspect quality or generate an official AGMARK certificate.`;

  return (
    <div className="space-y-6">
      {/* Role-Specific Perspective Overlay (FPO, Buyer, Admin) */}
      <RoleDashboardOverlay />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-soil-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-signal-good animate-pulse"></span>
            <span className="text-xs font-bold text-soil-700 uppercase tracking-wide">
              {currentUser.village}, {currentUser.state} • e-NAM: {currentUser.enamId}
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-canopy-950 tracking-tight">
            {t("overviewTitle")}
          </h1>
          <p className="text-xs sm:text-sm text-soil-600 mt-1">
            {t("overviewSubtitle")}
          </p>
        </div>

        {/* Action buttons: Voice Advisory + Grade Produce */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => (isPlayingAudio ? stopAudioAdvisory() : playAudioAdvisory(advisoryText))}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all shadow-xs ${
              isPlayingAudio
                ? "bg-harvest-500 text-canopy-950 border-harvest-400 animate-pulse"
                : "bg-white text-soil-800 border-soil-200 hover:bg-soil-50"
            }`}
            title="Listen to Spoken Advisory in your language"
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-4 h-4 text-canopy-950" />
                <span>{t("playingAudio")}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-canopy-700" />
                <span>{t("listenToAdvisory")}</span>
              </>
            )}
          </button>

          <button
            onClick={() => openGradingModal()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-canopy-900 hover:bg-canopy-800 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
          >
            <Upload className="w-4 h-4 text-harvest-400" />
            <span>{t("gradeProduceButton") || "Upload & Grade"}</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Produce Value */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-soil-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-soil-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t("totalProduceValue")}
            </span>
            <div className="w-8 h-8 rounded-lg bg-canopy-50 text-canopy-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-bold text-2xl text-soil-950">
            ₹{totalValue.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-signal-good font-semibold mt-1.5 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Across {crops.length} tracked crop batches
          </div>
        </div>

        {/* Max Potential Net Gain */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-soil-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-soil-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t("highestNetGain")}
            </span>
            <div className="w-8 h-8 rounded-lg bg-harvest-100 text-harvest-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-bold text-2xl text-canopy-800">
            +₹51,790
          </div>
          <div className="text-[11px] text-soil-600 mt-1.5 flex items-center gap-1">
            Via AI recommendation vs selling locally today
          </div>
        </div>

        {/* Tracked Batches & Quality Grading */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-soil-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-soil-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t("activeCrops")}
            </span>
            <div className="w-8 h-8 rounded-lg bg-canopy-50 text-canopy-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-signal-good" />
            </div>
          </div>
          <div className="font-display font-bold text-2xl text-soil-950">
            {crops.filter((c) => c.qualityGrade).length} / {crops.length} Graded
          </div>
          <div className="text-[11px] text-soil-600 mt-1.5 flex items-center gap-1">
            {gradingHistory.length} camera inspections conducted
          </div>
        </div>

        {/* Active Alerts */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-soil-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-soil-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t("activeAlerts")}
            </span>
            <div className="w-8 h-8 rounded-lg bg-soil-100 text-harvest-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-bold text-2xl text-soil-950">
            {marketAlerts.length}
          </div>
          <div className="text-[11px] text-harvest-600 font-semibold mt-1.5 flex items-center gap-1">
            Vadodara Mandi Cotton Surge (+₹620/Qtl)
          </div>
        </div>
      </div>

      {/* Produce Grading Camera Spotlight Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-canopy-950 text-white p-6 shadow-md border border-canopy-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-harvest-400/20 text-harvest-300 text-xs font-mono font-semibold border border-harvest-400/30">
              <Sparkles className="w-3 h-3 text-harvest-400" />
              AGMARK & e-NAM COMPLIANT
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
              {language === "hi"
                ? "कैमरे से फसल की जांच करें और APMC AGMARK ग्रेड पाएं"
                : language === "mr"
                ? "कॅमेऱ्याने शेतमालाचा फोटो काढा व त्वरित प्रतवारी (Grading) मिळवा"
                : "Capture Farm Produce Photos for Instant Quality Grading"}
            </h2>
            <p className="text-xs sm:text-sm text-soil-200 leading-relaxed">
              {language === "hi"
                ? "ग्रेड ए फसल पर ₹200-₹500/क्विंटल तक अतिरिक्त प्रीमियम प्राप्त करें। AI विज़न नमी, कचरा दर और आकार एकरूपता का सटीक विश्लेषण करता है और डिजिटल प्रमाणपत्र जारी करता है।"
                : language === "mr"
                ? "ग्रेड ए शेतमालासाठी प्रति क्विंटल ₹२०० ते ₹५०० अतिरिक्त नफा मिळवा. ओलावा आणि कचऱ्याचे अचूक प्रमाण तपासून अधिकृत डिजिटल प्रमाणपत्र मिळवा."
                : "Grade A produce commands ₹200-₹500/qtl premium in e-NAM and terminal mandis. Our computer vision evaluates moisture compliance, defect rates, and generates verifiable AGMARK certificates."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => openGradingModal()}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-harvest-500 hover:bg-harvest-400 text-canopy-950 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>{t("openCamera")}</span>
            </button>
            <Link
              to="/grading"
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-canopy-800 hover:bg-canopy-700 text-soil-100 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 border border-canopy-700"
            >
              <span>{t("viewDetails")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Localized Weather & Harvesting Warning Widget (IMD Agromet) */}
      <WeatherWarningWidget />

      {/* Two Column Section: Top AI Recommendation & Live Mandi Prices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended AI Strategy Card (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-signal-good" />
              <h3 className="font-display font-bold text-lg text-canopy-950">
                {t("recommendedAction")}
              </h3>
            </div>
            <Link
              to="/recommendations"
              className="text-xs font-semibold text-canopy-700 hover:text-canopy-900 flex items-center gap-1"
            >
              <span>Compare All 4 Strategies</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Highlighted Strategy */}
          <div className="p-5 rounded-2xl bg-white border-2 border-canopy-600/30 shadow-xs space-y-4 relative overflow-hidden">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-canopy-50 text-canopy-800 border border-canopy-200 mb-1.5">
                  ⭐ RECOMMENDED HEDGE STRATEGY
                </span>
                <h4 className="font-display font-bold text-lg text-soil-950">
                  {bestStrategy.name}
                </h4>
                <p className="text-xs text-soil-600 mt-0.5">
                  {bestStrategy.crop} • {bestStrategy.breakdown || bestStrategy.sellingLocation}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-soil-500 block">Total Net Realization</span>
                <span className="font-display font-bold text-xl text-canopy-800">
                  ₹{bestStrategy.netProfit.toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] font-bold text-signal-good block mt-0.5">
                  {bestStrategy.gainOverLocal}
                </span>
              </div>
            </div>

            <div className="p-3 bg-soil-50 rounded-xl text-xs text-soil-700 border border-soil-200">
              <span className="font-bold text-canopy-900">Why this strategy: </span>
              {bestStrategy.highlight}
            </div>

            {/* Breakdown metric strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-soil-100">
              <div>
                <span className="text-[10px] text-soil-500 uppercase block">Offered Rate</span>
                <span className="font-bold text-xs text-soil-900">₹{bestStrategy.offeredPrice}/qtl</span>
              </div>
              <div>
                <span className="text-[10px] text-soil-500 uppercase block">Transport Freight</span>
                <span className="font-bold text-xs text-soil-900">₹{bestStrategy.transportCost}</span>
              </div>
              <div>
                <span className="text-[10px] text-soil-500 uppercase block">Storage Expense</span>
                <span className="font-bold text-xs text-soil-900">₹{bestStrategy.storageCost}</span>
              </div>
              <div>
                <span className="text-[10px] text-soil-500 uppercase block">Net Return</span>
                <span className="font-bold text-xs text-canopy-700">₹{bestStrategy.netPerQtl}/qtl</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-soil-500">
                Confidence: <strong className="text-canopy-800">{bestStrategy.confidence}</strong>
              </span>
              <Link
                to="/recommendations"
                className="px-4 py-2 text-xs font-bold rounded-xl bg-canopy-900 hover:bg-canopy-800 text-white transition-colors"
              >
                {t("applyStrategy")}
              </Link>
            </div>
          </div>
        </div>

        {/* Live Mandi Prices Feed (1 column) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-canopy-950">
              {t("liveMandiPrices")}
            </h3>
            <Link
              to="/markets"
              className="text-xs font-semibold text-canopy-700 hover:text-canopy-900 flex items-center gap-1"
            >
              <span>All Mandis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {marketPrices.slice(0, 4).map((mandi) => (
              <div
                key={mandi.id}
                className={`p-3.5 rounded-xl bg-white border transition-all ${
                  mandi.recommended
                    ? "border-canopy-600/50 shadow-2xs bg-canopy-50/20"
                    : "border-soil-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-display font-semibold text-xs text-soil-950">
                        {mandi.mandiName}
                      </h4>
                      {mandi.recommended && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-signal-good/10 text-signal-good font-bold">
                          BEST NET
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-soil-500">
                      {mandi.crop} • {mandi.distanceKm} km
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-display font-bold text-sm text-soil-950">
                      ₹{mandi.modalPrice}
                    </span>
                    <span
                      className={`text-[10px] block font-semibold ${
                        mandi.change.startsWith("+")
                          ? "text-signal-good"
                          : "text-signal-bad"
                      }`}
                    >
                      {mandi.change}
                    </span>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-soil-100 flex items-center justify-between text-[11px]">
                  <span className="text-soil-500">
                    Net: <strong className="text-canopy-800">₹{mandi.netReturnPerQtl}/qtl</strong>
                  </span>
                  <span className="text-soil-400">
                    {mandi.verifiedBuyersCount} verified buyers
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Recharts Historical Commodity Price Trends */}
      <HistoricalPriceTrendsChart initialCommodity="Cotton" />

      {/* Institutional Procurement Desk Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-soil-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-canopy-700" />
            <div>
              <h3 className="font-display font-bold text-base text-soil-950">
                {t("buyerDeskTitle")}
              </h3>
              <p className="text-xs text-soil-500">
                {t("buyerDeskSubtitle")}
              </p>
            </div>
          </div>
          <Link
            to="/recommendations"
            className="text-xs font-semibold text-canopy-700 hover:text-canopy-900 hidden sm:flex items-center gap-1"
          >
            <span>View All {buyerBids.length} Buyer Bids</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {buyerBids.slice(0, 2).map((bid) => (
            <div
              key={bid.id}
              className="p-3.5 rounded-xl border border-soil-200 bg-soil-50/60 hover:bg-white transition-colors flex items-center justify-between gap-3"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-soil-950 truncate">
                    {bid.companyName}
                  </span>
                  <span className="text-[10px] bg-canopy-100 text-canopy-900 font-semibold px-1.5 py-0.2 rounded shrink-0">
                    {bid.crop}
                  </span>
                </div>
                <p className="text-[11px] text-soil-500 truncate">
                  {bid.buyerType} • {bid.deliveryPoint}
                </p>
                <div className="text-[10px] text-canopy-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-signal-good" />
                  {bid.paymentTerms}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-soil-400 block uppercase font-bold">
                  Offered Rate
                </span>
                <span className="font-display font-bold text-base text-canopy-900 font-mono">
                  ₹{bid.offeredPricePerQtl}/qtl
                </span>
                <Link
                  to="/recommendations"
                  className="mt-1 block text-[11px] font-bold text-harvest-600 hover:underline"
                >
                  Negotiate / Counter →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Graded Lots & Recent Inspections Preview with 1-Click Certificate Generator */}
      <div className="p-5 rounded-2xl bg-white border border-soil-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-canopy-950">
              {t("myCropsTitle")}
            </h3>
            <p className="text-xs text-soil-500">
              Batches graded for APMC & e-NAM digital market linkage
            </p>
          </div>
          <Link
            to="/crops"
            className="text-xs font-semibold text-canopy-700 hover:text-canopy-900 flex items-center gap-1"
          >
            <span>View All Lots</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {crops.map((crop) => (
            <div
              key={crop.id}
              className="p-3.5 rounded-xl bg-soil-50/70 border border-soil-200 hover:border-canopy-600 transition-colors flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-display font-bold text-xs text-soil-950">
                    {crop.name}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      crop.qualityGrade === "Grade A"
                        ? "bg-signal-good/15 text-signal-good"
                        : "bg-harvest-100 text-harvest-600"
                    }`}
                  >
                    {crop.qualityGrade || "Ungraded"}
                  </span>
                </div>
                <div className="text-[11px] text-soil-600 space-y-0.5">
                  <p>Quantity: <strong className="text-soil-900">{crop.quantity} Qtls</strong></p>
                  <p>Moisture: <strong className="text-soil-900">{crop.moisture || "N/A"}</strong></p>
                  <p>Storage: <span className="text-soil-700">{crop.storageLocation}</span></p>
                  {crop.lotId && (
                    <p className="text-[10px] font-mono text-soil-400">Lot: {crop.lotId}</p>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-soil-200 flex items-center justify-between gap-1">
                <button
                  onClick={() =>
                    openCertificate({
                      lotId: crop.lotId || `LOT-${crop.id}`,
                      detectedCrop: crop.cropType || crop.name,
                      grade: crop.qualityGrade || "Grade A",
                      qualityScore: crop.qualityScore || 90,
                      estimatedMoisture: crop.moisture || "8.5%",
                      defectRate: "2.1%",
                      sizeUniformity: "92% Uniform",
                      storageLife: "60 Days",
                      priceImpact: "+₹350/qtl",
                    })
                  }
                  className="text-[11px] font-bold text-canopy-700 hover:text-canopy-900 inline-flex items-center gap-1 bg-white border border-soil-200 px-2 py-1 rounded-lg"
                  title="Generate official AGMARK certificate for this batch"
                >
                  <FileCheck className="w-3 h-3 text-canopy-600" />
                  <span>Certificate</span>
                </button>

                <button
                  onClick={() => openGradingModal(crop.cropType)}
                  className="text-[11px] font-bold text-harvest-600 hover:text-harvest-500 inline-flex items-center gap-1"
                >
                  <Camera className="w-3 h-3" />
                  Regrade
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
