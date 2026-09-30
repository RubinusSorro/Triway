import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { appConfig } from '@/constants/config';
import { colors, spacing, typography } from '@/constants/theme';
import { SkylineRoad } from '@/components/ui/SkylineRoad';
import { TricycleIcon } from '@/components/ui/TricycleIcon';

export default function Index() {
  useEffect(() => {
    const timer = setTimeout(() => router.replace('/(auth)'), 1600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.brand}>
        <Text accessibilityRole="header" style={styles.wordmark}>{appConfig.appName}</Text>
        <Text style={styles.tagline}>{appConfig.tagline}</Text>
        <View style={styles.icon}><TricycleIcon size={112} color={colors.onPrimary} strokeWidth={1.5} /></View>
      </View>
      <View style={styles.skyline}><SkylineRoad /></View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  brand: { zIndex: 1, alignItems: 'center', paddingBottom: 110 },
  wordmark: { ...typography.wordmark, color: colors.onPrimary },
  tagline: { ...typography.bodySemibold, color: colors.onPrimary, marginTop: spacing.sm },
  icon: { marginTop: spacing.xxxl },
  skyline: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 250 },
});
