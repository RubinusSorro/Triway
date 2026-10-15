import { Ride } from '@/features/rides/types/ride';

export function getRideLeg(ride: Ride) {
  const isReturnLeg = ride.isReturnRide && ride.currentLeg === 'return';
  return {
    pickup: isReturnLeg ? ride.destination : ride.pickup,
    destination: isReturnLeg ? ride.pickup : ride.destination,
    fare: isReturnLeg ? ride.returnFare ?? ride.fare : ride.outboundFare ?? ride.fare,
    isReturnLeg,
  };
}