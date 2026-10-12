# TRIWAY — Phase 1 UI/UX Audit

**Audit date:** 8 October 2026  
**Scope:** Read-only review of the Expo Router application, route definitions, shared UI, design tokens, mock-flow state, and repository documentation. No application source or configuration was changed.

## 1. Executive Summary

Triway has a coherent prototype foundation: Expo Router route groups clearly separate Rider and Driver views, core controls use reusable primitives, and the local ride lifecycle is demonstrable in one app instance. Lint and TypeScript checks both pass.

The biggest risks are flow integrity rather than build stability. A rider can enter destinations and see suggested prices that are not tied to the route/fare ultimately booked; Driver offline state is not carried into request and ride screens; normal driver requests cannot be declined; and the tracker presents a return-only state as part of every trip. The supplied palette and dark-theme requirement are also not implemented as specified. Authentication, verification, real dispatch, GPS/maps, payments, and production persistence are intentionally absent from the MVP and must not be represented as working product functionality.

**Finding count:** 2 Critical, 6 High, 7 Medium, 3 Low.

## 2. Screen Inventory

| Screen / component | Role | Path | Navigation entry point | Status | Consistency / observed issue |
|---|---|---|---|---|---|
| Splash | Shared | `app/index.tsx` | App launch | Implemented prototype | Auto-advances after 1.6 seconds; no skip, reduced-motion, or initialization/error state. |
| Welcome | Auth | `app/(auth)/index.tsx` | Splash | Partial | Branded placeholder is explicitly marked TODO at line 17. |
| Role selection | Auth | `app/(auth)/role-selection.tsx` | Welcome | Prototype implemented | Creates local Rider/Driver identity; it is not login or registration. |
| Rider tabs layout | Rider | `app/(rider)/_layout.tsx` | Role selection / role switch | Implemented | Home, Rides, Book, Wallet, Account exposed; tracker/history/details hidden from tab bar. |
| Rider home | Rider | `app/(rider)/index.tsx` | Rider Home tab | Partial | Search has no connected value/change handler; copy says “Log in” despite local demo identity. |
| Route list | Rider | `app/(rider)/routes.tsx` | Rides tab, home search/filter, booking fallback | Prototype implemented | Displays local placeholder routes; no search/filtering or route-fare context in the rows. |
| Booking | Rider | `app/(rider)/booking.tsx` | Book tab / route selection | Partial | Location inputs, suggested places and fare selection are disconnected; no booking review. |
| Ride tracker | Rider | `app/(rider)/ride.tsx` | Booking / active-ride card | Prototype implemented | Uses simulated map and requires switching role to advance normal demo ride. |
| Ride history | Rider | `app/(rider)/history.tsx` | Details / history actions | Implemented prototype | Completed/cancelled only; no filter, date, receipt download, payment confirmation, or rating. |
| Ride details | Rider | `app/(rider)/details.tsx` | History item | Implemented prototype | Shared details view; completion metadata can read “Not available” for non-completed rides. |
| Passes / Wallet | Rider | `app/(rider)/passes.tsx` | Wallet tab | Placeholder | Pass data and price are TODO; tap only shows an alert. |
| Account | Rider | `app/(rider)/account.tsx` | Account tab | Partial | Role switch and sign-out only; not an account-management experience. |
| Driver tabs layout | Driver | `app/(driver)/_layout.tsx` | Role selection / role switch | Implemented | Home, Request, Ride exposed; history, completion and details hidden. |
| Driver home | Driver | `app/(driver)/index.tsx` | Driver Home tab | Prototype implemented | Availability toggle, request handoff, daily summary and role switch; availability state is screen-local. |
| Incoming request | Driver | `app/(driver)/request.tsx` | Request tab / Driver Home | Partial | Normal request has no decline action; screen forces online state. |
| Driver ride controls | Driver | `app/(driver)/ride.tsx` | Ride tab / accepted request | Prototype implemented | Controls local status state; forces online state and offers a role switch as a demo mechanism. |
| Completion / payment | Driver | `app/(driver)/completion.tsx` | Driver ride completion | Prototype implemented | Cash confirmation is local UI state only; no Rider completion counterpart. |
| Driver history | Driver | `app/(driver)/history.tsx` | Driver Home | Implemented prototype | Very similar to Rider history; includes completed and cancelled demo records. |
| Driver ride details | Driver | `app/(driver)/details.tsx` | Driver history item | Implemented prototype | Near-duplicate of Rider details route. |
| Root navigation | Shared | `app/_layout.tsx` | App root | Implemented | Safe-area and fonts set up; status bar is always dark. |
| `AppBottomNav` | Shared | `components/ui/AppBottomNav.tsx` | Rider/Driver layouts | Implemented | Good touch sizing; Driver has no history/profile tab. |
| `CancellationDialog` | Shared overlay | `components/ui/CancellationDialog.tsx` | Rider/Driver tracker and controls | Implemented | Modal lacks explicit safe-area/focus handling; needs device and screen-reader verification. |
| `RouteCard` | Shared route component | `features/routes/components/RouteCard.tsx` | None found | Orphaned | No import/use found in application routes. |
| `App.tsx` | Legacy entry component | `App.tsx` | None with `expo-router/entry` | Orphaned | Default Expo starter UI is unused but could confuse future maintainers. |

