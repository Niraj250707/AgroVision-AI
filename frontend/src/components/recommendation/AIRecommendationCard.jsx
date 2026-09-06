import { Sparkles, MapPin, Clock, Scale, TrendingUp } from 'lucide-react';
import { Card } from '../common/States';
import { formatINR, formatNumber } from '../../utils/format';

function FactBlock({ icon: Icon, label, value, sub }) {
  return (
    <div className="flex flex-1 min-w-[140px] items-start gap-3 rounded-xl bg-white/60 p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-canopy-700)]/10 text-[var(--color-canopy-700)]">
        <Icon size={16} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-soil-600)]">{label}</p>
        <p className="mt-0.5 font-display text-lg font-semibold text-[var(--color-soil-950)] leading-tight">{value}</p>
        {sub && <p className="text-xs text-[var(--color-soil-600)]">{sub}</p>}
      </div>
    </div>
  );
}

export default function AIRecommendationCard({ recommendation }) {
  const r = recommendation;
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-[var(--color-canopy-800)] to-[var(--color-canopy-950)] text-white" padded={false}>
      <div className="p-5 sm:p-7">
        <div className="mb-5 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-harvest-500)] text-[var(--color-canopy-950)]">
            <Sparkles size={18} />
          </span>
          <div>
            <p className="font-display text-lg font-semibold leading-tight">AI Recommendation</p>
            <p className="text-sm text-[var(--color-canopy-500)]">Best strategy for you</p>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <span className="rounded-lg bg-[var(--color-harvest-500)] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-canopy-950)]">
            Sell at
          </span>
          <p className="font-display text-xl font-semibold sm:text-2xl">{r.market}</p>
        </div>

        <div className="flex flex-wrap gap-3 text-[var(--color-soil-950)]">
          <FactBlock icon={Clock} label="When to sell" value={r.window} sub={`By ${r.windowDate}`} />
          <FactBlock icon={Scale} label="How much to allocate" value={`${formatNumber(r.allocateKg)} kg`} sub={`${r.allocatePercent}% of total`} />
          <FactBlock icon={TrendingUp} label="Est. net return" value={formatINR(r.netReturn)} />
        </div>

        <div className="mt-5 flex items-start gap-2 border-t border-white/10 pt-4">
          <MapPin size={16} className="mt-0.5 shrink-0 text-[var(--color-harvest-400)]" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-canopy-500)]">Why this recommendation?</p>
            <p className="mt-1 text-sm text-white/90">{r.reason}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
