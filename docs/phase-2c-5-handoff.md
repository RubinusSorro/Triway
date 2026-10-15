# Phase 2C-5 Handoff — Rider Profile, Settings, and Demo Entry

## Implemented

- Rebuilt Rider Profile with an initials avatar, current in-memory demo Rider name and email, and explicit prototype-session wording.
- Added meaningful Profile actions: **My Trips** opens existing Rider history, and **Settings** opens the new secondary Rider route.
- Added Rider Settings with a session-only Ride updates toggle, informational location-access copy, verified prototype information, and confirmation-backed session ending.
- Removed Rider Profile links to Driver switching and future pass purchasing.
- Fresh sessions now route from Splash directly to the existing Rider/Driver role-selection screen.
- An active in-memory session continues to its existing Rider or Driver home screen after Splash.
- Rider session ending calls the existing auth-service sign-out only, then returns to role selection. Driver sign-out destinations now also return to role selection.

## Navigation

- Rider still has exactly four bottom-navigation tabs: Home, Routes, Trips, and Profile.
- Settings is registered as a hidden secondary Rider route. Its bottom navigation is intentionally hidden, and the standard back control returns to Profile.
- Role-selection reuse is unchanged: selecting a role invokes the existing Continue As behavior and opens the matching role home screen.

## Session and data safety

- Ride updates are held in a Rider-scoped React context. They survive Rider-screen navigation during the mounted demo session and reset when the Rider navigation tree unmounts.
- No AsyncStorage, backend persistence, notification service, device-location request, Supabase, Maps integration, or push permission was introduced.
- The existing auth service only clears its in-memory user. It does not mutate ride records, fares, statuses, ratings, or the booking repository.

## Files

Created:

- app/(rider)/settings.tsx
- hooks/useRiderPreferences.tsx

Modified:

- app/index.tsx
- app/(rider)/_layout.tsx
- app/(rider)/account.tsx
- app/(driver)/index.tsx
- app/(driver)/profile.tsx

## Validation

- npx expo lint passed.
- npx tsc --noEmit passed.
- Source-level inspection confirms Settings is not a tab; no booking, repository, fare, lifecycle, receipt, rating, or history implementation was changed.

## Physical-device QA checklist

- [ ] Fresh launch reaches role selection after Splash.
- [ ] Rider and Driver selection enter their existing respective demo flows.
- [ ] Active demo session resumes the correct role home screen after Splash.
- [ ] Rider Profile shows demo name, email, and initials avatar correctly.
- [ ] Profile → Settings and Android/iOS back → Profile work correctly.
- [ ] Ride updates toggles and remains selected after navigating around Rider tabs.
- [ ] Settings is not displayed as a fifth tab.
- [ ] End Demo Session confirmation dismisses correctly and returns to role selection without changing an active ride.
- [ ] Home, Routes, Trips, receipt, rating, and active-ride navigation remain usable.
- [ ] Driver navigation and sign-out remain usable.

## Backend handoff notes and limitations

- Demo identity and session state are in-memory only. Supabase Auth should replace the auth-service implementation while preserving the role-selection decision point and role-aware destination mapping.
- Ride updates is presentation-only session state. A future backend can replace it with authenticated preferences and real notification consent after the required product and platform work is approved.
- Device location and live tracking remain deliberately unimplemented.
- Physical iPhone validation remains outstanding for this phase.
