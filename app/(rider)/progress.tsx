import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { colors, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { RiderCancellationControl } from '@/features/rides/components/RiderCancellationControl';
import { RiderLifecycleGuard } from '@/features/rides/components/RiderLifecycleGuard';
import { RideStatusCard } from '@/features/rides/components/RideStatusCard';
import { SimulatedMap } from '@/features/rides/components/SimulatedMap';
import { rideService } from '@/features/rides/services/rideService';
import { Ride } from '@/features/rides/types/ride';
import { getRideLeg } from '@/features/rides/utils/rideLeg';

function ProgressContent({ ride }: { ride: Ride }) {
  const { continueAs } = useAuth();
  const [isStartingReturn, setIsStartingReturn] = useState(false);
  const [returnError, setReturnError] = useState<string | null>(null);
  const leg = getRideLeg(ride);
  const isWaitingReturn = ride.isReturnRide && ride.status === 'waiting_return';

  const startReturn = async () => {
    setIsStartingReturn(true);
    setReturnError(null);
    try {
      await rideService.updateRideStatus(ride.id, 'accepted');
    } catch {
      setReturnError('Return trip could not be started. Please try again.');
    } finally {
      setIsStartingReturn(false);
    }
  };

  return (
    <Screen scroll={false} includeTabBarPadding contentContainerStyle={styles.screen}>
      <ScreenHeader title={isWaitingReturn ? 'Ready to return' : leg.isReturnLeg ? 'Return trip' : 'Ride in progress'} showActions={false} />
      <ScrollView style={styles.form} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!isWaitingReturn ? <SimulatedMap pickup={leg.pickup} destination={leg.destination} status={ride.status} /> : null}
        {!isWaitingReturn ? <Text style={styles.disclaimer}>Simulated movement for the demo; not live GPS.</Text> : null}
        <Card variant={isWaitingReturn ? 'tinted' : 'outlined'} style={styles.legCard}>
          <Text style={styles.legLabel}>{ride.isReturnRide ? (leg.isReturnLeg ? 'LEG 2 OF 2 · RETURN' : 'LEG 1 OF 2 · OUTBOUND') : 'ONE-WAY TRIP'}</Text>
          <Text style={styles.legRoute}>{leg.pickup} to {leg.destination}</Text>
          <Text style={styles.legFare}>Cash fare: PHP {leg.fare}</Text>
          {ride.isReturnRide ? <Text style={styles.legHelp}>Quick Return remains one booking with a total of PHP {ride.totalFare ?? ride.fare}.</Text> : null}
        </Card>
        <RideStatusCard ride={ride} perspective="rider" />
        {returnError ? <Text accessibilityRole="alert" style={styles.error}>{returnError}</Text> : null}
      </ScrollView>
      <View style={styles.actions}>
        {isWaitingReturn ? <AppButton label="I'm Ready to Return" onPress={startReturn} loading={isStartingReturn} /> : null}
        <AppButton label="Open Driver Controls" variant="secondary" onPress={() => { continueAs('driver'); router.replace('/(driver)/ride'); }} />
        <RiderCancellationControl ride={ride} />
      </View>
    </Screen>
  );
}

export default function RiderProgressScreen() {
  return <RiderLifecycleGuard expectedStatuses={['ongoing', 'waiting_return']}>{(ride) => <ProgressContent ride={ride} />}</RiderLifecycleGuard>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  form: { flex: 1 },
  content: { flexGrow: 1, gap: spacing.md, paddingBottom: spacing.xl },
  disclaimer: { ...typography.caption, color: colors.textMuted, marginTop: -spacing.sm },
  legCard: { gap: spacing.xs },
  legLabel: { ...typography.label, color: colors.secondary },
  legRoute: { ...typography.bodySemibold, color: colors.text },
  legFare: { ...typography.secondaryBody, color: colors.textMuted },
  legHelp: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
  error: { ...typography.caption, color: colors.danger },
  actions: { flexShrink: 0, gap: spacing.sm, marginTop: spacing.md },
});
