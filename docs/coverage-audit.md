# Antipolo Coverage Audit Results

Date: October 15, 2026
Script: `scripts/audit-antipolo-coverage.js`

## Executive Summary & Decisions

- **Bounds decision:** Current `SERVICE_AREA` bounds (`constants/config.ts`) remain **unchanged** (`northEast: { lat: 14.72, lng: 121.31 }, southWest: { lat: 14.48, lng: 121.08 }`).
- Every audited point is inside the current bounds with margin.
- **Barangay halls are not boundary points:** San Jose hall (`14.587, 121.178`) and Boso-Boso Church in San Jose (`14.640, 121.238`) are about 9 km apart, so the audit check against barangay halls is only partial.
- **San Juan:** Unverified (no barangay hall found in Photon/OpenStreetMap; fell back to San Isidro coordinates).
- **Cogeo Public Market:** Resolved to Antipolo Public Market (`14.59540, 121.17088`) in Banker's Village/Dela Paz; needs manual coordinates for Cogeo.
- **Sta. Lucia East Grand Mall:** Located on the Cainta side per OpenStreetMap (`14.61761, 121.09970`); needs a decision from the team lead regarding service area inclusion.
- **Zone classifications:** Cloud 9 (`14.61298, 121.15519`), Pinto Art Museum (`14.58082, 121.16419`), and Luljetta's Hanging Gardens (`14.56042, 121.17485`) are near the city center, not far upland.

---

## Service Area Bounds

- **North:** 14.72
- **South:** 14.48
- **East:** 121.31
- **West:** 121.08

---

## Cleaned Audit Output

```text
Current bounds: N 14.72  S 14.48  E 121.31  W 121.08

[barangay] Bagong Nayon
  -> Bagong Nayon Barangay Council, Antipolo
  -> 14.62597, 121.16842 
[barangay] Beverly Hills
  -> Beverly Hills, Antipolo
  -> 14.58441, 121.15854 
[barangay] Calawis
  -> Calawis Barangay Hall, barangay road, Binayoyo, Antipolo
  -> 14.67148, 121.24170 
[barangay] Cupang
  -> Cupang Barangay Hall, Saint Ignatius Street, Maria Corazon Homes, Antipolo
  -> 14.63598, 121.12394 
[barangay] Dalig
  -> Dalig Barangay Hall, Dalig, Antipolo
  -> 14.57291, 121.18648 
[barangay] Dela Paz
  -> Dela Paz, Antipolo
  -> 14.58867, 121.17398 
[barangay] Inarawan
  -> Inarawan Barangay Council, Saint Anthony Street, Phase III-D, Antipolo
  -> 14.62466, 121.18047 
[barangay] Mambugan
  -> Mambugan Barangay Hall, Sumulong Highway, Hollywood Hills, Antipolo
  -> 14.61894, 121.14059 
[barangay] Mayamot
  -> Mayamot Barangay Hall, Sumulong Highway, Broadway Pines, Antipolo
  -> 14.62981, 121.12021 
[barangay] Muntingdilaw
  -> Muntingdilaw Barangay Hall, Saint Martin de Porres Street, Muntingdilaw, Antipolo
  -> 14.59815, 121.13086 
[barangay] San Isidro
  -> San Isidro Barangay Hall, Saint Mary, Our Lady of Fatima, Antipolo
  -> 14.59495, 121.18547   !! IDENTICAL COORDINATES WITH San Juan
[barangay] San Jose
  -> San Jose Barangay Hall, J. P. Carigma Street, Parugan, Antipolo
  -> 14.58697, 121.17836 
[barangay] San Juan
  -> San Isidro Barangay Hall, Saint Mary, Our Lady of Fatima, Antipolo
  -> 14.59495, 121.18547   !! LABEL DOES NOT CONTAIN SEARCHED NAME | IDENTICAL COORDINATES WITH San Isidro
[barangay] San Luis
  -> San Luis Barangay Hall, Mahogany Street, Town & Country Heights 1, Antipolo
  -> 14.60442, 121.19826 
[barangay] San Roque
  -> San Roque, Antipolo
  -> 14.58407, 121.17315 
[barangay] Santa Cruz
  -> Santa Cruz, Antipolo
  -> 14.61606, 121.16979 
[zone 1] Masinag Junction
  -> Antipolo, Marcos Highway, Masinag, Antipolo
  -> 14.62477, 121.12131 
[zone 1] SM City Masinag
  -> SM City Masinag, Marcos Highway, Masinag, Antipolo
  -> 14.62578, 121.12042 
[zone 1] Sta. Lucia East Grand Mall
  -> Sta. Lucia East Grand Mall, Marcos Highway, Dela Paz, Cainta
  -> 14.61761, 121.09970   !! NOT CLEARLY ANTIPOLO, CHECK BY HAND
[zone 1] Cogeo Public Market
  -> Antipolo Public Market, Garcia Street, Banker's Village, Antipolo
  -> 14.59540, 121.17088   !! LABEL DOES NOT CONTAIN SEARCHED NAME | RESOLVED TO ANTIPOLO PUBLIC MARKET INSTEAD OF COGEO
[zone 1] Cogeo Gate 2
  -> Cogeo Gate 2, Marcos Highway, Cogeo Village, Antipolo
  -> 14.62141, 121.16854 
[zone 2] Sen. Lorenzo Sumulong Memorial Circle
  -> Senator L. Sumulong Memorial Circle, Dela Paz, Antipolo
  -> 14.58730, 121.17010 
[zone 2] Antipolo Cathedral
  -> Antipolo Cathedral, M. L. Quezon Street, Dela Paz, Antipolo
  -> 14.58769, 121.17666 
[zone 2] Hinulugang Taktak
  -> Hinulugang Taktak, Antipolo
  -> 14.59468, 121.16766 
[zone 2] Antipolo City Hall
  -> Antipolo City Hall, P. Burgos Street, Villa Carmen Subdivision, Antipolo
  -> 14.58618, 121.17593 
[zone 2] Rizal Provincial Capitol
  -> Rizal Provincial Capitol, Senator L. Sumulong Memorial Circle, San Roque, Antipolo
  -> 14.58613, 121.16924 
[zone 2] Robinsons Place Antipolo
  -> Robinsons Place Antipolo, Antipolo
  -> 14.59563, 121.17314 
[zone 2] Ynares Center
  -> Ynares Center, Senator L. Sumulong Memorial Circle, San Roque, Antipolo
  -> 14.58549, 121.17058 
[zone 2] Victory Park and Shop
  -> Victory Park & Shop basement parking, M. L. Quezon Street, Dela Paz, Antipolo
  -> 14.58883, 121.17590 
[zone 3] Cloud 9 Antipolo
  -> Cloud 9, Sumulong Highway, Palos Verdes, Antipolo
  -> 14.61298, 121.15519 
[zone 3] Boso-Boso Church
  -> Bosoboso Church, Boso-Boso Road, Antipolo
  -> 14.63953, 121.23812 
[zone 3] Pinto Art Museum
  -> Pinto Art Museum, Sierra Madre Street, Grand Heights, Antipolo
  -> 14.58082, 121.16419 
[zone 3] Luljetta's Hanging Gardens
  -> Luljetta hanging gardens spasa, Beverly, Santa Barbara 2, Antipolo
  -> 14.56042, 121.17485 

Range of results that looked like Antipolo:
  lat 14.5492 to 14.6715   lon 121.1195 to 121.2417
```
