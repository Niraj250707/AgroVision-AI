import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Card } from '../common/States';
import { DemandBadge } from '../common/Badge';
import { formatINR } from '../../utils/format';

export default function MarketComparison({ markets }) {
  return (
    <Card padded={false}>
      <div className="flex items-center justify-between px-5 pt-5 sm:px-6 sm:pt-6">
        <h3 className="font-display text-lg font-semibold text-[var(--color-soil-950)]">Market Comparison</h3>
        <Link to="/market-prices" className="text-sm font-medium text-[var(--color-canopy-700)] hover:underline">
          View All Markets →
        </Link>
      </div>

      {/* Table on sm+; stacked cards on mobile */}
      <div className="mt-4 hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-y border-[var(--color-soil-200)] text-xs uppercase tracking-wide text-[var(--color-soil-600)]">
              <th className="px-5 py-3 font-medium sm:px-6">Market</th>
              <th className="px-3 py-3 font-medium">Price (₹/Quintal)</th>
              <th className="px-3 py-3 font-medium">Demand</th>
              <th className="px-3 py-3 font-medium">Est. Net Return</th>
            </tr>
          </thead>
          <tbody>
            {markets.map((m) => (
              <tr
                key={m.id}
                className={`border-b border-[var(--color-soil-100)] last:border-0 ${m.recommended ? 'bg-[var(--color-harvest-100)]/60' : ''}`}
              >
                <td className="px-5 py-3.5 sm:px-6">
                  <div className="flex items-center gap-2 font-medium text-[var(--color-soil-950)]">
                    {m.recommended && <Star size={14} className="fill-[var(--color-harvest-500)] text-[var(--color-harvest-500)]" />}
                    {m.market}
                  </div>
                </td>
                <td className="px-3 py-3.5 font-medium text-[var(--color-soil-950)]">{formatINR(m.priceQuintal)}</td>
                <td className="px-3 py-3.5"><DemandBadge level={m.demand} /></td>
                <td className="px-3 py-3.5 font-medium text-[var(--color-canopy-700)]">{formatINR(m.netReturn)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="mt-4 flex flex-col gap-3 px-5 pb-5 sm:hidden">
        {markets.map((m) => (
          <div
            key={m.id}
            className={`rounded-xl border p-4 ${m.recommended ? 'border-[var(--color-harvest-500)] bg-[var(--color-harvest-100)]/50' : 'border-[var(--color-soil-200)]'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-medium text-[var(--color-soil-950)]">
                {m.recommended && <Star size={14} className="fill-[var(--color-harvest-500)] text-[var(--color-harvest-500)]" />}
                {m.market}
              </div>
              <DemandBadge level={m.demand} />
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-[var(--color-soil-600)]">{formatINR(m.priceQuintal)} / quintal</span>
              <span className="font-medium text-[var(--color-canopy-700)]">{formatINR(m.netReturn)}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
