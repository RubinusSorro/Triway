import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { Header } from '@/components/layout/Header';
import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useDriverRide } from '@/features/driver/hooks/useDriverRide';
import { RideStatusCard } from '@/features/rides/components/RideStatusCard';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function DriverHomeScreen() {
  const { theme } = useAppTheme();
  const { continueAs, signOut } = useAuth();
  const [isOnline, setOnline] = useState(true);
  const { pendingRide, activeRide, driver } = useDriverRide(isOnline);

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
});
