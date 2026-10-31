import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { parseEpisode11, parseSyncOptions, sourceFileForEdition } from '../scripts/sync-history-episode-content.js';

function fixture() {
  return [
    '# A source-led article', '### Its subtitle', 'A deck.', 'Another introduction.',
    '## Earliest drinks\n<!-- section:earliest-drinks -->', 'Jiahu evidence.[1]',
    '## Ingredients\n<!-- section:ingredients-preparations -->', 'Khramis Didi-Gora evidence.[3]',
    '## Community\n<!-- section:communal-life -->', 'Göbekli Tepe evidence.[4]',
    '## Beginnings\n<!-- section:unrecoverable-beginnings -->', 'An uncertain beginning.[14][15]',
    'Prossimo episodio: **Episodio 2 — Planned title**.', '## References',
    ...Array.from({ length: 15 }, (_, i) => `${i + 1}. Reference ${i + 1}.`),
  ].join('\n\n');
}

test('Episode 1.1 selection excludes frozen editions and rejects accidental CLI scope', () => {
  const options = parseSyncOptions(['approved', '--approved', '--locales', 'de,es,it,pt,id,ja', '--check']);
  assert.deepEqual(options.locales, ['de', 'es', 'it', 'pt', 'id', 'ja']);
  assert.ok(options.approved && options.check);
  assert.deepEqual(parseSyncOptions(['approved', '--approved', '--locales', 'es,pt,it,ja,id']).locales, ['es', 'pt', 'it', 'ja', 'id']);
  for (const flags of [['--locales'], ['--locales', 'de,de'], ['--locales', 'de,xx'], ['--locales', ''], ['--unknown']]) {
    assert.throws(() => parseSyncOptions(['approved', ...flags]));
  }
});

const ROOT = resolve(import.meta.dirname, '..');
const read = path => readFileSync(join(ROOT, path), 'utf8').replaceAll('\r\n', '\n');
const hash = text => createHash('sha256').update(text).digest('hex');
const decode = text => text.replaceAll('&quot;', '"').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');
const markdownInline = html => decode(html
  .replace(/<a class="citation"[^>]*>(\[\d+\])<\/a>/g, '$1')
  .replace(/<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, '[$2]($1)')
  .replaceAll('<em>', '*').replaceAll('</em>', '*').replaceAll('<strong>', '**').replaceAll('</strong>', '**'));

// Reverse-render independently of the importer. Figure captions/credits have
// separate pins because they are website assets, not paragraphs in the source.
// The old planned teaser is tested against the real next article below.
export function reconstructEpisode11(html) {
  const content = html.slice(html.indexOf('<h1 class="history-title">'), html.indexOf('</article>'))
    .replace(/<figure\b[\s\S]*?<\/figure>/g, '')
    .replace(/<div class="history-next">[\s\S]*?<\/div>/g, '');
  const blocks = [];
  for (const [, tag, attributes, inner] of content.matchAll(/<(h[123]|p|li)\b([^>]*)>([\s\S]*?)<\/\1>/g)) {
    if (attributes.includes('history-meta')) continue;
    const text = markdownInline(inner);
    if (tag.startsWith('h')) blocks.push(`${'#'.repeat(Number(tag[1]))} ${text}`);
    else if (attributes.includes('history-subtitle')) blocks.push(`### ${text}`);
    else if (tag === 'li') blocks.push(`${attributes.match(/id="ref-(\d+)"/)[1]}. ${text}`);
    else blocks.push(text);
  }
  return blocks.join('\n\n');
}

