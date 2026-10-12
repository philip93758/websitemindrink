import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CALCULATOR_REFERENCE_GRAMS_BY_LOCALE, GLOBAL_STANDARD_DRINK_GRAMS } from '../shared/alcohol/constants.js';

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
  for (const [volumeMl, abvPercent, grams, ua] of [
    [500, 5, 19.725, 1.6],
    [175, 12, 16.569, 1.4],
    [25, 40, 7.89, 0.7],
  ]) {
    it(`converts ${volumeMl} ml at ${abvPercent}% to Italian 12 g UA`, () => {
      assert.ok(Math.abs(calculateAlcoholGrams(volumeMl, abvPercent) - grams) < 1e-10);
      const input = { volumeMl, abvPercent, quantity: 1 };
      const italian = calculateDrinkResult(input, CALCULATOR_REFERENCE_GRAMS_BY_LOCALE.it);
      const original = calculateDrinkResult(input);
      assert.equal(italian.referenceUnits, ua);
      for (const key of ['ukUnits', 'globalStandardDrinks', 'usStandardDrinks', 'alcoholGrams', 'calories', 'isValid']) {
        assert.equal(italian[key], original[key], key);
      }
    });
  }

  it('includes quantity before Italian conversion and totals unrounded rows', () => {
    const beer = { volumeMl: 500, abvPercent: 5, quantity: 1 };
    assert.equal(calculateDrinkResult({ ...beer, quantity: 2 }, 12).referenceUnits, 3.3);
    const totals = calculateTotals([beer, beer], 12);
    assert.equal(totals.totalReferenceUnits, 3.3); // 1.6 + 1.6 would incorrectly give 3.2.
    assert.equal(totals.totalUkUnits, 5);
    assert.equal(totals.totalGlobalStandardDrinks, 3.9);
    assert.equal(totals.totalUsStandardDrinks, 2.8);
    assert.equal(totals.totalCalories, 276);
    assert.deepEqual(totals, calculateTotals([{ ...beer, quantity: 2 }], 12));
  });

  it('does not convert display-rounded grams into Italian units', () => {
    const input = { volumeMl: 500, abvPercent: 5.01, quantity: 1 };
    const drink = calculateDrinkResult(input, 12);
    assert.equal(drink.alcoholGrams, 19.8);
    assert.equal(drink.referenceUnits, 1.6); // 19.8 / 12 would round to 1.7.
    assert.equal(calculateTotals([input], 12).totalReferenceUnits, 1.6);
  });

  it('keeps the other seven language references and default callers at 10 g', () => {
    const input = { volumeMl: 175, abvPercent: 12, quantity: 2 };
    for (const lang of ['en', 'de', 'fr', 'es', 'pt', 'id', 'ja']) {
      const reference = CALCULATOR_REFERENCE_GRAMS_BY_LOCALE[lang] || GLOBAL_STANDARD_DRINK_GRAMS;
      assert.equal(reference, 10, lang);
      assert.deepEqual(calculateDrinkResult(input, reference), calculateDrinkResult(input), lang);
      assert.deepEqual(calculateTotals([input], reference), calculateTotals([input]), lang);
    }
  });

  it('preserves incomplete, zero and clamped input behavior with Italian conversion', () => {
    assert.equal(calculateDrinkResult({volumeMl:'', abvPercent:5, quantity:1}, 12).referenceUnits, null);
    assert.equal(calculateTotals([], 12).totalReferenceUnits, null);
    assert.equal(calculateTotals([{volumeMl:'', abvPercent:5, quantity:1}], 12).totalReferenceUnits, null);
    assert.equal(calculateDrinkResult({volumeMl:500, abvPercent:0, quantity:1}, 12).referenceUnits, 0);
    assert.deepEqual(calculateDrinkResult({volumeMl:6000, abvPercent:101, quantity:101}, 12),
      calculateDrinkResult({volumeMl:5000, abvPercent:100, quantity:100}, 12));
  });

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
