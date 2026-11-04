import { CalculationResult } from '../../types/calculator';
import { 
  lengthUnits, weightUnits, areaUnits, volumeUnits, 
  speedUnits, timeUnits, dataUnits, pressureUnits, energyUnits 
} from './units';

const createConverterLogic = (unitsMapping: Record<string, any>) => {
  return (inputs: Record<string, any>): CalculationResult => {
    const value = Number(inputs.value);
    const fromUnit = inputs.from;
    const toUnit = inputs.to;

    if (isNaN(value)) return { items: [] };
    if (!unitsMapping[fromUnit] || !unitsMapping[toUnit]) return { items: [] };

    // Convert from -> core -> to
    const coreValue = value * unitsMapping[fromUnit].factorToCore;
    const resultValue = coreValue / unitsMapping[toUnit].factorToCore;

    // Use sensible precision (remove unnecessary trailing zeros by relying on formatting later, or Number limit)
    // We keep full precision, but we can do a Math.round to 6 decimal places to avoid floating point weirdness
    const rounded = Math.round(resultValue * 1000000) / 1000000;

    return {
      items: [
        { id: 'result', labelKey: unitsMapping[toUnit].labelKey, value: rounded, type: 'number', isPrimary: true }
      ]
    };
  };
};

export const calculateLength = createConverterLogic(lengthUnits);
export const calculateWeight = createConverterLogic(weightUnits);
export const calculateArea = createConverterLogic(areaUnits);
export const calculateVolume = createConverterLogic(volumeUnits);
export const calculateSpeed = createConverterLogic(speedUnits);
export const calculateTime = createConverterLogic(timeUnits);
export const calculateData = createConverterLogic(dataUnits);
export const calculatePressure = createConverterLogic(pressureUnits);
export const calculateEnergy = createConverterLogic(energyUnits);

// Special case for temperature
export const calculateTemperature = (inputs: Record<string, any>): CalculationResult => {
  const value = Number(inputs.value);
  const fromUnit = inputs.from;
  const toUnit = inputs.to;

  if (isNaN(value)) return { items: [] };

  let resultValue = value;

  // First convert to Celsius as base
  let celsius = value;
  if (fromUnit === 'f') {
    celsius = (value - 32) * 5/9;
  } else if (fromUnit === 'k') {
    celsius = value - 273.15;
  }

  // Convert from Celsius to Target
  if (toUnit === 'c') {
    resultValue = celsius;
  } else if (toUnit === 'f') {
    resultValue = (celsius * 9/5) + 32;
  } else if (toUnit === 'k') {
    resultValue = celsius + 273.15;
  }

  const rounded = Math.round(resultValue * 1000000) / 1000000;

  const labels: Record<string, string> = {
    c: 'calculators.converters.units.c',
    f: 'calculators.converters.units.f',
    k: 'calculators.converters.units.k'
  };

  return {
    items: [
      { id: 'result', labelKey: labels[toUnit] || '', value: rounded, type: 'number', isPrimary: true }
    ]
  };
};
