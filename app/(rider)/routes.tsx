import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { Header } from '@/components/layout/Header';
import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { colors, spacing } from '@/constants/theme';
import { RouteCard } from '@/features/routes/components/RouteCard';
import { useRoutes } from '@/features/routes/hooks/useRoutes';

export default function RiderRoutesScreen() {
  const params = useLocalSearchParams<{
    pickup?: string;
    destination?: string;
    pickupLat?: string;
    pickupLng?: string;
    destLat?: string;
    destLng?: string;
  }>();
  const { routes, isLoading, error } = useRoutes();
  const selectedDestination = params.destination?.trim();
  const availableRoutes = selectedDestination
    ? routes.filter((route) => route.destination.toLocaleLowerCase() === selectedDestination.toLocaleLowerCase())
    : routes;

  return (
    <Screen includeTabBarPadding>
      <Header eyebrow="Fixture routes" title={selectedDestination ? `Routes to ${selectedDestination}` : 'Choose a route'} subtitle="Sample routes and fares for the TRIWAY classroom demo." />
      <AppButton label="Search a destination" variant="outline" onPress={() => router.push('/(rider)/search')} />
      <View style={styles.list}>
        {isLoading ? <ActivityIndicator style={styles.loader} color={colors.primary} /> : null}
        {!isLoading && error ? <EmptyState title="Routes unavailable" body={error} /> : null}
        {!isLoading && !error && availableRoutes.length === 0 ? <EmptyState title="No matching routes" body={selectedDestination ? `No fixture route ends at ${selectedDestination}.` : 'No route fixtures are available.'} actionLabel="Search again" onAction={() => router.push('/(rider)/search')} /> : null}
        {!isLoading && !error ? availableRoutes.map((route) => (
          <RouteCard
            key={route.id}
            route={route}
            onPress={() =>
              router.push({
                pathname: '/(rider)/booking',
                params: {
                  routeId: route.id,
                  pickup: params.pickup,
                  destination: params.destination,
                  pickupLat: params.pickupLat,
                  pickupLng: params.pickupLng,
                  destLat: params.destLat,
                  destLng: params.destLng,
                },
              })
            }
          />
        )) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({ list: { gap: spacing.md, marginTop: spacing.lg }, loader: { marginVertical: spacing.xxxl } });
