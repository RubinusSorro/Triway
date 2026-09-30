import { StyleSheet, Text, View } from 'react-native';

import { RideStatus } from '@/features/rides/types/ride';
import { rideStatusMeta } from '@/features/rides/utils/rideStatus';
import { useAppTheme } from '@/hooks/useAppTheme';

type StatusBadgeProps = {
  status: RideStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { theme } = useAppTheme();
  const meta = rideStatusMeta[status];

  return (
    <View style={[styles.badge, { borderColor: meta.color, backgroundColor: theme.colors.background }]}>
      <Text style={[styles.text, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  text: {
    fontSize: 12,
    fontWeight: '800',
  },
});
