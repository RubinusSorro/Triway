import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { TriwayDialog } from '@/components/ui/TriwayDialog';
import { isLocationWithinServiceArea } from '@/constants/config';
import { colors, radii, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCreateRide } from '@/features/rides/hooks/useCreateRide';
import { useCurrentRide } from '@/features/rides/hooks/useCurrentRide';
import { useRoutes } from '@/features/routes/hooks/useRoutes';
import { parseBookingDraft, toBookingDraftParams } from '@/features/rides/utils/bookingDraft';
import { isQuickReturnEligible } from '@/features/rides/utils/quickReturn';

type DialogState = 'confirmation' | 'error' | null;

export default function RiderReviewScreen() {
  const params = useLocalSearchParams<{ routeId?: string; pickup?: string; destination?: string; tripType?: string }>();
  const draft = parseBookingDraft(params);
  const { user } = useAuth();
  const { routes, isLoading } = useRoutes();
  const { createRide, isCreating } = useCreateRide();
  const { ride: activeRide, isLoading: isActiveRideLoading } = useCurrentRide(user?.id);
  const [dialogState, setDialogState] = useState<DialogState>(null);
  const submissionInProgress = useRef(false);
  const route = useMemo(() => {
    if (draft?.routeId) {
      const match = routes.find((item) => item.id === draft.routeId);
      if (match) return match;
      if (draft.pickup && draft.destination) {
        return {
          id: draft.routeId,
          name: `${draft.pickup} – ${draft.destination}`,
          origin: draft.pickup,
          destination: draft.destination,
          distanceKm: 3.2,
          baseFare: 55,
          etaMinutes: 12,
          notes: 'Antipolo custom trip',
        };
      }
    }
    return undefined;
  }, [draft, routes]);

  const isQuickReturn = draft?.tripType === 'quick_return';
  const quickReturnIsValid = !isQuickReturn || isQuickReturnEligible(route?.distanceKm);
  const locationsAreValid = Boolean(draft && isLocationWithinServiceArea(draft.pickup) && isLocationWithinServiceArea(draft.destination));
  const hasActiveRide = Boolean(activeRide && activeRide.status !== 'cancelled');
  const canConfirm = Boolean(draft && route && user && locationsAreValid && quickReturnIsValid && !isActiveRideLoading && !hasActiveRide);

  const editBooking = () => {
    if (!draft) {
      router.replace('/(rider)/routes');
      return;
    }

    router.replace({ pathname: '/(rider)/booking', params: toBookingDraftParams(draft) });
  };

  const confirmBooking = async () => {
    if (!draft || !route || !user || !canConfirm || submissionInProgress.current) return;

    submissionInProgress.current = true;
    const ride = await createRide({
      riderId: user.id,
      riderName: user.name,
      routeId: route.id,
      routeName: route.name,
      pickup: draft.pickup,
      destination: draft.destination,
      pickupCoords:
        draft.pickupLat != null && draft.pickupLng != null
          ? { latitude: draft.pickupLat, longitude: draft.pickupLng }
          : undefined,
      destinationCoords:
        draft.destLat != null && draft.destLng != null
          ? { latitude: draft.destLat, longitude: draft.destLng }
          : undefined,
      fare: route.baseFare,
      distanceKm: route.distanceKm,
      outboundFare: isQuickReturn ? route.baseFare : undefined,
      returnFare: isQuickReturn ? route.baseFare : undefined,
      totalFare: isQuickReturn ? route.baseFare * 2 : undefined,
      isReturnRide: isQuickReturn,
      paymentMethod: draft.paymentMethod,
    });
    submissionInProgress.current = false;

    if (ride) {
      setDialogState(null);
      router.replace('/(rider)/matching');
      return;
    }

    setDialogState('error');
  };

  if (isLoading) {
    return <Screen scroll={false}><ActivityIndicator style={styles.loader} color={colors.primary} /></Screen>;
  }

  if (!draft || !route || !locationsAreValid || !quickReturnIsValid) {
    return (
      <Screen scroll={false}>
        <ScreenHeader title="Review booking" showBack showActions={false} />
        <EmptyState
          title="Booking details need updating"
          body="Choose a verified route and valid trip details before reviewing your booking."
          actionLabel="Browse routes"
          onAction={() => router.replace('/(rider)/routes')}
        />
      </Screen>
    );
  }

  const totalFare = isQuickReturn ? route.baseFare * 2 : route.baseFare;

  return (
    <Screen scroll={false} includeTabBarPadding contentContainerStyle={styles.screen}>
      <ScreenHeader title="Review booking" showBack showActions={false} />
      <ScrollView style={styles.form} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Card style={styles.card}>
          <Text style={styles.eyebrow}>SELECTED ROUTE</Text>
          <Text style={styles.routeName}>{route.name}</Text>
          <View style={styles.stopGroup}>
            <View style={styles.stopRow}>
              <View style={styles.pickupMarker} />
              <View style={styles.stopCopy}><Text style={styles.stopLabel}>Pickup</Text><Text style={styles.stopValue}>{draft.pickup}</Text></View>
            </View>
            <View style={styles.stopRow}>
              <View style={styles.destinationMarker} />
              <View style={styles.stopCopy}><Text style={styles.stopLabel}>Destination</Text><Text style={styles.stopValue}>{draft.destination}</Text></View>
            </View>
          </View>
        </Card>

        <Card variant="outlined" style={styles.card}>
          <Text style={styles.eyebrow}>{isQuickReturn ? 'QUICK RETURN · ONE BOOKING' : 'ONE-WAY TRIP'}</Text>
          {isQuickReturn ? (
            <View style={styles.legGroup}>
              <Text style={styles.legText}>Leg 1: {draft.pickup} to {draft.destination}</Text>
              <Text style={styles.legText}>Leg 2: {draft.destination} to {draft.pickup}</Text>
            </View>
          ) : null}
          <Text style={styles.distance}>{route.distanceKm} km{isQuickReturn ? ' per leg' : ''}</Text>
          <Text style={styles.total}>PHP {totalFare}</Text>
          <Text style={styles.disclaimer}>Illustrative demo fare; not an official rate.</Text>
        </Card>

        <Card variant="outlined" style={styles.card}>
          <Text style={styles.paymentTitle}>Pay in cash</Text>
          <Text style={styles.paymentBody}>Pay your driver at the end of the trip.</Text>
        </Card>

        {!user ? <Text accessibilityRole="alert" style={styles.error}>Choose a Rider demo profile before confirming this booking.</Text> : null}
        {hasActiveRide ? <Text accessibilityRole="alert" style={styles.error}>Finish or cancel your active ride before creating another booking.</Text> : null}
      </ScrollView>
      <View style={styles.actions}>
        <AppButton label="Edit Booking" variant="secondary" onPress={editBooking} />
        <AppButton label="Confirm Booking" onPress={() => setDialogState('confirmation')} disabled={!canConfirm} />
      </View>

      <TriwayDialog
        visible={dialogState === 'confirmation'}
        tone="confirmation"
        title="Confirm booking?"
        message={`Your ${isQuickReturn ? 'Quick Return' : 'one-way'} booking totals PHP ${totalFare}.`}
        primaryLabel="Confirm Booking"
        secondaryLabel="Keep editing"
        onPrimary={confirmBooking}
        onSecondary={() => setDialogState(null)}
        onRequestClose={() => setDialogState(null)}
        loading={isCreating}
      />
      <TriwayDialog
        visible={dialogState === 'error'}
        tone="error"
        title="Booking could not be created"
        message="Your selections are still available. Review them and try again."
        primaryLabel="Back to review"
        onPrimary={() => setDialogState(null)}
        onRequestClose={() => setDialogState(null)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  form: { flex: 1 },
  scrollContent: { gap: spacing.lg, paddingBottom: spacing.xl },
  card: { gap: spacing.sm },
  eyebrow: { ...typography.label, color: colors.secondary },
  routeName: { ...typography.sectionHeading, color: colors.text },
  stopGroup: { gap: spacing.md, marginTop: spacing.sm },
  stopRow: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.md },
  pickupMarker: { backgroundColor: colors.primary, borderRadius: radii.pill, height: 12, marginTop: spacing.xs, width: 12 },
  destinationMarker: { backgroundColor: colors.surface, borderColor: colors.primary, borderRadius: 2, borderWidth: 2, height: 12, marginTop: spacing.xs, width: 12 },
  stopCopy: { flex: 1 },
  stopLabel: { ...typography.caption, color: colors.textMuted },
  stopValue: { ...typography.bodySemibold, color: colors.text },
  legGroup: { gap: spacing.xs },
  legText: { ...typography.secondaryBody, color: colors.text },
  distance: { ...typography.secondaryBody, color: colors.textMuted },
  total: { ...typography.screenTitle, color: colors.primary },
  disclaimer: { ...typography.caption, color: colors.textMuted },
  paymentTitle: { ...typography.sectionHeading, color: colors.text },
  paymentBody: { ...typography.body, color: colors.textMuted },
  error: { ...typography.caption, color: colors.danger },
  actions: { flexShrink: 0, gap: spacing.sm, marginTop: spacing.md },
  loader: { marginTop: spacing.xxxl },
});
