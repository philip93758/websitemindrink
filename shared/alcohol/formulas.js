// Alcohol calculation formulas
// Framework-independent functions for the Alcohol Unit Calculator

import {
  ETHANOL_DENSITY_G_PER_ML,
  GLOBAL_STANDARD_DRINK_GRAMS,
  US_STANDARD_DRINK_GRAMS,
  ALCOHOL_KCAL_PER_GRAM,
  MIN_VOLUME_ML,
  MAX_VOLUME_ML,
  MIN_ABV_PERCENT,
  MAX_ABV_PERCENT,
  MIN_QUANTITY,
  MAX_QUANTITY,
} from './constants.js';

/**
 * Normalize and validate alcohol input value
 * @param {number|string} input - The raw input value
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {number} - Normalized, clamped value
 */
function clampValue(input, min, max) {
  if (input === null || input === undefined || input === '') {
    return null;
  }
  const num = Number(input);
  if (Number.isNaN(num)) {
    return null;
  }
  return Math.max(min, Math.min(max, num));
}

/**
 * Normalize alcohol input and return validated object
 * @param {Object} input - Object with volumeMl, abvPercent, quantity
 * @returns {Object} - Normalized input object
 */
export function normalizeAlcoholInput(input) {
  if (!input) {
    return { volumeMl: null, abvPercent: null, quantity: null };
  }
  return {
    volumeMl: clampValue(input.volumeMl, MIN_VOLUME_ML, MAX_VOLUME_ML),
    abvPercent: clampValue(input.abvPercent, MIN_ABV_PERCENT, MAX_ABV_PERCENT),
    quantity: clampValue(input.quantity, MIN_QUANTITY, MAX_QUANTITY),
  };
}

/**
 * Calculate pure alcohol grams from volume and ABV
 * @param {number} volumeMl - Volume in millilitres
 * @param {number} abvPercent - ABV percentage (e.g., 5 for 5%)
 * @returns {number} - Grams of pure alcohol
 */
export function calculateAlcoholGrams(volumeMl, abvPercent) {
  if (volumeMl === null || abvPercent === null) {
    return null;
  }
  return volumeMl * (abvPercent / 100) * ETHANOL_DENSITY_G_PER_ML;
}

/**
 * Calculate UK alcohol units
 * UK unit formula: (volumeMl * abvPercent) / 1000
 * @param {number} volumeMl - Volume in millilitres
 * @param {number} abvPercent - ABV percentage
 * @returns {number} - UK alcohol units
 */
export function calculateUkUnits(volumeMl, abvPercent) {
  if (volumeMl === null || abvPercent === null) {
    return null;
  }
  return (volumeMl * abvPercent) / 1000;
}

/**
 * Calculate 10g global/Mindrink standard drinks
 * @param {number} alcoholGrams - Grams of pure alcohol
 * @returns {number} - Number of 10g standard drinks
 */
export function calculateGlobalStandardDrinks(alcoholGrams) {
  if (alcoholGrams === null) {
    return null;
  }
  return alcoholGrams / GLOBAL_STANDARD_DRINK_GRAMS;
}

/**
 * Calculate US standard drinks (14g each)
 * @param {number} alcoholGrams - Grams of pure alcohol
 * @returns {number} - Number of US standard drinks
 */
export function calculateUsStandardDrinks(alcoholGrams) {
  if (alcoholGrams === null) {
    return null;
  }
  return alcoholGrams / US_STANDARD_DRINK_GRAMS;
}

/**
 * Calculate alcohol calories
 * @param {number} alcoholGrams - Grams of pure alcohol
 * @returns {number} - Calories from alcohol
 */
export function calculateAlcoholCalories(alcoholGrams) {
  if (alcoholGrams === null) {
    return null;
  }
  return alcoholGrams * ALCOHOL_KCAL_PER_GRAM;
}

/**
 * Calculate equivalent drinks based on pure alcohol grams
 * Baseline: 500ml beer at 5% ABV = 19.725g alcohol, 750ml wine at 12% ABV = 70.236g alcohol
 * @param {number} alcoholGrams - Total pure alcohol grams
 * @returns {Object} - Equivalent counts
 */
export function calculateEquivalents(alcoholGrams) {
  if (alcoholGrams === null || alcoholGrams === undefined) {
    return { beer500mlAt5Percent: null, wine750mlAt12Percent: null };
  }
  const beerBaselineGrams = 500 * 0.05 * 0.789;
  const wineBaselineGrams = 750 * 0.12 * 0.789;

  return {
    beer500mlAt5Percent: roundValue(alcoholGrams / beerBaselineGrams, 1),
    wine750mlAt12Percent: roundValue(alcoholGrams / wineBaselineGrams, 1),
  };
}

/**
 * Round alcohol result for display
 * @param {number} value - The value to round
 * @param {number} decimals - Number of decimal places
 * @returns {number|null} - Rounded value or null
 */
