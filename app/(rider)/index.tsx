import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { SearchBar } from '@/components/ui/SearchBar';
import { ZigzagDivider } from '@/components/ui/ZigzagDivider';
import { SERVICE_AREA_CITY_NAME, SERVICE_AREA_LABEL } from '@/constants/config';
import { colors, radii, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCurrentRide } from '@/features/rides/hooks/useCurrentRide';

export default function RiderHomeScreen() {
  const { user } = useAuth();
  const { ride } = useCurrentRide(user?.id);

  return (
    <Screen includeTabBarPadding>
      <SearchBar onFilterPress={() => router.push('/(rider)/routes')} />

      <Card style={styles.locationCard}>
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={24} color={colors.text} />
          <View style={styles.locationCopy}>
            <Text style={styles.locationLabel}>Your location</Text>
            <Text style={styles.locationValue}>{SERVICE_AREA_LABEL}</Text>
          </View>
        </View>
        <View style={styles.divider}><ZigzagDivider /></View>
        <Text style={styles.prompt}>Check the ways in which you can book a tricycle ride in {SERVICE_AREA_CITY_NAME}!</Text>
        <View style={styles.actionRow}>
          <Text style={styles.bookNow}>Book now!</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Book a ride now" onPress={() => router.push('/(rider)/booking')} style={({ pressed }) => [styles.arrowButton, pressed && styles.pressed]}>
            <Feather name="arrow-right" size={22} color={colors.onPrimary} />
          </Pressable>
        </View>
      </Card>

      <Card variant="tinted" style={styles.loginCard}>
        <Text style={styles.loginText}>Log in for better user experience.</Text>
      </Card>

      {ride && ride.status !== 'cancelled' ? (
        <Card style={styles.rideCard}>
          <Text style={styles.rideEyebrow}>ACTIVE RIDE</Text>
          <Text style={styles.rideTitle}>{ride.routeName}</Text>
          <Pressable accessibilityRole="button" onPress={() => router.push('/(rider)/ride')} style={({ pressed }) => [styles.rideLink, pressed && styles.pressed]}>
            <Text style={styles.rideLinkText}>Open ride tracker</Text>
            <Feather name="arrow-right" size={18} color={colors.primary} />
          </Pressable>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  locationCard: { marginTop: spacing.xl, padding: spacing.xl },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  locationCopy: { flex: 1 },
  locationLabel: { ...typography.caption, color: colors.textMuted },
  locationValue: { ...typography.subtitle, color: colors.text, marginTop: spacing.xs },
  divider: { marginVertical: spacing.xl },
  prompt: { ...typography.body, color: colors.text, maxWidth: 270 },
  actionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.lg },
  bookNow: { ...typography.bodySemibold, color: colors.primary },
  arrowButton: { width: 48, height: 48, borderRadius: radii.pill, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.72, transform: [{ scale: 0.97 }] },
  loginCard: { marginTop: spacing.xl, minHeight: 78, justifyContent: 'center' },
  loginText: { ...typography.body, color: colors.text },
  rideCard: { marginTop: spacing.xl },
  rideEyebrow: { ...typography.captionSemibold, color: colors.primary },
  rideTitle: { ...typography.sectionTitle, color: colors.text, marginTop: spacing.sm },
  rideLink: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, alignSelf: 'flex-start', marginTop: spacing.sm },
  rideLinkText: { ...typography.bodySemibold, color: colors.primary },
});
