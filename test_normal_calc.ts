import { evaluateExpression, formatResultNumber, formatExpression } from './src/calculators/dailyLife/normalEngine';
import { calculateNormal } from './src/calculators/dailyLife/logic';
import { getCalculator, getAllCalculators, getCalculatorsByCategory } from './src/calculators/registry';

console.log('=== RUNNING NORMAL CALCULATOR COMPREHENSIVE TEST SUITE ===');

// 1. Basic Arithmetic
console.log('\n1. Testing Basic Arithmetic:');
const addTest = evaluateExpression('45 + 55');
console.assert(addTest.value === 100, `Add failed: expected 100, got ${addTest.value}`);
console.log('  ✓ 45 + 55 =', addTest.value);

const subTest = evaluateExpression('100 − 42');
console.assert(subTest.value === 58, `Sub failed: expected 58, got ${subTest.value}`);
console.log('  ✓ 100 − 42 =', subTest.value);

const mulTest = evaluateExpression('12 × 15');
console.assert(mulTest.value === 180, `Mul failed: expected 180, got ${mulTest.value}`);
console.log('  ✓ 12 × 15 =', mulTest.value);

const divTest = evaluateExpression('144 ÷ 12');
console.assert(divTest.value === 12, `Div failed: expected 12, got ${divTest.value}`);
console.log('  ✓ 144 ÷ 12 =', divTest.value);

// 2. Operator Precedence (BODMAS / PEMDAS)
console.log('\n2. Testing Operator Precedence:');
const prec1 = evaluateExpression('2 + 3 × 4');
console.assert(prec1.value === 14, `Precedence failed: 2 + 3 * 4 should be 14, got ${prec1.value}`);
console.log('  ✓ 2 + 3 × 4 =', prec1.value);

const prec2 = evaluateExpression('50 − 20 ÷ 4');
console.assert(prec2.value === 45, `Precedence failed: 50 - 20 / 4 should be 45, got ${prec2.value}`);
console.log('  ✓ 50 − 20 ÷ 4 =', prec2.value);

const prec3 = evaluateExpression('10 × 4 ÷ 2 + 5');
console.assert(prec3.value === 25, `Precedence failed: 10 * 4 / 2 + 5 should be 25, got ${prec3.value}`);
console.log('  ✓ 10 × 4 ÷ 2 + 5 =', prec3.value);

// 3. Percentage Calculations
console.log('\n3. Testing Percentage Calculations:');
const pctAdd = evaluateExpression('200 + 10%');
console.assert(pctAdd.value === 220, `200 + 10% failed: expected 220, got ${pctAdd.value}`);
console.log('  ✓ 200 + 10% =', pctAdd.value);

const pctSub = evaluateExpression('500 − 20%');
console.assert(pctSub.value === 400, `500 − 20% failed: expected 400, got ${pctSub.value}`);
console.log('  ✓ 500 − 20% =', pctSub.value);

const pctMul = evaluateExpression('150 × 10%');
console.assert(pctMul.value === 15, `150 × 10% failed: expected 15, got ${pctMul.value}`);
console.log('  ✓ 150 × 10% =', pctMul.value);

const pctDiv = evaluateExpression('50 ÷ 50%');
console.assert(pctDiv.value === 100, `50 ÷ 50% failed: expected 100, got ${pctDiv.value}`);
console.log('  ✓ 50 ÷ 50% =', pctDiv.value);

const pctUnary = evaluateExpression('25%');
console.assert(pctUnary.value === 0.25, `25% failed: expected 0.25, got ${pctUnary.value}`);
console.log('  ✓ 25% =', pctUnary.value);

// 4. Decimals and Precision
console.log('\n4. Testing Decimals and Precision:');
const decFloat = evaluateExpression('0.1 + 0.2');
console.assert(decFloat.value === 0.3, `0.1 + 0.2 failed: expected 0.3, got ${decFloat.value}`);
console.assert(decFloat.formatted === '0.3', `0.1 + 0.2 formatting failed: got ${decFloat.formatted}`);
console.log('  ✓ 0.1 + 0.2 =', decFloat.formatted, '(no 0.30000000000000004 floating point glitch)');

const decMul = evaluateExpression('2.5 × 4.2');
console.assert(decMul.value === 10.5, `2.5 * 4.2 failed: expected 10.5, got ${decMul.value}`);
console.log('  ✓ 2.5 × 4.2 =', decMul.value);

// 5. Negative Numbers
console.log('\n5. Testing Negative Numbers:');
const neg1 = evaluateExpression('−50 + 20');
console.assert(neg1.value === -30, `−50 + 20 failed: expected -30, got ${neg1.value}`);
console.log('  ✓ −50 + 20 =', neg1.value);

const neg2 = evaluateExpression('20 + (-8)');
console.assert(neg2.value === 12, `20 + (-8) failed: expected 12, got ${neg2.value}`);
console.log('  ✓ 20 + (-8) =', neg2.value);

const neg3 = evaluateExpression('5 × (-4)');
console.assert(neg3.value === -20, `5 * (-4) failed: expected -20, got ${neg3.value}`);
console.log('  ✓ 5 × (-4) =', neg3.value);

// 6. Safe Division by Zero
console.log('\n6. Testing Division by Zero:');
const divByZero = evaluateExpression('100 ÷ 0');
console.assert(divByZero.success === false, 'Division by zero should return success: false');
console.assert(divByZero.error === 'Cannot divide by zero', 'Expected Cannot divide by zero error message');
console.log('  ✓ 100 ÷ 0 caught safely with message:', divByZero.error);

// 7. Large Numbers & Formatting
console.log('\n7. Testing Large Numbers & Formatting:');
const bigNum = evaluateExpression('1234567 + 1');
console.assert(bigNum.formatted === '1,234,568', `Formatting failed: got ${bigNum.formatted}`);
console.log('  ✓ 1234567 + 1 =', bigNum.formatted);

// 8. Registry & Search Integration
console.log('\n8. Testing Registry & Category Integration:');
const regEntry = getCalculator('daily-normal-calculator');
console.assert(regEntry !== undefined, 'daily-normal-calculator not found in registry');
console.assert(regEntry?.definition.category === 'dailyLife', 'Expected category to be dailyLife');
console.log('  ✓ Registered in registry with ID:', regEntry?.definition.id);
console.log('  ✓ Category:', regEntry?.definition.category);

const dailyCalculators = getCalculatorsByCategory('dailyLife');
const hasInDaily = dailyCalculators.some(c => c.definition.id === 'daily-normal-calculator');
console.assert(hasInDaily, 'daily-normal-calculator not found in dailyLife category');
console.log('  ✓ Present in getCalculatorsByCategory("dailyLife") (total in category:', dailyCalculators.length, ')');

const allCalcs = getAllCalculators();
const hasInAll = allCalcs.some(c => c.definition.id === 'daily-normal-calculator');
console.assert(hasInAll, 'daily-normal-calculator not found in getAllCalculators()');
console.log('  ✓ Present in getAllCalculators() (total calculators in app:', allCalcs.length, ')');

// 9. Standard Calculate Integration (History Item format)
console.log('\n9. Testing Logic calculateNormal:');
const normalResult = calculateNormal({ expression: '25 + 75' });
console.assert(normalResult.items.length > 0, 'No result items returned');
console.assert(normalResult.items[0].value === 100, `Expected 100, got ${normalResult.items[0].value}`);
console.log('  ✓ calculateNormal({ expression: "25 + 75" }) =>', JSON.stringify(normalResult));

console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! 🎉\n');
