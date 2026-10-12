# TRIWAY Phase 2C-2: Rider Booking and Fare Review

## Booking draft

`features/rides/utils/bookingDraft.ts` holds the temporary Rider configuration contract. The draft contains only a selected route ID, pickup, destination, trip type, and the existing fixed cash method. It is serialized through Expo Router parameters between Booking and Review; it does not create a ride, write to the repository, or add global state.

Review re-parses the draft and re-fetches the selected fixture route. Invalid, missing, out-of-service-area, or no-longer Quick Return-eligible drafts cannot be confirmed and return the Rider to route selection.

## Fare integrity

Booking and Review derive all displayed fare and distance values from the selected `TriwayRoute`. Review passes those same values through the existing `useCreateRide` path:

- One Way: `fare` is the route `baseFare`.
- Quick Return: `fare`, `outboundFare`, and `returnFare` remain the route `baseFare`; `totalFare` is two route fares; the existing `isReturnRide` flag preserves one booking identity.

No UI component owns an independent fare formula beyond presenting the already-established Quick Return total.

## Confirmation and recovery

Opening Review is read-only. The first confirmation presents `TriwayDialog`; the modal action is the sole call site for `useCreateRide` in this Rider booking flow. A local ref blocks rapid repeated confirmation calls, and the dialog button enters its loading state during submission. A failed creation keeps the draft intact and presents a recoverable error dialog.

## Scope boundary

This phase adds only the Rider Booking-to-Review flow and a focused reusable dialog. It does not change the ride repository, lifecycle rules, Driver flow, backend integration, navigation tabs, or later Rider lifecycle stages.
