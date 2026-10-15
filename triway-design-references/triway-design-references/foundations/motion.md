# Motion
- 120–200ms ease-out for button press (scale .98), 200ms for sheet/status changes.
- Loading: indeterminate progress with text and aria-live; no spinner-only states.
- Ride-status changes: cross-fade the status badge, no sliding gimmicks.
- Reduced motion: honor prefers-reduced-motion (RN: AccessibilityInfo.isReduceMotionEnabled); replace transitions with instant changes.
