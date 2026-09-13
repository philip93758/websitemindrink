import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { calculateAlcoholGrams, calculateGlobalStandardDrinks, calculateUsStandardDrinks } from '../shared/alcohol/formulas.js';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8').replace(/\r\n/g, '\n');
const fixture = JSON.parse(read('tests/fixtures/accuracy-links.json'));
const matches = (html, pattern) => [...html.matchAll(pattern)].map(match => match[0]);
const main = html => html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
const normalized = text => text.replace(/\s+/g, ' ').trim();
// Cache versions and genuine modification dates are maintained independently
// of the preserved editorial/structural baseline. Release QA tests cover dates.
const stableMetadata = tags => tags.map(tag => tag
  .replace(/(\/styles\.css)\?[^" ]+/g, '$1')
  .replace(/(<meta property="article:modified_time" content=")[^"]+"/, '$1MODIFIED"'));
const paragraphs = html => [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map(match => normalized(match[1]));
const faqs = html => [...html.matchAll(/<details[^>]*>[\s\S]*?<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>[\s\S]*?<\/details>/g)]
  .map(match => ({ name: match[1], text: match[2] }));

// This pre-edit snapshot intentionally preserves existing locale differences.
// Regenerate only after an approved structural change, not to silence a failure.
for (const [path, before] of Object.entries(fixture.baseline)) {
  test(`${path}: accuracy edits preserve metadata, headings, structure and existing destinations`, () => {
    const html = read(path);
    assert.deepEqual(stableMetadata(matches(html, /<(?:title|meta|link)\b[^>]*>(?:[^<]*<\/title>)?/g)), stableMetadata(before.metadata));
    assert.deepEqual(matches(html, /<h[1-6]\b[^>]*>[\s\S]*?<\/h[1-6]>/g), before.headings);
    const structure = matches(html, /<\/?(?:main|section|div|h[1-6]|table|tr|td|th|ul|ol|li|details|summary|button)\b[^>]*>/g).join('');
    assert.equal(createHash('sha256').update(structure).digest('hex'), before.structureHash);
    const links = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match => match[1]);
    for (const destination of new Set(before.links)) {
      assert.ok(links.filter(link => link === destination).length >= before.links.filter(link => link === destination).length, destination);
    }
  });
}

for (const [locale, copy] of Object.entries(fixture.locales)) {
  const prefix = locale === 'en' ? '' : `${locale}/`;
  const guidePath = `${prefix}blog/what-counts-as-a-drink-alcohol-units.html`;
  const methodPath = `${prefix}methodology.html`;
  const answerPath = `${prefix}alcohol-units.html`;
  const calculator = `/${prefix}alcohol-unit-calculator/`;

  test(`${locale}: both formula explanations explicitly convert percent to a fraction`, () => {
    for (const path of [methodPath, guidePath]) {
      const text = paragraphs(read(path));
      assert.ok(text.includes(copy.formula));
      assert.ok(text.includes(copy.hint));
      assert.ok(text.includes(copy.intro));
      assert.match(copy.formula, /÷ 100\) × 0[.,]789\) ÷ 10$/);
    }
    assert.ok(paragraphs(read(methodPath)).includes(copy.reference));
  });

  test(`${locale}: methodology, explainer and guide provide contextual same-language calculator links`, () => {
    for (const path of [methodPath, answerPath, guidePath]) {
      assert.ok(main(read(path)).includes(`href="${calculator}"`), path);
    }
    const answer = read(answerPath).match(/<section id="short-answer"[\s\S]*?<\/section>/)[0];
    assert.equal(answer.split(`href="${calculator}"`).length - 1, 1);
    const methodContext = paragraphs(main(read(methodPath))).find(p => p.includes(`${prefix}blog/what-counts-as-a-drink-alcohol-units.html`));
    assert.equal(methodContext.split(`href="${calculator}"`).length - 1, 1);
  });

  test(`${locale}: all five answer-page FAQs match their structured answers`, () => {
    const html = read(answerPath);
    const visible = faqs(html);
    const schema = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .map(match => JSON.parse(match[1])).find(item => item['@type'] === 'FAQPage');
    assert.equal(visible.length, 5);
    assert.deepEqual(schema.mainEntity.map(item => ({ name: item.name, text: item.acceptedAnswer.text })), visible);
    if (locale !== 'en') {
      assert.equal(visible[0].text, copy.faq);
      assert.equal(visible[3].text, copy.ukFaq);
      assert.ok(paragraphs(html).includes(copy.answerIntro));
    }
  });

  test(`${locale}: all four guide examples agree with the unchanged calculator math`, () => {
    const examples = [...read(guidePath).matchAll(/= (\d+) × (0[.,]\d+) × 0[.,]789 ÷ 10\s*<br>\s*≈ <strong>(\d+[.,]\d+)/g)];
    assert.equal(examples.length, 4);
    for (const [, volume, fraction, displayed] of examples) {
      const grams = calculateAlcoholGrams(Number(volume), Number(fraction.replace(',', '.')) * 100);
      assert.equal(calculateGlobalStandardDrinks(grams).toFixed(1), displayed.replace(',', '.'));
    }
  });
}

test('French worked examples state the percentage conversion and correct US drink equivalent', () => {
  assert.ok(read('fr/methodology.html').includes('(150 × (12 ÷ 100) × 0,789) ÷ 10 ≈ 1,4 unité.'));
  assert.equal(calculateGlobalStandardDrinks(calculateAlcoholGrams(150, 12)).toFixed(1), '1.4');
  assert.equal(calculateUsStandardDrinks(calculateAlcoholGrams(175, 12)).toFixed(1), '1.2');
  assert.ok(read('fr/blog/what-counts-as-a-drink-alcohol-units.html').includes('environ 1,2 verre standard (14 g par verre standard)'));
});

test('DE, FR and ID introductory examples name the same quantities and results as their tables', () => {
  for (const locale of ['de', 'fr', 'id']) {
    const html = read(`${locale}/alcohol-units.html`);
    const intro = html.match(/<section id="short-answer"[\s\S]*?<\/section>/)[0];
    assert.match(intro, /330 ml/);
    assert.match(intro, /250 ml/);
    assert.match(intro, /13\s*%/);
    assert.ok(intro.includes('2,6'));
    assert.equal(calculateGlobalStandardDrinks(calculateAlcoholGrams(250, 13)).toFixed(1), '2.6');
  }
});
