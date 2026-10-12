import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { ListRow } from '@/components/ui/ListRow';
import { LocationField } from '@/components/ui/LocationField';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { isLocationWithinServiceArea, OUTSIDE_SERVICE_AREA_MESSAGE, SERVICE_AREA_CITY_NAME, SERVICE_AREA_SHORT_LABEL } from '@/constants/config';
import { colors, radii, spacing, touchTargets, typography } from '@/constants/theme';
import { fallbackSuggestedLocations, SuggestedLocation } from '@/data/suggestedLocations';
import { useRoutes } from '@/features/routes/hooks/useRoutes';
import { BookingTripType, parseBookingDraft, toBookingDraftParams } from '@/features/rides/utils/bookingDraft';
import { isQuickReturnEligible } from '@/features/rides/utils/quickReturn';

export default function RiderBookingScreen() {
  const params = useLocalSearchParams<{ routeId?: string; pickup?: string; destination?: string; tripType?: string }>();
  const { routes, isLoading } = useRoutes();
  const selectedRoute = useMemo(() => routes.find((route) => route.id === params.routeId), [params.routeId, routes]);
  const incomingDraft = parseBookingDraft(params);
  const [fromOverride, setFromOverride] = useState<string | null>(null);
  const [toOverride, setToOverride] = useState<string | null>(null);
  const [tripType, setTripType] = useState<BookingTripType>(incomingDraft?.tripType ?? 'one_way');
  const from = fromOverride ?? params.pickup ?? selectedRoute?.origin ?? SERVICE_AREA_SHORT_LABEL;
  const to = toOverride ?? params.destination ?? selectedRoute?.destination ?? '';

  const fromValid = isLocationWithinServiceArea(from);
  const toValid = isLocationWithinServiceArea(to);
  const canReview = fromValid && toValid && Boolean(selectedRoute);
  const canQuickReturn = isQuickReturnEligible(selectedRoute?.distanceKm);
  const selectedTripType = canQuickReturn && tripType === 'quick_return' ? 'quick_return' : 'one_way';
  const isQuickReturn = selectedTripType === 'quick_return';
  const fromError = from.length > 0 && !fromValid ? OUTSIDE_SERVICE_AREA_MESSAGE : undefined;
  const toError = to.length > 0 && !toValid ? OUTSIDE_SERVICE_AREA_MESSAGE : undefined;

  const chooseSuggestion = (item: SuggestedLocation) => {
    setToOverride(item.name);
  };

  const reviewBooking = () => {
    if (!selectedRoute) {
      router.push({ pathname: '/(rider)/routes', params: { pickup: from, destination: to } });
      return;
    }
    if (!canReview) return;

    router.push({
      pathname: '/(rider)/review',
      params: toBookingDraftParams({
        routeId: selectedRoute.id,
        pickup: from,
        destination: to,
        tripType: selectedTripType,
        paymentMethod: 'cash',
      }),
    });
  };

  if (isLoading && params.routeId) {
    return <Screen scroll={false}><ActivityIndicator style={styles.loader} color={colors.primary} /></Screen>;
  }

  return (
    <Screen
      scroll={false}
      keyboardAvoiding
      includeTabBarPadding
      contentContainerStyle={styles.screen}
    >
      <ScreenHeader showActions={false} />
      <ScrollView
        style={styles.form}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.fields}>
          <LocationField label="From" value={from} placeholder={SERVICE_AREA_SHORT_LABEL} error={fromError} onChangeText={setFromOverride} />
          <LocationField label="To" value={to} placeholder={`Where in ${SERVICE_AREA_CITY_NAME}?`} error={toError} onChangeText={setToOverride} />
        </View>

        {selectedRoute ? (
          <Card variant="outlined" style={styles.routeCard}>
            <Text style={styles.routeEyebrow}>SELECTED FIXTURE ROUTE</Text>
            <Text style={styles.routeTitle}>{selectedRoute.name}</Text>
            <Text style={styles.routeDetail}>{selectedRoute.origin} to {selectedRoute.destination}</Text>
            <Text style={styles.routeNote}>{selectedRoute.notes}</Text>
          </Card>
        ) : null}

        <Text style={styles.tripTypeLabel}>Trip type</Text>
        <View style={styles.tripTypes}>
          <Pressable
            accessibilityRole="radio"
            accessibilityLabel="One-way trip"
            accessibilityState={{ selected: selectedTripType === 'one_way' }}
            onPress={() => setTripType('one_way')}
            style={[styles.tripType, selectedTripType === 'one_way' && styles.tripTypeSelected]}
          >
            <Text style={[styles.tripTypeText, selectedTripType === 'one_way' && styles.tripTypeTextSelected]}>One Way</Text>
          </Pressable>
          <Pressable
            accessibilityRole="radio"
            accessibilityLabel="Quick Return trip"
            accessibilityState={{ disabled: !canQuickReturn, selected: selectedTripType === 'quick_return' }}
            disabled={!canQuickReturn}
            onPress={() => setTripType('quick_return')}
            style={[styles.tripType, selectedTripType === 'quick_return' && styles.tripTypeSelected, !canQuickReturn && styles.tripTypeDisabled]}
          >
            <Text style={[styles.tripTypeText, selectedTripType === 'quick_return' && styles.tripTypeTextSelected, !canQuickReturn && styles.tripTypeTextDisabled]}>Quick Return</Text>
          </Pressable>
        </View>
        <Text style={styles.tripTypeHelp}>{canQuickReturn ? 'Going somewhere nearby for a quick errand? Return with the same driver.' : 'Quick Return is available for short trips up to 5 km.'}</Text>

        {selectedRoute ? (
          <Card variant="tinted" style={styles.farePreview}>
            <Text style={styles.farePreviewLabel}>{isQuickReturn ? 'QUICK RETURN TOTAL' : 'ONE-WAY FARE'}</Text>
            <Text style={styles.farePreviewAmount}>PHP {isQuickReturn ? selectedRoute.baseFare * 2 : selectedRoute.baseFare}</Text>
            <Text style={styles.farePreviewDetail}>
              {isQuickReturn
                ? `Two legs at PHP ${selectedRoute.baseFare} each · ${selectedRoute.distanceKm} km per leg`
                : `${selectedRoute.distanceKm} km · fixture route fare`}
            </Text>
            <Text style={styles.routeNote}>Illustrative demo fare; not an official rate.</Text>
          </Card>
        ) : null}

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
      </ScrollView>
      <PrimaryButton label="Review Booking" onPress={reviewBooking} disabled={!canReview} style={styles.button} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  form: { flex: 1 },
  scrollContent: { paddingBottom: spacing.xl },
  fields: { gap: spacing.md },
  routeCard: { gap: spacing.xs, marginTop: spacing.lg },
  routeEyebrow: { ...typography.label, color: colors.secondary },
  routeTitle: { ...typography.sectionTitle, color: colors.text },
  routeDetail: { ...typography.secondaryBody, color: colors.textMuted },
  routeNote: { ...typography.caption, color: colors.textMuted },
  farePreview: { gap: spacing.xs, marginTop: spacing.lg },
  farePreviewLabel: { ...typography.label, color: colors.secondary },
  farePreviewAmount: { ...typography.screenTitle, color: colors.primary },
  farePreviewDetail: { ...typography.secondaryBody, color: colors.text },
  tripTypeLabel: { ...typography.captionSemibold, color: colors.text, marginTop: spacing.xl, marginBottom: spacing.sm },
  tripTypes: { flexDirection: 'row', gap: spacing.sm },
  tripType: { flex: 1, minHeight: touchTargets.comfortable, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: radii.input, paddingHorizontal: spacing.sm },
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
  quickSummary: { gap: spacing.xs, backgroundColor: colors.tint, borderRadius: radii.card, padding: spacing.md, marginTop: spacing.lg },
  quickTitle: { ...typography.captionSemibold, color: colors.primary },
  quickLine: { ...typography.body, color: colors.text },
  quickTotal: { ...typography.bodySemibold, color: colors.primary, marginTop: spacing.xs },
  quickHelp: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
  button: { flexShrink: 0, marginTop: spacing.md, width: '100%' },
  loader: { marginTop: spacing.xxxl },
});
