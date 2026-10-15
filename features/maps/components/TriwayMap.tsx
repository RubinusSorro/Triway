import { Camera, GeoJSONSource, Layer, LngLatBounds, Map } from '@maplibre/maplibre-react-native';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';
import { SimulatedMap } from '@/features/rides/components/SimulatedMap';
import { RideStatus } from '@/features/rides/types/ride';
import { RideSimulation } from '../hooks/useRideSimulation';
import { LatLng } from '../types';

const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';

export type TriwayMapProps = {
  sim?: RideSimulation;
  routeId?: string;
  isReturnLeg?: boolean;
  pickup: string;
  destination: string;
  status?: RideStatus;
};

const toLngLat = (p: LatLng): [number, number] => [p.longitude, p.latitude];

const lineFeature = (points: LatLng[]): GeoJSON.Feature<GeoJSON.LineString> => ({
  type: 'Feature',
  properties: {},
  geometry: { type: 'LineString', coordinates: points.map(toLngLat) },
});

export function TriwayMap({ sim, pickup, destination, status = 'requested' }: TriwayMapProps) {
  const tripPoints = sim?.tripPoints ?? [];
  const approachPoints = sim?.approachPoints ?? [];
  const driver = sim?.driver;
  const showApproach = status === 'arriving' && approachPoints.length > 1;

  const tripLine = useMemo(() => lineFeature(tripPoints), [tripPoints]);
  const approachLine = useMemo(() => lineFeature(approachPoints), [approachPoints]);

  const pins = useMemo((): GeoJSON.FeatureCollection | null => {
    if (tripPoints.length < 2) return null;
    const pin = (kind: string, p: LatLng): GeoJSON.Feature => ({
      type: 'Feature',
      properties: { kind },
      geometry: { type: 'Point', coordinates: toLngLat(p) },
    });
    const features: GeoJSON.Feature[] = [
      pin('pickup', tripPoints[0]),
      pin('destination', tripPoints[tripPoints.length - 1]),
    ];
    if (driver) features.push(pin('driver', driver));
    return { type: 'FeatureCollection', features };
  }, [tripPoints, driver]);

  const bounds = useMemo((): LngLatBounds | undefined => {
    const all = showApproach ? [...tripPoints, ...approachPoints] : tripPoints;
    if (all.length < 2) return undefined;
    const lons = all.map((p) => p.longitude);
    const lats = all.map((p) => p.latitude);
    // LngLatBounds in MapLibre RN v11 is [west, south, east, north]
    return [Math.min(...lons), Math.min(...lats), Math.max(...lons), Math.max(...lats)];
  }, [tripPoints, approachPoints, showApproach]);

  if (!sim || !pins || !bounds) {
    return <SimulatedMap pickup={pickup} destination={destination} status={status} />; // safe fallback
  }

  return (
    <View style={styles.wrap}>
      <Map style={StyleSheet.absoluteFill} mapStyle={STYLE_URL}>
        <Camera
          bounds={bounds}
          padding={{ top: 40, bottom: 40, left: 40, right: 40 }}
          duration={0}
        />
        <GeoJSONSource id="trip" data={tripLine}>
          <Layer
            id="tripLine"
            type="line"
            paint={{
              'line-color': colors.primary,
              'line-width': 5,
            }}
            layout={{
              'line-cap': 'round',
              'line-join': 'round',
            }}
          />
        </GeoJSONSource>
        {showApproach ? (
          <GeoJSONSource id="approach" data={approachLine}>
            <Layer
              id="approachLine"
              type="line"
              paint={{
                'line-color': '#EF6C00',
                'line-width': 4,
                'line-dasharray': [2, 2],
              }}
              layout={{
                'line-cap': 'round',
                'line-join': 'round',
              }}
            />
          </GeoJSONSource>
        ) : null}
        <GeoJSONSource id="pins" data={pins}>
          <Layer
            id="pinCircles"
            type="circle"
            paint={{
              'circle-radius': ['match', ['get', 'kind'], 'driver', 10, 8] as any,
              'circle-color': [
                'match',
                ['get', 'kind'],
                'pickup',
                '#2E7D32',
                'destination',
                '#1565C0',
                '#EF6C00',
              ] as any,
              'circle-stroke-width': 2,
              'circle-stroke-color': '#FFFFFF',
            }}
          />
        </GeoJSONSource>
      </Map>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 240,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
