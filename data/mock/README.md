TriWay uses in-memory demo data for today's academic MVP.

The Antipolo route list lives in `features/routes/data/antipoloRoutes.ts`.
Ride state lives behind `features/rides/services/rideRepository.ts`, so Firebase can replace the mock repository without changing screens.