### Missing product screens / states

The following requested journey stages have no implemented screen or UI state: Rider registration/login/recovery, Rider payment selection/confirmation and rating, Driver registration, document verification, Driver profile/account, navigation handoff to pickup, real no-driver timeout/retry state, network-disconnected state, location-permission state, and live-map/location state. The README correctly identifies several of these as prototype limits.

## 3. UI/UX Findings

### Critical

#### UX-01 — Booking fare and destination can contradict one another

- **Screen:** Rider booking
- **Location:** `app/(rider)/booking.tsx:23-28, 39-40, 91-116`
- **Current behavior:** A suggested destination changes only `to`; it shows that location's estimated fare, while submit creates the ride with `selectedRoute.baseFare`. A rider can also edit both locations without selecting a route.
- **Expected behavior:** One authoritative selection must determine pickup, destination, route, trip eligibility, and displayed/charged fare; present a review before booking.
- **Impact:** A rider can book a route/fare that does not match the trip they believe they selected.
- **Recommendation:** Model a single quote/route-selection state, reset it when locations change, and add a review/confirm step with explicit cash total.
- **Verification:** Confirmed by code inspection.

#### UX-02 — Rider search appears usable but has no behavior

- **Screen:** Rider home
- **Location:** `app/(rider)/index.tsx:20`; `components/ui/SearchBar.tsx:7-21`
- **Current behavior:** Home supplies only `onFilterPress`; no `value` or `onChangeText` is supplied to the text input. The filter opens the unfiltered routes list.
- **Expected behavior:** Search input should filter/navigate with the entered query, or be removed/disabled with clear explanatory copy.
- **Impact:** Primary discovery control silently discards user input and undermines trust.
- **Recommendation:** Connect controlled query state to a filtered route/location result screen and define what the filter icon does.
- **Verification:** Confirmed by code inspection.

### High

#### UX-03 — Normal driver requests cannot be declined

- **Screen:** Driver request
- **Location:** `app/(driver)/request.tsx:33-40, 77-89`
- **Current behavior:** Decline is rendered only when `pendingRide.isReturnRide`; a normal booking has only “Accept ride.”
- **Expected behavior:** Every incoming request needs an available decline/no-response path with unambiguous Rider feedback.
- **Impact:** Drivers are forced into accepting a normal request or navigating away, leaving the Rider in an unresolved search state.
- **Recommendation:** Offer a reasoned decline flow for all requests and expose its resulting state in both role journeys.
- **Verification:** Confirmed by code inspection.

#### UX-04 — Offline availability does not persist between Driver screens

- **Screen:** Driver Home, Request, Ride
- **Location:** `app/(driver)/index.tsx:21-22, 51`; `app/(driver)/request.tsx:18-19`; `app/(driver)/ride.tsx:22-23`
- **Current behavior:** Home owns `isOnline`, but Request and Ride each initialize independent `true` state.
- **Expected behavior:** Availability must be a single driver-level state and request access must respect it.
- **Impact:** A Driver who goes offline can still receive/control rides by opening another tab.
- **Recommendation:** Store availability in driver/auth/domain state and gate request/ride entry consistently.
- **Verification:** Confirmed by code inspection.

#### UX-05 — Return-only step is shown on every trip tracker

