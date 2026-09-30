import { Feather } from '@expo/vector-icons';
import { memo, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/constants/theme';
import { TricycleIcon } from './TricycleIcon';

type ListRowProps = { title: string; subtitle?: string; trailing?: ReactNode; onPress?: () => void; accessibilityLabel?: string };

export const ListRow = memo(function ListRow({ title, subtitle, trailing, onPress, accessibilityLabel }: ListRowProps) {
  const content = (
    <>
      <View style={styles.icon}><TricycleIcon size={25} color={colors.primary} /></View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {trailing ?? (onPress ? <View style={styles.chevron}><Feather name="chevron-right" size={19} color={colors.primary} /></View> : null)}
    </>
  );

  if (!onPress) return <View style={styles.row}>{content}</View>;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? title} android_ripple={{ color: colors.primarySoft }} onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      {content}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  row: { minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.tintRow, borderRadius: radii.input, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, overflow: 'hidden' },
  pressed: { opacity: 0.76 },
  icon: { width: 34, alignItems: 'center' },
  copy: { flex: 1 },
  title: { ...typography.bodySemibold, color: colors.text },
  subtitle: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
  chevron: { width: 44, height: 44, borderRadius: radii.pill, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
});
