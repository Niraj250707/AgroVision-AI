// Mock market data. In production this is served by the Market/Agmarknet API.

export const marketComparison = [
  { id: 'mkt-anand', market: 'Anand Market', priceQuintal: 7450, demand: 'High', netReturn: 47600, distanceKm: 8, recommended: true },
  { id: 'mkt-vadodara', market: 'Vadodara Market', priceQuintal: 7200, demand: 'Medium', netReturn: 43100, distanceKm: 42, recommended: false },
  { id: 'mkt-ahmedabad', market: 'Ahmedabad Market', priceQuintal: 7000, demand: 'Medium', netReturn: 41200, distanceKm: 65, recommended: false },
  { id: 'mkt-rajkot', market: 'Rajkot Market', priceQuintal: 6800, demand: 'Low', netReturn: 38300, distanceKm: 128, recommended: false },
  { id: 'mkt-surat', market: 'Surat Market', priceQuintal: 6750, demand: 'Low', netReturn: 37900, distanceKm: 148, recommended: false },
];

export const priceTrend7Day = [
  { date: '23 May', price: 6950 },
  { date: '24 May', price: 7020 },
  { date: '25 May', price: 7080 },
  { date: '26 May', price: 7150 },
  { date: '27 May', price: 7180 },
  { date: '28 May', price: 7260 },
  { date: '29 May', price: 7200 },
];

export const priceTrend30Day = [
  { date: '30 Apr', price: 6600 }, { date: '3 May', price: 6650 }, { date: '6 May', price: 6700 },
  { date: '9 May', price: 6780 }, { date: '12 May', price: 6820 }, { date: '15 May', price: 6890 },
  { date: '18 May', price: 6900 }, { date: '21 May', price: 6980 }, { date: '24 May', price: 7020 },
  { date: '27 May', price: 7180 }, { date: '29 May', price: 7200 },
];

export const costBreakdown = {
  totalPerQuintal: 1250,
  items: [
    { label: 'Transport', value: 450, percent: 36, color: 'var(--color-canopy-600)' },
    { label: 'Storage', value: 300, percent: 24, color: 'var(--color-harvest-500)' },
    { label: 'Market Charges', value: 200, percent: 16, color: 'var(--color-soil-400)' },
    { label: 'Others', value: 300, percent: 24, color: 'var(--color-signal-warn)' },
  ],
};

// Extended dataset used by the Market Prices page (multiple crops x markets)
export const allMarketPrices = [
  { id: 1, crop: 'Cotton', market: 'Anand Market', price: 7450, demand: 'High', arrivalTonnes: 240, lastUpdated: '29 May 2025' },
  { id: 2, crop: 'Cotton', market: 'Vadodara Market', price: 7200, demand: 'Medium', arrivalTonnes: 180, lastUpdated: '29 May 2025' },
  { id: 3, crop: 'Cotton', market: 'Ahmedabad Market', price: 7000, demand: 'Medium', arrivalTonnes: 310, lastUpdated: '29 May 2025' },
  { id: 4, crop: 'Cotton', market: 'Rajkot Market', price: 6800, demand: 'Low', arrivalTonnes: 95, lastUpdated: '28 May 2025' },
  { id: 5, crop: 'Cotton', market: 'Surat Market', price: 6750, demand: 'Low', arrivalTonnes: 120, lastUpdated: '28 May 2025' },
  { id: 6, crop: 'Groundnut', market: 'Anand Market', price: 6100, demand: 'Medium', arrivalTonnes: 150, lastUpdated: '29 May 2025' },
  { id: 7, crop: 'Groundnut', market: 'Rajkot Market', price: 6250, demand: 'High', arrivalTonnes: 210, lastUpdated: '29 May 2025' },
  { id: 8, crop: 'Groundnut', market: 'Junagadh Market', price: 6300, demand: 'High', arrivalTonnes: 260, lastUpdated: '29 May 2025' },
  { id: 9, crop: 'Wheat', market: 'Anand Market', price: 2450, demand: 'Medium', arrivalTonnes: 400, lastUpdated: '29 May 2025' },
  { id: 10, crop: 'Wheat', market: 'Ahmedabad Market', price: 2500, demand: 'Medium', arrivalTonnes: 350, lastUpdated: '29 May 2025' },
  { id: 11, crop: 'Wheat', market: 'Vadodara Market', price: 2420, demand: 'Low', arrivalTonnes: 200, lastUpdated: '28 May 2025' },
];

export const marketsList = ['Anand Market', 'Vadodara Market', 'Ahmedabad Market', 'Rajkot Market', 'Surat Market', 'Junagadh Market'];
export const cropsList = ['Cotton', 'Groundnut', 'Wheat'];
