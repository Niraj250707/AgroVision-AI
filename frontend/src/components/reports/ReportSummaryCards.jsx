import { Card } from '../common/States';
import { formatINR, formatNumber } from '../../utils/format';

export default function ReportSummaryCards({ summary }) {
  const items = [
    { label: 'Total Decisions', value: formatNumber(summary.totalDecisions) },
    { label: 'On Target or Better', value: formatNumber(summary.onTargetOrBetter) },
    { label: 'Accuracy', value: `${summary.accuracyPercent}%` },
    { label: 'Total Actual Return', value: formatINR(summary.totalActualReturn) },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <p className="text-xs text-[var(--color-soil-600)]">{item.label}</p>
          <p className="mt-1 font-display text-xl font-semibold text-[var(--color-soil-950)]">{item.value}</p>
        </Card>
      ))}
    </div>
  );
}
