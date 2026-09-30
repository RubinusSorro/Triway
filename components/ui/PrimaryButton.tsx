import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';

import { colors, radii, spacing, typography } from '@/constants/theme';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export function PrimaryButton({ label, onPress, disabled, loading, style, accessibilityLabel }: PrimaryButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      disabled={isDisabled}
      android_ripple={{ color: colors.primarySoft }}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, isDisabled && styles.disabled, style]}
    >
      {loading ? <ActivityIndicator color={colors.onPrimary} /> : <Text style={styles.label}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: radii.button,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    overflow: 'hidden',
  },
  pressed: { backgroundColor: colors.primaryDark, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.45 },
  label: { ...typography.button, color: colors.onPrimary },
});
