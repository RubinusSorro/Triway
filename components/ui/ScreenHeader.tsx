import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, iconSizes, spacing, touchTargets, typography } from '@/constants/theme';

type ScreenHeaderProps = { title?: string; showBack?: boolean; showActions?: boolean };

function HeaderAction({ icon, label, onPress }: { icon: 'arrow-left' | 'bell' | 'settings'; label: string; onPress?: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} hitSlop={8} onPress={onPress} style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
      <Feather name={icon} size={iconSizes.lg} color={colors.text} />
    </Pressable>
  );
}

export function ScreenHeader({ title, showBack, showActions = true }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.side}>{showBack ? <HeaderAction icon="arrow-left" label="Go back" onPress={() => router.back()} /> : null}</View>
      {title ? <Text numberOfLines={1} style={styles.title}>{title}</Text> : <View style={styles.title} />}
      <View style={styles.sideRight}>
        {showActions ? <><HeaderAction icon="bell" label="Notifications" onPress={() => Alert.alert('Notifications', 'No new TRIWAY notifications.')} /><HeaderAction icon="settings" label="Settings" onPress={() => Alert.alert('Settings', 'Settings will be available in a future update.')} /></> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { minHeight: 48, flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  side: { width: 88, alignItems: 'flex-start' },
  sideRight: { width: 88, flexDirection: 'row', justifyContent: 'flex-end' },
  title: { ...typography.sectionHeading, flex: 1, color: colors.text, textAlign: 'center' },
  action: { width: touchTargets.minimum, height: touchTargets.minimum, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.55 },
});
