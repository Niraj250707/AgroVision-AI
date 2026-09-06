import { ArrowRight } from 'lucide-react';
import { Card } from '../common/States';
import { formatINR, formatNumber } from '../../utils/format';

export default function StorageComparison({ sellNow, storeWait }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Card className="flex flex-col gap-3 border-l-4 border-l-[var(--color-canopy-600)]">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-soil-600)]">Sell Now</p>
        <p className="font-display text-2xl font-semibold text-[var(--color-soil-950)]">{formatINR(sellNow.netReturn)}</p>
        <p className="text-sm text-[var(--color-soil-600)]">Net return at current price of {formatINR(sellNow.price)}/quintal</p>
        <div className="mt-2 space-y-1.5 border-t border-[var(--color-soil-100)] pt-3 text-sm">
          <div className="flex justify-between"><span className="text-[var(--color-soil-600)]">Quantity</span><span className="font-medium">{formatNumber(sellNow.quantityKg)} kg</span></div>
          <div className="flex justify-between"><span className="text-[var(--color-soil-600)]">Storage cost avoided</span><span className="font-medium text-[var(--color-signal-good)]">{formatINR(sellNow.storageCostAvoided)}</span></div>
          <div className="flex justify-between"><span className="text-[var(--color-soil-600)]">Risk</span><span className="font-medium">Low — no price uncertainty</span></div>
        </div>
      </Card>

      <Card className="flex flex-col gap-3 border-l-4 border-l-[var(--color-harvest-500)]">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-soil-600)]">Store &amp; Wait</p>
        <p className="font-display text-2xl font-semibold text-[var(--color-soil-950)]">{formatINR(storeWait.netReturn)}</p>
        <p className="text-sm text-[var(--color-soil-600)]">Projected return after {storeWait.durationDays} days at expected price of {formatINR(storeWait.expectedFuturePrice)}/quintal</p>
        <div className="mt-2 space-y-1.5 border-t border-[var(--color-soil-100)] pt-3 text-sm">
          <div className="flex justify-between"><span className="text-[var(--color-soil-600)]">Storage cost</span><span className="font-medium text-[var(--color-signal-bad)]">{formatINR(storeWait.storageCost)}</span></div>
          <div className="flex justify-between"><span className="text-[var(--color-soil-600)]">Additional return</span><span className="font-medium text-[var(--color-signal-good)]">+{formatINR(storeWait.additionalReturn)}</span></div>
          <div className="flex justify-between"><span className="text-[var(--color-soil-600)]">Risk</span><span className="font-medium">{storeWait.risk} — price may fall</span></div>
        </div>
      </Card>

      <div className="sm:col-span-2 flex items-center justify-center gap-2 text-sm text-[var(--color-soil-600)]">
        <span>Sell Now</span>
        <ArrowRight size={14} />
        <span className="font-medium text-[var(--color-canopy-700)]">
          {storeWait.netReturn > sellNow.netReturn ? 'Store & Wait gives a higher projected return' : 'Sell Now gives a safer, comparable return'}
        </span>
      </div>
    </div>
  );
}
