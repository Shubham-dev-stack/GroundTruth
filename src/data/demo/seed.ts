import { LocationUnit, FieldReport, ActivityLogEntry, StateOverviewSummary } from '@/types';
import { calculatePriorityScore, determinePriorityLevel, generateWhyPrioritized } from '@/lib/scoring';

/**
 * INITIAL OPERATIONAL SEED DATA
 * Focus: Maharashtra drought-vulnerable zones (Marathwada, Vidarbha, Western Maharashtra rain-shadow).
 * 
 * DISCLAIMER:
 * Prototype data — simulated for demonstration.
 * Locations are real talukas/districts in Maharashtra. Biophysical indicators and exposure values
 * are representative simulations designed for testing epistemic priority queues.
 */

interface RawUnitSeed {
  id: string;
  name: string;
  district: string;
  division: string;
  coordinates: { lat: number; lng: number; svgX: number; svgY: number; elevationMeters?: number };
  stress: number;
  rainfallStress: number;
  vegStress: number;
  waterContext: number;
  exposure: number;
  confidence: number;
  status: 'PENDING' | 'ASSIGNED' | 'VERIFIED';
  assignedTeam?: string;
  assignedOfficerName?: string;
  lastVerified?: string;
  evidenceCount: number;
  supportedSources?: string[];
}

const RAW_SEEDS: RawUnitSeed[] = [
  {
    id: 'unit-latur-01',
    name: 'Latur Rural & Ausa',
    district: 'Latur',
    division: 'Marathwada',
    coordinates: { lat: 18.4088, lng: 76.5604, svgX: 520, svgY: 340, elevationMeters: 631 },
    stress: 78,
    rainfallStress: 82,
    vegStress: 74,
    waterContext: 80,
    exposure: 76,
    confidence: 48, // Low confidence -> High uncertainty (52%)
    status: 'PENDING',
    evidenceCount: 0,
    supportedSources: ['Satellite Rainfall (CHIRPS)', 'MODIS NDVI anomaly'],
  },
  {
    id: 'unit-beed-01',
    name: 'Beed & Ashti Belt',
    district: 'Beed',
    division: 'Marathwada',
    coordinates: { lat: 18.9891, lng: 75.7601, svgX: 430, svgY: 280, elevationMeters: 530 },
    stress: 84,
    rainfallStress: 89,
    vegStress: 79,
    waterContext: 86,
    exposure: 72,
    confidence: 42,
    status: 'PENDING',
    evidenceCount: 0,
    supportedSources: ['Satellite Rainfall (CHIRPS)'],
  },
  {
    id: 'unit-solapur-01',
    name: 'Solapur North & Barshi',
    district: 'Solapur',
    division: 'Western Maharashtra',
    coordinates: { lat: 17.6599, lng: 75.9064, svgX: 430, svgY: 410, elevationMeters: 458 },
    stress: 72,
    rainfallStress: 76,
    vegStress: 68,
    waterContext: 74,
    exposure: 68,
    confidence: 50,
    status: 'PENDING',
    evidenceCount: 1,
    supportedSources: ['Satellite Rainfall (CHIRPS)', 'Ground Reservoir Gauge'],
  },
  {
    id: 'unit-dharashiv-01',
    name: 'Dharashiv (Osmanabad) South',
    district: 'Dharashiv',
    division: 'Marathwada',
    coordinates: { lat: 18.1856, lng: 76.0416, svgX: 460, svgY: 360, elevationMeters: 653 },
    stress: 76,
    rainfallStress: 81,
    vegStress: 72,
    waterContext: 77,
    exposure: 64,
    confidence: 45,
    status: 'PENDING',
    evidenceCount: 0,
    supportedSources: ['Satellite Rainfall (CHIRPS)', 'MODIS NDVI anomaly'],
  },
  {
    id: 'unit-jalna-01',
    name: 'Jalna & Ambad Taluka',
    district: 'Jalna',
    division: 'Marathwada',
    coordinates: { lat: 19.8347, lng: 75.8816, svgX: 430, svgY: 200, elevationMeters: 508 },
    stress: 65,
    rainfallStress: 69,
    vegStress: 62,
    waterContext: 64,
    exposure: 58,
    confidence: 55,
    status: 'ASSIGNED',
    assignedTeam: 'Field Squad Marathwada 02',
    assignedOfficerName: 'R. K. Kulkarni (TAO)',
    evidenceCount: 1,
    supportedSources: ['Satellite Rainfall (CHIRPS)', 'MODIS NDVI anomaly', 'Field Team Dispatch'],
  },
  {
    id: 'unit-parbhani-01',
    name: 'Parbhani & Jintur',
    district: 'Parbhani',
    division: 'Marathwada',
    coordinates: { lat: 19.2686, lng: 76.7744, svgX: 535, svgY: 245, elevationMeters: 407 },
    stress: 68,
    rainfallStress: 71,
    vegStress: 64,
    waterContext: 70,
    exposure: 60,
    confidence: 46,
    status: 'PENDING',
    evidenceCount: 0,
    supportedSources: ['Satellite Rainfall (CHIRPS)', 'MODIS NDVI anomaly'],
  },
  {
    id: 'unit-nanded-01',
    name: 'Nanded & Kandhar',
    district: 'Nanded',
    division: 'Marathwada',
    coordinates: { lat: 19.1383, lng: 77.321, svgX: 590, svgY: 260, elevationMeters: 362 },
    stress: 61,
    rainfallStress: 64,
    vegStress: 58,
    waterContext: 62,
    exposure: 54,
    confidence: 58,
    status: 'PENDING',
    evidenceCount: 0,
    supportedSources: ['Satellite Rainfall (CHIRPS)', 'Ground Water Stage'],
  },
  {
    id: 'unit-washim-01',
    name: 'Washim & Risod Valley',
    district: 'Washim',
    division: 'Vidarbha',
    coordinates: { lat: 20.1119, lng: 77.136, svgX: 570, svgY: 170, elevationMeters: 546 },
    stress: 58,
    rainfallStress: 60,
    vegStress: 56,
    waterContext: 59,
    exposure: 52,
    confidence: 62,
    status: 'PENDING',
    evidenceCount: 0,
    supportedSources: ['Satellite Rainfall (CHIRPS)'],
  },
  {
    id: 'unit-amravati-01',
    name: 'Amravati Morshi Belt',
    district: 'Amravati',
    division: 'Vidarbha',
    coordinates: { lat: 20.9374, lng: 77.7796, svgX: 625, svgY: 100, elevationMeters: 343 },
    stress: 54,
    rainfallStress: 52,
    vegStress: 55,
    waterContext: 55,
    exposure: 62,
    confidence: 78,
    status: 'VERIFIED',
    lastVerified: 'Yesterday (16:30)',
    evidenceCount: 3,
    supportedSources: ['Satellite Rainfall (CHIRPS)', 'MODIS NDVI anomaly', 'Field Inspection Report', 'Geotagged Photo'],
  },
  {
    id: 'unit-akola-01',
    name: 'Akola & Patur Sector',
    district: 'Akola',
    division: 'Vidarbha',
    coordinates: { lat: 20.7002, lng: 77.0082, svgX: 540, svgY: 120, elevationMeters: 282 },
    stress: 49,
    rainfallStress: 48,
    vegStress: 50,
    waterContext: 51,
    exposure: 48,
    confidence: 64,
    status: 'PENDING',
    evidenceCount: 0,
    supportedSources: ['Satellite Rainfall (CHIRPS)', 'Local Mandi Index'],
  },
  {
    id: 'unit-ahmednagar-01',
    name: 'Chhatrapati Sambhajinagar South',
    district: 'Chhatrapati Sambhajinagar',
    division: 'Marathwada',
    coordinates: { lat: 19.8762, lng: 75.3433, svgX: 375, svgY: 200, elevationMeters: 569 },
    stress: 55,
    rainfallStress: 58,
    vegStress: 52,
    waterContext: 57,
    exposure: 65,
    confidence: 70,
    status: 'VERIFIED',
    lastVerified: '2 days ago',
    evidenceCount: 2,
    supportedSources: ['Satellite Rainfall (CHIRPS)', 'Field Inspection Report'],
  },
  {
    id: 'unit-sangli-01',
    name: 'Sangli Atpadi & Jath',
    district: 'Sangli',
    division: 'Western Maharashtra',
    coordinates: { lat: 16.8524, lng: 74.5815, svgX: 320, svgY: 460, elevationMeters: 553 },
    stress: 67,
    rainfallStress: 70,
    vegStress: 64,
    waterContext: 72,
    exposure: 59,
    confidence: 49,
    status: 'PENDING',
    evidenceCount: 0,
    supportedSources: ['Satellite Rainfall (CHIRPS)', 'MODIS NDVI anomaly'],
  },
];

