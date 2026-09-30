import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/constants/theme';
import { SERVICE_AREA_CITY_NAME } from '@/constants/config';

type SearchBarProps = { value?: string; onChangeText?: (value: string) => void; onFilterPress?: () => void };

export function SearchBar({ value, onChangeText, onFilterPress }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Feather name="search" size={20} color={colors.onPrimary} />
      <TextInput
        accessibilityLabel={`Search ${SERVICE_AREA_CITY_NAME} locations`}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search"
        placeholderTextColor={colors.onPrimary}
        style={styles.input}
        returnKeyType="search"
      />
      <Pressable accessibilityRole="button" accessibilityLabel="Open search filters" hitSlop={8} onPress={onFilterPress} style={({ pressed }) => [styles.filter, pressed && styles.pressed]}>
        <Feather name="sliders" size={20} color={colors.onPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderRadius: radii.input, backgroundColor: colors.primary, paddingHorizontal: spacing.lg },
  input: { ...typography.body, flex: 1, color: colors.onPrimary, paddingVertical: spacing.md },
  filter: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.7 },
});
