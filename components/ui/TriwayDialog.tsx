import { Feather } from '@expo/vector-icons';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { colors, iconSizes, radii, spacing, typography } from '@/constants/theme';
import { AppButton, ButtonVariant } from './AppButton';

type DialogTone = 'confirmation' | 'error' | 'success';

type TriwayDialogProps = {
  visible: boolean;
  tone: DialogTone;
  title: string;
  message: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  onRequestClose: () => void;
  loading?: boolean;
};

const toneDetails: Record<DialogTone, { icon: 'check-circle' | 'alert-circle'; iconColor: string; primaryVariant: ButtonVariant }> = {
  confirmation: { icon: 'check-circle', iconColor: colors.primary, primaryVariant: 'primary' },
  error: { icon: 'alert-circle', iconColor: colors.danger, primaryVariant: 'primary' },
  success: { icon: 'check-circle', iconColor: colors.primary, primaryVariant: 'primary' },
};

export function TriwayDialog({
  visible,
  tone,
  title,
  message,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  onRequestClose,
  loading = false,
}: TriwayDialogProps) {
  const details = toneDetails[tone];

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={loading ? undefined : onRequestClose}
    >
      <View accessibilityViewIsModal style={styles.overlay}>
        <View accessibilityRole="alert" style={styles.dialog}>
          <Feather accessible={false} name={details.icon} size={iconSizes.xl} color={details.iconColor} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <AppButton
              label={primaryLabel}
              variant={details.primaryVariant}
              onPress={onPrimary}
              loading={loading}
              style={styles.action}
            />
            {secondaryLabel && onSecondary ? (
              <AppButton
                label={secondaryLabel}
                variant="secondary"
                onPress={onSecondary}
                disabled={loading}
                style={styles.action}
              />
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.overlay, padding: spacing.xl },
  dialog: { width: '100%', maxWidth: 420, alignItems: 'center', backgroundColor: colors.surface, borderRadius: radii.card, gap: spacing.md, padding: spacing.xl },
  title: { ...typography.screenTitle, color: colors.text, textAlign: 'center' },
  message: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
  actions: { alignSelf: 'stretch', gap: spacing.sm, marginTop: spacing.sm },
  action: { width: '100%' },
});
