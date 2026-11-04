import { CalculationResult } from '../../types/calculator';
import { safeMath } from '../engine';
import { evaluateExpression } from './normalEngine';

export const calculateFuelCost = (inputs: Record<string, any>): CalculationResult => {
  const distance = Number(inputs.distance);
  const mileage = Number(inputs.mileage);
  const fuelPrice = Number(inputs.fuelPrice);

  const fuelRequired = distance / mileage;
  const totalCost = fuelRequired * fuelPrice;
  const costPerKm = totalCost / distance;

  return {
    items: [
      { id: 'totalCost', labelKey: 'calculators.dailyLife.fuelCost.totalCost', value: safeMath.roundToTwo(totalCost), type: 'currency', isPrimary: true },
      { id: 'fuelRequired', labelKey: 'calculators.dailyLife.fuelCost.fuelRequired', value: safeMath.roundToTwo(fuelRequired), type: 'number' },
      { id: 'costPerKm', labelKey: 'calculators.dailyLife.fuelCost.costPerKm', value: safeMath.roundToTwo(costPerKm), type: 'currency' },
    ]
  };
};

export const calculateMileage = (inputs: Record<string, any>): CalculationResult => {
  const distance = Number(inputs.distance);
  const fuelConsumed = Number(inputs.fuelConsumed);

  const mileage = distance / fuelConsumed;

  return {
    items: [
      { id: 'mileage', labelKey: 'calculators.dailyLife.mileage.result', value: safeMath.roundToTwo(mileage), type: 'number', isPrimary: true },
    ]
  };
};

export const calculateTripCost = (inputs: Record<string, any>): CalculationResult => {
  const distance = Number(inputs.distance);
  const mileage = Number(inputs.mileage);
  const fuelPrice = Number(inputs.fuelPrice);
  const travelers = Number(inputs.travelers);

  const fuelRequired = distance / mileage;
  const totalCost = fuelRequired * fuelPrice;
  const costPerPerson = totalCost / travelers;

  return {
    items: [
      { id: 'perPerson', labelKey: 'calculators.dailyLife.tripCost.perPerson', value: safeMath.roundToTwo(costPerPerson), type: 'currency', isPrimary: true },
      { id: 'totalCost', labelKey: 'calculators.dailyLife.fuelCost.totalCost', value: safeMath.roundToTwo(totalCost), type: 'currency' },
      { id: 'fuelRequired', labelKey: 'calculators.dailyLife.fuelCost.fuelRequired', value: safeMath.roundToTwo(fuelRequired), type: 'number' },
    ]
  };
};

export const calculateBillSplitter = (inputs: Record<string, any>): CalculationResult => {
  const totalBill = Number(inputs.totalBill);
  const people = Number(inputs.people);
  const tipPercent = inputs.tipPercent ? Number(inputs.tipPercent) : 0;

  const tipAmount = totalBill * (tipPercent / 100);
  const finalBill = totalBill + tipAmount;
  const perPerson = finalBill / people;

  return {
    items: [
      { id: 'perPerson', labelKey: 'calculators.dailyLife.billSplitter.perPerson', value: safeMath.roundToTwo(perPerson), type: 'currency', isPrimary: true },
      { id: 'finalBill', labelKey: 'calculators.dailyLife.billSplitter.finalBill', value: safeMath.roundToTwo(finalBill), type: 'currency' },
      { id: 'tipAmount', labelKey: 'calculators.dailyLife.billSplitter.tipAmount', value: safeMath.roundToTwo(tipAmount), type: 'currency' },
    ]
  };
};

export const calculateTipCalculator = (inputs: Record<string, any>): CalculationResult => {
  const totalBill = Number(inputs.totalBill);
  const tipPercent = Number(inputs.tipPercent);
  const people = Number(inputs.people);

  const tipAmount = totalBill * (tipPercent / 100);
  const finalBill = totalBill + tipAmount;
  const perPerson = finalBill / people;

  return {
    items: [
      { id: 'tipAmount', labelKey: 'calculators.dailyLife.billSplitter.tipAmount', value: safeMath.roundToTwo(tipAmount), type: 'currency', isPrimary: true },
      { id: 'finalBill', labelKey: 'calculators.dailyLife.tipCalculator.totalBill', value: safeMath.roundToTwo(finalBill), type: 'currency' },
      { id: 'perPerson', labelKey: 'calculators.dailyLife.billSplitter.perPerson', value: safeMath.roundToTwo(perPerson), type: 'currency' },
    ]
  };
};

export const calculateNormal = (inputs: Record<string, any>): CalculationResult => {
  const expr = String(inputs.expression || '');
  const res = evaluateExpression(expr);
  return {
    items: [
      {
        id: 'result',
        labelKey: 'calculators.dailyLife.normal.result',
        value: res.success ? res.value : 0,
        type: 'number',
        isPrimary: true,
      }
    ]
  };
};
