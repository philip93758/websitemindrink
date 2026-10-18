import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { applyScienceSearchMetadata, escapeMetadata, SCIENCE_SEARCH_METADATA, SCIENCE_SEARCH_ROUTES } from '../scripts/science-search-metadata.js';

const ROOT = resolve(import.meta.dirname, '..');
const read = path => readFileSync(resolve(ROOT, path), 'utf8');

for (const locale of Object.keys(SCIENCE_SEARCH_METADATA.hub)) {
  test(`${locale}: all three science-page families retain their intended search/social metadata`, () => {
    for (const [family, route] of Object.entries(SCIENCE_SEARCH_ROUTES)) {
      const html = read(`${locale === 'en' ? '' : locale + '/'}${route}`);
      const copy = SCIENCE_SEARCH_METADATA[family][locale];
      assert.equal(applyScienceSearchMetadata(html, locale, family), html, `${family} metadata must be a no-op`);
      assert.ok(html.includes(`<title>${escapeMetadata(copy.title)}</title>`));
      const socialTitle = escapeMetadata(copy.title.replace(/ \| Mindrink$/, ''));
      assert.ok(html.includes(`<meta property="og:title" content="${socialTitle}">`));
      assert.ok(html.includes(`<meta name="twitter:title" content="${socialTitle}">`));
      for (const key of ['description', 'og:description', 'twitter:description']) {
        const attribute = key === 'og:description' ? 'property' : 'name';
        assert.ok(html.includes(`<meta ${attribute}="${key}" content="${escapeMetadata(copy.description)}">`));
      }
      if (family === 'episode12') {
        const headline = html.match(/<h1 class="history-title">([^<]+)<\/h1>/)[1];
        assert.ok(headline && !copy.title.startsWith(headline), 'editorial H1 is not replaced by the compact search title');
      }
    }
  });
}

function fixture() {
  return ['<!DOCTYPE html><html lang="en"><head>', '<title>Old search title</title>',
    '<meta name="description" content="Old description">', '<meta property="og:title" content="Old social title">',
    '<meta property="og:description" content="Old description">', '<meta name="twitter:title" content="Old social title">',
    '<meta name="twitter:description" content="Old description">',
    '<link rel="canonical" href="https://mindrink.me/science/">', '<meta property="article:modified_time" content="2026-09-20T00:00:00Z">',
    '<script type="application/ld+json">{"@type":"Article","headline":"Editorial title","description":"Editorial summary","datePublished":"2026-08-29","dateModified":"2026-09-20"}</script>',
    '</head><body><h1>Editorial title</h1><p>Approved article text.</p>',
    '<template><title>Body title</title><meta name="description" content="Body metadata decoy"></template>', '</body></html>'].join('\r\n');
}

test('science metadata editing preserves the entire body, JSON-LD, article dates and unrelated head markup', () => {
  const original = fixture();
  const updated = applyScienceSearchMetadata(original, 'en', 'hub');
  const mask = html => html.replace(/<head>[\s\S]*?<\/head>/, head => head.replace(/<title>[^<]*<\/title>/, 'TITLE').replace(/<meta (?:name|property)="(?:description|og:title|og:description|twitter:title|twitter:description)" content="[^"]*">/g, 'SEARCH_META'));
  assert.equal(mask(updated), mask(original));
  assert.equal(updated.slice(updated.indexOf('</head>')), original.slice(original.indexOf('</head>')));
  assert.equal(updated.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/)[0], original.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/)[0]);
  assert.equal(updated.split('\r\n').length, original.split('\r\n').length);
  assert.equal(applyScienceSearchMetadata(updated, 'en', 'hub'), updated);
  assert.match(updated, /Methods &amp; Sources/);
});

test('science metadata editor rejects missing/ambiguous tags and unknown editions', () => {
  assert.throws(() => applyScienceSearchMetadata(fixture(), 'xx', 'hub'));
  assert.throws(() => applyScienceSearchMetadata(fixture(), 'en', 'unknown'));
  for (const source of [
    fixture().replace('<head>', '<not-head>'),
    fixture().replace('<title>Old search title</title>', ''),
    fixture().replace('<title>Old search title</title>', '<title>One</title><title>Two</title>'),
    fixture().replace('<meta name="description" content="Old description">', ''),
    fixture().replace('<meta name="description" content="Old description">', '<meta name="description" content="One"><meta name="description" content="Two">'),
  ]) assert.throws(() => applyScienceSearchMetadata(source, 'en', 'hub'));
});

test('metadata CLI checks all 24 pages read-only and rejects accidental arguments', () => {
  const script = resolve(ROOT, 'scripts/update-science-search-metadata.js');
  const check = spawnSync(process.execPath, [script, '--check'], { cwd: ROOT, encoding: 'utf8' });
  assert.equal(check.status, 0, check.stderr);
  assert.match(check.stdout, /all 24 science pages/);
  const invalid = spawnSync(process.execPath, [script, '--unknown'], { cwd: ROOT, encoding: 'utf8' });
  assert.notEqual(invalid.status, 0);
});
