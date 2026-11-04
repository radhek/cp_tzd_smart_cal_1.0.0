import { CalculationResult } from '../../types/calculator';

// Utilities
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const parseDate = (val: any): Date => {
  return val instanceof Date ? val : new Date(val);
};

export const calculateAge = (inputs: Record<string, any>): CalculationResult => {
  const dob = parseDate(inputs.dob);
  const asOf = parseDate(inputs.asOf);

  let years = asOf.getFullYear() - dob.getFullYear();
  let months = asOf.getMonth() - dob.getMonth();
  let days = asOf.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    const previousMonth = asOf.getMonth() === 0 ? 11 : asOf.getMonth() - 1;
    const previousMonthYear = asOf.getMonth() === 0 ? asOf.getFullYear() - 1 : asOf.getFullYear();
    days += getDaysInMonth(previousMonthYear, previousMonth);
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  // Next birthday
  let nextBday = new Date(asOf.getFullYear(), dob.getMonth(), dob.getDate());
  if (nextBday < asOf) {
    nextBday.setFullYear(asOf.getFullYear() + 1);
  }

  const oneDay = 24 * 60 * 60 * 1000;
  const daysUntilBday = Math.round((nextBday.getTime() - asOf.getTime()) / oneDay);
  const totalDays = Math.round((asOf.getTime() - dob.getTime()) / oneDay);

  return {
    items: [
      { id: 'years', labelKey: 'calculators.dateTime.age.years', value: years, type: 'number', isPrimary: true },
      { id: 'months', labelKey: 'calculators.dateTime.age.months', value: months, type: 'number' },
      { id: 'days', labelKey: 'calculators.dateTime.age.days', value: days, type: 'number' },
      { id: 'totalDays', labelKey: 'calculators.dateTime.age.totalDays', value: totalDays, type: 'number' },
      { id: 'nextBirthday', labelKey: 'calculators.dateTime.age.nextBirthday', value: nextBday, type: 'date' },
      { id: 'daysUntilBday', labelKey: 'calculators.dateTime.age.daysUntilBirthday', value: daysUntilBday, type: 'number' },
    ]
  };
};

export const calculateDateDiff = (inputs: Record<string, any>): CalculationResult => {
  const start = parseDate(inputs.startDate);
  const end = parseDate(inputs.endDate);
  
  // Ensure start is before end to not silently produce negative without clarity.
  // We'll just take absolute difference for calendar diff, or we just handle it nicely.
  const isReversed = end < start;
  const d1 = isReversed ? end : start;
  const d2 = isReversed ? start : end;

  const totalDays = Math.round((d2.getTime() - d1.getTime()) / (24 * 60 * 60 * 1000));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonthsStr = (totalDays / 30.436875).toFixed(1); // Approximate for display

  let years = d2.getFullYear() - d1.getFullYear();
  let months = d2.getMonth() - d1.getMonth();
  let days = d2.getDate() - d1.getDate();

  if (days < 0) {
    months--;
    const previousMonth = d2.getMonth() === 0 ? 11 : d2.getMonth() - 1;
    const previousMonthYear = d2.getMonth() === 0 ? d2.getFullYear() - 1 : d2.getFullYear();
    days += getDaysInMonth(previousMonthYear, previousMonth);
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const calendarDiff = `${years} Y, ${months} M, ${days} D${isReversed ? ' (Reversed)' : ''}`;

  return {
    items: [
      { id: 'totalDays', labelKey: 'calculators.dateTime.dateDiff.totalDays', value: (isReversed ? -totalDays : totalDays), type: 'number', isPrimary: true },
      { id: 'calendarDiff', labelKey: 'calculators.dateTime.dateDiff.calendarDiff', value: calendarDiff, type: 'text' },
      { id: 'totalWeeks', labelKey: 'calculators.dateTime.dateDiff.totalWeeks', value: (isReversed ? -totalWeeks : totalWeeks), type: 'number' },
      { id: 'totalMonths', labelKey: 'calculators.dateTime.dateDiff.totalMonths', value: (isReversed ? '-' + totalMonthsStr : totalMonthsStr), type: 'text' },
    ]
  };
};

export const calculateAddDays = (inputs: Record<string, any>): CalculationResult => {
  const start = parseDate(inputs.startDate);
  const days = Number(inputs.days);

  const resultDate = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);

  return {
    items: [
      { id: 'resultDate', labelKey: 'calculators.dateTime.addDays.resultDate', value: resultDate, type: 'date', isPrimary: true },
    ]
  };
};

export const calculateSubDays = (inputs: Record<string, any>): CalculationResult => {
  const start = parseDate(inputs.startDate);
  const days = Number(inputs.days);

  const resultDate = new Date(start.getTime() - days * 24 * 60 * 60 * 1000);

  return {
    items: [
      { id: 'resultDate', labelKey: 'calculators.dateTime.subDays.resultDate', value: resultDate, type: 'date', isPrimary: true },
    ]
  };
};

export const calculateWorkingDays = (inputs: Record<string, any>): CalculationResult => {
  const start = parseDate(inputs.startDate);
  const end = parseDate(inputs.endDate);
  
  let d1 = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  let d2 = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  
  const isReversed = d2 < d1;
  if (isReversed) {
    const temp = d1;
    d1 = d2;
    d2 = temp;
  }

  let workingDays = 0;
  let weekendDays = 0;
  let totalDays = 0;

  let current = new Date(d1);
  while (current <= d2) {
    totalDays++;
    const dayOfWeek = current.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendDays++;
    } else {
      workingDays++;
    }
    current.setDate(current.getDate() + 1);
  }

  return {
    items: [
      { id: 'workingDays', labelKey: 'calculators.dateTime.workingDays.workingDays', value: (isReversed ? -workingDays : workingDays), type: 'number', isPrimary: true },
      { id: 'weekendDays', labelKey: 'calculators.dateTime.workingDays.weekendDays', value: (isReversed ? -weekendDays : weekendDays), type: 'number' },
      { id: 'totalDays', labelKey: 'calculators.dateTime.workingDays.totalDays', value: (isReversed ? -totalDays : totalDays), type: 'number' },
    ]
  };
};

export const calculateCountdown = (inputs: Record<string, any>): CalculationResult => {
  const target = parseDate(inputs.targetDate);
  // We return the target date directly to be rendered by the live countdown component
  return {
    items: [
      { id: 'targetDate', labelKey: 'calculators.dateTime.countdown.targetDate', value: target, type: 'countdown', isPrimary: true },
    ]
  };
};
