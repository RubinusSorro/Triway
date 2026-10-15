import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AuthScreen } from '@/components/auth/AuthScreen';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { colors, iconSizes, radii, spacing, typography } from '@/constants/theme';

export default function DriverVerificationScreen() {
  return (
    <AuthScreen eyebrow="Driver verification" title="Verification status" subtitle="Status is shown for the approved interface only; no review was submitted.">
      <Card style={styles.card}>
        <View style={styles.badge}><Feather name="clock" size={iconSizes.sm} color={colors.warning} /><Text style={styles.badgeText}>Pending review</Text></View>
        <Text style={styles.copy}>When real verification is available, an approved driver can receive requests. This prototype does not upload or review documents.</Text>
        <AppButton label="Review documents" variant="outline" onPress={() => router.push('/(auth)/driver-documents')} />
        <AppButton label="Return to demo roles" onPress={() => router.replace('/(auth)/role-selection')} />
      </Card>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  badge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: spacing.xs, borderRadius: radii.pill, backgroundColor: colors.warningSoft, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  badgeText: { ...typography.label, color: colors.warning },
  copy: { ...typography.body, color: colors.textMuted },
});
