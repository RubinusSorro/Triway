import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { Screen } from '@/components/layout/Screen';
import { SearchBar } from '@/components/ui/SearchBar';
import { colors, iconSizes, spacing, typography } from '@/constants/theme';
import { fallbackSuggestedLocations } from '@/data/suggestedLocations';
import { usePlaceSearch } from '@/features/maps/hooks/usePlaceSearch';
import { RouteCard } from '@/features/routes/components/RouteCard';
import { useRoutes } from '@/features/routes/hooks/useRoutes';

function matches(value: string, query: string) {
  return value.toLocaleLowerCase().includes(query.toLocaleLowerCase());
}

export default function RiderSearchScreen() {
  const { query: initialQuery } = useLocalSearchParams<{ query?: string }>();
  const [query, setQuery] = useState(initialQuery ?? '');
  const { routes, isLoading, error } = useRoutes();
  const { places, isLoading: isPlacesLoading, error: placesError } = usePlaceSearch(query);

  const trimmedQuery = query.trim();
  const matchingRoutes = useMemo(
    () => routes.filter((route) => !trimmedQuery || [route.name, route.origin, route.destination].some((value) => matches(value, trimmedQuery))),
    [routes, trimmedQuery],
  );
  const matchingLocations = useMemo(
    () => fallbackSuggestedLocations.filter((location) => !trimmedQuery || matches(location.name, trimmedQuery)),
    [trimmedQuery],
  );

  const hasAnyResults = matchingRoutes.length > 0 || matchingLocations.length > 0 || places.length > 0;

  return (
    <Screen includeTabBarPadding>
      <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.back}><Feather name="arrow-left" size={iconSizes.lg} color={colors.text} /><Text style={styles.backLabel}>Back</Text></Pressable>
      <Text accessibilityRole="header" style={styles.title}>Find a destination</Text>
      <Text style={styles.subtitle}>Search Antipolo destinations, routes, and map landmarks.</Text>
      <View style={styles.search}><SearchBar value={query} onChangeText={setQuery} /></View>

      {isLoading ? <ActivityIndicator style={styles.loader} color={colors.primary} /> : null}
      {!isLoading && error ? <EmptyState title="Search unavailable" body={error} /> : null}
      {!isLoading && !error && !isPlacesLoading && !hasAnyResults ? (
        <EmptyState title="No matches" body="Try a fixture route, terminal, or landmark name." actionLabel="Browse all routes" onAction={() => router.replace('/(rider)/routes')} />
      ) : null}

      {!isLoading && !error && matchingLocations.length > 0 ? (
        <View style={styles.locations}>
          <Text style={styles.sectionTitle}>Destinations</Text>
          {matchingLocations.map((location) => (
            <Pressable key={location.id} accessibilityRole="button" accessibilityLabel={`Browse fixture routes to ${location.name}`} onPress={() => router.push({ pathname: '/(rider)/routes', params: { destination: location.name } })} style={({ pressed }) => [styles.locationRow, pressed && styles.pressed]}>
              <Feather name="map-pin" size={iconSizes.md} color={colors.secondary} />
              <View style={styles.locationCopy}><Text style={styles.locationName}>{location.name}</Text><Text style={styles.locationMeta}>{location.subtitle} • fixture suggestion</Text></View>
              <Feather name="chevron-right" size={iconSizes.md} color={colors.primary} />
            </Pressable>
          ))}
        </View>
      ) : null}

      {trimmedQuery.length >= 3 ? (
        <View style={styles.locations}>
          <Text style={styles.sectionTitle}>Map Places</Text>
          {isPlacesLoading ? <ActivityIndicator color={colors.primary} style={styles.miniLoader} /> : null}
          {placesError ? <Text style={styles.errorText}>{placesError}</Text> : null}
          {!isPlacesLoading && !placesError && places.length === 0 ? (
            <Text style={styles.noPlacesText}>{`No map places found for "${trimmedQuery}".`}</Text>
          ) : null}
          {places.map((place) => (
            <Pressable
              key={place.id}
              accessibilityRole="button"
              accessibilityLabel={`Browse routes to ${place.name}`}
              onPress={() => router.push({ pathname: '/(rider)/routes', params: { destination: place.name } })}
              style={({ pressed }) => [styles.locationRow, pressed && styles.pressed]}
            >
              <Feather name="map-pin" size={iconSizes.md} color={colors.secondary} />
              <View style={styles.locationCopy}>
                <Text style={styles.locationName}>{place.name}</Text>
                <Text style={styles.locationMeta}>{place.subtitle}</Text>
              </View>
              <Feather name="chevron-right" size={iconSizes.md} color={colors.primary} />
            </Pressable>
          ))}
          <Text style={styles.attribution}>Search data © OpenStreetMap contributors via Photon</Text>
        </View>
      ) : null}

      {!isLoading && !error && matchingRoutes.length > 0 ? (
        <View style={styles.routes}>
          <Text style={styles.sectionTitle}>Routes</Text>
          {matchingRoutes.map((route) => <RouteCard key={route.id} route={route} onPress={() => router.push({ pathname: '/(rider)/booking', params: { routeId: route.id } })} />)}
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { minHeight: 48, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: spacing.xs },
  backLabel: { ...typography.bodySemibold, color: colors.text },
  title: { ...typography.screenTitle, color: colors.text, marginTop: spacing.md },
  subtitle: { ...typography.secondaryBody, color: colors.textMuted, marginTop: spacing.sm },
  search: { marginTop: spacing.xl },
  loader: { marginVertical: spacing.xxxl },
  locations: { gap: spacing.sm, marginTop: spacing.xxl },
  sectionTitle: { ...typography.sectionHeading, color: colors.text },
  locationRow: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 12, paddingHorizontal: spacing.md },
  locationCopy: { flex: 1 },
  locationName: { ...typography.bodySemibold, color: colors.text },
  locationMeta: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
  routes: { gap: spacing.md, marginTop: spacing.xxl },
  pressed: { opacity: 0.72 },
  miniLoader: { marginVertical: spacing.md },
  errorText: { ...typography.caption, color: colors.danger, marginVertical: spacing.xs },
  noPlacesText: { ...typography.secondaryBody, color: colors.textMuted },
  attribution: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
});
