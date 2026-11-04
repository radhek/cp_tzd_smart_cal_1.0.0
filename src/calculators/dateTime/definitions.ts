import { CalculatorDefinition } from '../../types/calculator';

export const AgeCalculatorDef: CalculatorDefinition = {
  id: 'datetime-age',
  category: 'dateTime',
  titleKey: 'calculators.dateTime.age.title',
  descriptionKey: 'calculators.dateTime.age.description',
  fields: [
    { id: 'dob', type: 'date', labelKey: 'calculators.dateTime.age.dob', required: true },
    { id: 'asOf', type: 'date', labelKey: 'calculators.dateTime.age.asOf', required: true },
  ],
  customValidation: (inputs) => {
    if (inputs.dob && inputs.asOf) {
      if (inputs.dob > inputs.asOf) {
        return { dob: 'Date of Birth cannot be after As of Date' };
      }
    }
    return null;
  }
};

export const DateDiffCalculatorDef: CalculatorDefinition = {
  id: 'datetime-diff',
  category: 'dateTime',
  titleKey: 'calculators.dateTime.dateDiff.title',
  descriptionKey: 'calculators.dateTime.dateDiff.description',
  fields: [
    { id: 'startDate', type: 'date', labelKey: 'calculators.dateTime.dateDiff.startDate', required: true },
    { id: 'endDate', type: 'date', labelKey: 'calculators.dateTime.dateDiff.endDate', required: true },
  ]
};

export const AddDaysCalculatorDef: CalculatorDefinition = {
  id: 'datetime-add-days',
  category: 'dateTime',
  titleKey: 'calculators.dateTime.addDays.title',
  descriptionKey: 'calculators.dateTime.addDays.description',
  fields: [
    { id: 'startDate', type: 'date', labelKey: 'calculators.dateTime.addDays.startDate', required: true },
    { id: 'days', type: 'number', labelKey: 'calculators.dateTime.addDays.daysToAdd', required: true, min: 0 },
  ]
};

export const SubDaysCalculatorDef: CalculatorDefinition = {
  id: 'datetime-sub-days',
  category: 'dateTime',
  titleKey: 'calculators.dateTime.subDays.title',
  descriptionKey: 'calculators.dateTime.subDays.description',
  fields: [
    { id: 'startDate', type: 'date', labelKey: 'calculators.dateTime.subDays.startDate', required: true },
    { id: 'days', type: 'number', labelKey: 'calculators.dateTime.subDays.daysToSub', required: true, min: 0 },
  ]
};

export const WorkingDaysCalculatorDef: CalculatorDefinition = {
  id: 'datetime-working-days',
  category: 'dateTime',
  titleKey: 'calculators.dateTime.workingDays.title',
  descriptionKey: 'calculators.dateTime.workingDays.description',
  fields: [
    { id: 'startDate', type: 'date', labelKey: 'calculators.dateTime.workingDays.startDate', required: true },
    { id: 'endDate', type: 'date', labelKey: 'calculators.dateTime.workingDays.endDate', required: true },
  ]
};

export const CountdownCalculatorDef: CalculatorDefinition = {
  id: 'datetime-countdown',
  category: 'dateTime',
  titleKey: 'calculators.dateTime.countdown.title',
  descriptionKey: 'calculators.dateTime.countdown.description',
  fields: [
    { id: 'targetDate', type: 'date', labelKey: 'calculators.dateTime.countdown.targetDate', required: true },
  ]
};
