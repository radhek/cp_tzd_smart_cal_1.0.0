import { CalculatorDefinition } from '../../types/calculator';

const commonGstRates = [
  { labelKey: 'calculators.gst.rate0', value: 0 },
  { labelKey: 'calculators.gst.rate5', value: 5 },
  { labelKey: 'calculators.gst.rate12', value: 12 },
  { labelKey: 'calculators.gst.rate18', value: 18 },
  { labelKey: 'calculators.gst.rate28', value: 28 },
];

export const GstCalculatorDef: CalculatorDefinition = {
  id: 'business-gst',
  category: 'business',
  titleKey: 'calculators.gst.title',
  descriptionKey: 'calculators.gst.description',
  fields: [
    { id: 'baseAmount', type: 'currency', labelKey: 'calculators.gst.baseAmount', required: true, min: 0 },
    { id: 'rate', type: 'segmented', labelKey: 'calculators.gst.rate', required: true, options: commonGstRates },
    { 
      id: 'gstType', 
      type: 'segmented', 
      labelKey: 'calculators.business.gstType', 
      required: true, 
      options: [
        { labelKey: 'calculators.business.intraState', value: 'intra' },
        { labelKey: 'calculators.business.interState', value: 'inter' }
      ]
    },
  ]
};

export const GstInclusiveCalculatorDef: CalculatorDefinition = {
  id: 'business-gst-inclusive',
  category: 'business',
  titleKey: 'calculators.gstInclusive.title',
  descriptionKey: 'calculators.gstInclusive.description',
  fields: [
    { id: 'finalAmount', type: 'currency', labelKey: 'calculators.gstInclusive.finalAmount', required: true, min: 0 },
    { id: 'rate', type: 'segmented', labelKey: 'calculators.gst.rate', required: true, options: commonGstRates },
    { 
      id: 'gstType', 
      type: 'segmented', 
      labelKey: 'calculators.business.gstType', 
      required: true, 
      options: [
        { labelKey: 'calculators.business.intraState', value: 'intra' },
        { labelKey: 'calculators.business.interState', value: 'inter' }
      ]
    },
  ]
};

export const GstExclusiveCalculatorDef: CalculatorDefinition = {
  id: 'business-gst-exclusive',
  category: 'business',
  titleKey: 'calculators.gstExclusive.title',
  descriptionKey: 'calculators.gstExclusive.description',
  fields: [
    { id: 'baseAmount', type: 'currency', labelKey: 'calculators.gst.baseAmount', required: true, min: 0 },
    { id: 'rate', type: 'segmented', labelKey: 'calculators.gst.rate', required: true, options: commonGstRates },
    { 
      id: 'gstType', 
      type: 'segmented', 
      labelKey: 'calculators.business.gstType', 
      required: true, 
      options: [
        { labelKey: 'calculators.business.intraState', value: 'intra' },
        { labelKey: 'calculators.business.interState', value: 'inter' }
      ]
    },
  ]
};

export const CgstCalculatorDef: CalculatorDefinition = {
  id: 'business-cgst',
  category: 'business',
  titleKey: 'calculators.cgst.title',
  descriptionKey: 'calculators.cgst.description',
  fields: [
    { id: 'baseAmount', type: 'currency', labelKey: 'calculators.gst.baseAmount', required: true, min: 0 },
    { id: 'rate', type: 'segmented', labelKey: 'calculators.gst.totalRate', required: true, options: commonGstRates },
  ]
};

export const SgstCalculatorDef: CalculatorDefinition = {
  id: 'business-sgst',
  category: 'business',
  titleKey: 'calculators.sgst.title',
  descriptionKey: 'calculators.sgst.description',
  fields: [
    { id: 'baseAmount', type: 'currency', labelKey: 'calculators.gst.baseAmount', required: true, min: 0 },
    { id: 'rate', type: 'segmented', labelKey: 'calculators.gst.totalRate', required: true, options: commonGstRates },
  ]
};

export const IgstCalculatorDef: CalculatorDefinition = {
  id: 'business-igst',
  category: 'business',
  titleKey: 'calculators.igst.title',
  descriptionKey: 'calculators.igst.description',
  fields: [
    { id: 'baseAmount', type: 'currency', labelKey: 'calculators.gst.baseAmount', required: true, min: 0 },
    { id: 'rate', type: 'segmented', labelKey: 'calculators.gst.totalRate', required: true, options: commonGstRates },
  ]
};

export const CommissionCalculatorDef: CalculatorDefinition = {
  id: 'business-commission',
  category: 'business',
  titleKey: 'calculators.commission.title',
  descriptionKey: 'calculators.commission.description',
  fields: [
    { id: 'salesAmount', type: 'currency', labelKey: 'calculators.commission.salesAmount', required: true, min: 0 },
    { id: 'commissionRate', type: 'percentage', labelKey: 'calculators.commission.rate', required: true, min: 0 },
    { 
      id: 'commissionMode', 
      type: 'segmented', 
      labelKey: 'calculators.business.commissionMode', 
      required: true, 
      options: [
        { labelKey: 'calculators.business.deductCommission', value: 'deduct' },
        { labelKey: 'calculators.business.addCommission', value: 'add' }
      ]
    },
  ]
};

export const BreakEvenCalculatorDef: CalculatorDefinition = {
  id: 'business-break-even',
  category: 'business',
  titleKey: 'calculators.breakEven.title',
  descriptionKey: 'calculators.breakEven.description',
  fields: [
    { id: 'fixedCosts', type: 'currency', labelKey: 'calculators.breakEven.fixedCosts', required: true, min: 0 },
    { id: 'sellingPrice', type: 'currency', labelKey: 'calculators.breakEven.sellingPrice', required: true, min: 0 },
    { id: 'variableCost', type: 'currency', labelKey: 'calculators.breakEven.variableCost', required: true, min: 0 },
  ],
  customValidation: (inputs) => {
    const sp = Number(inputs.sellingPrice);
    const vc = Number(inputs.variableCost);
    if (sp <= vc) {
      return { sellingPrice: 'calculators.breakEven.errorPriceLeqVariable' };
    }
    return null;
  }
};
