import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { colors, spacing, typography } from '@/constants/theme';
import { useRide } from '@/features/rides/hooks/useRide';

export default function RiderCompletedScreen() {
  const { rideId } = useLocalSearchParams<{ rideId?: string }>();
  const { ride, isLoading } = useRide(rideId);

  if (isLoading) return <Screen scroll={false}><ActivityIndicator color={colors.primary} /></Screen>;
  if (!ride || ride.status !== 'completed') return <Screen scroll={false}><EmptyState title="Trip unavailable" body="Choose a completed trip from your history." actionLabel="View trips" onAction={() => router.replace('/(rider)/history')} /></Screen>;

  const totalFare = ride.isReturnRide ? ride.totalFare ?? ride.fare : ride.fare;

  return (
    <Screen scroll={false} includeTabBarPadding contentContainerStyle={styles.screen}>
      <ScreenHeader title="Trip completed" showActions={false} />
      <ScrollView style={styles.form} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>You&apos;ve arrived</Text>
        <Text style={styles.subtitle}>Your trip has been completed by the driver.</Text>
        <Card style={styles.card}>
          <Text style={styles.eyebrow}>{ride.isReturnRide ? 'QUICK RETURN · COMPLETED' : 'ONE-WAY · COMPLETED'}</Text>
          <Text style={styles.route}>{ride.routeName}</Text>
          <Text style={styles.detail}>Pickup: {ride.pickup}</Text>
          <Text style={styles.detail}>Destination: {ride.destination}</Text>
          <Text style={styles.detail}>Distance: {ride.distanceKm} km{ride.isReturnRide ? ' per leg' : ''}</Text>
          <Text style={styles.total}>PHP {totalFare}</Text>
        </Card>
        <Card variant="outlined" style={styles.card}>
          <Text style={styles.driver}>{ride.driver?.name ?? 'Driver details unavailable'}</Text>
          {ride.driver ? <Text style={styles.detail}>{ride.driver.vehicle} · {ride.driver.plateNumber}</Text> : null}
          <Text style={styles.detail}>Cash payment due to your driver.</Text>
        </Card>
      </ScrollView>
      <View style={styles.actions}>
        <AppButton label="View Receipt" onPress={() => router.push({ pathname: '/(rider)/receipt', params: { rideId: ride.id } })} />
        <AppButton label="Rate Driver" variant="secondary" onPress={() => router.push({ pathname: '/(rider)/rating', params: { rideId: ride.id } })} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 }, form: { flex: 1 }, content: { flexGrow: 1, gap: spacing.lg, paddingBottom: spacing.xl },
  title: { ...typography.display, color: colors.text }, subtitle: { ...typography.body, color: colors.textMuted },
  card: { gap: spacing.sm }, eyebrow: { ...typography.label, color: colors.secondary }, route: { ...typography.sectionHeading, color: colors.text },
  detail: { ...typography.secondaryBody, color: colors.textMuted }, total: { ...typography.screenTitle, color: colors.primary }, driver: { ...typography.sectionHeading, color: colors.text },
  actions: { flexShrink: 0, gap: spacing.sm, marginTop: spacing.md },
});
