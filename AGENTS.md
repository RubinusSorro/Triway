# AGENTS.md — TRIWAY

## 1. Project Overview

**Project:** TRIWAY  
**Application:** Tricycle Ride-Booking Mobile App  
**Location:** Antipolo City, Rizal, Philippines  
**Framework:** React Native with Expo and Expo Router  
**Target Platform:** Android  
**Target Deliverable:** One installable Android APK  
**Prototype Deadline:** October 23, 2026

TRIWAY is a mobile ride-booking application connecting passengers with tricycle drivers in Antipolo City.

The application supports two user roles:

- **Rider:** Books rides, tracks drivers, manages trips, views receipts, and rates completed rides.
- **Driver:** Registers for verification, manages availability, receives booking requests, completes rides, and records payments.

Both roles must operate within a single application while maintaining separate authenticated experiences.

### Primary Objective

Deliver a functional Android prototype capable of demonstrating the complete ride-booking lifecycle between two Android devices.

The application must eventually support:

1. Rider registration and authentication.
2. Driver registration, document submission, and approval.
3. Rider booking creation.
4. Driver availability and request acceptance or rejection.
5. Driver movement and arrival tracking.
6. Ride progression and completion.
7. Cash payment confirmation.
8. Rider receipt and rating.
9. Persistent ride data and real-time synchronization.

Prioritize a reliable, demonstrable end-to-end experience over unnecessary features.

---

## 2. Development Methodology

TRIWAY follows a **Design System–First, Component-Driven Development** methodology.

Reusable visual foundations and application shells must be established before implementing feature-specific interface enhancements.

The workflow is inspired by Atomic Design principles and incremental development.

### Implementation Sequence

**Phase 1 — Design System Foundation (Completed)**

- Centralize design tokens and typography.
- Establish reusable UI primitives and component variants.
- Standardize accessibility and responsive layout foundations.
- Create a development-only component showcase.
- Document the design system and known limitations.

**Phase 2 — UI/UX Redesign and Application Experience**

Phase 2 uses the approved Claude design reference kit as its visual source of truth. Existing React Native components and business logic remain the technical foundation.

**Phase 2A — Design Reference Audit (Completed)**

- Audit the approved Claude design kit against the existing application.
- Identify differences in tokens, navigation, authentication, and ride lifecycle presentation.
- Identify reusable components and implementation risks.
- Document decisions required before implementation.
- Do not modify application code during the audit.

**Phase 2B — Shared Application Shell and Authentication UI (Completed; Android Validation Pending)**

- Align shared design tokens with the approved Claude references.
- Redesign splash, welcome, and role selection.
- Implement four Rider tabs: Home, Routes, Trips, Profile.
- Implement four Driver tabs: Home, Requests, History, Profile.
- Implement visual-only authentication, registration, document submission, and verification screens.
- Preserve existing booking logic and demo access.
- Defer real authentication to Phase 3.

**Phase 2C — Rider Experience Redesign (Next Phase; Approval Required)**

- Redesign Rider screens using the approved Claude references.
- Preserve One-Way and Quick Return booking behavior.
- Implement separate Expo routes for approved Rider ride lifecycle stages.
- Preserve shared booking identity, fare fields, and state progression.
- Improve Rider interactions, feedback, accessibility, and error states.
- Do not implement real backend services.

**Phase 2D — Driver Experience Redesign (Pending)**

- Redesign Driver screens using the approved Claude references.
- Implement separate Expo routes for approved Driver ride lifecycle stages.
- Preserve availability, request acceptance, cancellation, ride progression, and cash confirmation behavior.
- Maintain consistency with Rider booking state.
- Improve Driver interactions, feedback, accessibility, and error states.

**Phase 2E — UI/UX Integration and Quality Assurance (Pending)**

