import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { colors, radii, shadows, spacing } from '@/constants/theme';

type CardProps = PropsWithChildren<{ style?: StyleProp<ViewStyle>; variant?: 'default' | 'tinted' }>;

export function Card({ children, style, variant = 'default' }: CardProps) {
  return <View style={[styles.card, variant === 'tinted' && styles.tinted, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.lg,
    ...shadows.card,
  },
  tinted: { backgroundColor: colors.tintRow },
});
