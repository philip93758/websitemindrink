import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import test from 'node:test';
import { EPISODE13_ASSETS, EPISODE13_IMAGES, EPISODE13_LOCALES, EPISODE13_SLUG, EPISODE13_SOURCES, episode13Prefix, episode13Widths, episode13Variant } from '../scripts/history-episode13-config.js';
import { parseEpisode13, parseEpisode13Options, episode13Inline, validateEpisode13Manifest, loadEpisode13Handoff } from '../scripts/sync-history-episode13-content.js';
import { linkNextHistoryEpisode, retainNextHistoryEpisode } from '../scripts/history-series-navigation.js';

const ROOT = resolve(import.meta.dirname, '..');
const read = path => readFileSync(join(ROOT, path), 'utf8').replaceAll('\r\n', '\n');
const hash = text => createHash('sha256').update(text).digest('hex');
const schemas = html => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
const decode = text => text.replaceAll('&quot;', '"').replaceAll('&gt;', '>').replaceAll('&lt;', '<').replaceAll('&amp;', '&');
function markdownInline(html) {
  return decode(html.replace(/<a class="citation"[^>]+>(\[\d+\])<\/a>/g, '$1')
    .replace(/<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, '[$2]($1)')
    .replaceAll('<em>', '*').replaceAll('</em>', '*').replaceAll('<strong>', '**').replaceAll('</strong>', '**'));
}

// Independent reverse-render check: every selected word, paragraph, heading,
// citation, image identity/alt/caption/credit and bibliography URL is covered.
// Editorial section comments are the only source material intentionally omitted.
export function reconstructEpisode13(html) {
  const content = html.slice(html.indexOf('<h1 class="history-title">'), html.indexOf('<nav class="history-series-navigation"'));
  const blocks = [];
  for (const match of content.matchAll(/<(h[123]|p|figure|li)\b([^>]*)>([\s\S]*?)<\/\1>/g)) {
    const [, tag, attributes, inner] = match;
    if (attributes.includes('history-meta')) continue;
    if (tag === 'figure') {
      const key = attributes.match(/data-illustration="([^"]+)"/)[1];
      const alt = inner.match(/\balt="([^"]+)"/)[1];
      const caption = inner.match(/<figcaption>([\s\S]+?) <span class="history-image-credit">([\s\S]+?)<\/span><\/figcaption>/);
      const text = markdownInline(caption[1]);
      const [, words, citations] = text.match(/^([\s\S]*?)((?:\[\d+\])*)$/);
      blocks.push(`<!-- illustration: ${key} -->\n![${decode(alt)}](${EPISODE13_IMAGES[key].source})\n\n*${words}*${citations}\n\n${markdownInline(caption[2])}\n<!-- /illustration -->`);
    } else if (tag.startsWith('h')) blocks.push(`${'#'.repeat(Number(tag[1]))} ${markdownInline(inner)}`);
    else if (attributes.includes('history-subtitle')) blocks.push(`### ${markdownInline(inner)}`);
    else if (tag === 'li') blocks.push(`${attributes.match(/id="ref-(\d+)"/)[1]}. ${markdownInline(inner)}`);
    else blocks.push(markdownInline(inner));
  }
  return blocks.join('\n\n');
}

// Hashes are of the manifest-selected web-handoff Markdown, with CRLF and
// blank lines normalized and section comments removed, not of generated HTML.
export const SELECTED_COPY_HASHES = {
  en: '773d0ee6c64a93b6cf76f5b34891c0a85d7457e224a75797fbf413e632e8a043',
  de: '14898acf0638e2485050b80042bec1846d640cc14bc78d961f14f067c5ee54ff',
  es: 'dee5fb6e2e867490d0906233a55c09644a1b22ada844da4d65c9399eb18a6674',
  fr: 'ebffdfabc5f2ae45feb7ded6c996b193507ccbf60f88613324c0ba57bb5df859',
  id: 'f97bc78199e14ec209470da4cc79b1e9b96a34ea452440b806c4280935657045',
  it: '3a189b9aa2132cc75630722099d96f04299879f218e28f3024b58f2f223c8b7d',
  ja: '96398eba847cf31f22b614b47c722f78aac1c6e450ec7e70ac895104130b3718',
  pt: '166ef0764765a35e2f9071dcf934434f8426f7d8e617812a06601ec9a7011e3a',
};

