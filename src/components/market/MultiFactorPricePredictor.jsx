import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  Truck,
  CloudRain,
  Sun,
  Award,
  Calendar,
  Layers,
  BarChart3,
  Sliders,
  AlertTriangle,
  Scale,
  DollarSign,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { predictCommodityPrice, CROP_BASE_PRICES } from "../../services/pricePredictionService";
import { useLocale } from "../../context/LocaleContext";

export default function MultiFactorPricePredictor({ initialCrop = "Cotton", onSelectStrategy }) {
  const { formatCurrency, locale } = useLocale();

  const [crop, setCrop] = useState(initialCrop);
  const [grade, setGrade] = useState("Grade A");
  const [arrivalsTrend, setArrivalsTrend] = useState("normal"); // high | normal | low
  const [weatherCondition, setWeatherCondition] = useState("clear"); // clear | rainy | cyclone
  const [distanceKm, setDistanceKm] = useState(35);
  const [vehicleType, setVehicleType] = useState("pickup");
  const [seasonPhase, setSeasonPhase] = useState("harvest_peak");
  const [buyerDemandLevel, setBuyerDemandLevel] = useState("high");
  const [forecastDays, setForecastDays] = useState(7);

  const prediction = useMemo(() => {
    return predictCommodityPrice({
      crop,
      grade,
      arrivalsTrend,
      weatherCondition,
      distanceKm,
      vehicleType,
      seasonPhase,
      buyerDemandLevel,
      forecastDays
    });
  }, [crop, grade, arrivalsTrend, weatherCondition, distanceKm, vehicleType, seasonPhase, buyerDemandLevel, forecastDays]);

  const isPerishable = prediction.cropCategory === "perishable";

  return (
    <div className="p-6 rounded-2xl bg-white border border-soil-200 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-soil-200">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-canopy-900 text-harvest-400 flex items-center justify-center shadow-2xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-lg text-canopy-950">
                AI Multi-Factor Mandi Price Prediction Engine
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-harvest-100 text-harvest-800 border border-harvest-200">
                7-Factor Model
              </span>
            </div>
            <p className="text-xs text-soil-600">
              Integrates historical prices, daily arrivals, weather, transport logistics, quality grade, seasonality & institutional buyer demand.
            </p>
          </div>
        </div>

        {/* Forecast duration selector */}
        <div className="flex items-center gap-1.5 bg-soil-100 p-1 rounded-xl border border-soil-200 self-start sm:self-auto">
          {[7, 15, 30].map((d) => (
            <button
              key={d}
              onClick={() => setForecastDays(d)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                forecastDays === d
                  ? "bg-canopy-900 text-white shadow-2xs"
                  : "text-soil-600 hover:text-soil-900"
              }`}
            >
              +{d} Days
            </button>
          ))}
        </div>
      </div>

      {/* Perishable warning banner if applicable */}
      {isPerishable && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-2.5 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Perishable Vegetable/Fruit Rule Activated</strong>
            <span>
              Shelf life is only {prediction.shelfLifeDays} days. Long holding strategies are disabled to prevent decay. Buyer return policy is strictly limited to same-day delivery inspection.
            </span>
          </div>
        </div>
      )}

      {/* Prediction Output Spotlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Predicted Mandi Rate */}
        <div className="p-4 rounded-xl bg-canopy-950 text-white border border-canopy-800 space-y-1 relative overflow-hidden">
          <span className="text-[10px] font-mono text-harvest-300 uppercase font-bold tracking-wider block">
            Predicted Modal Price (+{forecastDays} Days)
          </span>
          <div className="font-display font-bold text-3xl text-white">
            ₹{prediction.predictedGrossRate.toLocaleString("en-IN")}
            <span className="text-xs text-soil-300 font-normal"> /quintal</span>
          </div>
          <div className="flex items-center gap-2 pt-1 text-xs">
            <span className={`font-bold flex items-center gap-0.5 ${
              prediction.predictedGrossRate >= prediction.baseRate ? "text-signal-good" : "text-amber-400"
            }`}>
              {prediction.predictedGrossRate >= prediction.baseRate ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {prediction.predictedGrossRate >= prediction.baseRate ? "+" : ""}
              ₹{(prediction.predictedGrossRate - prediction.baseRate).toLocaleString("en-IN")} vs 30D Base
            </span>
            <span className="text-[10px] text-soil-400">MSP: ₹{prediction.msp}</span>
          </div>
        </div>

        {/* Net In-Hand Realization */}
        <div className="p-4 rounded-xl bg-harvest-50 border-2 border-harvest-300 space-y-1">
          <span className="text-[10px] font-mono text-harvest-800 uppercase font-bold tracking-wider block">
            Net In-Hand Realization (Post-Freight)
          </span>
          <div className="font-display font-bold text-3xl text-harvest-700">
            ₹{prediction.netInHandRate.toLocaleString("en-IN")}
            <span className="text-xs text-harvest-800 font-normal"> /quintal</span>
          </div>
          <div className="text-xs text-harvest-800 flex items-center justify-between pt-1">
            <span>Deducted Freight: <strong>₹{prediction.freightPerQtl}/qtl</strong></span>
            <span className="text-[10px] font-semibold">({distanceKm} km {vehicleType})</span>
          </div>
        </div>

        {/* AI Action Strategy */}
        <div className="p-4 rounded-xl bg-soil-50 border border-soil-200 space-y-2 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-soil-400 uppercase font-bold tracking-wider block">
              Recommended Selling Window
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                prediction.strategy === "SELL_TODAY" || prediction.strategy === "SELL_NOW"
                  ? "bg-signal-good text-white"
                  : "bg-harvest-500 text-canopy-950"
              }`}>
                {prediction.strategy === "SELL_TODAY" ? "SELL TODAY (FRESH LOT)" : prediction.strategy === "SELL_NOW" ? "SELL THIS WEEK" : "HOLD IN STORAGE"}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-soil-600 leading-snug">
            {prediction.strategyReason}
          </p>
        </div>
      </div>

      {/* Interactive Controls Bar: Configure 7 factors */}
      <div className="p-5 rounded-2xl bg-soil-50 border border-soil-200 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-display font-bold text-sm text-soil-950 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-canopy-700" />
            <span>Simulate Real-World Market Variables</span>
          </h4>
          <span className="text-[11px] text-soil-500">Live model re-calculation</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
          {/* 1. Crop */}
          <div>
            <label className="text-[10px] font-bold uppercase text-soil-500 block mb-1">1. Commodity</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full bg-white border border-soil-300 rounded-lg px-2 py-1.5 font-semibold text-soil-900 focus:outline-none focus:border-canopy-600"
            >
              {Object.keys(CROP_BASE_PRICES).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* 2. Quality Grade */}
          <div>
            <label className="text-[10px] font-bold uppercase text-soil-500 block mb-1">2. Quality Grade</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full bg-white border border-soil-300 rounded-lg px-2 py-1.5 font-semibold text-soil-900 focus:outline-none focus:border-canopy-600"
            >
              <option value="Grade A">Grade A (Special)</option>
              <option value="Grade B">Grade B (Standard)</option>
              <option value="Grade C">Grade C (Fair Average)</option>
            </select>
          </div>

          {/* 3. Mandi Arrivals */}
          <div>
            <label className="text-[10px] font-bold uppercase text-soil-500 block mb-1">3. Arrivals Supply</label>
            <select
              value={arrivalsTrend}
              onChange={(e) => setArrivalsTrend(e.target.value)}
              className="w-full bg-white border border-soil-300 rounded-lg px-2 py-1.5 font-semibold text-soil-900 focus:outline-none focus:border-canopy-600"
            >
              <option value="high">High (Glut)</option>
              <option value="normal">Normal</option>
              <option value="low">Low (Shortage)</option>
            </select>
          </div>

          {/* 4. Weather Conditions */}
          <div>
            <label className="text-[10px] font-bold uppercase text-soil-500 block mb-1">4. Weather</label>
            <select
              value={weatherCondition}
              onChange={(e) => setWeatherCondition(e.target.value)}
              className="w-full bg-white border border-soil-300 rounded-lg px-2 py-1.5 font-semibold text-soil-900 focus:outline-none focus:border-canopy-600"
            >
              <option value="clear">Dry & Sunny</option>
              <option value="rainy">Heavy Rainfall</option>
              <option value="cyclone">Transit Disruption</option>
            </select>
          </div>

          {/* 5. Transport Distance & Vehicle */}
          <div>
            <label className="text-[10px] font-bold uppercase text-soil-500 block mb-1">5. Distance ({distanceKm}km)</label>
            <input
              type="range"
              min="10"
              max="180"
              step="5"
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              className="w-full accent-canopy-700 cursor-pointer"
            />
          </div>

          {/* 6. Seasonality Phase */}
          <div>
            <label className="text-[10px] font-bold uppercase text-soil-500 block mb-1">6. Season Phase</label>
            <select
              value={seasonPhase}
              onChange={(e) => setSeasonPhase(e.target.value)}
              className="w-full bg-white border border-soil-300 rounded-lg px-2 py-1.5 font-semibold text-soil-900 focus:outline-none focus:border-canopy-600"
            >
              <option value="harvest_peak">Peak Harvest</option>
              <option value="lean_season">Lean Season</option>
              <option value="pre_sowing">Pre-Sowing</option>
            </select>
          </div>

          {/* 7. Buyer Demand Index */}
          <div>
            <label className="text-[10px] font-bold uppercase text-soil-500 block mb-1">7. Buyer Demand</label>
            <select
              value={buyerDemandLevel}
              onChange={(e) => setBuyerDemandLevel(e.target.value)}
              className="w-full bg-white border border-soil-300 rounded-lg px-2 py-1.5 font-semibold text-soil-900 focus:outline-none focus:border-canopy-600"
            >
              <option value="high">High (Corporate)</option>
              <option value="moderate">Moderate</option>
              <option value="low">Subdued</option>
            </select>
          </div>
        </div>
      </div>

      {/* Factor Breakdown Waterfall List */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-soil-600 block">
          Price Influence Component Breakdown (₹/Quintal):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {prediction.factors.map((f, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-white border border-soil-200 flex items-center justify-between text-xs hover:border-canopy-600 transition-colors"
            >
              <div>
                <span className="font-bold text-soil-950 block">{f.name}</span>
                <span className="text-[10px] text-soil-500">{f.description}</span>
              </div>
              <span className={`font-mono font-bold text-sm ${
                i === 0
                  ? "text-soil-900"
                  : f.amount > 0
                  ? "text-signal-good"
                  : f.amount < 0
                  ? "text-signal-bad"
                  : "text-soil-400"
              }`}>
                {i === 0 ? `₹${f.amount}` : f.amount > 0 ? `+₹${f.amount}` : f.amount < 0 ? `-₹${Math.abs(f.amount)}` : "₹0"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
