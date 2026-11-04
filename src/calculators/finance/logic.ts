import { CalculationResult } from '../../types/calculator';
import { safeMath } from '../engine';

export const calculateEmi = (inputs: Record<string, any>): CalculationResult => {
  const p = Number(inputs.principal) || 0;
  const rate = Number(inputs.rate) || 0;
  const r = rate / 12 / 100; // monthly interest
  const isMonths = inputs.tenureUnit === 'months';
  const rawTenure = inputs.tenure !== undefined && inputs.tenure !== '' 
    ? Number(inputs.tenure) 
    : Number(inputs.time || 0);
  const n = isMonths ? rawTenure : rawTenure * 12;

  let emi = 0;
  let totalPayment = 0;
  let totalInterest = 0;

  if (p <= 0 || n <= 0) {
    return {
      items: [
        { id: 'emi', labelKey: 'calculators.emi.monthlyEmi', value: 0, type: 'currency', isPrimary: true },
        { id: 'totalInterest', labelKey: 'calculators.emi.totalInterest', value: 0, type: 'currency' },
        { id: 'totalPayment', labelKey: 'calculators.emi.totalPayment', value: safeMath.roundToTwo(p), type: 'currency' },
      ]
    };
  }

  if (r === 0) {
    emi = p / n;
    totalPayment = p;
    totalInterest = 0;
  } else {
    emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    totalPayment = emi * n;
    totalInterest = totalPayment - p;
  }

  return {
    items: [
      { id: 'emi', labelKey: 'calculators.emi.monthlyEmi', value: safeMath.roundToTwo(emi), type: 'currency', isPrimary: true },
      { id: 'totalInterest', labelKey: 'calculators.emi.totalInterest', value: safeMath.roundToTwo(totalInterest), type: 'currency' },
      { id: 'totalPayment', labelKey: 'calculators.emi.totalPayment', value: safeMath.roundToTwo(totalPayment), type: 'currency' },
    ]
  };
};

export const calculateSimpleInterest = (inputs: Record<string, any>): CalculationResult => {
  const p = Number(inputs.principal) || 0;
  const r = Number(inputs.rate) || 0;
  const t = Number(inputs.time) || 0;

  const interest = (p * r * t) / 100;
  const amount = p + interest;

  return {
    items: [
      { id: 'interest', labelKey: 'calculators.simpleInterest.totalInterest', value: safeMath.roundToTwo(interest), type: 'currency', isPrimary: true },
      { id: 'principal', labelKey: 'calculators.simpleInterest.principalAmount', value: p, type: 'currency' },
      { id: 'amount', labelKey: 'calculators.simpleInterest.totalAmount', value: safeMath.roundToTwo(amount), type: 'currency' },
    ]
  };
};

export const calculateCompoundInterest = (inputs: Record<string, any>): CalculationResult => {
  const p = Number(inputs.principal) || 0;
  const r = (Number(inputs.rate) || 0) / 100;
  const t = Number(inputs.time) || 0;
  const n = Number(inputs.frequency || 1);

  const amount = p * Math.pow(1 + (r / n), n * t);
  const interest = amount - p;

  return {
    items: [
      { id: 'amount', labelKey: 'calculators.compoundInterest.totalAmount', value: safeMath.roundToTwo(amount), type: 'currency', isPrimary: true },
      { id: 'principal', labelKey: 'calculators.compoundInterest.principalAmount', value: p, type: 'currency' },
      { id: 'interest', labelKey: 'calculators.compoundInterest.totalInterest', value: safeMath.roundToTwo(interest), type: 'currency' },
    ]
  };
};

