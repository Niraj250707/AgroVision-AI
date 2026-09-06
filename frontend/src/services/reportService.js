import { mockDelay } from './apiClient';
import { pastDecisions, netReturnTrend, sellingPerformance } from '../data/reportData';

// Future: GET /reports/decisions, GET /reports/performance
export const reportService = {
  getDecisions: () => mockDelay(pastDecisions),
  getNetReturnTrend: () => mockDelay(netReturnTrend),
  getPerformanceSummary: () => mockDelay(sellingPerformance),
};
