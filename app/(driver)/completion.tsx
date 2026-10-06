import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { Header } from '@/components/layout/Header';
import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { useRide } from '@/features/rides/hooks/useRide';
import { useAppTheme } from '@/hooks/useAppTheme';

function formatDate(value: string) {
  return new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
}

export default function DriverCompletionScreen() {
  const { theme } = useAppTheme();
  const { rideId } = useLocalSearchParams<{ rideId?: string }>();
  const { ride, isLoading } = useRide(rideId);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  if (isLoading) {
    return <Screen><ActivityIndicator color={theme.colors.primary} /></Screen>;
  }

  if (!ride) {
    return (
      <Screen>
        <EmptyState title="Ride summary unavailable" body="Return to Driver Home to continue the demo." actionLabel="Back to Home" onAction={() => router.replace('/(driver)')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Header eyebrow="Payment summary" title="Ride completed!" subtitle="This cash payment is simulated for the presentation." />
      <Card style={styles.card}>
        <Text style={[styles.detail, { color: theme.colors.text }]}>Rider: {ride.riderName ?? 'Rider'}</Text>
        <Text style={[styles.detail, { color: theme.colors.text }]}>Pickup: {ride.pickup}</Text>
        <Text style={[styles.detail, { color: theme.colors.text }]}>Destination: {ride.destination}</Text>
        <Text style={[styles.detail, { color: theme.colors.text }]}>Fare: PHP {ride.fare}</Text>
        <Text style={[styles.detail, { color: theme.colors.text }]}>Payment method: Cash</Text>
        <Text style={[styles.detail, { color: theme.colors.mutedText }]}>Completed: {formatDate(ride.completedAt ?? ride.createdAt)}</Text>
      </Card>
      {paymentConfirmed ? <Text style={[styles.confirmed, { color: theme.colors.primary }]}>Cash payment received and recorded for this demo.</Text> : null}
      {!paymentConfirmed ? <AppButton label="Confirm Payment Received" onPress={() => setPaymentConfirmed(true)} /> : <AppButton label="Back to Driver Home" onPress={() => router.replace('/(driver)')} />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 6,
    marginBottom: 16,
  },
  detail: {
    fontSize: 14,
    lineHeight: 22,
  },
  confirmed: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
});