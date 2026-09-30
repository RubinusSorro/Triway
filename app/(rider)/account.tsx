import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { colors, spacing, typography } from '@/constants/theme';
import { SERVICE_AREA_CITY_NAME } from '@/constants/config';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function AccountScreen() {
  const { user, continueAs, signOut } = useAuth();
  return (
    <Screen includeTabBarPadding>
      <ScreenHeader title="Account" showActions={false} />
      <Card style={styles.card}>
        <Text style={styles.name}>{user?.name ?? 'TRIWAY Rider'}</Text>
        <Text style={styles.copy}>Manage your {SERVICE_AREA_CITY_NAME} rides and demo preferences.</Text>
        <AppButton label="View ride history" variant="secondary" onPress={() => router.push('/(rider)/history')} />
        <AppButton label="Switch to Driver" variant="secondary" onPress={() => { continueAs('driver'); router.replace('/(driver)'); }} />
        <AppButton label="Sign out" variant="ghost" onPress={() => { signOut(); router.replace('/(auth)'); }} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  name: { ...typography.title, color: colors.text },
  copy: { ...typography.body, color: colors.textMuted, marginBottom: spacing.sm },
});