- Compare implemented screens with approved design references.
- Validate Rider and Driver navigation.
- Test One-Way and Quick Return workflows.
- Verify accessibility, loading, empty, error, and recovery states.
- Resolve regressions introduced during Phase 2.
- Test on Android emulator and physical devices where available.
- Document outstanding limitations and readiness for backend integration.

**Phase 3 — Supabase Backend Integration (Pending)**

- Use Supabase as TRIWAY's exclusive final backend.
- Implement Supabase Auth and secure session persistence.
- Implement role-based authorization and PostgreSQL Row Level Security.
- Establish persistent Rider, Driver, booking, and payment records.
- Implement real-time booking synchronization.
- Implement secure Driver document storage and verification.
- Integrate maps, routing, and location services.
- Retire obsolete Firebase prototype integrations after validating their replacements.

**Phase 4 — Validation and Android Delivery (Pending)**

- Complete end-to-end testing on separate Android devices.
- Verify security, persistence, real-time synchronization, and error recovery.
- Validate native Android configuration.
- Generate and test the standalone Android APK.
- Confirm the approved demonstration workflow operates without Expo Go or a development server.

### Phase Rules

- Work only on the explicitly approved phase.
- Do not advance automatically after completing a phase.
- Inspect existing implementations before making changes.
- Follow the approved Claude references for Phase 2 visual design.
- Preserve working functionality and booking-state integrity.
- Keep changes incremental, reviewable, and reversible.
- Document validation results and unresolved limitations.
- Maintain production-quality UI/UX while using prototype-appropriate implementation.
- Require explicit approval before starting the next phase.

### Time Constraints

Because the prototype deadline is October 23, 2026:

- Time-box the design system and application shell.
- Avoid unnecessary abstraction or overengineering.
- Prioritize functionality and integration readiness.
- Perform an early Android APK smoke build.
- Do not postpone native build validation until the final phase.

---

## 3. Technology Stack

### Frontend

- React Native
- Expo
- Expo Router
- TypeScript

### Backend

- Supabase Authentication
- Supabase PostgreSQL
- Supabase Row Level Security
- Supabase Realtime
- Supabase Storage
- Trusted backend functions where required

### Maps and Location

- Google Maps
- Google Routes API
- Expo Location where appropriate
- Route-based simulated driver movement for demonstration

### Build and Distribution

- Expo Application Services (EAS)
- Android APK distribution

### Technical Guidelines

- Follow the installed Expo SDK version.
- Consult current Expo documentation before using unfamiliar or version-sensitive APIs.
- Official Expo documentation: https://docs.expo.dev/
- Expo documentation index: https://docs.expo.dev/llms.txt
- Prefer `expo install` for Expo SDK-compatible dependencies.
- Use the repository's existing package manager and lockfile.
- Do not introduce dependencies without a clear justification.
- Preserve the existing Expo Router directory structure.
- Inspect the actual repository before assuming whether routes are under `app/` or `src/app/`.
- Follow existing TypeScript conventions and module aliases.
- Avoid introducing unnecessary architectural layers.

### Common Verification Commands

Use commands appropriate to the existing package manager and project configuration:

    npx expo lint
    npx tsc --noEmit
    npx expo-doctor

Use `npx expo install --check` to inspect dependency compatibility.

Use `npx expo install --fix` only when a dependency adjustment is justified and its effects have been reviewed.

Do not claim successful verification unless the command actually completed successfully.

---

## 4. Design System

The design system is the primary source of visual consistency throughout TRIWAY.

### Approved Color Palette

| Token      | Hex       | Purpose                            |
| ---------- | --------- | ---------------------------------- |
| Primary    | `#064E3B` | Primary actions and brand emphasis |
| Secondary  | `#147D64` | Secondary actions and accents      |
| Tint       | `#CFE5CF` | Soft green highlights              |
| Background | `#F0F7F3` | Application background             |
| Surface    | `#FFFFFF` | Cards and elevated surfaces        |
| Text       | `#111111` | Primary text                       |
| Muted      | `#6B7280` | Secondary text                     |
| Danger     | `#C0392B` | Destructive actions and errors     |

