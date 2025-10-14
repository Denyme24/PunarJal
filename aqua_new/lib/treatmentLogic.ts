// Treatment simulation logic for wastewater treatment

export interface WaterQualityParameters {
  turbidity: number; // NTU
  tss?: number; // mg/L (optional, can be estimated from turbidity)
  cod: number; // mg/L
  bod?: number; // mg/L
  nitrogen: number; // mg/L
  phosphorus: number; // mg/L
  pH: number;
  tds?: number; // mg/L
  reuseType?: string; // Type of water reuse application
}

export interface TreatmentStage {
  name: string;
  required: boolean;
  reason: string[];
  parameters: {
    name: string;
    value: number;
    threshold: number;
    unit: string;
    exceedsThreshold: boolean;
  }[];
}

export interface TreatmentSimulationResult {
  primaryTreatment: TreatmentStage;
  secondaryTreatment: TreatmentStage;
  tertiaryTreatment: TreatmentStage;
  overallStatus: 'safe' | 'needs-treatment' | 'critical';
  totalStagesRequired: number;
  estimatedTreatmentTime: number; // in hours
  estimatedEfficiency: number; // percentage
}

// Threshold constants
const THRESHOLDS = {
  PRIMARY: {
    TURBIDITY: 50, // NTU
    TSS: 100, // mg/L
  },
  SECONDARY: {
    COD: 150, // mg/L
    BOD: 30, // mg/L
  },
  TERTIARY: {
    NITROGEN: 10, // mg/L
    PHOSPHORUS: 1, // mg/L
    PH_MIN: 6.5,
    PH_MAX: 8.5,
  },
};

// Estimate TSS from turbidity (rough correlation)
function estimateTSS(turbidity: number): number {
  // Typical correlation: TSS (mg/L) ≈ 1.5 × Turbidity (NTU)
  return turbidity * 1.5;
}

// Estimate BOD from COD (typical ratio)
function estimateBOD(cod: number): number {
  // Typical BOD/COD ratio is 0.4-0.6, using 0.5 as default
  return cod * 0.5;
}

// Check if primary treatment is required
function checkPrimaryTreatment(params: WaterQualityParameters): TreatmentStage {
  const tss = params.tss || estimateTSS(params.turbidity);
  const reasons: string[] = [];
  const parameters: TreatmentStage['parameters'] = [];

  const turbidityExceeds = params.turbidity > THRESHOLDS.PRIMARY.TURBIDITY;
  const tssExceeds = tss > THRESHOLDS.PRIMARY.TSS;

  if (turbidityExceeds) {
    reasons.push(
      'High turbidity detected - physical screening and sedimentation needed'
    );
  }
  if (tssExceeds) {
    reasons.push('High suspended solids - requires removal of large particles');
  }

  parameters.push(
    {
      name: 'Turbidity',
      value: params.turbidity,
      threshold: THRESHOLDS.PRIMARY.TURBIDITY,
      unit: 'NTU',
      exceedsThreshold: turbidityExceeds,
    },
    {
      name: 'Total Suspended Solids',
      value: tss,
      threshold: THRESHOLDS.PRIMARY.TSS,
      unit: 'mg/L',
      exceedsThreshold: tssExceeds,
    }
  );

  return {
    name: 'Primary Treatment',
    required: turbidityExceeds || tssExceeds,
    reason: reasons.length > 0 ? reasons : ['No primary treatment needed'],
    parameters,
  };
}

// Check if secondary treatment is required
function checkSecondaryTreatment(
  params: WaterQualityParameters
): TreatmentStage {
  const bod = params.bod || estimateBOD(params.cod);
  const reasons: string[] = [];
  const parameters: TreatmentStage['parameters'] = [];

  const codExceeds = params.cod > THRESHOLDS.SECONDARY.COD;
  const bodExceeds = bod > THRESHOLDS.SECONDARY.BOD;

  if (codExceeds) {
    reasons.push('High COD levels - biological treatment required');
  }
  if (bodExceeds) {
    reasons.push('High BOD levels - aerobic/anaerobic digestion needed');
  }

  parameters.push(
    {
      name: 'Chemical Oxygen Demand',
      value: params.cod,
      threshold: THRESHOLDS.SECONDARY.COD,
      unit: 'mg/L',
      exceedsThreshold: codExceeds,
    },
    {
      name: 'Biological Oxygen Demand',
      value: bod,
      threshold: THRESHOLDS.SECONDARY.BOD,
      unit: 'mg/L',
      exceedsThreshold: bodExceeds,
    }
  );

  return {
    name: 'Secondary Treatment',
    required: codExceeds || bodExceeds,
    reason: reasons.length > 0 ? reasons : ['No secondary treatment needed'],
    parameters,
  };
}

