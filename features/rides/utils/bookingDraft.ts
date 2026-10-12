import { PaymentMethod } from '@/types/common';

export type BookingTripType = 'one_way' | 'quick_return';

export type BookingDraft = {
  routeId: string;
  pickup: string;
  destination: string;
  tripType: BookingTripType;
  paymentMethod: PaymentMethod;
};

type BookingDraftParams = {
  routeId?: string | string[];
  pickup?: string | string[];
  destination?: string | string[];
  tripType?: string | string[];
};

function getSingleValue(value: string | string[] | undefined) {
  return typeof value === 'string' ? value.trim() : '';
}

export function parseBookingDraft(params: BookingDraftParams): BookingDraft | null {
  const routeId = getSingleValue(params.routeId);
  const pickup = getSingleValue(params.pickup);
  const destination = getSingleValue(params.destination);
  const tripType = getSingleValue(params.tripType);

  if (!routeId || !pickup || !destination || (tripType !== 'one_way' && tripType !== 'quick_return')) {
    return null;
  }

  return { routeId, pickup, destination, tripType, paymentMethod: 'cash' };
}

export function toBookingDraftParams(draft: BookingDraft) {
  return {
    routeId: draft.routeId,
    pickup: draft.pickup,
    destination: draft.destination,
    tripType: draft.tripType,
  };
}
