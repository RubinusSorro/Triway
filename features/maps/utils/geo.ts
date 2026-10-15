import { LatLng } from '../types';

const R = 6371;
const rad = (d: number) => (d * Math.PI) / 180;

export function haversineKm(a: LatLng, b: LatLng) {
  const dLat = rad(b.latitude - a.latitude);
  const dLon = rad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export type Measured = { points: LatLng[]; cumKm: number[]; totalKm: number };

export function measure(points: LatLng[]): Measured {
  const cumKm = [0];
  for (let i = 1; i < points.length; i++) cumKm.push(cumKm[i - 1] + haversineKm(points[i - 1], points[i]));
  return { points, cumKm, totalKm: cumKm[cumKm.length - 1] ?? 0 };
}

// Point at `progress` (0 to 1) of the distance along the path, interpolated smoothly.
export function pointAt(m: Measured, progress: number): LatLng | undefined {
  const { points, cumKm, totalKm } = m;
  if (points.length === 0) return undefined;
  if (points.length === 1 || totalKm === 0) return points[0];
  const target = Math.min(Math.max(progress, 0), 1) * totalKm;
  let i = 1;
  while (i < cumKm.length - 1 && cumKm[i] < target) i++;
  const segment = cumKm[i] - cumKm[i - 1] || 1;
  const t = (target - cumKm[i - 1]) / segment;
  const a = points[i - 1];
  const b = points[i];
  return {
    latitude: a.latitude + (b.latitude - a.latitude) * t,
    longitude: a.longitude + (b.longitude - a.longitude) * t,
  };
}
