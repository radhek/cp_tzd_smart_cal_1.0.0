import { CalculatorDefinition, CalculationResult } from '../types/calculator';
import { 
  EmiCalculatorDef, 
  LoanCalculatorDef, 
  SimpleInterestDef, 
  CompoundInterestDef, 
  SipCalculatorDef,
  LumpSumCalculatorDef,
  RoiCalculatorDef,
  ProfitLossCalculatorDef,
  MarginCalculatorDef,
  MarkupCalculatorDef,
  DiscountCalculatorDef
} from './finance/definitions';
import { 
  calculateEmi, 
  calculateLoan, 
  calculateSimpleInterest, 
  calculateCompoundInterest, 
  calculateSip,
  calculateLumpSum,
  calculateRoi,
  calculateProfitLoss,
  calculateMargin,
  calculateMarkup,
  calculateDiscount
} from './finance/logic';

import {
  GstCalculatorDef,
  GstInclusiveCalculatorDef,
  GstExclusiveCalculatorDef,
  CgstCalculatorDef,
  SgstCalculatorDef,
  IgstCalculatorDef,
  CommissionCalculatorDef,
  BreakEvenCalculatorDef
} from './business/definitions';

import {
  calculateGst,
  calculateGstInclusive,
  calculateGstExclusive,
  calculateCgst,
  calculateSgst,
  calculateIgst,
  calculateCommission,
  calculateBreakEven
} from './business/logic';

import {
  FuelCostCalculatorDef,
  MileageCalculatorDef,
  TripCostCalculatorDef,
  BillSplitterCalculatorDef,
  TipCalculatorDef,
  NormalCalculatorDef
} from './dailyLife/definitions';

import {
  calculateFuelCost,
  calculateMileage,
  calculateTripCost,
  calculateBillSplitter,
  calculateTipCalculator,
  calculateNormal
} from './dailyLife/logic';

import {
  AgeCalculatorDef,
  DateDiffCalculatorDef,
  AddDaysCalculatorDef,
  SubDaysCalculatorDef,
  WorkingDaysCalculatorDef,
  CountdownCalculatorDef
} from './dateTime/definitions';

import {
  calculateAge,
  calculateDateDiff,
  calculateAddDays,
  calculateSubDays,
  calculateWorkingDays,
  calculateCountdown
} from './dateTime/logic';

import {
  BmiCalculatorDef,
  BmrCalculatorDef,
  CalorieCalculatorDef,
  IdealWeightCalculatorDef
} from './health/definitions';


import {
  calculateBmi,
  calculateBmr,
  calculateCalorie,
  calculateIdealWeight
} from './health/logic';

import {
  LengthConverterDef,
  WeightConverterDef,
  AreaConverterDef,
  VolumeConverterDef,
  TemperatureConverterDef,
  SpeedConverterDef,
  TimeConverterDef,
  DataConverterDef,
  PressureConverterDef,
  EnergyConverterDef
} from './converters/definitions';

import {
  calculateLength,
  calculateWeight,
  calculateArea,
  calculateVolume,
  calculateTemperature,
  calculateSpeed,
  calculateTime,
  calculateData,
  calculatePressure,
  calculateEnergy
} from './converters/logic';

export interface CalculatorEntry {
  definition: CalculatorDefinition;
  calculate: (inputs: Record<string, any>) => CalculationResult;
}

