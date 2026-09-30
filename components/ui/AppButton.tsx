import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';

import { colors, radii, spacing, typography } from '@/constants/theme';
import { PrimaryButton } from './PrimaryButton';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type AppButtonProps = { label: string; onPress: () => void; disabled?: boolean; variant?: ButtonVariant; style?: StyleProp<ViewStyle> };

export function AppButton({ label, onPress, disabled, variant = 'primary', style }: AppButtonProps) {
  if (variant === 'primary') return <PrimaryButton label={label} onPress={onPress} disabled={disabled} style={style} />;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'danger' ? styles.danger : styles.secondary,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.label, variant === 'danger' && styles.dangerLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 50, borderRadius: radii.button, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg, borderWidth: 1 },
  secondary: { backgroundColor: colors.surface, borderColor: colors.primary },
  danger: { backgroundColor: colors.danger, borderColor: colors.danger },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.45 },
  label: { ...typography.button, color: colors.primary },
  dangerLabel: { color: colors.onPrimary },
});
