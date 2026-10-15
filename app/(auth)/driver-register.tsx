import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { AuthScreen } from '@/components/auth/AuthScreen';
import { AuthTextField } from '@/components/auth/AuthTextField';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { colors, spacing, typography } from '@/constants/theme';

export default function DriverRegisterScreen() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [plate, setPlate] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  return (
    <AuthScreen eyebrow="Driver registration" title="Create driver account" subtitle="Registration and verification are visual-only in this prototype.">
      <Card style={styles.card}>
        <AuthTextField label="Full name" value={name} onChangeText={setName} placeholder="Your name" />
        <AuthTextField label="Mobile number" value={mobile} onChangeText={setMobile} placeholder="09XX XXX XXXX" keyboardType="phone-pad" />
        <AuthTextField label="Tricycle plate number" value={plate} onChangeText={setPlate} placeholder="ABC 123" autoCapitalize="characters" />
        {message ? <Text accessibilityRole="alert" style={styles.message}>{message}</Text> : null}
        <AppButton label="Continue to document preview" onPress={() => router.push('/(auth)/driver-documents')} />
        <AppButton label="Review demo form" variant="outline" onPress={() => setMessage('Prototype only: no driver account was created or saved.')} />
      </Card>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({ card: { gap: spacing.sm }, message: { ...typography.secondaryBody, color: colors.warning, marginBottom: spacing.sm } });
