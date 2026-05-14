import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  calculateAlcoholCalories,
  calculateAlcoholGrams,
  calculateDrinkResult,
  calculateGlobalStandardDrinks,
  calculateUkUnits,
  calculateUsStandardDrinks,
  calculateWeeklyTotals,
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

  it('calculates weekly totals for multiple rows', () => {
    const totals = calculateWeeklyTotals([
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

  it('sums weekly totals before display rounding', () => {
    const totals = calculateWeeklyTotals([
      { volumeMl: 33, abvPercent: 5, quantity: 1 },
      { volumeMl: 33, abvPercent: 5, quantity: 1 },
      { volumeMl: 33, abvPercent: 5, quantity: 1 },
    ]);

    assert.equal(totals.totalAlcoholGrams, 3.9);
    assert.equal(totals.totalCalories, 27);
  });
});