for (const locale of Object.keys(EPISODE13_LOCALES)) {
  test(`Episode 1.3 ${locale}: exact selected copy and 3 × 3 hierarchy`, () => {
    const html = read(`${episode13Prefix(locale)}science/${EPISODE13_SLUG}`);
    assert.equal(hash(reconstructEpisode13(html)), SELECTED_COPY_HASHES[locale]);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.equal((html.match(/<h2\b/g) || []).length, 5);
    assert.equal((html.match(/<h3\b/g) || []).length, 9);
    assert.equal((html.match(/class="history-rights-note"/g) || []).length, 1);
    const refs = [...html.matchAll(/<li id="ref-(\d+)"/g)].map(m => Number(m[1]));
    assert.deepEqual(refs, Array.from({length:16}, (_, i) => i + 1));
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
    assert.equal(new Set(ids).size, ids.length);
    for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), match[1]);
    assert.doesNotMatch(html, /<!-- (?:section|illustration):|FIGURETOKEN|\]\(https?:|\*\*/);
    assert.ok(html.includes('https://commons.wikimedia.org/wiki/File:Manners_and_customs_of_the_Ancient_Egyptians_vol.2_(IA_in.gov.ignca.34709).pdf'));
    const introCount = (html.match(/<div class="history-standfirst">([\s\S]*?)<\/div>/)[1].match(/<p>/g) || []).length;
    assert.equal(introCount, 3);
  });

  test(`Episode 1.3 ${locale}: five credited responsive figures, schema and localized discovery`, () => {
    const prefix = episode13Prefix(locale), url = `https://mindrink.me/${prefix}science/${EPISODE13_SLUG}`;
    const html = read(`${prefix}science/${EPISODE13_SLUG}`);
    assert.deepEqual([...html.matchAll(/data-illustration="([^"]+)"/g)].map(m => m[1]), Object.keys(EPISODE13_IMAGES));
    assert.equal((html.match(/loading="eager" fetchpriority="high"/g) || []).length, 1);
    assert.equal((html.match(/loading="lazy"/g) || []).length, 4);
    assert.equal((html.match(/srcset="[^"]+" sizes="[^"]+"/g) || []).length, 5);
    assert.equal((html.match(/class="history-image-credit"/g) || []).length, 5);
    assert.equal((html.match(/<link rel="alternate" hreflang=/g) || []).length, 9);
    assert.match(html, new RegExp(`<html lang="${locale}">`));
    assert.ok(html.includes(`<link rel="canonical" href="${url}">`));
    for (const other of Object.keys(EPISODE13_LOCALES)) {
      const route = `/${episode13Prefix(other)}science/${EPISODE13_SLUG}`;
      assert.ok(html.includes(`hreflang="${other}" href="https://mindrink.me${route}"`));
      assert.ok(html.includes(`<a href="${route}" class="language-option`));
    }
    const article = schemas(html).find(s => s['@type'] === 'Article');
    assert.equal(article.headline, decode(html.match(/<h1 class="history-title">([^<]+)<\/h1>/)[1]));
    assert.equal(article.url, url);
    assert.equal(article.inLanguage, locale);
    assert.equal(article.mainEntityOfPage['@id'], url);
    assert.match(article.datePublished, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(article.datePublished, '2026-10-19', 'a content refresh must retain the original publication date');
    assert.ok(article.dateModified >= article.datePublished);
    for (const kind of ['published','modified']) assert.equal(html.match(new RegExp(`<meta property="article:${kind}_time" content="([^"]+)"`))[1].slice(0,10), article[kind === 'published' ? 'datePublished' : 'dateModified']);
    const hub = read(`${prefix}science/index.html`);
    assert.ok(hub.includes(`class="science-card-link" href="/${prefix}science/${EPISODE13_SLUG}"`));
    assert.ok(schemas(hub).find(s => s['@type'] === 'CollectionPage').hasPart.some(p => p.url === url && p.headline === article.headline));
    const previous = read(`${prefix}science/mesopotamia-beer-written-records.html`);
    assert.ok(previous.includes(`<a href="/${prefix}science/${EPISODE13_SLUG}" rel="next">`));
    assert.ok(html.includes(`<a href="/${prefix}science/mesopotamia-beer-written-records.html" rel="prev">`));
    assert.ok(html.includes(`<a href="/${prefix}science/">`));
    const entries = [...read('sitemap.xml').matchAll(/<url>([\s\S]*?)<\/url>/g)].filter(m => m[1].includes(`<loc>${url}</loc>`));
    assert.equal(entries.length, 1);
    assert.equal((entries[0][1].match(/<xhtml:link/g) || []).length, 9);
  });
}

test('Egypt selected originals and proportional derivatives remain bounded and uncropped', () => {
  for (const image of Object.values(EPISODE13_IMAGES)) {
    assert.equal(hash(readFileSync(join(ROOT, EPISODE13_ASSETS, image.file))), image.sha256);
    for (const width of episode13Widths(image)) {
      assert.ok(width <= image.width);
      assert.ok(statSync(join(ROOT, EPISODE13_ASSETS, episode13Variant(image, width))).size < 500_000);
    }
  }
});

function fixture() {
  const figure = key => `<!-- illustration: ${key} -->\n![Alt](${EPISODE13_IMAGES[key].source})\n\n*Caption.*[1]\n\nImage: [Record](${EPISODE13_IMAGES[key].record}).\n<!-- /illustration -->`;
  return ['# Egypt', '### Subtitle', 'Opening.[1]', 'Question.[2]', 'Context.', figure('nebamun-receiving-wine'),
    '## Life', '### Beer', 'Provision.', figure('meketre-bakery-brewery'), '### Pleasure', 'Pleasure.', '### Company', figure('women-at-banquet'),
    '## Effects', '### Excess', figure('wilkinson-banquet-excess'), '### Judgment', 'Warning.', '### Duty', 'Duty.',
    '## Religion', '### Myth', 'Myth.', '### Temple', figure('sakhmet'), '### Song', 'A song.',
    '## Conclusion', 'A qualified conclusion.', '## References', ...Array.from({length:16}, (_, i) => `${i + 1}. Source *${i + 1}*. [Record](https://example.org/${i+1}).`),
    'Image rights. [Policy](https://example.org/policy).'].join('\n\n');
}

test('Egypt importer preserves selected paragraph/image order and rejects incomplete structures', () => {
  const parsed = parseEpisode13(fixture(), 'en');
  assert.equal(parsed.intro.length, 3);
  assert.match(parsed.body, /<h3>Beer<\/h3>/);
  for (const [before, after] of [
    ['Context.', ''], ['### Duty', '## Extra section'], ['16. Source', '17. Source'], ['Question.[2]', 'Question.[99]'],
    ['<!-- illustration: sakhmet -->', '<!-- illustration: unknown -->'], ['*Caption.*[1]', 'Caption without markup'],
    ['Image rights. [Policy](https://example.org/policy).', ''], ['Provision.', '<script>unapproved()</script>'],
  ]) assert.throws(() => parseEpisode13(fixture().replace(before, after), 'en'), before);
  const marked = fixture().replace('## Life', '## Life\n<!-- section:desirable-life -->').replace('## Effects', '## Effects\n<!-- section:unsettling-effects -->')
    .replace('## Religion', '## Religion\n<!-- section:sacred-intoxication -->').replace('## Conclusion', '## Conclusion\n<!-- section:living-with-alcohol -->');
  assert.deepEqual(parseEpisode13(marked, 'fr'), parseEpisode13(fixture(), 'fr'));
  assert.throws(() => parseEpisode13(marked.replace('section:desirable-life', 'section:unknown'), 'fr'));
  assert.throws(() => parseEpisode13(fixture(), 'xx'));
  assert.deepEqual(parseEpisode13(fixture().replaceAll('\n', '\r\n'), 'en'), parsed);
});

test('Egypt inline links preserve balanced URLs, emphasis and reference fragments', () => {
  assert.equal(episode13Inline('[*Source*](https://example.org/a_(b).pdf#page=113).[1]', 'en'), '<a href="https://example.org/a_(b).pdf#page=113" rel="noopener noreferrer"><em>Source</em></a>.<a class="citation" href="#ref-1" aria-label="Reference 1">[1]</a>');
  assert.throws(() => episode13Inline('[Unsafe](javascript:alert(1))', 'en'));
  assert.throws(() => episode13Inline('[Broken](https://example.org', 'en'));
});

test('Egypt source selection CLI is explicit and never chooses pipeline drafts', () => {
  assert.deepEqual(parseEpisode13Options(['root', '--check', '--locale', 'fr']).locale, 'fr');
  for (const args of [[], ['--check'], ['root', '--locale'], ['root', '--locale', 'xx'], ['root', '--approved'], ['root', '--check', '--check'], ['root', '--locale', 'de', '--locale', 'fr']]) assert.throws(() => parseEpisode13Options(args));
});

function handoffManifest() {
  const local = EPISODE13_IMAGES['wilkinson-banquet-excess'];
  return {
    schema_version: 1, episode: '1.3', english_reference_language: 'en',
    articles: Object.entries(EPISODE13_SOURCES).map(([language, selected]) => ({
      language, locale: language === 'pt' ? 'pt-PT' : language,
      edition: language === 'en' ? 'V4' : 'V5', ...selected,
    })),
    references_per_article: 16, illustration_ids_in_order: Object.keys(EPISODE13_IMAGES),
    local_assets: [{file: local.source, sha256: local.sha256}],
  };
}

test('Egypt handoff requires all exact files, hashes, editions, locales and illustration identities', () => {
  const manifest = handoffManifest();
  assert.equal(validateEpisode13Manifest(manifest), manifest);
  assert.doesNotThrow(() => validateEpisode13Manifest({...manifest, articles: [...manifest.articles].reverse()}));
  for (const alter of [
    m => m.articles.pop(),
    m => m.articles.push(m.articles[0]),
    m => m.articles[1] = m.articles[0],
    m => m.articles[0].file = 'Approved/Egypt - Drinking with the Gods.md',
    m => m.articles[0].sha256 = '0'.repeat(64),
    m => m.articles[0].edition = 'V2',
    m => m.articles.find(a => a.language === 'pt').locale = 'pt-BR',
    m => m.articles[0].file = '../outside.md',
    m => m.references_per_article = 15,
    m => m.illustration_ids_in_order.reverse(),
    m => m.local_assets[0].sha256 = '0'.repeat(64),
  ]) {
    const changed = structuredClone(manifest);
    alter(changed);
    assert.throws(() => validateEpisode13Manifest(changed));
  }
});

test('Egypt handoff refuses altered source bytes before any website write', () => {
  const directory = mkdtempSync(join(tmpdir(), 'mindrink-episode13-handoff-'));
  try {
    writeFileSync(join(directory, 'manifest.json'), JSON.stringify(handoffManifest()));
    writeFileSync(join(directory, EPISODE13_SOURCES.en.file), fixture());
    assert.throws(() => loadEpisode13Handoff(directory), /Selected source changed/);
  } finally {
    rmSync(directory, {recursive: true, force: true});
  }
});

test('Middle-episode next navigation is stable and retained by later imports', () => {
  const source = '<nav class="history-series-navigation" aria-label="Series">\n <a href="/science/first.html" rel="prev"><span>Previous</span><strong>First</strong></a>\n <a href="/science/">Science ↑</a>\n</nav>';
  const args = {href:'/science/egypt-drinking-with-the-gods.html', label:'Next episode', title:'Egypt'};
  const linked = linkNextHistoryEpisode(source, args);
  assert.equal(linkNextHistoryEpisode(linked, args), linked);
  assert.equal(retainNextHistoryEpisode(source, linked), linked);
  assert.equal((linked.match(/rel="next"/g) || []).length, 1);
  assert.throws(() => linkNextHistoryEpisode(source, {...args, href:'https://example.org/'}));
});
