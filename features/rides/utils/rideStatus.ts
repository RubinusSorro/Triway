import { RideStatus } from '@/features/rides/types/ride';
import { colors } from '@/constants/theme';

export const rideStatusMeta: Record<RideStatus, { label: string; riderCopy: string; driverCopy: string; color: string }> = {
  requested: {
    label: 'Searching',
    riderCopy: 'Searching for a nearby tricycle driver.',
    driverCopy: 'New rider request waiting for acceptance.',
    color: colors.warning,
  },
  accepted: {
    label: 'Accepted',
    riderCopy: 'Driver accepted your booking.',
    driverCopy: 'You accepted the ride. Head to pickup.',
    color: colors.info,
  },
  arriving: {
    label: 'Arriving',
    riderCopy: 'Driver is on the way to your pickup point.',
    driverCopy: 'Arriving at the pickup point.',
    color: colors.info,
  },
  ongoing: {
    label: 'Ongoing',
    riderCopy: 'Ride in progress.',
    driverCopy: 'Trip started. Drive safely.',
    color: colors.primary,
  },
  completed: {
    label: 'Completed',
    riderCopy: 'Ride completed. It is now in history.',
    driverCopy: 'Trip completed.',
    color: colors.primary,
  },
  cancelled: {
    label: 'Cancelled',
    riderCopy: 'Ride cancelled.',
    driverCopy: 'Ride cancelled.',
    color: colors.danger,
  },
};

export const rideStatusSteps: RideStatus[] = ['requested', 'accepted', 'arriving', 'ongoing', 'completed'];
