import { Ride } from '@/features/rides/types/ride';

export const QUICK_RETURN_MAX_DISTANCE_KM = 5;
export const QUICK_RETURN_WINDOW_MINUTES = 30;

export function isQuickReturnEligible(distanceKm?: number) {
  return typeof distanceKm === 'number' && distanceKm >= 0 && distanceKm <= QUICK_RETURN_MAX_DISTANCE_KM;
}