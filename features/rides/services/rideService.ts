import { appConfig } from '@/constants/config';
import { firebaseRideRepository } from '@/features/rides/services/firebaseRideRepository';
import { mockRideRepository } from '@/features/rides/services/mockRideRepository';
import { RideRepository } from '@/features/rides/services/rideRepository';

export const rideRepository: RideRepository = appConfig.useFirebase ? firebaseRideRepository : mockRideRepository;

export const rideService = {
  createRide: rideRepository.createRide,
  subscribeToRide: rideRepository.subscribeToRide,
  subscribeToCurrentRiderRide: rideRepository.subscribeToCurrentRiderRide,
  subscribeToPendingRide: rideRepository.subscribeToPendingRide,
  subscribeToDriverRide: rideRepository.subscribeToDriverRide,
  listRideHistory: rideRepository.listRideHistory,
  acceptRide: rideRepository.acceptRide,
  updateRideStatus: rideRepository.updateRideStatus,
};
