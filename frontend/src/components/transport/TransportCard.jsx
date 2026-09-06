import { MapPin, Clock, Truck } from 'lucide-react';
import { Card } from '../common/States';
import { formatINR, formatNumber } from '../../utils/format';

export default function TransportCard({ route, best }) {
  return (
    <Card className={`flex flex-col gap-3 ${best ? 'ring-2 ring-[var(--color-canopy-600)]' : ''}`}>
      <div className="flex items-center justify-between">
        <p className="font-display text-base font-semibold text-[var(--color-soil-950)]">{route.market}</p>
        {best && <span className="rounded-full bg-[var(--color-canopy-700)]/10 px-2.5 py-1 text-xs font-medium text-[var(--color-canopy-700)]">Lowest cost</span>}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-[var(--color-soil-600)]">
        <MapPin size={13} /> {route.farmerLocation} → {route.market}
      </div>
      <div className="grid grid-cols-2 gap-3 border-t border-[var(--color-soil-100)] pt-3 text-sm">
        <div>
          <p className="text-xs text-[var(--color-soil-600)]">Distance</p>
          <p className="font-medium text-[var(--color-soil-950)]">{formatNumber(route.distanceKm)} km</p>
        </div>
        <div>
          <p className="flex items-center gap-1 text-xs text-[var(--color-soil-600)]"><Clock size={11} /> Travel Time</p>
          <p className="font-medium text-[var(--color-soil-950)]">{route.travelTimeMin} min</p>
        </div>
        <div>
          <p className="flex items-center gap-1 text-xs text-[var(--color-soil-600)]"><Truck size={11} /> Transport Cost</p>
          <p className="font-medium text-[var(--color-soil-950)]">{formatINR(route.transportCost)}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--color-soil-600)]">Cost per km</p>
          <p className="font-medium text-[var(--color-soil-950)]">₹{route.costPerKm}</p>
        </div>
      </div>
    </Card>
  );
}
