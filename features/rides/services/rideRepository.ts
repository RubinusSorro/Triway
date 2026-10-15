import { CancellationActor, CancellationReason, CreateRideInput, Driver, Ride, RideStatus } from '@/features/rides/types/ride';
import { CreateRideRatingInput, RideRating } from '@/features/rides/types/rating';

export type Unsubscribe = () => void;

export type RideRepository = {
  createRide(input: CreateRideInput): Promise<Ride>;
  subscribeToRide(rideId: string, listener: (ride: Ride | null) => void): Unsubscribe;
  subscribeToCurrentRiderRide(riderId: string, listener: (ride: Ride | null) => void): Unsubscribe;
  subscribeToPendingRide(driverId: string, listener: (ride: Ride | null) => void): Unsubscribe;
  subscribeToDriverRide(driverId: string, listener: (ride: Ride | null) => void): Unsubscribe;
  listRideHistory(riderId: string): Promise<Ride[]>;
  listDriverRideHistory(driverId: string): Promise<Ride[]>;
  getRideRating(rideId: string, riderId: string): Promise<RideRating | null>;
  submitRideRating(input: CreateRideRatingInput): Promise<RideRating>;
  acceptRide(rideId: string, driver: Driver): Promise<Ride>;
  declineRide(rideId: string, driverId: string): Promise<Ride>;
  cancelRide(rideId: string, cancelledBy: CancellationActor, reason: CancellationReason): Promise<Ride>;
  updateRideStatus(rideId: string, status: RideStatus): Promise<Ride>;
};
