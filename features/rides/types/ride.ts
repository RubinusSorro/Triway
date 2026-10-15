import { PaymentMethod } from '@/types/common';

export type RideStatus = 'requested' | 'accepted' | 'arriving' | 'ongoing' | 'waiting_return' | 'completed' | 'cancelled';
export type RideLeg = 'outbound' | 'return';
export type CancellationActor = 'rider' | 'driver';
export type CancellationReason =
  | 'Driver is taking too long'
  | 'Changed my plans'
  | 'Booked by mistake'
  | 'Vehicle issue'
  | 'Unable to reach rider'
  | 'Rider did not show up'
  | 'Emergency'
  | 'Other';

export type Driver = {
  id: string;
  userId: string;
  name: string;
  vehicle: string;
  plateNumber: string;
  isOnline: boolean;
};

export type Ride = {
  id: string;
  riderId: string;
  riderName?: string;
  driverId?: string;
  preferredDriverId?: string;
  preferredDriverName?: string;
  previousRideId?: string;
  isReturnRide?: boolean;
  preferredDriverDeclined?: boolean;
  declinedDriverIds?: string[];
  routeId: string;
  routeName: string;
  pickup: string;
  destination: string;
  fare: number;
  distanceKm: number;
  outboundFare?: number;
  returnFare?: number;
  totalFare?: number;
  currentLeg?: RideLeg;
  outboundCompletedAt?: string;
  returnStartedAt?: string;
  paymentMethod: PaymentMethod;
  status: RideStatus;
  driver?: Driver;
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelledBy?: CancellationActor;
  cancellationReason?: CancellationReason;
};

export type CreateRideInput = {
  riderId: string;
  riderName: string;
  routeId: string;
  routeName: string;
  pickup: string;
  destination: string;
  fare: number;
  distanceKm: number;
  paymentMethod: PaymentMethod;
  outboundFare?: number;
  returnFare?: number;
  totalFare?: number;
  preferredDriverId?: string;
  preferredDriverName?: string;
  previousRideId?: string;
  isReturnRide?: boolean;
};
