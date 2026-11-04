import { CalculatorDefinition } from '../../types/calculator';

export const EmiCalculatorDef: CalculatorDefinition = {
  id: 'finance-emi',
  category: 'finance',
  titleKey: 'calculators.emi.title',
  descriptionKey: 'calculators.emi.description',
  fields: [
    { id: 'principal', type: 'currency', labelKey: 'calculators.emi.loanAmount', required: true, min: 0 },
    { id: 'rate', type: 'percentage', labelKey: 'calculators.emi.interestRate', required: true, min: 0 },
    { id: 'tenure', type: 'duration', labelKey: 'calculators.emi.tenure', required: true, min: 1 },
    { 
      id: 'tenureUnit', 
      type: 'segmented', 
      labelKey: 'common.years', // Will be hidden by custom UI or we can use segmented
      options: [
        { labelKey: 'common.years', value: 'years' },
        { labelKey: 'common.months', value: 'months' }
      ],
      defaultValue: 'years'
    }
  ]
};

export const SimpleInterestDef: CalculatorDefinition = {
  id: 'finance-simple-interest',
  category: 'finance',
  titleKey: 'calculators.simpleInterest.title',
  descriptionKey: 'calculators.simpleInterest.description',
  fields: [
    { id: 'principal', type: 'currency', labelKey: 'calculators.simpleInterest.principal', required: true, min: 0 },
    { id: 'rate', type: 'percentage', labelKey: 'calculators.simpleInterest.rate', required: true, min: 0 },
    { id: 'time', type: 'duration', labelKey: 'calculators.simpleInterest.time', required: true, min: 0 },
  ]
};

export const CompoundInterestDef: CalculatorDefinition = {
  id: 'finance-compound-interest',
  category: 'finance',
  titleKey: 'calculators.compoundInterest.title',
  descriptionKey: 'calculators.compoundInterest.description',
  fields: [
    { id: 'principal', type: 'currency', labelKey: 'calculators.compoundInterest.principal', required: true, min: 0 },
    { id: 'rate', type: 'percentage', labelKey: 'calculators.compoundInterest.rate', required: true, min: 0 },
    { id: 'time', type: 'duration', labelKey: 'calculators.compoundInterest.time', required: true, min: 0 },
    { 
      id: 'frequency', 
      type: 'segmented', 
      labelKey: 'calculators.compoundInterest.frequency',
      options: [
        { labelKey: 'calculators.compoundInterest.yearly', value: '1' },
        { labelKey: 'calculators.compoundInterest.halfYearly', value: '2' },
        { labelKey: 'calculators.compoundInterest.quarterly', value: '4' },
        { labelKey: 'calculators.compoundInterest.monthly', value: '12' }
      ],
      defaultValue: '1'
    }
  ]
};

export const SipCalculatorDef: CalculatorDefinition = {
  id: 'finance-sip',
  category: 'finance',
  titleKey: 'calculators.sip.title',
  descriptionKey: 'calculators.sip.description',
  fields: [
    { id: 'monthlyInvestment', type: 'currency', labelKey: 'calculators.sip.monthlyInvestment', required: true, min: 0 },
    { id: 'expectedReturn', type: 'percentage', labelKey: 'calculators.sip.expectedReturn', required: true, min: 0 },
    { id: 'time', type: 'duration', labelKey: 'calculators.sip.time', required: true, min: 1 },
  ]
};

export const LoanCalculatorDef: CalculatorDefinition = {
  id: 'finance-loan',
  category: 'finance',
  titleKey: 'calculators.loan.title',
  descriptionKey: 'calculators.loan.description',
  fields: [
    { id: 'principal', type: 'currency', labelKey: 'calculators.loan.amount', required: true, min: 0 },
    { id: 'rate', type: 'percentage', labelKey: 'calculators.loan.rate', required: true, min: 0 },
    { id: 'time', type: 'duration', labelKey: 'calculators.loan.time', required: true, min: 1 },
  ]
};

export const LumpSumCalculatorDef: CalculatorDefinition = {
  id: 'finance-lump-sum',
  category: 'finance',
  titleKey: 'calculators.lumpSum.title',
  descriptionKey: 'calculators.lumpSum.description',
  fields: [
    { id: 'investment', type: 'currency', labelKey: 'calculators.lumpSum.investment', required: true, min: 0 },
    { id: 'rate', type: 'percentage', labelKey: 'calculators.lumpSum.rate', required: true, min: 0 },
    { id: 'time', type: 'duration', labelKey: 'calculators.lumpSum.time', required: true, min: 1 },
  ]
};

export const RoiCalculatorDef: CalculatorDefinition = {
  id: 'finance-roi',
  category: 'finance',
  titleKey: 'calculators.roi.title',
  descriptionKey: 'calculators.roi.description',
  fields: [
    { id: 'initial', type: 'currency', labelKey: 'calculators.roi.initial', required: true, min: 0 },
    { id: 'final', type: 'currency', labelKey: 'calculators.roi.final', required: true, min: 0 },
  ]
};

export const ProfitLossCalculatorDef: CalculatorDefinition = {
  id: 'finance-profit-loss',
  category: 'finance',
  titleKey: 'calculators.profitLoss.title',
  descriptionKey: 'calculators.profitLoss.description',
  fields: [
    { id: 'cost', type: 'currency', labelKey: 'calculators.profitLoss.cost', required: true, min: 0 },
    { id: 'revenue', type: 'currency', labelKey: 'calculators.profitLoss.revenue', required: true, min: 0 },
  ]
};

export const MarginCalculatorDef: CalculatorDefinition = {
  id: 'finance-margin',
  category: 'finance',
  titleKey: 'calculators.margin.title',
  descriptionKey: 'calculators.margin.description',
  fields: [
    { id: 'cost', type: 'currency', labelKey: 'calculators.margin.cost', required: true, min: 0 },
    { id: 'revenue', type: 'currency', labelKey: 'calculators.margin.revenue', required: true, min: 0 },
  ]
};

export const MarkupCalculatorDef: CalculatorDefinition = {
  id: 'finance-markup',
  category: 'finance',
  titleKey: 'calculators.markup.title',
  descriptionKey: 'calculators.markup.description',
  fields: [
    { id: 'cost', type: 'currency', labelKey: 'calculators.markup.cost', required: true, min: 0 },
    { id: 'markupPercent', type: 'percentage', labelKey: 'calculators.markup.markupPercent', required: true, min: 0 },
  ]
};

export const DiscountCalculatorDef: CalculatorDefinition = {
  id: 'finance-discount',
  category: 'finance',
  titleKey: 'calculators.discount.title',
  descriptionKey: 'calculators.discount.description',
  fields: [
    { id: 'originalPrice', type: 'currency', labelKey: 'calculators.discount.originalPrice', required: true, min: 0 },
    { id: 'discountPercent', type: 'percentage', labelKey: 'calculators.discount.discountPercent', required: true, min: 0 },
  ]
};
