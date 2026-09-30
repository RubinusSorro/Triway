import { SERVICE_AREA_SHORT_LABEL } from '@/constants/config';
import { TriwayRoute } from '@/features/routes/types/route';

// TODO: Replace with the verified Antipolo tricycle route list and regulated fares.
export const fallbackRoutes: TriwayRoute[] = [
  { id: 'masinag-robinsons', name: 'Masinag Junction – Robinsons Place Antipolo', origin: 'Masinag Junction', destination: 'Robinsons Place Antipolo', distanceKm: 6.2, baseFare: 70, etaMinutes: 18, notes: `${SERVICE_AREA_SHORT_LABEL} placeholder route` },
  { id: 'cathedral-taktak', name: 'Antipolo Cathedral – Hinulugang Taktak', origin: 'Antipolo Cathedral', destination: 'Hinulugang Taktak', distanceKm: 2.8, baseFare: 60, etaMinutes: 10, notes: `${SERVICE_AREA_SHORT_LABEL} placeholder route` },
  { id: 'cogeo-market', name: 'Cogeo Gate 2 – Cogeo Public Market', origin: 'Cogeo Gate 2', destination: 'Cogeo Public Market', distanceKm: 2.1, baseFare: 50, etaMinutes: 8, notes: `${SERVICE_AREA_SHORT_LABEL} placeholder route` },
  { id: 'sumulong-cathedral', name: 'Sumulong Highway – Antipolo Cathedral', origin: 'Sumulong Highway', destination: 'Antipolo Cathedral', distanceKm: 4.6, baseFare: 65, etaMinutes: 14, notes: `${SERVICE_AREA_SHORT_LABEL} placeholder route` },
  { id: 'dela-paz-masinag', name: 'Dela Paz – Masinag Junction', origin: 'Dela Paz', destination: 'Masinag Junction', distanceKm: 3.7, baseFare: 55, etaMinutes: 12, notes: `${SERVICE_AREA_SHORT_LABEL} placeholder route` },
  { id: 'ynares-city-hall', name: 'Ynares Center – Antipolo City Hall', origin: 'Ynares Center', destination: 'Antipolo City Hall', distanceKm: 3.2, baseFare: 55, etaMinutes: 11, notes: `${SERVICE_AREA_SHORT_LABEL} placeholder route` },
  { id: 'marcos-sta-lucia', name: 'Marcos Highway – Sta. Lucia East Grand Mall', origin: 'Marcos Highway', destination: 'Sta. Lucia East Grand Mall', distanceKm: 5.5, baseFare: 70, etaMinutes: 17, notes: `${SERVICE_AREA_SHORT_LABEL} placeholder route` },
];
