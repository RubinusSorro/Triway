import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { Header } from '@/components/layout/Header';
import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { useDriverRide } from '@/features/driver/hooks/useDriverRide';
import { useCancelRide } from '@/features/rides/hooks/useCancelRide';
import { FareCard } from '@/features/rides/components/FareCard';
import { RideStatusCard } from '@/features/rides/components/RideStatusCard';
import { useRoutes } from '@/features/routes/hooks/useRoutes';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function DriverRequestScreen() {
  const { theme } = useAppTheme();
  const [isOnline] = useState(true);
  const { pendingRide, activeRide, isLoading, error, acceptRide } = useDriverRide(isOnline);
  const { cancelRide, error: declineError } = useCancelRide();
  const { routes } = useRoutes();
  const route = routes.find((item) => item.id === pendingRide?.routeId);

  const accept = async () => {
    if (!pendingRide) {
      return;
    }

    await acceptRide(pendingRide.id);
    router.replace('/(driver)/ride');
  };

  const decline = async () => {
    if (!pendingRide) return;
    const declinedRide = await cancelRide(pendingRide.id, 'driver', 'Other');
    if (declinedRide) {
      Alert.alert('Quick Return declined', 'The rider can now find another available driver.');
      router.replace('/(driver)');
    }
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
      <Header eyebrow={pendingRide.isReturnRide ? 'QUICK RETURN REQUEST' : 'Incoming request'} title={pendingRide.isReturnRide ? 'A rider wants to ride with you again' : 'Review rider booking'} subtitle="Accepting assigns this driver to the same ride." />
      <RideStatusCard ride={pendingRide} perspective="driver" />
      {pendingRide.isReturnRide ? (
        <View style={styles.returnArrangement}>
          <Text style={styles.returnHeading}>QUICK RETURN REQUEST</Text>
          <Text style={styles.returnCopy}>{pendingRide.riderName ?? 'Rider'} intends to make a quick errand and return.</Text>
          <Text style={styles.returnCopy}>Outbound Fare: PHP {pendingRide.outboundFare ?? pendingRide.fare}</Text>
          <Text style={styles.returnCopy}>Return Fare: PHP {pendingRide.returnFare ?? pendingRide.fare}</Text>
          <Text style={styles.returnTotal}>Estimated Total: PHP {pendingRide.totalFare ?? pendingRide.fare}</Text>
        </View>
      ) : null}
      {route ? <FareCard route={route} /> : null}
      {error || declineError ? <Text style={[styles.error, { color: theme.colors.danger }]}>{error ?? declineError}</Text> : null}
      {pendingRide.isReturnRide ? <AppButton label="Decline" variant="secondary" onPress={decline} /> : null}
      <AppButton label="Accept ride" onPress={accept} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  error: {
    marginVertical: 10,
    fontWeight: '700',
  },
  returnCopy: {
    marginTop: 10,
    fontWeight: '700',
  },
  returnArrangement: {
    gap: 4,
    marginTop: 12,
  },
  returnHeading: {
    fontWeight: '800',
    color: '#1F5C2E',
  },
  returnTotal: {
    marginTop: 4,
    fontWeight: '800',
  },
});
