import { PaymentMethod } from '@/types/common';

export type BookingTripType = 'one_way' | 'quick_return';

export type BookingDraft = {
  routeId: string;
  pickup: string;
  destination: string;
  tripType: BookingTripType;
  paymentMethod: PaymentMethod;
  pickupLat?: number;
  pickupLng?: number;
  destLat?: number;
  destLng?: number;
};

type BookingDraftParams = {
  routeId?: string | string[];
  pickup?: string | string[];
  destination?: string | string[];
  tripType?: string | string[];
  pickupLat?: string | string[];
  pickupLng?: string | string[];
  destLat?: string | string[];
  destLng?: string | string[];
};

function getSingleValue(value: string | string[] | undefined) {
  return typeof value === 'string' ? value.trim() : '';
}

function parseNumber(value: string | string[] | undefined): number | undefined {
  const str = getSingleValue(value);
  if (!str) return undefined;
  const num = Number(str);
  return Number.isFinite(num) ? num : undefined;
}

export function parseBookingDraft(params: BookingDraftParams): BookingDraft | null {
  const routeId = getSingleValue(params.routeId);
  const pickup = getSingleValue(params.pickup);
  const destination = getSingleValue(params.destination);
  const tripType = getSingleValue(params.tripType);
  const pickupLat = parseNumber(params.pickupLat);
  const pickupLng = parseNumber(params.pickupLng);
  const destLat = parseNumber(params.destLat);
  const destLng = parseNumber(params.destLng);

  if (!routeId || !pickup || !destination || (tripType !== 'one_way' && tripType !== 'quick_return')) {
    return null;
  }

  return {
    routeId,
    pickup,
    destination,
    tripType,
    paymentMethod: 'cash',
    pickupLat,
    pickupLng,
    destLat,
    destLng,
  };
}

export function toBookingDraftParams(draft: BookingDraft) {
  return {
    routeId: draft.routeId,
    pickup: draft.pickup,
    destination: draft.destination,
    tripType: draft.tripType,
    ...(draft.pickupLat != null ? { pickupLat: draft.pickupLat.toString() } : {}),
    ...(draft.pickupLng != null ? { pickupLng: draft.pickupLng.toString() } : {}),
    ...(draft.destLat != null ? { destLat: draft.destLat.toString() } : {}),
    ...(draft.destLng != null ? { destLng: draft.destLng.toString() } : {}),
  };
}
