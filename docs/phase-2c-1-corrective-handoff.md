# TRIWAY Phase 2C-1 Corrective Pass

## Modal and alert audit

`components/ui/CancellationDialog.tsx` is the current TRIWAY-specific modal foundation. It already provides a native Android back-handler, a clear cancellation explanation, selectable reasons, loading prevention, accessible radio controls, and token-based action buttons.

The remaining `Alert.alert` calls are intentionally unchanged during this corrective pass. They occur in Rider cancellation completion, Rider passes, shared header placeholders, and Driver request/ride flows. Replacing them globally would alter Rider and Driver behavior outside this approved fix scope.

## Recommended next approved implementation

When the affected flows are being implemented, add a focused `TriwayDialog` component (or generalize `CancellationDialog`) with:

- `info`, `success`, `warning`, `error`, `confirmation`, and `destructive` variants.
- Required title and message, with optional icon.
- Primary and optional secondary actions built from `AppButton`.
- Native Android `onRequestClose`, modal accessibility semantics, and keyboard-safe layout.
- Explicit loading and disabled action states to prevent duplicate submissions.

Migrate only alerts whose associated action is functional in the active phase. Placeholder actions should be removed or remain clearly unavailable rather than receiving a polished confirmation dialog.

## Corrective-pass boundary

No custom-alert migration, booking repository change, ride-status transition change, Quick Return rule change, fare-calculation change, Driver flow change, or backend integration change is included in this pass.
