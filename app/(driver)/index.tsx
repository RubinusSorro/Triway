import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Switch, Text, View } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { Header } from '@/components/layout/Header';
import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useDriverRide } from '@/features/driver/hooks/useDriverRide';
import { useRideHistory } from '@/features/rides/hooks/useRideHistory';
import { RideStatusCard } from '@/features/rides/components/RideStatusCard';
import { demoDriver } from '@/features/rides/services/mockRideRepository';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function DriverHomeScreen() {
  const { theme } = useAppTheme();
  const { continueAs, signOut } = useAuth();
  const [isOnline, setOnline] = useState(true);
  const { pendingRide, activeRide, driver } = useDriverRide(isOnline);
  const { rides: completedRides, isLoading: isHistoryLoading, refresh } = useRideHistory(demoDriver.id, 'driver');

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const today = new Date().toDateString();
  const todayRides = completedRides.filter((ride) => ride.status === 'completed' && new Date(ride.completedAt ?? ride.createdAt).toDateString() === today);
  const todayEarnings = todayRides.reduce((total, ride) => total + ride.fare, 0);

  const switchToRider = () => {
    continueAs('rider');
    router.replace('/(rider)');
  };

  return (
    <Screen>
      <Header eyebrow="Driver" title={`Good day, ${driver.name}`} subtitle={`${driver.vehicle} • ${driver.plateNumber}`} />

      <Card style={styles.onlineCard}>
        <View style={styles.onlineRow}>
          <View style={styles.onlineText}>
            <Text style={[styles.onlineTitle, { color: theme.colors.text }]}>Driver availability</Text>
            <Text style={[styles.onlineCopy, { color: theme.colors.mutedText }]}>
              {isOnline ? 'Online and ready for requests.' : 'Offline. Go online to receive requests.'}
            </Text>
          </View>
          <Switch value={isOnline} onValueChange={setOnline} trackColor={{ true: theme.colors.primary }} />
        </View>
      </Card>

      {activeRide ? (
        <>
          <RideStatusCard ride={activeRide} perspective="driver" />
          <AppButton label="Open driver controls" onPress={() => router.push('/(driver)/ride')} />
        </>
      ) : pendingRide ? (
        <EmptyState
          title="Incoming request"
          body={`${pendingRide.routeName} is waiting for a driver.`}
          actionLabel="Review request"
          onAction={() => router.push('/(driver)/request')}
        />
      ) : (
        <EmptyState
          title="No rider request"
          body="Book a ride in rider view first, then return here to accept it."
          actionLabel="Switch to Rider"
          onAction={switchToRider}
        />
      )}

      <View style={styles.summaryRow}>
        <Card style={styles.summaryCard}>
          <Text style={[styles.summaryLabel, { color: theme.colors.mutedText }]}>Completed rides</Text>
          <Text style={[styles.summaryValue, { color: theme.colors.text }]}>{todayRides.length}</Text>
          <Text style={[styles.summaryHint, { color: theme.colors.mutedText }]}>Today</Text>
        </Card>
        <Card style={styles.summaryCard}>
          <Text style={[styles.summaryLabel, { color: theme.colors.mutedText }]}>Today&apos;s earnings</Text>
          <Text style={[styles.summaryValue, { color: theme.colors.text }]}>PHP {todayEarnings}</Text>
          <Text style={[styles.summaryHint, { color: theme.colors.mutedText }]}>Cash fares</Text>
        </Card>
      </View>

      <Card style={styles.recentCard}>
        <View style={styles.recentHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent rides</Text>
          <AppButton label="View ride history" variant="secondary" onPress={() => router.push('/(driver)/history')} style={styles.historyButton} />
        </View>
        {isHistoryLoading ? <ActivityIndicator color={theme.colors.primary} /> : completedRides.length === 0 ? (
          <Text style={[styles.emptyRecent, { color: theme.colors.mutedText }]}>No completed rides yet.</Text>
        ) : completedRides.slice(0, 3).map((ride) => (
          <View key={ride.id} style={[styles.recentRide, { borderTopColor: theme.colors.border }]}>
            <View style={styles.recentCopy}>
              <Text style={[styles.recentRider, { color: theme.colors.text }]}>{ride.riderName ?? 'Rider'}</Text>
              <Text style={[styles.recentRoute, { color: theme.colors.mutedText }]}>{ride.pickup} to {ride.destination}</Text>
              <Text style={[styles.recentFare, { color: theme.colors.text }]}>PHP {ride.fare}</Text>
            </View>
            <Text style={[styles.recentStatus, { color: ride.status === 'completed' ? theme.colors.primary : theme.colors.danger }]}>{ride.status === 'completed' ? 'Completed' : 'Cancelled'}</Text>
          </View>
        ))}
      </Card>

      <View style={styles.footerActions}>
        <AppButton label="Rider view" variant="secondary" onPress={switchToRider} style={styles.actionButton} />
        <AppButton label="Sign out" variant="ghost" onPress={() => { signOut(); router.replace('/(auth)'); }} style={styles.actionButton} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  onlineCard: {
    marginBottom: 16,
  },
  onlineRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  onlineText: {
    flex: 1,
  },
  onlineTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  onlineCopy: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
  },
  footerActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  summaryCard: {
    flex: 1,
    gap: 4,
  },
  summaryLabel: {
    fontSize: 12,
    lineHeight: 16,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  summaryHint: {
    fontSize: 12,
    lineHeight: 16,
  },
  recentCard: {
    marginTop: 16,
    gap: 10,
  },
  recentHeader: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  historyButton: {
    alignSelf: 'flex-start',
  },
  emptyRecent: {
    fontSize: 14,
    lineHeight: 20,
  },
  recentRide: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    paddingTop: 10,
  },
  recentCopy: {
    flex: 1,
    gap: 3,
  },
  recentRider: {
    fontSize: 15,
    fontWeight: '700',
  },
  recentRoute: {
    fontSize: 13,
    lineHeight: 18,
  },
  recentFare: {
    fontSize: 13,
    lineHeight: 18,
  },
  recentStatus: {
    fontSize: 12,
    fontWeight: '700',
  },
});
