import { useMemo, useState } from 'react';
import { useAsyncData } from '../hooks/useAsyncData';
import { alertService } from '../services/alertService';
import { LoadingState, ErrorState, EmptyState } from '../components/common/States';
import AlertCard from '../components/alerts/AlertCard';
import { alertCategories } from '../data/alertData';

export default function Alerts() {
  const [category, setCategory] = useState('All');
  const alerts = useAsyncData(() => alertService.getAll(), []);

  const filtered = useMemo(() => {
    if (alerts.status !== 'success') return [];
    return category === 'All' ? alerts.data : alerts.data.filter((a) => a.type === category);
  }, [alerts.status, alerts.data, category]);

  if (alerts.status === 'loading') return <LoadingState label="Checking for new alerts…" />;
  if (alerts.status === 'error') return <ErrorState onRetry={alerts.refetch} />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {alertCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              category === cat
                ? 'bg-[var(--color-canopy-700)] text-white'
                : 'bg-white border border-[var(--color-soil-200)] text-[var(--color-soil-600)] hover:border-[var(--color-canopy-600)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No alerts in this category" description="You're all caught up here." />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
}
