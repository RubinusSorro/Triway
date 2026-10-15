import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { colors, iconSizes, radii, spacing, touchTargets, typography } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';

const FALLBACK_RIDER = { name: 'TRIWAY Rider', email: 'rider@triway.demo' };

function initialsFor(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'TR';
}

type ProfileActionProps = {
  icon: 'clock' | 'settings';
  title: string;
  detail: string;
  onPress: () => void;
};

function ProfileAction({ icon, title, detail, onPress }: ProfileActionProps) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
      <View style={styles.actionIcon}><Feather accessible={false} name={icon} size={iconSizes.md} color={colors.primary} /></View>
      <View style={styles.actionCopy}><Text style={styles.actionTitle}>{title}</Text><Text style={styles.actionDetail}>{detail}</Text></View>
      <Feather accessible={false} name="chevron-right" size={iconSizes.lg} color={colors.textMuted} />
    </Pressable>
  );
}

export default function AccountScreen() {
  const { user } = useAuth();
  const rider = user?.role === 'rider' ? user : FALLBACK_RIDER;

  return (
    <Screen includeTabBarPadding>
      <ScreenHeader title="Profile" showActions={false} />

      <Card style={styles.identityCard}>
        <View accessible accessibilityLabel={`${rider.name} profile`} style={styles.avatar}><Text style={styles.avatarText}>{initialsFor(rider.name)}</Text></View>
        <View style={styles.identityCopy}>
          <Text accessibilityRole="header" style={styles.name}>{rider.name}</Text>
          <Text style={styles.email}>{rider.email}</Text>
          <Text style={styles.sessionNote}>Prototype demo session</Text>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Activity</Text>
      <Card style={styles.sectionCard}>
        <ProfileAction icon="clock" title="My Trips" detail="View active and completed rides" onPress={() => router.push('/(rider)/history')} />
      </Card>

      <Text style={styles.sectionTitle}>Account</Text>
      <Card style={styles.sectionCard}>
        <ProfileAction icon="settings" title="Settings" detail="Demo preferences and session controls" onPress={() => router.push('/(rider)/settings')} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  identityCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  avatar: { width: 64, height: 64, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  avatarText: { ...typography.sectionHeading, color: colors.onPrimary },
  identityCopy: { flex: 1, minWidth: 0 },
  name: { ...typography.sectionHeading, color: colors.text },
  email: { ...typography.secondaryBody, color: colors.textMuted, marginTop: spacing.xs },
  sessionNote: { ...typography.captionSemibold, color: colors.secondary, marginTop: spacing.sm },
  sectionTitle: { ...typography.label, color: colors.textMuted, letterSpacing: 0.6, marginTop: spacing.xxl, marginBottom: spacing.sm },
  sectionCard: { padding: 0, overflow: 'hidden' },
  action: { minHeight: touchTargets.comfortable + spacing.sm, flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  actionIcon: { width: touchTargets.minimum, height: touchTargets.minimum, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.tint },
  actionCopy: { flex: 1 },
  actionTitle: { ...typography.bodySemibold, color: colors.text },
  actionDetail: { ...typography.secondaryBody, color: colors.textMuted, marginTop: spacing.xs },
  pressed: { backgroundColor: colors.tintRow, opacity: 0.9 },
});
