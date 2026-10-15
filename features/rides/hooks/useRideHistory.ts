import { useCallback, useEffect, useState } from 'react';

import { rideService } from '@/features/rides/services/rideService';
import { Ride } from '@/features/rides/types/ride';

type RideHistoryRole = 'rider' | 'driver';

export function useRideHistory(userId?: string, role: RideHistoryRole = 'rider') {
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(userId));

  const refresh = useCallback(async () => {
    if (!userId) {
      setRides([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const history = role === 'driver' ? await rideService.listDriverRideHistory(userId) : await rideService.listRideHistory(userId);
    setRides(history);
    setIsLoading(false);
  }, [role, userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { rides, isLoading, refresh };
}
