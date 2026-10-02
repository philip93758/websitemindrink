import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { auditSite, readSite, LOCALES, ORIGIN, PUBLIC_DIRECTORIES, PUBLIC_ROOT_FILES, OMITTED_SCRIPTS } from '../tools/check-site-seo.js';

const route = locale => `${ORIGIN}/${locale === 'en' ? '' : `${locale}/`}guide.html`;
const path = locale => `${locale === 'en' ? '' : `${locale}/`}guide.html`;
const alternateTags = (tag = 'link') => [...LOCALES, 'x-default'].map(locale =>
  `<${tag} href='${route(locale === 'x-default' ? 'en' : locale)}' hreflang='${locale}' rel='alternate'/>`).join('\n');
const xmlBlock = locale => `<url><loc>${route(locale)}</loc>${alternateTags('xhtml:link')}</url>`;
function fixture() {
  const pages = new Map(LOCALES.map(locale => [path(locale), `<!doctype html><html lang="${locale}"><head>
    <title>Guide ${locale}</title><meta content='A useful description' name='description'>
    <link href='${route(locale)}' rel='canonical'>${alternateTags()}
    </head><body><h1>Guide</h1><p id='résumé'>Summary</p><a href='#r%C3%A9sum%C3%A9'>Jump</a>
    <a href='${route('en')}?source=guide&amp;lang=${locale}#r%C3%A9sum%C3%A9'>English</a>
    <a href='/assets/guide.pdf'>Download</a><a href='mailto:hello@example.com'>Contact</a>
    <a href='https://example.com/unavailable'>External: deliberately not fetched</a></body></html>`]));
  return { pages, files: new Set([...pages.keys(), 'assets/guide.pdf']), sitemap: `<urlset>${LOCALES.map(xmlBlock).join('')}</urlset>` };
}
const change = (site, from, to, locale = 'en') => site.pages.set(path(locale), site.pages.get(path(locale)).replace(from, to));
const has = (site, code) => assert.ok(auditSite(site).errors.some(error => error.code === code), `Expected ${code}`);

test('valid multilingual pages accept reordered attributes, encoded fragments, queries and public downloads', () => {
  const result = auditSite(fixture());
  assert.deepEqual(result.errors, []);
  assert.equal(result.pageCount, 8);
  assert.equal(result.linkCount, 24);
  assert.equal(result.fragmentCount, 16);
});

test('comments and raw script/style content cannot masquerade as metadata, links or IDs', () => {
  const site = fixture();
  change(site, '<head>', `<head><!-- <title>Fake</title><a href='/broken.html'> -->
    <script>const html = '<title>Fake</title><a href="/broken.html">';</script>
    <style>.sample::after { content: '<a href="/broken.html">'; }</style>`);
  assert.deepEqual(auditSite(site).errors, []);
  change(site, "<p id='résumé'>Summary</p>", "<!-- <p id='résumé'>Summary</p> -->");
  has(site, 'link-fragment');
});

