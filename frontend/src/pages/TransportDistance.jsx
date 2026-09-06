import { useApp } from '../store/AppContext';
import { useAsyncData } from '../hooks/useAsyncData';
import { transportService } from '../services/transportService';
import { LoadingState, ErrorState, Card } from '../components/common/States';
import TransportCard from '../components/transport/TransportCard';
import { MapPin } from 'lucide-react';

export default function TransportDistance() {
  const { farmer } = useApp();
  const routes = useAsyncData(() => transportService.getRoutes(), []);

  if (routes.status === 'loading') return <LoadingState label="Calculating routes…" />;
  if (routes.status === 'error') return <ErrorState onRetry={routes.refetch} />;

  const cheapest = routes.data.reduce((a, b) => (b.transportCost < a.transportCost ? b : a));

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-canopy-700)]/10 text-[var(--color-canopy-700)]">
          <MapPin size={18} />
        </span>
        <div>
          <p className="text-xs text-[var(--color-soil-600)]">Farmer Location</p>
          <p className="font-display text-base font-semibold text-[var(--color-soil-950)]">{farmer.location}</p>
        </div>
      </Card>

      <div>
        <h2 className="mb-1 font-display text-lg font-semibold text-[var(--color-soil-950)]">Compare markets by distance &amp; cost</h2>
        <p className="mb-4 text-sm text-[var(--color-soil-600)]">Mock estimates shown now — Google Maps Distance Matrix will power this once connected.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {routes.data.map((route) => (
            <TransportCard key={route.id} route={route} best={route.id === cheapest.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
