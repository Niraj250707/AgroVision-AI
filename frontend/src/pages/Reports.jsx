import { useAsyncData } from '../hooks/useAsyncData';
import { reportService } from '../services/reportService';
import { LoadingState, ErrorState, Card } from '../components/common/States';
import ReportSummaryCards from '../components/reports/ReportSummaryCards';
import NetReturnChart from '../charts/NetReturnChart';
import { formatINR, formatNumber } from '../utils/format';

export default function Reports() {
  const decisions = useAsyncData(() => reportService.getDecisions(), []);
  const trend = useAsyncData(() => reportService.getNetReturnTrend(), []);
  const summary = useAsyncData(() => reportService.getPerformanceSummary(), []);

  const isLoading = decisions.status === 'loading' || trend.status === 'loading' || summary.status === 'loading';
  const hasError = decisions.status === 'error' || trend.status === 'error' || summary.status === 'error';

  if (isLoading) return <LoadingState label="Building your reports…" />;
  if (hasError) return <ErrorState onRetry={() => { decisions.refetch(); trend.refetch(); summary.refetch(); }} />;

  return (
    <div className="flex flex-col gap-6">
      <ReportSummaryCards summary={summary.data} />
      <NetReturnChart data={trend.data} />

      <Card padded={false}>
        <h3 className="px-5 pt-5 font-display text-lg font-semibold text-[var(--color-soil-950)] sm:px-6 sm:pt-6">Previous Selling Decisions</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-y border-[var(--color-soil-200)] text-xs uppercase tracking-wide text-[var(--color-soil-600)]">
                <th className="px-5 py-3 font-medium sm:px-6">Date</th>
                <th className="px-3 py-3 font-medium">Crop</th>
                <th className="px-3 py-3 font-medium">Market</th>
                <th className="px-3 py-3 font-medium">Quantity</th>
                <th className="px-3 py-3 font-medium">Decision</th>
                <th className="px-3 py-3 font-medium">Expected Return</th>
                <th className="px-3 py-3 font-medium">Actual Return</th>
              </tr>
            </thead>
            <tbody>
              {decisions.data.map((d) => {
                const beat = d.actualReturn >= d.expectedReturn;
                return (
                  <tr key={d.id} className="border-b border-[var(--color-soil-100)] last:border-0">
                    <td className="px-5 py-3.5 text-[var(--color-soil-600)] sm:px-6">{d.date}</td>
                    <td className="px-3 py-3.5 font-medium text-[var(--color-soil-950)]">{d.crop}</td>
                    <td className="px-3 py-3.5 text-[var(--color-soil-800)]">{d.market}</td>
                    <td className="px-3 py-3.5 text-[var(--color-soil-800)]">{formatNumber(d.quantityKg)} kg</td>
                    <td className="px-3 py-3.5 text-[var(--color-soil-800)]">{d.decision}</td>
                    <td className="px-3 py-3.5 text-[var(--color-soil-950)]">{formatINR(d.expectedReturn)}</td>
                    <td className={`px-3 py-3.5 font-medium ${beat ? 'text-[var(--color-signal-good)]' : 'text-[var(--color-signal-bad)]'}`}>
                      {formatINR(d.actualReturn)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
