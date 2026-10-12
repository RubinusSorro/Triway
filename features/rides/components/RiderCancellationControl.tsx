import { useState } from 'react';

import { AppButton } from '@/components/ui/AppButton';
import { CancellationDialog, RIDER_CANCELLATION_REASONS } from '@/components/ui/CancellationDialog';
import { useCancelRide } from '@/features/rides/hooks/useCancelRide';
import { CancellationReason, Ride } from '@/features/rides/types/ride';

type RiderCancellationControlProps = {
  ride: Ride;
};

export function RiderCancellationControl({ ride }: RiderCancellationControlProps) {
  const [visible, setVisible] = useState(false);
  const { cancelRide, isCancelling, error } = useCancelRide();
  const canCancel = ride.status === 'requested' || ride.status === 'accepted' || ride.status === 'arriving' || ride.status === 'waiting_return';

  const cancel = async (reason: CancellationReason) => {
    const cancelledRide = await cancelRide(ride.id, 'rider', reason);
    if (cancelledRide) setVisible(false);
  };

  if (!canCancel) return null;

  return (
    <>
      <AppButton label="Cancel ride" variant="danger" onPress={() => setVisible(true)} />
      <CancellationDialog
        visible={visible}
        actor="rider"
        reasons={RIDER_CANCELLATION_REASONS}
        isSubmitting={isCancelling}
        error={error}
        onClose={() => setVisible(false)}
        onConfirm={cancel}
      />
    </>
  );
}
