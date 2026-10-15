import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useState } from 'react';

import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { TriwayDialog } from '@/components/ui/TriwayDialog';
import { SERVICE_AREA_CITY_NAME } from '@/constants/config';
import { colors, iconSizes, radii, spacing, touchTargets, typography } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRiderPreferences } from '@/hooks/useRiderPreferences';

export default function SettingsScreen() {
  const { rideUpdatesEnabled, setRideUpdatesEnabled } = useRiderPreferences();
  const { signOut } = useAuth();
  const [isConfirmingSignOut, setIsConfirmingSignOut] = useState(false);

  const endDemoSession = () => {
    setIsConfirmingSignOut(false);
    signOut();
    router.replace('/(auth)/role-selection');
  };

  return (
    <Screen bottomSafeArea>
      <ScreenHeader title="Settings" showBack showActions={false} />

      <Text style={styles.sectionTitle}>Ride updates</Text>
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.icon}><Feather accessible={false} name="bell" size={iconSizes.md} color={colors.primary} /></View>
          <View style={styles.copy}>
            <Text style={styles.rowTitle}>Ride updates</Text>
            <Text style={styles.rowDetail}>Demo preference for this Rider session. No notifications are sent.</Text>
          </View>
          <Switch accessibilityLabel="Ride updates" accessibilityHint="Controls the demo ride updates preference for this session" accessibilityState={{ checked: rideUpdatesEnabled }} onValueChange={setRideUpdatesEnabled} thumbColor={rideUpdatesEnabled ? colors.primary : colors.surface} trackColor={{ false: colors.disabled, true: colors.secondary }} value={rideUpdatesEnabled} />
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Location access</Text>
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.icon}><Feather accessible={false} name="map-pin" size={iconSizes.md} color={colors.primary} /></View>
          <View style={styles.copy}>
            <Text style={styles.rowTitle}>Not requested in this prototype</Text>
            <Text style={styles.rowDetail}>TRIWAY does not access device location or provide live tracking in this demo.</Text>
          </View>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>About TRIWAY</Text>
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.icon}><Feather accessible={false} name="info" size={iconSizes.md} color={colors.primary} /></View>
          <View style={styles.copy}>
            <Text style={styles.rowTitle}>Antipolo tricycle booking prototype</Text>
            <Text style={styles.rowDetail}>Fixture-backed routes, sample fares, and cash-payment demonstration for {SERVICE_AREA_CITY_NAME}.</Text>
          </View>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Session</Text>
      <Card style={styles.card}>
        <Pressable accessibilityRole="button" accessibilityLabel="End demo session" onPress={() => setIsConfirmingSignOut(true)} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
          <View style={styles.dangerIcon}><Feather accessible={false} name="log-out" size={iconSizes.md} color={colors.danger} /></View>
          <View style={styles.copy}>
            <Text style={styles.dangerTitle}>End Demo Session</Text>
            <Text style={styles.rowDetail}>Return to role selection. Ride records remain unchanged.</Text>
          </View>
          <Feather accessible={false} name="chevron-right" size={iconSizes.lg} color={colors.textMuted} />
        </Pressable>
      </Card>

      <TriwayDialog visible={isConfirmingSignOut} tone="confirmation" title="End demo session?" message="You will return to role selection. Existing rides and trip records will not be changed." primaryLabel="End Session" secondaryLabel="Keep Riding" onPrimary={endDemoSession} onSecondary={() => setIsConfirmingSignOut(false)} onRequestClose={() => setIsConfirmingSignOut(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { ...typography.label, color: colors.textMuted, letterSpacing: 0.6, marginTop: spacing.lg, marginBottom: spacing.sm },
  card: { padding: 0, overflow: 'hidden' },
  row: { minHeight: touchTargets.comfortable + spacing.sm, flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  icon: { width: touchTargets.minimum, height: touchTargets.minimum, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.tint },
  dangerIcon: { width: touchTargets.minimum, height: touchTargets.minimum, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.warningSoft },
  copy: { flex: 1 },
  rowTitle: { ...typography.bodySemibold, color: colors.text },
  dangerTitle: { ...typography.bodySemibold, color: colors.danger },
  rowDetail: { ...typography.secondaryBody, color: colors.textMuted, marginTop: spacing.xs },
  pressed: { backgroundColor: colors.tintRow, opacity: 0.9 },
});