export const calculatorRegistry: Record<string, CalculatorEntry> = {
  // Finance
  [EmiCalculatorDef.id]: { definition: EmiCalculatorDef, calculate: calculateEmi },
  [LoanCalculatorDef.id]: { definition: LoanCalculatorDef, calculate: calculateLoan },
  [SimpleInterestDef.id]: { definition: SimpleInterestDef, calculate: calculateSimpleInterest },
  [CompoundInterestDef.id]: { definition: CompoundInterestDef, calculate: calculateCompoundInterest },
  [SipCalculatorDef.id]: { definition: SipCalculatorDef, calculate: calculateSip },
  [LumpSumCalculatorDef.id]: { definition: LumpSumCalculatorDef, calculate: calculateLumpSum },
  [RoiCalculatorDef.id]: { definition: RoiCalculatorDef, calculate: calculateRoi },
  [ProfitLossCalculatorDef.id]: { definition: ProfitLossCalculatorDef, calculate: calculateProfitLoss },
  [MarginCalculatorDef.id]: { definition: MarginCalculatorDef, calculate: calculateMargin },
  [MarkupCalculatorDef.id]: { definition: MarkupCalculatorDef, calculate: calculateMarkup },
  [DiscountCalculatorDef.id]: { definition: DiscountCalculatorDef, calculate: calculateDiscount },
  
  // Business
  [GstCalculatorDef.id]: { definition: GstCalculatorDef, calculate: calculateGst },
  [GstInclusiveCalculatorDef.id]: { definition: GstInclusiveCalculatorDef, calculate: calculateGstInclusive },
  [GstExclusiveCalculatorDef.id]: { definition: GstExclusiveCalculatorDef, calculate: calculateGstExclusive },
  [CgstCalculatorDef.id]: { definition: CgstCalculatorDef, calculate: calculateCgst },
  [SgstCalculatorDef.id]: { definition: SgstCalculatorDef, calculate: calculateSgst },
  [IgstCalculatorDef.id]: { definition: IgstCalculatorDef, calculate: calculateIgst },
  [CommissionCalculatorDef.id]: { definition: CommissionCalculatorDef, calculate: calculateCommission },
  [BreakEvenCalculatorDef.id]: { definition: BreakEvenCalculatorDef, calculate: calculateBreakEven },

  // Daily Life
  [NormalCalculatorDef.id]: { definition: NormalCalculatorDef, calculate: calculateNormal },
  [FuelCostCalculatorDef.id]: { definition: FuelCostCalculatorDef, calculate: calculateFuelCost },
  [MileageCalculatorDef.id]: { definition: MileageCalculatorDef, calculate: calculateMileage },
  [TripCostCalculatorDef.id]: { definition: TripCostCalculatorDef, calculate: calculateTripCost },
  [BillSplitterCalculatorDef.id]: { definition: BillSplitterCalculatorDef, calculate: calculateBillSplitter },
  [TipCalculatorDef.id]: { definition: TipCalculatorDef, calculate: calculateTipCalculator },

  // Date & Time
  [AgeCalculatorDef.id]: { definition: AgeCalculatorDef, calculate: calculateAge },
  [DateDiffCalculatorDef.id]: { definition: DateDiffCalculatorDef, calculate: calculateDateDiff },
  [AddDaysCalculatorDef.id]: { definition: AddDaysCalculatorDef, calculate: calculateAddDays },
  [SubDaysCalculatorDef.id]: { definition: SubDaysCalculatorDef, calculate: calculateSubDays },
  [WorkingDaysCalculatorDef.id]: { definition: WorkingDaysCalculatorDef, calculate: calculateWorkingDays },
  [CountdownCalculatorDef.id]: { definition: CountdownCalculatorDef, calculate: calculateCountdown },

  // Health
  [BmiCalculatorDef.id]: { definition: BmiCalculatorDef, calculate: calculateBmi },
  [BmrCalculatorDef.id]: { definition: BmrCalculatorDef, calculate: calculateBmr },
  [CalorieCalculatorDef.id]: { definition: CalorieCalculatorDef, calculate: calculateCalorie },
  [IdealWeightCalculatorDef.id]: { definition: IdealWeightCalculatorDef, calculate: calculateIdealWeight },

  // Converters
  [LengthConverterDef.id]: { definition: LengthConverterDef, calculate: calculateLength },
  [WeightConverterDef.id]: { definition: WeightConverterDef, calculate: calculateWeight },
  [AreaConverterDef.id]: { definition: AreaConverterDef, calculate: calculateArea },
  [VolumeConverterDef.id]: { definition: VolumeConverterDef, calculate: calculateVolume },
  [TemperatureConverterDef.id]: { definition: TemperatureConverterDef, calculate: calculateTemperature },
  [SpeedConverterDef.id]: { definition: SpeedConverterDef, calculate: calculateSpeed },
  [TimeConverterDef.id]: { definition: TimeConverterDef, calculate: calculateTime },
  [DataConverterDef.id]: { definition: DataConverterDef, calculate: calculateData },
  [PressureConverterDef.id]: { definition: PressureConverterDef, calculate: calculatePressure },
  [EnergyConverterDef.id]: { definition: EnergyConverterDef, calculate: calculateEnergy },
};

export const getCalculator = (id: string): CalculatorEntry | undefined => {
  return calculatorRegistry[id];
};

// Pre-computed static arrays and category indices to avoid repeated object allocations during navigation & searches
const ALL_CALCULATORS_ARRAY: CalculatorEntry[] = Object.freeze(Object.values(calculatorRegistry)) as unknown as CalculatorEntry[];

const CALCULATORS_BY_CATEGORY_MAP: Record<string, CalculatorEntry[]> = {};
for (const entry of ALL_CALCULATORS_ARRAY) {
  const cat = entry.definition.category;
  if (!CALCULATORS_BY_CATEGORY_MAP[cat]) {
    CALCULATORS_BY_CATEGORY_MAP[cat] = [];
  }
  CALCULATORS_BY_CATEGORY_MAP[cat].push(entry);
}
for (const cat in CALCULATORS_BY_CATEGORY_MAP) {
  Object.freeze(CALCULATORS_BY_CATEGORY_MAP[cat]);
}

export const getAllCalculators = (): CalculatorEntry[] => {
  return ALL_CALCULATORS_ARRAY;
};

export const getCalculatorsByCategory = (category: string): CalculatorEntry[] => {
  return CALCULATORS_BY_CATEGORY_MAP[category] || [];
};