- **Screen:** Rider tracker, Driver controls
- **Location:** `features/rides/components/RideStatusCard.tsx:33-50`; `features/rides/utils/rideStatus.ts:49`
- **Current behavior:** `rideStatusSteps` always includes `waiting_return`, including ordinary one-way rides.
- **Expected behavior:** One-way progress should end at completed; Quick Return should show a clearly distinct outbound/wait/return path.
- **Impact:** Riders and drivers see an irrelevant “Waiting for return” step and may misinterpret normal completion.
- **Recommendation:** Derive progress steps from `ride.isReturnRide` and current leg.
- **Verification:** Confirmed by code inspection.

#### UX-06 — Completion, payment confirmation, and rating are incomplete for Rider

- **Screen:** Rider tracker/history and Driver completion
- **Location:** `app/(rider)/ride.tsx:37-48, 114-124`; `app/(driver)/completion.tsx:17-54`
- **Current behavior:** Driver can locally confirm cash and return home. A completed ride disappears from Rider current ride and is only later visible in history; there is no receipt/completion, payment-confirmed state, or rating surface.
- **Expected behavior:** Rider receives a clear completed-trip acknowledgement, final fare/payment status, receipt access, and an intentionally scoped rating outcome if ratings are in product scope.
- **Impact:** Rider has no trustworthy end-of-trip feedback.
- **Recommendation:** Design a shared terminal state before implementation, including cash collection ownership and any rating decision.
- **Verification:** Confirmed by code inspection.

#### UX-07 — Dark-mode contract is nonfunctional

- **Screen/component:** Theme infrastructure / all screens
- **Location:** `constants/theme.ts:99-122`; `hooks/useAppTheme.tsx:14-21`; `app/_layout.tsx:23`
- **Current behavior:** The system dark scheme is detected, but `darkTheme` is exactly `lightTheme`; status bar is forced `dark`.
- **Expected behavior:** Either provide a coherent dark theme using approved dark tokens or explicitly ship a light-only interface and set platform appearance accordingly.
- **Impact:** Automatic appearance can yield an inconsistent status bar and fails the stated light/dark design requirement.
- **Recommendation:** Decide product support, then define semantic light/dark tokens and test both platforms.
- **Verification:** Confirmed by code inspection; visual outcome requires runtime verification.

#### UX-08 — Required authentication and Driver onboarding are only local role switching

- **Screen:** Auth/role selection, Driver flow
- **Location:** `app/(auth)/role-selection.tsx:12-38`; `features/auth/hooks/useAuth.tsx:6-28`; `README.md:88-107`
- **Current behavior:** “Log in” selects a local prototype identity. There are no credentials, registration, verification, document, recovery, or session-persistence screens.
- **Expected behavior:** Product decisions must either clearly label this as a demo mode or define real onboarding requirements before production-facing UI work.
- **Impact:** The current labels overstate account capability and the Driver journey cannot satisfy verification/onboarding requirements.
- **Recommendation:** Keep clear demo-mode copy now; obtain product requirements before adding auth/verification UI.
- **Verification:** Confirmed by code inspection and README documentation.

### Medium

#### UX-09 — Approved palette differs materially from the supplied reference

- **Screen/component:** Global design tokens
- **Location:** `constants/theme.ts:3-20`
- **Current behavior:** Primary is `#1F5C2E`, tint is `#E9F1E7`, text is `#111827`, and danger is `#B42318`; these differ from approved `#064E3B`, `#CFE5CF`, `#111111`, and `#C0392B`. No supplied secondary or dark-background semantic token exists.
- **Expected behavior:** The approved palette should be encoded as semantic tokens and used consistently.
- **Impact:** Screens will not match the agreed visual identity and future components lack reliable tokens.
- **Recommendation:** Replace after design sign-off in one token pass, not screen-by-screen.
- **Verification:** Confirmed by code inspection.

#### UX-10 — Information hierarchy and typography bypass the shared scale

- **Screen/component:** Driver home/history, ride UI, route card, empty state
- **Location:** `app/(driver)/index.tsx:128-208`; `app/(driver)/history.tsx:79-90`; `features/rides/components/RideDetails.tsx:83-92`; `features/rides/components/RideStatusCard.tsx:67-114`; `components/common/EmptyState.tsx:27-46`
- **Current behavior:** Many components hardcode font sizes/weights instead of `typography`, producing competing `800`, `900`, 17–22px title scales.
- **Expected behavior:** Shared title, section, body, caption and button styles should create consistent hierarchy and support future scaling.
- **Impact:** Visual rhythm differs across otherwise similar cards and screens.
- **Recommendation:** Create/extend semantic text roles and migrate in a later design-system phase.
- **Verification:** Confirmed by code inspection.

