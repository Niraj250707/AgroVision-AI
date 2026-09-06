import { mockDelay } from './apiClient';
import { marketComparison, priceTrend7Day, priceTrend30Day, costBreakdown, allMarketPrices } from '../data/marketData';

// Future: GET /markets/compare, GET /markets/prices, GET /markets/price-trend
export const marketService = {
  getComparison: () => mockDelay(marketComparison),
  getPriceTrend: (range = '7d') => mockDelay(range === '30d' ? priceTrend30Day : priceTrend7Day),
  getCostBreakdown: () => mockDelay(costBreakdown),
  getAllPrices: () => mockDelay(allMarketPrices),
};
