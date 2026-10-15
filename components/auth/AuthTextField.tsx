import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { colors, iconSizes, radii, spacing, typography } from '@/constants/theme';

type AuthTextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  password?: boolean;
};

export function AuthTextField({ label, error, password = false, secureTextEntry, ...inputProps }: AuthTextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isSecure = password && !isVisible;

  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.field, isFocused && styles.focused, error && styles.errorField]}>
        <TextInput
          {...inputProps}
          accessibilityLabel={label}
          accessibilityHint={error ?? inputProps.accessibilityHint}
          autoCapitalize="none"
          onFocus={(event) => { setIsFocused(true); inputProps.onFocus?.(event); }}
          onBlur={(event) => { setIsFocused(false); inputProps.onBlur?.(event); }}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={password ? isSecure : secureTextEntry}
          style={styles.input}
        />
        {password ? (
          <Pressable accessibilityRole="button" accessibilityLabel={isVisible ? 'Hide password' : 'Show password'} onPress={() => setIsVisible((value) => !value)} style={styles.visibility}>
            <Feather name={isVisible ? 'eye-off' : 'eye'} size={iconSizes.md} color={colors.primary} />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: spacing.sm, marginBottom: spacing.lg },
  label: { ...typography.label, color: colors.text },
  field: { minHeight: 52, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.input, borderWidth: 1.5, paddingLeft: spacing.lg },
  focused: { borderColor: colors.secondary, borderWidth: 2 },
  errorField: { borderColor: colors.danger },
  input: { ...typography.body, color: colors.text, flex: 1, paddingVertical: spacing.md },
  visibility: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  error: { ...typography.secondaryBody, color: colors.danger },
});
