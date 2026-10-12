import { Feather } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { Header } from '@/components/layout/Header';
import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { ListRow } from '@/components/ui/ListRow';
import { LocationField } from '@/components/ui/LocationField';
import { SearchBar } from '@/components/ui/SearchBar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { colors, iconSizes, radii, spacing, touchTargets, typography } from '@/constants/theme';
import { RideStatus } from '@/features/rides/types/ride';

const palette = [
  { name: 'Primary', value: colors.primary, lightText: true },
  { name: 'Secondary', value: colors.secondary, lightText: true },
  { name: 'Tint', value: colors.tint, lightText: false },
  { name: 'Background', value: colors.background, lightText: false },
  { name: 'Surface', value: colors.surface, lightText: false },
  { name: 'Text', value: colors.text, lightText: true },
  { name: 'Muted', value: colors.textMuted, lightText: true },
  { name: 'Danger', value: colors.danger, lightText: true },
] as const;

const statuses: RideStatus[] = ['requested', 'accepted', 'arriving', 'ongoing', 'waiting_return', 'completed', 'cancelled'];

export default function DesignSystemShowcase() {
  const [pickup, setPickup] = useState('Antipolo Cathedral');
  const [search, setSearch] = useState('');
  const [showError, setShowError] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [feedback, setFeedback] = useState('Interact with a component to inspect its state.');

  if (!__DEV__) return <Redirect href="/" />;

  return (
    <Screen keyboardAvoiding bottomSafeArea contentContainerStyle={styles.content}>
      <View style={styles.brandCard}>
        <Image accessibilityLabel="TRIWAY official logo" source={require('../../assets/images/TRIWAY.png')} resizeMode="contain" style={styles.logo} />
        <Text style={styles.devLabel}>DEVELOPMENT ONLY</Text>
        <Text style={styles.brandTitle}>TRIWAY component showcase</Text>
        <Text style={styles.brandCopy}>A local visual reference for shared UI primitives and interaction states.</Text>
      </View>

      <Header eyebrow="Foundation" title="Color palette" subtitle="Values are read directly from the centralized design tokens." />
      <View style={styles.swatches}>
        {palette.map((swatch) => (
          <View key={swatch.name} accessibilityLabel={`${swatch.name}: ${swatch.value}`} style={[styles.swatch, { backgroundColor: swatch.value, borderColor: swatch.value === colors.surface ? colors.border : swatch.value }]}>
            <Text style={[styles.swatchName, swatch.lightText ? styles.lightText : styles.darkText]}>{swatch.name}</Text>
            <Text style={[styles.swatchValue, swatch.lightText ? styles.lightText : styles.darkText]}>{swatch.value}</Text>
          </View>
        ))}
      </View>

      <ShowcaseSection title="Typography">
        <Text style={[typography.display, styles.text]}>Display</Text>
        <Text style={[typography.screenTitle, styles.text]}>Screen title</Text>
        <Text style={[typography.sectionHeading, styles.text]}>Section heading</Text>
        <Text style={[typography.body, styles.text]}>Body text for clear, everyday interface copy.</Text>
        <Text style={[typography.secondaryBody, styles.mutedText]}>Secondary body for supporting information.</Text>
        <Text style={[typography.label, styles.text]}>LABEL</Text>
        <Text style={[typography.caption, styles.mutedText]}>Caption text</Text>
        <Text style={[typography.button, styles.text]}>Button text</Text>
      </ShowcaseSection>

      <ShowcaseSection title="Buttons" subtitle="Tap any enabled button to verify pressed and focus feedback.">
        <AppButton label="Primary" onPress={() => setFeedback('Primary button pressed.')} />
        <AppButton label="Secondary" variant="secondary" onPress={() => setFeedback('Secondary button pressed.')} />
        <AppButton label="Outline" variant="outline" onPress={() => setFeedback('Outline button pressed.')} />
        <AppButton label="Ghost" variant="ghost" onPress={() => setFeedback('Ghost button pressed.')} />
        <AppButton label="Destructive" variant="danger" onPress={() => setFeedback('Destructive button pressed.')} />
        <AppButton label="Disabled" disabled onPress={() => undefined} />
        <AppButton label="Loading" loading={showLoading} onPress={() => undefined} />
        <AppButton label={showLoading ? 'Hide loading state' : 'Show loading state'} variant="outline" onPress={() => setShowLoading((value) => !value)} />
        <Text style={styles.mutedText}>The loading button remains visible for inspection and announces its busy state to assistive technology.</Text>
        <Text accessibilityLiveRegion="polite" style={styles.feedback}>{feedback}</Text>
      </ShowcaseSection>

      <ShowcaseSection title="Inputs and search" subtitle="These controls keep their state locally and do not search or book rides.">
        <LocationField label="Pickup" value={pickup} placeholder="Enter pickup" onChangeText={setPickup} />
        <LocationField label="Destination" value="" placeholder="Choose a verified destination" onChangeText={() => undefined} error={showError ? 'Choose a verified location to continue.' : undefined} />
        <AppButton label={showError ? 'Hide validation message' : 'Show validation message'} variant="ghost" onPress={() => setShowError((value) => !value)} />
        <SearchBar value={search} onChangeText={setSearch} onFilterPress={() => setFeedback('Search filters are not connected in the showcase.')} />
      </ShowcaseSection>

      <ShowcaseSection title="Cards and list rows">
        <Card><Text style={styles.cardTitle}>Standard card</Text><Text style={styles.cardCopy}>Surface, radius, padding, and elevation come from shared tokens.</Text></Card>
        <Card variant="tinted"><Text style={styles.cardTitle}>Tinted card</Text><Text style={styles.cardCopy}>For soft grouped content.</Text></Card>
        <Card variant="outlined"><Text style={styles.cardTitle}>Outlined card</Text><Text style={styles.cardCopy}>For lower-emphasis grouping.</Text></Card>
        <ListRow title="Sample route" subtitle="Interactive shared list row" onPress={() => setFeedback('List row pressed.')} />
      </ShowcaseSection>

      <ShowcaseSection title="Status and feedback">
        <View style={styles.badges}>{statuses.map((status) => <StatusBadge key={status} status={status} />)}</View>
        <EmptyState icon={<Feather name="compass" size={iconSizes.xl} color={colors.primary} />} title="Nothing to show yet" body="This reusable empty state can include a local action." actionLabel="Show feedback" onAction={() => setFeedback('Empty-state action pressed.')} />
        <View style={styles.loadingRow}><ActivityIndicator color={colors.primary} /><Text style={styles.mutedText}>Loading indicator</Text></View>
      </ShowcaseSection>

      <ShowcaseSection title="Spacing, shape, and touch targets">
        <Text style={styles.cardCopy}>Spacing scale</Text>
        <View style={styles.tokenRow}>{Object.entries(spacing).map(([name, value]) => <TokenSample key={name} label={name} value={value} />)}</View>
        <Text style={styles.cardCopy}>Corner radii</Text>
        <View style={styles.tokenRow}>
          <ShapeSample label="Input" radius={radii.input} />
          <ShapeSample label="Card" radius={radii.card} />
          <ShapeSample label="Pill" radius={radii.pill} />
        </View>
        <Text style={styles.cardCopy}>Icons: {Object.values(iconSizes).join(', ')} px · Minimum target: {touchTargets.minimum}px · Comfortable target: {touchTargets.comfortable}px</Text>
      </ShowcaseSection>
    </Screen>
  );
}

