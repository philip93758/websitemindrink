import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { EPISODE12_ASSETS, EPISODE12_IMAGES, EPISODE12_LOCALES, EPISODE12_SLUG, editionPrefix, episode12Figures, imageVariant, imageWidths } from '../scripts/history-episode12-config.js';
import { parseEpisode12 } from '../scripts/sync-history-episode12-content.js';

const ROOT = resolve(import.meta.dirname, '..');
const read = path => readFileSync(join(ROOT, path), 'utf8');
const schemas = html => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));

for (const locale of Object.keys(EPISODE12_LOCALES)) {
  test(`Episode 1.2 ${locale}: complete article, responsive images and accessible source table`, () => {
    const prefix = editionPrefix(locale);
    const html = read(`${prefix}science/${EPISODE12_SLUG}`);
    assert.match(html, new RegExp(`<html lang="${locale}">`));
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.equal((html.match(/<h2\b/g) || []).length, 4);
    assert.equal((html.match(/<h3\b/g) || []).length, locale === 'fr' ? 10 : 1);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, 'IDs must be unique');
    const refs = [...html.matchAll(/<li id="ref-(\d+)">/g)].map(match => Number(match[1]));
    assert.deepEqual(refs, Array.from({ length: 11 }, (_, index) => index + 1));
    for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), `Unresolved anchor: ${match[1]}`);
    const figures = [...html.matchAll(/<figure[^>]+data-illustration="([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(figures, episode12Figures(locale));
    assert.ok(html.indexOf('<h1') < html.indexOf('data-illustration="ur-ziggurat"'));
    if (locale === 'fr') {
      assert.ok(html.includes('class="history-standfirst"'));
      assert.ok(html.indexOf('class="history-subtitle"') < html.indexOf('data-illustration="ur-ziggurat"'));
      assert.ok(html.indexOf('data-illustration="ur-ziggurat"') < html.indexOf('id="accounts-title"'));
      assert.equal((html.match(/<div class="history-standfirst">[\s\S]*?<\/div>/)[0].match(/<p>/g) || []).length, 2);
      assert.doesNotMatch(html, /class="history-deck"/);
    } else {
      assert.ok(html.indexOf('data-illustration="ur-ziggurat"') < html.indexOf('class="history-deck"'));
    }
    assert.equal((html.match(/loading="eager" fetchpriority="high"/g) || []).length, 1);
    assert.equal((html.match(/loading="lazy"/g) || []).length, 4);
    assert.equal((html.match(/srcset="[^"]+" sizes="[^"]+"/g) || []).length, 5);
    assert.doesNotMatch(html, /<img[^>]+alt=""|<!-- illustration|<!-- comparison|\]\(https?:|\*\*/);
    assert.match(html, /<table class="history-source-table" aria-labelledby="reading-sources-title" role="table">/);
    assert.equal((html.match(/scope="row" role="rowheader"/g) || []).length, 4);
    assert.equal((html.match(/class="history-source-label" aria-hidden="true"/g) || []).length, 8);
    assert.match(html, /Michael Lubinski/);
    assert.match(html, /Tmtriumph/);
    assert.match(html, /wwws\.loc\.gov\/rr\/print\/res\/258_mats\.html/);
    if (locale === 'fr') {
      assert.match(html, /metmuseum\.org\/art\/collection\/search\/324572/);
      assert.match(html, /Mbzt/);
      assert.match(html, /creativecommons\.org\/licenses\/by\/3\.0\//);
      assert.doesNotMatch(html, /Nic McPhee|Johnbod|hammurabi-inscription-rama|puabi-inscribed-seal-mcphee/);
    } else {
      assert.match(html, /Nic McPhee/);
      assert.match(html, /Johnbod/);
      assert.match(html, /creativecommons\.org\/licenses\/by-sa\/3\.0\/fr\//);
      assert.match(html, /creativecommons\.org\/licenses\/by-sa\/2\.0\//);
    }
  });

  test(`Episode 1.2 ${locale}: localized discovery, previous/next links and search metadata`, () => {
    const prefix = editionPrefix(locale);
    const route = `${prefix}science/${EPISODE12_SLUG}`;
    const url = `https://mindrink.me/${route}`;
    const html = read(route);
    const title = html.match(/<h1 class="history-title">([^<]+)<\/h1>/)[1];
    const article = schemas(html).find(schema => schema['@type'] === 'Article');
    assert.equal(article.headline, title);
    assert.equal(article.inLanguage, locale);
    assert.equal(article.url, url);
    assert.equal(article.mainEntityOfPage['@id'], url);
    assert.match(article.datePublished, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(article.dateModified >= article.datePublished);
    assert.ok(html.includes(`<link rel="canonical" href="${url}">`));
    assert.equal((html.match(/<link rel="alternate" hreflang=/g) || []).length, 9);
    for (const alternate of Object.keys(EPISODE12_LOCALES)) {
      const destination = `/${editionPrefix(alternate)}science/${EPISODE12_SLUG}`;
      assert.ok(html.includes(`hreflang="${alternate}" href="https://mindrink.me${destination}"`));
      assert.ok(html.includes(`<a href="${destination}" class="language-option`));
    }
    const previous = read(`${prefix}science/who-invented-alcohol.html`);
    assert.ok(previous.includes(`<a href="/${route}" rel="next">`));
    assert.ok(previous.includes(` — ${title}</a>`));
    assert.ok(html.includes(`<a href="/${prefix}science/who-invented-alcohol.html" rel="prev">`));
    const hub = read(`${prefix}science/index.html`);
    assert.equal((hub.match(/class="science-episode-card"/g) || []).length, 2);
    assert.ok(hub.indexOf('class="science-methodology"') < hub.indexOf('class="science-history-series"'));
    assert.ok(hub.includes(`<a class="science-card-link" href="/${route}">`));
    assert.ok(schemas(hub).find(schema => schema['@type'] === 'CollectionPage').hasPart.some(part => part.url === url && part.headline === title));
    const sitemap = read('sitemap.xml');
    const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].filter(match => match[1].includes(`<loc>${url}</loc>`));
    assert.equal(entries.length, 1);
    assert.equal((entries[0][1].match(/<xhtml:link/g) || []).length, 9);
    for (const match of html.matchAll(/(?:src|href)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
      const destination = match[1].endsWith('/') ? `${match[1]}index.html` : match[1];
      assert.ok(existsSync(join(ROOT, destination)), `Missing internal destination: ${destination}`);
    }
  });
}

test('Episode 1.2 preserves approved originals and ships bounded web variants', () => {
  for (const image of Object.values(EPISODE12_IMAGES)) {
    const original = readFileSync(join(ROOT, EPISODE12_ASSETS, image.file));
    assert.equal(createHash('sha256').update(original).digest('hex'), image.sha256);
    for (const width of imageWidths(image)) {
      assert.ok(width <= image.width);
      assert.ok(statSync(join(ROOT, EPISODE12_ASSETS, imageVariant(image, width))).size < 500_000);
    }
  }
});

function fixture() {
  const figure = key => `<!-- illustration: ${key} -->\n![Description](_assets/selected/${EPISODE12_IMAGES[key].file})\n\n*Caption with a qualification.*\n\nPhoto: Artist. [Source](https://example.org/photo_%28detail%29.jpg).\n<!-- /illustration -->`;
  return ['# A source-led article', figure('ur-ziggurat'), ...Array.from({ length: 5 }, (_, i) => `Intro ${i + 1}.`),
    '## Accounts', 'A claim.[1]', figure('malt-barley-tablet'), 'A second claim.[2]', figure('ur-houses'),
    '## Ingredients', 'Ingredients with *emphasis*.', '## People and gods', figure('puabi-related-seal'), figure('hammurabi-inscription'),
    '<!-- comparison: reading-the-sources -->\n### Reading sources\n\n| Source | Can show | Cannot show |\n|---|---|---|\n| Accounts[1] | Quantities | Taste |\n| Images[2] | Representation | Typicality |\n| Hymns[3] | Celebration | A recipe |\n| Laws[4] | Rules | Enforcement |\n\n<!-- /comparison -->',
    '---', 'A qualified conclusion.', '## References', ...Array.from({ length: 11 }, (_, i) => `${i + 1}. Source ${i + 1}. [Full text](https://example.org/${i + 1}).`)].join('\n\n');
}

test('Episode 1.2 importer preserves captions, emphasis and encoded source links', () => {
  const parsed = parseEpisode12(fixture(), 'en');
  assert.equal(parsed.title, 'A source-led article');
  assert.equal(parsed.deck, 'Intro 1.');
  assert.equal(parsed.standfirst, null);
  assert.doesNotMatch(parsed.body, /Intro 1\./);
  assert.match(parsed.body, /<em>emphasis<\/em>/);
  assert.match(parsed.lead, /https:\/\/example\.org\/photo_%28detail%29\.jpg/);
  assert.match(parsed.body, /href="#ref-1" aria-label="Reference 1"/);
});

test('Episode 1.2 importer accepts the French standfirst and replacement figures', () => {
  const figure = key => `<!-- illustration: ${key} -->\n![Description](_assets/selected/${EPISODE12_IMAGES[key].file})\n\n*Caption with a qualification.*\n\nPhoto: Artist. [Source](https://example.org/photo_%28detail%29.jpg).\n<!-- /illustration -->`;
  const source = ['# A source-led article', '### Standfirst heading', 'Lead 1.', 'Lead 2.', figure('ur-ziggurat'),
    '## Accounts', 'A claim.[1]', figure('malt-barley-tablet'), 'A second claim.[2]', figure('ur-houses'),
    '## Ingredients', '### Vessel contents', 'Ingredients with *emphasis*.', '## People and gods', figure('straw-drinking-seal'), figure('hammurabi-stele'),
    '<!-- comparison: reading-the-sources -->\n### Reading sources\n\n| Source | Can show | Cannot show |\n|---|---|---|\n| Accounts[1] | Quantities | Taste |\n| Images[2] | Representation | Typicality |\n| Hymns[3] | Celebration | A recipe |\n| Laws[4] | Rules | Enforcement |\n\n<!-- /comparison -->',
    '---', 'A qualified conclusion.', '## References', ...Array.from({ length: 11 }, (_, i) => `${i + 1}. Source ${i + 1}. [Full text](https://example.org/${i + 1}).`)].join('\n\n');
  const parsed = parseEpisode12(source, 'fr');
  assert.equal(parsed.deck, null);
  assert.equal(parsed.standfirst.heading, 'Standfirst heading');
  assert.equal(parsed.standfirst.paragraphs.length, 2);
  assert.match(parsed.body, /id="vessel-contents"/);
  assert.match(parsed.lead, /met-324572-straw-seal|ur-ziggurat-lubinski/);
  assert.match(parsed.body, /met-324572-straw-seal/);
  assert.match(parsed.body, /hammurabi-stele-mbzt/);
  assert.doesNotMatch(parsed.body, /puabi-inscribed-seal-mcphee|hammurabi-inscription-rama/);
  assert.throws(() => parseEpisode12(source.replace('Lead 2.', 'Lead 2.\n\nLead 3.\n\nLead 4.'), 'fr'));
});

test('Episode 1.2 importer rejects unsupported structure instead of dropping source content', () => {
  for (const [before, after] of [
    ['Intro 5.', ''],
    ['<!-- illustration: ur-houses -->', '<!-- illustration: unknown -->'],
    ['*Caption with a qualification.*', 'Missing caption markup'],
    ['11. Source 11.', '12. Source 11.'],
    ['A claim.[1]', 'A claim.[99]'],
    ['| Laws[4] | Rules | Enforcement |', '| Laws[4] | Rules |'],
    ['Ingredients with *emphasis*.', '#### Unreviewed extra section'],
  ]) assert.throws(() => parseEpisode12(fixture().replace(before, after), 'en'), `${before} should require review`);
});
