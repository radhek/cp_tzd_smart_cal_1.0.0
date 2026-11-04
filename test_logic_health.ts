import { 
  calculateBmi, 
  calculateBmr, 
  calculateCalorie, 
  calculateIdealWeight 
} from './src/calculators/health/logic';

console.log("=== BMI CALCULATOR TESTS ===");
// Normal metric case
console.log("Normal:", JSON.stringify(calculateBmi({ weight: 70, height: 175 }).items, null, 2));
// Decimal values
console.log("Decimal:", JSON.stringify(calculateBmi({ weight: 70.5, height: 175.5 }).items, null, 2));
// Zero/negative invalid input
console.log("Zero:", JSON.stringify(calculateBmi({ weight: 0, height: 175 }).items, null, 2));
console.log("Negative:", JSON.stringify(calculateBmi({ weight: 70, height: -175 }).items, null, 2));

console.log("\n=== BMR CALCULATOR TESTS ===");
// Male example
console.log("Male:", JSON.stringify(calculateBmr({ gender: 'male', age: 30, weight: 70, height: 175 }).items, null, 2));
// Female example
console.log("Female:", JSON.stringify(calculateBmr({ gender: 'female', age: 30, weight: 65, height: 165 }).items, null, 2));
// Boundary/invalid age
console.log("Invalid Age:", JSON.stringify(calculateBmr({ gender: 'male', age: -5, weight: 70, height: 175 }).items, null, 2));

console.log("\n=== CALORIE CALCULATOR TESTS ===");
// Each activity multiplier
['1.2', '1.375', '1.55', '1.725', '1.9'].forEach(act => {
  console.log(`Activity ${act}:`, JSON.stringify(calculateCalorie({ gender: 'male', age: 30, weight: 70, height: 175, activity: act }).items, null, 2));
});

console.log("\n=== IDEAL WEIGHT TESTS ===");
// Male example
console.log("Male 175cm:", JSON.stringify(calculateIdealWeight({ gender: 'male', height: 175 }).items, null, 2));
// Female example
console.log("Female 165cm:", JSON.stringify(calculateIdealWeight({ gender: 'female', height: 165 }).items, null, 2));
// Invalid height
console.log("Invalid height:", JSON.stringify(calculateIdealWeight({ gender: 'male', height: -10 }).items, null, 2));