function ShowcaseSection({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

function TokenSample({ label, value }: { label: string; value: number }) {
  return <View style={[styles.spacingToken, { width: Math.max(value, touchTargets.minimum) }]}><View style={[styles.spacingBar, { width: value }]} /><Text style={styles.tokenLabel}>{label} · {value}</Text></View>;
}

function ShapeSample({ label, radius }: { label: string; radius: number }) {
  return <View style={styles.shapeToken}><View style={[styles.shape, { borderRadius: radius }]} /><Text style={styles.tokenLabel}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  content: { gap: spacing.xxxl },
  brandCard: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: radii.card, padding: spacing.xl, gap: spacing.sm },
  logo: { width: 180, height: 180 },
  devLabel: { ...typography.label, color: colors.tint, letterSpacing: 1 },
  brandTitle: { ...typography.screenTitle, color: colors.onPrimary, textAlign: 'center' },
  brandCopy: { ...typography.secondaryBody, color: colors.onPrimary, textAlign: 'center' },
  swatches: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  swatch: { width: '48%', minHeight: 88, borderRadius: radii.input, borderWidth: 1, padding: spacing.md, justifyContent: 'space-between' },
  swatchName: typography.label,
  swatchValue: typography.caption,
  lightText: { color: colors.onPrimary },
  darkText: { color: colors.text },
  section: { gap: spacing.sm },
  sectionTitle: { ...typography.sectionHeading, color: colors.text },
  sectionSubtitle: { ...typography.secondaryBody, color: colors.textMuted },
  sectionContent: { gap: spacing.md },
  text: { color: colors.text },
  mutedText: { ...typography.secondaryBody, color: colors.textMuted },
  feedback: { ...typography.caption, color: colors.secondary },
  cardTitle: { ...typography.sectionHeading, color: colors.text },
  cardCopy: { ...typography.body, color: colors.textMuted },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: touchTargets.minimum },
  tokenRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  spacingToken: { height: 56, justifyContent: 'space-between' },
  spacingBar: { height: spacing.sm, backgroundColor: colors.secondary, borderRadius: radii.pill },
  tokenLabel: { ...typography.caption, color: colors.textMuted },
  shapeToken: { alignItems: 'center', gap: spacing.xs },
  shape: { width: touchTargets.comfortable, height: touchTargets.comfortable, backgroundColor: colors.tint, borderWidth: 1, borderColor: colors.secondary },
});
