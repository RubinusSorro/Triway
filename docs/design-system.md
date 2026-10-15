# TRIWAY Design System

This document describes the implemented Phase 1 foundation. Import tokens from `constants/theme.ts`; do not introduce new hard-coded visual values in shared components.

## Brand foundations

| Purpose | Token | Value |
| --- | --- | --- |
| Primary action | `colors.primary` | `#064E3B` |
| Secondary accent | `colors.secondary` | `#147D64` |
| Soft highlight | `colors.tint` | `#CFE5CF` |
| App background | `colors.background` | `#F0F7F3` |
| Surface | `colors.surface` | `#FFFFFF` |
| Primary text | `colors.text` | `#111111` |
| Muted text | `colors.textMuted` | `#6B7280` |
| Destructive state | `colors.danger` | `#C0392B` |

`primaryDark`, `border` (`#D5E3DA`), `warning` (`#B45309`), `disabled` (`#9CA3AF`), and the 50% black `overlay` are functional support tokens adopted in Phase 2B. Disabled controls use `#E5E7EB` fill with muted text; this non-critical state is not used as the sole communication channel. The official logo source is `assets/images/TRIWAY.png`; preserve its proportions, opaque green background, and original colors. Its mint foreground is `#F0F7F3`; the approved brand-gradient endpoints are `#1F6B4F` and `#3F9680`. Do not use that gradient on ordinary application controls or cards.

Inter is loaded in `app/_layout.tsx` at Regular 400, Semibold 600, and ExtraBold 800. Use `typography.display`, `screenTitle`, `sectionHeading`, `body`, `secondaryBody`, `label`, `caption`, and `button`. Existing aliases (`title`, `sectionTitle`, `subtitle`, `bodySemibold`, and `captionSemibold`) remain for compatibility while screens migrate incrementally.

Use the 4, 8, 12, 16, 20, 24, 32, 40, and 48 spacing tokens. Use 12px input radii, 16px card radii, and pill radii for primary action controls. Use `shadows.card` for normal elevated surfaces and `shadows.floating` only for floating emphasis. Icon sizes are 16, 20, 24, and 32px. Primary buttons and form controls use a 52px minimum height; all interactive targets remain at least 48px.

TRIWAY is light-mode only: Expo is configured with `userInterfaceStyle: "light"`, and `AppThemeProvider` always supplies `lightTheme`. `darkTheme` remains a compatibility alias and does not activate dark styling.

## Shared component contracts

| Component | Purpose and supported API | Accessibility and usage |
| --- | --- | --- |
| `AppButton` | Canonical 52px pill action control. `variant`: `primary`, `secondary`, `outline`, `ghost`, `danger`; `disabled`, `loading`, `style`, `accessibilityLabel`, and optional Feather `icon`. Icon and label share one centered layout; labels may wrap to two lines rather than clip. | Announces button, disabled, and busy states. Loading disables repeated presses. Prefer one primary action per screen section. |
| `PrimaryButton` | Compatibility wrapper for `AppButton` primary variant, including optional `icon`. | Use only where retaining an existing import; new shared UI should use `AppButton`. |
| `TriwayDialog` | Focused modal for approved confirmation, success, and recoverable-error flows. Requires `tone`, title/message, primary action, and Android-back handler; supports a secondary action and loading state. | Uses native modal behavior, dialog accessibility semantics, token-based actions, and blocks dismissal while submitting. Do not use it to polish placeholder actions. |
| `Card` | Surface container with `default`, `tinted`, and `outlined` variants plus `style`. | Use for grouped content, not every layout wrapper. |
| `StatusBadge` | Ride status presentation via required `status`. | Always includes an icon, text label, and color. It is not color-only. |
| `LocationField` | Controlled field requiring `label`, `value`, `placeholder`, and `onChangeText`; optional `error`. | Labels the input, announces validation text, and shows focus/error borders. Use only verified service-area inputs in product flows. |
| `SearchBar` | Optional `value`, `onChangeText`, `onSubmit`, and `onFilterPress`. | Announces its search field and an optional browse-routes control; provides focus feedback. Parent screens own the actual search behavior. |
| `EmptyState` | Requires `title` and `body`; optional `icon`, `actionLabel`, and `onAction`. | Use a meaningful action only when it can complete a real local or product flow. |
| `ListRow` | Requires `title`; optional `subtitle`, `trailing`, `onPress`, and `accessibilityLabel`. | Becomes an accessible button only when `onPress` is supplied. |
| `Screen` | Shared safe-area screen. Optional `scroll`, `keyboardAvoiding`, `includeTabBarPadding`, `bottomSafeArea`, and `contentContainerStyle`. | Default scrolling is enabled. Use `keyboardAvoiding` for forms; use `bottomSafeArea` for non-tab, edge-to-edge content. |
| `Header` / `ScreenHeader` | Text hierarchy header; `ScreenHeader` also supports `title`, `showBack`, and `showActions`. | `ScreenHeader` actions have labels and 44px targets. Do not use placeholder actions as production functionality. |
| `AppBottomNav` | Expo Router tab-bar renderer; Rider items are internal and `DRIVER_ITEMS` is exported for Driver layouts. | Maintains selected tab state and touch-target sizing. Shell changes belong to Phase 2. |

### Examples

```tsx
<AppButton label="Continue" onPress={submit} loading={isSubmitting} />

<LocationField
  label="Pickup"
  value={pickup}
  placeholder="Choose a pickup"
  onChangeText={setPickup}
  error={pickupError}
/>

<EmptyState
  title="No routes available"
  body="Verified routes will appear here when available."
  actionLabel="Try again"
  onAction={refetch}
/>
```

## Design rules

- Use semantic tokens rather than hard-coded colors.
- Maintain a clear hierarchy and one primary action where appropriate.
- Pair status color with icon and text.
- Keep forms keyboard-safe and screens scrollable through `Screen`.
- Show visible loading, disabled, error, and empty states where applicable.
- Treat decorative SVG and icon elements as inaccessible; do not use web-incompatible accessibility props.
- Do not present simulated or placeholder behavior as a completed product feature.

### Contrast review

Static token checks pass AA for `text` on `background` (17.36:1), white on `primary` (9.72:1), white on `secondary` (5.06:1), white on `danger` (5.44:1), and `primary` on `tint` (7.29:1). `textMuted` on `background` is 4.44:1, just below the 4.5:1 AA threshold for normal-size text. Keep muted copy nonessential and do not use it for small or critical information until an approved stronger semantic muted treatment is defined.

## Development showcase

During development, open `/__dev/showcase` (for example, `triway://__dev/showcase`) to inspect actual tokens, typography, logo usage, components, statuses, loading, empty state, and layout tokens. Its actions use local state only.

The route is not linked from Rider or Driver navigation. It is bundled as an Expo Router route, so it is not physically excluded from production output. When `__DEV__` is false, it immediately redirects to `/`; it is therefore development-accessible, production-redirected, and not a production feature. Update its examples whenever a token or shared component contract changes.

## Known limitations

- The showcase received user-reported manual QA on October 10, 2026; Android device and automated UI coverage remain separate validation work.
- Firebase/environment and Rider `FlatList` TypeScript diagnostics are not Phase 1 defects and remain unresolved.
- Authentication, driver verification, route-search integrity, bookings, payments, maps, and real-time synchronization are deferred to later approved phases.
