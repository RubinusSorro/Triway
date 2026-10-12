import { Feather } from '@expo/vector-icons';
import { ComponentProps, useState } from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors, radii, spacing, typography } from '@/constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

type AppButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  icon?: ComponentProps<typeof Feather>['name'];
};

export function AppButton({ label, onPress, disabled = false, loading = false, variant = 'primary', style, accessibilityLabel, icon }: AppButtonProps) {
  const isDisabled = disabled || loading;
  const [isFocused, setIsFocused] = useState(false);
  const variantStyle = getVariantStyle(variant);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      android_ripple={{ color: variant === 'primary' || variant === 'danger' ? 'rgba(255, 255, 255, 0.20)' : colors.primarySoft }}
      disabled={isDisabled}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onPress={onPress}
      style={({ pressed }) => [styles.button, variantStyle.button, pressed && styles.pressed, isFocused && styles.focused, isDisabled && styles.disabled, style]}
    >
      {loading ? <ActivityIndicator color={variantStyle.indicator} /> : (
        <View style={styles.content}>
          {icon ? <Feather accessible={false} name={icon} size={20} color={isDisabled ? colors.textMuted : variantStyle.icon} /> : null}
          <Text numberOfLines={2} style={[styles.label, variantStyle.label, isDisabled && styles.disabledLabel]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 52, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg, borderWidth: 1, overflow: 'hidden' },
  primary: { backgroundColor: colors.primary, borderColor: colors.primary },
  secondary: { backgroundColor: colors.tint, borderColor: colors.tint },
  outline: { backgroundColor: colors.surface, borderColor: colors.primary },
  ghost: { backgroundColor: colors.transparent, borderColor: colors.transparent },
  danger: { backgroundColor: colors.danger, borderColor: colors.danger },
  pressed: { opacity: 0.84, transform: [{ scale: 0.99 }] },
  focused: { borderColor: colors.secondary, borderWidth: 2 },
  disabled: { backgroundColor: colors.disabledBackground, borderColor: colors.disabledBackground, opacity: 1 },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, maxWidth: '100%' },
  label: { ...typography.button, flexShrink: 1, textAlign: 'center' },
  disabledLabel: { color: colors.textMuted },
  onSolidLabel: { color: colors.onPrimary },
  secondaryLabel: { color: colors.primary },
  outlineLabel: { color: colors.primary },
  ghostLabel: { color: colors.primary },
});

function getVariantStyle(variant: ButtonVariant) {
  const variants = {
    primary: { button: styles.primary, label: styles.onSolidLabel, indicator: colors.onPrimary, icon: colors.onPrimary },
    secondary: { button: styles.secondary, label: styles.secondaryLabel, indicator: colors.primary, icon: colors.primary },
    outline: { button: styles.outline, label: styles.outlineLabel, indicator: colors.primary, icon: colors.primary },
    ghost: { button: styles.ghost, label: styles.ghostLabel, indicator: colors.primary, icon: colors.primary },
    danger: { button: styles.danger, label: styles.onSolidLabel, indicator: colors.onPrimary, icon: colors.onPrimary },
  } as const;

  return variants[variant];
}