for (const [name, from, to, code] of [
  ['missing title', '<title>Guide en</title>', '', 'metadata-title'],
  ['empty title', 'Guide en</title>', ' </title>', 'metadata-title'],
  ['duplicate title', '<title>Guide en</title>', '<title>One</title><title>Two</title>', 'metadata-title'],
  ['missing description', "<meta content='A useful description' name='description'>", '', 'metadata-description'],
  ['empty description', "content='A useful description'", "content=''", 'metadata-description'],
  ['duplicate description', "name='description'>", "name='description'><meta name='description' content='Duplicate'>", 'metadata-description'],
  ['missing H1', '<h1>Guide</h1>', '', 'metadata-h1'],
  ['empty H1', '<h1>Guide</h1>', '<h1> &nbsp; </h1>', 'metadata-h1'],
  ['duplicate H1', '<h1>Guide</h1>', '<h1>One</h1><h1>Two</h1>', 'metadata-h1'],
  ['missing canonical', `href='${route('en')}' rel='canonical'`, "rel='alternate'", 'canonical'],
  ['duplicate canonical', '</head>', `<link href='${route('en')}' rel='canonical'></head>`, 'canonical'],
  ['wrong canonical', `href='${route('en')}' rel='canonical'`, `href='${route('de')}' rel='canonical'`, 'canonical'],
  ['wrong document language', '<html lang="en">', '<html lang="fr">', 'html-lang'],
  ['noindex', '<head>', '<head><meta name="robots" content="noindex,follow">', 'noindex'],
  ['base changes URL resolution', '<head>', '<head><base href="/other/">', 'base-url'],
  ['wrong social URL', '<head>', '<head><meta property="og:url" content="https://mindrink.me/wrong.html">', 'social-url'],
]) {
  test(`SEO gate rejects ${name}`, () => { const site = fixture(); change(site, from, to); has(site, code); });
}

test('duplicate canonicals are reported independently of route mismatch', () => {
  const site = fixture();
  change(site, `href='${route('de')}' rel='canonical'`, `href='${route('en')}' rel='canonical'`, 'de');
  has(site, 'canonical-duplicate');
});

test('language alternatives require all locales, valid targets, correct languages and return links', () => {
  const site = fixture();
  change(site, `href='${route('fr')}' hreflang='fr'`, "href='https://mindrink.me/missing.html' hreflang='fr'");
  has(site, 'hreflang-target');
  const wrongLanguage = fixture();
  change(wrongLanguage, `href='${route('fr')}' hreflang='fr'`, `href='${route('de')}' hreflang='fr'`);
  has(wrongLanguage, 'hreflang-language');
  const missingReturn = fixture();
  change(missingReturn, `href='${route('en')}' hreflang='en'`, `href='${route('fr')}' hreflang='en'`, 'fr');
  has(missingReturn, 'hreflang-reciprocal');
  has(missingReturn, 'hreflang-cluster');
  const missing = fixture();
  change(missing, `hreflang='ja'`, '');
  has(missing, 'hreflang-target');
});

test('duplicate and unsupported hreflang plus incorrect x-default fail', () => {
  const duplicate = fixture(); change(duplicate, '</head>', `<link rel='alternate' hreflang='en' href='${route('en')}'></head>`); has(duplicate, 'hreflang-duplicate');
  const unsupported = fixture(); change(unsupported, "hreflang='fr'", "hreflang='xx'"); has(unsupported, 'hreflang-locale');
  const wrongDefault = fixture(); change(wrongDefault, `href='${route('en')}' hreflang='x-default'`, `href='${route('fr')}' hreflang='x-default'`); has(wrongDefault, 'hreflang-default');
});

test('internal links must target published files, not just an existing private file', () => {
  const site = fixture();
  change(site, '</body>', `<a href='/docs/private.html'>Not published</a><a href='missing.html'>Relative broken link</a></body>`);
  has(site, 'link-target');
  const badOrigin = fixture(); change(badOrigin, "href='/assets/guide.pdf'", "href='http://mindrink.me/assets/guide.pdf'"); has(badOrigin, 'link-origin');
});

test('cross-page missing fragments and invalid percent encoding fail without crashing', () => {
  const missing = fixture(); change(missing, "href='#r%C3%A9sum%C3%A9'", "href='fr/guide.html#absent'"); has(missing, 'link-fragment');
  const encoded = fixture(); change(encoded, "href='#r%C3%A9sum%C3%A9'", "href='#%ZZ'"); has(encoded, 'link-fragment');
  const badPath = fixture(); change(badPath, "href='/assets/guide.pdf'", "href='/assets/%ZZ.pdf'"); has(badPath, 'link-url');
});

