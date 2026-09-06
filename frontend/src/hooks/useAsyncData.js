import { useEffect, useState, useCallback } from 'react';

// Wraps any service call (mock today, real API later) with loading/error/data state
// so every page can show Loading / Error / Empty / Normal consistently.
export function useAsyncData(fetcher, deps = []) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });

  const run = useCallback(() => {
    setState({ status: 'loading', data: null, error: null });
    fetcher()
      .then((data) => setState({ status: 'success', data, error: null }))
      .catch((error) => setState({ status: 'error', data: null, error }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading', data: null, error: null });
    fetcher()
      .then((data) => { if (!cancelled) setState({ status: 'success', data, error: null }); })
      .catch((error) => { if (!cancelled) setState({ status: 'error', data: null, error }); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ...state, refetch: run };
}
