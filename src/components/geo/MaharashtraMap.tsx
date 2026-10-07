'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useGroundTruth } from '@/context/GroundTruthContext';
import { 
  Layers, 
  MapPin, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  CheckCircle2, 
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ShieldAlert,
  HelpCircle,
  Eye,
  Filter,
  Maximize2
} from 'lucide-react';
import { MapLayerMode } from '@/types';
import { MAHARASHTRA_CENTER, MAHARASHTRA_BOUNDS, DISTRICT_COORDINATES } from '@/data/geo/geoConstants';
import { CARTO_DARK_MATTER_URL, LOCAL_DARK_BASEMAP_STYLE } from '@/data/geo/mapStyles';

export function MaharashtraMap() {
  const { 
    units, 
    selectedUnitId, 
    selectUnit, 
    recentlyUpdatedUnitId, 
    mapLayer, 
    setMapLayer 
  } = useGroundTruth();

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const [is3DMode, setIs3DMode] = useState<boolean>(true);
  const [showDistricts, setShowDistricts] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showCoverage, setShowCoverage] = useState<boolean>(true);
  const [isLayersOpen, setIsLayersOpen] = useState<boolean>(false);
  const [hoveredUnitId, setHoveredUnitId] = useState<string | null>(null);
  const [hoveredDistrictName, setHoveredDistrictName] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const selectedUnit = useMemo(() => {
    return units.find((u) => u.id === selectedUnitId);
  }, [units, selectedUnitId]);

  // Initialize MapLibre
  useEffect(() => {
    if (!mapContainer.current) return;

    // Explicitly configure web worker path for Next.js / Turbopack
    if (typeof window !== 'undefined' && maplibregl.setWorkerUrl) {
      maplibregl.setWorkerUrl('/maplibre-gl-worker.mjs');
    }

    let map: maplibregl.Map;

    try {
      map = new maplibregl.Map({
        container: mapContainer.current,
        style: CARTO_DARK_MATTER_URL,
        center: MAHARASHTRA_CENTER,
        zoom: 6.2,
        pitch: 32,
        bearing: 4,
        attributionControl: false,
        maxBounds: [
          [71.0, 14.5],
          [82.5, 23.0],
        ],
      });
    } catch {
      map = new maplibregl.Map({
        container: mapContainer.current,
        style: LOCAL_DARK_BASEMAP_STYLE,
        center: MAHARASHTRA_CENTER,
        zoom: 6.2,
        pitch: 32,
        bearing: 4,
        attributionControl: false,
      });
    }

    mapRef.current = map;

    map.on('load', () => {
      // 1. Add Maharashtra State Outline Source
      map.addSource('mh-state', {
        type: 'geojson',
        data: '/geo/maharashtra.geojson',
      });

      // 2. Add Maharashtra Districts Source
      map.addSource('mh-districts', {
        type: 'geojson',
        data: '/geo/maharashtra_districts.geojson',
      });

      // 3. Add Operational Units Source (Dynamic from Context units)
      map.addSource('operational-units', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: units.map((u) => ({
            type: 'Feature',
            id: u.id,
            properties: {
              id: u.id,
              name: u.name,
              district: u.district,
              stress: u.stress,
              confidence: u.confidence,
              uncertainty: u.uncertainty,
              exposure: u.exposure,
              priorityLevel: u.priorityLevel,
              status: u.status,
              evidenceCount: u.evidenceCount,
            },
            geometry: {
              type: 'Point',
              coordinates: [u.coordinates.lng, u.coordinates.lat],
            },
          })),
        },
      });

      // District Fills with thematic coloring based on pilot priority/stress
      map.addLayer({
        id: 'districts-fill',
        type: 'fill',
        source: 'mh-districts',
        paint: {
          'fill-color': [
            'case',
            ['==', ['get', 'priority'], 'CRITICAL'],
            '#2b1718', // muted dark crimson
            ['==', ['get', 'priority'], 'HIGH'],
            '#2a2012', // muted dark amber
            ['==', ['get', 'priority'], 'MEDIUM'],
            '#1c241d', // muted dark olive
            ['==', ['get', 'priority'], 'LOW'],
            '#15201d', // muted teal dark
            '#0d1420', // neutral unmonitored district
          ],
          'fill-opacity': 0.75,
        },
      });

      // District Borders
      map.addLayer({
        id: 'districts-border',
        type: 'line',
        source: 'mh-districts',
        paint: {
          'line-color': [
            'case',
            ['==', ['get', 'priority'], 'CRITICAL'],
            '#FF5A52',
            ['==', ['get', 'priority'], 'HIGH'],
            '#F4B740',
            '#26384e',
          ],
          'line-width': [
            'case',
            ['==', ['get', 'priority'], 'CRITICAL'],
            1.4,
            0.75,
          ],
          'line-opacity': 0.8,
        },
      });

      // Maharashtra Outer Perimeter Highlight
      map.addLayer({
        id: 'state-perimeter',
        type: 'line',
        source: 'mh-state',
        paint: {
          'line-color': '#D7FF65',
          'line-width': 2.0,
          'line-opacity': 0.6,
        },
      });

      // Monitored Unit Halos / Uncertainty Aura
      map.addLayer({
        id: 'units-halo',
        type: 'circle',
        source: 'operational-units',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            5, 8,
            8, 18,
            12, 32
          ],
          'circle-color': [
            'case',
            ['==', ['get', 'status'], 'VERIFIED'],
            '#55D6A0',
            ['==', ['get', 'priorityLevel'], 'CRITICAL'],
            '#FF5A52',
            ['==', ['get', 'priorityLevel'], 'HIGH'],
            '#F4B740',
            '#D7FF65',
          ],
          'circle-opacity': 0.22,
          'circle-blur': 0.6,
        },
      });

      // Monitored Operational Unit Core Points
      map.addLayer({
        id: 'units-core',
        type: 'circle',
        source: 'operational-units',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            5, 4.5,
            8, 7.5,
            12, 12
          ],
          'circle-color': [
            'case',
            ['==', ['get', 'status'], 'VERIFIED'],
            '#55D6A0',
            ['==', ['get', 'priorityLevel'], 'CRITICAL'],
            '#FF5A52',
            ['==', ['get', 'priorityLevel'], 'HIGH'],
            '#F4B740',
            '#D7FF65',
          ],
          'circle-stroke-width': 1.8,
          'circle-stroke-color': '#070B12',
          'circle-opacity': 0.95,
        },
      });

      // Selected Unit Ring
      map.addLayer({
        id: 'unit-selected-ring',
        type: 'circle',
        source: 'operational-units',
        filter: ['==', ['get', 'id'], ''],
        paint: {
          'circle-radius': 13,
          'circle-color': 'transparent',
          'circle-stroke-width': 2.5,
          'circle-stroke-color': '#D7FF65',
        },
      });

      // Hover on District
      map.on('mousemove', 'districts-fill', (e) => {
        if (!e.features || e.features.length === 0) return;
        const name = e.features[0].properties?.name;
        setHoveredDistrictName(name);
        if (e.point) setTooltipPos({ x: e.point.x, y: e.point.y });
      });

      map.on('mouseleave', 'districts-fill', () => {
        setHoveredDistrictName(null);
      });

      // Hover on Operational Unit
      map.on('mousemove', 'units-core', (e) => {
        if (!e.features || e.features.length === 0) return;
        const uId = e.features[0].properties?.id;
        setHoveredUnitId(uId);
        map.getCanvas().style.cursor = 'pointer';
        if (e.point) setTooltipPos({ x: e.point.x, y: e.point.y });
      });

      map.on('mouseleave', 'units-core', () => {
        setHoveredUnitId(null);
        map.getCanvas().style.cursor = '';
      });

      // Click on Operational Unit -> Sync canonical state & open drawer
      map.on('click', 'units-core', (e) => {
        if (!e.features || e.features.length === 0) return;
        const uId = e.features[0].properties?.id;
        if (uId) {
          selectUnit(uId);
        }
      });
    });

    return () => {
      map.remove();
    };
  }, []);

  // Sync unit updates (like field verification submission, new confidence/uncertainty)
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    if (!map.isStyleLoaded()) return;

    const source = map.getSource('operational-units') as maplibregl.GeoJSONSource;
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features: units.map((u) => ({
          type: 'Feature',
          id: u.id,
          properties: {
            id: u.id,
            name: u.name,
            district: u.district,
            stress: u.stress,
            confidence: u.confidence,
            uncertainty: u.uncertainty,
            exposure: u.exposure,
            priorityLevel: u.priorityLevel,
            status: u.status,
            evidenceCount: u.evidenceCount,
          },
          geometry: {
            type: 'Point',
            coordinates: [u.coordinates.lng, u.coordinates.lat],
          },
        })),
      });
    }
  }, [units]);

  // Sync selected unit highlight and camera focus
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    if (!map.isStyleLoaded()) return;

    if (map.getLayer('unit-selected-ring')) {
      map.setFilter('unit-selected-ring', ['==', ['get', 'id'], selectedUnitId || '']);
    }

    if (selectedUnit) {
      map.easeTo({
        center: [selectedUnit.coordinates.lng, selectedUnit.coordinates.lat],
        zoom: Math.max(map.getZoom(), 7.8),
        pitch: is3DMode ? 35 : 0,
        duration: 700,
      });
    }
  }, [selectedUnitId, selectedUnit, is3DMode]);

  // Dynamic thematic styling updates when mapLayer changes (priority vs confidence vs stress vs coverage)
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    if (!map.isStyleLoaded() || !map.getLayer('units-core')) return;

    if (mapLayer === 'confidence') {
      // Confidence mode: high confidence solid green, low confidence soft muted slate
      map.setPaintProperty('units-core', 'circle-color', [
        'step',
        ['get', 'confidence'],
        '#8D98A8', // < 50%
        50, '#F4B740', // 50-75%
        75, '#55D6A0' // > 75%
      ]);
      map.setPaintProperty('units-halo', 'circle-opacity', [
        'interpolate',
        ['linear'],
        ['get', 'uncertainty'],
        0, 0.1,
        100, 0.45
      ]);
    } else if (mapLayer === 'stress') {
      // Stress mode: high stress critical red
      map.setPaintProperty('units-core', 'circle-color', [
        'step',
        ['get', 'stress'],
        '#55D6A0',
        60, '#F4B740',
        75, '#FF5A52'
      ]);
      map.setPaintProperty('units-halo', 'circle-color', '#FF5A52');
    } else if (mapLayer === 'coverage') {
      // Coverage mode: Verified = Teal, Assigned = Amber, Pending = Slate
      map.setPaintProperty('units-core', 'circle-color', [
        'case',
        ['==', ['get', 'status'], 'VERIFIED'], '#55D6A0',
        ['==', ['get', 'status'], 'ASSIGNED'], '#F4B740',
        '#8D98A8'
      ]);
    } else {
      // Priority mode (default)
      map.setPaintProperty('units-core', 'circle-color', [
        'case',
        ['==', ['get', 'status'], 'VERIFIED'], '#55D6A0',
        ['==', ['get', 'priorityLevel'], 'CRITICAL'], '#FF5A52',
        ['==', ['get', 'priorityLevel'], 'HIGH'], '#F4B740',
        '#D7FF65'
      ]);
    }
  }, [mapLayer]);

  // Controls Handlers
  const handleResetCamera = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: MAHARASHTRA_CENTER,
      zoom: 6.2,
      pitch: is3DMode ? 32 : 0,
      bearing: 4,
      duration: 800,
    });
  }, [is3DMode]);

  const toggle3D = useCallback(() => {
    if (!mapRef.current) return;
    const next = !is3DMode;
    setIs3DMode(next);
    mapRef.current.easeTo({
      pitch: next ? 35 : 0,
      duration: 600,
    });
  }, [is3DMode]);

  const activeHoverUnit = useMemo(() => {
    return units.find((u) => u.id === hoveredUnitId);
  }, [units, hoveredUnitId]);

  return (
    <div className="flex-1 flex flex-col bg-[#070B12] relative overflow-hidden select-none h-full border-r border-[#263244]">
      {/* Top Map Context & Layer Toolbar */}
      <div className="h-10 border-b border-[#263244] bg-[#0D1420]/80 backdrop-blur-md px-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center space-x-2 text-xs">
          <span className="font-bold text-[#F4F7FA] font-mono">
            Maharashtra Operations
          </span>
          <span className="text-[#263244]">/</span>
          <span className="text-[#8D98A8] text-[11px] font-mono">12 Monitored Talukas</span>
          <span className="text-[#263244]">/</span>
          <span className="text-[#D7FF65] text-[11px] font-mono uppercase">
            Marathwada Basin
          </span>
        </div>

        {/* 5 Map Category Segmented Controls */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-[#111927] p-0.5 rounded-[6px] border border-[#263244] text-[11px]">
            {(['situation', 'priority', 'confidence', 'stress', 'coverage'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setMapLayer(mode)}
                className={`px-2.5 py-0.5 rounded-[4px] font-mono transition-colors capitalize cursor-pointer ${
                  mapLayer === mode
                    ? 'bg-[#263244] text-[#D7FF65] font-semibold'
                    : 'text-[#8D98A8] hover:text-[#F4F7FA]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* 3D / 2.5D Mode Toggle */}
          <button
            onClick={toggle3D}
            className={`px-2 py-0.5 rounded-[6px] border text-[11px] font-mono font-bold transition-all cursor-pointer ${
              is3DMode
                ? 'bg-[#263244] text-[#D7FF65] border-[#D7FF65]/40'
                : 'bg-[#111927] text-[#8D98A8] border-[#263244] hover:text-[#F4F7FA]'
            }`}
            title="Toggle 3D Pitch / Top-down"
          >
            3D
          </button>
        </div>
      </div>

      {/* Main MapLibre Container */}
      <div className="flex-1 relative overflow-hidden">
        <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

        {/* Floating Minimal Controls Stack inside the map */}
        <div className="absolute top-4 right-4 z-20 flex flex-col space-y-1.5">
          <button
            onClick={() => mapRef.current?.zoomIn()}
            className="p-2 bg-[#0D1420]/90 hover:bg-[#111927] border border-[#263244] text-[#F4F7FA] rounded-[6px] shadow-md transition-all cursor-pointer hover:border-[#D7FF65]/50"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => mapRef.current?.zoomOut()}
            className="p-2 bg-[#0D1420]/90 hover:bg-[#111927] border border-[#263244] text-[#F4F7FA] rounded-[6px] shadow-md transition-all cursor-pointer hover:border-[#D7FF65]/50"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetCamera}
            className="p-2 bg-[#0D1420]/90 hover:bg-[#111927] border border-[#263244] text-[#F4F7FA] rounded-[6px] shadow-md transition-all cursor-pointer hover:border-[#D7FF65]/50"
            title="Reset to Maharashtra Center"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Secondary Layers Popover Toggle */}
          <div className="relative">
            <button
              onClick={() => setIsLayersOpen(!isLayersOpen)}
              className={`p-2 border rounded-[6px] shadow-md transition-all cursor-pointer ${
                isLayersOpen
                  ? 'bg-[#263244] text-[#D7FF65] border-[#D7FF65]/50'
                  : 'bg-[#0D1420]/90 hover:bg-[#111927] text-[#8D98A8] border-[#263244]'
              }`}
              title="Secondary Geographic Layers"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>

            {isLayersOpen && (
              <div className="absolute right-0 top-10 w-44 bg-[#0D1420]/95 backdrop-blur-md border border-[#263244] p-2.5 rounded-[8px] shadow-2xl space-y-2 text-xs font-mono z-30">
                <div className="text-[10px] text-[#8D98A8] uppercase tracking-wider border-b border-[#263244] pb-1">
                  BOUNDARIES
                </div>
                <label className="flex items-center space-x-2 text-[11px] text-[#F4F7FA] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showDistricts}
                    onChange={(e) => {
                      setShowDistricts(e.target.checked);
                      if (mapRef.current?.getLayer('districts-border')) {
                        mapRef.current.setLayoutProperty(
                          'districts-border',
                          'visibility',
                          e.target.checked ? 'visible' : 'none'
                        );
                      }
                    }}
                    className="accent-[#D7FF65]"
                  />
                  <span>Districts (34)</span>
                </label>
                <div className="text-[10px] text-[#8D98A8] uppercase tracking-wider border-b border-[#263244] pb-1 pt-1">
                  OPERATIONS
                </div>
                <label className="flex items-center space-x-2 text-[11px] text-[#F4F7FA] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCoverage}
                    onChange={(e) => {
                      setShowCoverage(e.target.checked);
                      if (mapRef.current?.getLayer('units-core')) {
                        mapRef.current.setLayoutProperty(
                          'units-core',
                          'visibility',
                          e.target.checked ? 'visible' : 'none'
                        );
                        mapRef.current.setLayoutProperty(
                          'units-halo',
                          'visibility',
                          e.target.checked ? 'visible' : 'none'
                        );
                      }
                    }}
                    className="accent-[#D7FF65]"
                  />
                  <span>Monitored Units (12)</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Floating Unit Tooltip on Hover */}
        {activeHoverUnit && tooltipPos && (
          <div 
            className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3"
            style={{ left: tooltipPos.x, top: tooltipPos.y }}
          >
            <div className="bg-[#0D1420]/95 backdrop-blur-md border border-[#263244] px-3 py-2 rounded-[6px] shadow-2xl space-y-1 font-mono text-xs">
              <div className="flex items-center justify-between space-x-3">
                <span className="font-bold text-[#F4F7FA]">{activeHoverUnit.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                  activeHoverUnit.status === 'VERIFIED'
                    ? 'bg-[#55D6A0]/20 text-[#55D6A0]'
                    : activeHoverUnit.priorityLevel === 'CRITICAL'
                    ? 'bg-[#FF5A52]/20 text-[#FF5A52]'
                    : 'bg-[#F4B740]/20 text-[#F4B740]'
                }`}>
                  {activeHoverUnit.status}
                </span>
              </div>
              <div className="text-[11px] text-[#8D98A8] flex items-center justify-between space-x-4">
                <span>District:</span>
                <span className="text-[#F4F7FA]">{activeHoverUnit.district}</span>
              </div>
              <div className="flex items-center justify-between space-x-4 text-[10px]">
                <span className="text-[#8D98A8]">Confidence: {activeHoverUnit.confidence}%</span>
                <span className="text-[#FF5A52]">Stress: {activeHoverUnit.stress}/100</span>
              </div>
              <div className="text-[9px] text-[#D7FF65] pt-0.5">
                Click to inspect evidence & assign verification
              </div>
            </div>
          </div>
        )}

        {/* Compact Docked Map Legend */}
        <div className="absolute bottom-4 left-4 z-20 bg-[#0D1420]/90 backdrop-blur-md border border-[#263244] px-3 py-2 rounded-[6px] shadow-lg text-[11px] font-mono space-y-1.5">
          <div className="text-[10px] font-bold text-[#8D98A8] uppercase tracking-wider">
            {mapLayer.toUpperCase()} LEGEND
          </div>
          {mapLayer === 'priority' && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-[#FF5A52]" />
                <span className="text-[#8D98A8]">Critical</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-[#F4B740]" />
                <span className="text-[#8D98A8]">High</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-[#55D6A0]" />
                <span className="text-[#8D98A8]">Verified</span>
              </div>
            </div>
          )}
          {mapLayer === 'confidence' && (
            <div className="flex items-center space-x-2">
              <span className="text-[#8D98A8]">Uncertain (0%)</span>
              <div className="w-16 h-1.5 rounded-full bg-gradient-to-r from-[#8D98A8] via-[#F4B740] to-[#55D6A0]" />
              <span className="text-[#55D6A0]">Verified (100%)</span>
            </div>
          )}
          {mapLayer === 'stress' && (
            <div className="flex items-center space-x-2">
              <span className="text-[#55D6A0]">Low</span>
              <div className="w-16 h-1.5 rounded-full bg-gradient-to-r from-[#55D6A0] via-[#F4B740] to-[#FF5A52]" />
              <span className="text-[#FF5A52]">Severe</span>
            </div>
          )}
          {mapLayer === 'coverage' && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-[#55D6A0]" />
                <span className="text-[#8D98A8]">Verified</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-[#F4B740]" />
                <span className="text-[#8D98A8]">Assigned</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-[#8D98A8]" />
                <span className="text-[#8D98A8]">Pending</span>
              </div>
            </div>
          )}
          {mapLayer === 'situation' && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-[#D7FF65]" />
                <span className="text-[#8D98A8]">Pilot Focus</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-[#FF5A52]" />
                <span className="text-[#8D98A8]">Stress Epicenter</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Technical Coordinates Strip */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center space-x-2 text-[10px] font-mono text-[#8D98A8] bg-[#0D1420]/80 border border-[#263244] px-2.5 py-1 rounded-[6px]">
          <span>EPSG:4326</span>
          <span className="text-[#263244]">|</span>
          <span className="text-[#D7FF65]">19.75°N, 75.71°E</span>
        </div>
      </div>
    </div>
  );
}
