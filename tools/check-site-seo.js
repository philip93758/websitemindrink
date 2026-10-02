import { readdirSync, readFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const ORIGIN = 'https://mindrink.me';
export const LOCALES = ['en', 'de', 'fr', 'es', 'pt', 'it', 'ja', 'id'];
// Match the public artifact staged in deploy-pages.yml, not private authoring files.
// A regression test guards this list against changes to that workflow.
export const PUBLIC_DIRECTORIES = [
  'alcohol-unit-calculator', 'assets', 'blog', 'de', 'discover', 'es', 'fr',
  'id', 'it', 'ja', 'pt', 'science', 'scripts', 'shared',
];
export const PUBLIC_ROOT_FILES = ['CNAME', 'robots.txt', 'site.webmanifest', 'sitemap.xml', 'styles.css'];
export const OMITTED_SCRIPTS = new Set([
  'scripts/build-analytics-assets.js', 'scripts/update-analytics-loaders.js',
  'scripts/update-sitemap-lastmod.js',
]);

export function readSite(root = ROOT) {
  const files = new Set();
  const walk = directory => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const full = resolve(directory, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile()) files.add(relative(root, full).replaceAll('\\', '/'));
    }
  };
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (entry.isDirectory() && PUBLIC_DIRECTORIES.includes(entry.name)) walk(resolve(root, entry.name));
    else if (entry.isFile() && (entry.name.endsWith('.html') || PUBLIC_ROOT_FILES.includes(entry.name))) files.add(entry.name);
  }
  for (const file of OMITTED_SCRIPTS) files.delete(file);
  const pages = new Map([...files].filter(file => file.endsWith('.html')).sort()
    .map(file => [file, readFileSync(resolve(root, file), 'utf8')]));
  return { files, pages, sitemap: readFileSync(resolve(root, 'sitemap.xml'), 'utf8') };
}

function decode(text) {
  const entities = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' };
  return text.replace(/&(#x[0-9a-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (original, entity) => {
    if (!entity.startsWith('#')) return entities[entity.toLowerCase()];
    const number = /^#x/i.test(entity) ? parseInt(entity.slice(2), 16) : Number(entity.slice(1));
    return number > 0 && number <= 0x10ffff ? String.fromCodePoint(number) : original;
  });
}

// A bounded scanner for this static site's authored HTML/XML, not a browser DOM.
// Ignore commented/raw-text markup; attribute order, quotes and embedded > vary.
function activeMarkup(html) {
  return html.replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '');
}

