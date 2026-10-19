import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { EPISODE12_ASSETS, EPISODE12_IMAGES, EPISODE12_LOCALES, EPISODE12_SLUG, EPISODE12_SOURCE, editionPrefix, episode12Figures, imageVariant, imageWidths } from '../scripts/history-episode12-config.js';
import { parseEpisode12, parseEpisode12Options, sourceFileForEpisode12 } from '../scripts/sync-history-episode12-content.js';

const ROOT = resolve(import.meta.dirname, '..');
const read = path => readFileSync(join(ROOT, path), 'utf8');
const schemas = html => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));

for (const locale of Object.keys(EPISODE12_LOCALES)) {
  test(`Episode 1.2 ${locale}: continuous essay, responsive images and replacement figures`, () => {
    const prefix = editionPrefix(locale);
    const html = read(`${prefix}science/${EPISODE12_SLUG}`);
    assert.match(html, new RegExp(`<html lang="${locale}">`));
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.equal((html.match(/<h2\b/g) || []).length, 4);
    assert.equal((html.match(/<h3\b/g) || []).length, 0);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, 'IDs must be unique');
    const refs = [...html.matchAll(/<li id="ref-(\d+)">/g)].map(match => Number(match[1]));
    assert.deepEqual(refs, Array.from({ length: 11 }, (_, index) => index + 1));
    for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), `Unresolved anchor: ${match[1]}`);
    const figures = [...html.matchAll(/<figure[^>]+data-illustration="([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(figures, episode12Figures());
    assert.ok(html.indexOf('<h1') < html.indexOf('data-illustration="ur-ziggurat"'));
    assert.ok(html.includes('class="history-standfirst"'));
    assert.ok(html.indexOf('class="history-subtitle"') < html.indexOf('data-illustration="ur-ziggurat"'));
    assert.ok(html.indexOf('data-illustration="ur-ziggurat"') < html.indexOf('id="accounts-title"'));
    assert.equal((html.match(/<div class="history-standfirst">[\s\S]*?<\/div>/)[0].match(/<p>/g) || []).length, 1);
    assert.doesNotMatch(html, /class="history-deck"/);
    assert.doesNotMatch(html, /class="history-source-table"/);
    assert.equal((html.match(/loading="eager" fetchpriority="high"/g) || []).length, 1);
    assert.equal((html.match(/loading="lazy"/g) || []).length, 4);
    assert.equal((html.match(/srcset="[^"]+" sizes="[^"]+"/g) || []).length, 5);
    assert.doesNotMatch(html, /<img[^>]+alt=""|<!-- illustration|<!-- comparison|\]\(https?:|\*\*/);
    assert.match(html, /Michael Lubinski/);
    assert.match(html, /Tmtriumph/);
    assert.match(html, /wwws\.loc\.gov\/rr\/print\/res\/258_mats\.html/);
    assert.match(html, /metmuseum\.org\/art\/collection\/search\/324572/);
    assert.match(html, /Mbzt/);
    assert.match(html, /creativecommons\.org\/licenses\/by\/3\.0\//);
    assert.doesNotMatch(html, /Nic McPhee|Johnbod|hammurabi-inscription-rama|puabi-inscribed-seal-mcphee/);
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
    assert.equal((hub.match(/class="science-episode-card"/g) || []).length, 3);
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

function essayFixture() {
  const figure = key => `<!-- illustration: ${key} -->\n![Description](_assets/selected/${EPISODE12_IMAGES[key].file})\n\n*Caption with a qualification.*\n\nPhoto: Artist. [Source](https://example.org/photo_%28detail%29.jpg).\n<!-- /illustration -->`;
  return ['# A source-led article', '### Standfirst heading', 'Lead 1.', figure('ur-ziggurat'),
    'Essay continuum after the lead image.', '---',
    '## Accounts', 'A claim.[1]', figure('malt-barley-tablet'), 'A second claim.[2]', figure('ur-houses'),
    '## Ingredients', 'Ingredients with *emphasis*.', '## People and gods', figure('straw-drinking-seal'), figure('hammurabi-stele'),
    '---', 'A qualified conclusion.', '## References', ...Array.from({ length: 11 }, (_, i) => `${i + 1}. Source ${i + 1}. [Full text](https://example.org/${i + 1}).`)].join('\n\n');
}

test('Episode 1.2 importer accepts the continuous essay and replacement figures', () => {
  const parsed = parseEpisode12(essayFixture(), 'en');
  assert.equal(parsed.title, 'A source-led article');
  assert.equal(parsed.deck, null);
  assert.equal(parsed.standfirst.heading, 'Standfirst heading');
  assert.equal(parsed.standfirst.paragraphs.length, 1);
  assert.match(parsed.body, /Essay continuum after the lead image/);
  assert.match(parsed.body, /<em>emphasis<\/em>/);
  assert.doesNotMatch(parsed.body, /history-source-table|vessel-contents/);
  assert.match(parsed.lead, /https:\/\/example\.org\/photo_%28detail%29\.jpg/);
  assert.match(parsed.lead, /met-324572-straw-seal|ur-ziggurat-lubinski/);
  assert.match(parsed.body, /met-324572-straw-seal/);
  assert.match(parsed.body, /hammurabi-stele-mbzt/);
  assert.doesNotMatch(parsed.body, /puabi-inscribed-seal-mcphee|hammurabi-inscription-rama/);
  assert.match(parsed.body, /href="#ref-1" aria-label="Reference 1"/);
  assert.throws(() => parseEpisode12(essayFixture().replace('Lead 1.', 'Lead 1.\n\nLead 2.'), 'en'));
});

test('Episode 1.2 importer rejects unsupported structure instead of dropping source content', () => {
  for (const [before, after] of [
    ['Lead 1.', ''],
    ['<!-- illustration: ur-houses -->', '<!-- illustration: unknown -->'],
    ['*Caption with a qualification.*', 'Missing caption markup'],
    ['11. Source 11.', '12. Source 11.'],
    ['A claim.[1]', 'A claim.[99]'],
    ['Ingredients with *emphasis*.', '### Unreviewed body subsection'],
    ['Ingredients with *emphasis*.', '#### Unreviewed extra section'],
  ]) assert.throws(() => parseEpisode12(essayFixture().replace(before, after), 'en'), `${before} should require review`);
});

test('Episode 1.2 approved selection is explicit and rejects accidental CLI scope', () => {
  const options = parseEpisode12Options(['approved', '--approved', '--locale', 'ja', '--check']);
  assert.deepEqual(options.locales, ['ja']);
  assert.ok(options.approved && options.check);
  assert.equal(parseEpisode12Options(['legacy']).approved, false);
  for (const args of [[], ['--approved'], ['approved', '--locale'], ['approved', '--locale', 'xx'], ['approved', '--locale', 'ja', '--locale', 'fr'], ['approved', '--unknown'], ['approved', 'another-directory']]) {
    assert.throws(() => parseEpisode12Options(args));
  }
});

test('Episode 1.2 approved files resolve uniquely without falling back to drafts', () => {
  const directory = mkdtempSync(join(tmpdir(), 'mindrink-episode12-'));
  try {
    const filename = `${EPISODE12_SOURCE}.ja.pipeline-output-2026-10-15-v3.md`;
    writeFileSync(join(directory, filename), 'Approved Japanese');
    writeFileSync(join(directory, `${EPISODE12_SOURCE}.ja.pipeline-reviewed-2026-10-16.md`), 'Not approved');
    writeFileSync(join(directory, `${EPISODE12_SOURCE}.md`), 'Approved English');
    assert.equal(sourceFileForEpisode12(directory, 'ja', true), join(directory, filename));
    assert.equal(sourceFileForEpisode12(directory, 'en', true), join(directory, `${EPISODE12_SOURCE}.md`));
    assert.equal(sourceFileForEpisode12(directory, 'ja'), join(directory, `${EPISODE12_SOURCE}.ja.md`));
    assert.throws(() => sourceFileForEpisode12(directory, 'fr', true), /exactly one/);
    assert.throws(() => sourceFileForEpisode12(directory, 'xx', true), /Unknown/);
    writeFileSync(join(directory, `${EPISODE12_SOURCE}.ja.pipeline-output-2026-10-16.md`), 'Ambiguous approval');
    assert.throws(() => sourceFileForEpisode12(directory, 'ja', true), /exactly one/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('Episode 1.2 editorial markers must match section headings and never render', () => {
  const marked = essayFixture().replace('## Accounts', '## Accounts\n<!-- section:beer-accounts -->')
    .replace('## Ingredients', '## Ingredients\n<!-- section:reconstructing-beer -->')
    .replace('## People and gods', '## People and gods\n<!-- section:drinking-society -->');
  assert.deepEqual(parseEpisode12(marked, 'en'), parseEpisode12(essayFixture(), 'en'));
  assert.deepEqual(parseEpisode12(marked.replaceAll('\n', '\r\n'), 'en'), parseEpisode12(marked, 'en'));
  for (const source of [
    marked.replace('<!-- section:beer-accounts -->', '<!-- section:unexpected -->'),
    marked.replace('<!-- section:reconstructing-beer -->', ''),
    marked.replace('<!-- section:drinking-society -->', '<!-- section:drinking-society -->\n<!-- section:drinking-society -->'),
    marked.replace('## Accounts\n<!-- section:beer-accounts -->', '<!-- section:beer-accounts -->\n## Accounts'),
    marked.replace('## People and gods\n<!-- section:drinking-society -->', '## People and gods').replace('## References', '## References\n<!-- section:drinking-society -->'),
    marked.replace('A claim.[1]', '<!-- Unapproved comment -->'),
  ]) assert.throws(() => parseEpisode12(source, 'en'));
});
