import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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
  for (const flags of [['--locales'], ['--locales', 'de,de'], ['--locales', 'de,xx'], ['--locales', ''], ['--unknown']]) {
    assert.throws(() => parseSyncOptions(['approved', ...flags]));
  }
});

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
