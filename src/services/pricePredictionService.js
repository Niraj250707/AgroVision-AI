/**
 * Multi-Factor Agricultural Price Prediction Engine
 * Calculates projected mandi prices and optimal selling windows considering:
 * 1. Historical Prices (30/90-day moving averages and trends)
 * 2. Mandi Arrivals (Daily quintal supply volume vs normal absorption)
 * 3. Weather Conditions (Rainfall, temperature, transport bottlenecks)
 * 4. Transport & Logistics Cost (Distance km, vehicle freight, fuel surcharge)
 * 5. Quality Grade (Grade A premium, Grade B modal, Grade C discount)
 * 6. Seasonality Cycle (Peak harvest, lean supply period, festive demand)
 * 7. Buyer Demand Index (Institutional procurement volume & active tenders)
 */

export const CROP_BASE_PRICES = {
  Cotton: { base: 7450, msp: 7122, unit: "qtl", category: "durable", shelfLifeDays: 365 },
  Onion: { base: 2350, msp: 1800, unit: "qtl", category: "semi-perishable", shelfLifeDays: 90 },
  Soybean: { base: 4650, msp: 4892, unit: "qtl", category: "durable", shelfLifeDays: 270 },
  Wheat: { base: 2850, msp: 2275, unit: "qtl", category: "durable", shelfLifeDays: 365 },
  Tomato: { base: 1950, msp: 1400, unit: "qtl", category: "perishable", shelfLifeDays: 5 },
  Potato: { base: 1650, msp: 1250, unit: "qtl", category: "semi-perishable", shelfLifeDays: 120 },
  Turmeric: { base: 14200, msp: 12000, unit: "qtl", category: "durable", shelfLifeDays: 365 },
  Mustard: { base: 5650, msp: 5650, unit: "qtl", category: "durable", shelfLifeDays: 300 }
};

/**
 * Predicts commodity price based on multiple agricultural factors
 */
