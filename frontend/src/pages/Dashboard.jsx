import { useApp } from '../store/AppContext';
import { useAsyncData } from '../hooks/useAsyncData';
import { marketService } from '../services/marketService';
import { recommendationService } from '../services/recommendationService';
import { LoadingState, ErrorState } from '../components/common/States';
import SummaryCards from '../components/dashboard/SummaryCards';
import AIRecommendationCard from '../components/recommendation/AIRecommendationCard';
import MarketComparison from '../components/market/MarketComparison';
import PriceTrendChart from '../charts/PriceTrendChart';
import CostBreakdownChart from '../charts/CostBreakdownChart';
import QuickActions from '../components/dashboard/QuickActions';

export default function Dashboard() {
  const { selectedCrop, unreadAlertCount } = useApp();

  const markets = useAsyncData(() => marketService.getComparison(), []);
  const trend7 = useAsyncData(() => marketService.getPriceTrend('7d'), []);
  const trend30 = useAsyncData(() => marketService.getPriceTrend('30d'), []);
  const cost = useAsyncData(() => marketService.getCostBreakdown(), []);
  const recommendation = useAsyncData(() => recommendationService.getPrimary(), []);

  const isLoading = markets.status === 'loading' || recommendation.status === 'loading' || cost.status === 'loading' || trend7.status === 'loading';
  const hasError = markets.status === 'error' || recommendation.status === 'error';

  if (isLoading) return <LoadingState label="Loading your farm overview…" />;
  if (hasError) return <ErrorState onRetry={() => { markets.refetch(); recommendation.refetch(); }} />;

  return (
    <div className="flex flex-col gap-6">
      <SummaryCards crop={selectedCrop} alertCount={unreadAlertCount} />

      <AIRecommendationCard recommendation={recommendation.data} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <MarketComparison markets={markets.data} />
        </div>
        <div className="xl:col-span-2">
          <CostBreakdownChart breakdown={cost.data} />
        </div>
      </div>

      <PriceTrendChart
        data7d={trend7.data}
        data30d={trend30.data}
        cropName={selectedCrop.name}
      />

      <QuickActions />
    </div>
  );
}
