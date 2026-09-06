import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '../components/common/States';
import { formatINR } from '../utils/format';

function CostTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-lg border border-[var(--color-soil-200)] bg-white px-3 py-2 shadow-md">
      <p className="text-xs text-[var(--color-soil-600)]">{item.label}</p>
      <p className="font-display text-sm font-semibold text-[var(--color-soil-950)]">{formatINR(item.value)} · {item.percent}%</p>
    </div>
  );
}

export default function CostBreakdownChart({ breakdown }) {
  return (
    <Card>
      <div className="mb-4">
        <h3 className="font-display text-lg font-semibold text-[var(--color-soil-950)]">Cost Breakdown</h3>
        <p className="text-sm text-[var(--color-soil-600)]">Per Quintal</p>
      </div>

      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <div className="relative h-44 w-44 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={breakdown.items}
                dataKey="value"
                nameKey="label"
                innerRadius={54}
                outerRadius={78}
                paddingAngle={2}
                stroke="none"
              >
                {breakdown.items.map((item) => (
                  <Cell key={item.label} fill={item.color} />
                ))}
              </Pie>
              <Tooltip content={<CostTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xs text-[var(--color-soil-600)]">Total Cost</p>
            <p className="font-display text-lg font-semibold text-[var(--color-soil-950)]">{formatINR(breakdown.totalPerQuintal)}</p>
          </div>
        </div>

        <ul className="flex-1 space-y-2.5 self-stretch">
          {breakdown.items.map((item) => (
            <li key={item.label} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-[var(--color-soil-800)]">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.label}
              </span>
              <span className="font-medium text-[var(--color-soil-950)]">
                {formatINR(item.value)} <span className="text-[var(--color-soil-600)]">({item.percent}%)</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
