import { 
  calculateTemperature,
  calculateLength,
  calculateWeight,
  calculateArea,
  calculateVolume,
  calculateSpeed,
  calculateTime,
  calculateData,
  calculatePressure,
  calculateEnergy
} from './src/calculators/converters/logic';

const runTest = (name: string, fn: any, value: number, from: string, to: string) => {
  const result = fn({ value, from, to });
  console.log(`${name} (${value} ${from} -> ${to}):`, result.items[0]?.value);
};

console.log("=== TEMPERATURE TESTS ===");
runTest("Celsius to Fahrenheit", calculateTemperature, 0, "c", "f"); // 32
runTest("Celsius to Fahrenheit", calculateTemperature, 100, "c", "f"); // 212
runTest("Celsius to Kelvin", calculateTemperature, 0, "c", "k"); // 273.15
runTest("Fahrenheit to Celsius", calculateTemperature, 32, "f", "c"); // 0
runTest("Kelvin to Celsius", calculateTemperature, 273.15, "k", "c"); // 0

console.log("\n=== LENGTH TESTS ===");
runTest("km to m", calculateLength, 1, "km", "m"); // 1000
runTest("mile to km", calculateLength, 1, "mi", "km"); // 1.609344
runTest("inch to cm", calculateLength, 1, "in", "cm"); // 2.54

console.log("\n=== WEIGHT TESTS ===");
runTest("kg to g", calculateWeight, 1, "kg", "g"); // 1000
runTest("lb to kg", calculateWeight, 1, "lb", "kg"); // 0.453592

console.log("\n=== AREA TESTS ===");
runTest("hectare to m2", calculateArea, 1, "hectare", "sq_m"); // 10000
runTest("acre to m2", calculateArea, 1, "acre", "sq_m"); // 4046.856422

console.log("\n=== VOLUME TESTS ===");
runTest("l to ml", calculateVolume, 1, "l", "ml"); // 1000
runTest("gal to l", calculateVolume, 1, "gal", "l"); // 3.785412

console.log("\n=== SPEED TESTS ===");
runTest("kmh to ms", calculateSpeed, 1, "kmph", "mps"); // 0.277778
runTest("mph to kmh", calculateSpeed, 1, "mph", "kmph"); // 1.609344

console.log("\n=== TIME TESTS ===");
runTest("min to s", calculateTime, 1, "min", "s"); // 60
runTest("hr to s", calculateTime, 1, "hr", "s"); // 3600
runTest("day to s", calculateTime, 1, "day", "s"); // 86400

console.log("\n=== DATA TESTS ===");
runTest("KB to bytes", calculateData, 1, "kb", "byte"); // 1024
runTest("MB to KB", calculateData, 1, "mb", "kb"); // 1024
runTest("GB to MB", calculateData, 1, "gb", "mb"); // 1024

console.log("\n=== PRESSURE TESTS ===");
runTest("bar to Pa", calculatePressure, 1, "bar", "pa"); // 100000
runTest("atm to Pa", calculatePressure, 1, "atm", "pa"); // 101325

console.log("\n=== ENERGY TESTS ===");
runTest("kWh to J", calculateEnergy, 1, "kwh", "j"); // 3600000
runTest("kcal to J", calculateEnergy, 1, "kcal", "j"); // 4184
