import { router } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { colors, spacing, typography } from '@/constants/theme';

const steps = [
  ['Pick a route', 'Choose a pickup and destination in Antipolo.'],
  ['Meet your driver', 'See the assigned demo driver and ride status.'],
];

export default function WelcomeScreen() {
  return (
    <Screen bottomSafeArea contentContainerStyle={styles.content}>
      <Image accessibilityLabel="TRIWAY official logo" source={require('../../assets/images/TRIWAY.png')} style={styles.logo} />
      <Text style={styles.eyebrow}>TRICYCLE BOOKING DEMO</Text>
      <Text accessibilityRole="header" style={styles.title}>Rides that know Antipolo</Text>
      <Text style={styles.subtitle}>Book a tricycle by route and pay your driver in cash.</Text>
      <View style={styles.steps}>
        {steps.map(([title, body], index) => (
          <Card key={title} variant="outlined" style={styles.step}>
            <Text style={styles.number}>0{index + 1}</Text>
            <View style={styles.stepCopy}><Text style={styles.stepTitle}>{title}</Text><Text style={styles.stepBody}>{body}</Text></View>
          </Card>
        ))}
      </View>
      <AppButton label="Continue" onPress={() => router.push('/(auth)/role-selection')} style={styles.button} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { justifyContent: 'center', paddingTop: spacing.xxl },
  logo: { width: 88, height: 88, borderRadius: 20, alignSelf: 'center', marginBottom: spacing.xxxl },
  eyebrow: { ...typography.label, color: colors.secondary, textAlign: 'center', letterSpacing: 0.8 },
  title: { ...typography.display, color: colors.text, textAlign: 'center', marginTop: spacing.sm },
  subtitle: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.md },
  steps: { gap: spacing.md, marginTop: spacing.xxxl },
  step: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  number: { ...typography.sectionHeading, color: colors.primary },
  stepCopy: { flex: 1 },
  stepTitle: { ...typography.bodySemibold, color: colors.text },
  stepBody: { ...typography.secondaryBody, color: colors.textMuted, marginTop: spacing.xs },
  button: { marginTop: spacing.xxxl },
});
