import { Feather } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { iconSizes, spacing, typography } from '@/constants/theme';
import { RideStatus } from '@/features/rides/types/ride';
import { rideStatusMeta } from '@/features/rides/utils/rideStatus';
import { useAppTheme } from '@/hooks/useAppTheme';

type StatusBadgeProps = {
  status: RideStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { theme } = useAppTheme();
  const meta = rideStatusMeta[status];
  const icon = statusIcons[status];

  return (
    <View accessibilityLabel={`Ride status: ${meta.label}`} style={[styles.badge, { borderColor: meta.color, backgroundColor: theme.colors.background }]}>
      <Feather accessible={false} name={icon} size={iconSizes.sm} color={meta.color} />
      <Text style={[styles.text, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
}

const statusIcons: Record<RideStatus, ComponentProps<typeof Feather>['name']> = {
  requested: 'clock',
  accepted: 'check-circle',
  arriving: 'navigation',
  ongoing: 'map',
  waiting_return: 'rotate-ccw',
  completed: 'check-circle',
  cancelled: 'x-circle',
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  text: typography.label,
});
