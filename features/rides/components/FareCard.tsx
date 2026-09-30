import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { TriwayRoute } from '@/features/routes/types/route';
import { useAppTheme } from '@/hooks/useAppTheme';

type FareCardProps = {
  route: TriwayRoute;
};

export function FareCard({ route }: FareCardProps) {
  const { theme } = useAppTheme();

  return (
    <Card>
      <Text style={[styles.label, { color: theme.colors.mutedText }]}>Upfront cash fare</Text>
      <View style={styles.row}>
        <Text style={[styles.fare, { color: theme.colors.primary }]}>PHP {route.baseFare}</Text>
        <Text style={[styles.meta, { color: theme.colors.mutedText }]}>
          {route.distanceKm.toFixed(1)} km • {route.etaMinutes} min
        </Text>
      </View>
      <Text style={[styles.note, { color: theme.colors.mutedText }]}>
        Sample academic fare only. Not an official regulated fare.
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  fare: {
    fontSize: 34,
    fontWeight: '900',
  },
  meta: {
    fontSize: 14,
    paddingBottom: 6,
  },
  note: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
  },
});
