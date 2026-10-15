import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { SERVICE_AREA_CITY_NAME } from '@/constants/config';
import { colors, iconSizes, radii, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { usePlaceSearch } from '@/features/maps/hooks/usePlaceSearch';
import { KNOWN_ANTIPOLO_COORDINATES } from '@/features/maps/services/osrmRouting';
import { PlaceResult } from '@/features/maps/services/photonGeocoder';
import { LatLng } from '@/features/maps/types';
import { useCurrentRide } from '@/features/rides/hooks/useCurrentRide';
import { getRiderLifecycleRouteForRide } from '@/features/rides/utils/riderLifecycle';
import { RouteCard } from '@/features/routes/components/RouteCard';
import { useRoutes } from '@/features/routes/hooks/useRoutes';

export default function RiderHomeScreen() {
  const { user } = useAuth();
  const { ride } = useCurrentRide(user?.id);
  const { routes, isLoading, error } = useRoutes();

  // Booking Card state
  const [fromText, setFromText] = useState('Antipolo Cathedral');
  const [pickupCoords, setPickupCoords] = useState<LatLng | null>({
    latitude: 14.58769,
    longitude: 121.17666,
  });

  const [toText, setToText] = useState('');
  const [destinationCoords, setDestinationCoords] = useState<LatLng | null>(null);

  const [activeField, setActiveField] = useState<'from' | 'to' | null>(null);

  // Type-ahead autocomplete query based on active field
  const activeQuery = activeField === 'from' ? fromText : activeField === 'to' ? toText : '';
  const { places, isLoading: isPlacesLoading } = usePlaceSearch(activeQuery, 1);

  // Instant local suggestions from known landmarks
  const localSuggestions = useMemo((): PlaceResult[] => {
    if (!activeQuery.trim()) return [];
    const q = activeQuery.trim().toLowerCase();
    return Object.entries(KNOWN_ANTIPOLO_COORDINATES)
      .filter(([name]) => name.includes(q))
      .map(([name, coords]) => ({
        id: `local-${name}`,
        name: name
          .split(' ')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' '),
        subtitle: 'Antipolo Landmark',
        latitude: coords.latitude,
        longitude: coords.longitude,
      }));
  }, [activeQuery]);

  // Combined suggestions deduplicated by lowercase name
  const suggestions = useMemo((): PlaceResult[] => {
    if (!activeField || !activeQuery.trim()) return [];
    const seen = new Set<string>();
    const combined: PlaceResult[] = [];

    for (const item of localSuggestions) {
      const key = item.name.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        combined.push(item);
      }
    }

    for (const item of places) {
      const key = item.name.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        combined.push(item);
      }
    }

    return combined.slice(0, 5);
  }, [activeField, activeQuery, localSuggestions, places]);

  const handleSelectSuggestion = (place: PlaceResult) => {
    if (activeField === 'from') {
      setFromText(place.name);
      setPickupCoords({ latitude: place.latitude, longitude: place.longitude });
    } else if (activeField === 'to') {
      setToText(place.name);
      setDestinationCoords({ latitude: place.latitude, longitude: place.longitude });
    }
    setActiveField(null);
  };

  const handleBookRide = () => {
    if (!fromText.trim() || !toText.trim()) return;

    setActiveField(null);

    // Check if an existing fixture route matches
    const fromNorm = fromText.trim().toLowerCase();
    const toNorm = toText.trim().toLowerCase();
    const matchedRoute = routes.find(
      (r) =>
        (r.origin.toLowerCase() === fromNorm && r.destination.toLowerCase() === toNorm) ||
        r.destination.toLowerCase().includes(toNorm) ||
        r.name.toLowerCase().includes(toNorm),
    );

    const resolvedPickup =
      pickupCoords ??
      KNOWN_ANTIPOLO_COORDINATES[fromNorm] ?? { latitude: 14.58769, longitude: 121.17666 };
    const resolvedDest =
      destinationCoords ??
      KNOWN_ANTIPOLO_COORDINATES[toNorm] ?? undefined;

    router.push({
      pathname: '/(rider)/booking',
      params: {
        routeId: matchedRoute?.id || `custom-${Date.now()}`,
        pickup: fromText.trim(),
        destination: toText.trim(),
        pickupLat: resolvedPickup.latitude.toString(),
        pickupLng: resolvedPickup.longitude.toString(),
        ...(resolvedDest
          ? {
              destLat: resolvedDest.latitude.toString(),
              destLng: resolvedDest.longitude.toString(),
            }
          : {}),
      },
    });
  };

  return (
    <Screen includeTabBarPadding>
      {/* Header Location Badge */}
      <View style={styles.locationRow}>
        <View style={styles.locationIcon}>
          <Feather name="map-pin" size={iconSizes.md} color={colors.primary} />
        </View>
        <View>
          <Text style={styles.locationLabel}>SERVICE AREA</Text>
          <Text style={styles.locationValue}>{SERVICE_AREA_CITY_NAME}</Text>
        </View>
      </View>

      <Text accessibilityRole="header" style={styles.title}>Where to today?</Text>
      <Text style={styles.subtitle}>On-demand tricycles with live map routing in Antipolo.</Text>

      {/* Prominent "Book a ride" Card (Grab / Move It Style) */}
      <Card style={styles.bookCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerBadge}>
            <Feather name="navigation" size={13} color={colors.primary} />
            <Text style={styles.headerBadgeText}>TRICYCLE ON-DEMAND</Text>
          </View>
          <Text style={styles.cardTitle}>Book a ride</Text>
        </View>

        {/* Route inputs container */}
        <View style={styles.routeContainer}>
          {/* Visual Route Indicators (Green dot -> Connecting line -> Blue pin) */}
          <View style={styles.indicatorCol}>
            <View style={styles.pickupDot} />
            <View style={styles.connectingLine} />
            <View style={styles.dropoffDot} />
          </View>

          {/* Input Fields Column */}
          <View style={styles.inputsCol}>
            {/* From (Pickup) Field */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>PICKUP</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.textInput}
                  value={fromText}
                  onChangeText={(text) => {
                    setFromText(text);
                    setPickupCoords(null);
                    setActiveField('from');
                  }}
                  onFocus={() => setActiveField('from')}
                  placeholder="Enter pickup location"
                  placeholderTextColor={colors.textMuted}
                  autoCorrect={false}
                />
                {fromText.length > 0 ? (
                  <Pressable
                    hitSlop={8}
                    onPress={() => {
                      setFromText('');
                      setPickupCoords(null);
                      setActiveField('from');
                    }}
                    style={styles.clearBtn}
                  >
                    <Feather name="x" size={16} color={colors.textMuted} />
                  </Pressable>
                ) : null}
              </View>

              {/* Floating Dropdown for Pickup */}
              {activeField === 'from' && suggestions.length > 0 ? (
                <View style={styles.floatingDropdown}>
                  {suggestions.map((item) => (
                    <Pressable
                      key={item.id}
                      style={({ pressed }) => [
                        styles.suggestionItem,
                        pressed && styles.suggestionPressed,
                      ]}
                      onPress={() => handleSelectSuggestion(item)}
                    >
                      <Feather
                        name="map-pin"
                        size={16}
                        color={colors.primary}
                        style={styles.suggestionIcon}
                      />
                      <View style={styles.suggestionTextCol}>
                        <Text style={styles.suggestionName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text style={styles.suggestionSubtitle} numberOfLines={1}>
                          {item.subtitle}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                  {isPlacesLoading ? (
                    <View style={styles.searchingRow}>
                      <ActivityIndicator size="small" color={colors.primary} />
                      <Text style={styles.searchingText}>Searching Antipolo places...</Text>
                    </View>
                  ) : null}
                </View>
              ) : null}
            </View>

            <View style={styles.fieldDivider} />

            {/* To (Drop-off) Field */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>DROP-OFF</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.textInput}
                  value={toText}
                  onChangeText={(text) => {
                    setToText(text);
                    setDestinationCoords(null);
                    setActiveField('to');
                  }}
                  onFocus={() => setActiveField('to')}
                  placeholder="Where to? (e.g. Robinsons, Taktak)"
                  placeholderTextColor={colors.textMuted}
                  autoCorrect={false}
                />
                {toText.length > 0 ? (
                  <Pressable
                    hitSlop={8}
                    onPress={() => {
                      setToText('');
                      setDestinationCoords(null);
                      setActiveField('to');
                    }}
                    style={styles.clearBtn}
                  >
                    <Feather name="x" size={16} color={colors.textMuted} />
                  </Pressable>
                ) : null}
              </View>

              {/* Floating Dropdown for Drop-off */}
              {activeField === 'to' && suggestions.length > 0 ? (
                <View style={styles.floatingDropdown}>
                  {suggestions.map((item) => (
                    <Pressable
                      key={item.id}
                      style={({ pressed }) => [
                        styles.suggestionItem,
                        pressed && styles.suggestionPressed,
                      ]}
                      onPress={() => handleSelectSuggestion(item)}
                    >
                      <Feather
                        name="map-pin"
                        size={16}
                        color="#1565C0"
                        style={styles.suggestionIcon}
                      />
                      <View style={styles.suggestionTextCol}>
                        <Text style={styles.suggestionName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text style={styles.suggestionSubtitle} numberOfLines={1}>
                          {item.subtitle}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                  {isPlacesLoading ? (
                    <View style={styles.searchingRow}>
                      <ActivityIndicator size="small" color={colors.primary} />
                      <Text style={styles.searchingText}>Searching Antipolo places...</Text>
                    </View>
                  ) : null}
                </View>
              ) : null}
            </View>
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.btnWrap}>
          <AppButton
            label="Find rides"
            onPress={handleBookRide}
            disabled={!fromText.trim() || !toText.trim()}
          />
        </View>
      </Card>

      {/* Active ride reminder if present */}
      {ride && ride.status !== 'cancelled' ? (
        <Card variant="tinted" style={styles.activeRide}>
          <View style={styles.activeHeading}>
            <Text style={styles.activeEyebrow}>ACTIVE RIDE</Text>
            <Feather name="navigation" size={iconSizes.md} color={colors.primary} />
          </View>
          <Text style={styles.activeTitle}>{ride.routeName}</Text>
          <Text style={styles.activeCopy}>Open your ride tracker to see the latest demo status.</Text>
          <AppButton
            label="Open ride tracker"
            onPress={() => router.push(getRiderLifecycleRouteForRide(ride) ?? '/(rider)/ride')}
          />
        </Card>
      ) : null}

      {/* Popular routes section */}
      <View style={styles.sectionHeading}>
        <View>
          <Text style={styles.sectionTitle}>Popular routes</Text>
          <Text style={styles.demoLabel}>FIXTURE DATA • SAMPLE FARES</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View all routes"
          onPress={() => router.push('/(rider)/routes')}
        >
          <Text style={styles.allRoutes}>View all</Text>
        </Pressable>
      </View>

      {isLoading ? <ActivityIndicator style={styles.loader} color={colors.primary} /> : null}
      {!isLoading && error ? (
        <EmptyState
          title="Routes unavailable"
          body={error}
          actionLabel="Browse routes"
          onAction={() => router.push('/(rider)/routes')}
        />
      ) : null}
      {!isLoading && !error && routes.length === 0 ? (
        <EmptyState
          title="No routes available"
          body="Fixture-backed routes will appear here when available."
          actionLabel="Browse routes"
          onAction={() => router.push('/(rider)/routes')}
        />
      ) : null}
      {!isLoading && !error ? (
        <View style={styles.routes}>
          {routes.slice(0, 2).map((route) => (
            <RouteCard
              key={route.id}
              route={route}
              onPress={() =>
                router.push({
                  pathname: '/(rider)/booking',
                  params: { routeId: route.id },
                })
              }
            />
          ))}
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  locationIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tint,
    borderRadius: radii.pill,
  },
  locationLabel: { ...typography.label, color: colors.secondary },
  locationValue: { ...typography.secondaryBody, color: colors.text, marginTop: spacing.xs },
  title: { ...typography.display, color: colors.text, marginTop: spacing.xl },
  subtitle: { ...typography.body, color: colors.textMuted, marginTop: spacing.sm },

  // Book a Ride Card
  bookCard: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    marginBottom: spacing.md,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  headerBadgeText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 0.8,
    fontSize: 11,
  },
  cardTitle: {
    ...typography.sectionHeading,
    color: colors.text,
  },
  routeContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: radii.input,
    borderWidth: 1,
    borderColor: colors.border,
  },
  indicatorCol: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  pickupDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  connectingLine: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  dropoffDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#1565C0',
  },
  inputsCol: {
    flex: 1,
  },
  fieldWrap: {
    position: 'relative',
  },
  fieldLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 36,
  },
  textInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: 2,
    paddingHorizontal: 0,
  },
  clearBtn: {
    padding: 4,
  },
  fieldDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  floatingDropdown: {
    marginTop: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radii.input,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionPressed: {
    backgroundColor: colors.tint,
  },
  suggestionIcon: {
    marginRight: spacing.sm,
  },
  suggestionTextCol: {
    flex: 1,
  },
  suggestionName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  suggestionSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  searchingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: 8,
    justifyContent: 'center',
  },
  searchingText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  btnWrap: {
    marginTop: spacing.md,
  },

  activeRide: { gap: spacing.sm, marginTop: spacing.lg },
  activeHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  activeEyebrow: { ...typography.label, color: colors.primary },
  activeTitle: { ...typography.sectionHeading, color: colors.text },
  activeCopy: { ...typography.secondaryBody, color: colors.textMuted, marginBottom: spacing.sm },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: spacing.xxxl,
    marginBottom: spacing.md,
  },
  sectionTitle: { ...typography.sectionHeading, color: colors.text },
  demoLabel: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
  allRoutes: { ...typography.label, color: colors.secondary },
  routes: { gap: spacing.md },
  loader: { marginVertical: spacing.xxxl },
});
