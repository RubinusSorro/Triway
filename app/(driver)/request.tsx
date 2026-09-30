import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { Header } from '@/components/layout/Header';
import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { useDriverRide } from '@/features/driver/hooks/useDriverRide';
import { FareCard } from '@/features/rides/components/FareCard';
import { RideStatusCard } from '@/features/rides/components/RideStatusCard';
import { useRoutes } from '@/features/routes/hooks/useRoutes';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function DriverRequestScreen() {
  const { theme } = useAppTheme();
  const [isOnline] = useState(true);
  const { pendingRide, activeRide, isLoading, error, acceptRide } = useDriverRide(isOnline);
  const { routes } = useRoutes();
  const route = routes.find((item) => item.id === pendingRide?.routeId);

  const accept = async () => {
    if (!pendingRide) {
      return;
    }

    await acceptRide(pendingRide.id);
    router.replace('/(driver)/ride');
  };

  if (isLoading) {
    return (
      <Screen>
        <ActivityIndicator color={theme.colors.primary} />
      </Screen>
    );
  }

  if (activeRide) {
    return (
      <Screen>
        <Header eyebrow="Driver" title="Active ride" subtitle="You already have an accepted ride in progress." />
        <RideStatusCard ride={activeRide} perspective="driver" />
        <AppButton label="Open controls" onPress={() => router.replace('/(driver)/ride')} />
      </Screen>
    );
  }

  if (!pendingRide) {
    return (
      <Screen>
        <EmptyState
          title="No incoming request"
          body="Create a rider booking first, then this screen will show the shared request."
          actionLabel="Switch to Rider"
          onAction={() => router.replace('/(rider)/routes')}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <Header eyebrow="Incoming request" title="Review rider booking" subtitle="Accepting assigns this driver to the same ride." />
      <RideStatusCard ride={pendingRide} perspective="driver" />
      {route ? <FareCard route={route} /> : null}
      {error ? <Text style={[styles.error, { color: theme.colors.danger }]}>{error}</Text> : null}
      <AppButton label="Accept ride" onPress={accept} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  error: {
    marginVertical: 10,
    fontWeight: '700',
  },
});
