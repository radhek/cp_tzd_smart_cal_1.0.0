import { CalculatorDefinition } from '../../types/calculator';

export const BmiCalculatorDef: CalculatorDefinition = {
  id: 'health-bmi',
  category: 'health',
  titleKey: 'calculators.health.bmi.title',
  descriptionKey: 'calculators.health.bmi.description',
  disclaimerKey: 'calculators.health.disclaimer',
  fields: [
    { id: 'weight', type: 'number', labelKey: 'calculators.health.bmi.weight', required: true, min: 1 },
    { id: 'height', type: 'number', labelKey: 'calculators.health.bmi.height', required: true, min: 1 },
  ]
};

export const BmrCalculatorDef: CalculatorDefinition = {
  id: 'health-bmr',
  category: 'health',
  titleKey: 'calculators.health.bmr.title',
  descriptionKey: 'calculators.health.bmr.description',
  disclaimerKey: 'calculators.health.disclaimer',
  fields: [
    { 
      id: 'gender', 
      type: 'segmented', 
      labelKey: 'calculators.health.bmr.gender', 
      required: true,
      options: [
        { labelKey: 'calculators.health.bmr.male', value: 'male' },
        { labelKey: 'calculators.health.bmr.female', value: 'female' },
      ],
      defaultValue: 'male'
    },
    { id: 'age', type: 'number', labelKey: 'calculators.health.bmr.age', required: true, min: 1, max: 120 },
    { id: 'weight', type: 'number', labelKey: 'calculators.health.bmi.weight', required: true, min: 1 },
    { id: 'height', type: 'number', labelKey: 'calculators.health.bmi.height', required: true, min: 1 },
  ]
};

export const CalorieCalculatorDef: CalculatorDefinition = {
  id: 'health-calorie',
  category: 'health',
  titleKey: 'calculators.health.calorie.title',
  descriptionKey: 'calculators.health.calorie.description',
  disclaimerKey: 'calculators.health.disclaimer',
  fields: [
    { 
      id: 'gender', 
      type: 'segmented', 
      labelKey: 'calculators.health.bmr.gender', 
      required: true,
      options: [
        { labelKey: 'calculators.health.bmr.male', value: 'male' },
        { labelKey: 'calculators.health.bmr.female', value: 'female' },
      ],
      defaultValue: 'male'
    },
    { id: 'age', type: 'number', labelKey: 'calculators.health.bmr.age', required: true, min: 1, max: 120 },
    { id: 'weight', type: 'number', labelKey: 'calculators.health.bmi.weight', required: true, min: 1 },
    { id: 'height', type: 'number', labelKey: 'calculators.health.bmi.height', required: true, min: 1 },
    { 
      id: 'activity', 
      type: 'select', 
      labelKey: 'calculators.health.calorie.activity', 
      required: true,
      options: [
        { labelKey: 'calculators.health.calorie.sedentary', value: '1.2' },
        { labelKey: 'calculators.health.calorie.light', value: '1.375' },
        { labelKey: 'calculators.health.calorie.moderate', value: '1.55' },
        { labelKey: 'calculators.health.calorie.very', value: '1.725' },
        { labelKey: 'calculators.health.calorie.extra', value: '1.9' },
      ],
      defaultValue: '1.2'
    }
  ]
};

export const IdealWeightCalculatorDef: CalculatorDefinition = {
  id: 'health-ideal-weight',
  category: 'health',
  titleKey: 'calculators.health.idealWeight.title',
  descriptionKey: 'calculators.health.idealWeight.description',
  disclaimerKey: 'calculators.health.disclaimer',
  fields: [
    { 
      id: 'gender', 
      type: 'segmented', 
      labelKey: 'calculators.health.bmr.gender', 
      required: true,
      options: [
        { labelKey: 'calculators.health.bmr.male', value: 'male' },
        { labelKey: 'calculators.health.bmr.female', value: 'female' },
      ],
      defaultValue: 'male'
    },
    { id: 'height', type: 'number', labelKey: 'calculators.health.bmi.height', required: true, min: 1 },
  ]
};
