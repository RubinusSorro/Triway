import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { colors, radii, shadows, spacing } from '@/constants/theme';

type CardProps = PropsWithChildren<{ style?: StyleProp<ViewStyle>; variant?: 'default' | 'tinted' | 'outlined' }>;

export function Card({ children, style, variant = 'default' }: CardProps) {
  return <View style={[styles.card, variant === 'tinted' && styles.tinted, variant === 'outlined' && styles.outlined, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.lg,
    ...shadows.card,
  },
  tinted: { backgroundColor: colors.tintRow },
  outlined: { borderWidth: 1, borderColor: colors.border, shadowOpacity: 0, elevation: 0 },
});
