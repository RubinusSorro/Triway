# TRIWAY Phase 2B Handoff

## Scope completed

Phase 2B implements the approved shared application shell and visual-only authentication presentation. It does not change booking creation, fare calculation, Quick Return eligibility or progression, ride acceptance, cancellation, completion, payment behavior, Firebase configuration, or backend authentication.

## Approved reference source

The complete approved kit is located at `triway-design-references/triway-design-references/`. It was not renamed or modified. Phase 2B translates its splash, welcome, role, auth, verification, buttons, inputs, cards, navigation, and feedback references into native components.

## Navigation

Rider tabs are now **Home**, **Routes**, **Trips**, and **Profile**. Booking, the active ride, ride details, and Wallet/Passes remain secondary routes; Profile provides access to passes.

Driver tabs are now **Home**, **Requests**, **History**, and **Profile**. Active ride, completion, and ride details remain secondary routes reached from the existing Driver flows.

## Authentication and verification

New routes are `rider-login`, `rider-register`, `driver-login`, `driver-register`, `driver-documents`, and `driver-verification` within `app/(auth)/`. They are UI-only: entered values stay local, no account, document, OTP, session, or verification status is persisted, and the screens say so. Role selection remains the explicit classroom-demo entry point.

## Design decisions

Phase 2B adopted reference support values: border `#D5E3DA`, warning `#B45309`, disabled `#9CA3AF` with `#E5E7EB` disabled fill, and 50% black overlay. Cards use 16px radii and `AppButton` uses a 52px pill treatment. The app remains Inter and light-only.

Muted text on the application background remains 4.44:1. It must stay non-critical or be placed on a white surface. Mint is not used as a sole border.

## Phase 2C prerequisites

Use the existing secondary ride routes and stateful mock repository when adding Rider lifecycle screens. New search, review, matching, tracking, receipt, and rating routes must consume the current booking data rather than calculate fares independently. Android runtime/device validation and the existing TypeScript/Firebase baseline remain outstanding.
