import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Card } from '../components/common/States';
import { formatINR } from '../utils/format';

function ReportTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[var(--color-soil-200)] bg-white px-3 py-2 shadow-md">
      <p className="text-xs text-[var(--color-soil-600)]">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-sm font-medium" style={{ color: p.color }}>
          {p.name}: {formatINR(p.value)}
        </p>
      ))}
    </div>
  );
}

export default function NetReturnChart({ data }) {
  return (
    <Card>
      <h3 className="mb-4 font-display text-lg font-semibold text-[var(--color-soil-950)]">Net Return — Expected vs. Actual</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--color-soil-100)" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-soil-600)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: 'var(--color-soil-600)' }} axisLine={false} tickLine={false} width={56} tickFormatter={(v) => `₹${v / 1000}k`} />
            <Tooltip content={<ReportTooltip />} />
            <Legend wrapperStyle={{ fontSize: 13 }} />
            <Bar dataKey="expected" name="Expected" fill="var(--color-soil-400)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="actual" name="Actual" fill="var(--color-canopy-700)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
