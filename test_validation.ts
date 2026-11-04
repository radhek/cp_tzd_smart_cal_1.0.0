import { validateInputs } from './src/calculators/engine';
import { BreakEvenCalculatorDef } from './src/calculators/business/definitions';

console.log("=== VALIDATION TEST ===");
const result = validateInputs(BreakEvenCalculatorDef, { fixedCosts: 10000, sellingPrice: 50, variableCost: 60 });
console.log(JSON.stringify(result, null, 2));

const result2 = validateInputs(BreakEvenCalculatorDef, { fixedCosts: 10000, sellingPrice: 50, variableCost: 30 });
console.log(JSON.stringify(result2, null, 2));
