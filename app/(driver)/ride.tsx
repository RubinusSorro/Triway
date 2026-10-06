import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { Header } from '@/components/layout/Header';
import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useDriverRide } from '@/features/driver/hooks/useDriverRide';
import { RideStatusCard } from '@/features/rides/components/RideStatusCard';
import { SimulatedMap } from '@/features/rides/components/SimulatedMap';
import { RideStatus } from '@/features/rides/types/ride';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function DriverRideScreen() {
  const { theme } = useAppTheme();
  const { continueAs } = useAuth();
  const [isOnline] = useState(true);
  const { activeRide, isLoading, error, updateStatus } = useDriverRide(isOnline);

  if (isLoading) {
    return (
      <Screen>
        <ActivityIndicator color={theme.colors.primary} />
      </Screen>
    );
  }

  if (!activeRide) {
    return (
      <Screen>
        <EmptyState
          title="No active driver ride"
          body="Accept a rider request before using the status controls."
          actionLabel="Check requests"
          onAction={() => router.replace('/(driver)/request')}
        />
      </Screen>
    );
  }

  const goRider = () => {
    continueAs('rider');
    router.replace('/(rider)/ride');
  };

  const nextActionByStatus: Record<RideStatus, { label: string; status: RideStatus } | null> = {
    accepted: { label: 'Mark arriving', status: 'arriving' },
    arriving: { label: 'Start trip', status: 'ongoing' },
    ongoing: { label: 'Complete trip', status: 'completed' },
    requested: { label: 'Accept in request screen', status: 'accepted' },
    completed: null,
    cancelled: null,
  };
  const nextAction = nextActionByStatus[activeRide.status];

  const update = async () => {
    if (!nextAction) {
      return;
    }

    const updatedRide = await updateStatus(activeRide.id, nextAction.status);
    if (updatedRide?.status === 'completed') {
      router.replace({ pathname: '/(driver)/completion', params: { rideId: updatedRide.id } });
    }
  };

  return (
    <Screen>
      <Header eyebrow="Driver controls" title="Advance the trip" subtitle="Each button updates the shared ride for the rider screen." />
      <SimulatedMap pickup={activeRide.pickup} destination={activeRide.destination} status={activeRide.status} />
      <RideStatusCard ride={activeRide} perspective="driver" />
      {error ? <Text style={[styles.error, { color: theme.colors.danger }]}>{error}</Text> : null}

      <View style={styles.actions}>
        {nextAction ? <AppButton label={nextAction.label} onPress={update} /> : null}
        <AppButton label="View Rider tracker" variant="secondary" onPress={goRider} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 12,
    marginTop: 16,
  },
  error: {
    marginTop: 12,
    fontWeight: '700',
  },
});
