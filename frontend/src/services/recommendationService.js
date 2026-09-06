import { mockDelay } from './apiClient';
import { primaryRecommendation, strategyComparison, bestStrategyId } from '../data/recommendationData';

// Future: GET /recommendations/:cropId — calls the ML/Groq/Gemini inference pipeline
export const recommendationService = {
  getPrimary: () => mockDelay(primaryRecommendation),
  getStrategyComparison: () => mockDelay({ strategies: strategyComparison, bestStrategyId }),
};