### Logo-Specific Colors

The approved TRIWAY logo direction uses:

- Mint foreground: `#F0F7F3`
- Gradient start: `#1F6B4F`
- Gradient end: `#3F9680`

These gradient colors are intended primarily for branding assets and explicitly approved branded surfaces.

Do not introduce gradients into ordinary application cards, buttons, or navigation elements without approval.

### Theme Rules

- Implement **light mode only** for the prototype.
- Do not automatically switch the application to dark mode.
- Ensure Android status-bar styling remains compatible with light mode.
- Use semantic color tokens instead of scattering hardcoded color values across screens.
- Maintain sufficient contrast for text, icons, and interactive controls.

### Typography

Use a consistent rounded or geometric sans-serif typeface suitable for mobile interfaces.

Preferred families include:

- Poppins
- Inter
- Nunito, where appropriate for branded elements

Do not mix multiple font families arbitrarily.

Define centralized typography styles for:

- Display
- Screen title
- Section heading
- Body
- Secondary body
- Label
- Caption
- Button text

Typography must remain readable on smaller Android devices.

### Spacing

Use a consistent spacing scale.

Recommended base scale:

`4, 8, 12, 16, 20, 24, 32, 40, 48`

Avoid arbitrary spacing values unless justified by layout requirements.

### Shape and Elevation

- Use consistent rounded corners.
- Prefer approximately 16–20 px radii for major cards where appropriate.
- Use pill-shaped controls when consistent with the component's purpose.
- Keep elevation subtle.
- Avoid excessive shadows and decorative effects.

### Iconography

- Prefer a consistent line-icon family.
- Use consistent icon sizing and visual weight.
- Do not mix unrelated icon styles.
- Use TRIWAY brand assets only where appropriate.

### Accessibility

- Aim for touch targets of at least 44–48 logical pixels.
- Provide accessible labels for icon-only controls.
- Preserve readable text contrast.
- Support appropriate text scaling.
- Provide visible pressed, disabled, loading, and error states.
- Verify safe-area behavior and keyboard avoidance.
- Avoid relying solely on color to communicate status.

---

## 5. Component-Driven Architecture

Create reusable components before implementing repetitive screen-specific designs.

### Component Categories

**Primitives**

- Button
- Text
- Icon
- Text input
- Search input
- Divider
- Surface/container

**Composed Components**

- Card
- Status badge
- Chip
- Form field
- List item
- Route summary
- Fare summary
- Empty state
- Loading indicator
- Error message

**Application Components**

- Screen container
- Header
- Bottom navigation
- Rider information card
- Driver information card
- Booking summary
- Ride status card
- Payment summary

### Component Requirements

Components should:

1. Use centralized design tokens.
2. Expose clear, typed props.
3. Support meaningful variants.
4. Handle relevant interaction states.
5. Remain accessible.
6. Avoid unnecessary coupling to specific screens.
7. Reuse existing project components where practical.

### Button Variants

Standardize:

- Primary
- Secondary
- Outline
- Ghost
- Destructive

Support applicable states:

- Default
- Pressed
- Disabled
- Loading
- Focused

### Component Showcase

A development-only component showcase may be created to validate the design system.

It should demonstrate component variants, states, typography, colors, and spacing.

The showcase must not interfere with production navigation or authenticated flows.

---

## 6. Application Shell

TRIWAY uses a single application with role-specific navigation.

### Shared Entry Flow

1. Splash screen.
2. Welcome or role-selection screen.
3. Rider or Driver authentication.
4. Role-specific authenticated experience.

### Rider Shell

Provide a consistent foundation for:

- Home
- Route selection and booking
- Active ride tracking
- Ride history
- Profile and settings

### Driver Shell

Provide a consistent foundation for:

- Driver dashboard
- Availability management
- Incoming ride requests
- Active ride
- Earnings and history
- Profile and verification

### Navigation Rules

