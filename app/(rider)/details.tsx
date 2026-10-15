import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { RideDetails } from '@/features/rides/components/RideDetails';
import { useRide } from '@/features/rides/hooks/useRide';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function RiderRideDetailsScreen() {
  const { theme } = useAppTheme();
  const { rideId } = useLocalSearchParams<{ rideId?: string }>();
  const { ride, isLoading } = useRide(rideId);

  if (isLoading) return <Screen><ActivityIndicator color={theme.colors.primary} /></Screen>;
  if (!ride) return <Screen><EmptyState title="Ride details unavailable" body="Return to ride history to choose another trip." actionLabel="Back to History" onAction={() => router.replace('/(rider)/history')} /></Screen>;

  return (
    <Screen>
      <ScreenHeader showBack />
      <RideDetails ride={ride} />
      <AppButton label="Back to History" variant="secondary" onPress={() => router.replace('/(rider)/history')} />
    </Screen>
  );
}