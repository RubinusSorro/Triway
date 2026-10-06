import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ActivityIndicator, StyleSheet, Text } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { Header } from '@/components/layout/Header';
import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { CancellationDialog, RIDER_CANCELLATION_REASONS } from '@/components/ui/CancellationDialog';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { RideStatusCard } from '@/features/rides/components/RideStatusCard';
import { SimulatedMap } from '@/features/rides/components/SimulatedMap';
import { useCurrentRide } from '@/features/rides/hooks/useCurrentRide';
import { useCancelRide } from '@/features/rides/hooks/useCancelRide';
import { rideService } from '@/features/rides/services/rideService';
import { CancellationReason } from '@/features/rides/types/ride';
import { getRideLeg } from '@/features/rides/utils/rideLeg';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function RiderRideScreen() {
  const { theme } = useAppTheme();
  const { user, continueAs } = useAuth();
  const { ride, isLoading } = useCurrentRide(user?.id);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [returnError, setReturnError] = useState<string | null>(null);
  const { cancelRide, isCancelling, error: cancellationError } = useCancelRide();

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

  const canCancel = ride.status === 'requested' || ride.status === 'accepted' || ride.status === 'arriving' || ride.status === 'waiting_return';
  const cancel = async (reason: CancellationReason) => {
    const cancelledRide = await cancelRide(ride.id, 'rider', reason);
    if (cancelledRide) {
      setShowCancelDialog(false);
      Alert.alert('Ride cancelled', 'Your ride was cancelled and moved to ride history.');
      router.replace('/(rider)');
    }
  };

  const startReturn = async () => {
    setIsReturning(true);
    setReturnError(null);
    try {
      await rideService.updateRideStatus(ride.id, 'accepted');
    } catch {
      setReturnError('Return trip could not be started.');
    } finally {
      setIsReturning(false);
    }
  };

  if (ride.status === 'requested' && ride.isReturnRide && ride.preferredDriverDeclined) {
    return (
      <Screen>
        <Header eyebrow="Quick Return update" title={`${ride.preferredDriverName ?? 'Your previous driver'} isn't available`} subtitle="Choose another available driver or cancel this request." />
        <RideStatusCard ride={ride} perspective="rider" />
        <AppButton label="Find Another Driver" onPress={() => router.replace('/(rider)')} />
        <AppButton label="Cancel Request" variant="danger" onPress={() => setShowCancelDialog(true)} />
        <CancellationDialog visible={showCancelDialog} actor="rider" reasons={RIDER_CANCELLATION_REASONS} isSubmitting={isCancelling} error={cancellationError} onClose={() => setShowCancelDialog(false)} onConfirm={cancel} />
      </Screen>
    );
  }

  if (ride.status === 'cancelled') {
    return (
      <Screen>
        <Header eyebrow="Ride update" title="Ride cancelled" subtitle="This ride has been moved to your history." />
        <RideStatusCard ride={ride} perspective="rider" />
        <AppButton label="Back to Rider Home" onPress={() => router.replace('/(rider)')} />
      </Screen>
    );
  }

  if (ride.isReturnRide && ride.status === 'waiting_return') {
    const leg = getRideLeg(ride);
    return (
      <Screen>
        <Header eyebrow="Quick Return" title={`Arrived at ${leg.pickup}`} subtitle="Your driver is waiting for your return trip." />
        <RideStatusCard ride={ride} perspective="rider" />
        {returnError ? <Text style={[styles.hint, { color: theme.colors.danger }]}>{returnError}</Text> : null}
        <AppButton label="I'm Ready to Return" onPress={startReturn} disabled={isReturning} />
        <AppButton label="Cancel ride" variant="danger" onPress={() => setShowCancelDialog(true)} />
        <CancellationDialog visible={showCancelDialog} actor="rider" reasons={RIDER_CANCELLATION_REASONS} isSubmitting={isCancelling} error={cancellationError} onClose={() => setShowCancelDialog(false)} onConfirm={cancel} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Header eyebrow={ride.isReturnRide ? 'Quick Return' : 'Ride tracker'} title={ride.currentLeg === 'return' ? 'Return Trip' : 'Follow your tricycle'} subtitle="Rider view updates when the driver changes the same ride status." />
      <SimulatedMap pickup={getRideLeg(ride).pickup} destination={getRideLeg(ride).destination} status={ride.status} />
      <RideStatusCard ride={ride} perspective="rider" />
      <Text style={[styles.hint, { color: theme.colors.mutedText }]}>
        For the class demo, open driver view and advance the ride lifecycle.
      </Text>
      <AppButton label="Switch to Driver" variant="secondary" onPress={switchToDriver} />
      {canCancel ? <AppButton label="Cancel ride" variant="danger" onPress={() => setShowCancelDialog(true)} /> : null}
      <CancellationDialog visible={showCancelDialog} actor="rider" reasons={RIDER_CANCELLATION_REASONS} isSubmitting={isCancelling} error={cancellationError} onClose={() => setShowCancelDialog(false)} onConfirm={cancel} />
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
