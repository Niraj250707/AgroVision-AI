const variants = {
  primary: 'bg-[var(--color-canopy-700)] text-white hover:bg-[var(--color-canopy-800)]',
  secondary: 'bg-white text-[var(--color-canopy-800)] border border-[var(--color-soil-200)] hover:border-[var(--color-canopy-600)]',
  ghost: 'text-[var(--color-canopy-800)] hover:bg-[var(--color-soil-100)]',
  harvest: 'bg-[var(--color-harvest-500)] text-white hover:bg-[var(--color-harvest-600)]',
};

const sizes = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2.5',
  lg: 'text-base px-5 py-3',
};

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  children,
  ...props
}) {
  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={16} strokeWidth={2} />}
      {children}
    </Component>
  );
}
