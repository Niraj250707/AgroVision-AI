import { Menu, Bell, Cloud } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { weatherToday } from '../../data/farmerData';
import { navItems } from './navConfig';

export default function TopHeader() {
  const { farmer, setSidebarOpen, unreadAlertCount } = useApp();
  const location = useLocation();
  const isDashboard = location.pathname === '/';
  const pageTitle = navItems.find((n) => (n.to === '/' ? location.pathname === '/' : location.pathname.startsWith(n.to)))?.label ?? 'Agrovision AI';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[var(--color-soil-200)]/70 bg-[var(--color-soil-50)]/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-2 text-[var(--color-canopy-800)] hover:bg-[var(--color-soil-100)] md:hidden"
        >
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          {isDashboard ? (
            <>
              <h1 className="truncate font-display text-xl font-semibold text-[var(--color-soil-950)] sm:text-2xl">
                Namaste, {farmer.name.split(' ')[0]}! 👋
              </h1>
              <p className="truncate text-sm text-[var(--color-soil-600)]">Here's your farm &amp; market overview.</p>
            </>
          ) : (
            <h1 className="truncate font-display text-xl font-semibold text-[var(--color-soil-950)] sm:text-2xl">
              {pageTitle}
            </h1>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-[var(--color-soil-200)] bg-white px-3 py-1.5 text-sm text-[var(--color-soil-800)] sm:flex">
          <Cloud size={16} className="text-[var(--color-canopy-600)]" />
          <span className="font-medium">{weatherToday.tempC}°C</span>
          <span className="text-[var(--color-soil-600)]">{weatherToday.condition}</span>
        </div>
        <span className="hidden text-sm text-[var(--color-soil-600)] lg:inline">{weatherToday.date}</span>
        <Link
          to="/alerts"
          aria-label={`${unreadAlertCount} active alerts`}
          className="relative rounded-xl border border-[var(--color-soil-200)] bg-white p-2.5 text-[var(--color-canopy-800)] hover:border-[var(--color-canopy-600)]"
        >
          <Bell size={18} />
          {unreadAlertCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-harvest-500)] text-[10px] font-semibold text-white">
              {unreadAlertCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
