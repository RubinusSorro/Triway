import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { TricycleIcon } from '@/components/ui/TricycleIcon';
import { SERVICE_AREA_CITY_NAME } from '@/constants/config';
import { colors, radii, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function RoleSelectionScreen() {
  const { continueAs } = useAuth();
  const chooseRole = (role: 'rider' | 'driver') => {
    continueAs(role);
    router.replace(role === 'rider' ? '/(rider)' : '/(driver)');
  };

  return (
    <Screen>
      <View style={styles.brandIcon}><TricycleIcon size={42} color={colors.onPrimary} /></View>
      <Text style={styles.eyebrow}>YOUR RIDE, YOUR WAY</Text>
      <Text accessibilityRole="header" style={styles.title}>How will you use TRIWAY?</Text>
      <Text style={styles.body}>Choose a view for the {SERVICE_AREA_CITY_NAME} ride-booking demo.</Text>

      <View style={styles.cards}>
        <Card>
          <Text style={styles.cardTitle}>Rider</Text>
          <Text style={styles.cardText}>Choose a local route, review the cash fare, book a ride, and follow its status.</Text>
          <AppButton label="Log in as Rider" onPress={() => chooseRole('rider')} />
        </Card>
        <Card>
          <Text style={styles.cardTitle}>Driver</Text>
          <Text style={styles.cardText}>Receive the rider request and update the shared ride from pickup to completion.</Text>
          <AppButton label="Log in as Driver" variant="secondary" onPress={() => chooseRole('driver')} />
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brandIcon: { width: 72, height: 72, borderRadius: radii.card, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginTop: spacing.xxl },
  eyebrow: { ...typography.captionSemibold, color: colors.primary, marginTop: spacing.xl },
  title: { ...typography.title, color: colors.text, marginTop: spacing.sm },
  body: { ...typography.body, color: colors.textMuted, marginTop: spacing.sm },
  cards: { gap: spacing.lg, marginTop: spacing.xxl },
  cardTitle: { ...typography.sectionTitle, color: colors.text },
  cardText: { ...typography.body, color: colors.textMuted, marginTop: spacing.sm, marginBottom: spacing.lg },
});
