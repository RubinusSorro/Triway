import { router } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { colors, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { RiderCancellationControl } from '@/features/rides/components/RiderCancellationControl';
import { RiderLifecycleGuard } from '@/features/rides/components/RiderLifecycleGuard';
import { RideStatusCard } from '@/features/rides/components/RideStatusCard';
import { Ride } from '@/features/rides/types/ride';

function MatchingContent({ ride }: { ride: Ride }) {
  const { continueAs } = useAuth();

  const openDriverDemo = () => {
    continueAs('driver');
    router.replace('/(driver)/request');
  };

  return (
    <Screen scroll={false} includeTabBarPadding contentContainerStyle={styles.screen}>
      <ScreenHeader title="Finding a driver" showActions={false} />
      <ScrollView style={styles.form} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {ride.isReturnRide && ride.preferredDriverDeclined ? (
          <Card variant="tinted" style={styles.card}>
            <Text style={styles.title}>{ride.preferredDriverName ?? 'Your previous driver'} is unavailable</Text>
            <Text style={styles.copy}>You can look for another available driver or cancel this Quick Return request.</Text>
            <AppButton label="Find another driver" onPress={() => router.replace('/(rider)')} />
          </Card>
        ) : (
          <Card style={styles.card}>
            <Text style={styles.title}>Looking for a nearby driver…</Text>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.copy}>Matching is simulated for this demo. Open Driver Requests to accept the shared booking.</Text>
          </Card>
        )}
        <RideStatusCard ride={ride} perspective="rider" />
      </ScrollView>
      <View style={styles.actions}>
        <AppButton label="Open Driver Requests" variant="secondary" onPress={openDriverDemo} />
        <RiderCancellationControl ride={ride} />
      </View>
    </Screen>
  );
}

export default function RiderMatchingScreen() {
  return <RiderLifecycleGuard expectedStatuses={['requested']}>{(ride) => <MatchingContent ride={ride} />}</RiderLifecycleGuard>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  form: { flex: 1 },
  content: { flexGrow: 1, gap: spacing.lg, paddingBottom: spacing.xl },
  card: { alignItems: 'flex-start', gap: spacing.md },
  title: { ...typography.sectionHeading, color: colors.text },
  copy: { ...typography.body, color: colors.textMuted },
  actions: { flexShrink: 0, gap: spacing.sm, marginTop: spacing.md },
});
