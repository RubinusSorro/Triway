import { useState } from 'react';

import { rideService } from '@/features/rides/services/rideService';
import { CreateRideInput, Ride } from '@/features/rides/types/ride';

export function useCreateRide() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRide = async (input: CreateRideInput): Promise<Ride | null> => {
    setIsCreating(true);
    setError(null);

    try {
      return await rideService.createRide(input);
    } catch {
      setError('Booking could not be created.');
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return { createRide, isCreating, error };
}
