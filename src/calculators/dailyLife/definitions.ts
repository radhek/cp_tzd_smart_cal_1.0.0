import { CalculatorDefinition } from '../../types/calculator';

export const FuelCostCalculatorDef: CalculatorDefinition = {
  id: 'daily-fuel-cost',
  category: 'dailyLife',
  titleKey: 'calculators.dailyLife.fuelCost.title',
  descriptionKey: 'calculators.dailyLife.fuelCost.description',
  fields: [
    { id: 'distance', type: 'number', labelKey: 'calculators.dailyLife.fuelCost.distance', required: true, min: 0.1 },
    { id: 'mileage', type: 'number', labelKey: 'calculators.dailyLife.fuelCost.mileage', required: true, min: 0.1 },
    { id: 'fuelPrice', type: 'currency', labelKey: 'calculators.dailyLife.fuelCost.fuelPrice', required: true, min: 0 },
  ]
};

export const MileageCalculatorDef: CalculatorDefinition = {
  id: 'daily-mileage',
  category: 'dailyLife',
  titleKey: 'calculators.dailyLife.mileage.title',
  descriptionKey: 'calculators.dailyLife.mileage.description',
  fields: [
    { id: 'distance', type: 'number', labelKey: 'calculators.dailyLife.fuelCost.distance', required: true, min: 0.1 },
    { id: 'fuelConsumed', type: 'number', labelKey: 'calculators.dailyLife.mileage.fuelConsumed', required: true, min: 0.1 },
  ]
};

export const TripCostCalculatorDef: CalculatorDefinition = {
  id: 'daily-trip-cost',
  category: 'dailyLife',
  titleKey: 'calculators.dailyLife.tripCost.title',
  descriptionKey: 'calculators.dailyLife.tripCost.description',
  fields: [
    { id: 'distance', type: 'number', labelKey: 'calculators.dailyLife.fuelCost.distance', required: true, min: 0.1 },
    { id: 'mileage', type: 'number', labelKey: 'calculators.dailyLife.fuelCost.mileage', required: true, min: 0.1 },
    { id: 'fuelPrice', type: 'currency', labelKey: 'calculators.dailyLife.fuelCost.fuelPrice', required: true, min: 0 },
    { id: 'travelers', type: 'number', labelKey: 'calculators.dailyLife.tripCost.travelers', required: true, min: 1 },
  ]
};

export const BillSplitterCalculatorDef: CalculatorDefinition = {
  id: 'daily-bill-splitter',
  category: 'dailyLife',
  titleKey: 'calculators.dailyLife.billSplitter.title',
  descriptionKey: 'calculators.dailyLife.billSplitter.description',
  fields: [
    { id: 'totalBill', type: 'currency', labelKey: 'calculators.dailyLife.billSplitter.totalBill', required: true, min: 0 },
    { id: 'people', type: 'number', labelKey: 'calculators.dailyLife.billSplitter.people', required: true, min: 1 },
    { id: 'tipPercent', type: 'percentage', labelKey: 'calculators.dailyLife.billSplitter.tipPercent', required: false, min: 0 },
  ]
};

export const TipCalculatorDef: CalculatorDefinition = {
  id: 'daily-tip-calculator',
  category: 'dailyLife',
  titleKey: 'calculators.dailyLife.tipCalculator.title',
  descriptionKey: 'calculators.dailyLife.tipCalculator.description',
  fields: [
    { id: 'totalBill', type: 'currency', labelKey: 'calculators.dailyLife.billSplitter.totalBill', required: true, min: 0 },
    { id: 'tipPercent', type: 'percentage', labelKey: 'calculators.dailyLife.billSplitter.tipPercent', required: true, min: 0 },
    { id: 'people', type: 'number', labelKey: 'calculators.dailyLife.billSplitter.people', required: true, min: 1 },
  ]
};

export const NormalCalculatorDef: CalculatorDefinition = {
  id: 'daily-normal-calculator',
  category: 'dailyLife',
  titleKey: 'calculators.dailyLife.normal.title',
  descriptionKey: 'calculators.dailyLife.normal.description',
  fields: [
    { id: 'expression', type: 'number', labelKey: 'calculators.dailyLife.normal.expression', defaultValue: '' }
  ]
};
