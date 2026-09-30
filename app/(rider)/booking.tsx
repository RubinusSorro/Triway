import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ListRow } from '@/components/ui/ListRow';
import { LocationField } from '@/components/ui/LocationField';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { isLocationWithinServiceArea, OUTSIDE_SERVICE_AREA_MESSAGE, SERVICE_AREA_CITY_NAME, SERVICE_AREA_SHORT_LABEL } from '@/constants/config';
import { colors, spacing, typography } from '@/constants/theme';
import { fallbackSuggestedLocations, SuggestedLocation } from '@/data/suggestedLocations';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCreateRide } from '@/features/rides/hooks/useCreateRide';
import { useRoutes } from '@/features/routes/hooks/useRoutes';

export default function RiderBookingScreen() {
  const { user } = useAuth();
  const params = useLocalSearchParams<{ routeId?: string }>();
  const { routes, isLoading } = useRoutes();
  const { createRide, isCreating, error: createError } = useCreateRide();
  const selectedRoute = useMemo(() => routes.find((route) => route.id === params.routeId), [params.routeId, routes]);
  const [fromOverride, setFromOverride] = useState<string | null>(null);
  const [toOverride, setToOverride] = useState<string | null>(null);
  const from = fromOverride ?? selectedRoute?.origin ?? SERVICE_AREA_SHORT_LABEL;
  const to = toOverride ?? selectedRoute?.destination ?? '';

  const fromValid = isLocationWithinServiceArea(from);
  const toValid = isLocationWithinServiceArea(to);
  const canSubmit = fromValid && toValid && !isCreating;
  const fromError = from.length > 0 && !fromValid ? OUTSIDE_SERVICE_AREA_MESSAGE : undefined;
  const toError = to.length > 0 && !toValid ? OUTSIDE_SERVICE_AREA_MESSAGE : undefined;

  const chooseSuggestion = (item: SuggestedLocation) => {
    setToOverride(item.name);
  };

  const submit = async () => {
    if (!canSubmit) return;
    if (!selectedRoute || !user) {
      router.push('/(rider)/routes');
      return;
    }
    const ride = await createRide({
      riderId: user.id,
      routeId: selectedRoute.id,
      routeName: selectedRoute.name,
      pickup: from,
      destination: to,
      fare: selectedRoute.baseFare,
      paymentMethod: 'cash',
    });
    if (ride) router.replace('/(rider)/ride');
  };

  if (isLoading && params.routeId) {
    return <Screen scroll={false}><ActivityIndicator style={styles.loader} color={colors.primary} /></Screen>;
  }

  return (
    <Screen scroll={false} keyboardAvoiding>
      <ScreenHeader />
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.fields}>
          <LocationField label="From" value={from} placeholder={SERVICE_AREA_SHORT_LABEL} error={fromError} onChangeText={setFromOverride} />
          <LocationField label="To" value={to} placeholder={`Where in ${SERVICE_AREA_CITY_NAME}?`} error={toError} onChangeText={setToOverride} />
        </View>

        <Text style={styles.suggestedTitle}>Suggested locations</Text>
        <View style={styles.suggestions}>
          {fallbackSuggestedLocations.map((item) => (
            <ListRow
              key={item.id}
              title={item.name}
              subtitle={item.subtitle}
              trailing={<Text style={styles.fare}>Est. ₱{item.estimatedFare}</Text>}
              onPress={() => chooseSuggestion(item)}
              accessibilityLabel={`Choose ${item.name}, estimated fare ${item.estimatedFare} pesos`}
            />
          ))}
        </View>
        {selectedRoute ? <Text style={styles.selectedRoute}>Selected route: {selectedRoute.name}</Text> : null}
        {createError ? <Text accessibilityRole="alert" style={styles.error}>{createError}</Text> : null}
      </ScrollView>
      <PrimaryButton label="Find Rides" onPress={submit} disabled={!canSubmit} loading={isCreating} style={styles.button} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: spacing.lg },
  fields: { gap: spacing.md },
  suggestedTitle: { ...typography.captionSemibold, color: colors.text, marginTop: spacing.xl, marginBottom: spacing.md },
  suggestions: { gap: spacing.sm },
  fare: { ...typography.captionSemibold, color: colors.text },
  selectedRoute: { ...typography.caption, color: colors.primary, marginTop: spacing.md },
  error: { ...typography.caption, color: colors.danger, marginTop: spacing.md },
  button: { marginTop: spacing.md },
  loader: { marginTop: spacing.xxxl },
});
