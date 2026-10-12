import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/constants/theme';

export default function Index() {
  useEffect(() => {
    const timer = setTimeout(() => router.replace('/(auth)'), 1600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <Image accessibilityLabel="TRIWAY official logo" source={require('../assets/images/TRIWAY.png')} style={styles.logo} />
      <Text accessibilityRole="header" style={styles.wordmark}>TRIWAY</Text>
      <Text style={styles.tagline}>Antipolo’s tricycle rides, booked simply.</Text>
      <Text style={styles.loading}>Preparing your ride…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, paddingHorizontal: spacing.xxl },
  logo: { width: 104, height: 104, borderRadius: 24 },
  wordmark: { ...typography.wordmark, color: colors.onPrimary, marginTop: spacing.xl },
  tagline: { ...typography.body, color: colors.onPrimary, textAlign: 'center', marginTop: spacing.sm },
  loading: { ...typography.caption, color: colors.onPrimary, marginTop: spacing.xxxxl, opacity: 0.86 },
});
