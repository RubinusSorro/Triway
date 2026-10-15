import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { Header } from '@/components/layout/Header';
import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { CancellationDialog, DRIVER_CANCELLATION_REASONS } from '@/components/ui/CancellationDialog';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useDriverRide } from '@/features/driver/hooks/useDriverRide';
import { TriwayMap } from '@/features/maps/components/TriwayMap';
import { useRideSimulation } from '@/features/maps/hooks/useRideSimulation';
import { useCancelRide } from '@/features/rides/hooks/useCancelRide';
import { RideStatusCard } from '@/features/rides/components/RideStatusCard';
import { CancellationReason, Ride, RideStatus } from '@/features/rides/types/ride';
import { getRideLeg } from '@/features/rides/utils/rideLeg';
import { useAppTheme } from '@/hooks/useAppTheme';

function DriverTripMap({ ride }: { ride: Ride }) {
  const { theme } = useAppTheme();
  const sim = useRideSimulation(ride);
  const leg = getRideLeg(ride);
  return (
    <>
      <TriwayMap sim={sim} pickup={leg.pickup} destination={leg.destination} status={ride.status} />
      <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.text }}>{sim.headline}</Text>
      <Text style={{ fontSize: 12, color: theme.colors.mutedText, marginBottom: 8 }}>{sim.subline}</Text>
    </>
  );
}

export default function DriverRideScreen() {
  const { theme } = useAppTheme();
  const { continueAs } = useAuth();
  const [isOnline] = useState(true);
  const { activeRide, isLoading, error, updateStatus } = useDriverRide(isOnline);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const { cancelRide, isCancelling, error: cancellationError } = useCancelRide();

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
    accepted: activeRide.isReturnRide && activeRide.currentLeg === 'return' ? { label: 'Start Return Trip', status: 'ongoing' } : { label: 'Mark arriving', status: 'arriving' },
    arriving: { label: 'Start trip', status: 'ongoing' },
    ongoing: { label: activeRide.isReturnRide && activeRide.currentLeg !== 'return' ? 'Arrived at destination' : 'Complete trip', status: activeRide.isReturnRide && activeRide.currentLeg !== 'return' ? 'waiting_return' : 'completed' },
    waiting_return: null,
    requested: { label: 'Accept in request screen', status: 'accepted' },
    completed: null,
    cancelled: null,
  };
  const nextAction = nextActionByStatus[activeRide.status];
  const canCancel = activeRide.status === 'accepted' || activeRide.status === 'arriving' || activeRide.status === 'waiting_return';

  const update = async () => {
    if (!nextAction) {
      return;
    }

    const updatedRide = await updateStatus(activeRide.id, nextAction.status);
    if (updatedRide?.status === 'completed') {
      router.replace({ pathname: '/(driver)/completion', params: { rideId: updatedRide.id } });
    }
  };

  const cancel = async (reason: CancellationReason) => {
    const cancelledRide = await cancelRide(activeRide.id, 'driver', reason);
    if (cancelledRide) {
      setShowCancelDialog(false);
      Alert.alert('Ride cancelled', 'The ride was cancelled and moved to Driver History.');
      router.replace('/(driver)');
    }
  };

  return (
    <Screen>
      <Header eyebrow={activeRide.status === 'waiting_return' ? 'Quick Return' : activeRide.currentLeg === 'return' ? 'Return Trip' : 'Driver controls'} title={activeRide.status === 'waiting_return' ? 'Waiting for Rider' : 'Advance the trip'} subtitle={activeRide.status === 'waiting_return' ? `Return destination: ${activeRide.pickup}` : 'Each button updates the shared ride for the rider screen.'} />
      {activeRide.status !== 'waiting_return' ? <DriverTripMap ride={activeRide} /> : null}
      <RideStatusCard ride={activeRide} perspective="driver" />
      {error ? <Text style={[styles.error, { color: theme.colors.danger }]}>{error}</Text> : null}

      <View style={styles.actions}>
        {nextAction ? <AppButton label={nextAction.label} onPress={update} /> : null}
        {canCancel ? <AppButton label="Cancel ride" variant="danger" onPress={() => setShowCancelDialog(true)} /> : null}
        <AppButton label="View Rider tracker" variant="secondary" onPress={goRider} />
      </View>
      <CancellationDialog visible={showCancelDialog} actor="driver" reasons={DRIVER_CANCELLATION_REASONS} isSubmitting={isCancelling} error={cancellationError} onClose={() => setShowCancelDialog(false)} onConfirm={cancel} />
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
