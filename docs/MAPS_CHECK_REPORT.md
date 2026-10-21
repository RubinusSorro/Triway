# TriWay Maps Check Report
Date: 2026-10-22   Branch: Rus   MapLibre version: 11.5.0

## Verdict
Photon search wiring: BROKEN
MapLibre map wiring:  BROKEN
Route paths:          PARTIAL
Web build:            OK

## Results
| # | Check | Result | Evidence (file:line or output) |
|---|---|---|---|
| 1.1 | Branch is `Rus` | PASS | `git branch --show-current` -> `Rus` |
| 1.2 | Commits from the last 14 days mention maps, MapLibre or Photon | PASS | `02cba22`, `ff68471`, `6343988`, `8542ec1`, `00f09c1`, `7fa3251`, `b3ef568`, `3d19afc`, `be28de7`, `4a63214`, `87c3ae6`, `4eff72c`, `e74abd1` (2026-10-15 to 2026-10-16) |
| 1.3 | Those commits are pushed | PASS | `git status -sb` -> `## Rus...origin/Rus` (no ahead of origin) |
| 1.4 | No uncommitted changes in map files | PASS | `git status --short` -> empty |
| 2.1 | `features/maps/components/TriwayMap.tsx` exists and is not empty | PASS | Found, `4573` bytes |
| 2.2 | `features/maps/components/TriwayMap.web.tsx` exists | PASS | Found, `9148` bytes |
| 2.3 | `features/maps/services/photonGeocoder.ts` exists | PASS | Found, `1742` bytes |
| 2.4 | `features/maps/hooks/usePlaceSearch.ts` exists | PASS | Found, `1336` bytes |
| 2.5 | `features/maps/hooks/useRideSimulation.ts` and `useSimulatedProgress.ts` exist | PASS | Found, `6162` bytes and `640` bytes |
| 2.6 | `features/maps/utils/polyline.ts`, `geo.ts`, `routePath.ts` exist | PASS | Found (`699`, `1477`, `549` bytes) |
| 2.7 | `data/routePaths.ts` exists | PASS | Found, `1043` bytes |
| 3.1 | `@maplibre/maplibre-react-native` and `expo-dev-client` are in `package.json` | PASS | `package.json:8` (`"@maplibre/maplibre-react-native": "^11.5.0"`), `package.json:13` (`"expo-dev-client": "~57.0.20"`) |
| 3.2 | The package is actually installed | PASS | `node_modules/@maplibre/maplibre-react-native/package.json` -> `"version": "11.5.0"` |
| 3.3 | `app.json` `expo.plugins` includes `@maplibre/maplibre-react-native` | PASS | `app.json:26` |
| 3.4 | `app.json` `expo.android.package` is set | PASS | `app.json:32` (`"com.triway.app"`) |
| 3.5 | Map style URL is set | PASS | `features/maps/components/TriwayMap.tsx:11` & `TriwayMap.web.tsx:10` (`https://tiles.openfreemap.org/styles/liberty`) |
| 3.6 | `TriwayMap.tsx` uses components that exist in the installed MapLibre version | PASS | v11.5.0 renamed `MapView`/`ShapeSource`/`LineLayer`/`CircleLayer` to `Map`/`GeoJSONSource`/`Layer`; `TriwayMap.tsx:1` imports `{ Camera, GeoJSONSource, Layer, LngLatBounds, Map }`, all exported in `node_modules/@maplibre/maplibre-react-native/src/index.ts` |
| 3.7 | MapLibre native is imported only from native files | PASS | `git grep "@maplibre/maplibre-react-native"` matches only `features/maps/components/TriwayMap.tsx:1` |
| 3.8 | Route line and pins use GeoJSON as `[longitude, latitude]` | PASS | `features/maps/components/TriwayMap.tsx:22` (`const toLngLat = (p: LatLng): [number, number] => [p.longitude, p.latitude]`) |
| 3.9 | Falls back to the simulated map when no path exists | PASS | `features/maps/components/TriwayMap.tsx:63-65` returns `<SimulatedMap />` when `!sim || !pins || !bounds` |
| 3.10 | Attribution is shown | FAIL | `TriwayMap.web.tsx:108` sets `attributionControl: false` and neither `TriwayMap.tsx` nor `TriwayMap.web.tsx` renders `"OpenStreetMap contributors"` on the map UI (only `app/(rider)/search.tsx:96` has it for search) |
| 4.1 | URL is `https://photon.komoot.io/api/` | PASS | `features/maps/services/photonGeocoder.ts:19` |
| 4.2 | `bbox` is ordered `minLon,minLat,maxLon,maxLat` | PASS | `features/maps/services/photonGeocoder.ts:11` (`southWest.lng,southWest.lat,northEast.lng,northEast.lat`) |
| 4.3 | Coordinates read as `[lon, lat]` from `geometry.coordinates` | PASS | `features/maps/services/photonGeocoder.ts:36` (`const [lon, lat] = f.geometry.coordinates;`) |
| 4.4 | Query shorter than 3 characters sends no request | FAIL | `features/maps/hooks/usePlaceSearch.ts:11` and `photonGeocoder.ts:15` default `minChars: number = 1`; `app/(rider)/search.tsx:23` calls `usePlaceSearch(query)` without `minChars=3`, so 1- and 2-char queries send Photon API requests |
| 4.5 | Search is debounced (about 400 ms) and old requests are cancelled | PASS | `features/maps/hooks/usePlaceSearch.ts:28-46` uses `AbortController` and `setTimeout(..., 300)` |
| 4.6 | Errors are handled | PASS | `features/maps/hooks/usePlaceSearch.ts:34-40` sets `'Unable to load place results.'`; `app/(rider)/search.tsx:67` displays `placesError` |
| 4.7 | `usePlaceSearch` is used by the rider search screen | PASS | `app/(rider)/search.tsx:11,23` |
| 4.8 | The bbox comes from `SERVICE_AREA.bounds` | PASS | `features/maps/services/photonGeocoder.ts:1,11` |
| 4.9 | `SERVICE_AREA.bounds` values | UNKNOWN | `constants/config.ts:7-10` (`northEast: 14.72, 121.31`, `southWest: 14.48, 121.08`). `docs/coverage-audit.md:11` notes Calawis, San Jose, and Inarawan are inside bounds, but **San Juan** is `"Unverified (no barangay hall found in Photon/OpenStreetMap; fell back to San Isidro coordinates)"` |
| 4.10 | Search results show "© OpenStreetMap contributors" | PASS | `app/(rider)/search.tsx:96` (`Search data © OpenStreetMap contributors via Photon`) |
| 5.1 | Photon answers for "Antipolo Cathedral" | PASS | HTTP 200; `Antipolo Cathedral: 121.1766573, 14.5876939`, `Antipolo Cathedral Complex: 121.1765208, 14.5875763` |
| 5.2 | Photon answers for "Boso-Boso Church" | PASS | HTTP 200; `Bosoboso Church: 121.2381174, 14.6395312`, `Simbahan ng Lumang Bosoboso: 121.2382125, 14.6395995` |
| 5.3 | Coordinates fall inside `SERVICE_AREA.bounds` | PASS | Both `14.58769, 121.17666` and `14.63953, 121.23812` sit inside `14.48..14.72`, `121.08..121.31` |
| 5.4 | OpenFreeMap style URL responds | PASS | HTTP `200` from `https://tiles.openfreemap.org/styles/liberty` |
| 6.1 | `routePaths` is not empty | PASS | `data/routePaths.ts:2-5` has 2 entries |
| 6.2 | Every route `id` in `data/routes.ts` has a path in `routePaths` | FAIL | Only 2 of 7 routes in `data/routes.ts` have precompiled paths (`cathedral-taktak`, `ynares-city-hall`). Missing 5: `masinag-robinsons`, `cogeo-market`, `sumulong-cathedral`, `dela-paz-masinag`, `marcos-sta-lucia` |
| 6.3 | `approachPaths` exists | PASS | `data/routePaths.ts:7-10` exports `approachPaths` |
| 6.4 | Each stored path decodes to 2 or more points | PASS | `routePaths`: `cathedral-taktak` (76 pts), `ynares-city-hall` (71 pts); `approachPaths`: `cathedral-taktak` (55 pts), `ynares-city-hall` (92 pts) |
| 6.5 | Decoded points sit inside Antipolo (`14.48..14.72`, `121.08..121.31`) | PASS | All 4 encoded polylines decode with `outside=0` (lat `14.58501..14.59498`, lng `121.16765..121.18590`) |
| 6.6 | Quick Return reverses the path | PASS | `features/maps/utils/routePath.ts:9` (`return isReturnLeg ? [...points].reverse() : points;`) |
| 6.7 | A route with no path does not crash | PASS | `routePath.ts:7` returns `[]`; `useRideSimulation.ts:56-95` attempts dynamic routing and `TriwayMap.tsx:63-65` / `TriwayMap.web.tsx:244-246` fall back to `<SimulatedMap />` |
| 6.8 | "Simulated, not live GPS" text is still on the tracking, progress and driver ride screens | PASS | `app/(rider)/tracking.tsx:28`, `app/(rider)/progress.tsx:45`, and `app/(driver)/ride.tsx:28` (renders `sim.subline` from `useRideSimulation.ts:141,146,150`) |
| 6.9 | No invented routes, fares or place names | PASS | `data/routes.ts:4-12` marks all routes with `TODO` and `Antipolo City, Rizal placeholder route` |
| 7.1 | `TriwayMap.web.tsx` does not import the native MapLibre package | PASS | `features/maps/components/TriwayMap.web.tsx:1` imports `maplibre-gl` only |
| 7.2 | If it uses MapLibre GL JS, `maplibre-gl` is in `package.json` | PASS | Uses `maplibre-gl` with `<SimulatedMap />` fallback; `"maplibre-gl": "^6.14.0"` in `package.json:22` |
| 7.3 | Web export completes | PASS | `npx expo export --platform web --output-dir "$env:TEMP\triway-maps-web-check"` succeeded (exit code 0, 1014 modules bundled) |
| 7.4 | No `window` or `document` use at the top level of map files | PASS | `window` is used only inside `useEffect` in `features/maps/components/TriwayMap.web.tsx:71,132,212` |
| 8.1 | Typecheck passes | PASS | `npm run typecheck` exited with code 0 |
| 8.2 | Lint passes | PASS | `npm run lint` exited with code 0 |

