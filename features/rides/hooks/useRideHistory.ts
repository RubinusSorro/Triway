import { useCallback, useEffect, useState } from 'react';

import { rideService } from '@/features/rides/services/rideService';
import { Ride } from '@/features/rides/types/ride';

export function useRideHistory(riderId?: string) {
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(riderId));

  const refresh = useCallback(async () => {
    if (!riderId) {
      setRides([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const history = await rideService.listRideHistory(riderId);
    setRides(history);
    setIsLoading(false);
  }, [riderId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { rides, isLoading, refresh };
}
