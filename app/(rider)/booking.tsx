import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

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
import { isQuickReturnEligible } from '@/features/rides/utils/quickReturn';

export default function RiderBookingScreen() {
  const { user } = useAuth();
  const params = useLocalSearchParams<{ routeId?: string; pickup?: string; destination?: string }>();
  const { routes, isLoading } = useRoutes();
  const { createRide, isCreating, error: createError } = useCreateRide();
  const selectedRoute = useMemo(() => routes.find((route) => route.id === params.routeId), [params.routeId, routes]);
  const [fromOverride, setFromOverride] = useState<string | null>(null);
  const [toOverride, setToOverride] = useState<string | null>(null);
  const [tripType, setTripType] = useState<'one_way' | 'quick_return'>('one_way');
  const from = fromOverride ?? params.pickup ?? selectedRoute?.origin ?? SERVICE_AREA_SHORT_LABEL;
  const to = toOverride ?? params.destination ?? selectedRoute?.destination ?? '';

  const fromValid = isLocationWithinServiceArea(from);
  const toValid = isLocationWithinServiceArea(to);
  const canSubmit = fromValid && toValid && !isCreating;
  const canQuickReturn = isQuickReturnEligible(selectedRoute?.distanceKm);
  const selectedTripType = canQuickReturn && tripType === 'quick_return' ? 'quick_return' : 'one_way';
  const isQuickReturn = selectedTripType === 'quick_return';
  const fromError = from.length > 0 && !fromValid ? OUTSIDE_SERVICE_AREA_MESSAGE : undefined;
  const toError = to.length > 0 && !toValid ? OUTSIDE_SERVICE_AREA_MESSAGE : undefined;

  const chooseSuggestion = (item: SuggestedLocation) => {
    setToOverride(item.name);
  };

  const submit = async () => {
    if (!canSubmit) return;
    if (!selectedRoute || !user) {
      router.push({ pathname: '/(rider)/routes', params: { pickup: from, destination: to } });
      return;
    }
    const ride = await createRide({
      riderId: user.id,
      riderName: user.name,
      routeId: selectedRoute.id,
      routeName: selectedRoute.name,
      pickup: from,
      destination: to,
      fare: selectedRoute.baseFare,
      distanceKm: selectedRoute.distanceKm,
      outboundFare: isQuickReturn ? selectedRoute.baseFare : undefined,
      returnFare: isQuickReturn ? selectedRoute.baseFare : undefined,
      totalFare: isQuickReturn ? selectedRoute.baseFare * 2 : undefined,
      isReturnRide: isQuickReturn,
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

        <Text style={styles.tripTypeLabel}>Trip type</Text>
        <View style={styles.tripTypes}>
          <Pressable onPress={() => setTripType('one_way')} style={[styles.tripType, selectedTripType === 'one_way' && styles.tripTypeSelected]}>
            <Text style={[styles.tripTypeText, selectedTripType === 'one_way' && styles.tripTypeTextSelected]}>One Way</Text>
          </Pressable>
          <Pressable disabled={!canQuickReturn} onPress={() => setTripType('quick_return')} style={[styles.tripType, selectedTripType === 'quick_return' && styles.tripTypeSelected, !canQuickReturn && styles.tripTypeDisabled]}>
            <Text style={[styles.tripTypeText, selectedTripType === 'quick_return' && styles.tripTypeTextSelected, !canQuickReturn && styles.tripTypeTextDisabled]}>Quick Return</Text>
          </Pressable>
        </View>
        <Text style={styles.tripTypeHelp}>{canQuickReturn ? 'Going somewhere nearby for a quick errand? Return with the same driver.' : 'Quick Return is available for short trips up to 5 km.'}</Text>

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
        {isQuickReturn ? (
          <View style={styles.quickSummary}>
            <Text style={styles.quickTitle}>QUICK RETURN</Text>
            <Text style={styles.quickLine}>Outbound: {from} to {to} - PHP {selectedRoute?.baseFare}</Text>
            <Text style={styles.quickLine}>Return: {to} to {from} - PHP {selectedRoute?.baseFare}</Text>
            <Text style={styles.quickTotal}>Estimated Total: PHP {(selectedRoute?.baseFare ?? 0) * 2}</Text>
            <Text style={styles.quickHelp}>Your driver will know that you intend to return shortly.</Text>
          </View>
        ) : null}
        {createError ? <Text accessibilityRole="alert" style={styles.error}>{createError}</Text> : null}
      </ScrollView>
      <PrimaryButton label={isQuickReturn ? 'Book Quick Return' : 'Find Rides'} onPress={submit} disabled={!canSubmit} loading={isCreating} style={styles.button} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: spacing.lg },
  fields: { gap: spacing.md },
  tripTypeLabel: { ...typography.captionSemibold, color: colors.text, marginTop: spacing.xl, marginBottom: spacing.sm },
  tripTypes: { flexDirection: 'row', gap: spacing.sm },
  tripType: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 10 },
  tripTypeSelected: { borderColor: colors.primary, backgroundColor: colors.tint },
  tripTypeDisabled: { opacity: 0.45 },
  tripTypeText: { ...typography.bodySemibold, color: colors.textMuted },
  tripTypeTextSelected: { color: colors.primary },
  tripTypeTextDisabled: { color: colors.textMuted },
  tripTypeHelp: { ...typography.caption, color: colors.textMuted, marginTop: spacing.sm },
  suggestedTitle: { ...typography.captionSemibold, color: colors.text, marginTop: spacing.xl, marginBottom: spacing.md },
  suggestions: { gap: spacing.sm },
  fare: { ...typography.captionSemibold, color: colors.text },
  selectedRoute: { ...typography.caption, color: colors.primary, marginTop: spacing.md },
  quickSummary: { gap: spacing.xs, backgroundColor: colors.tint, borderRadius: 12, padding: spacing.md, marginTop: spacing.lg },
  quickTitle: { ...typography.captionSemibold, color: colors.primary },
  quickLine: { ...typography.body, color: colors.text },
  quickTotal: { ...typography.bodySemibold, color: colors.primary, marginTop: spacing.xs },
  quickHelp: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
  error: { ...typography.caption, color: colors.danger, marginTop: spacing.md },
  button: { marginTop: spacing.md },
  loader: { marginTop: spacing.xxxl },
});
