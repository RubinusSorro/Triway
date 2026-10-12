# TRIWAY Phase 2C-4: Completion, Receipt, Rating, History, and Branding

## Completed rides and navigation

Completed rides remain readable by `rideId` through the established `subscribeToRide` repository method. Rider lifecycle screens retain only the last active ride ID long enough to navigate to `/(rider)/completed`; the completed screen then performs its own read-only lookup. No second ride store is created.

## Rating prototype behavior

The in-memory repository now holds one `RideRating` per completed ride ID. Submission validates that the ride is completed and belongs to the Rider, and rejects duplicate ratings. Ratings are available during the current running demo session only; they are not persistent across an app restart and will be replaced by backend storage in Phase 3.

## Fare and payment presentation

Receipt and completion screens display existing route, pickup, destination, cash, completion time, and fare fields only. Quick Return shows existing outbound and return amounts plus the stored total. Cash confirmation remains simulated; no payment state or fare formula changed.

## Branding configuration

`app.json` now uses the unmodified official `assets/images/TRIWAY.png` for Expo icon, Android adaptive-icon foreground, splash image, and web favicon, with Android adaptive background `#064E3B`. Expo Go can retain its own launcher icon; a native Android build is required to verify the installed TRIWAY icon and adaptive-mask appearance.

## Corrective pass findings

### Rating

The success dialog originally navigated to Trips without clearing its controlled `visible` state. Rating now requests dialog dismissal first, then performs the navigation from the resulting post-dismissal render. The rating screen body is independently scrollable above its tab-safe action area.

Rating lookup now ignores stale asynchronous reads, so an earlier empty lookup cannot overwrite a newly submitted result. The rating repository additionally verifies the completed ride's Rider and Driver association before accepting the one allowed rating for that ride. Returning to Rating reads and presents the stored session rating as read-only.

### Quick Return and booking confirmation

Source review confirmed the existing authoritative Quick Return guard rejects `completed` until `currentLeg` is `return`; the outbound leg transitions to `waiting_return`, and the same ride becomes the return leg on the established `accepted` transition. Existing route fare, outbound fare, return fare, total fare, and booking ID remain unchanged throughout.

Review remains the sole Rider `createRide` call site. Its existing submission ref blocks rapid confirmation taps; the corrective pass also prevents confirmation while the Rider already has a non-cancelled active ride. Opening Booking, Review, or cancelling its confirmation dialog does not create a ride.
