import { ChevronDown } from 'lucide-react';

export default function Dropdown({ label, options, value, onChange, className = '', id, placeholder }) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-[var(--color-soil-800)]">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full appearance-none rounded-xl border border-[var(--color-soil-200)] bg-white px-3.5 py-2.5 pr-9 text-sm text-[var(--color-soil-950)] focus:border-[var(--color-canopy-600)] focus:outline-none focus:ring-2 focus:ring-[var(--color-canopy-600)]/20"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
              {typeof opt === 'string' ? opt : opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-soil-600)]" />
      </div>
    </div>
  );
}
