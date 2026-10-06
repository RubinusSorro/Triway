import { CreateRideInput, Driver, Ride, RideStatus } from '@/features/rides/types/ride';
import { RideRepository, Unsubscribe } from '@/features/rides/services/rideRepository';

type Listener = () => void;

const rides = new Map<string, Ride>();
const listeners = new Set<Listener>();

function makeId() {
  return `ride-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(selector: () => Ride | null, listener: (ride: Ride | null) => void): Unsubscribe {
  const notify = () => listener(selector());
  listeners.add(notify);
  notify();

  return () => {
    listeners.delete(notify);
  };
}

function getRideOrThrow(rideId: string) {
  const ride = rides.get(rideId);

  if (!ride) {
    throw new Error('Ride not found');
  }

  return ride;
}

export const demoDriver: Driver = {
  id: 'driver-profile-001',
  userId: 'demo-driver-001',
  name: 'Kuya Jun Santos',
  vehicle: 'Green tricycle',
  plateNumber: 'TWY 248',
  isOnline: true,
};

export const mockRideRepository: RideRepository = {
  async createRide(input: CreateRideInput) {
    const ride: Ride = {
      id: makeId(),
      ...input,
      status: 'requested',
      createdAt: new Date().toISOString(),
    };

    rides.set(ride.id, ride);
    emit();
    return ride;
  },

  subscribeToRide(rideId, listener) {
    return subscribe(() => rides.get(rideId) ?? null, listener);
  },

  subscribeToCurrentRiderRide(riderId, listener) {
    return subscribe(() => {
      const active = [...rides.values()]
        .filter((ride) => ride.riderId === riderId && ride.status !== 'completed' && ride.status !== 'cancelled')
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

      return active[0] ?? null;
    }, listener);
  },

  subscribeToPendingRide(listener) {
    return subscribe(() => {
      const pending = [...rides.values()]
        .filter((ride) => ride.status === 'requested')
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

      return pending[0] ?? null;
    }, listener);
  },

  subscribeToDriverRide(driverId, listener) {
    return subscribe(() => {
      const active = [...rides.values()]
        .filter((ride) => ride.driverId === driverId && ride.status !== 'completed' && ride.status !== 'cancelled')
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

      return active[0] ?? null;
    }, listener);
  },

  async listRideHistory(riderId) {
    return [...rides.values()]
      .filter((ride) => ride.riderId === riderId && ride.status === 'completed')
      .sort((a, b) => (b.completedAt ?? b.createdAt).localeCompare(a.completedAt ?? a.createdAt));
  },

  async listDriverRideHistory(driverId) {
    return [...rides.values()]
      .filter((ride) => ride.driverId === driverId && (ride.status === 'completed' || ride.status === 'cancelled'))
      .sort((a, b) => (b.completedAt ?? b.createdAt).localeCompare(a.completedAt ?? a.createdAt));
  },

  async acceptRide(rideId, driver) {
    const ride = getRideOrThrow(rideId);
    const updated: Ride = {
      ...ride,
      driverId: driver.id,
      driver,
      status: 'accepted',
      acceptedAt: new Date().toISOString(),
    };

    rides.set(rideId, updated);
    emit();
    return updated;
  },

  async updateRideStatus(rideId, status) {
    const ride = getRideOrThrow(rideId);
    const updated: Ride = {
      ...ride,
      status,
      completedAt: status === 'completed' ? new Date().toISOString() : ride.completedAt,
    };

    rides.set(rideId, updated);
    emit();
    return updated;
  },
};
