import { Sprout, IndianRupee, TrendingUp, Wallet, BellRing } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../common/States';
import { DemandBadge } from '../common/Badge';
import { formatINR, formatNumber } from '../../utils/format';

function SummaryCard({ icon: Icon, iconTone, eyebrow, primary, secondary, footer }) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-sm text-[var(--color-soil-600)]">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconTone}`}>
          <Icon size={16} />
        </span>
        {eyebrow}
      </div>
      <div>
        <p className="font-display text-2xl font-semibold text-[var(--color-soil-950)] sm:text-[26px]">{primary}</p>
        {secondary && <p className="text-sm text-[var(--color-soil-600)]">{secondary}</p>}
      </div>
      {footer}
    </Card>
  );
}

export default function SummaryCards({ crop, alertCount }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <SummaryCard
        icon={Sprout}
        iconTone="bg-[var(--color-canopy-700)]/10 text-[var(--color-canopy-700)]"
        eyebrow="Selected Crop"
        primary={crop.name}
        secondary={`${formatNumber(crop.quantityKg)} kg`}
      />
      <SummaryCard
        icon={IndianRupee}
        iconTone="bg-[var(--color-harvest-500)]/10 text-[var(--color-harvest-600)]"
        eyebrow="Avg. Market Price"
        primary={formatINR(crop.currentPriceQuintal)}
        secondary="per Quintal"
      />
      <SummaryCard
        icon={TrendingUp}
        iconTone="bg-[var(--color-signal-good)]/10 text-[var(--color-signal-good)]"
        eyebrow="Market Demand"
        primary={crop.demand}
        secondary="Good time to sell"
        footer={<DemandBadge level={crop.demand} />}
      />
      <SummaryCard
        icon={Wallet}
        iconTone="bg-[var(--color-canopy-700)]/10 text-[var(--color-canopy-700)]"
        eyebrow="Est. Net Return"
        primary={formatINR(crop.expectedReturn)}
        secondary="Best Strategy"
      />
      <SummaryCard
        icon={BellRing}
        iconTone="bg-[var(--color-signal-warn)]/10 text-[var(--color-signal-warn)]"
        eyebrow="Active Alerts"
        primary={alertCount}
        footer={
          <Link to="/alerts" className="text-sm font-medium text-[var(--color-canopy-700)] hover:underline">
            View Alerts →
          </Link>
        }
      />
    </div>
  );
}
