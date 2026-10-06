import { CreateRideInput, Driver, RideStatus } from '@/features/rides/types/ride';
import { RideRepository } from '@/features/rides/services/rideRepository';

export const firebaseRideRepository: RideRepository = {
  async createRide(_input: CreateRideInput) {
    throw new Error('Firebase ride repository is not configured for this demo build.');
  },

  subscribeToRide(_rideId, listener) {
    listener(null);
    return () => undefined;
  },

  subscribeToCurrentRiderRide(_riderId, listener) {
    listener(null);
    return () => undefined;
  },

  subscribeToPendingRide(listener) {
    listener(null);
    return () => undefined;
  },

  subscribeToDriverRide(_driverId, listener) {
    listener(null);
    return () => undefined;
  },

  async listRideHistory(_riderId) {
    return [];
  },

  async listDriverRideHistory(_driverId) {
    return [];
  },

  async acceptRide(_rideId: string, _driver: Driver) {
    throw new Error('Firebase ride repository is not configured for this demo build.');
  },

  async updateRideStatus(_rideId: string, _status: RideStatus) {
    throw new Error('Firebase ride repository is not configured for this demo build.');
  },
};
