import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { TriwayDialog } from '@/components/ui/TriwayDialog';
import { colors, iconSizes, radii, spacing, touchTargets, typography } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRide } from '@/features/rides/hooks/useRide';
import { useRideRating, useSubmitRideRating } from '@/features/rides/hooks/useRideRating';

export default function RiderRatingScreen() {
  const { rideId } = useLocalSearchParams<{ rideId?: string }>();
  const { user } = useAuth();
  const { ride, isLoading: isRideLoading } = useRide(rideId);
  const { rating: submittedRating, isLoading: isRatingLoading, setRating } = useRideRating(rideId, user?.id);
  const { submitRating, isSubmitting, error } = useSubmitRideRating();
  const [score, setScore] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigateAfterDismiss = useRef(false);
  const submitting = useRef(false);
  const isLoading = isRideLoading || isRatingLoading;

  useEffect(() => {
    if (navigateAfterDismiss.current && !showSuccess) {
      navigateAfterDismiss.current = false;
      router.replace('/(rider)/history');
    }
  }, [showSuccess]);

  const submit = async () => {
    if (!ride || !user || !score || submitting.current || submittedRating) return;
    submitting.current = true;
    const result = await submitRating({ rideId: ride.id, riderId: user.id, driverId: ride.driverId, score });
    submitting.current = false;
    if (result) { setRating(result); setShowSuccess(true); }
  };

  if (isLoading) return <Screen scroll={false}><ActivityIndicator color={colors.primary} /></Screen>;
  if (!ride || ride.status !== 'completed' || !user) return <Screen scroll={false}><EmptyState title="Rating unavailable" body="Only completed Rider trips can be rated." actionLabel="View trips" onAction={() => router.replace('/(rider)/history')} /></Screen>;

  return (
    <Screen scroll={false} includeTabBarPadding contentContainerStyle={styles.screen}>
      <ScreenHeader title="Rate driver" showBack showActions={false} />
      <ScrollView style={styles.form} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>How was your ride?</Text>
        <Text style={styles.subtitle}>{ride.driver?.name ?? 'Your driver'} · {ride.routeName}</Text>
        <Card style={styles.card}>
          {submittedRating ? <Text style={styles.saved}>You rated this ride {submittedRating.score} out of 5.</Text> : <View style={styles.stars} accessibilityRole="radiogroup">{([1, 2, 3, 4, 5] as const).map((value) => <Pressable key={value} accessibilityRole="radio" accessibilityLabel={`${value} star${value === 1 ? '' : 's'}`} accessibilityState={{ selected: score === value }} onPress={() => setScore(value)} style={styles.star}><Feather name="star" size={iconSizes.lg} color={(score ?? 0) >= value ? colors.warning : colors.disabled} /></Pressable>)}</View>}
        </Card>
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      </ScrollView>
      <View style={styles.actions}><AppButton label={submittedRating ? 'Back to Trips' : 'Submit Rating'} onPress={submittedRating ? () => router.replace('/(rider)/history') : submit} disabled={!submittedRating && !score} loading={isSubmitting} /></View>
      <TriwayDialog
        visible={showSuccess}
        tone="success"
        title="Thanks for your rating"
        message="Your rating is saved for this demo session."
        primaryLabel="Back to Trips"
        onPrimary={() => { navigateAfterDismiss.current = true; setShowSuccess(false); }}
        onRequestClose={() => setShowSuccess(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({ screen: { flex: 1 }, form: { flex: 1 }, content: { flexGrow: 1, gap: spacing.lg, paddingBottom: spacing.xl }, title: { ...typography.display, color: colors.text }, subtitle: { ...typography.body, color: colors.textMuted }, card: { alignItems: 'center', gap: spacing.md }, stars: { flexDirection: 'row', gap: spacing.sm }, star: { alignItems: 'center', borderColor: colors.border, borderRadius: radii.pill, borderWidth: 1, height: touchTargets.comfortable, justifyContent: 'center', width: touchTargets.comfortable }, saved: { ...typography.bodySemibold, color: colors.primary }, error: { ...typography.caption, color: colors.danger }, actions: { flexShrink: 0, marginTop: spacing.md } });
