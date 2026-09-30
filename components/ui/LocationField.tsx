import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/constants/theme';
import { SERVICE_AREA_CITY_NAME } from '@/constants/config';

type LocationFieldProps = { label: string; value: string; placeholder: string; onChangeText: (value: string) => void; error?: string };

export function LocationField({ label, value, placeholder, onChangeText, error }: LocationFieldProps) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.field, error && styles.fieldError]}>
        <TextInput
          accessibilityLabel={`${label} location in ${SERVICE_AREA_CITY_NAME}`}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          onChangeText={onChangeText}
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
  fieldError: { borderColor: colors.danger },
  input: { ...typography.body, flex: 1, color: colors.text, paddingVertical: spacing.md },
  error: { ...typography.caption, color: colors.danger },
});
