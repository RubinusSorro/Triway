import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { TriwayRoute } from '@/features/routes/types/route';
import { useAppTheme } from '@/hooks/useAppTheme';

type RouteCardProps = {
  route: TriwayRoute;
  onPress?: () => void;
};

export function RouteCard({ route, onPress }: RouteCardProps) {
  const { theme } = useAppTheme();
  const content = (
    <Card>
      <View style={styles.row}>
        <View style={styles.routeText}>
          <Text style={[styles.name, { color: theme.colors.text }]}>{route.name}</Text>
          <Text style={[styles.detail, { color: theme.colors.mutedText }]}>
            {route.distanceKm.toFixed(1)} km • around {route.etaMinutes} min
          </Text>
        </View>
        <Text style={[styles.fare, { color: theme.colors.primary }]}>PHP {route.baseFare}</Text>
      </View>
      <Text style={[styles.notes, { color: theme.colors.mutedText }]}>{route.notes}</Text>
    </Card>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.78 : 1 })}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  routeText: {
    flex: 1,
    gap: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 23,
  },
  detail: {
    fontSize: 14,
  },
  fare: {
    fontSize: 18,
    fontWeight: '900',
  },
  notes: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 12,
  },
});
