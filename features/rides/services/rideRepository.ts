import { CreateRideInput, Driver, Ride, RideStatus } from '@/features/rides/types/ride';

export type Unsubscribe = () => void;

export type RideRepository = {
  createRide(input: CreateRideInput): Promise<Ride>;
  subscribeToRide(rideId: string, listener: (ride: Ride | null) => void): Unsubscribe;
  subscribeToCurrentRiderRide(riderId: string, listener: (ride: Ride | null) => void): Unsubscribe;
  subscribeToPendingRide(listener: (ride: Ride | null) => void): Unsubscribe;
  subscribeToDriverRide(driverId: string, listener: (ride: Ride | null) => void): Unsubscribe;
  listRideHistory(riderId: string): Promise<Ride[]>;
  listDriverRideHistory(driverId: string): Promise<Ride[]>;
  acceptRide(rideId: string, driver: Driver): Promise<Ride>;
  updateRideStatus(rideId: string, status: RideStatus): Promise<Ride>;
};
