import { SERVICE_AREA } from '@/constants/config';
import { LatLng } from '../types';
import { decodePolyline } from '../utils/polyline';
import { searchPlaces } from './photonGeocoder';

export type OsrmRouteResult = {
  points: LatLng[];
  distanceKm: number;
  durationMinutes: number;
};

export const KNOWN_ANTIPOLO_COORDINATES: Record<string, LatLng> = {
  'antipolo cathedral': { latitude: 14.58769, longitude: 121.17666 },
  'hinulugang taktak': { latitude: 14.59468, longitude: 121.16766 },
  'robinsons place antipolo': { latitude: 14.59563, longitude: 121.17314 },
  'robinsons antipolo': { latitude: 14.59563, longitude: 121.17314 },
  'ynares center': { latitude: 14.58549, longitude: 121.17058 },
  'antipolo city hall': { latitude: 14.58613, longitude: 121.16924 },
  'cogeo gate 2': { latitude: 14.6212, longitude: 121.1743 },
  'cogeo public market': { latitude: 14.6225, longitude: 121.177 },
  'masinag junction': { latitude: 14.6288, longitude: 121.1215 },
  'masinag': { latitude: 14.6288, longitude: 121.1215 },
  'sumulong highway': { latitude: 14.6065, longitude: 121.1554 },
  'dela paz': { latitude: 14.598, longitude: 121.178 },
  'marcos highway': { latitude: 14.625, longitude: 121.118 },
  'sta. lucia east grand mall': { latitude: 14.619, longitude: 121.1 },
  'sta lucia': { latitude: 14.619, longitude: 121.1 },
  'rizal provincial capitol': { latitude: 14.58613, longitude: 121.16924 },
  'san isidro barangay hall': { latitude: 14.59495, longitude: 121.18547 },
  'san isidro': { latitude: 14.59495, longitude: 121.18547 },
  'san jose': { latitude: 14.591, longitude: 121.181 },
};

const routeCache = new Map<string, OsrmRouteResult>();

/**
 * Fetch driving road path between two coordinates from public OSRM server.
 */
export async function fetchOsrmRoute(
  start: LatLng,
  end: LatLng,
  signal?: AbortSignal,
): Promise<OsrmRouteResult | null> {
  const cacheKey = `${start.longitude.toFixed(5)},${start.latitude.toFixed(5)};${end.longitude.toFixed(5)},${end.latitude.toFixed(5)}`;
  if (routeCache.has(cacheKey)) {
    return routeCache.get(cacheKey)!;
  }

  const url = `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=polyline`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Triway/1.0 (Ride Booking Prototype)',
      },
      signal,
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.code !== 'Ok' || !data.routes?.[0]?.geometry) {
      return null;
    }
    const route = data.routes[0];
    const points = decodePolyline(route.geometry);
    const result: OsrmRouteResult = {
      points,
      distanceKm: Number((route.distance / 1000).toFixed(2)),
      durationMinutes: Math.max(1, Math.round(route.duration / 60)),
    };
    routeCache.set(cacheKey, result);
    return result;
  } catch (err: any) {
    if (signal?.aborted || err?.name === 'AbortError') return null;
    console.warn('[osrmRouting] OSRM route fetch failed:', err?.message || err);
    return null;
  }
}

/**
 * Resolve any location name (fixture, landmark, or custom query) to LatLng coordinates.
 */
export async function resolveCoordinates(
  placeName: string,
  signal?: AbortSignal,
): Promise<LatLng> {
  const normalized = placeName.trim().toLowerCase();

  // 1. Direct match in known landmarks
  for (const [key, coords] of Object.entries(KNOWN_ANTIPOLO_COORDINATES)) {
    if (normalized === key || normalized.includes(key) || key.includes(normalized)) {
      return coords;
    }
  }

  // 2. Query Photon geocoder
  try {
    const results = await searchPlaces(placeName, signal, 1);
    if (results.length > 0) {
      return {
        latitude: results[0].latitude,
        longitude: results[0].longitude,
      };
    }
  } catch {
    // ignore network errors and fallback
  }

  // 3. Fallback to Antipolo city center
  return {
    latitude: SERVICE_AREA.center.lat,
    longitude: SERVICE_AREA.center.lng,
  };
}
