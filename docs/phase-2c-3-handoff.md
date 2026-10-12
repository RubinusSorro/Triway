# TRIWAY Phase 2C-3: Rider Active Ride Lifecycle

## Status-to-route contract

The Rider subscribes to the existing authoritative current-ride source. `features/rides/utils/riderLifecycle.ts` maps only active status values to presentation routes:

| Status | Rider route |
| --- | --- |
| `requested` | `/(rider)/matching` |
| `accepted` | `/(rider)/assigned` |
| `arriving` | `/(rider)/tracking` |
| `ongoing` | `/(rider)/progress` |
| `waiting_return` | `/(rider)/progress` |

`RiderLifecycleGuard` reuses that subscription on each lifecycle screen, redirects when a Driver action changes the authoritative status, and provides safe no-ride and cancelled recovery states. `/(rider)/ride` remains a compatibility entry that redirects to the resolved lifecycle route.

## Preserved lifecycle ownership

No repository, fare, or transition rule changed. Driver controls remain responsible for requested-to-accepted, accepted-to-arriving, arriving-to-ongoing, and onward ride transitions. The pre-existing Rider Quick Return action at `waiting_return` remains available and continues to request the existing `accepted` return-leg transition.

## Presentation notes

The four lifecycle screens use the approved matching, assigned, tracking, and progress references with TRIWAY cards, the existing simulated map, and the shared status card. One-way status indicators exclude the Quick Return-only `waiting_return` step. Maps and ETA labels explicitly identify simulated demo behavior.