// Check if tertiary treatment is required
function checkTertiaryTreatment(
  params: WaterQualityParameters
): TreatmentStage {
  const reasons: string[] = [];
  const parameters: TreatmentStage['parameters'] = [];

  const nitrogenExceeds = params.nitrogen > THRESHOLDS.TERTIARY.NITROGEN;
  const phosphorusExceeds = params.phosphorus > THRESHOLDS.TERTIARY.PHOSPHORUS;
  const pHOutOfRange =
    params.pH < THRESHOLDS.TERTIARY.PH_MIN ||
    params.pH > THRESHOLDS.TERTIARY.PH_MAX;

  if (nitrogenExceeds) {
    reasons.push(
      'High nitrogen levels - nitrification/denitrification required'
    );
  }
  if (phosphorusExceeds) {
    reasons.push('High phosphorus levels - chemical precipitation needed');
  }
  if (pHOutOfRange) {
    reasons.push('pH adjustment required for optimal discharge');
  }

  parameters.push(
    {
      name: 'Total Nitrogen',
      value: params.nitrogen,
      threshold: THRESHOLDS.TERTIARY.NITROGEN,
      unit: 'mg/L',
      exceedsThreshold: nitrogenExceeds,
    },
    {
      name: 'Total Phosphorus',
      value: params.phosphorus,
      threshold: THRESHOLDS.TERTIARY.PHOSPHORUS,
      unit: 'mg/L',
      exceedsThreshold: phosphorusExceeds,
    },
    {
      name: 'pH Level',
      value: params.pH,
      threshold: THRESHOLDS.TERTIARY.PH_MIN,
      unit: '',
      exceedsThreshold: pHOutOfRange,
    }
  );

  return {
    name: 'Tertiary Treatment',
    required: nitrogenExceeds || phosphorusExceeds || pHOutOfRange,
    reason: reasons.length > 0 ? reasons : ['No tertiary treatment needed'],
    parameters,
  };
}

// Calculate estimated treatment time based on stages required
function calculateTreatmentTime(
  primary: boolean,
  secondary: boolean,
  tertiary: boolean
): number {
  let hours = 0;
  if (primary) hours += 2; // Primary: 2-4 hours for sedimentation
  if (secondary) hours += 6; // Secondary: 6-24 hours for biological treatment
  if (tertiary) hours += 3; // Tertiary: 3-6 hours for advanced treatment
  return hours;
}

// Calculate treatment efficiency based on stages
function calculateEfficiency(
  primary: boolean,
  secondary: boolean,
  tertiary: boolean
): number {
  let efficiency = 0;
  if (primary) efficiency += 30; // Primary removes ~30-40% of pollutants
  if (secondary) efficiency += 50; // Secondary removes ~50-85% more
  if (tertiary) efficiency += 15; // Tertiary removes ~90-99% total
  return Math.min(efficiency, 95); // Cap at 95%
}

// Determine overall water quality status
function determineOverallStatus(
  primary: boolean,
  secondary: boolean,
  tertiary: boolean
): 'safe' | 'needs-treatment' | 'critical' {
  const stagesRequired = [primary, secondary, tertiary].filter(Boolean).length;

  if (stagesRequired === 0) return 'safe';
  if (stagesRequired <= 2) return 'needs-treatment';
  return 'critical';
}

// Main function to simulate treatment requirements
export function simulateTreatment(
  params: WaterQualityParameters
): TreatmentSimulationResult {
  // Check each treatment stage
  const primaryTreatment = checkPrimaryTreatment(params);
  const secondaryTreatment = checkSecondaryTreatment(params);
  const tertiaryTreatment = checkTertiaryTreatment(params);

  // Calculate metrics
  const totalStagesRequired = [
    primaryTreatment.required,
    secondaryTreatment.required,
    tertiaryTreatment.required,
  ].filter(Boolean).length;

  const estimatedTreatmentTime = calculateTreatmentTime(
    primaryTreatment.required,
    secondaryTreatment.required,
    tertiaryTreatment.required
  );

  const estimatedEfficiency = calculateEfficiency(
    primaryTreatment.required,
    secondaryTreatment.required,
    tertiaryTreatment.required
  );

  const overallStatus = determineOverallStatus(
    primaryTreatment.required,
    secondaryTreatment.required,
    tertiaryTreatment.required
  );

  return {
    primaryTreatment,
    secondaryTreatment,
    tertiaryTreatment,
    overallStatus,
    totalStagesRequired,
    estimatedTreatmentTime,
    estimatedEfficiency,
  };
}

// Export thresholds for reference
export { THRESHOLDS };
