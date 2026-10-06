import { useEffect, useState } from 'react';

import { rideService } from '@/features/rides/services/rideService';
import { Ride } from '@/features/rides/types/ride';

export function useRide(rideId?: string) {
  const [ride, setRide] = useState<Ride | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(rideId));

  useEffect(() => {
    if (!rideId) {
      setRide(null);
      setIsLoading(false);
      return undefined;
    }

    setIsLoading(true);
    return rideService.subscribeToRide(rideId, (nextRide) => {
      setRide(nextRide);
      setIsLoading(false);
    });
  }, [rideId]);

  return { ride, isLoading };
}