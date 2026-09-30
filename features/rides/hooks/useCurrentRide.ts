import { useEffect, useState } from 'react';

import { rideService } from '@/features/rides/services/rideService';
import { Ride } from '@/features/rides/types/ride';

export function useCurrentRide(riderId?: string) {
  const [ride, setRide] = useState<Ride | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(riderId));

  useEffect(() => {
    if (!riderId) {
      setRide(null);
      setIsLoading(false);
      return undefined;
    }

    setIsLoading(true);
    return rideService.subscribeToCurrentRiderRide(riderId, (nextRide) => {
      setRide(nextRide);
      setIsLoading(false);
    });
  }, [riderId]);

  return { ride, isLoading };
}
