import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radii, shadows, spacing, typography } from '@/constants/theme';
import { TricycleIcon } from './TricycleIcon';

type NavItem = { route: string; label: string; icon: ComponentProps<typeof Feather>['name'] | null };

const RIDER_ITEMS = [
  { route: 'index', label: 'Home', icon: 'home' },
  { route: 'routes', label: 'Rides', icon: 'calendar' },
  { route: 'booking', label: 'Book a ride', icon: null },
  { route: 'passes', label: 'Wallet', icon: 'credit-card' },
  { route: 'account', label: 'Account', icon: 'user' },
] satisfies readonly NavItem[];

export const DRIVER_ITEMS = [
  { route: 'index', label: 'Home', icon: 'home' },
  { route: 'request', label: 'Request', icon: 'clipboard' },
  { route: 'ride', label: 'Ride', icon: 'map' },
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
        if (item.icon === null) {
          return (
            <Pressable key={item.route} accessibilityRole="button" accessibilityLabel="Book a ride" accessibilityState={{ selected: isFocused }} onPress={onPress} style={({ pressed }) => [styles.item, styles.centerItem, pressed && styles.pressed]}>
              <View style={[styles.centerButton, isFocused && styles.centerActive]}><TricycleIcon size={31} color={colors.onPrimary} /></View>
              <Text style={[styles.centerLabel, isFocused && styles.activeLabel]}>Book</Text>
            </Pressable>
          );
        }
        return (
          <Pressable key={item.route} accessibilityRole="tab" accessibilityLabel={item.label} accessibilityState={{ selected: isFocused }} onPress={onPress} style={({ pressed }) => [styles.item, pressed && styles.pressed]}>
            <Feather name={item.icon} size={21} color={isFocused ? colors.primary : colors.textMuted} />
            <Text style={[styles.label, isFocused && styles.activeLabel]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'flex-end', minHeight: 72, backgroundColor: colors.surface, paddingTop: spacing.sm, paddingHorizontal: spacing.sm, ...shadows.card },
  item: { flex: 1, minHeight: 52, alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  centerItem: { justifyContent: 'flex-end' },
  centerButton: { width: 58, height: 58, borderRadius: radii.pill, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginTop: -30, borderWidth: 4, borderColor: colors.surface, ...shadows.card },
  centerActive: { backgroundColor: colors.primaryDark },
  label: { ...typography.caption, color: colors.textMuted },
  centerLabel: { ...typography.caption, color: colors.primary },
  activeLabel: { ...typography.captionSemibold, color: colors.primary },
  pressed: { opacity: 0.65 },
});
