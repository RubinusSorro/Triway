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
import { useAppTheme } from '@/hooks/useAppTheme';

export default function RiderHistoryScreen() {
  const { theme } = useAppTheme();
  const { user } = useAuth();
  const { rides, isLoading, refresh } = useRideHistory(user?.id);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return (
    <Screen>
      <Header eyebrow="History" title="Ride history" subtitle="Completed and cancelled trips from this demo session." />
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
          <Pressable key={ride.id} accessibilityRole="button" accessibilityLabel={`View details for ${ride.routeName}`} onPress={() => router.push({ pathname: '/(rider)/details', params: { rideId: ride.id } })}>
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
