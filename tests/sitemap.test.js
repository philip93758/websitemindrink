import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  buildExpectedSitemap,
  SITEMAP_PATH,
  sitemapUrlToFile,
  sourcesForPage,
  significantPathsFromDiff,
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

  assert.equal(entries.length, 200);
  assert.deepEqual(
    changes,
    [],
    'Run npm run sitemap:update before committing significant page changes',
  );
  assert.equal(output, sitemapText);
});

test('analytics loader cache changes alone are not significant sitemap modifications', () => {
  const diff = [
    'diff --git a/index.html b/index.html', '--- a/index.html', '+++ b/index.html', '@@ -1 +1 @@',
    '-    <script type="module" src="/scripts/analytics.js?v=old"></script>',
    '+    <script type="module" src="/scripts/analytics.js?v=new"></script>',
  ].join('\n');
  assert.deepEqual([...significantPathsFromDiff(diff)], []);
  assert.deepEqual([...significantPathsFromDiff(diff + '\n-<p>Old copy</p>\n+<p>New copy</p>')], ['index.html']);
  assert.deepEqual([...significantPathsFromDiff('diff --git a/scripts/alcohol-unit-calculator.js b/scripts/alcohol-unit-calculator.js\n+const changed = true;')], ['scripts/alcohol-unit-calculator.js']);
});
