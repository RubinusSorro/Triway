import { approachPaths, routePaths } from '@/data/routePaths';
import { LatLng } from '../types';
import { decodePolyline } from './polyline';

export function getRoutePoints(routeId: string, isReturnLeg?: boolean): LatLng[] {
  const encoded = routePaths[routeId];
  if (!encoded) return [];
  const points = decodePolyline(encoded);
  return isReturnLeg ? [...points].reverse() : points;
}

export function getApproachPoints(routeId: string): LatLng[] {
  const encoded = approachPaths[routeId];
  return encoded ? decodePolyline(encoded) : [];
}