export function getInitialUnits(): LocationUnit[] {
  return RAW_SEEDS.map((seed) => {
    const uncertainty = 100 - seed.confidence;
    const priorityScore = calculatePriorityScore(seed.stress, uncertainty, seed.exposure);
    const priorityLevel = determinePriorityLevel(priorityScore);
    const whyPrioritized = generateWhyPrioritized(
      seed.stress,
      seed.rainfallStress,
      uncertainty,
      seed.exposure,
      seed.status
    );

    return {
      ...seed,
      uncertainty,
      priorityScore,
      priorityLevel,
      whyPrioritized,
      supportedSources: seed.supportedSources || ['Satellite Rainfall (CHIRPS)', 'MODIS NDVI anomaly'],
    };
  }).sort((a, b) => b.priorityScore - a.priorityScore);
}

export const INITIAL_ACTIVITY_LOG: ActivityLogEntry[] = [
  {
    id: 'act-001',
    type: 'PLAN_GENERATED',
    message: 'National & Maharashtra baseline loaded',
    details: 'Cycle Oct 2026 / 12 target monitoring units loaded for Maharashtra',
    timestamp: '09:15',
  },
  {
    id: 'act-002',
    type: 'ASSIGNMENT',
    unitId: 'unit-jalna-01',
    unitName: 'Jalna & Ambad Taluka',
    message: 'Verification squad assigned — Jalna & Ambad',
    details: 'Dispatched to R. K. Kulkarni (TAO) / Field Squad Marathwada 02',
    timestamp: '10:05',
  },
  {
    id: 'act-003',
    type: 'FIELD_REPORT',
    unitId: 'unit-amravati-01',
    unitName: 'Amravati Morshi Belt',
    message: 'Field report verified — Amravati Morshi Belt',
    details: 'Crop condition Moderate, canal water adequate. Uncertainty reduced to 22%.',
    timestamp: '10:30',
  },
];

