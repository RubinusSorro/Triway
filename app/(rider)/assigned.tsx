import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { colors, radii, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { RiderCancellationControl } from '@/features/rides/components/RiderCancellationControl';
import { RiderLifecycleGuard } from '@/features/rides/components/RiderLifecycleGuard';
import { RideStatusCard } from '@/features/rides/components/RideStatusCard';
import { Ride } from '@/features/rides/types/ride';

function AssignedContent({ ride }: { ride: Ride }) {
  const { continueAs } = useAuth();
  const driver = ride.driver;

  return (
    <Screen scroll={false} includeTabBarPadding contentContainerStyle={styles.screen}>
      <ScreenHeader title="Driver assigned" showActions={false} />
      <ScrollView style={styles.form} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.driverCard}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{driver?.name?.slice(0, 1) ?? 'D'}</Text></View>
          <View style={styles.driverCopy}>
            <Text style={styles.driverName}>{driver?.name ?? 'Assigned TRIWAY driver'}</Text>
            <Text style={styles.driverDetail}>{driver ? `${driver.vehicle} · ${driver.plateNumber}` : 'Driver details will appear when available.'}</Text>
          </View>
        </Card>
        <RideStatusCard ride={ride} perspective="rider" />
      </ScrollView>
      <View style={styles.actions}>
        <AppButton label="Open Driver Controls" variant="secondary" onPress={() => { continueAs('driver'); router.replace('/(driver)/ride'); }} />
        <RiderCancellationControl ride={ride} />
      </View>
    </Screen>
  );
}

export default function RiderAssignedScreen() {
  return <RiderLifecycleGuard expectedStatuses={['accepted']}>{(ride) => <AssignedContent ride={ride} />}</RiderLifecycleGuard>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  form: { flex: 1 },
  content: { flexGrow: 1, gap: spacing.lg, paddingBottom: spacing.xl },
  driverCard: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  avatar: { alignItems: 'center', backgroundColor: colors.tint, borderRadius: radii.pill, height: 56, justifyContent: 'center', width: 56 },
  avatarText: { ...typography.sectionHeading, color: colors.primary },
  driverCopy: { flex: 1 },
  driverName: { ...typography.sectionHeading, color: colors.text },
  driverDetail: { ...typography.secondaryBody, color: colors.textMuted, marginTop: spacing.xs },
  actions: { flexShrink: 0, gap: spacing.sm, marginTop: spacing.md },
});
