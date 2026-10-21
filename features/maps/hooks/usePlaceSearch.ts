import { useEffect, useState } from 'react';

import { PlaceResult, searchPlaces } from '../services/photonGeocoder';

export type UsePlaceSearchResult = {
  places: PlaceResult[];
  isLoading: boolean;
  error: string | null;
};

export function usePlaceSearch(query: string, minChars: number = 3): UsePlaceSearchResult {
  const [places, setPlaces] = useState<PlaceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < minChars) {
      setPlaces([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const results = await searchPlaces(trimmed, controller.signal, minChars);
        setPlaces(results);
        setIsLoading(false);
      } catch (err: any) {
        if (controller.signal.aborted || err?.name === 'AbortError') {
          return;
        }
        setError('Unable to load place results.');
        setIsLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, minChars]);

  return { places, isLoading, error };
}
