import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/constants/theme';
import { SERVICE_AREA_CITY_NAME } from '@/constants/config';

type LocationFieldProps = { label: string; value: string; placeholder: string; onChangeText: (value: string) => void; error?: string };

export function LocationField({ label, value, placeholder, onChangeText, error }: LocationFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.field, isFocused && styles.fieldFocused, error && styles.fieldError]}>
        <TextInput
          accessibilityLabel={`${label} location in ${SERVICE_AREA_CITY_NAME}`}
          accessibilityHint={error ? `${error}. Enter a location within the TRIWAY service area` : 'Enter a location within the TRIWAY service area'}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={styles.input}
          autoCapitalize="words"
        />
        <Feather name="map-pin" size={21} color={colors.primary} />
      </View>
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: spacing.sm },
  label: { ...typography.captionSemibold, color: colors.text },
  field: { minHeight: 52, flexDirection: 'row', alignItems: 'center', borderRadius: radii.input, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md },
  fieldFocused: { borderColor: colors.secondary, borderWidth: 2 },
  fieldError: { borderColor: colors.danger },
  input: { ...typography.body, flex: 1, color: colors.text, paddingVertical: spacing.md },
  error: { ...typography.caption, color: colors.danger },
});