export const calculateSip = (inputs: Record<string, any>): CalculationResult => {
  const p = Number(inputs.monthlyInvestment) || 0;
  const r = (Number(inputs.expectedReturn) || 0) / 12 / 100;
  const n = (Number(inputs.time) || 0) * 12;

  let expectedAmount = 0;
  if (r === 0) {
    expectedAmount = p * n;
  } else {
    expectedAmount = p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  }
  const investedAmount = p * n;
  const estimatedReturns = expectedAmount - investedAmount;

  return {
    items: [
      { id: 'futureValue', labelKey: 'calculators.sip.futureValue', value: safeMath.roundToTwo(expectedAmount), type: 'currency', isPrimary: true },
      { id: 'invested', labelKey: 'calculators.sip.investedAmount', value: safeMath.roundToTwo(investedAmount), type: 'currency' },
      { id: 'returns', labelKey: 'calculators.sip.estimatedReturns', value: safeMath.roundToTwo(estimatedReturns), type: 'currency' },
    ]
  };
};

export const calculateLoan = (inputs: Record<string, any>): CalculationResult => {
  const p = Number(inputs.principal) || 0;
  const rate = Number(inputs.rate) || 0;
  const r = rate / 12 / 100; // monthly interest rate
  const rawTime = inputs.time !== undefined && inputs.time !== '' 
    ? Number(inputs.time) 
    : Number(inputs.tenure || 0);
  const isMonths = inputs.tenureUnit === 'months';
  const n = isMonths ? rawTime : rawTime * 12;

  let monthlyPayment = 0;
  let totalPayment = 0;
  let totalInterest = 0;

  if (p <= 0 || n <= 0) {
    return {
      items: [
        { id: 'monthlyPayment', labelKey: 'calculators.loan.monthlyPayment', value: 0, type: 'currency', isPrimary: true },
        { id: 'totalInterest', labelKey: 'calculators.loan.totalInterest', value: 0, type: 'currency' },
        { id: 'totalPayment', labelKey: 'calculators.loan.totalPayment', value: safeMath.roundToTwo(p), type: 'currency' },
      ]
    };
  }

  if (r === 0) {
    monthlyPayment = p / n;
    totalPayment = p;
    totalInterest = 0;
  } else {
    monthlyPayment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    totalPayment = monthlyPayment * n;
    totalInterest = totalPayment - p;
  }

  return {
    items: [
      { id: 'monthlyPayment', labelKey: 'calculators.loan.monthlyPayment', value: safeMath.roundToTwo(monthlyPayment), type: 'currency', isPrimary: true },
      { id: 'totalInterest', labelKey: 'calculators.loan.totalInterest', value: safeMath.roundToTwo(totalInterest), type: 'currency' },
      { id: 'totalPayment', labelKey: 'calculators.loan.totalPayment', value: safeMath.roundToTwo(totalPayment), type: 'currency' },
    ]
  };
};

export const calculateLumpSum = (inputs: Record<string, any>): CalculationResult => {
  // Formula: Future Value = P * (1 + r)^t
  // where P is investment, r is annual rate, t is time in years
  const p = Number(inputs.investment);
  const r = Number(inputs.rate) / 100;
  const t = Number(inputs.time);

  const expectedAmount = p * Math.pow(1 + r, t);
  const estimatedReturns = expectedAmount - p;

  return {
    items: [
      { id: 'futureValue', labelKey: 'calculators.lumpSum.futureValue', value: safeMath.roundToTwo(expectedAmount), type: 'currency', isPrimary: true },
      { id: 'invested', labelKey: 'calculators.lumpSum.investedAmount', value: safeMath.roundToTwo(p), type: 'currency' },
      { id: 'returns', labelKey: 'calculators.lumpSum.estimatedReturns', value: safeMath.roundToTwo(estimatedReturns), type: 'currency' },
    ]
  };
};