## Blocking problems
1. **Missing precompiled route paths for 5 of 7 fixture routes (Check 6.2):** `data/routePaths.ts` only contains polylines for `cathedral-taktak` and `ynares-city-hall`. The remaining 5 routes (`masinag-robinsons`, `cogeo-market`, `sumulong-cathedral`, `dela-paz-masinag`, `marcos-sta-lucia`) have no precompiled polylines, forcing runtime OSRM calls or straight-line/simulated fallback when offline.
2. **Short queries (< 3 chars) trigger Photon API requests (Check 4.4):** `usePlaceSearch.ts:11` and `photonGeocoder.ts:15` changed the default `minChars` to `1`, and `app/(rider)/search.tsx:23` calls `usePlaceSearch(query)` without passing `3`. Typing 1 or 2 characters sends live requests to Photon even though `search.tsx:63` hides the UI until 3 characters.

## Non-blocking problems
1. **Map attribution hidden on web / missing in UI text (Check 3.10):** `TriwayMap.web.tsx:108` disables the MapLibre attribution control (`attributionControl: false`) without rendering an `"© OpenStreetMap contributors"` caption below or inside the map container.
2. **Unverified far-upland barangay coordinates in coverage audit (Check 4.9):** `docs/coverage-audit.md:11-13` notes that **San Juan** fell back to San Isidro's coordinates, **Cogeo Public Market** resolved to Antipolo Public Market, and **Sta. Lucia East Grand Mall** sits on the Cainta boundary.
3. **Runtime OSRM calls in `useRideSimulation.ts`:** Commit `e74abd1` added `features/maps/services/osrmRouting.ts` which calls `router.project-osrm.org` and Photon dynamically during ride simulation when a route has no precompiled path.

