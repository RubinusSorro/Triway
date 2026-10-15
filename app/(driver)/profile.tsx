import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { colors, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { demoDriver } from '@/features/rides/services/mockRideRepository';

export default function DriverProfileScreen() {
  const { signOut } = useAuth();

  return (
    <Screen includeTabBarPadding>
      <ScreenHeader title="Profile" showActions={false} />
      <Card style={styles.card}>
        <Text style={styles.name}>{demoDriver.name}</Text>
        <Text style={styles.copy}>{demoDriver.vehicle} • {demoDriver.plateNumber}</Text>
        <Text style={styles.status}>Verified status is shown for this classroom demo only.</Text>
        <AppButton label="View ride history" variant="secondary" onPress={() => router.push('/(driver)/history')} />
        <AppButton label="Sign out" variant="ghost" onPress={() => { signOut(); router.replace('/(auth)/role-selection'); }} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  name: { ...typography.title, color: colors.text },
  copy: { ...typography.body, color: colors.textMuted },
  status: { ...typography.secondaryBody, color: colors.textMuted, marginBottom: spacing.sm },
});
