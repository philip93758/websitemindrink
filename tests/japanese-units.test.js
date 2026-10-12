import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { calculateAlcoholGrams, calculateDrinkResult, calculateTotals } from '../shared/alcohol/formulas.js';
import { CALCULATOR_REFERENCE_GRAMS_BY_LOCALE, ETHANOL_DENSITY_G_PER_ML } from '../shared/alcohol/constants.js';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const paths = ['ja/alcohol-unit-calculator/index.html', 'ja/methodology.html', 'ja/alcohol-units.html', 'ja/blog/what-counts-as-a-drink-alcohol-units.html'];
const sources = [
  'https://kennet.mhlw.go.jp/information/information/alcohol/a-02-001.html',
  'https://www.mhlw.go.jp/stf/newpage_38541.html',
  'https://kenko-station.metro.tokyo.lg.jp/category3/kenkozukuri/inshu/',
];

test('Japanese reference distinguishes 10 g drinks, traditional 20 g units and physical volume', () => {
  for (const path of paths) {
    const html = read(path);
    for (const source of sources) assert.ok(html.includes(`href="${source}"`), path);
    assert.match(html, /10 g/);
    assert.match(html, /約20 g/);
    assert.match(html, /180 ml/);
    assert.match(html, /推奨量や安全な飲酒量/);
    assert.match(html, /0\.8/);
    assert.match(html, /0\.789/);
    assert.match(html, /19\.725 g/);
    assert.doesNotMatch(html, /1単位 = 純アルコール10|世界共通|WHO方式|中ジョッキ程度/);
  }
  const references = read('ja/methodology.html').split('<!-- 7. Full reference list -->')[1];
  for (const source of sources) assert.ok(references.includes(`href="${source}"`));
  assert.match(references, /アプリの上限値やその根拠を変更するものではありません/);
});

test('Japanese methodology retains every app threshold cell and its gram basis', () => {
  const html = read('ja/methodology.html');
  const table = html.match(/<table class="methodology-table">[\s\S]*?<\/table>/)[0];
  assert.equal(createHash('sha256').update(table).digest('hex'), '74332e90d1bd637dccf9dee414f2c33c42b4c455e30df5f1d798cdfda5380548');
  assert.ok(html.includes('20ドリンクは純アルコール200 g'));
  assert.ok(html.includes('日本の飲酒ガイドラインに置き換えた上限値ではありません'));
  assert.ok(html.includes('女性：6ドリンク/日以上'));
  assert.ok(html.includes('男性：7ドリンク/日以上'));
});

test('Japanese examples retain 0.789 and 10 g while Italian reference remains 12 g', () => {
  assert.equal(ETHANOL_DENSITY_G_PER_ML, 0.789);
  assert.equal(CALCULATOR_REFERENCE_GRAMS_BY_LOCALE.it, 12);
  const reference = CALCULATOR_REFERENCE_GRAMS_BY_LOCALE.ja || 10;
  assert.equal(reference, 10);
  for (const [volumeMl, abvPercent, rawGrams, grams, drinks] of [
    [500, 5, 19.725, 19.7, 2],
    [180, 15, 21.303, 21.3, 2.1],
    [100, 25, 19.725, 19.7, 2],
    [350, 7, 19.3305, 19.3, 1.9],
    [500, 9, 35.505, 35.5, 3.6],
  ]) {
    assert.ok(Math.abs(calculateAlcoholGrams(volumeMl, abvPercent) - rawGrams) < 1e-10);
    const result = calculateDrinkResult({volumeMl, abvPercent, quantity:1}, reference);
    assert.equal(result.alcoholGrams, grams);
    assert.equal(result.referenceUnits, drinks);
    assert.equal(result.globalStandardDrinks, drinks);
  }
  const beer = {volumeMl:500, abvPercent:5, quantity:1};
  const totals = calculateTotals([beer, beer], reference);
  assert.equal(totals.totalReferenceUnits, 3.9); // Sum raw grams, not rounded 2.0 + 2.0.
  assert.equal(totals.totalAlcoholGrams, 39.5);
  assert.equal(totals.totalUkUnits, 5);
  assert.equal(totals.totalUsStandardDrinks, 2.8);
  assert.equal(totals.totalCalories, 276);
  assert.equal(calculateDrinkResult(beer, 12).referenceUnits, 1.6);
});

test('Japanese calculator and short-answer examples match the shared calculation outputs', () => {
  const calculator = read(paths[0]);
  const rows = [...calculator.matchAll(/<tr>\s*<td>[^<]*<\/td>\s*<td>(\d+)ml<\/td>\s*<td>(\d+)%<\/td>\s*<td>([\d.]+)<\/td>\s*<td>([\d.]+)<\/td>\s*<td>([\d.]+)<\/td>\s*<td>([\d.]+)g<\/td>/g)];
  assert.equal(rows.length, 3);
  for (const [, volume, abv, drinks, uk, us, grams] of rows) {
    const result = calculateDrinkResult({volumeMl:Number(volume), abvPercent:Number(abv), quantity:1});
    assert.deepEqual([drinks,uk,us,grams].map(Number), [result.referenceUnits,result.ukUnits,result.usStandardDrinks,result.alcoholGrams]);
  }
  const short = read('ja/alcohol-units.html');
  const examples = [...short.matchAll(/<td>[^<]*?(\d+) ml[^<]*?、(\d+)%<\/td><td>([\d.]+) g \/ 約([\d.]+)<\/td>/g)];
  assert.equal(examples.length, 5);
  for (const [, volume, abv, grams, drinks] of examples) {
    const result = calculateDrinkResult({volumeMl:Number(volume), abvPercent:Number(abv), quantity:1});
    assert.deepEqual([Number(grams), Number(drinks)], [result.alcoholGrams,result.referenceUnits]);
  }
  assert.equal(calculator.split('<span class="result-label">ドリンク（10 g）</span>').length - 1, 2);
  assert.equal(calculator.split('<span class="result-label">アルコール由来のカロリー</span>').length - 1, 2);
  assert.ok(calculator.includes('数量（杯・本など）'));
  assert.ok(calculator.includes('入力した数量の結果'));
});

test('Japanese article metadata matches its final title and description', () => {
  for (const path of paths) {
    const html = read(path);
    const description = html.match(/<meta name="description" content="([^"]+)"/)[1];
    assert.equal(html.match(/<meta property="og:description" content="([^"]+)"/)[1], description);
    const twitter = html.match(/<meta name="twitter:description" content="([^"]+)"/);
    if (twitter) assert.equal(twitter[1], description);
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
    const article = schemas.find(s => ['Article','BlogPosting'].includes(s['@type']));
    if (article) {
      assert.equal(article.description, description);
      assert.equal(article.dateModified, '2026-10-12');
    }
  }
});
