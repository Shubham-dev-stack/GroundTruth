import { FeatureCollection, Geometry } from 'geojson';

export interface GeoDistrictProperties {
  id: number;
  name: string;
  state: string;
  isMonitored: boolean;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  stress: number;
}

export interface GeoStateProperties {
  id: number;
  name: string;
  isPilot: boolean;
  stress: number;
}

/**
 * Centroid Coordinates for quick camera navigation
 */
export const INDIA_CENTER: [number, number] = [78.9629, 21.5937];
export const MAHARASHTRA_CENTER: [number, number] = [76.2, 19.4];

/**
 * Bounding boxes for smooth flyTo transitions [west, south, east, north]
 */
export const INDIA_BOUNDS: [[number, number], [number, number]] = [
  [68.1, 8.0],
  [97.4, 35.5],
];

export const MAHARASHTRA_BOUNDS: [[number, number], [number, number]] = [
  [72.6, 15.6],
  [80.9, 22.1],
];

/**
 * Standard District Coordinate Map for camera focusing on specific districts
 */
export const DISTRICT_COORDINATES: Record<string, [number, number]> = {
  Latur: [76.56, 18.41],
  Beed: [75.76, 18.99],
  Bid: [75.76, 18.99],
  Solapur: [75.91, 17.66],
  Dharashiv: [76.04, 18.19],
  Osmanabad: [76.04, 18.19],
  Jalna: [75.88, 19.83],
  Parbhani: [76.77, 19.27],
  Nanded: [77.32, 19.14],
  Washim: [77.14, 20.11],
  Amravati: [77.78, 20.94],
  Akola: [77.01, 20.70],
  'Chhatrapati Sambhajinagar': [75.34, 19.88],
  Aurangabad: [75.34, 19.88],
  Sangli: [74.58, 16.85],
  Yavatmal: [78.12, 20.39],
  Pune: [73.85, 18.52],
  Nashik: [73.79, 19.99],
  Nagpur: [79.08, 21.14],
  Thane: [72.97, 19.21],
  Kolhapur: [74.24, 16.70],
  Satara: [74.02, 17.68],
};
