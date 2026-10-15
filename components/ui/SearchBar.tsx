import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { colors, iconSizes, radii, spacing, touchTargets, typography } from '@/constants/theme';
import { SERVICE_AREA_CITY_NAME } from '@/constants/config';

type SearchBarProps = {
  value?: string;
  onChangeText?: (value: string) => void;
  onSubmit?: () => void;
  onFilterPress?: () => void;
};

export function SearchBar({ value, onChangeText, onSubmit, onFilterPress }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, isFocused && styles.focused]}>
      <Feather name="search" size={iconSizes.md} color={colors.onPrimary} />
      <TextInput
        accessibilityLabel={`Search ${SERVICE_AREA_CITY_NAME} locations`}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onSubmitEditing={onSubmit}
        placeholder="Search"
        placeholderTextColor={colors.onPrimary}
        style={styles.input}
        returnKeyType="search"
      />
      {onFilterPress ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Browse routes" hitSlop={spacing.sm} onPress={onFilterPress} style={({ pressed }) => [styles.filter, pressed && styles.pressed]}>
          <Feather name="sliders" size={iconSizes.md} color={colors.onPrimary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderRadius: radii.input, backgroundColor: colors.primary, paddingHorizontal: spacing.lg, borderWidth: 2, borderColor: colors.primary },
  focused: { borderColor: colors.secondary },
  input: { ...typography.body, flex: 1, color: colors.onPrimary, paddingVertical: spacing.md },
  filter: { width: touchTargets.minimum, height: touchTargets.minimum, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.7 },
});
