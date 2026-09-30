import { useEffect, useState } from 'react';

import { fallbackPasses, RidePass } from '@/data/passes';

export function usePasses() {
  const [passes, setPasses] = useState<RidePass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    // TODO: Replace with the passes API; fallback data is used until it exists.
    Promise.resolve(fallbackPasses)
      .then((items) => { if (mounted) setPasses(items); })
      .catch(() => { if (mounted) setError('Passes could not be loaded.'); })
      .finally(() => { if (mounted) setIsLoading(false); });
    return () => { mounted = false; };
  }, []);

  return { passes, isLoading, error };
}