function tags(markup) {
  return [...markup.matchAll(/<([a-z][\w:-]*)\b((?:"[^"]*"|'[^']*'|[^'">])*)>/gi)].map(match => {
    const attrs = {};
    for (const attr of match[2].matchAll(/([^\s=/'"<>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s'"=<>`]+)))?/g)) {
      attrs[attr[1].toLowerCase()] = decode(attr[2] ?? attr[3] ?? attr[4] ?? '');
    }
    return { name: match[1].toLowerCase(), attrs };
  });
}

function textContent(markup) {
  return decode(markup.replace(/<[^>]*>/g, '')).trim();
}

function hasRel(tag, value) {
  return (tag.attrs.rel || '').toLowerCase().split(/\s+/).includes(value);
}

function urlForPath(path) {
  return `${ORIGIN}/${path.replace(/(^|\/)index\.html$/, '$1')}`;
}

function pathForUrl(url) {
  const path = decodeURIComponent(url.pathname).replace(/^\//, '');
  return path.endsWith('/') || !path ? `${path}index.html` : path;
}

export function auditSite({ pages, files = new Set(pages.keys()), sitemap }) {
  const errors = [];
  const fail = (file, code, message) => errors.push({ file, code, message });
  const records = new Map();
  const canonicalOwners = new Map();
  let linkCount = 0, fragmentCount = 0;
  if (!pages.size) fail('site', 'empty-site', 'No public HTML pages found.');

  const alternates = (items, file) => {
    const result = new Map();
    for (const tag of items.filter(tag => ['link', 'xhtml:link'].includes(tag.name) && hasRel(tag, 'alternate') && 'hreflang' in tag.attrs)) {
      const locale = tag.attrs.hreflang.toLowerCase();
      if (result.has(locale)) fail(file, 'hreflang-duplicate', `Duplicate alternate ${locale}.`);
      if (![...LOCALES, 'x-default'].includes(locale)) fail(file, 'hreflang-locale', `Unsupported alternate ${locale}.`);
      result.set(locale, tag.attrs.href || '');
    }
    return result;
  };

  for (const [file, html] of pages) {
    const markup = activeMarkup(html);
    const head = markup.match(/<head\b[^>]*>([\s\S]*?)<\/head\s*>/i)?.[1] || '';
    const headTags = tags(head), allTags = tags(markup);
    const expectedUrl = urlForPath(file);
    const locale = LOCALES.slice(1).includes(file.split('/')[0]) ? file.split('/')[0] : 'en';
    const htmlTags = allTags.filter(tag => tag.name === 'html');
    if (htmlTags.length !== 1 || htmlTags[0].attrs.lang !== locale) fail(file, 'html-lang', `Expected html lang="${locale}".`);
    for (const [tag, content] of [['title', head], ['h1', markup]]) {
      const elements = [...content.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}\\s*>`, 'gi'))];
      if (elements.length !== 1 || !textContent(elements[0][1])) fail(file, `metadata-${tag}`, `Expected exactly one non-empty ${tag}.`);
    }
    const descriptions = headTags.filter(tag => tag.name === 'meta' && tag.attrs.name?.toLowerCase() === 'description');
    if (descriptions.length !== 1 || !descriptions[0].attrs.content?.trim()) fail(file, 'metadata-description', 'Expected exactly one non-empty meta description.');
    const robots = headTags.filter(tag => tag.name === 'meta' && ['robots', 'googlebot'].includes(tag.attrs.name?.toLowerCase()));
    if (robots.some(tag => /\b(noindex|none)\b/i.test(tag.attrs.content || ''))) fail(file, 'noindex', 'Public sitemap page must not be noindex.');
    if (headTags.some(tag => tag.name === 'base')) fail(file, 'base-url', 'Base URLs are not supported by the static route contract.');
    const canonicals = headTags.filter(tag => tag.name === 'link' && hasRel(tag, 'canonical'));
    if (canonicals.length !== 1 || canonicals[0].attrs.href !== expectedUrl) fail(file, 'canonical', `Expected one self-canonical: ${expectedUrl}`);
    for (const tag of canonicals) {
      const canonical = tag.attrs.href;
      if (canonicalOwners.has(canonical)) fail(file, 'canonical-duplicate', `Canonical also used by ${canonicalOwners.get(canonical)}.`);
      canonicalOwners.set(canonical, file);
    }
    const socialUrls = headTags.filter(tag => tag.name === 'meta' && tag.attrs.property === 'og:url');
    if (socialUrls.some(tag => tag.attrs.content !== expectedUrl)) fail(file, 'social-url', 'Open Graph URL differs from the canonical route.');
    records.set(expectedUrl, {
      file, locale, url: expectedUrl, alternates: alternates(headTags, file),
      ids: new Set(allTags.flatMap(tag => [tag.attrs.id, tag.name === 'a' ? tag.attrs.name : null]).filter(Boolean)),
      anchors: allTags.filter(tag => tag.name === 'a' && 'href' in tag.attrs).map(tag => tag.attrs.href),
    });
  }

  for (const page of records.values()) {
    for (const locale of [...LOCALES, 'x-default']) {
      const href = page.alternates.get(locale);
      const target = records.get(href);
      if (!href || !target) {
        fail(page.file, 'hreflang-target', `${locale} must point to a published canonical page (${href || 'missing'}).`);
        continue;
      }
      if (target.locale !== (locale === 'x-default' ? 'en' : locale)) fail(page.file, 'hreflang-language', `${locale} points to a page in ${target.locale}.`);
      if (locale === page.locale && href !== page.url) fail(page.file, 'hreflang-self', 'Language alternate must include this page itself.');
      if (locale === 'x-default' && href !== page.alternates.get('en')) fail(page.file, 'hreflang-default', 'x-default must match the English member of this page family.');
      if (target.alternates.get(page.locale) !== page.url) fail(page.file, 'hreflang-reciprocal', `${locale} does not link back to this language version.`);
      if (JSON.stringify([...target.alternates].sort()) !== JSON.stringify([...page.alternates].sort())) fail(page.file, 'hreflang-cluster', `${locale} has a different alternate-language set.`);
    }
    for (const href of page.anchors) {
      let url;
      try { url = new URL(href, page.url); } catch { fail(page.file, 'link-url', `Invalid link: ${href}`); continue; }
      if (!['http:', 'https:'].includes(url.protocol)) continue;
      if (![new URL(ORIGIN).hostname, `www.${new URL(ORIGIN).hostname}`].includes(url.hostname)) continue;
      linkCount++;
      if (url.origin !== ORIGIN) fail(page.file, 'link-origin', `Internal link uses a non-canonical origin: ${href}`);
      let targetPath;
      try { targetPath = pathForUrl(url); } catch { fail(page.file, 'link-url', `Invalid encoded path: ${href}`); continue; }
      if (!files.has(targetPath)) {
        fail(page.file, 'link-target', `No deployed file for ${href} (${targetPath}).`);
        continue;
      }
      const target = records.get(urlForPath(targetPath));
      // Text fragments are browser directives, not element IDs.
      const fragment = url.hash.slice(1).split(':~:text=')[0];
      if (target && fragment) {
        fragmentCount++;
        let id;
        try { id = decodeURIComponent(fragment); } catch { fail(page.file, 'link-fragment', `Invalid encoded fragment: ${href}`); continue; }
        if (!target.ids.has(id)) fail(page.file, 'link-fragment', `Missing fragment ${href} in ${target.file}.`);
      }
    }
  }

  const xml = sitemap.replace(/<!--[\s\S]*?-->/g, '');
  const blocks = [...xml.matchAll(/<url\b[^>]*>([\s\S]*?)<\/url\s*>/g)];
  if ((xml.match(/<urlset\b/g) || []).length !== 1 || !/<\/urlset\s*>\s*$/.test(xml) || !blocks.length || blocks.length !== (xml.match(/<url\b/g) || []).length) fail('sitemap.xml', 'sitemap-format', 'Expected a non-empty complete urlset.');
  const locations = new Set();
  for (const [, block] of blocks) {
    const locs = [...block.matchAll(/<loc\b[^>]*>([^<]*)<\/loc\s*>/g)];
    if (locs.length !== 1) { fail('sitemap.xml', 'sitemap-loc', 'Each URL must have exactly one loc.'); continue; }
    const loc = decode(locs[0][1].trim());
    if (locations.has(loc)) fail('sitemap.xml', 'sitemap-duplicate', `Duplicate URL: ${loc}`);
    locations.add(loc);
    const page = records.get(loc);
    if (!page) { fail('sitemap.xml', 'sitemap-target', `Not a published canonical page: ${loc}`); continue; }
    const translated = alternates(tags(block), `sitemap.xml (${loc})`);
    if (JSON.stringify([...translated].sort()) !== JSON.stringify([...page.alternates].sort())) fail('sitemap.xml', 'sitemap-alternates', `Alternates differ from HTML for ${loc}.`);
  }
  for (const page of records.values()) {
    if (!locations.has(page.url)) fail(page.file, 'sitemap-missing', 'Published page is missing from sitemap.xml.');
  }
  return { errors, pageCount: pages.size, linkCount, fragmentCount };
}

export function main(args = process.argv.slice(2), site = null) {
  if (args.length) throw new Error('Usage: node tools/check-site-seo.js (no arguments)');
  const result = auditSite(site ?? readSite());
  if (result.errors.length) {
    console.error(`SEO check failed: ${result.errors.length} issue(s).`);
    for (const error of result.errors.slice(0, 80)) console.error(`  ${error.file} [${error.code}]: ${error.message}`);
    if (result.errors.length > 80) console.error('  Further issues omitted; fix the reported issues and rerun.');
    process.exitCode = 1;
  } else {
    console.log(`SEO check passed: ${result.pageCount} pages, ${result.linkCount} internal links, ${result.fragmentCount} fragment links; metadata, canonicals, hreflang and sitemap coverage verified.`);
  }
  return result;
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) main();
