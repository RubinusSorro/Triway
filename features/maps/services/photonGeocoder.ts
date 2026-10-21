import { SERVICE_AREA } from '@/constants/config';

export type PlaceResult = {
  id: string;
  name: string;
  subtitle: string;
  latitude: number;
  longitude: number;
};

const BBOX = `${SERVICE_AREA.bounds.southWest.lng},${SERVICE_AREA.bounds.southWest.lat},${SERVICE_AREA.bounds.northEast.lng},${SERVICE_AREA.bounds.northEast.lat}`;
const CENTER_LAT = SERVICE_AREA.center.lat;
const CENTER_LNG = SERVICE_AREA.center.lng;

export async function searchPlaces(query: string, signal?: AbortSignal, minChars: number = 3): Promise<PlaceResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < minChars) return [];

  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(trimmed)}&bbox=${BBOX}&lat=${CENTER_LAT}&lon=${CENTER_LNG}&lang=en&limit=8`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Triway/1.0 (Ride Booking Prototype)',
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Photon search failed: ${response.statusText}`);
  }

  const data = await response.json();
  const features = data.features ?? [];

  return features.map((f: any, index: number) => {
    const [lon, lat] = f.geometry.coordinates;
    const p = f.properties || {};

    const name = p.name || p.street || p.locality || 'Unknown place';
    const subtitleParts = [
      p.street && p.name !== p.street ? p.street : undefined,
      p.locality,
      p.city,
      p.state,
    ].filter(Boolean);

    const subtitle = subtitleParts.length > 0 ? subtitleParts.join(', ') : 'Antipolo, Rizal';

    return {
      id: p.osm_id != null ? `${p.osm_type || 'osm'}-${p.osm_id}` : `place-${lat}-${lon}-${index}`,
      name,
      subtitle,
      latitude: lat,
      longitude: lon,
    };
  });
}
