import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, iconSizes, shadows, spacing, touchTargets, typography } from '@/constants/theme';

type NavItem = { route: string; label: string; icon: ComponentProps<typeof Feather>['name'] };

const RIDER_ITEMS = [
  { route: 'index', label: 'Home', icon: 'home' },
  { route: 'routes', label: 'Routes', icon: 'map' },
  { route: 'history', label: 'Trips', icon: 'clock' },
  { route: 'account', label: 'Profile', icon: 'user' },
] satisfies readonly NavItem[];

export const DRIVER_ITEMS = [
  { route: 'index', label: 'Home', icon: 'home' },
  { route: 'request', label: 'Requests', icon: 'clipboard' },
  { route: 'history', label: 'History', icon: 'clock' },
  { route: 'profile', label: 'Profile', icon: 'user' },
] satisfies readonly NavItem[];

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];
type AppBottomNavProps = TabBarProps & { items?: readonly NavItem[] };

export function AppBottomNav({ state, navigation, items = RIDER_ITEMS }: AppBottomNavProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      {items.map((item) => {
        const route = state.routes.find((candidate) => candidate.name === item.route);
        if (!route) return null;
        const isFocused = state.routes[state.index]?.key === route.key;
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
        };
        return (
          <Pressable key={item.route} accessibilityRole="tab" accessibilityLabel={item.label} accessibilityState={{ selected: isFocused }} onPress={onPress} style={({ pressed }) => [styles.item, pressed && styles.pressed]}>
            <Feather name={item.icon} size={iconSizes.md} color={isFocused ? colors.primary : colors.textMuted} />
            <Text style={[styles.label, isFocused && styles.activeLabel]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'flex-end', minHeight: 72, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm, paddingHorizontal: spacing.sm, ...shadows.card },
  item: { flex: 1, minHeight: touchTargets.comfortable, alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  label: { ...typography.caption, color: colors.textMuted },
  activeLabel: { ...typography.captionSemibold, color: colors.primary },
  pressed: { opacity: 0.65 },
});
