import { Sprout, Calendar, MapPin } from 'lucide-react';
import { Card } from '../common/States';
import { DemandBadge } from '../common/Badge';
import { formatINR, formatNumber } from '../../utils/format';

export default function CropCard({ crop, selected, onSelect }) {
  return (
    <Card
      className={`flex flex-col gap-4 cursor-pointer transition-shadow ${selected ? 'ring-2 ring-[var(--color-canopy-600)]' : ''}`}
      padded
    >
      <button onClick={() => onSelect?.(crop.id)} className="flex flex-col gap-4 text-left w-full">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
              style={{ backgroundColor: crop.imageColor }}
            >
              <Sprout size={20} />
            </span>
            <div>
              <p className="font-display text-lg font-semibold text-[var(--color-soil-950)]">{crop.name}</p>
              <p className="text-xs text-[var(--color-soil-600)]">{crop.variety}</p>
            </div>
          </div>
          <DemandBadge level={crop.demand} />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-[var(--color-soil-600)]">Quantity</p>
            <p className="font-medium text-[var(--color-soil-950)]">{formatNumber(crop.quantityKg)} kg</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-soil-600)]">Current Price</p>
            <p className="font-medium text-[var(--color-soil-950)]">{formatINR(crop.currentPriceQuintal)}/qtl</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-soil-600)]">Expected Return</p>
            <p className="font-medium text-[var(--color-canopy-700)]">{formatINR(crop.expectedReturn)}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-soil-600)]">Status</p>
            <p className="font-medium text-[var(--color-soil-950)]">{crop.status}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[var(--color-soil-600)]">
          <Calendar size={13} /> Harvested {new Date(crop.harvestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          <span className="mx-1">·</span>
          <MapPin size={13} /> {crop.location}
        </div>

        <div className="rounded-lg bg-[var(--color-canopy-700)]/5 px-3 py-2 text-sm text-[var(--color-canopy-800)]">
          {crop.recommendation}
        </div>
      </button>
    </Card>
  );
}