#### UX-11 — Placeholder and faux-action surfaces are exposed as active product UI

- **Screen/component:** Welcome, Wallet, Screen Header
- **Location:** `app/(auth)/index.tsx:17-21`; `app/(rider)/passes.tsx:37-49`; `components/ui/ScreenHeader.tsx:17-24`
- **Current behavior:** Welcome deliberately uses a placeholder, pass controls only show an alert, and Notifications/Settings show alert messages rather than destinations.
- **Expected behavior:** Unavailable features should be omitted, visibly marked as demo/coming soon, or given a dedicated static information screen.
- **Impact:** Tapping controls can feel broken or misleading.
- **Recommendation:** Establish a reusable non-interactive “prototype limitation” treatment and remove decorative action affordances until implemented.
- **Verification:** Confirmed by code inspection.

#### UX-12 — Service-area validation accepts arbitrary place names

- **Screen:** Rider booking
- **Location:** `constants/config.ts:18-24`; `app/(rider)/booking.tsx:30-37`
- **Current behavior:** Any non-empty string is accepted unless it includes a comma without Antipolo/Rizal or contains another city name.
- **Expected behavior:** A location must be selected from supported data or validated through an eventual geocoder and service-area bounds.
- **Impact:** Rider can “validate” locations outside/unknown to the stated operating area.
- **Recommendation:** Until mapping exists, restrict to verified sample locations and label free text as unavailable.
- **Verification:** Confirmed by code inspection.

#### UX-13 — Safe-area and accessibility handling needs runtime validation

- **Screen/component:** Generic screen, cancellation modal, tracker map
- **Location:** `components/layout/Screen.tsx:22-24`; `components/ui/CancellationDialog.tsx:40-70`; `features/rides/components/SimulatedMap.tsx:48-100`
- **Current behavior:** `Screen` omits the bottom safe-area edge; the modal does not use safe-area insets or focus management; map labels are two `flex: 1` texts without truncation rules.
- **Expected behavior:** Bottom sheets must clear gesture areas, modal focus should be announced/restored, and long labels should remain readable at larger text sizes.
- **Impact:** Controls may crowd device gesture areas or clip/overlap under text scaling.
- **Recommendation:** Test on small Android and iPhone devices, with large text and TalkBack/VoiceOver; then use safe-area-aware sheet layout and explicit accessibility props.
- **Verification:** Needs runtime verification.

#### UX-14 — Loading, no-driver, network, and permission state coverage is incomplete

- **Screen/component:** Rider tracker, ride hooks, simulated map
- **Location:** `app/(rider)/ride.tsx:29-35, 114-121`; `features/rides/components/SimulatedMap.tsx:22-44`; `README.md:88-107`
- **Current behavior:** Spinners exist for data hooks and empty states exist for missing rides, but there is no timeout/retry/no-available-driver state, network-offline UI, location permission UI, or map failure state.
- **Expected behavior:** The Rider should distinguish searching, unavailable, connection failure, and location-disabled states with recovery actions.
- **Impact:** A real user cannot tell whether waiting is normal, failed, or requires action.
- **Recommendation:** Define a state matrix before implementing live services; keep simulated-map language visible in demo mode.
- **Verification:** Confirmed absent in code; real-service behavior requires runtime/product verification.

#### UX-15 — Completion payment is local-only and can be lost or misrepresented

- **Screen:** Driver completion
- **Location:** `app/(driver)/completion.tsx:21, 52-53`
- **Current behavior:** `paymentConfirmed` is component-local state and does not update the ride; navigation/reload loses it.
- **Expected behavior:** Payment status must be modelled in ride data or clearly stated as a presentation-only acknowledgement.
- **Impact:** History/receipt cannot reliably communicate cash settlement.
- **Recommendation:** Add a payment-status domain decision only after product ownership and receipt requirements are agreed.
- **Verification:** Confirmed by code inspection.

### Low

#### UX-16 — “Ghost” button variant has no distinct visual treatment

