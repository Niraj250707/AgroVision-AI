import { mockDelay } from './apiClient';
import { alerts, alertCategories } from '../data/alertData';

// Future: GET /alerts, PATCH /alerts/:id/read
export const alertService = {
  getAll: () => mockDelay(alerts),
  getCategories: () => mockDelay(alertCategories),
};
