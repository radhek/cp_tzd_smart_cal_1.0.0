import { 
  calculateLumpSum, 
  calculateRoi, 
  calculateProfitLoss, 
  calculateMargin, 
  calculateMarkup, 
  calculateDiscount 
} from './src/calculators/finance/logic';

console.log("=== LUMP SUM TEST ===");
// Principal: 100000, rate: 10%, time: 5 years -> 161051
console.log(JSON.stringify(calculateLumpSum({ investment: 100000, rate: 10, time: 5 }).items, null, 2));

console.log("\n=== ROI TEST ===");
// Initial: 1000, Final: 1500 -> 500 gain, 50% ROI
console.log(JSON.stringify(calculateRoi({ initial: 1000, final: 1500 }).items, null, 2));

console.log("\n=== PROFIT/LOSS TEST ===");
// Cost: 500, Revenue: 600 -> 100 profit, 20% profit
console.log(JSON.stringify(calculateProfitLoss({ cost: 500, revenue: 600 }).items, null, 2));
// Cost: 600, Revenue: 500 -> 100 loss, 16.67% loss
console.log(JSON.stringify(calculateProfitLoss({ cost: 600, revenue: 500 }).items, null, 2));

console.log("\n=== MARGIN TEST ===");
// Cost: 80, Revenue: 100 -> Profit 20, Margin 20%
console.log(JSON.stringify(calculateMargin({ cost: 80, revenue: 100 }).items, null, 2));

console.log("\n=== MARKUP TEST ===");
// Cost: 80, Markup: 25% -> Revenue 100, Profit 20, Margin 20%
console.log(JSON.stringify(calculateMarkup({ cost: 80, markupPercent: 25 }).items, null, 2));

console.log("\n=== DISCOUNT TEST ===");
// Original: 200, Discount: 15% -> Discount 30, Final 170
console.log(JSON.stringify(calculateDiscount({ originalPrice: 200, discountPercent: 15 }).items, null, 2));
