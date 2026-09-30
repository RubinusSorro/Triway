import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SERVICE_AREA } from '@/constants/config';
import { colors, radii, spacing, typography } from '@/constants/theme';
import { SkylineRoad } from '@/components/ui/SkylineRoad';
import { TricycleIcon } from '@/components/ui/TricycleIcon';

export default function WelcomeScreen() {
  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      {/* TODO: Replace this branded placeholder with assets/images/welcome.jpg. */}
      <View style={styles.placeholder}>
        <View style={styles.placeholderIcon}><TricycleIcon size={150} color={colors.onPrimary} strokeWidth={1.4} /></View>
        <View style={styles.skyline}><SkylineRoad /></View>
      </View>
      <LinearGradient colors={[colors.overlayClear, colors.overlay]} locations={[0.25, 1]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.content}>
          <Text style={styles.welcome}>Welcome to</Text>
          <View style={styles.wordmarkRow}>
            <Text accessibilityRole="header" style={styles.wordmark}>TRIWAY</Text>
            <TricycleIcon size={48} color={colors.onPrimary} />
          </View>
          <Text style={styles.tagline}>Fast. Safe. Affordable.{`\n`}Your way around {SERVICE_AREA.city}.</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Continue to TRIWAY" onPress={() => router.push('/(auth)/role-selection')} style={({ pressed }) => [styles.continue, pressed && styles.pressed]}>
            <Text style={styles.continueLabel}>Continue</Text>
            <Feather name="arrow-right" size={21} color={colors.primary} />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.primary },
  placeholder: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  placeholderIcon: { marginBottom: 110, opacity: 0.62 },
  skyline: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 250, opacity: 0.82 },
  safeArea: { flex: 1 },
  content: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: spacing.xxl, paddingBottom: spacing.xxl },
  welcome: { ...typography.title, color: colors.onPrimary },
  wordmarkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
  wordmark: { ...typography.wordmark, color: colors.onPrimary },
  tagline: { ...typography.bodySemibold, color: colors.onPrimary, marginTop: spacing.lg },
  continue: { minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderRadius: radii.button, marginTop: spacing.xxl },
  continueLabel: { ...typography.button, color: colors.primary },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
});
