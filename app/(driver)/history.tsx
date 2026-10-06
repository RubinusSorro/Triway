import { useFocusEffect, router } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { Header } from '@/components/layout/Header';
import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { demoDriver } from '@/features/rides/services/mockRideRepository';
import { useRideHistory } from '@/features/rides/hooks/useRideHistory';
import { useAppTheme } from '@/hooks/useAppTheme';

function formatDate(value: string) {
  return new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
}

function paymentLabel(paymentMethod: string) {
  return paymentMethod === 'cash' ? 'Cash' : paymentMethod;
}

export default function DriverHistoryScreen() {
  const { theme } = useAppTheme();
  const { rides, isLoading, refresh } = useRideHistory(demoDriver.id, 'driver');

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return (
    <Screen>
      <Header eyebrow="Driver" title="Ride history" subtitle="Completed and cancelled trips from this demo session." />
      {isLoading ? <ActivityIndicator color={theme.colors.primary} /> : null}
      {!isLoading && rides.length === 0 ? (
        <EmptyState
          title="No completed rides yet"
          body="Completed driver trips will appear here after you confirm payment."
          actionLabel="Back to Home"
          onAction={() => router.replace('/(driver)')}
        />
      ) : null}
      <View style={styles.list}>
        {rides.map((ride) => (
          <Card key={ride.id}>
            <View style={styles.header}>
              <View style={styles.copy}>
                <Text style={[styles.title, { color: theme.colors.text }]}>{ride.riderName ?? 'Rider'}</Text>
                <Text style={[styles.route, { color: theme.colors.mutedText }]}>{ride.pickup} to {ride.destination}</Text>
              </View>
              <StatusBadge status={ride.status} />
            </View>
            <Text style={[styles.detail, { color: theme.colors.text }]}>Fare: PHP {ride.fare}</Text>
            <Text style={[styles.detail, { color: theme.colors.text }]}>Payment: {paymentLabel(ride.paymentMethod)}</Text>
            <Text style={[styles.detail, { color: theme.colors.mutedText }]}>Date: {formatDate(ride.completedAt ?? ride.createdAt)}</Text>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  copy: {
    flex: 1,
    gap: 5,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
  },
  route: {
    fontSize: 13,
    lineHeight: 19,
  },
  detail: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },
});