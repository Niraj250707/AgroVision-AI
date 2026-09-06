import { Link } from 'react-router-dom';
import { LineChart, Warehouse, Truck, Sparkles, FileBarChart, PlusCircle } from 'lucide-react';
import { Card } from '../common/States';

const actions = [
  { to: '/market-prices', label: 'Check Market Prices', icon: LineChart },
  { to: '/storage-planner', label: 'Storage Planner', icon: Warehouse },
  { to: '/transport', label: 'Transport & Distance', icon: Truck },
  { to: '/ai-recommendations', label: 'AI Recommendations', icon: Sparkles },
  { to: '/reports', label: 'My Reports', icon: FileBarChart },
  { to: '/crop-overview?add=1', label: 'Add New Crop', icon: PlusCircle },
];

export default function QuickActions() {
  return (
    <Card>
      <h3 className="mb-4 font-display text-lg font-semibold text-[var(--color-soil-950)]">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {actions.map(({ to, label, icon: Icon }) => (
          <Link
            key={label}
            to={to}
            className="flex flex-col items-start gap-2.5 rounded-xl border border-[var(--color-soil-200)] p-4 text-sm font-medium text-[var(--color-soil-800)] transition-colors hover:border-[var(--color-canopy-600)] hover:bg-[var(--color-canopy-700)]/5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-canopy-700)]/10 text-[var(--color-canopy-700)]">
              <Icon size={17} />
            </span>
            {label}
          </Link>
        ))}
      </div>
    </Card>
  );
}
