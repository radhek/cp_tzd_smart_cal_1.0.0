import { CalculationResult, CalculationResultItem } from '../../types/calculator';
import { safeMath } from '../engine';

const calculateGstComponents = (baseAmount: number, rate: number, isInterState: boolean) => {
  const gstAmount = baseAmount * (rate / 100);
  const cgst = isInterState ? 0 : gstAmount / 2;
  const sgst = isInterState ? 0 : gstAmount / 2;
  const igst = isInterState ? gstAmount : 0;
  const finalAmount = baseAmount + gstAmount;
  
  return { gstAmount, cgst, sgst, igst, finalAmount };
};

export const calculateGst = (inputs: Record<string, any>): CalculationResult => {
  const baseAmount = Number(inputs.baseAmount);
  const rate = Number(inputs.rate);
  const isInterState = inputs.gstType === 'inter';
  const { gstAmount, cgst, sgst, igst, finalAmount } = calculateGstComponents(baseAmount, rate, isInterState);

  const items: CalculationResultItem[] = [
    { id: 'finalAmount', labelKey: 'calculators.gst.finalAmount', value: safeMath.roundToTwo(finalAmount), type: 'currency', isPrimary: true },
    { id: 'gstAmount', labelKey: 'calculators.gst.gstAmount', value: safeMath.roundToTwo(gstAmount), type: 'currency' }
  ];

  if (isInterState) {
    items.push({ id: 'igst', labelKey: 'calculators.gst.igst', value: safeMath.roundToTwo(igst), type: 'currency' });
  } else {
    items.push(
      { id: 'cgst', labelKey: 'calculators.gst.cgst', value: safeMath.roundToTwo(cgst), type: 'currency' },
      { id: 'sgst', labelKey: 'calculators.gst.sgst', value: safeMath.roundToTwo(sgst), type: 'currency' }
    );
  }

  return { items };
};

export const calculateGstInclusive = (inputs: Record<string, any>): CalculationResult => {
  const finalAmount = Number(inputs.finalAmount);
  const rate = Number(inputs.rate);
  const isInterState = inputs.gstType === 'inter';
  
  const baseAmount = finalAmount / (1 + (rate / 100));
  const gstAmount = finalAmount - baseAmount;
  const cgst = isInterState ? 0 : gstAmount / 2;
  const sgst = isInterState ? 0 : gstAmount / 2;
  const igst = isInterState ? gstAmount : 0;

  const items: CalculationResultItem[] = [
    { id: 'baseAmount', labelKey: 'calculators.gst.baseAmount', value: safeMath.roundToTwo(baseAmount), type: 'currency', isPrimary: true },
    { id: 'gstAmount', labelKey: 'calculators.gst.gstAmount', value: safeMath.roundToTwo(gstAmount), type: 'currency' }
  ];

  if (isInterState) {
    items.push({ id: 'igst', labelKey: 'calculators.gst.igst', value: safeMath.roundToTwo(igst), type: 'currency' });
  } else {
    items.push(
      { id: 'cgst', labelKey: 'calculators.gst.cgst', value: safeMath.roundToTwo(cgst), type: 'currency' },
      { id: 'sgst', labelKey: 'calculators.gst.sgst', value: safeMath.roundToTwo(sgst), type: 'currency' }
    );
  }

  return { items };
};

export const calculateGstExclusive = (inputs: Record<string, any>): CalculationResult => {
  // It's technically same logic as calculateGst but UI shows different flow, let's keep it separate for clarity
  const baseAmount = Number(inputs.baseAmount);
  const rate = Number(inputs.rate);
  const isInterState = inputs.gstType === 'inter';
  const { gstAmount, finalAmount } = calculateGstComponents(baseAmount, rate, isInterState);

  return {
    items: [
      { id: 'finalAmount', labelKey: 'calculators.gst.finalAmount', value: safeMath.roundToTwo(finalAmount), type: 'currency', isPrimary: true },
      { id: 'gstAmount', labelKey: 'calculators.gst.gstAmount', value: safeMath.roundToTwo(gstAmount), type: 'currency' },
    ]
  };
};

