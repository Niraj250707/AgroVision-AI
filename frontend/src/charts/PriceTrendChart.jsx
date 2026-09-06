import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card } from '../components/common/States';
import { formatINR } from '../utils/format';

function TrendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[var(--color-soil-200)] bg-white px-3 py-2 shadow-md">
      <p className="text-xs text-[var(--color-soil-600)]">{label}</p>
      <p className="font-display text-sm font-semibold text-[var(--color-soil-950)]">{formatINR(payload[0].value)}</p>
    </div>
  );
}

export default function PriceTrendChart({ data7d, data30d, cropName = 'Cotton', onRangeChange }) {
  const [range, setRange] = useState('7d');
  const data = range === '7d' ? data7d : data30d;

  function handleRange(r) {
    setRange(r);
    onRangeChange?.(r);
  }

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-[var(--color-soil-950)]">Price Trend</h3>
          <p className="text-sm text-[var(--color-soil-600)]">{cropName} · ₹/Quintal</p>
        </div>
        <div className="flex rounded-lg border border-[var(--color-soil-200)] p-0.5 text-sm">
          {[{ id: '7d', label: '7 Days' }, { id: '30d', label: '30 Days' }].map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleRange(opt.id)}
              className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                range === opt.id ? 'bg-[var(--color-canopy-700)] text-white' : 'text-[var(--color-soil-600)] hover:text-[var(--color-soil-950)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-canopy-600)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-canopy-600)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--color-soil-100)" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'var(--color-soil-600)' }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 12, fill: 'var(--color-soil-600)' }}
              axisLine={false}
              tickLine={false}
              width={56}
              tickFormatter={(v) => `₹${v}`}
              domain={['dataMin - 100', 'dataMax + 100']}
            />
            <Tooltip content={<TrendTooltip />} />
            <Area type="monotone" dataKey="price" stroke="var(--color-canopy-700)" strokeWidth={2.5} fill="url(#priceFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
