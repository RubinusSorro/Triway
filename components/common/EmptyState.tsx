import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { radii, spacing, typography, touchTargets } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

type EmptyStateProps = {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
};

export function EmptyState({ title, body, actionLabel, onAction, icon }: EmptyStateProps) {
  const { theme } = useAppTheme();

  return (
    <Card style={styles.card}>
      {icon ? <View style={styles.icon}>{icon}</View> : <View style={[styles.mark, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]} />}
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      <Text style={[styles.body, { color: theme.colors.mutedText }]}>{body}</Text>
      {actionLabel && onAction ? <AppButton label={actionLabel} onPress={onAction} /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  icon: { minWidth: touchTargets.minimum, minHeight: touchTargets.minimum, alignItems: 'center', justifyContent: 'center' },
  mark: {
    width: 44,
    height: 8,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  title: typography.sectionHeading,
  body: { ...typography.body, marginBottom: spacing.sm },
});
