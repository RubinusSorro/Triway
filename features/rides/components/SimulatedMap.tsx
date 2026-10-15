import { DimensionValue, StyleSheet, Text, View } from 'react-native';

import { RideStatus } from '@/features/rides/types/ride';
import { useAppTheme } from '@/hooks/useAppTheme';

type SimulatedMapProps = {
  pickup: string;
  destination: string;
  status?: RideStatus;
};

const driverPositionByStatus: Record<RideStatus, DimensionValue> = {
  requested: '12%',
  accepted: '28%',
  arriving: '46%',
  ongoing: '68%',
  waiting_return: '78%',
  completed: '88%',
  cancelled: '12%',
};

export function SimulatedMap({ pickup, destination, status = 'requested' }: SimulatedMapProps) {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.map, { backgroundColor: theme.colors.elevated, borderColor: theme.colors.border }]}>
      <View style={[styles.routeLine, { backgroundColor: theme.colors.border }]} />
      <View style={[styles.pin, styles.pickup, { backgroundColor: theme.colors.primary }]} />
      <View style={[styles.pin, styles.destination, { backgroundColor: theme.colors.info }]} />
      <View
        style={[
          styles.driver,
          {
            left: driverPositionByStatus[status],
            backgroundColor: theme.colors.warning,
            borderColor: theme.colors.surface,
          },
        ]}
      />
      <View style={styles.mapText}>
        <Text style={[styles.place, { color: theme.colors.text }]}>{pickup}</Text>
        <Text style={[styles.place, { color: theme.colors.text }]}>{destination}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 190,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
    justifyContent: 'center',
  },
  routeLine: {
    position: 'absolute',
    left: '13%',
    right: '13%',
    top: '48%',
    height: 6,
    borderRadius: 999,
  },
  pin: {
    position: 'absolute',
    top: '42%',
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  pickup: {
    left: '10%',
  },
  destination: {
    right: '10%',
  },
  driver: {
    position: 'absolute',
    top: '37%',
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 3,
  },
  mapText: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  place: {
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
  },
});