- Preserve Expo Router conventions.
- Keep Rider and Driver route groups logically separated.
- Do not allow authenticated users to navigate into another role's protected experience.
- Avoid duplicate navigation components.
- Maintain consistent screen headers and bottom navigation.
- Handle loading and session restoration without briefly exposing the wrong role's screen.

---

## 7. Authentication and Authorization

TRIWAY uses **one account with one assigned role**.

Supported roles:

- Rider
- Driver

### Account Rules

- A user selects a role during registration.
- A user's role must be persisted.
- Role assignment must not be changeable through ordinary client-side controls.
- Authentication sessions must persist across application restarts.
- Backend authorization must enforce role restrictions.
- Client-side navigation guards are not sufficient security.

### Driver Verification

Drivers must submit required registration information and documents.

Verification states should include:

- Submitted
- Under review
- Approved
- Rejected or requires correction, where supported

Unapproved drivers must not be permitted to accept rides or go online.

Store sensitive driver documents in private storage with appropriate access controls.

Do not expose driver documents publicly.

---

## 8. Booking and Ride Lifecycle

The booking lifecycle must remain consistent across Rider and Driver experiences.

### Core Requirements

- Rider selects a valid route or supported pickup and destination.
- The application displays a consistent booking summary.
- The displayed fare must match the fare used when creating the booking.
- Driver receives an incoming request.
- Driver can accept or decline.
- Accepted bookings transition into pickup navigation.
- Rider can track Driver approach.
- Driver confirms arrival and starts the ride.
- Driver completes the ride.
- Cash payment is confirmed.
- Rider receives a receipt and can submit a rating.

### Booking Integrity

Do not independently calculate conflicting fares in different screens.

Use one authoritative booking record and fare calculation path.

### Service Area

TRIWAY is designed for Antipolo City.

Do not treat arbitrary text input as a verified serviceable route.

Use verified route data or explicitly identified demo fixtures.

### Fare Integrity

Do not invent official Antipolo tricycle fares.

Any fare presented as official must be supported by a verified fare reference.

Demo-only fares must be clearly identified as sample values.

### Quick Return

Quick Return represents one booking with a two-leg ride lifecycle.

It must have:

- One booking identity.
- A clearly defined outbound leg.
- A clearly defined return leg.
- One authoritative total fare.
- Correct status progression for both legs.

One-way bookings must never display return-leg statuses.

### Payment

The prototype uses cash payment.

Payment confirmation must be represented in the booking's persistent state once the backend is integrated.

Do not treat an unpersisted local UI toggle as authoritative payment confirmation.

---

## 9. Google Maps and Driver Movement Simulation

The prototype may use Google Maps for route visualization and simulated driver movement.

### Demo Objective

Demonstrate a tricycle approaching a Rider's pickup location even when both Android devices are stationary.

### Recommended Approach

- Display a Google Map.
- Obtain a valid route between a simulated Driver location and the Rider pickup.
- Decode or process the route polyline.
- Animate a custom tricycle marker along the road-following route.
- Update the Rider's displayed distance and simulated ETA.
- Transition the booking to Driver Arrived when the simulated approach completes.

### Simulation Architecture

Separate simulated location generation from the tracking interface.

Prefer a replaceable abstraction such as:

`DriverLocationProvider`

Potential implementations:

- Simulated location provider.
- Real GPS location provider.

The Rider tracking interface should consume location updates without depending directly on the source.

### Two-Device Synchronization

When Supabase is integrated:

- Maintain one authoritative booking lifecycle.
- Ensure Rider and Driver observe the same ride status.
- Use one authoritative simulation controller.
- Synchronize relevant simulated location updates.
- Avoid running independent, unsynchronized simulations on both devices.

### Demo Transparency

- Clearly identify simulated tracking as demo behavior.
- Do not imply that simulated coordinates represent actual live GPS.
- Distinguish simulated ETA from real Google travel-time estimates.

### API Security

