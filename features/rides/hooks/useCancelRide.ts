import { useState } from 'react';

import { rideService } from '@/features/rides/services/rideService';
import { CancellationActor, CancellationReason, Ride } from '@/features/rides/types/ride';

export function useCancelRide() {
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelRide = async (rideId: string, cancelledBy: CancellationActor, reason: CancellationReason): Promise<Ride | null> => {
    setIsCancelling(true);
    setError(null);

    try {
      return await rideService.cancelRide(rideId, cancelledBy, reason);
    } catch {
      setError('Ride could not be cancelled.');
      return null;
    } finally {
      setIsCancelling(false);
    }
  };

  return { cancelRide, isCancelling, error };
}