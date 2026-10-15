import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { AuthScreen } from '@/components/auth/AuthScreen';
import { AuthTextField } from '@/components/auth/AuthTextField';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { colors, spacing, typography } from '@/constants/theme';

export default function RiderLoginScreen() {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);

  return (
    <AuthScreen eyebrow="Rider access" title="Rider log in" subtitle="This is a visual prototype. Use demo role selection to enter the app.">
      <Card style={styles.card}>
        <AuthTextField label="Mobile number" value={mobile} onChangeText={setMobile} placeholder="09XX XXX XXXX" keyboardType="phone-pad" error={showError ? 'Enter an 11-digit mobile number.' : undefined} />
        <AuthTextField label="Password" value={password} onChangeText={setPassword} placeholder="Your password" password />
        <AppButton label="Check details" onPress={() => setShowError(mobile.replace(/\D/g, '').length !== 11)} />
        <AppButton label="Continue in Rider demo" variant="secondary" onPress={() => router.replace('/(auth)/role-selection')} />
        <Text style={styles.link} onPress={() => router.push('/(auth)/rider-register')}>Create a visual demo account</Text>
      </Card>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({ card: { gap: spacing.sm }, link: { ...typography.bodySemibold, color: colors.secondary, textAlign: 'center', marginTop: spacing.sm } });
