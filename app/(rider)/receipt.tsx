import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { colors, spacing, typography } from '@/constants/theme';
import { useRide } from '@/features/rides/hooks/useRide';

function formatDate(value?: string) { return value ? new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Not available'; }

export default function RiderReceiptScreen() {
  const { rideId } = useLocalSearchParams<{ rideId?: string }>();
  const { ride, isLoading } = useRide(rideId);
  if (isLoading) return <Screen scroll={false}><ActivityIndicator color={colors.primary} /></Screen>;
  if (!ride || ride.status !== 'completed') return <Screen scroll={false}><EmptyState title="Receipt unavailable" body="Choose a completed trip from your history." actionLabel="View trips" onAction={() => router.replace('/(rider)/history')} /></Screen>;
  const total = ride.isReturnRide ? ride.totalFare ?? ride.fare : ride.fare;
  return (
    <Screen scroll={false} includeTabBarPadding contentContainerStyle={styles.screen}>
      <ScreenHeader title="Cash receipt" showBack showActions={false} />
      <ScrollView style={styles.form} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.card}>
          <Text style={styles.eyebrow}>COMPLETED · CASH</Text><Text style={styles.route}>{ride.routeName}</Text>
          <Text style={styles.detail}>Booking reference: {ride.id}</Text><Text style={styles.detail}>Completed: {formatDate(ride.completedAt)}</Text>
          <Text style={styles.detail}>Pickup: {ride.pickup}</Text><Text style={styles.detail}>Destination: {ride.destination}</Text>
        </Card>
        <Card variant="outlined" style={styles.card}>
          {ride.isReturnRide ? <Text style={styles.detail}>Outbound fare: PHP {ride.outboundFare ?? ride.fare}</Text> : <Text style={styles.detail}>Base fare: PHP {ride.fare}</Text>}
          {ride.isReturnRide ? <Text style={styles.detail}>Return fare: PHP {ride.returnFare ?? ride.fare}</Text> : null}
          <Text style={styles.total}>Total: PHP {total}</Text><Text style={styles.disclaimer}>Illustrative demo fare; not an official rate.</Text>
        </Card>
        <Card variant="tinted" style={styles.card}><Text style={styles.payment}>Pay the driver in cash</Text><Text style={styles.detail}>Cash payment confirmation is simulated in this prototype.</Text></Card>
      </ScrollView>
      <View style={styles.actions}><AppButton label="Rate Driver" onPress={() => router.replace({ pathname: '/(rider)/rating', params: { rideId: ride.id } })} /></View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 }, form: { flex: 1 }, content: { flexGrow: 1, gap: spacing.lg, paddingBottom: spacing.xl }, card: { gap: spacing.sm },
  eyebrow: { ...typography.label, color: colors.secondary }, route: { ...typography.sectionHeading, color: colors.text }, detail: { ...typography.secondaryBody, color: colors.textMuted }, total: { ...typography.screenTitle, color: colors.primary }, disclaimer: { ...typography.caption, color: colors.textMuted }, payment: { ...typography.sectionHeading, color: colors.text }, actions: { flexShrink: 0, marginTop: spacing.md },
});