- **Screen/component:** Shared buttons
- **Location:** `components/ui/AppButton.tsx:17-25, 30-37`
- **Current behavior:** Every non-danger variant, including `ghost`, receives `styles.secondary`.
- **Expected behavior:** The named visual hierarchy should match its implementation or use one variant name.
- **Impact:** Sign-out/action emphasis is inconsistent with the component API.
- **Recommendation:** Define a true low-emphasis ghost style in the design-system phase.
- **Verification:** Confirmed by code inspection.

#### UX-17 — Unused route card and legacy app root create component ambiguity

- **Screen/component:** Route card / app root
- **Location:** `features/routes/components/RouteCard.tsx:1-67`; `App.tsx:1-20`; `package.json:4`
- **Current behavior:** No in-project use of `RouteCard` was found. Expo Router entry bypasses the default starter `App.tsx`.
- **Expected behavior:** Active shared components and the effective app entry should be obvious.
- **Impact:** Future UI changes may target dead code or duplicate patterns.
- **Recommendation:** Decide whether to adopt `RouteCard` or remove it, and document/remove the legacy entry during a dedicated cleanup pass.
- **Verification:** Confirmed by static import search.

#### UX-18 — History/details are role-route duplicates

- **Screen/component:** Rider and Driver history/details
- **Location:** `app/(rider)/history.tsx:14-82`; `app/(driver)/history.tsx:22-92`; `app/(rider)/details.tsx:12-26`; `app/(driver)/details.tsx:12-26`
- **Current behavior:** Two nearly parallel route files repeat list/detail scaffolding with small role differences.
- **Expected behavior:** Role-specific data/copy should be supplied to reusable history/detail presentation components.
- **Impact:** UI fixes can drift between Rider and Driver views.
- **Recommendation:** Extract shared history list and route-level detail wrapper after flow decisions are stable.
- **Verification:** Confirmed by code inspection.

## 4. Navigation and User-Flow Analysis

### Rider

**Available journey:** Splash → Welcome → local role selection → Home/Rides/Book → route selection → booking → simulated tracker → manually switch to Driver → return to Rider → history/details. Quick Return adds a rider-controlled waiting/return transition.

**Breaks and gaps:**

- No actual login, registration, recovery, or persisted identity.
- Search and filter discovery are nonfunctional (UX-02).
- Booking needs one source of truth and a review step (UX-01).
- “Searching” has no defined timeout/no-driver recovery state (UX-14).
- Live location, driver arrival ETA, permission and network feedback are absent by design; simulated map should never be mistaken for live tracking.
- A completed trip has no Rider completion/payment/receipt/rating transition (UX-06).
- History supports only terminal rides and no filters or date grouping.

### Driver

**Available journey:** Local role selection → Driver Home → availability toggle → incoming request → accept → ride controls (arriving/start/complete) → local cash confirmation → Home/history/details.

**Breaks and gaps:**

- No registration, document verification, account/profile, or persistent availability.
- Offline state is not respected outside Home (UX-04).
- Normal requests cannot be declined (UX-03).
- “Navigation to pickup” is a simulated status button, not a navigation handoff or map journey.
- No passenger contact, arrival confirmation, no-show, support, connectivity, or payment-dispute states.
- Only the Driver sees a payment confirmation; it is not written to the ride (UX-15).

### Back-button and route observations

`ScreenHeader` uses `router.back()` (`components/ui/ScreenHeader.tsx:20`), whereas many workflow transitions use `router.replace()`. This appropriately prevents some completed/cancelled back-navigation, but no route-level guard or test confirms history behavior after tab switching or deep linking. This is **Needs Runtime Verification** rather than a confirmed defect.

## 5. Design-System Compliance

| Area | Assessment |
|---|---|
| Palette | Non-compliant with the supplied tokens (UX-09). Centralization in `constants/theme.ts` is a good foundation. |
| Dark mode | Non-compliant: detected but aliased to light theme (UX-07). |
| Typography | Partially centralized, but multiple components bypass it (UX-10). |
| Buttons | Core primary/secondary controls are consistent and meet 50–52px minimum visual heights; ghost naming is misleading (UX-16). |
| Cards/radii | Shared `Card` uses consistent 18px radius and 16px padding; several feature cards hardcode values. |
| Icons | Feather and custom tricycle artwork are mostly consistent; header icons create unavailable actions (UX-11). |
| Bottom navigation | Reusable and safe-area-aware. Rider provides five destinations; Driver omits history/profile from persistent navigation. |
| Status colors | Central status metadata exists. The status sequence is semantically incorrect for one-way trips (UX-05). |
| Localization | Antipolo/Rizal text is present, but routes/fares/suggestions are documented placeholder academic data. |

