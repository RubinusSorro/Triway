import { useFocusEffect, router } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { Header } from '@/components/layout/Header';
import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRideHistory } from '@/features/rides/hooks/useRideHistory';
import { useCurrentRide } from '@/features/rides/hooks/useCurrentRide';
import { getRiderLifecycleRouteForRide } from '@/features/rides/utils/riderLifecycle';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function RiderHistoryScreen() {
  const { theme } = useAppTheme();
  const { user } = useAuth();
  const { rides, isLoading, refresh } = useRideHistory(user?.id);
  const { ride: activeRide } = useCurrentRide(user?.id);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return (
    <Screen>
      <Header eyebrow="Trips" title="Your trips" subtitle="Active, completed, and cancelled trips from this demo session." />
      {activeRide && activeRide.status !== 'cancelled' ? (
        <Card variant="tinted" style={styles.activeRide}>
          <Text style={[styles.activeLabel, { color: theme.colors.primary }]}>ACTIVE RIDE</Text>
          <Text style={[styles.title, { color: theme.colors.text }]}>{activeRide.routeName}</Text>
          <Pressable accessibilityRole="button" onPress={() => router.push(getRiderLifecycleRouteForRide(activeRide) ?? '/(rider)/ride')}><Text style={[styles.openActive, { color: theme.colors.primary }]}>Open ride tracker</Text></Pressable>
        </Card>
      ) : null}
      {isLoading ? <ActivityIndicator color={theme.colors.primary} /> : null}

      {!isLoading && rides.length === 0 ? (
        <EmptyState
          title="No rides yet"
          body="Completed and cancelled trips will appear here after a ride ends."
          actionLabel="Book route"
          onAction={() => router.push('/(rider)/routes')}
        />
      ) : null}

      <View style={styles.list}>
        {rides.map((ride) => (
          <Pressable key={ride.id} accessibilityRole="button" accessibilityLabel={`View details for ${ride.routeName}`} onPress={() => router.push({ pathname: ride.status === 'completed' ? '/(rider)/completed' : '/(rider)/details', params: { rideId: ride.id } })}>
            <Card>
            <View style={styles.row}>
              <View style={styles.copy}>
                <Text style={[styles.title, { color: theme.colors.text }]}>{ride.isReturnRide ? 'QUICK RETURN' : ride.routeName}</Text>
                <Text style={[styles.detail, { color: theme.colors.mutedText }]}>
                  {ride.isReturnRide ? `${ride.pickup} to ${ride.destination} to ${ride.pickup}` : `${ride.pickup} to ${ride.destination}`}
                </Text>
                <Text style={[styles.detail, { color: theme.colors.mutedText }]}>{ride.status === 'cancelled' ? 'Cancelled ride' : `Cash fare PHP ${ride.isReturnRide ? ride.totalFare ?? ride.fare : ride.fare}`}</Text>
              </View>
              <StatusBadge status={ride.status} />
            </View>
            </Card>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 14,
  },
  activeRide: { gap: 8, marginBottom: 16 },
  activeLabel: { fontSize: 12, fontWeight: '800' },
  openActive: { fontSize: 14, fontWeight: '800' },
  row: {
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
  detail: {
    fontSize: 13,
    lineHeight: 19,
  },
});
