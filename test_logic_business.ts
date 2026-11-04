import { 
  calculateGst, 
  calculateGstInclusive, 
  calculateGstExclusive, 
  calculateCgst, 
  calculateSgst, 
  calculateIgst, 
  calculateCommission, 
  calculateBreakEven 
} from './src/calculators/business/logic';

console.log("=== GST 18% INTRA-STATE TEST ===");
console.log(JSON.stringify(calculateGst({ baseAmount: 10000, rate: 18, gstType: 'intra' }).items, null, 2));

console.log("\n=== GST 18% INTER-STATE TEST ===");
console.log(JSON.stringify(calculateGst({ baseAmount: 10000, rate: 18, gstType: 'inter' }).items, null, 2));

console.log("\n=== GST INCLUSIVE 18% INTRA-STATE TEST ===");
console.log(JSON.stringify(calculateGstInclusive({ finalAmount: 11800, rate: 18, gstType: 'intra' }).items, null, 2));

console.log("\n=== GST INCLUSIVE 18% INTER-STATE TEST ===");
console.log(JSON.stringify(calculateGstInclusive({ finalAmount: 11800, rate: 18, gstType: 'inter' }).items, null, 2));

console.log("\n=== GST EXCLUSIVE 12% INTRA-STATE TEST ===");
console.log(JSON.stringify(calculateGstExclusive({ baseAmount: 10000, rate: 12, gstType: 'intra' }).items, null, 2));

console.log("\n=== CGST TEST ===");
console.log(JSON.stringify(calculateCgst({ baseAmount: 10000, rate: 18 }).items, null, 2));

console.log("\n=== SGST TEST ===");
console.log(JSON.stringify(calculateSgst({ baseAmount: 10000, rate: 18 }).items, null, 2));

console.log("\n=== IGST TEST ===");
console.log(JSON.stringify(calculateIgst({ baseAmount: 10000, rate: 18 }).items, null, 2));

console.log("\n=== COMMISSION DEDUCT TEST ===");
console.log(JSON.stringify(calculateCommission({ salesAmount: 5000, commissionRate: 10, commissionMode: 'deduct' }).items, null, 2));

console.log("\n=== COMMISSION ADD TEST ===");
console.log(JSON.stringify(calculateCommission({ salesAmount: 5000, commissionRate: 10, commissionMode: 'add' }).items, null, 2));
