import { LocationUnit, PriorityLevel } from '@/types';

/**
 * DETERMINISTIC OPERATIONAL SCORING MODEL (V0.2 PROTOTYPE)
 * 
 * In V0.2, the operational verification priority is deterministically computed based on:
 *   Priority = (w_stress * Stress) + (w_uncertainty * Uncertainty) + (w_exposure * Exposure)
 * 
 * Explicit weights:
 *   - Stress: 0.45 (Primary signal of moisture/biophysical duress)
 *   - Uncertainty: 0.35 (Epistemic gap where ground-truth is absent)
 *   - Exposure: 0.20 (Smallholder rainfed agricultural vulnerability)
 * 
 * DISCLAIMER:
 * Prototype data — simulated for demonstration.
 * Weights are transparent and configurable. Not yet scientifically validated.
 */

export const SCORING_WEIGHTS = {
  STRESS: 0.45,
  UNCERTAINTY: 0.35,
  EXPOSURE: 0.20,
};

export function calculatePriorityScore(
  stress: number,
  uncertainty: number,
  exposure: number
): number {
  const score =
    stress * SCORING_WEIGHTS.STRESS +
    uncertainty * SCORING_WEIGHTS.UNCERTAINTY +
    exposure * SCORING_WEIGHTS.EXPOSURE;

  return Math.min(100, Math.max(0, Math.round(score)));
}

export function determinePriorityLevel(score: number): PriorityLevel {
  if (score >= 75) return 'CRITICAL';
  if (score >= 55) return 'HIGH';
  if (score >= 35) return 'MEDIUM';
  return 'LOW';
}

export function generateWhyPrioritized(
  stress: number,
  rainfallStress: number,
  uncertainty: number,
  exposure: number,
  status: string
): string[] {
  const reasons: string[] = [];

  if (rainfallStress >= 75) {
    reasons.push('Severe 4-week rainfall deficit (>60% departure from long-term median)');
  } else if (rainfallStress >= 55) {
    reasons.push('Elevated rainfall deficit in critical sowing window');
  }

  if (uncertainty >= 50) {
    reasons.push('Substantial epistemic gap (no verified field report within >14 days)');
  } else if (uncertainty >= 35) {
    reasons.push('Moderate epistemic uncertainty across peripheral agricultural grids');
  }

  if (exposure >= 70) {
    reasons.push('High concentration of rainfed smallholder agricultural households');
  } else if (exposure >= 50) {
    reasons.push('Moderate agrarian exposure with vulnerable rainfed cropping patterns');
  }

  if (stress >= 70) {
    reasons.push('Combined biophysical stress signals indicating probable moisture duress');
  }

  if (status === 'VERIFIED') {
    reasons.push('Field verified — operational uncertainty cleared by ground team');
  } else if (status === 'ASSIGNED') {
    reasons.push('Field verification underway by taluka agriculture officer');
  }

  if (reasons.length === 0) {
    reasons.push('Standard baseline monitoring queue priority');
  }

  return reasons;
}

/**
 * Recalculates unit priority and uncertainty upon receiving field evidence.
 */
export function applyFieldVerificationToUnit(
  unit: LocationUnit,
  cropCondition: 'Normal' | 'Moderate' | 'Severe',
  waterStatus: 'Available' | 'Shortage',
  fodderStatus: 'Available' | 'Shortage'
): LocationUnit {
  // Confidence increases substantially with verified field inspection
  const newConfidence = 88;
  const newUncertainty = 12;

  // Ground ground-truthing calibrates perceived stress
  let calibratedStress = unit.stress;
  if (cropCondition === 'Severe' && waterStatus === 'Shortage') {
    calibratedStress = Math.min(96, Math.max(unit.stress, 82));
  } else if (cropCondition === 'Normal' && waterStatus === 'Available') {
    calibratedStress = Math.max(22, unit.stress - 25);
  } else {
    calibratedStress = Math.round((unit.stress + 65) / 2);
  }

  const newScore = calculatePriorityScore(calibratedStress, newUncertainty, unit.exposure);
  const newLevel = determinePriorityLevel(newScore);

  const updatedWhy = [
    `Field verification confirmed: Crop condition ${cropCondition.toLowerCase()}, drinking water ${waterStatus.toLowerCase()}`,
    'Ground truth established — epistemic uncertainty reduced to 12%',
    'Target location cleared from urgent field verification roster',
  ];

  const updatedSources = Array.from(new Set([...unit.supportedSources, 'Field Inspection Report', 'Geotagged Photo Evidence']));

  return {
    ...unit,
    stress: calibratedStress,
    confidence: newConfidence,
    uncertainty: newUncertainty,
    priorityScore: newScore,
    priorityLevel: newLevel,
    status: 'VERIFIED',
    lastVerified: 'Just now (Today)',
    evidenceCount: unit.evidenceCount + 1,
    whyPrioritized: updatedWhy,
    supportedSources: updatedSources,
  };
}