function roundValue(value, decimals) {
  if (value === null) {
    return null;
  }
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Round result based on type
 * @param {number} value - The value to round
 * @param {string} type - Type of value (grams, ukUnits, global, us, calories)
 * @returns {number|null} - Rounded value
 */
function roundByType(value, type) {
  if (value === null) return null;

  const decimalsMap = {
    grams: 1,
    ukUnits: 1,
    global: 1,
    us: 1,
    calories: 0,
  };

  const decimals = decimalsMap[type] ?? 1;
  return roundValue(value, decimals);
}

/**
 * Calculate complete drink result
 * @param {Object} input - Object with volumeMl, abvPercent, quantity
 * @returns {Object} - Complete result object
 */
export function calculateDrinkResult({ volumeMl, abvPercent, quantity }) {
  const normalized = normalizeAlcoholInput({ volumeMl, abvPercent, quantity });

  if (normalized.volumeMl === null || normalized.abvPercent === null || normalized.quantity === null) {
    return {
      volumeMl: null,
      abvPercent: null,
      quantity: null,
      alcoholGrams: null,
      ukUnits: null,
      globalStandardDrinks: null,
      usStandardDrinks: null,
      calories: null,
      isValid: false,
    };
  }

  const alcoholGrams = calculateAlcoholGrams(normalized.volumeMl, normalized.abvPercent);
  const totalAlcoholGrams = alcoholGrams * normalized.quantity;
  const totalUkUnits = calculateUkUnits(normalized.volumeMl, normalized.abvPercent) * normalized.quantity;
  const totalGlobal = calculateGlobalStandardDrinks(totalAlcoholGrams);
  const totalUs = calculateUsStandardDrinks(totalAlcoholGrams);
  const totalCalories = calculateAlcoholCalories(totalAlcoholGrams);

  return {
    volumeMl: normalized.volumeMl,
    abvPercent: normalized.abvPercent,
    quantity: normalized.quantity,
    alcoholGrams: roundByType(totalAlcoholGrams, 'grams'),
    ukUnits: roundByType(totalUkUnits, 'ukUnits'),
    globalStandardDrinks: roundByType(totalGlobal, 'global'),
    usStandardDrinks: roundByType(totalUs, 'us'),
    calories: roundByType(totalCalories, 'calories'),
    isValid: true,
  };
}

function calculateRawDrinkResult(row) {
  const normalized = normalizeAlcoholInput(row);

  if (normalized.volumeMl === null || normalized.abvPercent === null || normalized.quantity === null) {
    return null;
  }

  const alcoholGrams = calculateAlcoholGrams(normalized.volumeMl, normalized.abvPercent) * normalized.quantity;
  const ukUnits = calculateUkUnits(normalized.volumeMl, normalized.abvPercent) * normalized.quantity;

  return {
    quantity: normalized.quantity,
    alcoholGrams,
    ukUnits,
    globalStandardDrinks: calculateGlobalStandardDrinks(alcoholGrams),
    usStandardDrinks: calculateUsStandardDrinks(alcoholGrams),
    calories: calculateAlcoholCalories(alcoholGrams),
  };
}

/**
 * Calculate totals from an array of drink rows
 * @param {Array} rows - Array of drink row objects
 * @returns {Object} - Totals
 */
export function calculateTotals(rows) {
  if (!rows || rows.length === 0) {
    return {
      totalUkUnits: null,
      totalGlobalStandardDrinks: null,
      totalUsStandardDrinks: null,
      totalAlcoholGrams: null,
      totalCalories: null,
      isValid: false,
    };
  }

  let totalUkUnits = 0;
  let totalGlobalStandardDrinks = 0;
  let totalUsStandardDrinks = 0;
  let totalAlcoholGrams = 0;
  let totalCalories = 0;
  let validCount = 0;

  for (const row of rows) {
    const result = calculateRawDrinkResult(row);
    if (result) {
      totalUkUnits += result.ukUnits;
      totalGlobalStandardDrinks += result.globalStandardDrinks;
      totalUsStandardDrinks += result.usStandardDrinks;
      totalAlcoholGrams += result.alcoholGrams;
      totalCalories += result.calories;
      validCount++;
    }
  }

  if (validCount === 0) {
    return {
      totalUkUnits: null,
      totalGlobalStandardDrinks: null,
      totalUsStandardDrinks: null,
      totalAlcoholGrams: null,
      totalCalories: null,
      isValid: false,
    };
  }

  return {
    totalUkUnits: roundByType(totalUkUnits, 'ukUnits'),
    totalGlobalStandardDrinks: roundByType(totalGlobalStandardDrinks, 'global'),
    totalUsStandardDrinks: roundByType(totalUsStandardDrinks, 'us'),
    totalAlcoholGrams: roundByType(totalAlcoholGrams, 'grams'),
    totalCalories: roundByType(totalCalories, 'calories'),
    isValid: true,
  };
}

/**
 * Build breakdown by drink type from weekly rows
 * @param {Array} rows - Array of drink row objects
 * @returns {Object} - Breakdown by drink type
 */
export function buildDrinkTypeBreakdown(rows) {
  if (!rows || rows.length === 0) {
    return {};
  }

  const breakdown = {};

  for (const row of rows) {
    const result = calculateRawDrinkResult(row);
    if (result && row.drinkType) {
      if (!breakdown[row.drinkType]) {
        breakdown[row.drinkType] = {
          label: row.drinkLabel || row.drinkType,
          count: 0,
          ukUnits: 0,
          alcoholGrams: 0,
          calories: 0,
        };
      }
      breakdown[row.drinkType].count += result.quantity;
      breakdown[row.drinkType].ukUnits += result.ukUnits;
      breakdown[row.drinkType].alcoholGrams += result.alcoholGrams;
      breakdown[row.drinkType].calories += result.calories;
    }
  }

  for (const type in breakdown) {
    breakdown[type].ukUnits = roundByType(breakdown[type].ukUnits, 'ukUnits');
    breakdown[type].alcoholGrams = roundByType(breakdown[type].alcoholGrams, 'grams');
    breakdown[type].calories = roundByType(breakdown[type].calories, 'calories');
  }

  return breakdown;
}
