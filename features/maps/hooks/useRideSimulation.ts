import { useEffect, useMemo, useState } from 'react';

import { fallbackRoutes } from '@/data/routes';
import { Ride } from '@/features/rides/types/ride';
import { getRideLeg } from '@/features/rides/utils/rideLeg';
import { APPROACH_DEMO_SECONDS, DEMO_SPEED_KMH, TRIP_DEMO_SECONDS } from '../constants';
import { LatLng } from '../types';
import { measure, pointAt } from '../utils/geo';
import { getApproachPoints, getRoutePoints } from '../utils/routePath';
import { fetchOsrmRoute, resolveCoordinates } from '../services/osrmRouting';
import { useSimulatedProgress } from './useSimulatedProgress';

export type SimulationPhase = 'approach' | 'trip' | 'idle';

export type RideSimulation = {
  phase: SimulationPhase;
  tripPoints: LatLng[];
  approachPoints: LatLng[];
  driver?: LatLng;
  etaMinutes: number | null;
  headline: string;
  subline: string;
};

const kmToMinutes = (km: number) => (km / DEMO_SPEED_KMH) * 60;
const remaining = (totalMinutes: number, progress: number) => Math.max(0, Math.ceil(totalMinutes * (1 - progress)));

export function useRideSimulation(ride: Ride): RideSimulation {
  const leg = getRideLeg(ride);
  const isReturnLeg = Boolean(leg.isReturnLeg);

  const precompiledTrip = useMemo(
    () => getRoutePoints(ride.routeId, isReturnLeg),
    [ride.routeId, isReturnLeg],
  );
  const precompiledApproach = useMemo(
    () => (isReturnLeg ? [] : getApproachPoints(ride.routeId)),
    [ride.routeId, isReturnLeg],
  );

  const [tripPoints, setTripPoints] = useState<LatLng[]>(precompiledTrip);
  const [approachPoints, setApproachPoints] = useState<LatLng[]>(precompiledApproach);

  // Sync state if precompiled points exist or change
  useEffect(() => {
    if (precompiledTrip.length > 1) {
      setTripPoints(precompiledTrip);
      setApproachPoints(precompiledApproach);
      return;
    }

    // Dynamic OSRM route fetch for custom trips & non-precompiled routes
    let active = true;
    const controller = new AbortController();

    async function loadDynamicPath() {
      try {
        const pickup = ride.pickupCoords || (await resolveCoordinates(leg.pickup, controller.signal));
        const destination = ride.destinationCoords || (await resolveCoordinates(leg.destination, controller.signal));

        if (!active || !pickup || !destination) return;

        const startPoint = isReturnLeg ? destination : pickup;
        const endPoint = isReturnLeg ? pickup : destination;

        // Fetch primary trip route from OSRM
        const tripResult = await fetchOsrmRoute(startPoint, endPoint, controller.signal);
        if (!active) return;

        if (tripResult && tripResult.points.length > 1) {
          setTripPoints(tripResult.points);

          // If outbound leg, synthesize driver approach route (~500m away on road network)
          if (!isReturnLeg) {
            const approachOrigin: LatLng = {
              latitude: startPoint.latitude + 0.0035,
              longitude: startPoint.longitude - 0.0035,
            };
            const approachResult = await fetchOsrmRoute(approachOrigin, startPoint, controller.signal);
            if (active && approachResult && approachResult.points.length > 1) {
              setApproachPoints(approachResult.points);
            } else if (active) {
              setApproachPoints([approachOrigin, startPoint]);
            }
          }
        } else if (active) {
          // Fallback straight-line road endpoints to avoid blank/unrouted view
          setTripPoints([startPoint, endPoint]);
        }
      } catch (err: any) {
        if (!controller.signal.aborted) {
          console.warn('[useRideSimulation] Dynamic routing failed:', err?.message || err);
        }
      }
    }

    loadDynamicPath();

    return () => {
      active = false;
      controller.abort();
    };
  }, [
    ride.routeId,
    ride.pickupCoords,
    ride.destinationCoords,
    leg.pickup,
    leg.destination,
    isReturnLeg,
    precompiledTrip,
    precompiledApproach,
  ]);

  const trip = useMemo(() => measure(tripPoints), [tripPoints]);
  const approach = useMemo(() => measure(approachPoints), [approachPoints]);

  const phase: SimulationPhase =
    ride.status === 'arriving' && approach.points.length > 1 ? 'approach'
    : ride.status === 'ongoing' && trip.points.length > 1 ? 'trip'
    : 'idle';

  const progress = useSimulatedProgress(
    phase !== 'idle',
    (phase === 'approach' ? APPROACH_DEMO_SECONDS : TRIP_DEMO_SECONDS) * 1000,
    `${ride.id}:${ride.status}:${isReturnLeg}`,
  );

  // Trip ETA matches the route card when the fixture has etaMinutes.
  const fixtureMinutes = fallbackRoutes.find((r) => r.id === ride.routeId)?.etaMinutes;
  const tripTotalMinutes = fixtureMinutes ?? kmToMinutes(trip.totalKm);
  const approachTotalMinutes = kmToMinutes(approach.totalKm);

  let driver: LatLng | undefined;
  if (phase === 'approach') driver = pointAt(approach, progress);
  else if (phase === 'trip') driver = pointAt(trip, progress);
  else if (ride.status === 'completed' || (ride.status as string) === 'waiting_return') driver = trip.points[trip.points.length - 1];
  else driver = trip.points[0];

  let etaMinutes: number | null = null;
  let headline = 'Driver on the way';
  let subline = 'Demo estimate; not live GPS.';

  if (phase === 'approach') {
    etaMinutes = remaining(approachTotalMinutes, progress);
    headline = progress >= 1 ? 'Driver has arrived at pickup' : `Driver arrives in about ${Math.max(1, etaMinutes)} min`;
    subline = `${(approach.totalKm * (1 - progress)).toFixed(1)} km to pickup · demo speed, not live GPS`;
  } else if (phase === 'trip') {
    etaMinutes = remaining(tripTotalMinutes, progress);
    headline = progress >= 1 ? 'You have reached the drop-off' : `Arriving at drop-off in about ${Math.max(1, etaMinutes)} min`;
    subline = `${(trip.totalKm * (1 - progress)).toFixed(1)} km to go · demo speed, not live GPS`;
  } else if (ride.status === 'arriving') {
    headline = 'Driver is arriving';
    subline = 'Demo estimate; not live GPS.';
  }

  return { phase, tripPoints: trip.points, approachPoints: approach.points, driver, etaMinutes, headline, subline };
}
