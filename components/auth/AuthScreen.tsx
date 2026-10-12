import { Image, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { colors, spacing, typography } from '@/constants/theme';

type AuthScreenProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export function AuthScreen({ eyebrow, title, subtitle, children }: AuthScreenProps) {
  return (
    <Screen keyboardAvoiding bottomSafeArea contentContainerStyle={styles.content}>
      <View style={styles.brandRow}>
        <Image accessibilityLabel="TRIWAY official logo" source={require('../../assets/images/TRIWAY.png')} style={styles.logo} />
        <View>
          <Text style={styles.brand}>TRIWAY</Text>
          <Text style={styles.area}>ANTIPOLO CITY</Text>
        </View>
      </View>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text accessibilityRole="header" style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {children}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.xxl },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xxxl },
  logo: { width: 52, height: 52, borderRadius: 12 },
  brand: { ...typography.sectionHeading, color: colors.primary, letterSpacing: 0.8 },
  area: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
  eyebrow: { ...typography.label, color: colors.secondary, textTransform: 'uppercase' },
  title: { ...typography.display, color: colors.text, marginTop: spacing.sm },
  subtitle: { ...typography.body, color: colors.textMuted, marginTop: spacing.sm, marginBottom: spacing.xxl },
});
