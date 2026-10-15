import { SimulatedMap } from '@/features/rides/components/SimulatedMap';
import { TriwayMapProps } from './TriwayMap';

export function TriwayMap({ pickup, destination, status }: TriwayMapProps) {
  return <SimulatedMap pickup={pickup} destination={destination} status={status} />;
}
