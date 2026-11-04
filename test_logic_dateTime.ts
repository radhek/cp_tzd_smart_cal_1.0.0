import { 
  calculateAge, 
  calculateDateDiff, 
  calculateAddDays, 
  calculateSubDays, 
  calculateWorkingDays, 
  calculateCountdown 
} from './src/calculators/dateTime/logic';

console.log("=== AGE CALCULATOR TESTS ===");
// Normal date
console.log("Normal:", JSON.stringify(calculateAge({ dob: new Date('2000-01-01'), asOf: new Date('2025-01-01') }).items, null, 2));
// Leap year Feb 29
console.log("Feb 29:", JSON.stringify(calculateAge({ dob: new Date('2004-02-29'), asOf: new Date('2025-02-28') }).items, null, 2));

console.log("\n=== DATE DIFF TESTS ===");
console.log("Normal:", JSON.stringify(calculateDateDiff({ startDate: new Date('2025-01-01'), endDate: new Date('2025-01-31') }).items, null, 2));
console.log("Reversed:", JSON.stringify(calculateDateDiff({ startDate: new Date('2025-01-31'), endDate: new Date('2025-01-01') }).items, null, 2));

console.log("\n=== ADD DAYS TESTS ===");
console.log("Add 30 days:", JSON.stringify(calculateAddDays({ startDate: new Date('2025-01-01'), days: 30 }).items, null, 2));
console.log("Leap year:", JSON.stringify(calculateAddDays({ startDate: new Date('2024-02-28'), days: 1 }).items, null, 2));

console.log("\n=== SUB DAYS TESTS ===");
console.log("Sub 30 days:", JSON.stringify(calculateSubDays({ startDate: new Date('2025-01-31'), days: 30 }).items, null, 2));

console.log("\n=== WORKING DAYS TESTS ===");
console.log("Full week:", JSON.stringify(calculateWorkingDays({ startDate: new Date('2025-01-01'), endDate: new Date('2025-01-07') }).items, null, 2));
console.log("Same weekend:", JSON.stringify(calculateWorkingDays({ startDate: new Date('2025-01-04'), endDate: new Date('2025-01-05') }).items, null, 2));

console.log("\n=== COUNTDOWN TEST ===");
console.log("Countdown target:", JSON.stringify(calculateCountdown({ targetDate: new Date('2030-01-01') }).items, null, 2));
