import { useEffect, useState } from 'react';

import { routeService } from '@/features/routes/services/routeService';
import { TriwayRoute } from '@/features/routes/types/route';

export function useRoutes() {
  const [routes, setRoutes] = useState<TriwayRoute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    routeService
      .listRoutes()
      .then((items) => {
        if (isMounted) {
          setRoutes(items);
          setError(null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Routes could not be loaded.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { routes, isLoading, error };
}
