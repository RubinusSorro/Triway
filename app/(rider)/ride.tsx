import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { colors } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { RideStatusCard } from '@/features/rides/components/RideStatusCard';
import { useCurrentRide } from '@/features/rides/hooks/useCurrentRide';
import { getRiderLifecycleRouteForRide } from '@/features/rides/utils/riderLifecycle';

export default function RiderRideCompatibilityScreen() {
  const { user } = useAuth();
  const { ride, isLoading } = useCurrentRide(user?.id);
  const targetRoute = getRiderLifecycleRouteForRide(ride);

  useEffect(() => {
    if (targetRoute) router.replace(targetRoute);
  }, [targetRoute]);

  if (isLoading || targetRoute) {
    return <Screen scroll={false}><ActivityIndicator color={colors.primary} /></Screen>;
  }

  if (ride?.status === 'cancelled') {
    return (
      <Screen scroll={false}>
        <ScreenHeader title="Ride cancelled" showActions={false} />
        <RideStatusCard ride={ride} perspective="rider" />
        <EmptyState
          title="This ride was cancelled"
          body="The booking is available in your trip history."
          actionLabel="Back to Home"
          onAction={() => router.replace('/(rider)')}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <EmptyState
        title="No active ride"
        body="Completed trips move to your history. Browse verified routes to make a new booking."
        actionLabel="Browse routes"
        onAction={() => router.replace('/(rider)/routes')}
      />
    </Screen>
  );
}
