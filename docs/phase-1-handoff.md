# TRIWAY Phase 1 Handoff

## Completion summary

Phase 1 established a light-only, Inter-based design foundation for TRIWAY. It provides centralized semantic tokens, reusable shared components, and a development-only showcase at `/__dev/showcase`. The work preserves the existing Rider and Driver feature flows and does not implement Phase 2 shell work.

Available shared components include `AppButton`, `PrimaryButton`, `Card`, `StatusBadge`, `LocationField`, `SearchBar`, `EmptyState`, `ListRow`, `Screen`, `Header`, `ScreenHeader`, and `AppBottomNav`. `PrimaryButton` remains a compatibility wrapper; use `AppButton` for new work.

## Foundation file inventory

| File | Responsibility |
| --- | --- |
| `constants/theme.ts` | Colors, type scale, spacing, radii, elevation, icon sizes, touch targets, and light theme. |
| `hooks/useAppTheme.tsx` | Light-only theme context. |
| `app/_layout.tsx` | Inter font loading, root safe-area/theme providers, and light status bar defaults. |
| `components/ui/*` | Shared controls, status, list, decorative, and tab-navigation primitives. |
| `components/layout/*` | Screen scrolling/safe-area/keyboard behavior and content headers. |
| `components/common/EmptyState.tsx` | Shared empty/error-style feedback surface. |
| `app/__dev/showcase.tsx` | Development-only visual QA reference. |
| `docs/design-system.md` | Implemented token and component contracts. |

## Integration guidance

Phase 2 should compose existing `Screen`, `Header`/`ScreenHeader`, and `AppBottomNav` rather than creating parallel shell components. Use `AppButton` variants, controlled `LocationField`/`SearchBar` inputs, `Card` variants, and `StatusBadge` for status communication. New screens must use `colors`, `spacing`, `radii`, `typography`, icon sizes, and touch-target tokens from `constants/theme.ts`.

Do not copy screen-local styles into new shared components. Preserve existing route groups and use the showcase to inspect real component variants before adding a new one.

## Existing issues and limitations

### Phase 1 follow-up

- `colors.textMuted` on `colors.background` has 4.44:1 contrast, below normal-text AA. Keep it noncritical until a stronger semantic treatment is approved.
- The development showcase is bundled as a route. It redirects to `/` outside development but is not build-time excluded.
- Manual showcase QA is user-reported; automated UI and Android-device coverage are not yet in place.

### Pre-existing TypeScript diagnostics

- Rider `FlatList` prop typings in `app/(rider)/passes.tsx` and `app/(rider)/routes.tsx`.
- Missing environment `process` typings in `constants/config.ts` and Firebase configuration.
- Firebase exports not resolved in `services/firebase/*`.

### Deferred product and backend work

Authentication, role guards, driver verification, booking/fare integrity, route search, payment persistence, rider completion/rating, maps, simulated movement, Supabase, and realtime synchronization are not completed by Phase 1.

## Phase 2 preparation

The approved next scope is the application shell: splash/welcome experience, role selection, shared navigation, Rider and Driver shells, headers, bottom navigation, safe-area behavior, and route guards. Reuse the foundation files above; do not redesign booking, backend, or map behavior while establishing the shell.

## Early APK readiness

The project has an Expo app configuration, Android adaptive-icon settings, a light appearance setting, static asset paths, and bundled Inter fonts. An early standalone APK smoke build still requires a deliberate EAS profile/build configuration review, Android package identifier, signing strategy, and a successful actual build. Expo Go is not a substitute for that validation.