## Needs a human
- [ ] The map tiles actually show (needs internet).
- [ ] Each route line sits on the right roads, and uphill routes use roads a tricycle can use.
- [ ] The orange driver dot moves along the line during `arriving` and `ongoing`.
- [ ] Searching "Boso-Boso", "Calawis", "Cloud 9" and "Pinto Art Museum" returns sensible places.
- [ ] Searching a place outside Antipolo returns nothing.
- [ ] With no internet, the app falls back without crashing.
- [ ] On the Vercel web build, the map screen loads and does not go blank.

> Reminder: MapLibre does **not** run in Expo Go. Run `npx expo start --dev-client` with a development build.

## Top 3 Next Steps
1. **Precompile all 7 fixture routes into `data/routePaths.ts`:** Fix the coordinates for `Cogeo Public Market` / `Sta. Lucia East Grand Mall` in `scripts/generate-route-paths.js` and regenerate `data/routePaths.ts` so all 7 routes in `data/routes.ts` have offline-ready road and approach polylines.
2. **Restore the 3-character minimum guard in `usePlaceSearch` / `photonGeocoder`:** Change `minChars` default back to `3` in `features/maps/hooks/usePlaceSearch.ts` and `features/maps/services/photonGeocoder.ts` (or pass `3` in `app/(rider)/search.tsx`) to respect Photon rate limits.
3. **Add visible OpenStreetMap attribution to `TriwayMap` and test on a real Android dev build:** Render `"© OpenStreetMap contributors"` on the map component (especially for `TriwayMap.web.tsx` where `attributionControl: false` is set) and run the Section 9 human checklist on a phone using `npx expo start --dev-client`.