export const calculateRoi = (inputs: Record<string, any>): CalculationResult => {
  // Formula: ROI % = ((Final Value - Initial Investment) / Initial Investment) * 100
  const initial = Number(inputs.initial) || 0;
  const final = Number(inputs.final) || 0;

  const gain = final - initial;
  const roi = initial > 0 ? (gain / initial) * 100 : 0;

  return {
    items: [
      { id: 'roi', labelKey: 'calculators.roi.roiPercent', value: safeMath.roundToTwo(roi), type: 'percentage', isPrimary: true },
      { id: 'gain', labelKey: 'calculators.roi.gainLoss', value: safeMath.roundToTwo(gain), type: 'currency' },
    ]
  };
};

export const calculateProfitLoss = (inputs: Record<string, any>): CalculationResult => {
  // Formula: Amount = Revenue - Cost. Percent = (Amount / Cost) * 100
  const cost = Number(inputs.cost);
  const revenue = Number(inputs.revenue);

  const amount = revenue - cost;
  const isProfit = amount >= 0;
  const percent = cost > 0 ? (amount / cost) * 100 : 0;

  return {
    items: [
      { id: 'amount', labelKey: isProfit ? 'calculators.profitLoss.profit' : 'calculators.profitLoss.loss', value: safeMath.roundToTwo(Math.abs(amount)), type: 'currency', isPrimary: true },
      { id: 'percent', labelKey: isProfit ? 'calculators.profitLoss.profitPercent' : 'calculators.profitLoss.lossPercent', value: safeMath.roundToTwo(Math.abs(percent)), type: 'percentage' },
    ]
  };
};

export const calculateMargin = (inputs: Record<string, any>): CalculationResult => {
  // Formula: Margin % = ((Revenue - Cost) / Revenue) * 100. Gross Profit = Revenue - Cost.
  const cost = Number(inputs.cost);
  const revenue = Number(inputs.revenue);

  const profit = revenue - cost;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

  return {
    items: [
      { id: 'margin', labelKey: 'calculators.margin.marginPercent', value: safeMath.roundToTwo(margin), type: 'percentage', isPrimary: true },
      { id: 'profit', labelKey: 'calculators.margin.grossProfit', value: safeMath.roundToTwo(profit), type: 'currency' },
    ]
  };
};

export const calculateMarkup = (inputs: Record<string, any>): CalculationResult => {
  // Formula: Revenue = Cost * (1 + Markup / 100). Profit = Revenue - Cost. Margin = (Profit / Revenue) * 100
  const cost = Number(inputs.cost);
  const markupPercent = Number(inputs.markupPercent);

  const profit = cost * (markupPercent / 100);
  const revenue = cost + profit;
  const marginPercent = revenue > 0 ? (profit / revenue) * 100 : 0;

  return {
    items: [
      { id: 'revenue', labelKey: 'calculators.markup.sellingPrice', value: safeMath.roundToTwo(revenue), type: 'currency', isPrimary: true },
      { id: 'profit', labelKey: 'calculators.markup.grossProfit', value: safeMath.roundToTwo(profit), type: 'currency' },
      { id: 'margin', labelKey: 'calculators.markup.marginPercent', value: safeMath.roundToTwo(marginPercent), type: 'percentage' },
    ]
  };
};

export const calculateDiscount = (inputs: Record<string, any>): CalculationResult => {
  // Formula: Discount Amount = Original Price * (Discount Percent / 100). Final Price = Original - Discount.
  const original = Number(inputs.originalPrice);
  const discountPercent = Number(inputs.discountPercent);

  const discountAmount = original * (discountPercent / 100);
  const finalPrice = original - discountAmount;

  return {
    items: [
      { id: 'finalPrice', labelKey: 'calculators.discount.finalPrice', value: safeMath.roundToTwo(finalPrice), type: 'currency', isPrimary: true },
      { id: 'discountAmount', labelKey: 'calculators.discount.discountAmount', value: safeMath.roundToTwo(discountAmount), type: 'currency' },
      { id: 'savings', labelKey: 'calculators.discount.savings', value: safeMath.roundToTwo(discountAmount), type: 'currency' }, // Same as discount amount, useful for UI clarity
    ]
  };
};
