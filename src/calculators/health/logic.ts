import { CalculationResult } from '../../types/calculator';
import { safeMath } from '../engine';

export const calculateBmi = (inputs: Record<string, any>): CalculationResult => {
  const weight = Number(inputs.weight);
  const heightCm = Number(inputs.height);

  if (weight <= 0 || heightCm <= 0) return { items: [] };

  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);

  let categoryKey = 'calculators.health.bmi.normal';
  if (bmi < 18.5) categoryKey = 'calculators.health.bmi.underweight';
  else if (bmi >= 25 && bmi < 30) categoryKey = 'calculators.health.bmi.overweight';
  else if (bmi >= 30) categoryKey = 'calculators.health.bmi.obese';

  return {
    items: [
      { id: 'bmi', labelKey: 'calculators.health.bmi.result', value: safeMath.roundToTwo(bmi), type: 'number', isPrimary: true },
      { id: 'category', labelKey: 'calculators.health.bmi.category', value: categoryKey, type: 'translated_text' },
    ]
  };
};

export const calculateBmr = (inputs: Record<string, any>): CalculationResult => {
  const gender = inputs.gender; // 'male' or 'female'
  const age = Number(inputs.age);
  const weight = Number(inputs.weight);
  const height = Number(inputs.height);

  if (weight <= 0 || height <= 0 || age <= 0) return { items: [] };

  // Mifflin-St Jeor
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  if (gender === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }

  return {
    items: [
      { id: 'bmr', labelKey: 'calculators.health.bmr.result', value: Math.round(bmr), type: 'number', isPrimary: true },
    ]
  };
};

export const calculateCalorie = (inputs: Record<string, any>): CalculationResult => {
  const bmrResult = calculateBmr(inputs);
  if (bmrResult.items.length === 0) return { items: [] };

  const bmr = Number(bmrResult.items[0].value);
  const multiplier = Number(inputs.activity) || 1.2;

  const calories = bmr * multiplier;

  return {
    items: [
      { id: 'calories', labelKey: 'calculators.health.calorie.result', value: Math.round(calories), type: 'number', isPrimary: true },
      { id: 'bmr', labelKey: 'calculators.health.bmr.result', value: Math.round(bmr), type: 'number' },
    ]
  };
};

export const calculateIdealWeight = (inputs: Record<string, any>): CalculationResult => {
  const gender = inputs.gender; // 'male' or 'female'
  const heightCm = Number(inputs.height);

  if (heightCm <= 0) return { items: [] };

  // Devine formula
  // Men: 50.0 kg + 2.3 kg per inch over 5 feet
  // Women: 45.5 kg + 2.3 kg per inch over 5 feet
  // 5 feet = 60 inches = 152.4 cm
  // 2.3 kg per inch = 2.3 / 2.54 = ~0.9055 kg per cm

  const baseWeight = gender === 'male' ? 50.0 : 45.5;
  let idealWeight = baseWeight;
  
  if (heightCm > 152.4) {
    idealWeight += 0.9055 * (heightCm - 152.4);
  }

  return {
    items: [
      { id: 'idealWeight', labelKey: 'calculators.health.idealWeight.result', value: safeMath.roundToTwo(idealWeight), type: 'number', isPrimary: true },
    ]
  };
};
