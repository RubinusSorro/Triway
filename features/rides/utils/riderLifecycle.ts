import { Ride, RideStatus } from '@/features/rides/types/ride';

export type RiderLifecycleRoute = '/(rider)/matching' | '/(rider)/assigned' | '/(rider)/tracking' | '/(rider)/progress';

const routeByStatus: Partial<Record<RideStatus, RiderLifecycleRoute>> = {
  requested: '/(rider)/matching',
  accepted: '/(rider)/assigned',
  arriving: '/(rider)/tracking',
  ongoing: '/(rider)/progress',
  waiting_return: '/(rider)/progress',
};

export function getRiderLifecycleRoute(status: RideStatus): RiderLifecycleRoute | null {
  return routeByStatus[status] ?? null;
}

export function getRiderLifecycleRouteForRide(ride: Ride | null | undefined) {
  return ride ? getRiderLifecycleRoute(ride.status) : null;
}
