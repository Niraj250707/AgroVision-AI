const toneMap = {
  good: 'bg-[var(--color-signal-good)]/10 text-[var(--color-signal-good)]',
  warn: 'bg-[var(--color-signal-warn)]/10 text-[var(--color-signal-warn)]',
  bad: 'bg-[var(--color-signal-bad)]/10 text-[var(--color-signal-bad)]',
  neutral: 'bg-[var(--color-soil-200)] text-[var(--color-soil-600)]',
  brand: 'bg-[var(--color-canopy-700)]/10 text-[var(--color-canopy-700)]',
};

const demandToTone = { High: 'good', Medium: 'warn', Low: 'bad' };
const riskToTone = { Low: 'good', Medium: 'warn', High: 'bad' };

export default function Badge({ tone = 'neutral', children, dot = false }) {
  const cls = toneMap[tone] ?? toneMap.neutral;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export function DemandBadge({ level }) {
  return <Badge tone={demandToTone[level] ?? 'neutral'} dot>{level} demand</Badge>;
}

export function RiskBadge({ level }) {
  return <Badge tone={riskToTone[level] ?? 'neutral'}>{level} risk</Badge>;
}
