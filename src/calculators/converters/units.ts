export interface UnitCategory {
  [key: string]: {
    labelKey: string;
    factorToCore: number; // Multiplier to convert TO core unit
  };
}

export const lengthUnits: UnitCategory = {
  mm: { labelKey: 'calculators.converters.units.mm', factorToCore: 0.001 },
  cm: { labelKey: 'calculators.converters.units.cm', factorToCore: 0.01 },
  m: { labelKey: 'calculators.converters.units.m', factorToCore: 1 }, // Core unit
  km: { labelKey: 'calculators.converters.units.km', factorToCore: 1000 },
  in: { labelKey: 'calculators.converters.units.in', factorToCore: 0.0254 },
  ft: { labelKey: 'calculators.converters.units.ft', factorToCore: 0.3048 },
  yd: { labelKey: 'calculators.converters.units.yd', factorToCore: 0.9144 },
  mi: { labelKey: 'calculators.converters.units.mi', factorToCore: 1609.344 },
};

export const weightUnits: UnitCategory = {
  mg: { labelKey: 'calculators.converters.units.mg', factorToCore: 0.001 },
  g: { labelKey: 'calculators.converters.units.g', factorToCore: 1 }, // Core unit
  kg: { labelKey: 'calculators.converters.units.kg', factorToCore: 1000 },
  oz: { labelKey: 'calculators.converters.units.oz', factorToCore: 28.349523125 },
  lb: { labelKey: 'calculators.converters.units.lb', factorToCore: 453.59237 },
  t: { labelKey: 'calculators.converters.units.t', factorToCore: 1000000 },
};

export const areaUnits: UnitCategory = {
  sq_mm: { labelKey: 'calculators.converters.units.sq_mm', factorToCore: 0.000001 },
  sq_cm: { labelKey: 'calculators.converters.units.sq_cm', factorToCore: 0.0001 },
  sq_m: { labelKey: 'calculators.converters.units.sq_m', factorToCore: 1 }, // Core unit
  sq_km: { labelKey: 'calculators.converters.units.sq_km', factorToCore: 1000000 },
  sq_in: { labelKey: 'calculators.converters.units.sq_in', factorToCore: 0.00064516 },
  sq_ft: { labelKey: 'calculators.converters.units.sq_ft', factorToCore: 0.09290304 },
  sq_yd: { labelKey: 'calculators.converters.units.sq_yd', factorToCore: 0.83612736 },
  acre: { labelKey: 'calculators.converters.units.acre', factorToCore: 4046.8564224 },
  hectare: { labelKey: 'calculators.converters.units.hectare', factorToCore: 10000 },
};

export const volumeUnits: UnitCategory = {
  ml: { labelKey: 'calculators.converters.units.ml', factorToCore: 0.001 },
  l: { labelKey: 'calculators.converters.units.l', factorToCore: 1 }, // Core unit
  cubic_m: { labelKey: 'calculators.converters.units.cubic_m', factorToCore: 1000 },
  gal: { labelKey: 'calculators.converters.units.gal', factorToCore: 3.785411784 },
  qt: { labelKey: 'calculators.converters.units.qt', factorToCore: 0.946352946 },
  pt: { labelKey: 'calculators.converters.units.pt', factorToCore: 0.473176473 },
  cup: { labelKey: 'calculators.converters.units.cup', factorToCore: 0.236588236 },
  fl_oz: { labelKey: 'calculators.converters.units.fl_oz', factorToCore: 0.0295735295625 },
};

// Temperature uses explicit formulas in logic, but we still define the list here.
export const temperatureUnits: UnitCategory = {
  c: { labelKey: 'calculators.converters.units.c', factorToCore: 1 },
  f: { labelKey: 'calculators.converters.units.f', factorToCore: 1 },
  k: { labelKey: 'calculators.converters.units.k', factorToCore: 1 },
};

export const speedUnits: UnitCategory = {
  mps: { labelKey: 'calculators.converters.units.mps', factorToCore: 1 }, // Core unit
  kmph: { labelKey: 'calculators.converters.units.kmph', factorToCore: 0.27777777777778 },
  mph: { labelKey: 'calculators.converters.units.mph', factorToCore: 0.44704 },
  knot: { labelKey: 'calculators.converters.units.knot', factorToCore: 0.514444 },
};

export const timeUnits: UnitCategory = {
  ms: { labelKey: 'calculators.converters.units.ms', factorToCore: 0.001 },
  s: { labelKey: 'calculators.converters.units.s', factorToCore: 1 }, // Core unit
  min: { labelKey: 'calculators.converters.units.min', factorToCore: 60 },
  hr: { labelKey: 'calculators.converters.units.hr', factorToCore: 3600 },
  day: { labelKey: 'calculators.converters.units.day', factorToCore: 86400 },
  week: { labelKey: 'calculators.converters.units.week', factorToCore: 604800 },
};

export const dataUnits: UnitCategory = {
  bit: { labelKey: 'calculators.converters.units.bit', factorToCore: 0.125 },
  byte: { labelKey: 'calculators.converters.units.byte', factorToCore: 1 }, // Core unit
  kb: { labelKey: 'calculators.converters.units.kb', factorToCore: 1024 },
  mb: { labelKey: 'calculators.converters.units.mb', factorToCore: 1048576 },
  gb: { labelKey: 'calculators.converters.units.gb', factorToCore: 1073741824 },
  tb: { labelKey: 'calculators.converters.units.tb', factorToCore: 1099511627776 },
};

export const pressureUnits: UnitCategory = {
  pa: { labelKey: 'calculators.converters.units.pa', factorToCore: 1 }, // Core unit
  kpa: { labelKey: 'calculators.converters.units.kpa', factorToCore: 1000 },
  bar: { labelKey: 'calculators.converters.units.bar', factorToCore: 100000 },
  psi: { labelKey: 'calculators.converters.units.psi', factorToCore: 6894.757293168 },
  atm: { labelKey: 'calculators.converters.units.atm', factorToCore: 101325 },
  mmhg: { labelKey: 'calculators.converters.units.mmhg', factorToCore: 133.32236842105 },
};

export const energyUnits: UnitCategory = {
  j: { labelKey: 'calculators.converters.units.j', factorToCore: 1 }, // Core unit
  kj: { labelKey: 'calculators.converters.units.kj', factorToCore: 1000 },
  cal: { labelKey: 'calculators.converters.units.cal', factorToCore: 4.184 },
  kcal: { labelKey: 'calculators.converters.units.kcal', factorToCore: 4184 },
  wh: { labelKey: 'calculators.converters.units.wh', factorToCore: 3600 },
  kwh: { labelKey: 'calculators.converters.units.kwh', factorToCore: 3600000 },
};
