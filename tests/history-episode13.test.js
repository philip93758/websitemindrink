import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import test from 'node:test';
import { EPISODE13_ASSETS, EPISODE13_IMAGES, EPISODE13_LOCALES, EPISODE13_SLUG, episode13Prefix, episode13Widths, episode13Variant } from '../scripts/history-episode13-config.js';
import { parseEpisode13, parseEpisode13Options, episode13Inline } from '../scripts/sync-history-episode13-content.js';
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

// Hashes are of the selected English / 19 October V2 Markdown, with CRLF and
// blank lines normalized and section comments removed, not of generated HTML.
export const SELECTED_COPY_HASHES = {
  en: '05a06789a29a56b3ae6a15fc78b941f22b7bb89a04e2e47ea017e916466246e0',
  de: '2c6a316af9d77ce74d93ebc0aec9fb7c4c9163cc6e6a90ac61ac52b9f70ce581',
  es: '63c391e4756c0f2337b7f26c51a6a9d06827080f61524a82007a6e81701750d3',
  fr: '5fe42ff9c3fb6e62f1576ea57f8336ca939ea5722657987e7a0c97878b6cef5b',
  id: 'c999539a06dd5e3d8edee10e159546d1fa985429bdb0a9e0213adc5e4418512d',
  it: 'a7aae0f6261ded7d5760b01459821d7d021f3a61fcbe3dc84661efbffbe5f916',
  ja: '24564fef5016f3ae42c9515a13a78027a546e6d9395ede6688be43033d5d83b7',
  pt: '1dd1bec1a9a34751fa9c0b963393d076e042c7f649fc4371940cf73747d31c4b',
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
    assert.equal(introCount, ['es','id','pt'].includes(locale) ? 1 : 3);
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

test('Middle-episode next navigation is stable and retained by later imports', () => {
  const source = '<nav class="history-series-navigation" aria-label="Series">\n <a href="/science/first.html" rel="prev"><span>Previous</span><strong>First</strong></a>\n <a href="/science/">Science ↑</a>\n</nav>';
  const args = {href:'/science/egypt-drinking-with-the-gods.html', label:'Next episode', title:'Egypt'};
  const linked = linkNextHistoryEpisode(source, args);
  assert.equal(linkNextHistoryEpisode(linked, args), linked);
  assert.equal(retainNextHistoryEpisode(source, linked), linked);
  assert.equal((linked.match(/rel="next"/g) || []).length, 1);
  assert.throws(() => linkNextHistoryEpisode(source, {...args, href:'https://example.org/'}));
});
