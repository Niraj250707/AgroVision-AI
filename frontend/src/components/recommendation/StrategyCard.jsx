import { CheckCircle2 } from 'lucide-react';
import { Card } from '../common/States';
import { RiskBadge } from '../common/Badge';
import { formatINR, formatNumber } from '../../utils/format';

function Row({ label, value, emphasis }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-[var(--color-soil-600)]">{label}</span>
      <span className={emphasis ? 'font-semibold text-[var(--color-canopy-700)]' : 'font-medium text-[var(--color-soil-950)]'}>{value}</span>
    </div>
  );
}

export default function StrategyCard({ strategy }) {
  const s = strategy;
  return (
    <Card className={`flex flex-col gap-3 ${s.recommended ? 'ring-2 ring-[var(--color-canopy-600)]' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-display text-base font-semibold text-[var(--color-soil-950)]">{s.label}</p>
          <p className="text-xs text-[var(--color-soil-600)]">{s.market}</p>
        </div>
        {s.recommended && (
          <span className="flex items-center gap-1 rounded-full bg-[var(--color-canopy-700)]/10 px-2.5 py-1 text-xs font-medium text-[var(--color-canopy-700)]">
            <CheckCircle2 size={13} /> Best
          </span>
        )}
      </div>

      <div className="divide-y divide-[var(--color-soil-100)]">
        <Row label="Quantity" value={`${formatNumber(s.quantityKg)} kg`} />
        <Row label="Expected Revenue" value={formatINR(s.expectedRevenue)} />
        <Row label="Transport Cost" value={formatINR(s.transportCost)} />
        <Row label="Storage Cost" value={formatINR(s.storageCost)} />
        <Row label="Other Costs" value={formatINR(s.otherCosts)} />
        <Row label="Expected Loss" value={formatINR(s.expectedLoss)} />
        <Row label="Expected Net Return" value={formatINR(s.netReturn)} emphasis />
      </div>

      <div className="flex items-center justify-between border-t border-[var(--color-soil-100)] pt-3">
        <RiskBadge level={s.riskLevel} />
        <span className="text-xs text-[var(--color-soil-600)]">Confidence: <strong className="text-[var(--color-soil-950)]">{s.confidenceScore}%</strong></span>
      </div>
    </Card>
  );
}
