import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AuthScreen } from '@/components/auth/AuthScreen';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { colors, iconSizes, spacing, typography } from '@/constants/theme';

const documents = ['Driver’s license', 'Vehicle registration', 'Franchise or permit', 'Selfie with ID'];

export default function DriverDocumentsScreen() {
  return (
    <AuthScreen eyebrow="Driver verification" title="Submit documents" subtitle="Document upload is not connected in this prototype. The required list is a visual reference only.">
      <Card style={styles.card}>
        {documents.map((document) => (
          <View key={document} style={styles.row}>
            <Feather name="file-text" size={iconSizes.lg} color={colors.primary} />
            <Text style={styles.label}>{document}</Text>
            <Text style={styles.action}>Preview</Text>
          </View>
        ))}
        <AppButton label="View verification status" onPress={() => router.push('/(auth)/driver-verification')} />
        <AppButton label="Back to Driver registration" variant="outline" onPress={() => router.back()} />
      </Card>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm },
  row: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { ...typography.bodySemibold, color: colors.text, flex: 1 },
  action: { ...typography.label, color: colors.secondary },
});
