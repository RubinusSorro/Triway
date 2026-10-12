import { useCallback, useEffect, useRef, useState } from 'react';

import { rideService } from '@/features/rides/services/rideService';
import { CreateRideRatingInput, RideRating } from '@/features/rides/types/rating';

export function useRideRating(rideId?: string, riderId?: string) {
  const [rating, setStoredRating] = useState<RideRating | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(rideId && riderId));
  const requestVersion = useRef(0);

  const refresh = useCallback(async () => {
    if (!rideId || !riderId) {
      setStoredRating(null);
      setIsLoading(false);
      return;
    }

    const version = ++requestVersion.current;
    setIsLoading(true);
    try {
      const nextRating = await rideService.getRideRating(rideId, riderId);
      if (version === requestVersion.current) setStoredRating(nextRating);
    } finally {
      if (version === requestVersion.current) setIsLoading(false);
    }
  }, [rideId, riderId]);

  useEffect(() => { void refresh(); }, [refresh]);

  const setRating = (nextRating: RideRating | null) => {
    requestVersion.current += 1;
    setStoredRating(nextRating);
  };

  return { rating, isLoading, setRating, refresh };
}

export function useSubmitRideRating() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitRating = async (input: CreateRideRatingInput) => {
    setIsSubmitting(true);
    setError(null);
    try {
      return await rideService.submitRideRating(input);
    } catch {
      setError('Rating could not be submitted.');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitRating, isSubmitting, error };
}
