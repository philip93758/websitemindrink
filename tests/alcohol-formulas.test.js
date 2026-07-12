import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  calculateAlcoholCalories,
  calculateAlcoholGrams,
  calculateDrinkResult,
  calculateEquivalents,
  calculateGlobalStandardDrinks,
  calculateTotals,
  calculateUkUnits,
  calculateUsStandardDrinks,
} from '../shared/alcohol/formulas.js';

describe('alcohol formulas', () => {
  it('calculates UK units for 500ml beer at 5%', () => {
    assert.equal(calculateUkUnits(500, 5), 2.5);
  });

  it('calculates pure alcohol grams for 500ml beer at 5%', () => {
    assert.equal(Number(calculateAlcoholGrams(500, 5).toFixed(1)), 19.7);
  });

  it('calculates US standard drinks from grams', () => {
    const grams = calculateAlcoholGrams(500, 5);
    assert.equal(Number(calculateUsStandardDrinks(grams).toFixed(1)), 1.4);
  });

  it('calculates 10g global standard drinks from grams', () => {
    const grams = calculateAlcoholGrams(500, 5);
    assert.equal(Number(calculateGlobalStandardDrinks(grams).toFixed(1)), 2.0);
  });

  it('calculates calories from grams', () => {
    const grams = calculateAlcoholGrams(500, 5);
    assert.equal(Math.round(calculateAlcoholCalories(grams)), 138);
  });

  it('returns a safe incomplete result for empty inputs', () => {
    const result = calculateDrinkResult({
      volumeMl: '',
      abvPercent: '',
      quantity: '',
    });

    assert.equal(result.isValid, false);
    assert.equal(result.ukUnits, null);
    assert.equal(result.alcoholGrams, null);
    assert.equal(result.usStandardDrinks, null);
  });

  it('treats zero values as valid zero results', () => {
    const result = calculateDrinkResult({
      volumeMl: 0,
      abvPercent: 0,
      quantity: 0,
    });

    assert.equal(result.isValid, true);
    assert.equal(result.ukUnits, 0);
    assert.equal(result.globalStandardDrinks, 0);
    assert.equal(result.usStandardDrinks, 0);
    assert.equal(result.alcoholGrams, 0);
    assert.equal(result.calories, 0);
  });

  it('calculates totals for multiple rows', () => {
    const totals = calculateTotals([
      { volumeMl: 500, abvPercent: 5, quantity: 3 },
      { volumeMl: 175, abvPercent: 12, quantity: 2 },
    ]);

    assert.equal(totals.isValid, true);
    assert.equal(totals.totalUkUnits, 11.7);
    assert.equal(totals.totalAlcoholGrams, 92.3);
    assert.equal(totals.totalGlobalStandardDrinks, 9.2);
    assert.equal(totals.totalUsStandardDrinks, 6.6);
    assert.equal(totals.totalCalories, 646);
  });

  it('sums totals before display rounding', () => {
    const totals = calculateTotals([
      { volumeMl: 33, abvPercent: 5, quantity: 1 },
      { volumeMl: 33, abvPercent: 5, quantity: 1 },
      { volumeMl: 33, abvPercent: 5, quantity: 1 },
    ]);

    assert.equal(totals.totalAlcoholGrams, 3.9);
    assert.equal(totals.totalCalories, 27);
  });

  // New equivalent baseline math tests
  it('calculates equivalents for default drink 500ml beer at 5%', () => {
    const grams = calculateAlcoholGrams(500, 5);
    const equivalents = calculateEquivalents(grams);
    assert.equal(equivalents.beer500mlAt5Percent, 1.0);
    assert.equal(Number(equivalents.wine750mlAt12Percent.toFixed(1)), 0.3);
  });

  it('calculates equivalents for 750ml wine at 12%', () => {
    const grams = calculateAlcoholGrams(750, 12);
    const equivalents = calculateEquivalents(grams);
    assert.equal(Number(equivalents.beer500mlAt5Percent.toFixed(1)), 3.6);
    assert.equal(equivalents.wine750mlAt12Percent, 1.0);
  });

  it('returns null equivalents for null input', () => {
    const equivalents = calculateEquivalents(null);
    assert.equal(equivalents.beer500mlAt5Percent, null);
    assert.equal(equivalents.wine750mlAt12Percent, null);
  });

  it('returns null equivalents for undefined input', () => {
    const equivalents = calculateEquivalents(undefined);
    assert.equal(equivalents.beer500mlAt5Percent, null);
    assert.equal(equivalents.wine750mlAt12Percent, null);
  });

  // Test that calculateEquivalents uses unrounded alcohol grams
  it('calculates equivalents from unrounded alcohol grams for multi-quantity', () => {
    // 2 x 500ml at 5% ABV = 2 * 500 * 0.05 * 0.789 = 39.45g exactly
    const unroundedGrams = 2 * 500 * 0.05 * 0.789;
    const equivalents = calculateEquivalents(unroundedGrams);
    assert.equal(equivalents.beer500mlAt5Percent, 2.0);
    assert.equal(Number(equivalents.wine750mlAt12Percent.toFixed(1)), 0.6);
  });
});
