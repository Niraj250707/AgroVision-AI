import { mockDelay } from './apiClient';
import { crops } from '../data/cropData';

// Future: GET /crops, POST /crops
export const cropService = {
  getAll: () => mockDelay(crops),
  getById: (id) => mockDelay(crops.find((c) => c.id === id) ?? null),
  create: (payload) => mockDelay({ id: `crop-${Date.now()}`, status: 'Pending', ...payload }),
};