- Never hardcode unrestricted API keys.
- Apply appropriate Android package and signing-certificate restrictions for Maps SDK credentials.
- Use trusted backend access for Routes API requests when appropriate.
- Avoid unnecessary repeated routing requests.
- Follow Google Maps Platform usage and caching requirements.

---

## 10. Supabase Backend Architecture

Supabase is TRIWAY's confirmed primary and final backend.

### Services

**Authentication**

- Rider and Driver login.
- Registration.
- Session persistence.
- Role-aware access.

**PostgreSQL**

- User profiles.
- Driver profiles.
- Driver verification records.
- Routes.
- Bookings.
- Ride events or status history.
- Payments.
- Ratings.

**Row Level Security**

- Riders can access their own authorized data.
- Drivers can access only bookings and records permitted by their role and assignment.
- Driver approval and role assignment require trusted authorization.
- Sensitive data must not be publicly accessible.

**Realtime**

- Booking status updates.
- Driver request notifications.
- Driver availability.
- Driver location updates where appropriate.

**Storage**

- Private driver verification documents.
- Appropriate authenticated access policies.

### Backend Rules

- Never expose Supabase service-role keys in the mobile application.
- Use trusted server-side operations for privileged actions.
- Prevent unauthorized booking acceptance and state transitions.
- Ensure only one Driver can successfully accept a booking.
- Validate ride transitions server-side.
- Avoid relying exclusively on client-side validation.
- Prefer idempotent operations for actions that may be retried.
- Firebase was used only during initial prototyping and must not be retained as a final production dependency.
- Retire obsolete Firebase integrations after the approved Supabase replacements have been validated.

---

## 11. UI/UX Audit Findings

The existing Phase 1 UI/UX audit identified 18 findings.

Important issues include:

- Inconsistent destination, route, and fare selection.
- Search input without functional search behavior.
- Missing normal Driver request decline action.
- Inconsistent Driver availability state.
- Incorrect return-related status in one-way bookings.
- Missing Rider completion, receipt, and rating experience.
- Light/dark theme inconsistencies.
- Missing real authentication and Driver verification.
- Inconsistent design tokens and typography.
- Placeholder actions without meaningful functionality.
- Unsupported arbitrary service-area input.
- Safe-area and accessibility concerns.
- Missing timeout, retry, offline, and permission states.
- Unpersisted cash confirmation.
- Inconsistent button variants.
- Unused or duplicate components and wrappers.

### Audit Implementation Rule

Do not attempt to fix all findings simultaneously.

Address them within the approved phase:

- Design-system inconsistencies during Phase 1.
- Navigation and shell issues during Phase 2B.
- Rider booking and interaction issues during Phase 2C.
- Driver workflow issues during Phase 2D.
- Cross-role UI/UX validation during Phase 2E.
- Authentication and persistence during Phase 3.
- Runtime accessibility and reliability issues throughout validation.

Preserve working behavior while improving the architecture.

---

## 12. Interaction and Failure States

Every important user flow should eventually handle:

- Loading.
- Empty results.
- Validation errors.
- Network failures.
- Retry.
- Location permission denied.
- Location unavailable.
- No Driver available.
- Booking timeout.
- Request declined.
- Ride cancellation.
- Session expiration.
- Duplicate action prevention.

Avoid presenting nonfunctional buttons as if they perform real actions.

If a feature is intentionally simulated, label it appropriately.

---

## 13. Code Quality Standards

### General Principles

- Favor clarity over cleverness.
- Use TypeScript types consistently.
- Keep components reasonably small and focused.
- Avoid duplicated business logic.
- Separate presentation from ride lifecycle and backend operations.
- Preserve established folder structure unless there is a clear reason to change it.
- Do not introduce unnecessary dependencies.
- Avoid unrelated formatting or refactoring changes.

### Existing Code

Before replacing an implementation:

1. Inspect it.
2. Identify its current responsibilities.
3. Determine whether it can be reused.
4. Explain why changes are necessary.
5. Preserve existing working functionality.

