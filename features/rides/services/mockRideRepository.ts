import { CancellationActor, CancellationReason, CreateRideInput, Driver, Ride, RideStatus } from '@/features/rides/types/ride';
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

function historyTimestamp(ride: Ride) {
  return ride.completedAt ?? ride.cancelledAt ?? ride.createdAt;
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
      currentLeg: input.isReturnRide ? 'outbound' : undefined,
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
        .filter((ride) => ride.riderId === riderId && ride.status !== 'completed')
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

      return active[0] ?? null;
    }, listener);
  },

  subscribeToPendingRide(driverId, listener) {
    return subscribe(() => {
      const pending = [...rides.values()]
        .filter((ride) => ride.status === 'requested' && !ride.declinedDriverIds?.includes(driverId) && (!ride.preferredDriverId || ride.preferredDriverId === driverId))
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
      .filter((ride) => ride.riderId === riderId && (ride.status === 'completed' || ride.status === 'cancelled'))
      .sort((a, b) => historyTimestamp(b).localeCompare(historyTimestamp(a)));
  },

  async listDriverRideHistory(driverId) {
    return [...rides.values()]
      .filter((ride) => (ride.driverId === driverId || ride.preferredDriverId === driverId || ride.declinedDriverIds?.includes(driverId)) && (ride.status === 'completed' || ride.status === 'cancelled'))
      .sort((a, b) => historyTimestamp(b).localeCompare(historyTimestamp(a)));
  },

  async acceptRide(rideId, driver) {
    const ride = getRideOrThrow(rideId);
    if (ride.preferredDriverId && ride.preferredDriverId !== driver.id) {
      throw new Error('Ride was requested for another driver');
    }
    if (ride.declinedDriverIds?.includes(driver.id)) {
      throw new Error('Driver has already declined this ride');
    }
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

  async declineRide(rideId, driverId) {
    const ride = getRideOrThrow(rideId);
    if (ride.status !== 'requested' || ride.preferredDriverId !== driverId) {
      throw new Error('Ride cannot be declined by this driver');
    }

    const updated: Ride = {
      ...ride,
      preferredDriverId: undefined,
      preferredDriverDeclined: true,
      declinedDriverIds: [...(ride.declinedDriverIds ?? []), driverId],
    };

    rides.set(rideId, updated);
    emit();
    return updated;
  },

  async cancelRide(rideId: string, cancelledBy: CancellationActor, reason: CancellationReason) {
    const ride = getRideOrThrow(rideId);
    const riderCanCancel = cancelledBy === 'rider' && (ride.status === 'requested' || ride.status === 'accepted' || ride.status === 'arriving' || ride.status === 'waiting_return');
    const driverCanCancel = cancelledBy === 'driver' && ((ride.status === 'requested' && ride.isReturnRide) || ride.status === 'accepted' || ride.status === 'arriving' || ride.status === 'waiting_return');
    if (!riderCanCancel && !driverCanCancel) {
      throw new Error('Ride can no longer be cancelled');
    }

    const updated: Ride = {
      ...ride,
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
      cancelledBy,
      cancellationReason: reason,
    };

    rides.set(rideId, updated);
    emit();
    return updated;
  },

  async updateRideStatus(rideId, status) {
    const ride = getRideOrThrow(rideId);
    if (status === 'completed' && ride.isReturnRide && ride.currentLeg !== 'return') {
      throw new Error('Quick Return must complete its return leg first');
    }

    const now = new Date().toISOString();
    const updated: Ride = {
      ...ride,
      status,
      currentLeg: ride.isReturnRide && status === 'accepted' && ride.status === 'waiting_return' ? 'return' : ride.currentLeg,
      outboundCompletedAt: status === 'waiting_return' ? now : ride.outboundCompletedAt,
      returnStartedAt: ride.isReturnRide && status === 'accepted' && ride.status === 'waiting_return' ? now : ride.returnStartedAt,
      completedAt: status === 'completed' ? now : ride.completedAt,
      fare: status === 'completed' && ride.isReturnRide ? ride.totalFare ?? ride.fare : ride.fare,
    };

    rides.set(rideId, updated);
    emit();
    return updated;
  },
};
