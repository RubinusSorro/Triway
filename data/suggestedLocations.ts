import { SERVICE_AREA_SHORT_LABEL } from '@/constants/config';

export type SuggestedLocation = { id: string; name: string; subtitle: string; estimatedFare: number };

// TODO: Replace with geocoding/API suggestions and verified fares.
export const fallbackSuggestedLocations: SuggestedLocation[] = [
  { id: 'cathedral', name: 'Antipolo Cathedral', subtitle: SERVICE_AREA_SHORT_LABEL, estimatedFare: 50 },
  { id: 'taktak', name: 'Hinulugang Taktak', subtitle: SERVICE_AREA_SHORT_LABEL, estimatedFare: 60 },
  { id: 'robinsons', name: 'Robinsons Place Antipolo', subtitle: SERVICE_AREA_SHORT_LABEL, estimatedFare: 70 },
];
