import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
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
      <Image accessibilityLabel="TRIWAY official logo" source={require('../../assets/images/TRIWAY.png')} style={styles.logo} />
      <Text style={styles.eyebrow}>CHOOSE YOUR DEMO VIEW</Text>
      <Text accessibilityRole="header" style={styles.title}>How will you use TRIWAY?</Text>
      <Text style={styles.body}>Choose a view for the {SERVICE_AREA_CITY_NAME} ride-booking demo. A real account can have only one role.</Text>

      <View style={styles.cards}>
        <Card>
          <Text style={styles.cardTitle}>Rider</Text>
          <Text style={styles.cardText}>Choose a local route, review the cash fare, book a ride, and follow its status.</Text>
          <AppButton label="Continue as Rider" onPress={() => chooseRole('rider')} />
          <Pressable accessibilityRole="link" accessibilityLabel="View Rider sign in preview" onPress={() => router.push('/(auth)/rider-login')}><Text style={styles.previewLink}>View Rider sign-in preview</Text></Pressable>
        </Card>
        <Card>
          <Text style={styles.cardTitle}>Driver</Text>
          <Text style={styles.cardText}>Receive the rider request and update the shared ride from pickup to completion.</Text>
          <AppButton label="Continue as Driver" variant="secondary" onPress={() => chooseRole('driver')} />
          <Pressable accessibilityRole="link" accessibilityLabel="View Driver sign in preview" onPress={() => router.push('/(auth)/driver-login')}><Text style={styles.previewLink}>View Driver sign-in preview</Text></Pressable>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  logo: { width: 72, height: 72, borderRadius: radii.card, marginTop: spacing.xxl },
  eyebrow: { ...typography.captionSemibold, color: colors.primary, marginTop: spacing.xl },
  title: { ...typography.title, color: colors.text, marginTop: spacing.sm },
  body: { ...typography.body, color: colors.textMuted, marginTop: spacing.sm },
  cards: { gap: spacing.lg, marginTop: spacing.xxl },
  cardTitle: { ...typography.sectionTitle, color: colors.text },
  cardText: { ...typography.body, color: colors.textMuted, marginTop: spacing.sm, marginBottom: spacing.lg },
  previewLink: { ...typography.secondaryBody, color: colors.secondary, textAlign: 'center', marginTop: spacing.md },
});