### Documentation

Document:

- New design tokens.
- Shared component contracts.
- Important architectural decisions.
- Backend environment requirements.
- Build configuration.
- Known limitations.

Prefer concise, useful documentation over excessive boilerplate.

---

## 14. Codex Execution Workflow

For every implementation phase, follow this workflow.

### Step 1 — Inspect

Read:

- `AGENTS.md`
- Relevant existing source files
- Available audit reports
- Existing design guidelines
- Relevant package configuration

Do not assume the project is empty.

### Step 2 — Audit

Identify:

- Existing implementations.
- Reusable components.
- Architectural constraints.
- Risks.
- Files likely to change.

### Step 3 — Plan

Present a concise implementation plan.

For major changes, identify expected files and potential regressions.

### Step 4 — Implement

Implement only the approved scope.

Do not expand into future phases without permission.

### Step 5 — Verify

Run applicable checks:

    npx expo lint
    npx tsc --noEmit

Run additional checks when relevant.

Inspect the final diff for unintended changes.

### Step 6 — Report

Summarize:

- What was implemented.
- Files created or modified.
- Reused components.
- Verification results.
- Known limitations.
- Any decisions requiring approval.

### Step 7 — Stop

Wait for explicit approval before proceeding to the next phase.

---

## 15. Android APK Requirements

The final prototype must produce an installable Android APK.

### Requirements

- Installable without Expo Go.
- Runs without a development Metro server.
- Contains Rider and Driver experiences.
- Supports persistent authentication.
- Supports the approved demonstration flow.
- Includes required native configurations.
- Displays Google Maps correctly on supported Android devices.
- Uses the correct application identifier and signing configuration.

### Early Build Requirement

Perform an early APK smoke build after confirming basic native configuration.

Do not wait until all UI/UX and backend phases are complete.

### Final Verification

Test the actual APK on Android hardware.

Verify:

1. Fresh installation.
2. Application launch.
3. Login and session restoration.
4. Rider booking.
5. Driver acceptance.
6. Rider tracking.
7. Driver arrival.
8. Ride completion.
9. Cash confirmation.
10. Rider receipt and rating.
11. Application restart.
12. Network interruption and recovery.

---

## 16. Prioritization Rules

When deadlines or implementation conflicts arise, prioritize:

1. Application stability and installable APK.
2. Complete Rider-to-Driver booking lifecycle.
3. Authentication and authorization.
4. Persistent data and real-time synchronization.
5. Correct booking and payment behavior.
6. Functional maps and simulated arrival.
7. Consistent design system and usability.
8. Secondary features and visual refinements.

Do not sacrifice the core demonstration for decorative enhancements.

---

## 17. Current Approved Development Focus

**Current status: Phase 2B completed — awaiting final approval and Android smoke validation.**

**Next proposed phase: Phase 2C — Rider Experience Redesign.**

Phase 2C must not begin until the project owner explicitly approves its implementation.

### Phase 2B Completion Status

The Phase 2B implementation report confirms:

- Shared application shell redesigned.
- Splash, welcome, and role-selection screens updated.
- Rider navigation changed to Home, Routes, Trips, and Profile.
- Driver navigation changed to Home, Requests, History, and Profile.
- Visual-only Rider and Driver authentication screens added.
- Driver document and verification presentation added.
- Approved Claude design tokens adopted.
- Existing booking and ride lifecycle logic reported unchanged.
- Expo lint passed.

### Known Phase 2B Limitations

- Android runtime testing remains outstanding.
- Existing Rider FlatList TypeScript diagnostics remain.
- Existing Firebase export/type diagnostics remain.
- Environment `process` typing issues remain.
- Expo Doctor did not produce a usable completion result.
- Native Android package configuration and APK smoke build remain outstanding.
- Muted text contrast must be reviewed where normal-text accessibility requirements apply.

These limitations must be tracked and must not be misrepresented as passing validation.

