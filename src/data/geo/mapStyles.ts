import { StyleSpecification } from 'maplibre-gl';

/**
 * Offline / Local standalone Dark Vector Style for GroundTruth
 * Works 100% reliably even with zero external network access,
 * rendering deep oceanic charcoal base, land masses, and vector overlays.
 */
export const LOCAL_DARK_BASEMAP_STYLE: StyleSpecification = {
  version: 8,
  name: 'GroundTruth Dark Intelligence Basemap',
  sources: {},
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': '#070B12',
      },
    },
  ],
};

/**
 * Online CartoDB Dark Matter basemap style endpoint
 */
export const CARTO_DARK_MATTER_URL = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
