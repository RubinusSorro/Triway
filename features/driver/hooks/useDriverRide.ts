import { useEffect, useState } from 'react';

import { demoDriver } from '@/features/rides/services/mockRideRepository';
import { rideService } from '@/features/rides/services/rideService';
import { Ride, RideStatus } from '@/features/rides/types/ride';

export function useDriverRide(isOnline: boolean) {
  const [pendingRide, setPendingRide] = useState<Ride | null>(null);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [isLoading, setIsLoading] = useState(isOnline);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOnline) {
      setPendingRide(null);
      setActiveRide(null);
      setIsLoading(false);
      return undefined;
    }

    setIsLoading(true);
    const unsubscribePending = rideService.subscribeToPendingRide((ride) => {
      setPendingRide(ride);
      setIsLoading(false);
    });
    const unsubscribeActive = rideService.subscribeToDriverRide(demoDriver.id, (ride) => {
      setActiveRide(ride);
      setIsLoading(false);
    });

    return () => {
      unsubscribePending();
      unsubscribeActive();
    };
  }, [isOnline]);

  const acceptRide = async (rideId: string) => {
    setError(null);
    try {
      await rideService.acceptRide(rideId, demoDriver);
    } catch {
      setError('Ride could not be accepted.');
    }
  };

  const updateStatus = async (rideId: string, status: RideStatus) => {
    setError(null);
    try {
      await rideService.updateRideStatus(rideId, status);
    } catch {
      setError('Ride status could not be updated.');
    }
  };

  return { pendingRide, activeRide, isLoading, error, acceptRide, updateStatus, driver: demoDriver };
}
