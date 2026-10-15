import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TricycleIcon } from '@/components/ui/TricycleIcon';
import { colors, iconSizes, radii, shadows, spacing, typography } from '@/constants/theme';
import { TriwayRoute } from '@/features/routes/types/route';

type RouteCardProps = {
  route: TriwayRoute;
  onPress: () => void;
  accessibilityLabel?: string;
};

export function RouteCard({ route, onPress, accessibilityLabel }: RouteCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? `Choose route ${route.name}, sample fare ${route.baseFare} pesos`}
      android_ripple={{ color: colors.primarySoft }}
      onPress={onPress}
      style={({ pressed }) => [styles.ticket, pressed && styles.pressed]}
    >
      <View style={styles.main}>
        <View style={styles.titleRow}>
          <TricycleIcon size={iconSizes.lg} color={colors.primary} />
          <Text numberOfLines={2} style={styles.name}>{route.name}</Text>
        </View>
        <View style={styles.stop}><View style={styles.startDot} /><Text style={styles.stopText}>{route.origin}</Text></View>
        <View style={styles.line} />
        <View style={styles.stop}><View style={styles.endDot} /><Text style={styles.stopText}>{route.destination}</Text></View>
        <Text style={styles.meta}>{route.distanceKm.toFixed(1)} km • around {route.etaMinutes} min</Text>
      </View>
      <View style={styles.farePanel}>
        <Text style={styles.fareLabel}>DEMO FARE</Text>
        <Text style={styles.fare}>₱{route.baseFare}</Text>
        <Feather name="arrow-right" size={iconSizes.md} color={colors.primary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ticket: { minHeight: 156, flexDirection: 'row', overflow: 'hidden', backgroundColor: colors.surface, borderRadius: radii.card, ...shadows.card },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  main: { flex: 1, padding: spacing.lg },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginBottom: spacing.md },
  name: { ...typography.bodySemibold, color: colors.text, flex: 1 },
  stop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 20 },
  startDot: { width: 10, height: 10, borderRadius: radii.pill, backgroundColor: colors.secondary },
  endDot: { width: 10, height: 10, borderRadius: radii.sm, backgroundColor: colors.primary },
  stopText: { ...typography.secondaryBody, color: colors.text, flex: 1 },
  line: { width: 2, height: 12, backgroundColor: colors.border, marginLeft: 4, marginVertical: spacing.xs },
  meta: { ...typography.caption, color: colors.textMuted, marginTop: spacing.md },
  farePanel: { width: 94, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.background, borderLeftWidth: 2, borderLeftColor: colors.border, borderStyle: 'dashed', padding: spacing.sm },
  fareLabel: { ...typography.label, color: colors.textMuted, textAlign: 'center' },
  fare: { ...typography.sectionHeading, color: colors.primary },
});
