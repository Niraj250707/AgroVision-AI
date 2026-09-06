import { mockDelay } from './apiClient';
import { weatherToday } from '../data/farmerData';

// Future: GET /weather?lat=&lon= — backed by a real Weather API
export const weatherService = {
  getToday: () => mockDelay(weatherToday),
};
