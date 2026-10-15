import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { SearchBar } from '@/components/ui/SearchBar';
import { SERVICE_AREA_CITY_NAME } from '@/constants/config';
import { colors, iconSizes, radii, spacing, typography } from '@/constants/theme';
import { RouteCard } from '@/features/routes/components/RouteCard';
import { useRoutes } from '@/features/routes/hooks/useRoutes';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCurrentRide } from '@/features/rides/hooks/useCurrentRide';
import { getRiderLifecycleRouteForRide } from '@/features/rides/utils/riderLifecycle';

export default function RiderHomeScreen() {
  const { user } = useAuth();
  const { ride } = useCurrentRide(user?.id);
  const { routes, isLoading, error } = useRoutes();
  const [query, setQuery] = useState('');

  const openSearch = () => {
    router.push({ pathname: '/(rider)/search', params: query.trim() ? { query: query.trim() } : {} });
  };

  return (
    <Screen includeTabBarPadding>
      <View style={styles.locationRow}>
        <View style={styles.locationIcon}><Feather name="map-pin" size={iconSizes.md} color={colors.primary} /></View>
        <View><Text style={styles.locationLabel}>SERVICE AREA</Text><Text style={styles.locationValue}>{SERVICE_AREA_CITY_NAME}</Text></View>
      </View>

      <Text accessibilityRole="header" style={styles.title}>Where to today?</Text>
      <Text style={styles.subtitle}>Choose from the available demo routes in Antipolo.</Text>
      <View style={styles.searchWrap}>
        <SearchBar value={query} onChangeText={setQuery} onSubmit={openSearch} />
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Browse routes and destinations" onPress={openSearch} style={({ pressed }) => [styles.searchLink, pressed && styles.pressed]}>
        <Text style={styles.searchLinkText}>Search a route, terminal, or landmark</Text>
        <Feather name="arrow-right" size={iconSizes.md} color={colors.secondary} />
      </Pressable>

      {ride && ride.status !== 'cancelled' ? (
        <Card variant="tinted" style={styles.activeRide}>
          <View style={styles.activeHeading}><Text style={styles.activeEyebrow}>ACTIVE RIDE</Text><Feather name="navigation" size={iconSizes.md} color={colors.primary} /></View>
          <Text style={styles.activeTitle}>{ride.routeName}</Text>
          <Text style={styles.activeCopy}>Open your ride tracker to see the latest demo status.</Text>
          <AppButton label="Open ride tracker" onPress={() => router.push(getRiderLifecycleRouteForRide(ride) ?? '/(rider)/ride')} />
        </Card>
      ) : null}

      <View style={styles.sectionHeading}><View><Text style={styles.sectionTitle}>Popular routes</Text><Text style={styles.demoLabel}>FIXTURE DATA • SAMPLE FARES</Text></View><Pressable accessibilityRole="button" accessibilityLabel="View all routes" onPress={() => router.push('/(rider)/routes')}><Text style={styles.allRoutes}>View all</Text></Pressable></View>

      {isLoading ? <ActivityIndicator style={styles.loader} color={colors.primary} /> : null}
      {!isLoading && error ? <EmptyState title="Routes unavailable" body={error} actionLabel="Browse routes" onAction={() => router.push('/(rider)/routes')} /> : null}
      {!isLoading && !error && routes.length === 0 ? <EmptyState title="No routes available" body="Fixture-backed routes will appear here when available." actionLabel="Browse routes" onAction={() => router.push('/(rider)/routes')} /> : null}
      {!isLoading && !error ? <View style={styles.routes}>{routes.slice(0, 2).map((route) => <RouteCard key={route.id} route={route} onPress={() => router.push({ pathname: '/(rider)/booking', params: { routeId: route.id } })} />)}</View> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  locationIcon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.tint, borderRadius: radii.pill },
  locationLabel: { ...typography.label, color: colors.secondary },
  locationValue: { ...typography.secondaryBody, color: colors.text, marginTop: spacing.xs },
  title: { ...typography.display, color: colors.text, marginTop: spacing.xl },
  subtitle: { ...typography.body, color: colors.textMuted, marginTop: spacing.sm },
  searchWrap: { marginTop: spacing.xl },
  searchLink: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  searchLinkText: { ...typography.secondaryBody, color: colors.secondary },
  pressed: { opacity: 0.72 },
  activeRide: { gap: spacing.sm, marginTop: spacing.lg },
  activeHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  activeEyebrow: { ...typography.label, color: colors.primary },
  activeTitle: { ...typography.sectionHeading, color: colors.text },
  activeCopy: { ...typography.secondaryBody, color: colors.textMuted, marginBottom: spacing.sm },
  sectionHeading: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: spacing.xxxl, marginBottom: spacing.md },
  sectionTitle: { ...typography.sectionHeading, color: colors.text },
  demoLabel: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
  allRoutes: { ...typography.label, color: colors.secondary },
  routes: { gap: spacing.md },
  loader: { marginVertical: spacing.xxxl },
});
