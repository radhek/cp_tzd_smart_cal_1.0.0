import { suggestCalculator, extractAllNumbers } from './src/features/scan/parser/engine';

const runTest = (text: string) => {
  console.log(`\nTEST: "${text}"`);
  console.log(JSON.stringify(suggestCalculator(text), null, 2));
};

console.log("=== OCR PARSER TESTS ===");
runTest("Amount ₹10,000 IGST 18%");
runTest("Price 2000 Discount 15%");
runTest("Cost 500 Selling Price 600");
runTest("Bill 2000 People 4");
runTest("Distance 300 km Mileage 15 km/l Fuel Price 100");
runTest("Loan 500000 Interest 10.5% Tenure 5 years");
runTest("No useful calculation text");
runTest("9876543210");
runTest("GST 18%");
runTest("Amount 10000");

// Also check number extraction
console.log("\nEXTRACT NUMBERS:");
console.log(extractAllNumbers("10,000.50 and 1,000 and 18% and 9876543210"));