// Normalized source-copy hashes exclude only editorial comments, separators
// and next-episode teaser text. No paragraph, citation or reference is omitted.
for (const [locale, sourceHash, figureHash] of [
  ['es', '4ab55ee9d0fdba103a67a0bde700dab450a6fa9a927ec4a014d05c1df37ae680', 'a46dc9cba005b67ad5e3c39204bd2106fd878bf4730bf902d4824ce315e58b34'],
  ['pt', '2182b36ca8a34fa44c5b5bbfd2e5cd6e03d10c4f9c58b7eb60ecbc01f4beef11', '950346669f82806a230a5950d24c04e6ed466b631a6c4182f6d32fbb45b752ef'],
  ['it', '97551113fe75dadaf598b83a9933824eeb83f72634b72cae1ab4a3dbef575cb8', '82c0195b86923c2a8a7654a65682e6b239940db3ea61229001d773a5d0e062f0'],
  ['ja', '7952c75ff12bb8dbcbfec3cab303bb01e59222f92a588f0266961aa3cbc80969', '213353e72b18620dc8ae8f29d041b4a0587d3100865328c017aeb1c751e63332'],
  ['id', '384375eb3cd7b5b1aa1fb30cdaa862025047df90627ef4f6c38c8df1ab49491b', 'bc81a8b0736f918252c89944f2c70a024c10368e3ab362b8c29be48547e11ab8'],
]) {
  test(`Episode 1.1 ${locale}: revised source fidelity, preserved figures and real next-episode navigation`, () => {
    const html = read(`${locale}/science/who-invented-alcohol.html`);
    assert.equal(hash(reconstructEpisode11(html)), sourceHash);
    const figures = [...html.matchAll(/<figure\b[\s\S]*?<\/figure>/g)].map(match => match[0]);
    assert.equal(figures.length, 4);
    assert.equal(hash(figures.join('\n')), figureHash);
    assert.equal((html.match(/<h2\b/g) || []).length, 5);
    const references = [...html.matchAll(/<li id="(ref-\d+)"/g)].map(match => match[1]);
    assert.deepEqual(references, Array.from({length: 15}, (_, i) => `ref-${i + 1}`));
    for (const [, id] of html.matchAll(/class="citation" href="#([^"]+)"/g)) assert.ok(references.includes(id));
    for (const language of ['en', 'fr', 'de', 'es', 'pt', 'it', 'ja', 'id']) {
      const prefix = language === 'en' ? '' : `${language}/`;
      assert.ok(html.includes(`href="/${prefix}science/who-invented-alcohol.html" class="language-option`));
    }
    const next = read(`${locale}/science/mesopotamia-beer-written-records.html`);
    const nextTitle = next.match(/<h1 class="history-title">([^<]+)<\/h1>/)[1];
    const nextLabel = next.match(/<p class="history-meta"><span>[^<]+<\/span><span>([^<]+)<\/span>/)[1];
    assert.ok(html.includes(`href="/${locale}/science/mesopotamia-beer-written-records.html" rel="next">${nextLabel} — ${nextTitle}</a>`));
  });
}

test('approved sources resolve uniquely without selecting the newest draft', () => {
  const directory = mkdtempSync(join(tmpdir(), 'mindrink-episode11-'));
  try {
    const file = 'Who Invented Alcohol.it.pipeline-polished-2026-10-12-v2.md';
    writeFileSync(join(directory, file), 'Approved');
    writeFileSync(join(directory, 'Who Invented Alcohol.it.pipeline-reviewed-2026-10-13.md'), 'Unapproved');
    writeFileSync(join(directory, 'Who Invented Alcohol.md'), 'Frozen English');
    assert.equal(sourceFileForEdition(directory, 'it', true), join(directory, file));
    assert.equal(sourceFileForEdition(directory, 'en', true), join(directory, 'Who Invented Alcohol.md'));
    assert.throws(() => sourceFileForEdition(directory, 'fr', true), /exactly one/);
    writeFileSync(join(directory, 'Who Invented Alcohol.it.pipeline-polished-2026-10-13.md'), 'Another candidate');
    assert.throws(() => sourceFileForEdition(directory, 'it', true), /exactly one/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('approved editorial markers never render and Italian next-episode prose stays linked', () => {
  const parsed = parseEpisode11(fixture(), 'it');
  assert.equal(parsed.title, 'A source-led article');
  assert.equal(parsed.deck, 'A deck.');
  assert.equal((parsed.body.match(/<h2\b/g) || []).length, 5);
  assert.equal((parsed.body.match(/<figure\b/g) || []).length, 4);
  assert.equal((parsed.body.match(/<li id="ref-/g) || []).length, 15);
  assert.doesNotMatch(parsed.body, /section:|&lt;!--|\*\*|Planned title/);
  assert.match(parsed.body, /<p>Prossimo episodio<\/p>/);
  assert.match(parsed.body, /href="\/it\/science\/mesopotamia-beer-written-records\.html" rel="next"/);
  assert.match(parsed.body, /href="#ref-14"/);
});

test('Episode 1.1 imports stop on unsupported markers, references, citations and next blocks', () => {
  for (const source of [
    fixture().replace('section:earliest-drinks', 'section:unknown'),
    fixture().replace('section:earliest-drinks', 'section:communal-life'),
    fixture().replace('[14][15]', '[14][99]'),
    fixture().replace('15. Reference 15.', '16. Reference 15.'),
    fixture().replace('Prossimo episodio: **Episodio 2 — Planned title**.', ''),
    fixture().replace('## Ingredients', '### Ingredients'),
  ]) assert.throws(() => parseEpisode11(source, 'it'));
});
