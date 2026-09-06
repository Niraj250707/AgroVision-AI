import { Sprout, AlertTriangle, Loader2 } from 'lucide-react';

export function Card({ children, className = '', padded = true }) {
  return (
    <div className={`rounded-2xl border border-[var(--color-soil-200)]/70 bg-white shadow-[0_1px_2px_rgba(27,23,18,0.04),0_8px_24px_-16px_rgba(27,23,18,0.15)] ${padded ? 'p-5 sm:p-6' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-[var(--color-soil-600)]">
      <Loader2 className="animate-spin" size={22} />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({ title = 'Nothing here yet', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--color-soil-200)] py-16 text-center px-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-canopy-700)]/10 text-[var(--color-canopy-700)]">
        <Sprout size={20} />
      </div>
      <p className="font-medium text-[var(--color-soil-950)]">{title}</p>
      {description && <p className="max-w-sm text-sm text-[var(--color-soil-600)]">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ title = 'Something went wrong', description = 'We could not load this data. Try again.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--color-signal-bad)]/20 bg-[var(--color-signal-bad)]/5 py-16 text-center px-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-signal-bad)]/10 text-[var(--color-signal-bad)]">
        <AlertTriangle size={20} />
      </div>
      <p className="font-medium text-[var(--color-soil-950)]">{title}</p>
      <p className="max-w-sm text-sm text-[var(--color-soil-600)]">{description}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-sm font-medium text-[var(--color-canopy-700)] underline underline-offset-2">
          Try again
        </button>
      )}
    </div>
  );
}
