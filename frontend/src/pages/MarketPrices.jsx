import { useMemo, useState } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { useAsyncData } from '../hooks/useAsyncData';
import { marketService } from '../services/marketService';
import { LoadingState, ErrorState, EmptyState, Card } from '../components/common/States';
import { DemandBadge } from '../components/common/Badge';
import Dropdown from '../components/common/Dropdown';
import PriceTrendChart from '../charts/PriceTrendChart';
import MarketComparison from '../components/market/MarketComparison';
import { cropsList, marketsList } from '../data/marketData';
import { formatINR, formatNumber } from '../utils/format';

const sortOptions = [
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'arrival_desc', label: 'Arrival: High to Low' },
];

export default function MarketPrices() {
  const [cropFilter, setCropFilter] = useState('');
  const [marketFilter, setMarketFilter] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('price_desc');

  const prices = useAsyncData(() => marketService.getAllPrices(), []);
  const comparison = useAsyncData(() => marketService.getComparison(), []);
  const trend7 = useAsyncData(() => marketService.getPriceTrend('7d'), []);
  const trend30 = useAsyncData(() => marketService.getPriceTrend('30d'), []);

  const filtered = useMemo(() => {
    if (prices.status !== 'success') return [];
    let rows = prices.data;
    if (cropFilter) rows = rows.filter((r) => r.crop === cropFilter);
    if (marketFilter) rows = rows.filter((r) => r.market === marketFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter((r) => r.crop.toLowerCase().includes(q) || r.market.toLowerCase().includes(q));
    }
    const sorted = [...rows].sort((a, b) => {
      if (sort === 'price_desc') return b.price - a.price;
      if (sort === 'price_asc') return a.price - b.price;
      if (sort === 'arrival_desc') return b.arrivalTonnes - a.arrivalTonnes;
      return 0;
    });
    return sorted;
  }, [prices.status, prices.data, cropFilter, marketFilter, search, sort]);

  if (prices.status === 'loading' || comparison.status === 'loading') return <LoadingState label="Loading market prices…" />;
  if (prices.status === 'error') return <ErrorState onRetry={prices.refetch} />;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Dropdown label="Crop" placeholder="All crops" options={cropsList} value={cropFilter} onChange={setCropFilter} />
          <Dropdown label="Market" placeholder="All markets" options={marketsList} value={marketFilter} onChange={setMarketFilter} />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="search-prices" className="text-sm font-medium text-[var(--color-soil-800)]">Search</label>
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-soil-400)]" />
              <input
                id="search-prices"
                placeholder="Search crop or market…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-soil-200)] bg-white py-2.5 pl-9 pr-3.5 text-sm focus:border-[var(--color-canopy-600)] focus:outline-none focus:ring-2 focus:ring-[var(--color-canopy-600)]/20"
              />
            </div>
          </div>
          <Dropdown label="Sort by" options={sortOptions} value={sort} onChange={setSort} />
        </div>
      </Card>

      <Card padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-soil-200)] text-xs uppercase tracking-wide text-[var(--color-soil-600)]">
                <th className="px-5 py-3 font-medium sm:px-6">Crop</th>
                <th className="px-3 py-3 font-medium">Market</th>
                <th className="px-3 py-3 font-medium">
                  <span className="inline-flex items-center gap-1">Price (₹/qtl) <ArrowUpDown size={12} /></span>
                </th>
                <th className="px-3 py-3 font-medium">Demand</th>
                <th className="px-3 py-3 font-medium">Arrival (tonnes)</th>
                <th className="px-3 py-3 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-[var(--color-soil-100)] last:border-0">
                  <td className="px-5 py-3.5 font-medium text-[var(--color-soil-950)] sm:px-6">{row.crop}</td>
                  <td className="px-3 py-3.5 text-[var(--color-soil-800)]">{row.market}</td>
                  <td className="px-3 py-3.5 font-medium text-[var(--color-soil-950)]">{formatINR(row.price)}</td>
                  <td className="px-3 py-3.5"><DemandBadge level={row.demand} /></td>
                  <td className="px-3 py-3.5 text-[var(--color-soil-800)]">{formatNumber(row.arrivalTonnes)}</td>
                  <td className="px-3 py-3.5 text-[var(--color-soil-600)]">{row.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <EmptyState title="No results" description="Try a different crop, market, or search term." />}
      </Card>

      <PriceTrendChart data7d={trend7.data ?? []} data30d={trend30.data ?? []} cropName={cropFilter || 'Cotton'} />

      {comparison.status === 'success' && <MarketComparison markets={comparison.data} />}
    </div>
  );
}
