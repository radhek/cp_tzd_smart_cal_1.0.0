export type CalculatorCategory = 'finance' | 'business' | 'dailyLife' | 'dateTime' | 'health' | 'converters';

export type InputType = 'number' | 'currency' | 'percentage' | 'duration' | 'date' | 'select' | 'segmented';

export interface CalculatorField {
  id: string;
  type: InputType;
  labelKey: string;
  placeholderKey?: string;
  defaultValue?: any;
  required?: boolean;
  min?: number;
  max?: number;
  options?: { labelKey: string; value: string | number }[]; // For select/segmented
}

export interface CalculatorDefinition {
  id: string;
  category: CalculatorCategory;
  titleKey: string;
  descriptionKey: string;
  disclaimerKey?: string;
  allowSwap?: boolean;
  icon?: string;
  fields: CalculatorField[];
  customValidation?: (inputs: Record<string, any>) => Record<string, string> | null;
}

export interface CalculationResultItem {
  id: string;
  labelKey: string;
  value: number | string | Date;
  type: 'currency' | 'number' | 'percentage' | 'text' | 'translated_text' | 'date' | 'countdown';
  isPrimary?: boolean;
}

export interface CalculationResult {
  items: CalculationResultItem[];
}

export type CalculationFunction<TInput = Record<string, any>> = (inputs: TInput) => CalculationResult;

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>; // fieldId -> error message key
}
