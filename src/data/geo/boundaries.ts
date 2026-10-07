import { FeatureCollection, Polygon } from 'geojson';

/**
 * Real geographic coordinates GeoJSON for Maharashtra state boundary
 * with Marathwada, Vidarbha, and Western Maharashtra regions.
 */
export const MAHARASHTRA_GEOJSON: FeatureCollection<Polygon> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Maharashtra',
        status: 'ACTIVE_PILOT',
        stress: 74,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [72.65, 19.98],
            [73.32, 20.85],
            [74.15, 21.45],
            [75.25, 21.65],
            [76.85, 21.55],
            [78.55, 21.45],
            [79.85, 21.65],
            [80.75, 21.25],
            [80.85, 19.55],
            [80.25, 18.75],
            [79.15, 18.85],
            [77.85, 18.15],
            [76.85, 17.65],
            [75.95, 17.25],
            [74.85, 16.55],
            [73.75, 15.75],
            [73.15, 16.25],
            [72.85, 18.75],
            [72.65, 19.98]
          ]
        ]
      }
    }
  ]
};

export const MARATHWADA_CORE_GEOJSON: FeatureCollection<Polygon> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Marathwada',
        stress: 82,
        zone: 'EPICENTER',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [75.20, 19.85],
            [76.45, 20.15],
            [77.55, 19.65],
            [77.75, 18.85],
            [76.85, 18.15],
            [75.85, 18.05],
            [75.15, 18.65],
            [75.20, 19.85]
          ]
        ]
      }
    }
  ]
};

export const INDIA_STATES_GEOJSON: FeatureCollection<Polygon> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { id: 'MH', name: 'Maharashtra', status: 'pilot', stress: 78 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [72.65, 19.98],
            [74.15, 21.45],
            [77.85, 21.55],
            [80.85, 21.25],
            [80.25, 18.75],
            [77.85, 18.15],
            [75.95, 17.25],
            [73.75, 15.75],
            [72.85, 18.75],
            [72.65, 19.98]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: { id: 'RJ', name: 'Rajasthan', status: 'critical', stress: 79 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [70.15, 27.55],
            [74.25, 30.15],
            [77.85, 27.95],
            [76.55, 24.25],
            [71.55, 24.55],
            [70.15, 27.55]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: { id: 'KA', name: 'Karnataka', status: 'elevated', stress: 68 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [74.15, 15.55],
            [77.45, 18.15],
            [77.85, 14.55],
            [76.85, 11.95],
            [74.85, 13.55],
            [74.15, 15.55]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: { id: 'GJ', name: 'Gujarat', status: 'monitoring', stress: 52 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [68.85, 23.55],
            [72.55, 24.55],
            [74.25, 21.85],
            [72.85, 20.55],
            [69.85, 21.85],
            [68.85, 23.55]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: { id: 'MP', name: 'Madhya Pradesh', status: 'monitoring', stress: 48 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [74.55, 24.85],
            [81.85, 24.95],
            [82.25, 22.15],
            [76.85, 21.55],
            [74.55, 24.85]
          ]
        ]
      }
    }
  ]
};
