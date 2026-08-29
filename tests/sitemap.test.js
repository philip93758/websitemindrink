import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  buildExpectedSitemap,
  SITEMAP_PATH,
  sitemapUrlToFile,
  sourcesForPage,
} from '../scripts/update-sitemap-lastmod.js';


test('maps canonical sitemap URLs to local HTML files', () => {
  assert.equal(sitemapUrlToFile('https://mindrink.me/'), 'index.html');
  assert.equal(sitemapUrlToFile('https://mindrink.me/de/'), 'de/index.html');
  assert.equal(
    sitemapUrlToFile('https://mindrink.me/blog/best-alcohol-tracking-apps.html'),
    'blog/best-alcohol-tracking-apps.html',
  );
});

test('tracks shared calculator logic as a significant page dependency', () => {
  const sources = sourcesForPage('fr/alcohol-unit-calculator/index.html');

  assert.deepEqual(sources, [
    'fr/alcohol-unit-calculator/index.html',
    'scripts/alcohol-unit-calculator.js',
    'shared/alcohol/constants.js',
    'shared/alcohol/drinks.js',
    'shared/alcohol/formulas.js',
  ]);
});

test('keeps sitemap lastmod values synchronized with page sources', () => {
  const sitemapText = readFileSync(SITEMAP_PATH, 'utf8');
  const { changes, entries, output } = buildExpectedSitemap(sitemapText);

  assert.equal(entries.length, 186);
  assert.deepEqual(
    changes,
    [],
    'Run npm run sitemap:update before committing significant page changes',
  );
  assert.equal(output, sitemapText);
});
