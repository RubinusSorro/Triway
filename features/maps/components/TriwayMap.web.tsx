import type * as MapLibreGL from 'maplibre-gl';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import { SimulatedMap } from '@/features/rides/components/SimulatedMap';
import { LatLng } from '../types';
import { TriwayMapProps } from './TriwayMap';

const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';
const WORKER_URL = 'https://unpkg.com/maplibre-gl@6.14.0/dist/maplibre-gl-worker.mjs';

// Module-level cache for client-side evaluation
let cachedMaplibre: typeof MapLibreGL | null = null;

const toLngLat = (p: LatLng): [number, number] => [p.longitude, p.latitude];

const lineFeature = (points: LatLng[]): GeoJSON.Feature<GeoJSON.LineString> => ({
  type: 'Feature',
  properties: {},
  geometry: { type: 'LineString', coordinates: points.map(toLngLat) },
});

export function TriwayMap({ sim, pickup, destination, status = 'requested' }: TriwayMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [maplibregl, setMaplibregl] = useState<typeof MapLibreGL | null>(cachedMaplibre);
  const [containerNode, setContainerNode] = useState<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreGL.Map | null>(null);
  const isMapLoadedRef = useRef(false);

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

  const bounds = useMemo((): [number, number, number, number] | undefined => {
    const all = showApproach ? [...tripPoints, ...approachPoints] : tripPoints;
    if (all.length < 2) return undefined;
    const lons = all.map((p) => p.longitude);
    const lats = all.map((p) => p.latitude);
    return [Math.min(...lons), Math.min(...lats), Math.max(...lons), Math.max(...lats)];
  }, [tripPoints, approachPoints, showApproach]);

  // Client-side only mount check & dynamic import
  useEffect(() => {
    setIsMounted(true);

    if (cachedMaplibre) {
      setMaplibregl(cachedMaplibre);
      return;
    }

    if (typeof window !== 'undefined') {
      Promise.all([
        import('maplibre-gl'),
        // @ts-expect-error CSS side-effect import
        import('maplibre-gl/dist/maplibre-gl.css').catch(() => {}),
      ])
        .then(([mod]) => {
          const lib = ((mod as any).default ?? mod) as typeof MapLibreGL;
          if (typeof (lib as any).setWorkerUrl === 'function') {
            (lib as any).setWorkerUrl(WORKER_URL);
          }
          if ('workerUrl' in lib || !(lib as any).workerUrl) {
            (lib as any).workerUrl = WORKER_URL;
          }
          cachedMaplibre = lib;
          setMaplibregl(lib);
        })
        .catch((err) => {
          console.warn('[TriwayMap.web] Failed to load MapLibre GL:', err);
        });
    }
  }, []);

  // Initialize MapLibre GL instance
  useEffect(() => {
    if (!isMounted || !maplibregl || !containerNode || !bounds || tripPoints.length < 2) return;

    isMapLoadedRef.current = false;
    if (typeof (maplibregl as any).setWorkerUrl === 'function') {
      (maplibregl as any).setWorkerUrl(WORKER_URL);
    }

    const map = new maplibregl.Map({
      container: containerNode,
      style: STYLE_URL,
      center: [tripPoints[0].longitude, tripPoints[0].latitude],
      zoom: 13,
      attributionControl: false,
      trackResize: true,
    });

    map.on('error', (e) => {
      if (e?.error?.message && !e.error.message.includes('abort')) {
        console.warn('[TriwayMap.web] MapLibre warning:', e.error.message);
      }
    });

    mapRef.current = map;

    // Resize observer to ensure canvas stays properly sized within React Native Web flex layout
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        map.resize();
      });
      ro.observe(containerNode);
    }

    const handleResize = () => {
      map.resize();
    };
    window.addEventListener('resize', handleResize);

    const resizeTimer1 = setTimeout(() => map.resize(), 100);
    const resizeTimer2 = setTimeout(() => map.resize(), 300);

    map.on('load', () => {
      isMapLoadedRef.current = true;
      map.resize();

      // Trip route layer
      map.addSource('trip', { type: 'geojson', data: tripLine });
      map.addLayer({
        id: 'tripLine',
        type: 'line',
        source: 'trip',
        paint: {
          'line-color': colors.primary,
          'line-width': 5,
        },
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
      });

      // Approach route layer
      map.addSource('approach', { type: 'geojson', data: approachLine });
      map.addLayer({
        id: 'approachLine',
        type: 'line',
        source: 'approach',
        paint: {
          'line-color': '#EF6C00',
          'line-width': 4,
          'line-dasharray': [2, 2],
        },
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
          visibility: showApproach ? 'visible' : 'none',
        },
      });

      // Pins layer
      if (pins) {
        map.addSource('pins', { type: 'geojson', data: pins });
        map.addLayer({
          id: 'pinCircles',
          type: 'circle',
          source: 'pins',
          paint: {
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
          },
        });
      }

      // Initial fit bounds
      map.fitBounds(
        [
          [bounds[0], bounds[1]],
          [bounds[2], bounds[3]],
        ],
        { padding: 40, duration: 0 },
      );
    });

    return () => {
      clearTimeout(resizeTimer1);
      clearTimeout(resizeTimer2);
      window.removeEventListener('resize', handleResize);
      ro?.disconnect();
      isMapLoadedRef.current = false;
      map.remove();
      mapRef.current = null;
    };
    // Re-mount map if container node or initial trip route changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, maplibregl, containerNode, tripPoints.length]);

  // Update dynamic data (driver position, approach line) on simulation progress
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoadedRef.current || !maplibregl) return;

    const tripSource = map.getSource('trip') as MapLibreGL.GeoJSONSource | undefined;
    if (tripSource) {
      tripSource.setData(tripLine);
    }

    const approachSource = map.getSource('approach') as MapLibreGL.GeoJSONSource | undefined;
    if (approachSource) {
      approachSource.setData(approachLine);
      map.setLayoutProperty('approachLine', 'visibility', showApproach ? 'visible' : 'none');
    }

    const pinsSource = map.getSource('pins') as MapLibreGL.GeoJSONSource | undefined;
    if (pinsSource && pins) {
      pinsSource.setData(pins);
    }
  }, [maplibregl, tripLine, approachLine, pins, showApproach]);

  if (!isMounted || !maplibregl || !sim || !pins || !bounds) {
    return <SimulatedMap pickup={pickup} destination={destination} status={status} />;
  }

  return (
    <View style={styles.wrap}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .maplibregl-map { width: 100%; height: 100%; position: relative; }
            .maplibregl-canvas-container { width: 100%; height: 100%; position: absolute; }
            .maplibregl-canvas { width: 100% !important; height: 100% !important; position: absolute; top: 0; left: 0; }
          `,
        }}
      />
      <div
        ref={setContainerNode}
        style={{
          width: '100%',
          height: 240,
          minHeight: 240,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <Text pointerEvents="none" style={styles.attribution}>© OpenStreetMap contributors · OpenFreeMap</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 240,
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  attribution: {
    position: 'absolute',
    right: 8,
    bottom: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    fontSize: 10,
    color: colors.textMuted,
  },
});
