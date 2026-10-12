import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { calculateDrinkResult } from '../shared/alcohol/formulas.js';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const source = 'https://www.epicentro.iss.it/passi/indicatori/alcol';
const fixture = JSON.parse(read('tests/fixtures/accuracy-links.json'));

test('Italian unit definitions cite ISS in each existing explanation and the reference area', () => {
  for (const path of ['it/alcohol-unit-calculator/index.html', 'it/methodology.html', 'it/blog/what-counts-as-a-drink-alcohol-units.html', 'it/alcohol-units.html']) {
    const html = read(path);
    assert.ok(html.includes(`href="${source}"`), path);
    assert.match(html, /12 g/);
    assert.match(html, /(?:app|Mindrink)[\s\S]*?10 g/);
  }
  const method = read('it/methodology.html');
  const references = method.slice(method.indexOf('<!-- 7. Full reference list -->'));
  assert.ok(references.includes(`href="${source}"`));
  assert.match(references, /non modifica le soglie dell’app/);
});

test('Italian methodology preserves the entire 10 g app threshold table', () => {
  const html = read('it/methodology.html');
  const table = html.match(/<table class="methodology-table">[\s\S]*?<\/table>/)[0];
  assert.equal(createHash('sha256').update(table).digest('hex'), fixture.italianThresholdTableHash);
  assert.ok(html.includes('Tutti i valori in unità Mindrink da 10 g, non in UA italiane da 12 g'));
  assert.ok(html.includes('20 unità Mindrink sono 200 g, cioè circa 16,7 UA italiane'));
});

test('Italian calculator and short-answer tables agree with 12 g calculations', () => {
  const calculator = read('it/alcohol-unit-calculator/index.html');
  const rows = [...calculator.matchAll(/<tr>\s*<td>[^<]*<\/td>\s*<td>(\d+)ml<\/td>\s*<td>(\d+)%<\/td>\s*<td>([\d,]+)<\/td>\s*<td>([\d,]+)<\/td>\s*<td>([\d,]+)<\/td>\s*<td>([\d,]+)g<\/td>/g)];
  assert.equal(rows.length, 3);
  for (const [, volume, abv, ua, uk, us, grams] of rows) {
    const result = calculateDrinkResult({volumeMl:Number(volume), abvPercent:Number(abv), quantity:1}, 12);
    for (const [value, expected] of [[ua,result.referenceUnits],[uk,result.ukUnits],[us,result.usStandardDrinks],[grams,result.alcoholGrams]]) {
      assert.equal(Number(value.replace(',', '.')), expected);
    }
  }
  const short = read('it/alcohol-units.html');
  const examples = [...short.matchAll(/<td>(\d+) ml di (?:birra|vino|superalcolico) al (\d+)%<\/td><td>([\d,]+)<\/td>/g)];
  assert.equal(examples.length, 5);
  for (const [, volume, abv, ua] of examples) {
    assert.equal(Number(ua.replace(',', '.')), calculateDrinkResult({volumeMl:Number(volume), abvPercent:Number(abv), quantity:1}, 12).referenceUnits);
  }
});