test('quoted greater-than, legacy named anchors and browser text fragments are supported', () => {
  const site = fixture();
  change(site, '</body>', `<a name='old'></a><a title='2 > 1' href='#old'>Old</a><a href='#:~:text=Summary'>Text</a></body>`);
  assert.deepEqual(auditSite(site).errors, []);
});

test('sitemap must exactly cover published canonicals once with matching alternates', () => {
  const missing = fixture(); missing.sitemap = missing.sitemap.replace(xmlBlock('fr'), ''); has(missing, 'sitemap-missing');
  const duplicate = fixture(); duplicate.sitemap = duplicate.sitemap.replace('</urlset>', `${xmlBlock('en')}</urlset>`); has(duplicate, 'sitemap-duplicate');
  const extra = fixture(); extra.sitemap = extra.sitemap.replace('</urlset>', '<url><loc>https://mindrink.me/absent.html</loc></url></urlset>'); has(extra, 'sitemap-target');
  const alternates = fixture(); alternates.sitemap = alternates.sitemap.replace("hreflang='fr'", "hreflang='xx'"); has(alternates, 'sitemap-alternates');
  const malformed = fixture(); malformed.sitemap = '<urlset><url>'; has(malformed, 'sitemap-format');
  const unclosed = fixture(); unclosed.sitemap = unclosed.sitemap.replace('</urlset>', ''); has(unclosed, 'sitemap-format');
});

test('CLI exits unsuccessfully on audit errors and rejects unsupported arguments', () => {
  const moduleUrl = new URL('../tools/check-site-seo.js', import.meta.url);
  const failure = spawnSync(process.execPath, ['--input-type=module', '-e',
    `import { main } from ${JSON.stringify(moduleUrl.href)}; main([], {pages: new Map(), sitemap: '<urlset/>'});`], { encoding: 'utf8' });
  assert.equal(failure.error, undefined);
  assert.equal(failure.status, 1);
  assert.match(failure.stderr, /SEO check failed/);
  assert.match(failure.stderr, /empty-site/);
  const invalidArgument = spawnSync(process.execPath, [fileURLToPath(moduleUrl), '--skip-errors'], { encoding: 'utf8' });
  assert.equal(invalidArgument.status, 1);
  assert.match(invalidArgument.stderr, /Usage:/);
});

test('CLI exits successfully for the published source inventory', () => {
  const result = spawnSync(process.execPath, [fileURLToPath(new URL('../tools/check-site-seo.js', import.meta.url))], { encoding: 'utf8' });
  assert.equal(result.error, undefined);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /SEO check passed: \d+ pages/);
});

test('all current public website pages pass the same offline SEO gate', () => {
  const result = auditSite(readSite());
  assert.ok(result.pageCount > 0);
  assert.deepEqual(result.errors, [], result.errors.map(error => `${error.file} [${error.code}] ${error.message}`).join('\n'));
});

test('checker inventory and build gate stay aligned with the production workflow', () => {
  const workflow = readFileSync(new URL('../.github/workflows/deploy-pages.yml', import.meta.url), 'utf8');
  assert.deepEqual(workflow.match(/cp -R ([^\n]+) _site\//)[1].trim().split(/\s+/).sort(), [...PUBLIC_DIRECTORIES].sort());
  assert.deepEqual(workflow.match(/cp \.\/\*\.html ([^\n]+) _site\//)[1].trim().split(/\s+/).sort(), [...PUBLIC_ROOT_FILES].sort());
  assert.deepEqual([...workflow.matchAll(/rm -f _site\/(\S+)/g)].map(match => match[1]).sort(), [...OMITTED_SCRIPTS].sort());
  assert.ok(!PUBLIC_DIRECTORIES.includes('tools'));
  assert.match(workflow, /npm run build/);
  assert.match(workflow, /needs: build/);
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.ok(pkg.scripts.build.split(/\s*&&\s*/).includes('npm run seo:check'));
  assert.equal(pkg.scripts['seo:check'], 'node tools/check-site-seo.js');
});