### Phase 2C Objective

Redesign the Rider experience to match the approved Claude design references while preserving existing booking functionality.

The implementation must deliver a polished, production-quality Android user experience using the established TRIWAY design system.

### Approved Phase 2C Direction

The Rider redesign must:

1. Follow the approved Claude Rider screen references.
2. Preserve the four-tab Rider navigation established in Phase 2B.
3. Reuse existing shared components and design tokens where appropriate.
4. Implement separate Expo routes for distinct Rider ride lifecycle stages.
5. Preserve one authoritative booking record and state progression.
6. Preserve One-Way and Quick Return booking functionality.
7. Preserve existing fare calculation rules and booking identifiers.
8. Maintain access to Rider history, trip details, profile, and secondary features.
9. Implement meaningful loading, empty, success, validation, and error states.
10. Maintain accessible Android layouts and predictable navigation.

### Ride Lifecycle Routing Requirements

The approved architecture uses separate Expo routes for distinct ride lifecycle stages.

Before implementing these routes:

- Audit existing Rider routes and booking-state dependencies.
- Identify the approved lifecycle stages in the Claude reference kit.
- Define the proposed route mapping.
- Identify how booking state survives route transitions and application navigation.
- Preserve Quick Return outbound and return-leg progression.
- Prevent invalid or duplicate transitions.
- Ensure routes do not create independent copies of booking state.
- Preserve the existing booking repository until its approved Supabase replacement.

Do not create new routes solely because a design reference represents a visual state.

A distinct route must have a clear navigation or lifecycle responsibility.

### Explicitly Out of Scope for Phase 2C

Do not:

- Redesign the entire Driver experience.
- Implement Supabase authentication or database integration.
- Introduce new Firebase dependencies.
- Replace the existing booking repository without approval.
- Change the authoritative fare calculation logic.
- Implement real payment processing.
- Introduce unrelated architectural refactoring.
- Configure the final Android release build.
- Begin Phase 2D or Phase 2E.

### Phase 2C Completion Criteria

Phase 2C is ready for review when:

- Approved Rider screens have been implemented.
- The four-tab Rider shell remains functional.
- Rider ride lifecycle routes follow the approved architecture.
- One-Way and Quick Return flows remain intact.
- Booking identity, fare fields, and ride progression are preserved.
- Relevant interactions provide meaningful feedback.
- Android navigation and back behavior have been tested where possible.
- Applicable lint and TypeScript checks have been executed.
- New diagnostics are distinguished from existing baseline issues.
- Accessibility and visual differences are documented.
- An implementation report and manual QA checklist are provided.

**After completing Phase 2C, stop and wait for explicit approval before beginning Phase 2D.**

### Phase Approval Gate

Phase 2B is reported complete but has outstanding runtime validation.

Before authorizing Phase 2C:

1. Review the Phase 2B implementation report.
2. Perform an Android smoke test when the emulator is available.
3. Verify Rider and Driver navigation and demo entry.
4. Confirm existing booking entry points remain functional.
5. Record unresolved issues.
6. Obtain explicit approval to begin Phase 2C.

Do not treat this document update as authorization to start Phase 2C.

---

## 18. Development Quality Standards

### Core Principle

Although TRIWAY is an academic demonstration application, all development must target **production-quality UI/UX, maintainable architecture, reliable interactions, and a polished native Android experience**.

**Development philosophy: Production-quality experience. Prototype-appropriate implementation.**

TRIWAY should look and behave like a real ride-booking application, even while some underlying services remain simulated during development.

### UI/UX Quality

- Follow the approved Claude design references and centralized TRIWAY design system.
- Maintain consistent typography, colors, spacing, iconography, and component styling.
- Build polished, responsive interfaces suitable for different Android screen sizes.
- Ensure navigation is intuitive and consistent across Rider and Driver experiences.
- Provide meaningful visual feedback for every important interaction.
- Implement appropriate loading, success, empty, disabled, and error states.
- Avoid unfinished layouts, inconsistent components, and unnecessary visual clutter.
- Do not imitate another ride-booking application's visual identity.