export function predictCommodityPrice({
  crop = "Cotton",
  grade = "Grade A", // Grade A | Grade B | Grade C
  arrivalsTrend = "normal", // high (oversupply) | normal | low (scarcity)
  weatherCondition = "clear", // clear | rainy | cyclone
  distanceKm = 45,
  vehicleType = "pickup", // tractor | pickup | truck
  seasonPhase = "harvest_peak", // harvest_peak | lean_season | pre_sowing
  buyerDemandLevel = "high", // high | moderate | low
  forecastDays = 7 // 7 | 15 | 30
}) {
  const cropConfig = CROP_BASE_PRICES[crop] || CROP_BASE_PRICES.Cotton;
  const baseRate = cropConfig.base;

  // 1. Quality Grade Multiplier
  let gradeImpact = 0;
  if (grade === "Grade A") {
    gradeImpact = Math.round(baseRate * 0.095); // +9.5% premium
  } else if (grade === "Grade C") {
    gradeImpact = -Math.round(baseRate * 0.08); // -8% discount
  } else {
    gradeImpact = 0; // Grade B is baseline modal
  }

  // 2. Arrivals Impact (Supply & Demand pressure)
  let arrivalsImpact = 0;
  if (arrivalsTrend === "high") {
    arrivalsImpact = -Math.round(baseRate * 0.065); // -6.5% downward price pressure
  } else if (arrivalsTrend === "low") {
    arrivalsImpact = Math.round(baseRate * 0.08); // +8% upward scarcity price pressure
  }

  // 3. Weather & Road Transit Disruption Impact
  let weatherImpact = 0;
  if (weatherCondition === "rainy") {
    // For perishables, rain damages crops & raises local market prices; for grains, dampens moisture
    weatherImpact = cropConfig.category === "perishable" ? Math.round(baseRate * 0.07) : -Math.round(baseRate * 0.03);
  } else if (weatherCondition === "cyclone") {
    weatherImpact = Math.round(baseRate * 0.12); // severe supply disruption
  }

  // 4. Logistics & Transport Deduction
  let freightPerQtl = 0;
  const ratePerKm = vehicleType === "truck" ? 22 : vehicleType === "pickup" ? 16 : 12;
  const totalFreight = distanceKm * ratePerKm + 250; // base loading charge
  const estimatedLotQty = vehicleType === "truck" ? 150 : vehicleType === "pickup" ? 60 : 35;
  freightPerQtl = Math.round(totalFreight / estimatedLotQty);

  // 5. Seasonality Factor
  let seasonalityImpact = 0;
  if (seasonPhase === "lean_season") {
    seasonalityImpact = Math.round(baseRate * 0.11); // +11% off-season supply squeeze
  } else if (seasonPhase === "harvest_peak") {
    seasonalityImpact = -Math.round(baseRate * 0.04); // peak arrival pressure
  }

  // 6. Buyer Demand Index
  let buyerDemandImpact = 0;
  if (buyerDemandLevel === "high") {
    buyerDemandImpact = Math.round(baseRate * 0.075); // corporate bulk procurement active
  } else if (buyerDemandLevel === "low") {
    buyerDemandImpact = -Math.round(baseRate * 0.05);
  }

  // Time projection delta based on forecast days
  const timeProjectionDelta = forecastDays === 30 ? Math.round(baseRate * 0.04) : forecastDays === 15 ? Math.round(baseRate * 0.02) : 0;

  // Final predicted gross mandi price
  const predictedGrossRate = Math.max(
    cropConfig.msp,
    baseRate + gradeImpact + arrivalsImpact + weatherImpact + seasonalityImpact + buyerDemandImpact + timeProjectionDelta
  );

  // Net in-hand realization to farmer after deducting freight
  const netInHandRate = predictedGrossRate - freightPerQtl;

  // Determine recommendation strategy
  let strategy = "HOLD";
  let strategyReason = "";
  if (cropConfig.category === "perishable") {
    strategy = "SELL_TODAY";
    strategyReason = "Perishable produce has short shelf life. Same-day dispatch to verified buyers locks maximum freshness premium.";
  } else if (arrivalsTrend === "high" && forecastDays <= 7) {
    strategy = "HOLD";
    strategyReason = "Mandi arrivals currently peak. Withhold stock in dry storage for 15-20 days until market supply tightens.";
  } else if (predictedGrossRate > baseRate * 1.05) {
    strategy = "SELL_NOW";
    strategyReason = "Prices are trending 5-10% above historical modal benchmark with strong institutional demand.";
  } else {
    strategy = "HOLD_FOR_TARGET";
    strategyReason = "Maintain warehouse receipt (e-NWR) and set digital target price for corporate contract matching.";
  }

  return {
    crop,
    grade,
    baseRate,
    msp: cropConfig.msp,
    predictedGrossRate,
    netInHandRate,
    freightPerQtl,
    factors: [
      { name: "Historical Base Rate", amount: baseRate, description: "30-day APMC modal average" },
      { name: `Quality Grade (${grade})`, amount: gradeImpact, positive: gradeImpact >= 0, description: grade === "Grade A" ? "AGMARK Special export premium" : grade === "Grade C" ? "Moisture/defect discount" : "Standard FAQ baseline" },
      { name: `Arrivals Supply (${arrivalsTrend})`, amount: arrivalsImpact, positive: arrivalsImpact >= 0, description: arrivalsTrend === "high" ? "High arrivals causing price glut" : arrivalsTrend === "low" ? "Short arrivals driving bids up" : "Balanced supply" },
      { name: `Weather & Transit (${weatherCondition})`, amount: weatherImpact, positive: weatherImpact >= 0, description: weatherCondition === "clear" ? "Smooth highway haulage" : "Rain/cyclone transit disruption" },
      { name: `Seasonality (${seasonPhase})`, amount: seasonalityImpact, positive: seasonalityImpact >= 0, description: seasonPhase === "lean_season" ? "Lean period premium" : "Peak post-harvest window" },
      { name: `Buyer Demand (${buyerDemandLevel})`, amount: buyerDemandImpact, positive: buyerDemandImpact >= 0, description: buyerDemandLevel === "high" ? "FMCG & mill buyers actively buying" : "Sluggish demand" },
    ],
    strategy,
    strategyReason,
    cropCategory: cropConfig.category,
    shelfLifeDays: cropConfig.shelfLifeDays,
    forecastDays
  };
}