export const INITIAL_FIELD_REPORTS: FieldReport[] = [
  {
    id: 'rep-001',
    unitId: 'unit-amravati-01',
    unitName: 'Amravati Morshi Belt',
    district: 'Amravati',
    officer: 'S. B. Deshmukh (Morshi Sub-div)',
    timestamp: 'Yesterday 16:30',
    cropCondition: 'Moderate',
    waterStatus: 'Available',
    fodderStatus: 'Available',
    notes: 'Canal release in Morshi taluka stabilized Kharif pulse crop. Soil moisture stress observed only on upland marginal plots.',
    photoFileName: 'morshi_citrus_cotton_transect.jpg',
    gpsAccuracyMeters: 4.8,
  },
];

export const NATIONAL_STATES_DATA: StateOverviewSummary[] = [
  {
    id: 'MH',
    name: 'Maharashtra',
    code: 'MH',
    status: 'pilot',
    stressLevel: 74,
    rainfallDeficit: -38,
    activeSquads: 4,
    verifiedCount: 2,
    totalUnits: 12,
    notes: 'Primary operational pilot — 12 talukas under active epistemic monitoring across Marathwada & Vidarbha',
    centerCoordinates: { lat: 19.7515, lng: 75.7139, svgX: 180, svgY: 250 },
  },
  {
    id: 'KA',
    name: 'Karnataka',
    code: 'KA',
    status: 'elevated',
    stressLevel: 68,
    rainfallDeficit: -32,
    activeSquads: 0,
    verifiedCount: 0,
    totalUnits: 0,
    notes: 'North Interior Karnataka experiencing continuous soil moisture deficit in Raichur and Kalaburagi basins',
    centerCoordinates: { lat: 15.3173, lng: 75.7139, svgX: 165, svgY: 315 },
  },
  {
    id: 'RJ',
    name: 'Rajasthan',
    code: 'RJ',
    status: 'critical',
    stressLevel: 79,
    rainfallDeficit: -44,
    activeSquads: 0,
    verifiedCount: 0,
    totalUnits: 0,
    notes: 'Western arid districts experiencing prolonged precipitation pause; groundwater extraction elevated',
    centerCoordinates: { lat: 27.0238, lng: 74.2179, svgX: 125, svgY: 155 },
  },
  {
    id: 'GJ',
    name: 'Gujarat',
    code: 'GJ',
    status: 'monitoring',
    stressLevel: 52,
    rainfallDeficit: -18,
    activeSquads: 0,
    verifiedCount: 0,
    totalUnits: 0,
    notes: 'Saurashtra and Kutch sectors showing localized moisture variance, reservoir storage currently adequate',
    centerCoordinates: { lat: 22.2587, lng: 71.1924, svgX: 105, svgY: 215 },
  },
  {
    id: 'MP',
    name: 'Madhya Pradesh',
    code: 'MP',
    status: 'monitoring',
    stressLevel: 48,
    rainfallDeficit: -14,
    activeSquads: 0,
    verifiedCount: 0,
    totalUnits: 0,
    notes: 'Bundelkhand and Malwa sub-regions under baseline remote sensing surveillance',
    centerCoordinates: { lat: 22.9734, lng: 78.6569, svgX: 185, svgY: 165 },
  },
  {
    id: 'AP',
    name: 'Andhra Pradesh',
    code: 'AP',
    status: 'elevated',
    stressLevel: 64,
    rainfallDeficit: -28,
    activeSquads: 0,
    verifiedCount: 0,
    totalUnits: 0,
    notes: 'Rayalaseema belt showing rainfed crop stress signals; ground moisture depletion observed',
    centerCoordinates: { lat: 15.9129, lng: 79.74, svgX: 205, svgY: 285 },
  },
  {
    id: 'TG',
    name: 'Telangana',
    code: 'TG',
    status: 'monitoring',
    stressLevel: 45,
    rainfallDeficit: -12,
    activeSquads: 0,
    verifiedCount: 0,
    totalUnits: 0,
    notes: 'Minor deficit in northern districts, Krishna basin storage normal',
    centerCoordinates: { lat: 18.1124, lng: 79.0193, svgX: 205, svgY: 255 },
  },
  {
    id: 'TN',
    name: 'Tamil Nadu',
    code: 'TN',
    status: 'monitoring',
    stressLevel: 40,
    rainfallDeficit: -8,
    activeSquads: 0,
    verifiedCount: 0,
    totalUnits: 0,
    notes: 'Northeast monsoon preparations ongoing, Cauvery delta irrigation active',
    centerCoordinates: { lat: 11.1271, lng: 78.6569, svgX: 175, svgY: 375 },
  },
];
