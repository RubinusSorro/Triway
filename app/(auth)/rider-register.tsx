import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { AuthScreen } from '@/components/auth/AuthScreen';
import { AuthTextField } from '@/components/auth/AuthTextField';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { colors, spacing, typography } from '@/constants/theme';

export default function RiderRegisterScreen() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  return (
    <AuthScreen eyebrow="Rider registration" title="Create rider account" subtitle="Account creation is not connected in this prototype.">
      <Card style={styles.card}>
        <AuthTextField label="Full name" value={name} onChangeText={setName} placeholder="Your name" />
        <AuthTextField label="Mobile number" value={mobile} onChangeText={setMobile} placeholder="09XX XXX XXXX" keyboardType="phone-pad" />
        <AuthTextField label="Password" value={password} onChangeText={setPassword} placeholder="Create a password" password />
        {message ? <Text accessibilityRole="alert" style={styles.message}>{message}</Text> : null}
        <AppButton label="Review demo form" onPress={() => setMessage('Prototype only: no account was created or saved.')} />
        <AppButton label="Back to Rider log in" variant="outline" onPress={() => router.back()} />
      </Card>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({ card: { gap: spacing.sm }, message: { ...typography.secondaryBody, color: colors.warning, marginBottom: spacing.sm } });
