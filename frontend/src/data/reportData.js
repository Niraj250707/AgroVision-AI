// Mock historical decisions data. In production this is served by the Reports API.

export const pastDecisions = [
  { id: 'r1', date: '15 May 2025', crop: 'Wheat', market: 'Ahmedabad Market', quantityKg: 1200, expectedReturn: 28400, actualReturn: 29650, decision: 'Sell Now' },
  { id: 'r2', date: '02 May 2025', crop: 'Groundnut', market: 'Rajkot Market', quantityKg: 500, expectedReturn: 21200, actualReturn: 20100, decision: 'Sell Now' },
  { id: 'r3', date: '18 Apr 2025', crop: 'Cotton', market: 'Anand Market', quantityKg: 900, expectedReturn: 61200, actualReturn: 64300, decision: 'Store & Wait' },
  { id: 'r4', date: '03 Apr 2025', crop: 'Wheat', market: 'Vadodara Market', quantityKg: 1500, expectedReturn: 33800, actualReturn: 32950, decision: 'Split Quantity' },
  { id: 'r5', date: '22 Mar 2025', crop: 'Cotton', market: 'Surat Market', quantityKg: 750, expectedReturn: 49500, actualReturn: 48200, decision: 'Other Market' },
];

export const netReturnTrend = [
  { month: 'Dec', expected: 42000, actual: 40500 },
  { month: 'Jan', expected: 45500, actual: 47200 },
  { month: 'Feb', expected: 38200, actual: 37600 },
  { month: 'Mar', expected: 49500, actual: 48200 },
  { month: 'Apr', expected: 47500, actual: 48625 },
  { month: 'May', expected: 44300, actual: 44875 },
];

export const sellingPerformance = {
  totalDecisions: 24,
  onTargetOrBetter: 18,
  accuracyPercent: 75,
  totalActualReturn: 512400,
};
