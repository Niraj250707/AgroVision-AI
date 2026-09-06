import { mockDelay } from './apiClient';
import { marketComparison } from '../data/marketData';
import { currentFarmer } from '../data/farmerData';

// Future: GET /transport/distance — backed by Google Maps Distance Matrix API
export const transportService = {
  getRoutes: () =>
    mockDelay(
      marketComparison.map((m) => ({
        id: m.id,
        market: m.market,
        farmerLocation: currentFarmer.location,
        distanceKm: m.distanceKm,
        travelTimeMin: Math.round(m.distanceKm * 1.5),
        costPerKm: 12,
        transportCost: Math.round(m.distanceKm * 12),
      }))
    ),
};