## 6. Component Reusability Assessment

**Good reuse:** `Screen`, `Card`, `AppButton`/`PrimaryButton`, `AppBottomNav`, `ListRow`, `RideStatusCard`, `RideDetails`, `EmptyState`, and `CancellationDialog` are shared in meaningful places. Theme tokens, spacing and radii are centralized.

**Refactoring candidates (do not implement in Phase 1):**

- A shared history-list presentation component for `app/(rider)/history.tsx` and `app/(driver)/history.tsx`.
- A single details route wrapper or role-configured detail screen for the two nearly identical detail routes.
- Shared activity/loading/error state treatments; current spinners are minimal and visually inconsistent.
- A domain-level availability provider rather than per-screen `useState` (UX-04).
- A form/quote component that owns booking input, validation, route matching and price display (UX-01).
- Consolidated semantic text styles to eliminate feature-local typography (UX-10).

## 7. Prioritized Recommendations

### P0 — Critical usability blockers

1. Make booking quote, route, destination and displayed fare one consistent state; add review/confirmation (UX-01).
2. Connect search/filtering to actual results or remove it until available (UX-02).

### P1 — Major navigation or experience problems

1. Establish persistent Driver availability and make all Driver screens respect it (UX-04).
2. Let drivers decline every request and show Rider recovery (UX-03).
3. Make progress steps trip-type aware (UX-05).
4. Define shared Rider/Driver terminal payment-completion flow, including whether ratings belong in Phase 2 (UX-06, UX-15).
5. Decide and implement the dark-mode policy (UX-07).
6. Clarify demo authentication vs. production onboarding and verification requirements (UX-08).

### P2 — Design inconsistencies and moderate usability problems

1. Adopt approved semantic color tokens and typography roles (UX-09, UX-10).
2. Replace placeholder/faux actions with deliberate prototype treatment (UX-11).
3. Define unavailable-driver, connection, location-permission and map-failure states (UX-12–UX-14).
4. Verify safe areas, large text, small devices and screen readers on physical platforms (UX-13).

### P3 — Minor visual refinements

1. Give ghost actions a genuine visual treatment (UX-16).
2. Resolve unused/legacy presentation code and consolidate duplicated route wrappers (UX-17, UX-18).

## 8. Proposed UI/UX Improvement Phases

1. **Flow correctness:** Resolve booking quote integrity, request decline, availability persistence, and trip-type-aware state progression. Design terminal ride/payment handoff before coding it.
2. **Journey completion:** Specify auth/demo labeling, driver onboarding requirements, Rider completion/receipt/rating, and all empty/error/retry states.
3. **Design-system alignment:** Apply approved palette, semantic light/dark theme decision, typography roles, component variants, and consistent loading/placeholder treatments.
4. **Accessibility and responsive QA:** Test compact Android, iPhone safe areas, font scaling, keyboard, TalkBack, VoiceOver, contrast, and navigation back/deep-link behavior.
5. **Maintainability cleanup:** Extract duplicated history/detail presentations; decide the fate of `RouteCard` and legacy `App.tsx`; only then perform low-risk cleanup.

## 9. Open Questions

1. Is production dark mode a required launch feature, or should Triway be deliberately light-only for this release?
2. Does “Log in” remain only for an academic demo, or what Rider/Driver identity, registration, and recovery requirements are planned?
3. What Driver verification documents, review states, and failure paths are required before Driver activation?
4. Which canonical source will verify Antipolo routes, service boundaries and regulated fares?
5. Is Quick Return a booked two-leg ride with one cash total, two collections, or an informational preference only?
6. Who confirms cash payment, what record should Rider receive, and is rider rating in scope?
7. What is the intended behavior if no Driver accepts, a Driver goes offline, or connectivity/location is unavailable?
8. Will live map/navigation and passenger-driver communication be built in this product, or remain intentionally simulated in the academic MVP?

## Verification Notes

- `pnpm run lint` passed.
- `pnpm run typecheck` passed.
- No simulator, physical device, screen-reader run, or live service was exercised. Findings marked **Needs Runtime Verification** require that coverage.
- The README confirms the application is currently an in-memory, same-instance academic prototype; Firebase mode is scaffold-only and must not be treated as production functionality.
