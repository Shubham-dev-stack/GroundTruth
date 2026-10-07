export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type VerificationStatus = 'PENDING' | 'ASSIGNED' | 'VERIFIED';

export type CropCondition = 'Normal' | 'Moderate' | 'Severe';
export type WaterStatus = 'Available' | 'Shortage';
export type FodderStatus = 'Available' | 'Shortage';

export interface LocationUnit {
  id: string;
  name: string;
  district: string;
  division: string;
  coordinates: {
    lat: number;
    lng: number;
    svgX: number; // For crisp vector map rendering
    svgY: number;
    elevationMeters?: number;
  };
  // 0 - 100 normalized scores
  stress: number;          // Composite stress (rainfall deficit + vegetation anomaly)
  rainfallStress: number;  // Rainfall deficit index (0-100)
  vegStress: number;       // NDVI / Vegetation health deficit (0-100)
  waterContext: number;    // Reservoir / Groundwater deficit (0-100)
  exposure: number;        // Population / smallholder agricultural area exposure (0-100)
  
  // Epistemic state
  confidence: number;      // 0 - 100 (%)
  uncertainty: number;     // 100 - confidence (%)
  
  // Evidence sources supporting this unit's state
  supportedSources: string[];
  
  // Computed operational priority score (0 - 100)
  priorityScore: number;
  priorityLevel: PriorityLevel;
  
  // Status and assignment
  status: VerificationStatus;
  assignedTeam?: string;
  assignedOfficerName?: string;
  lastVerified?: string;
  evidenceCount: number;
  
  // Justification breakdown
  whyPrioritized: string[];
}

export interface FieldReport {
  id: string;
  unitId: string;
  unitName: string;
  district: string;
  officer: string;
  timestamp: string;
  cropCondition: CropCondition;
  waterStatus: WaterStatus;
  fodderStatus: FodderStatus;
  notes: string;
  photoUrl?: string;
  photoFileName?: string;
  gpsAccuracyMeters?: number;
}

export type ActivityType = 
  | 'ASSIGNMENT'
  | 'FIELD_REPORT'
  | 'CONFIDENCE_UPDATE'
  | 'QUEUE_RECALCULATED'
  | 'PLAN_GENERATED';

export interface ActivityLogEntry {
  id: string;
  type: ActivityType;
  unitId?: string;
  unitName?: string;
  message: string;
  details?: string;
  timestamp: string;
}

export interface VerificationPlanSummary {
  generatedAt: string;
  totalPlanned: number;
  highUncertaintyCount: number;
  criticalStressCount: number;
  recommendedUnits: string[];
}

export interface StateOverviewSummary {
  id: string;
  name: string;
  code: string;
  status: 'pilot' | 'elevated' | 'critical' | 'monitoring';
  stressLevel: number;
  rainfallDeficit: number;
  activeSquads: number;
  verifiedCount: number;
  totalUnits: number;
  notes: string;
  centerCoordinates: {
    lat: number;
    lng: number;
    svgX: number;
    svgY: number;
  };
}

export type MapLayerMode = 
  | 'situation'
  | 'priority' 
  | 'confidence' 
  | 'stress' 
  | 'coverage';
