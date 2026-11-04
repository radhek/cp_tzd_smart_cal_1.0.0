import { CalculatorDefinition, ValidationResult } from '../types/calculator';

export const validateInputs = (
  definition: CalculatorDefinition, 
  inputs: Record<string, any>
): ValidationResult => {
  const errors: Record<string, string> = {};
  
  for (const field of definition.fields) {
    const value = inputs[field.id];
    
    // Required check
    if (field.required && (value === undefined || value === null || value === '')) {
      errors[field.id] = 'common.invalidInput';
      continue;
    }
    
    // Skip further checks if empty and not required
    if (value === undefined || value === null || value === '') {
      continue;
    }

    // Number specific validations
    if (['number', 'currency', 'percentage', 'duration'].includes(field.type)) {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        errors[field.id] = 'common.invalidInput';
        continue;
      }
      
      if (field.min !== undefined && numValue < field.min) {
        errors[field.id] = 'common.invalidInput';
      }
      if (field.max !== undefined && numValue > field.max) {
        errors[field.id] = 'common.invalidInput';
      }
    }
  }

  // Run custom cross-field validation
  if (definition.customValidation) {
    const customErrors = definition.customValidation(inputs);
    if (customErrors) {
      Object.assign(errors, customErrors);
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Safe mathematical operations to avoid floating point issues where possible
export const safeMath = {
  roundToTwo: (num: number): number => {
    if (!Number.isFinite(num)) return 0;
    return Math.round((num + Number.EPSILON) * 100) / 100;
  },
  parseFormattedNumber: (str: string): number => {
    return Number(str.replace(/[^0-9.-]+/g,""));
  }
};
