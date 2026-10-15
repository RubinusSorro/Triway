import { router } from 'expo-router';
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
import { TriwayMap } from '@/features/maps/components/TriwayMap';
import { useRideSimulation } from '@/features/maps/hooks/useRideSimulation';
import { Ride } from '@/features/rides/types/ride';
import { getRideLeg } from '@/features/rides/utils/rideLeg';

function TrackingContent({ ride }: { ride: Ride }) {
  const { continueAs } = useAuth();
  const leg = getRideLeg(ride);
  const sim = useRideSimulation(ride);

  return (
    <Screen scroll={false} includeTabBarPadding contentContainerStyle={styles.screen}>
      <ScreenHeader title="Driver on the way" showActions={false} />
      <ScrollView style={styles.form} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TriwayMap sim={sim} pickup={leg.pickup} destination={leg.destination} status={ride.status} />
        <Text style={styles.disclaimer}>Simulated movement and ETA for the demo; not live GPS.</Text>
        <Card variant="tinted"><Text style={styles.eta}>{sim.headline}</Text><Text style={styles.etaCopy}>{sim.subline}</Text></Card>
        <RideStatusCard ride={ride} perspective="rider" />
      </ScrollView>
      <View style={styles.actions}>
        <AppButton label="Open Driver Controls" variant="secondary" onPress={() => { continueAs('driver'); router.replace('/(driver)/ride'); }} />
        <RiderCancellationControl ride={ride} />
      </View>
    </Screen>
  );
}

export default function RiderTrackingScreen() {
  return <RiderLifecycleGuard expectedStatuses={['arriving']}>{(ride) => <TrackingContent ride={ride} />}</RiderLifecycleGuard>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  form: { flex: 1 },
  content: { flexGrow: 1, gap: spacing.md, paddingBottom: spacing.xl },
  disclaimer: { ...typography.caption, color: colors.textMuted, marginTop: -spacing.sm },
  eta: { ...typography.sectionHeading, color: colors.text },
  etaCopy: { ...typography.secondaryBody, color: colors.textMuted, marginTop: spacing.xs },
  actions: { flexShrink: 0, gap: spacing.sm, marginTop: spacing.md },
});
