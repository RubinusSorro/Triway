import { PaymentMethod } from '@/types/common';

export type RideStatus = 'requested' | 'accepted' | 'arriving' | 'ongoing' | 'completed' | 'cancelled';

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
  driverId?: string;
  routeId: string;
  routeName: string;
  pickup: string;
  destination: string;
  fare: number;
  paymentMethod: PaymentMethod;
  status: RideStatus;
  driver?: Driver;
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
};

export type CreateRideInput = {
  riderId: string;
  routeId: string;
  routeName: string;
  pickup: string;
  destination: string;
  fare: number;
  paymentMethod: PaymentMethod;
};
