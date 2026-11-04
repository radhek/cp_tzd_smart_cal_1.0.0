import { CalculatorDefinition } from '../../types/calculator';
import { 
  lengthUnits, weightUnits, areaUnits, volumeUnits, 
  temperatureUnits, speedUnits, timeUnits, dataUnits, 
  pressureUnits, energyUnits 
} from './units';

const createConverterDef = (id: string, titleKey: string, units: Record<string, any>): CalculatorDefinition => {
  const options = Object.keys(units).map(key => ({
    labelKey: units[key].labelKey,
    value: key
  }));

  return {
    id: `converter-${id}`,
    category: 'converters',
    titleKey: `calculators.converters.${id}.title`,
    descriptionKey: `calculators.converters.${id}.description`,
    allowSwap: true,
    fields: [
      { id: 'value', type: 'number', labelKey: 'calculators.converters.value', required: true },
      { id: 'from', type: 'select', labelKey: 'calculators.converters.from', required: true, options, defaultValue: options[0].value },
      { id: 'to', type: 'select', labelKey: 'calculators.converters.to', required: true, options, defaultValue: options[1]?.value || options[0].value },
    ]
  };
};

export const LengthConverterDef = createConverterDef('length', 'length', lengthUnits);
export const WeightConverterDef = createConverterDef('weight', 'weight', weightUnits);
export const AreaConverterDef = createConverterDef('area', 'area', areaUnits);
export const VolumeConverterDef = createConverterDef('volume', 'volume', volumeUnits);
export const TemperatureConverterDef = createConverterDef('temperature', 'temperature', temperatureUnits);
export const SpeedConverterDef = createConverterDef('speed', 'speed', speedUnits);
export const TimeConverterDef = createConverterDef('time', 'time', timeUnits);
export const DataConverterDef = createConverterDef('data', 'data', dataUnits);
export const PressureConverterDef = createConverterDef('pressure', 'pressure', pressureUnits);
export const EnergyConverterDef = createConverterDef('energy', 'energy', energyUnits);
