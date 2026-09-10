import React, { useState, useEffect, useId } from "react";
import {
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Database,
  Calendar,
  Layers,
  AlertCircle,
  Wifi,
  WifiOff,
  DownloadCloud,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { fetchHistoricalPriceTrends } from "../../services/dataGovApi";
import { precacheAgriculturalData } from "../../registerServiceWorker";
import { useLocale } from "../../context/LocaleContext";

const COMMODITIES = [
  { id: "Cotton", en: "Cotton", hi: "कपास", mr: "कापूस", gu: "કપાસ" },
  { id: "Onion", en: "Red Onion", hi: "लाल प्याज", mr: "कांदा", gu: "ડુંગળી" },
  { id: "Soybean", en: "Soybean", hi: "सोयाबीन", mr: "सोयाबीन", gu: "સોયાબીન" },
  { id: "Wheat", en: "Wheat", hi: "गेहूं", mr: "गहू", gu: "ઘઉં" },
  { id: "Maize", en: "Maize", hi: "मक्का", mr: "मका", gu: "મકાઈ" },
  { id: "Potato", en: "Potato", hi: "आलू", mr: "बटाटा", gu: "બટાકા" },
  { id: "Tomato", en: "Tomato", hi: "टमाटर", mr: "टोमॅटो", gu: "ટામેટા" },
  { id: "Mustard", en: "Mustard", hi: "सरसों", mr: "मोहरी", gu: "રાયડો" },
];

const TIMEFRAMES = [
  { label: "7D", days: 7 },
  { label: "15D", days: 15 },
  { label: "30D", days: 30 },
  { label: "3M", days: 90 },
];

export default function HistoricalPriceTrendsChart({ initialCommodity = "Cotton" }) {
  const { locale, formatCurrency, t } = useLocale();
  const chartId = useId();

  const [commodity, setCommodity] = useState(initialCommodity);
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWarmingCache, setIsWarmingCache] = useState(false);
  const [cacheWarmedSuccess, setCacheWarmedSuccess] = useState(false);

  // Toggleable chart layers
  const [showMovingAvg, setShowMovingAvg] = useState(true);
  const [showMinMax, setShowMinMax] = useState(true);
  const [showMspLine, setShowMspLine] = useState(true);
  const [showArrivals, setShowArrivals] = useState(false);

  // Synchronize when initialCommodity prop changes
  useEffect(() => {
    if (initialCommodity) {
      setCommodity(initialCommodity);
    }
  }, [initialCommodity]);

  // Load trends data
  const loadTrends = async (force = false) => {
    setLoading(true);
    try {
      const result = await fetchHistoricalPriceTrends({
        commodity,
        days,
        forceRefresh: force,
      });
      setData(result);
    } catch (err) {
      console.warn("Failed to load historical price trends:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrends(false);
  }, [commodity, days]);

  const handleWarmCache = async () => {
    setIsWarmingCache(true);
    setCacheWarmedSuccess(false);
    try {
      await precacheAgriculturalData();
      setCacheWarmedSuccess(true);
      setTimeout(() => setCacheWarmedSuccess(false), 4000);
    } catch (e) {
      console.warn("Cache warming failed:", e);
    } finally {
      setIsWarmingCache(false);
    }
  };

  const trends = data?.trends || [];
  const summary = data?.summary || {};
  const isUpward = summary.percentChange >= 0;

  // Compute nice Y-axis domain
  const modalPrices = trends.map((t) => t.modalPrice).filter(Boolean);
  const minVal = modalPrices.length > 0 ? Math.min(...modalPrices) : 5000;
  const maxVal = modalPrices.length > 0 ? Math.max(...modalPrices) : 7000;
  const yPadding = Math.round((maxVal - minVal) * 0.15) || 150;
  const yDomain = [Math.max(0, minVal - yPadding), maxVal + yPadding];

  // Localized commodity name
  const currentCommObj = COMMODITIES.find((c) => c.id === commodity) || COMMODITIES[0];
  const localizedCommName = currentCommObj[locale] || currentCommObj.en;

  return (
    <div className="bg-white rounded-2xl border border-soil-200 shadow-sm overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 sm:p-6 border-b border-soil-100 bg-gradient-to-r from-soil-50/70 via-white to-soil-50/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-800 text-white border border-emerald-700 shadow-2xs">
                <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                {locale === "gu" ? "e-NAM અધિકૃત ભાવ વલણ" : locale === "hi" ? "e-NAM अधिकृत भाव रुझान" : "e-NAM Verified Price Trends"}
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Wifi className="w-3 h-3 text-emerald-600" />
                {locale === "gu" ? "દૈનિક લાઇવ અપડેટ" : locale === "hi" ? "दैनिक लाइव अपडेट" : "Daily Live Synced"}
              </span>
            </div>

            <h3 className="font-display text-lg sm:text-xl font-bold text-canopy-950 tracking-tight flex items-center gap-2">
              <span>{localizedCommName}</span>
              <span className="text-soil-500 text-sm font-normal">
                — {t("historicalPriceTrends", "Historical Price Trends & MSP Analysis")}
              </span>
            </h3>
            <p className="text-xs text-soil-600 mt-0.5">
              Interactive Recharts time series reflecting daily APMC modal arrivals and government support benchmarks.
            </p>
          </div>

          {/* Controls: Commodity Selector, Timeframe, Refresh */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Commodity Select */}
            <select
              value={commodity}
              onChange={(e) => setCommodity(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-white border border-soil-300 text-soil-800 focus:outline-none focus:border-canopy-600 shadow-2xs cursor-pointer"
            >
              {COMMODITIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c[locale] || c.en} ({c.en})
                </option>
              ))}
            </select>

            {/* Timeframe Chips */}
            <div className="flex items-center bg-soil-100/80 p-1 rounded-xl border border-soil-200">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf.label}
                  onClick={() => setDays(tf.days)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    days === tf.days
                      ? "bg-white text-canopy-950 shadow-2xs border border-soil-200"
                      : "text-soil-600 hover:text-soil-900"
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => loadTrends(true)}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-soil-300 text-soil-800 hover:bg-soil-50 transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
              title="Sync Latest Government Agmarknet Rates"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-canopy-700 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Syncing..." : "Sync"}</span>
            </button>
          </div>
        </div>

        {/* Executive KPI Stats Ribbon */}
        {summary.currentPrice && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-soil-100">
            {/* Current Modal Price */}
            <div className="bg-white p-3 rounded-xl border border-soil-200/80 shadow-2xs">
              <span className="text-[11px] font-medium text-soil-500 uppercase tracking-wider block">
                Latest APMC Rate
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-display font-bold text-canopy-950">
                  {formatCurrency(summary.currentPrice)}
                </span>
                <span className="text-[11px] text-soil-500">/ Qtl</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs font-semibold">
                {isUpward ? (
                  <span className="text-emerald-700 flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +{formatCurrency(Math.abs(summary.priceChange))} (+{summary.percentChange}%)
                  </span>
                ) : (
                  <span className="text-rose-700 flex items-center gap-0.5">
                    <TrendingDown className="w-3.5 h-3.5" />
                    -{formatCurrency(Math.abs(summary.priceChange))} ({summary.percentChange}%)
                  </span>
                )}
                <span className="text-soil-400 text-[10px]">in {days}d</span>
              </div>
            </div>

            {/* Govt MSP Comparison */}
            <div className="bg-white p-3 rounded-xl border border-soil-200/80 shadow-2xs">
              <span className="text-[11px] font-medium text-soil-500 uppercase tracking-wider block">
                Govt MSP Benchmark
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-lg font-display font-bold text-soil-900">
                  {summary.msp ? formatCurrency(summary.msp) : "N/A"}
                </span>
                {summary.msp && <span className="text-[11px] text-soil-500">/ Qtl</span>}
              </div>
              <div className="mt-1">
                {summary.msp ? (
                  summary.isAboveMsp ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      +{formatCurrency(summary.mspDifference)} Above MSP
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-md border border-rose-200">
                      <AlertCircle className="w-3 h-3" />
                      {formatCurrency(summary.mspDifference)} Below MSP
                    </span>
                  )
                ) : (
                  <span className="text-[11px] text-soil-500">Free Market Commodity</span>
                )}
              </div>
            </div>

            {/* Period High / Low */}
            <div className="bg-white p-3 rounded-xl border border-soil-200/80 shadow-2xs">
              <span className="text-[11px] font-medium text-soil-500 uppercase tracking-wider block">
                {days}-Day Price Range
              </span>
              <div className="text-xs font-semibold text-soil-800 mt-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-soil-500">High:</span>
                  <span className="font-bold text-emerald-800">{formatCurrency(summary.highestPrice)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-soil-500">Low:</span>
                  <span className="font-bold text-rose-800">{formatCurrency(summary.lowestPrice)}</span>
                </div>
              </div>
              <div className="text-[10px] text-soil-500 mt-1">
                Spread: {formatCurrency(summary.highestPrice - summary.lowestPrice)}/Qtl
              </div>
            </div>

            {/* Trading Mandi & Market Advice */}
            <div className="bg-white p-3 rounded-xl border border-soil-200/80 shadow-2xs">
              <span className="text-[11px] font-medium text-soil-500 uppercase tracking-wider block">
                APMC Reference Yard
              </span>
              <div className="font-semibold text-xs text-canopy-950 truncate mt-1">
                {summary.mandi || "Primary State APMC"}
              </div>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isUpward
                      ? "bg-emerald-100 text-emerald-900"
                      : "bg-amber-100 text-amber-900"
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  {isUpward ? "Bullish Demand Curve" : "Harvest Arrival Inflow"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recharts Interactive Chart Area */}
      <div className="p-4 sm:p-6">
        {/* Layer Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-soil-700 text-xs flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-canopy-700" />
              Chart Layers:
            </span>

            <label className="flex items-center gap-1.5 cursor-pointer select-none text-soil-700 hover:text-soil-950">
              <input
                type="checkbox"
                checked={showMovingAvg}
                onChange={(e) => setShowMovingAvg(e.target.checked)}
                className="w-3.5 h-3.5 text-blue-600 rounded border-soil-300 focus:ring-blue-500"
              />
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-blue-600 inline-block"></span>
                7-Day Moving Avg
              </span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none text-soil-700 hover:text-soil-950">
              <input
                type="checkbox"
                checked={showMinMax}
                onChange={(e) => setShowMinMax(e.target.checked)}
                className="w-3.5 h-3.5 text-amber-600 rounded border-soil-300 focus:ring-amber-500"
              />
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-amber-500 inline-block border-b border-dashed"></span>
                Min / Max Range
              </span>
            </label>

            {summary.msp && (
              <label className="flex items-center gap-1.5 cursor-pointer select-none text-soil-700 hover:text-soil-950">
                <input
                  type="checkbox"
                  checked={showMspLine}
                  onChange={(e) => setShowMspLine(e.target.checked)}
                  className="w-3.5 h-3.5 text-red-600 rounded border-soil-300 focus:ring-red-500"
                />
                <span className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-red-500 inline-block"></span>
                  MSP Benchmark ({formatCurrency(summary.msp)})
                </span>
              </label>
            )}

            <label className="flex items-center gap-1.5 cursor-pointer select-none text-soil-700 hover:text-soil-950">
              <input
                type="checkbox"
                checked={showArrivals}
                onChange={(e) => setShowArrivals(e.target.checked)}
                className="w-3.5 h-3.5 text-indigo-600 rounded border-soil-300 focus:ring-indigo-500"
              />
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2 bg-indigo-200 border border-indigo-500 inline-block rounded-xs"></span>
                Arrival Volumes (Qtl)
              </span>
            </label>
          </div>

          <div className="text-[11px] text-soil-500">
            Hover over chart data points to inspect daily APMC rates
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="h-[340px] sm:h-[380px] w-full">
          {loading ? (
            <div className="h-full w-full flex flex-col items-center justify-center gap-3 bg-soil-50/50 rounded-xl border border-dashed border-soil-200">
              <RefreshCw className="w-7 h-7 text-canopy-700 animate-spin" />
              <span className="text-xs font-semibold text-soil-600">
                Fetching historical price records from data.gov.in / Service Worker...
              </span>
            </div>
          ) : trends.length === 0 ? (
            <div className="h-full w-full flex flex-col items-center justify-center gap-2 bg-soil-50/50 rounded-xl border border-dashed border-soil-200">
              <AlertCircle className="w-7 h-7 text-soil-400" />
              <span className="text-xs font-semibold text-soil-600">
                No historical records available for {commodity} in this timeframe.
              </span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%" id={chartId}>
              <ComposedChart
                data={trends}
                margin={{ top: 10, right: 15, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />

                <XAxis
                  dataKey="displayDate"
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "#d1d5db" }}
                  dy={8}
                />

                <YAxis
                  yAxisId="price"
                  domain={yDomain}
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "#d1d5db" }}
                  tickFormatter={(val) => `₹${Number(val).toLocaleString("en-IN")}`}
                />

                {showArrivals && (
                  <YAxis
                    yAxisId="arrivals"
                    orientation="right"
                    tick={{ fill: "#6366f1", fontSize: 10 }}
                    tickLine={false}
                    axisLine={{ stroke: "#c7d2fe" }}
                    tickFormatter={(val) => `${Number(val).toLocaleString("en-IN")} Q`}
                  />
                )}

                {/* Tooltip */}
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload || !payload.length) return null;
                    const item = payload[0]?.payload;
                    if (!item) return null;

                    return (
                      <div className="bg-white/95 backdrop-blur-sm p-3.5 rounded-xl border border-soil-200 shadow-xl text-xs max-w-xs space-y-2">
                        <div className="flex items-center justify-between border-b border-soil-100 pb-1.5">
                          <span className="font-bold text-canopy-950 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-canopy-700" />
                            {label} ({item.date})
                          </span>
                          <span className="text-[10px] text-soil-500 font-mono">
                            {item.mandi}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-soil-600 font-medium">Modal Price:</span>
                            <span className="text-sm font-bold text-emerald-800">
                              {formatCurrency(item.modalPrice)}/Qtl
                            </span>
                          </div>

                          {showMovingAvg && item.movingAverage && (
                            <div className="flex items-center justify-between text-blue-700">
                              <span>7-Day Moving Avg:</span>
                              <span className="font-semibold">{formatCurrency(item.movingAverage)}</span>
                            </div>
                          )}

                          {showMinMax && (
                            <div className="flex items-center justify-between text-soil-600 text-[11px]">
                              <span>Min / Max Spread:</span>
                              <span className="font-mono">
                                {formatCurrency(item.minPrice)} – {formatCurrency(item.maxPrice)}
                              </span>
                            </div>
                          )}

                          {item.msp && (
                            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-soil-100">
                              <span className="text-soil-500">MSP Comparison:</span>
                              <span
                                className={`font-semibold ${
                                  item.modalPrice >= item.msp ? "text-emerald-700" : "text-rose-700"
                                }`}
                              >
                                {item.modalPrice >= item.msp
                                  ? `+${formatCurrency(item.modalPrice - item.msp)} above MSP`
                                  : `${formatCurrency(item.modalPrice - item.msp)} below MSP`}
                              </span>
                            </div>
                          )}

                          {item.arrivals && (
                            <div className="flex items-center justify-between text-[11px] text-indigo-700 pt-0.5">
                              <span>Daily APMC Arrivals:</span>
                              <span className="font-semibold">
                                {item.arrivals.toLocaleString("en-IN")} Quintals
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }}
                />

                {/* Optional Arrivals Area on Secondary Axis */}
                {showArrivals && (
                  <Area
                    yAxisId="arrivals"
                    type="monotone"
                    dataKey="arrivals"
                    fill="#e0e7ff"
                    stroke="#818cf8"
                    strokeWidth={1}
                    fillOpacity={0.4}
                    name="Arrivals (Qtl)"
                  />
                )}

                {/* Govt MSP Reference Line */}
                {showMspLine && summary.msp && (
                  <ReferenceLine
                    yAxisId="price"
                    y={summary.msp}
                    stroke="#ef4444"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{
                      value: `MSP: ₹${summary.msp.toLocaleString("en-IN")}`,
                      fill: "#b91c1c",
                      fontSize: 11,
                      position: "insideTopRight",
                      offset: 10,
                    }}
                  />
                )}

                {/* Max Price Line (Optional) */}
                {showMinMax && (
                  <Line
                    yAxisId="price"
                    type="monotone"
                    dataKey="maxPrice"
                    stroke="#f59e0b"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                    dot={false}
                    name="Max Rate"
                  />
                )}

                {/* Min Price Line (Optional) */}
                {showMinMax && (
                  <Line
                    yAxisId="price"
                    type="monotone"
                    dataKey="minPrice"
                    stroke="#9ca3af"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                    dot={false}
                    name="Min Rate"
                  />
                )}

                {/* 7-Day Moving Average Line (Optional) */}
                {showMovingAvg && (
                  <Line
                    yAxisId="price"
                    type="monotone"
                    dataKey="movingAverage"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={false}
                    name="7D Moving Avg"
                  />
                )}

                {/* Main Modal Price Line */}
                <Line
                  yAxisId="price"
                  type="monotone"
                  dataKey="modalPrice"
                  stroke="#15803d"
                  strokeWidth={2.5}
                  dot={{ r: days <= 15 ? 4 : 2, fill: "#15803d", stroke: "#ffffff", strokeWidth: 1.5 }}
                  activeDot={{ r: 6, fill: "#15803d", stroke: "#bbf7d0", strokeWidth: 2 }}
                  name="Modal Price (₹/Qtl)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Footer Banner: Cache API & Offline Resilience */}
        <div className="mt-4 p-3.5 bg-soil-50 rounded-xl border border-soil-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="p-1.5 bg-white rounded-lg border border-soil-200 text-canopy-700 shadow-2xs shrink-0">
              <DownloadCloud className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-canopy-950">
                Cache API & Progressive Service Worker Active
              </p>
              <p className="text-[11px] text-soil-600">
                All daily price curves and government mandi records are automatically cached locally. Charts function smoothly in rural areas with spotty or zero cellular coverage.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {cacheWarmedSuccess ? (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                All 8 Crops Cached Offline!
              </span>
            ) : (
              <button
                onClick={handleWarmCache}
                disabled={isWarmingCache}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-soil-300 text-soil-800 hover:bg-soil-100 font-semibold text-xs transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
                title="Pre-cache all 8 major agricultural commodities into browser Cache API"
              >
                <DownloadCloud className={`w-3.5 h-3.5 text-canopy-700 ${isWarmingCache ? "animate-bounce" : ""}`} />
                <span>{isWarmingCache ? "Caching Data..." : "Cache All Crops Offline"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
