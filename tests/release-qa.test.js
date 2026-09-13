import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import * as formulas from '../shared/alcohol/formulas.js';
import * as constants from '../shared/alcohol/constants.js';
import * as drinks from '../shared/alcohol/drinks.js';
import { listHtmlFiles } from '../scripts/update-analytics-loaders.js';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const locales = ['en', 'de', 'es', 'fr', 'id', 'it', 'ja', 'pt'];
const schemas = html => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
const plain = html => html.replace(/<[^>]+>/g, '').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&(amp|quot|apos|nbsp|rsquo);/g, (_, entity) => ({amp:'&',quot:'"',apos:"'",nbsp:' ',rsquo:'’'})[entity]).replace(/\s+/g, ' ').trim();

test('all public header logos retain the page language', () => {
  for (const path of listHtmlFiles()) {
    const html = readFileSync(path, 'utf8');
    const locale = html.match(/<html[^>]+lang="([^"]+)"/)[1];
    const logo = html.match(/<div class="logo-section">\s*<a[^>]+href="([^"]+)"/);
    assert.ok(logo, path);
    assert.equal(logo[1], locale === 'en' ? '/' : `/${locale}/`, path);
  }
});

for (const locale of locales) {
  const prefix = locale === 'en' ? '' : locale + '/';
  test(`${locale}: corrected article metadata is current and internally consistent`, () => {
    for (const file of ['methodology.html','blog/best-alcohol-tracking-apps.html','blog/what-counts-as-a-drink-alcohol-units.html']) {
      const html = read(prefix + file);
      const article = schemas(html).find(s => ['Article','BlogPosting'].includes(s['@type']));
      assert.ok(article.dateModified >= '2026-09-13', prefix + file);
      assert.ok(article.datePublished <= article.dateModified);
      const social = html.match(/<meta property="article:modified_time" content="([^"]+)"/);
      if (social) assert.equal(social[1].slice(0,10), article.dateModified);
    }
  });
  test(`${locale}: both history episodes reserve proportional figure space`, () => {
    for (const slug of ['who-invented-alcohol.html','mesopotamia-beer-written-records.html']) {
      const html = read(prefix + 'science/' + slug);
      const images = [...html.matchAll(/<img[^>]+loading="(?:lazy|eager)"[^>]*>/g)];
      assert.equal(images.length, slug.startsWith('who-') ? 4 : 5);
      for (const [image] of images) {
        const w = image.match(/width="(\d+)"/)[1], h = image.match(/height="(\d+)"/)[1];
        assert.ok(image.includes(`style="--history-image-ratio: ${w} / ${h}"`));
      }
    }
  });
}

for (const path of ['binge-drinking.html','dry-day.html','private-alcohol-tracking.html','reduce-drinking.html','what-to-look-for-in-alcohol-tracker.html','it/faq.html']) {
  test(`${path}: FAQ schema matches the existing visible questions and answers`, () => {
    const html = read(path), main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
    const faqs = [...main.matchAll(/<details\b[^>]*>([\s\S]*?)<\/details>/g)].map(([, detail]) => ({
      name: plain(detail.match(/<summary\b[^>]*>([\s\S]*?)<\/summary>/)[1]),
      answer: plain([...detail.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map(m => m[1]).join(' ')),
    }));
    const schema = schemas(html).find(s => s['@type'] === 'FAQPage');
    assert.equal(schema.mainEntity.length, faqs.length);
    assert.ok(faqs.length > 0);
    schema.mainEntity.forEach((q,i) => {
      assert.equal(plain(q.name), faqs[i].name);
      assert.equal(plain(q.acceptedAnswer.text), faqs[i].answer);
    });
  });
}

test('calculator typing preserves editor text; explicit preset sync still replaces it', () => {
  const fields = Object.fromEntries(['selected-drink-type','selected-volume','selected-abv','selected-quantity'].map(id => [id, {value:''}]));
  const context = vm.createContext({ ...formulas, ...constants, ...drinks,
    trackCalculatorStarted() {},
    document: {documentElement:{lang:'en'},readyState:'loading',addEventListener(){},getElementById:id => fields[id] || null},
  });
  const script = read('scripts/alcohol-unit-calculator.js').replace(/^import[\s\S]*?;\s*/gm, '');
  vm.runInContext(script + '\nglobalThis.api={updateDraft,parseNumericInput,getInputHint};', context);
  for (const raw of ['4.','4.5','0.5','12.5','']) {
    fields['selected-abv'].value = raw;
    context.api.updateDraft(draft => {draft.abvPercent = context.api.parseNumericInput(raw);});
    assert.equal(fields['selected-abv'].value, raw);
  }
  context.api.updateDraft(draft => {draft.abvPercent=12; draft.volumeMl=175;}, true);
  assert.equal(fields['selected-abv'].value, 12);
  assert.equal(fields['selected-volume'].value, 175);
  assert.notEqual(context.api.getInputHint({volumeMl:500,abvPercent:5,quantity:1.5}), '');
});

test('methodology source spans wrap and lazy image layout uses definite proportional widths', () => {
  const css = read('styles.css');
  assert.match(css, /\.methodology-page \.small-muted\s*\{\s*overflow-wrap: anywhere;/);
  assert.match(css, /aspect-ratio: var\(--history-image-ratio\)/);
  assert.match(css, /width: min\(100%, calc\(44svh \* var\(--history-image-ratio\)\)/);
});
