import { router, usePathname } from 'expo-router';
import { ReactNode, useEffect, useRef } from 'react';
import { ActivityIndicator } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { Screen } from '@/components/layout/Screen';
import { colors } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCurrentRide } from '@/features/rides/hooks/useCurrentRide';
import { Ride, RideStatus } from '@/features/rides/types/ride';
import { getRiderLifecycleRouteForRide } from '@/features/rides/utils/riderLifecycle';

type RiderLifecycleGuardProps = {
  expectedStatuses: RideStatus[];
  children: (ride: Ride) => ReactNode;
};

function matchesCurrentPath(pathname: string, target: string) {
  return pathname.endsWith(target.slice(target.lastIndexOf('/')));
}

export function RiderLifecycleGuard({ expectedStatuses, children }: RiderLifecycleGuardProps) {
  const { user } = useAuth();
  const { ride, isLoading } = useCurrentRide(user?.id);
  const pathname = usePathname();
  const targetRoute = getRiderLifecycleRouteForRide(ride);
  const lastActiveRideId = useRef<string | undefined>(undefined);

  if (ride && ride.status !== 'completed') lastActiveRideId.current = ride.id;

  useEffect(() => {
    if (targetRoute && !matchesCurrentPath(pathname, targetRoute)) {
      router.replace(targetRoute);
    }
  }, [pathname, targetRoute]);

  useEffect(() => {
    if (!ride && lastActiveRideId.current) {
      router.replace({ pathname: '/(rider)/completed', params: { rideId: lastActiveRideId.current } });
    }
  }, [ride]);

  if (isLoading) {
    return <Screen scroll={false}><ActivityIndicator color={colors.primary} /></Screen>;
  }

  if (!ride) {
    return (
      <Screen scroll={false}>
        <EmptyState
          title="No active ride"
          body="Your active ride is no longer available. You can browse verified routes to book another trip."
          actionLabel="Browse routes"
          onAction={() => router.replace('/(rider)/routes')}
        />
      </Screen>
    );
  }

  if (ride.status === 'cancelled') {
    return (
      <Screen scroll={false}>
        <EmptyState
          title="Ride cancelled"
          body="This ride has moved to your trip history."
          actionLabel="Back to Home"
          onAction={() => router.replace('/(rider)')}
        />
      </Screen>
    );
  }

  if (!expectedStatuses.includes(ride.status)) {
    return <Screen scroll={false}><ActivityIndicator color={colors.primary} /></Screen>;
  }

  return <>{children(ride)}</>;
}
