import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/constants/theme';
import { CancellationActor, CancellationReason } from '@/features/rides/types/ride';
import { AppButton } from './AppButton';

export const RIDER_CANCELLATION_REASONS: CancellationReason[] = [
  'Driver is taking too long',
  'Changed my plans',
  'Booked by mistake',
  'Other',
];

export const DRIVER_CANCELLATION_REASONS: CancellationReason[] = [
  'Vehicle issue',
  'Unable to reach rider',
  'Rider did not show up',
  'Emergency',
  'Other',
];

type CancellationDialogProps = {
  visible: boolean;
  actor: CancellationActor;
  reasons: CancellationReason[];
  isSubmitting?: boolean;
  error?: string | null;
  onClose: () => void;
  onConfirm: (reason: CancellationReason) => void;
};

export function CancellationDialog({ visible, actor, reasons, isSubmitting = false, error, onClose, onConfirm }: CancellationDialogProps) {
  const [selectedReason, setSelectedReason] = useState<CancellationReason | null>(null);
  const close = () => {
    setSelectedReason(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Cancel this ride?</Text>
          <Text style={styles.body}>Your ride will be cancelled and moved to your ride history.</Text>
          <Text style={styles.reasonLabel}>{actor === 'rider' ? 'Why are you cancelling?' : 'Cancellation reason'}</Text>
          <View style={styles.reasons}>
            {reasons.map((reason) => {
              const isSelected = selectedReason === reason;
              return (
                <Pressable
                  key={reason}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => setSelectedReason(reason)}
                  style={[styles.reason, isSelected && styles.reasonSelected]}
                >
                  <Text style={[styles.reasonText, isSelected && styles.reasonTextSelected]}>{reason}</Text>
                </Pressable>
              );
            })}
          </View>
          {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
          <View style={styles.actions}>
            <AppButton label="Keep Ride" variant="secondary" onPress={close} disabled={isSubmitting} style={styles.action} />
            <AppButton label="Confirm Cancellation" variant="danger" onPress={() => selectedReason && onConfirm(selectedReason)} disabled={!selectedReason || isSubmitting} style={styles.action} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(17, 24, 39, 0.45)' },
  dialog: { backgroundColor: colors.surface, borderTopLeftRadius: radii.card, borderTopRightRadius: radii.card, padding: spacing.xl, gap: spacing.md },
  title: { ...typography.title, color: colors.text },
  body: { ...typography.body, color: colors.textMuted },
  reasonLabel: { ...typography.bodySemibold, color: colors.text, marginTop: spacing.sm },
  reasons: { gap: spacing.sm },
  reason: { minHeight: 44, justifyContent: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: radii.input, paddingHorizontal: spacing.md },
  reasonSelected: { borderColor: colors.primary, backgroundColor: colors.tint },
  reasonText: { ...typography.body, color: colors.text },
  reasonTextSelected: { ...typography.bodySemibold, color: colors.primary },
  error: { ...typography.caption, color: colors.danger },
  actions: { gap: spacing.sm, marginTop: spacing.sm },
  action: { width: '100%' },
});