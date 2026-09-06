import { useMemo } from 'react';
import { Warehouse, TrendingUp, IndianRupee, CalendarClock } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Card } from '../components/common/States';
import { RiskBadge } from '../components/common/Badge';
import StorageComparison from '../components/storage/StorageComparison';
import { formatINR, formatNumber } from '../utils/format';

function StatTile({ icon: Icon, label, value }) {
  return (
    <Card className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-canopy-700)]/10 text-[var(--color-canopy-700)]">
        <Icon size={18} />
      </span>
      <div>
        <p className="text-xs text-[var(--color-soil-600)]">{label}</p>
        <p className="font-display text-base font-semibold text-[var(--color-soil-950)]">{value}</p>
      </div>
    </Card>
  );
}

export default function StoragePlanner() {
  const { selectedCrop } = useApp();

  // Demo-only frontend calculation — this logic moves to the backend later.
  const model = useMemo(() => {
    const quantityKg = selectedCrop.quantityKg;
    const currentPrice = selectedCrop.currentPriceQuintal;
    const durationDays = 12;
    const expectedFuturePrice = Math.round(currentPrice * 1.06);
    const storageCapacityKg = 1500;
    const storageCostPerQuintalPerDay = 3.5;
    const quintals = quantityKg / 100;

    const sellNowRevenue = quintals * currentPrice;
    const storageCost = Math.round(quintals * storageCostPerQuintalPerDay * durationDays);
    const storeWaitRevenue = quintals * expectedFuturePrice;
    const additionalReturn = Math.max(storeWaitRevenue - sellNowRevenue - storageCost, 0);

    return {
      quantityKg,
      storageCapacityKg,
      storageCostPerQuintalPerDay,
      durationDays,
      currentPrice,
      expectedFuturePrice,
      sellNow: {
        price: currentPrice,
        quantityKg,
        netReturn: Math.round(sellNowRevenue),
        storageCostAvoided: storageCost,
      },
      storeWait: {
        durationDays,
        expectedFuturePrice,
        storageCost,
        additionalReturn: Math.round(additionalReturn),
        netReturn: Math.round(storeWaitRevenue - storageCost),
        risk: durationDays > 10 ? 'Medium' : 'Low',
      },
    };
  }, [selectedCrop]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile icon={Warehouse} label="Available Quantity" value={`${formatNumber(model.quantityKg)} kg`} />
        <StatTile icon={Warehouse} label="Storage Capacity" value={`${formatNumber(model.storageCapacityKg)} kg`} />
        <StatTile icon={IndianRupee} label="Storage Cost" value={`₹${model.storageCostPerQuintalPerDay}/qtl/day`} />
        <StatTile icon={CalendarClock} label="Storage Duration" value={`${model.durationDays} days`} />
      </div>

      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-harvest-500)]/10 text-[var(--color-harvest-600)]">
            <TrendingUp size={18} />
          </span>
          <div>
            <p className="text-xs text-[var(--color-soil-600)]">Current Price → Expected Future Price</p>
            <p className="font-display text-lg font-semibold text-[var(--color-soil-950)]">
              {formatINR(model.currentPrice)} → {formatINR(model.expectedFuturePrice)}
            </p>
          </div>
        </div>
        <RiskBadge level={model.storeWait.risk} />
      </Card>

      <div>
        <h2 className="mb-4 font-display text-lg font-semibold text-[var(--color-soil-950)]">Sell Now vs. Store &amp; Wait</h2>
        <StorageComparison sellNow={model.sellNow} storeWait={model.storeWait} />
      </div>
    </div>
  );
}
