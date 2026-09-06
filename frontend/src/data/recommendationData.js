// Mock AI recommendation data. In production this is served by the Recommendation/ML API.

export const primaryRecommendation = {
  cropId: 'crop-cotton',
  cropName: 'Cotton',
  action: 'SELL',
  market: 'Anand Market',
  window: 'Within 3 Days',
  windowDate: '1 June 2025',
  allocateKg: 700,
  allocatePercent: 70,
  netReturn: 47600,
  reason: 'High demand in Anand Market with lower transport cost and good price trend',
  confidenceScore: 87,
  riskLevel: 'Low',
};

// Strategy comparison shown on the AI Recommendations page
export const strategyComparison = [
  {
    id: 'sell-now',
    label: 'Sell Now',
    market: 'Anand Market',
    quantityKg: 1000,
    expectedRevenue: 74500,
    transportCost: 3200,
    storageCost: 0,
    otherCosts: 1800,
    expectedLoss: 0,
    netReturn: 69500,
    riskLevel: 'Low',
    confidenceScore: 87,
    recommended: false,
  },
  {
    id: 'other-market',
    label: 'Other Market',
    market: 'Vadodara Market',
    quantityKg: 1000,
    expectedRevenue: 72000,
    transportCost: 5400,
    storageCost: 0,
    otherCosts: 1800,
    expectedLoss: 400,
    netReturn: 64400,
    riskLevel: 'Medium',
    confidenceScore: 74,
    recommended: false,
  },
  {
    id: 'store-wait',
    label: 'Store & Wait',
    market: 'Anand Market (later)',
    quantityKg: 1000,
    expectedRevenue: 78200,
    transportCost: 3200,
    storageCost: 4500,
    otherCosts: 1800,
    expectedLoss: 2100,
    netReturn: 66600,
    riskLevel: 'High',
    confidenceScore: 61,
    recommended: false,
  },
  {
    id: 'split-quantity',
    label: 'Split Quantity',
    market: 'Anand + Vadodara',
    quantityKg: 1000,
    expectedRevenue: 74900,
    transportCost: 4100,
    storageCost: 1500,
    otherCosts: 1800,
    expectedLoss: 300,
    netReturn: 67200,
    riskLevel: 'Medium',
    confidenceScore: 79,
    recommended: false,
  },
];

// Mark the best strategy programmatically (highest net return) rather than hardcoding twice
const best = strategyComparison.reduce((a, b) => (b.netReturn > a.netReturn ? b : a));
best.recommended = true;
export const bestStrategyId = best.id;
