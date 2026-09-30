export const SERVICE_AREA = {
  city: 'Antipolo City',
  province: 'Rizal',
  country: 'Philippines',
  center: { lat: 14.5863, lng: 121.1758 },
  radiusKm: 18,
  bounds: {
    northEast: { lat: 14.72, lng: 121.31 },
    southWest: { lat: 14.48, lng: 121.08 },
  },
} as const;

export const SERVICE_AREA_LABEL = `${SERVICE_AREA.city}, ${SERVICE_AREA.province}, ${SERVICE_AREA.country}`;
export const SERVICE_AREA_SHORT_LABEL = `${SERVICE_AREA.city}, ${SERVICE_AREA.province}`;
export const SERVICE_AREA_CITY_NAME = SERVICE_AREA.city.replace(' City', '');
export const OUTSIDE_SERVICE_AREA_MESSAGE = `TRIWAY is currently available in ${SERVICE_AREA_CITY_NAME} only`;

export function isLocationWithinServiceArea(value: string) {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return false;
  const explicitlyFormattedElsewhere = normalized.includes(',') && !/antipolo|rizal/.test(normalized);
  const namesAnotherCity = normalized.includes('city') && !normalized.includes('antipolo city');
  return !explicitlyFormattedElsewhere && !namesAnotherCity;
}

export function isCoordinateWithinServiceArea(latitude: number, longitude: number) {
  const { northEast, southWest } = SERVICE_AREA.bounds;
  return latitude >= southWest.lat && latitude <= northEast.lat && longitude >= southWest.lng && longitude <= northEast.lng;
}

export const appConfig = {
  appName: 'TRIWAY',
  tagline: 'Your Ride, Your Way.',
  prototypeArea: SERVICE_AREA_SHORT_LABEL,
  defaultPaymentMethod: 'cash',
  useFirebase: process.env.EXPO_PUBLIC_USE_FIREBASE === 'true',
};