export const calculateCgst = (inputs: Record<string, any>): CalculationResult => {
  const baseAmount = Number(inputs.baseAmount);
  const totalRate = Number(inputs.rate);
  const cgstRate = totalRate / 2;
  const cgst = baseAmount * (cgstRate / 100);

  return {
    items: [
      { id: 'cgst', labelKey: 'calculators.cgst.amount', value: safeMath.roundToTwo(cgst), type: 'currency', isPrimary: true },
      { id: 'cgstRate', labelKey: 'calculators.cgst.rateApplied', value: safeMath.roundToTwo(cgstRate), type: 'percentage' },
    ]
  };
};

export const calculateSgst = (inputs: Record<string, any>): CalculationResult => {
  const baseAmount = Number(inputs.baseAmount);
  const totalRate = Number(inputs.rate);
  const sgstRate = totalRate / 2;
  const sgst = baseAmount * (sgstRate / 100);

  return {
    items: [
      { id: 'sgst', labelKey: 'calculators.sgst.amount', value: safeMath.roundToTwo(sgst), type: 'currency', isPrimary: true },
      { id: 'sgstRate', labelKey: 'calculators.sgst.rateApplied', value: safeMath.roundToTwo(sgstRate), type: 'percentage' },
    ]
  };
};

export const calculateIgst = (inputs: Record<string, any>): CalculationResult => {
  const baseAmount = Number(inputs.baseAmount);
  const totalRate = Number(inputs.rate);
  const igstRate = totalRate;
  const igst = baseAmount * (igstRate / 100);
  const finalAmount = baseAmount + igst;

  return {
    items: [
      { id: 'finalAmount', labelKey: 'calculators.gst.finalAmount', value: safeMath.roundToTwo(finalAmount), type: 'currency', isPrimary: true },
      { id: 'igst', labelKey: 'calculators.gst.igst', value: safeMath.roundToTwo(igst), type: 'currency' },
    ]
  };
};

export const calculateCommission = (inputs: Record<string, any>): CalculationResult => {
  const salesAmount = Number(inputs.salesAmount);
  const commissionRate = Number(inputs.commissionRate);
  const mode = inputs.commissionMode || 'deduct'; // 'deduct' | 'add'

  const commissionAmount = salesAmount * (commissionRate / 100);
  
  if (mode === 'add') {
    const totalAmount = salesAmount + commissionAmount;
    return {
      items: [
        { id: 'totalWithCommission', labelKey: 'calculators.commission.totalAmount', value: safeMath.roundToTwo(totalAmount), type: 'currency', isPrimary: true },
        { id: 'commissionAmount', labelKey: 'calculators.commission.amount', value: safeMath.roundToTwo(commissionAmount), type: 'currency' },
      ]
    };
  } else {
    const netAmount = salesAmount - commissionAmount;
    return {
      items: [
        { id: 'netAfterCommission', labelKey: 'calculators.commission.netAmount', value: safeMath.roundToTwo(netAmount), type: 'currency', isPrimary: true },
        { id: 'commissionAmount', labelKey: 'calculators.commission.amount', value: safeMath.roundToTwo(commissionAmount), type: 'currency' },
      ]
    };
  }
};

export const calculateBreakEven = (inputs: Record<string, any>): CalculationResult => {
  const fixedCosts = Number(inputs.fixedCosts);
  const sellingPrice = Number(inputs.sellingPrice);
  const variableCost = Number(inputs.variableCost);

  // Formula: Contribution Margin = Selling Price - Variable Cost
  const contributionPerUnit = sellingPrice - variableCost;
  
  // Formula: Break-Even Units = Fixed Costs / Contribution Margin
  const breakEvenUnits = contributionPerUnit > 0 ? fixedCosts / contributionPerUnit : 0;
  
  // Formula: Break-Even Revenue = Break-Even Units * Selling Price
  const breakEvenRevenue = breakEvenUnits * sellingPrice;

  return {
    items: [
      { id: 'breakEvenUnits', labelKey: 'calculators.breakEven.units', value: Math.ceil(breakEvenUnits), type: 'number', isPrimary: true },
      { id: 'breakEvenRevenue', labelKey: 'calculators.breakEven.revenue', value: safeMath.roundToTwo(breakEvenRevenue), type: 'currency' },
      { id: 'contributionPerUnit', labelKey: 'calculators.breakEven.contribution', value: safeMath.roundToTwo(contributionPerUnit), type: 'currency' },
    ]
  };
};