### Functional Quality

- Every visible interactive control must have a meaningful and predictable behavior.
- Do not present decorative buttons or placeholder actions as working functionality.
- Preserve complete One-Way and Quick Return booking workflows.
- Maintain consistent booking status, fare calculations, and ride progression.
- Prevent duplicate submissions and invalid state transitions.
- Provide clear validation messages and recovery options.
- Ensure Android back navigation behaves correctly.
- Preserve application state when navigating between related screens.

### Architecture and Code Quality

- Use maintainable React Native and TypeScript patterns.
- Follow Expo Router conventions.
- Keep presentation components separate from business logic and backend services.
- Prefer reusable components over duplicated implementations.
- Preserve existing working functionality during redesigns.
- Avoid unnecessary dependencies, architectural layers, and premature optimization.
- Implement changes incrementally within the approved development phase.
- Do not introduce unrelated refactoring without approval.

### Backend and Security

**Supabase is TRIWAY's confirmed primary and final backend.**

Use Supabase for:

- Authentication.
- PostgreSQL database.
- Row Level Security.
- Realtime synchronization.
- Private file storage.
- Trusted server-side operations where necessary.

Firebase was used only during the initial prototype stage and must not be introduced as a production dependency.

Retire obsolete Firebase integrations during the approved Supabase migration after confirming that replacement functionality works.

Enforce Rider and Driver permissions through backend authorization rather than relying solely on client-side navigation.

Never expose privileged credentials or sensitive user information.

### Prototype Transparency

Simulated features are permitted when appropriate for the current development phase.

Examples include:

- Driver movement simulation.
- Demonstration-only ride matching.
- Sample fare calculations.
- Visual-only authentication screens before backend integration.

However:

- Do not present simulated functionality as a real backend operation.
- Clearly distinguish demo data from persistent data.
- Do not claim that documents, payments, or verification results were processed when they were not.
- Design simulated functionality so it can be replaced with Supabase-backed implementations without unnecessary UI rewrites.

### Android Quality Assurance

- Validate layouts on the Android emulator and physical devices when available.
- Verify safe areas, keyboard handling, scrolling, and touch targets.
- Maintain accessible text contrast and readable typography.
- Test navigation, loading states, validation, and error recovery.
- Run applicable lint and TypeScript checks.
- Document existing errors separately from newly introduced issues.
- Do not claim runtime compatibility or successful testing without actual verification.

### Implementation Priorities

When making development decisions, prioritize:

1. Application stability and reliable Android behavior.
2. Complete Rider and Driver booking workflows.
3. Correct business logic and booking-state integrity.
4. Consistent, production-quality UI/UX.
5. Security and backend integration readiness.
6. Maintainable, reusable architecture.
7. Accessibility and error handling.
8. Secondary features and decorative refinements.

Avoid unnecessary enterprise-scale complexity that does not contribute to TRIWAY's demonstration objectives.

### Definition of Done

A feature is not considered complete merely because its interface has been implemented.

Before reporting completion, verify that:

- The UI follows the approved design references.
- Relevant interactions behave correctly.
- Navigation is functional.
- Existing booking workflows remain intact.
- Applicable loading, empty, and error states are handled.
- Accessibility requirements have been considered.
- Applicable validation commands have been executed.
- Known limitations are documented.

**Final objective: Deliver a production-quality demonstration of TRIWAY that is visually polished, functionally credible, maintainable, and ready for Supabase integration.**

---

## Final Instruction

TRIWAY must be developed incrementally, using the design system as the foundation for all interfaces.

Always inspect before implementing, preserve working behavior, avoid unnecessary complexity, and prioritize the October 23, 2026 Android prototype deliverable.

The objective is not merely to produce attractive screens, but to deliver a consistent, usable, and demonstrable ride-booking application.
