import { 
  calculateEmi, 
  calculateLoan,
  calculateSimpleInterest, 
  calculateCompoundInterest, 
  calculateSip 
} from './src/calculators/finance/logic';

console.log("=== EMI TEST ===");
console.log(JSON.stringify(calculateEmi({ principal: 500000, rate: 10.5, tenure: 5, tenureUnit: 'years' }).items, null, 2));

console.log("\n=== LOAN TEST ===");
console.log(JSON.stringify(calculateLoan({ principal: 500000, rate: 10.5, time: 5 }).items, null, 2));

console.log("\n=== SIMPLE INTEREST TEST ===");
console.log(JSON.stringify(calculateSimpleInterest({ principal: 10000, rate: 5, time: 2 }).items, null, 2));

console.log("\n=== COMPOUND INTEREST TEST ===");
console.log(JSON.stringify(calculateCompoundInterest({ principal: 10000, rate: 5, time: 2, frequency: 1 }).items, null, 2));

console.log("\n=== SIP TEST ===");
console.log(JSON.stringify(calculateSip({ monthlyInvestment: 5000, expectedReturn: 12, time: 10 }).items, null, 2));
