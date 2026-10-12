import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import { calculateDrinkResult } from '../shared/alcohol/formulas.js';
import * as formulas from '../shared/alcohol/formulas.js';
import * as constants from '../shared/alcohol/constants.js';
import * as drinks from '../shared/alcohol/drinks.js';

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
  assert.match(references, /non modificano le soglie dell’app/);
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
  for (const [, volume, abv, mindrink, ua, us, grams] of rows) {
    const result = calculateDrinkResult({volumeMl:Number(volume), abvPercent:Number(abv), quantity:1}, 12);
    for (const [value, expected] of [[mindrink,result.globalStandardDrinks],[ua,result.referenceUnits],[us,result.usStandardDrinks],[grams,result.alcoholGrams]]) {
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

test('Italian calculator keeps both app and Italian units without adding result cards', () => {
  const html = read('it/alcohol-unit-calculator/index.html');
  assert.equal([...html.matchAll(/class="calculator-result"/g)].length, 10);
  for (const prefix of ['selected', 'total']) {
    assert.ok(html.includes(`id="${prefix}-global"`));
    assert.ok(html.includes(`id="${prefix}-italian"`));
    assert.ok(!html.includes(`id="${prefix}-uk-units"`));
  }
  assert.equal(html.split('<span class="result-label">Unità Mindrink (10 g)</span>').length - 1, 2);
  assert.equal(html.split('<span class="result-label">Unità alcoliche italiane (12 g)</span>').length - 1, 2);
  assert.ok(html.includes('AUDIT dell’OMS'));
  assert.doesNotMatch(html, /Unità UK/);
});

test('Italian renderer displays both references from raw quantities and clears both when incomplete', () => {
  const fields = Object.fromEntries(['selected-global','selected-italian','selected-us','selected-grams','selected-calories'].map(id => [id, {textContent:''}]));
  const context = vm.createContext({...formulas, ...constants, ...drinks,
    trackCalculatorStarted() {},
    document:{documentElement:{lang:'it'},readyState:'loading',addEventListener(){},getElementById:id => fields[id] || null},
  });
  const script = read('scripts/alcohol-unit-calculator.js').replace(/^import[\s\S]*?;\s*/gm, '');
  vm.runInContext(script+'\nglobalThis.api={updateDraft,formatUnitSummary};', context);
  context.api.updateDraft(draft => {draft.quantity=2;});
  assert.equal(fields['selected-global'].textContent, '3,9');
  assert.equal(fields['selected-italian'].textContent, '3,3');
  assert.equal(context.api.formatUnitSummary(calculateDrinkResult({volumeMl:500,abvPercent:5,quantity:2},12)), '3,9 Unità Mindrink (10 g) · 3,3 UA italiane (12 g)');
  context.api.updateDraft(draft => {draft.quantity=1;draft.abvPercent=5.01;});
  assert.equal(fields['selected-global'].textContent, '2,0');
  assert.equal(fields['selected-italian'].textContent, '1,6');
  context.api.updateDraft(draft => {draft.volumeMl=null;});
  assert.equal(fields['selected-global'].textContent, '');
  assert.equal(fields['selected-italian'].textContent, '');
});
