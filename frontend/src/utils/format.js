export function formatINR(value) {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value) {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('en-IN').format(value);
}

export function formatKgAsQuintal(kg) {
  return `${formatNumber(kg)} kg`;
}

export const demandTone = {
  High: { bg: 'bg-[var(--color-signal-good)]/10', text: 'text-[var(--color-signal-good)]', dot: 'bg-[var(--color-signal-good)]' },
  Medium: { bg: 'bg-[var(--color-signal-warn)]/10', text: 'text-[var(--color-signal-warn)]', dot: 'bg-[var(--color-signal-warn)]' },
  Low: { bg: 'bg-[var(--color-signal-bad)]/10', text: 'text-[var(--color-signal-bad)]', dot: 'bg-[var(--color-signal-bad)]' },
};

export const riskTone = {
  Low: { bg: 'bg-[var(--color-signal-good)]/10', text: 'text-[var(--color-signal-good)]' },
  Medium: { bg: 'bg-[var(--color-signal-warn)]/10', text: 'text-[var(--color-signal-warn)]' },
  High: { bg: 'bg-[var(--color-signal-bad)]/10', text: 'text-[var(--color-signal-bad)]' },
};
