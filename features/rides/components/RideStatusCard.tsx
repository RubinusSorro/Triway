import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Ride } from '@/features/rides/types/ride';
import { rideStatusMeta, rideStatusSteps } from '@/features/rides/utils/rideStatus';
import { useAppTheme } from '@/hooks/useAppTheme';

type RideStatusCardProps = {
  ride: Ride;
  perspective: 'rider' | 'driver';
};

export function RideStatusCard({ ride, perspective }: RideStatusCardProps) {
  const { theme } = useAppTheme();
  const meta = rideStatusMeta[ride.status];
  const currentIndex = rideStatusSteps.indexOf(ride.status);

  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.textGroup}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{ride.routeName}</Text>
          <Text style={[styles.copy, { color: theme.colors.mutedText }]}>
            {perspective === 'rider' ? meta.riderCopy : meta.driverCopy}
          </Text>
        </View>
        <StatusBadge status={ride.status} />
      </View>

      <View style={styles.progress}>
        {rideStatusSteps.map((status, index) => {
          const isDone = index <= currentIndex;

          return (
            <View key={status} style={styles.stepWrap}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: isDone ? theme.colors.primary : theme.colors.border },
                ]}
              />
              <Text style={[styles.stepLabel, { color: isDone ? theme.colors.text : theme.colors.mutedText }]}>
                {rideStatusMeta[status].label}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
      <Text style={[styles.detail, { color: theme.colors.text }]}>Pickup: {ride.pickup}</Text>
      <Text style={[styles.detail, { color: theme.colors.text }]}>Drop-off: {ride.destination}</Text>
      <Text style={[styles.detail, { color: theme.colors.text }]}>Cash fare: PHP {ride.fare}</Text>
      {ride.driver ? (
        <Text style={[styles.detail, { color: theme.colors.text }]}>
          Driver: {ride.driver.name} • {ride.driver.plateNumber}
        </Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  textGroup: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    lineHeight: 24,
  },
  copy: {
    fontSize: 14,
    lineHeight: 20,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
    marginTop: 18,
  },
  stepWrap: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    marginVertical: 15,
  },
  detail: {
    fontSize: 14,
    lineHeight: 22,
  },
});
