import { router } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { Header } from '@/components/layout/Header';
import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { RideStatusCard } from '@/features/rides/components/RideStatusCard';
import { SimulatedMap } from '@/features/rides/components/SimulatedMap';
import { useCurrentRide } from '@/features/rides/hooks/useCurrentRide';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function RiderRideScreen() {
  const { theme } = useAppTheme();
  const { user, continueAs } = useAuth();
  const { ride, isLoading } = useCurrentRide(user?.id);

  if (isLoading) {
    return (
      <Screen>
        <ActivityIndicator color={theme.colors.primary} />
      </Screen>
    );
  }

  if (!ride) {
    return (
      <Screen>
        <EmptyState
          title="No active ride"
          body="Completed trips move to history. Create a new booking to restart the demo."
          actionLabel="Book a ride"
          onAction={() => router.replace('/(rider)/routes')}
        />
        <AppButton label="View history" variant="secondary" onPress={() => router.push('/(rider)/history')} />
      </Screen>
    );
  }

  const switchToDriver = () => {
    continueAs('driver');
    router.replace('/(driver)/request');
  };

  return (
    <Screen>
      <Header eyebrow="Ride tracker" title="Follow your tricycle" subtitle="Rider view updates when the driver changes the same ride status." />
      <SimulatedMap pickup={ride.pickup} destination={ride.destination} status={ride.status} />
      <RideStatusCard ride={ride} perspective="rider" />
      <Text style={[styles.hint, { color: theme.colors.mutedText }]}>
        For the class demo, open driver view and advance the ride lifecycle.
      </Text>
      <AppButton label="Switch to Driver" variant="secondary" onPress={switchToDriver} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hint: {
    fontSize: 14,
    lineHeight: 20,
    marginVertical: 14,
  },
});
