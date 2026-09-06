import { Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-canopy-700)]/10 text-[var(--color-canopy-700)]">
        <Sprout size={26} />
      </span>
      <h1 className="font-display text-2xl font-semibold text-[var(--color-soil-950)]">Page not found</h1>
      <p className="max-w-sm text-sm text-[var(--color-soil-600)]">
        The page you're looking for doesn't exist. Head back to your dashboard to keep going.
      </p>
      <Button as={Link} to="/">Back to Dashboard</Button>
    </div>
  );
}
