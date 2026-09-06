import { TrendingUp, CloudRain, Warehouse, Clock, Sparkles, BadgeAlert } from 'lucide-react';
import { Card } from '../common/States';

const typeIcon = {
  'Price Alert': TrendingUp,
  'Demand Alert': TrendingUp,
  'Weather Alert': CloudRain,
  'Storage Alert': Warehouse,
  'Selling Window Alert': Clock,
  'Recommendation Alert': Sparkles,
};

const severityTone = {
  positive: 'bg-[var(--color-signal-good)]/10 text-[var(--color-signal-good)]',
  warning: 'bg-[var(--color-signal-warn)]/10 text-[var(--color-signal-warn)]',
  neutral: 'bg-[var(--color-canopy-700)]/10 text-[var(--color-canopy-700)]',
};

export default function AlertCard({ alert }) {
  const Icon = typeIcon[alert.type] ?? BadgeAlert;
  return (
    <Card className={`flex gap-3 ${!alert.read ? 'border-[var(--color-canopy-600)]/40' : ''}`}>
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${severityTone[alert.severity]}`}>
        <Icon size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-[var(--color-soil-950)]">{alert.title}</p>
          {!alert.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--color-harvest-500)]" aria-label="Unread" />}
        </div>
        <p className="mt-1 text-sm text-[var(--color-soil-600)]">{alert.detail}</p>
        <div className="mt-2 flex items-center gap-2 text-xs text-[var(--color-soil-600)]">
          <span className="rounded-full bg-[var(--color-soil-100)] px-2 py-0.5">{alert.type}</span>
          <span>{alert.time}</span>
        </div>
      </div>
    </Card>
  );
}
