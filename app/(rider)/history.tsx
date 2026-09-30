import { useFocusEffect, router } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

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
      <Header eyebrow="History" title="Completed rides" subtitle="Trips appear here once the driver completes the shared ride." />
      {isLoading ? <ActivityIndicator color={theme.colors.primary} /> : null}

      {!isLoading && rides.length === 0 ? (
        <EmptyState
          title="No completed rides yet"
          body="Complete the driver flow and return here to show the history requirement."
          actionLabel="Book route"
          onAction={() => router.push('/(rider)/routes')}
        />
      ) : null}

      <View style={styles.list}>
        {rides.map((ride) => (
          <Card key={ride.id}>
            <View style={styles.row}>
              <View style={styles.copy}>
                <Text style={[styles.title, { color: theme.colors.text }]}>{ride.routeName}</Text>
                <Text style={[styles.detail, { color: theme.colors.mutedText }]}>
                  {ride.pickup} to {ride.destination}
                </Text>
                <Text style={[styles.detail, { color: theme.colors.mutedText }]}>Cash fare PHP {ride.fare}</Text>
              </View>
              <StatusBadge status={ride.status} />
            </View>
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
