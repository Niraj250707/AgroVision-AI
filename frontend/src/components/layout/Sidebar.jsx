import { NavLink } from 'react-router-dom';
import { Leaf, X, Bell } from 'lucide-react';
import { navItems } from './navConfig';
import { useApp } from '../../store/AppContext';

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5 px-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-harvest-500)] text-[var(--color-canopy-950)]">
        <Leaf size={18} strokeWidth={2.25} />
      </div>
      <div className="leading-tight">
        <p className="font-display text-base font-semibold text-white tracking-tight">Agrovision AI</p>
        <p className="text-[11px] text-[var(--color-canopy-500)]">Smart Decisions, Higher Returns</p>
      </div>
    </div>
  );
}

function NavList({ onNavigate }) {
  return (
    <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-thin px-2 py-6">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          onClick={onNavigate}
          className={({ isActive }) =>
            `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
              isActive
                ? 'bg-[var(--color-canopy-700)] text-white font-medium'
                : 'text-[var(--color-canopy-100,#cfe3d5)]/80 hover:bg-white/5 hover:text-white'
            }`
          }
        >
          <Icon size={18} strokeWidth={2} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

function FarmerFooter({ farmer }) {
  return (
    <div className="flex items-center gap-3 border-t border-white/10 px-3 py-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-harvest-400)] font-display text-sm font-semibold text-[var(--color-canopy-950)]">
        {farmer.avatarInitials}
      </div>
      <div className="min-w-0 leading-tight">
        <p className="truncate text-sm font-medium text-white">{farmer.name}</p>
        <p className="text-xs text-[var(--color-canopy-500)]">{farmer.role} · {farmer.location}</p>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { farmer, sidebarOpen, setSidebarOpen, unreadAlertCount } = useApp();

  return (
    <>
      {/* Desktop / tablet persistent sidebar */}
      <aside className="hidden md:flex md:w-64 lg:w-72 md:flex-col md:shrink-0 bg-[var(--color-canopy-950)] py-5">
        <BrandMark />
        <NavList />
        <FarmerFooter farmer={farmer} />
      </aside>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
          <div className="relative flex h-full w-72 max-w-[85%] flex-col bg-[var(--color-canopy-950)] py-5 shadow-xl">
            <div className="flex items-center justify-between px-2 mb-2">
              <BrandMark />
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Close menu"
                className="rounded-full p-2 text-white/70 hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>
            <NavList onNavigate={() => setSidebarOpen(false)} />
            <NavLink
              to="/alerts"
              onClick={() => setSidebarOpen(false)}
              className="mx-3 mb-3 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 text-sm text-white"
            >
              <Bell size={16} /> {unreadAlertCount} active alerts
            </NavLink>
            <FarmerFooter farmer={farmer} />
          </div>
        </div>
      )}
    </>
  );
}
