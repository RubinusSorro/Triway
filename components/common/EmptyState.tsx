import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { useAppTheme } from '@/hooks/useAppTheme';

type EmptyStateProps = {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, body, actionLabel, onAction }: EmptyStateProps) {
  const { theme } = useAppTheme();

  return (
    <Card style={styles.card}>
      <View style={[styles.mark, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]} />
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      <Text style={[styles.body, { color: theme.colors.mutedText }]}>{body}</Text>
      {actionLabel && onAction ? <AppButton label={actionLabel} onPress={onAction} /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'flex-start',
    gap: 10,
  },
  mark: {
    width: 44,
    height: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
});
