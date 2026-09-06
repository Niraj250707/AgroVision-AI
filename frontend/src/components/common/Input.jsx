export default function Input({ label, error, hint, className = '', id, ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-soil-800)]">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[var(--color-soil-950)] placeholder:text-[var(--color-soil-400)] focus:border-[var(--color-canopy-600)] focus:outline-none focus:ring-2 focus:ring-[var(--color-canopy-600)]/20 ${
          error ? 'border-[var(--color-signal-bad)]' : 'border-[var(--color-soil-200)]'
        } ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-[var(--color-signal-bad)]">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${inputId}-hint`} className="text-xs text-[var(--color-soil-600)]">
          {hint}
        </p>
      )}
    </div>
  );
}
