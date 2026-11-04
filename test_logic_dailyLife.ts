import { 
  calculateFuelCost, 
  calculateMileage, 
  calculateTripCost, 
  calculateBillSplitter, 
  calculateTipCalculator 
} from './src/calculators/dailyLife/logic';

console.log("=== FUEL COST TEST ===");
console.log(JSON.stringify(calculateFuelCost({ distance: 300, mileage: 15, fuelPrice: 100 }).items, null, 2));

console.log("\n=== MILEAGE TEST ===");
console.log(JSON.stringify(calculateMileage({ distance: 300, fuelConsumed: 20 }).items, null, 2));

console.log("\n=== TRIP COST TEST ===");
console.log(JSON.stringify(calculateTripCost({ distance: 500, mileage: 20, fuelPrice: 100, travelers: 4 }).items, null, 2));

console.log("\n=== BILL SPLITTER TEST (With Tip) ===");
console.log(JSON.stringify(calculateBillSplitter({ totalBill: 2000, people: 4, tipPercent: 10 }).items, null, 2));

console.log("\n=== BILL SPLITTER TEST (No Tip) ===");
console.log(JSON.stringify(calculateBillSplitter({ totalBill: 2000, people: 4, tipPercent: 0 }).items, null, 2));

console.log("\n=== TIP CALCULATOR TEST ===");
console.log(JSON.stringify(calculateTipCalculator({ totalBill: 1000, tipPercent: 10, people: 2 }).items, null, 2));

console.log("\n=== EDGE CASE: FUEL COST (Decimals) ===");
console.log(JSON.stringify(calculateFuelCost({ distance: 300.5, mileage: 15.2, fuelPrice: 100.5 }).items, null, 2));

console.log("\n=== EDGE CASE: TRIP COST (1 Traveler) ===");
console.log(JSON.stringify(calculateTripCost({ distance: 500, mileage: 20, fuelPrice: 100, travelers: 1 }).items, null, 2));
