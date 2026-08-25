import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
export const ROOT_DIR = resolve(SCRIPT_DIR, '..');
export const SITEMAP_PATH = resolve(ROOT_DIR, 'sitemap.xml');

const SITE_ORIGIN = 'https://mindrink.me';
const CALCULATOR_PAGE_SUFFIX = 'alcohol-unit-calculator/index.html';
const CALCULATOR_DEPENDENCIES = [
  'scripts/alcohol-unit-calculator.js',
  'shared/alcohol/constants.js',
  'shared/alcohol/drinks.js',
  'shared/alcohol/formulas.js',
];

function normalizePath(path) {
  return path.replaceAll('\\', '/');
}

function localDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function runGit(args) {
  return execFileSync('git', args, {
    cwd: ROOT_DIR,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });
}

export function sitemapUrlToFile(urlValue) {
  const url = new URL(urlValue);

  if (url.origin !== SITE_ORIGIN || url.search || url.hash) {
    throw new Error(`Unsupported sitemap URL: ${urlValue}`);
  }

  let pagePath = decodeURIComponent(url.pathname).replace(/^\/+/, '');

  if (url.pathname.endsWith('/')) {
    pagePath += 'index.html';
  }

  if (!pagePath.endsWith('.html')) {
    throw new Error(`Cannot map sitemap URL to an HTML file: ${urlValue}`);
  }

  pagePath = normalizePath(pagePath);
  const absolutePath = resolve(ROOT_DIR, ...pagePath.split('/'));
  const relativePath = normalizePath(relative(ROOT_DIR, absolutePath));

  if (
    relativePath === '..'
    || relativePath.startsWith(`..${sep}`)
    || !existsSync(absolutePath)
  ) {
    throw new Error(`Sitemap URL has no local HTML source: ${urlValue}`);
  }

  return relativePath;
}

export function sourcesForPage(pagePath) {
  const sources = [pagePath];

  if (pagePath.endsWith(CALCULATOR_PAGE_SUFFIX)) {
    sources.push(...CALCULATOR_DEPENDENCIES);
  }

  return sources;
}

function dirtyPaths(sourcePaths) {
  const wanted = new Set(sourcePaths);
  const modified = runGit([
    'diff',
    '--name-only',
    '--ignore-space-at-eol',
    'HEAD',
    '--',
  ]);
  const untracked = runGit([
    'ls-files',
    '--others',
    '--exclude-standard',
  ]);

  return new Set(
    `${modified}\n${untracked}`
      .split(/\r?\n/)
      .map((path) => normalizePath(path.trim()))
      .filter((path) => path && wanted.has(path)),
  );
}

function committedDates(sourcePaths) {
  const output = runGit([
    'log',
    '--format=@@DATE:%cs',
    '--name-only',
    '--no-renames',
  ]);
  const wanted = new Set(sourcePaths);
  const dates = new Map();
  let commitDate;

  for (const rawLine of output.split(/\r?\n/)) {
    const line = normalizePath(rawLine.trim());

    if (line.startsWith('@@DATE:')) {
      commitDate = line.slice('@@DATE:'.length);
    } else if (line && commitDate && wanted.has(line) && !dates.has(line)) {
      dates.set(line, commitDate);
    }
  }

  return dates;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function buildExpectedSitemap(
  sitemapText,
  { today = localDate() } = {},
) {
  const urlBlocks = [...sitemapText.matchAll(/<url>[\s\S]*?<\/url>/g)];

  if (urlBlocks.length === 0) {
    throw new Error('No <url> entries found in sitemap.xml');
  }

  const entries = urlBlocks.map((match) => {
    const locMatch = match[0].match(/<loc>([^<]+)<\/loc>/);
    const lastmodMatch = match[0].match(/<lastmod>([^<]+)<\/lastmod>/);

    if (!locMatch || !lastmodMatch) {
      throw new Error('Each sitemap entry must contain one <loc> and <lastmod>');
    }

    const loc = locMatch[1];
    const pagePath = sitemapUrlToFile(loc);

    return {
      block: match[0],
      currentDate: lastmodMatch[1],
      index: match.index,
      loc,
      pagePath,
      sourcePaths: sourcesForPage(pagePath),
    };
  });
  const uniqueLocations = new Set(entries.map((entry) => entry.loc));

  if (uniqueLocations.size !== entries.length) {
    throw new Error('Duplicate <loc> entries found in sitemap.xml');
  }

  const sourcePaths = [...new Set(entries.flatMap((entry) => entry.sourcePaths))];
  const dirty = dirtyPaths(sourcePaths);
  const history = committedDates(sourcePaths);
  const sourceDates = new Map();

  for (const sourcePath of sourcePaths) {
    if (dirty.has(sourcePath)) {
      sourceDates.set(sourcePath, today);
    } else if (history.has(sourcePath)) {
      sourceDates.set(sourcePath, history.get(sourcePath));
    } else {
      throw new Error(`No Git history found for sitemap source: ${sourcePath}`);
    }
  }

  const changes = [];
  let output = sitemapText;
  let offset = 0;

  for (const entry of entries) {
    const expectedDate = entry.sourcePaths
      .map((sourcePath) => sourceDates.get(sourcePath))
      .sort()
      .at(-1);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(expectedDate) || expectedDate > today) {
      throw new Error(`Invalid lastmod date for ${entry.loc}: ${expectedDate}`);
    }

    if (entry.currentDate !== expectedDate) {
      const nextBlock = entry.block.replace(
        new RegExp(`<lastmod>${escapeRegExp(entry.currentDate)}</lastmod>`),
        `<lastmod>${expectedDate}</lastmod>`,
      );
      const start = entry.index + offset;
      output = `${output.slice(0, start)}${nextBlock}${output.slice(start + entry.block.length)}`;
      offset += nextBlock.length - entry.block.length;
      changes.push({
        from: entry.currentDate,
        loc: entry.loc,
        pagePath: entry.pagePath,
        to: expectedDate,
      });
    }
  }

  return { changes, entries, output };
}

function printUsage() {
  console.log('Usage: node scripts/update-sitemap-lastmod.js [--check]');
}

function main() {
  const args = new Set(process.argv.slice(2));

  if (args.has('--help')) {
    printUsage();
    return;
  }

  for (const arg of args) {
    if (arg !== '--check') {
      printUsage();
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  const sitemapText = readFileSync(SITEMAP_PATH, 'utf8');
  const { changes, entries, output } = buildExpectedSitemap(sitemapText);

  if (args.has('--check')) {
    if (changes.length > 0) {
      const sample = changes
        .slice(0, 10)
        .map((change) => `  ${change.loc}: ${change.from} -> ${change.to}`)
        .join('\n');
      console.error(
        `sitemap.xml has ${changes.length} stale lastmod value(s).\n${sample}`,
      );
      console.error('Run: npm run sitemap:update');
      process.exitCode = 1;
      return;
    }

    console.log(`sitemap.xml lastmod values are current for ${entries.length} URLs.`);
    return;
  }

  if (changes.length === 0) {
    console.log(`sitemap.xml already has current lastmod values for ${entries.length} URLs.`);
    return;
  }

  writeFileSync(SITEMAP_PATH, output, 'utf8');
  console.log(`Updated lastmod for ${changes.length} of ${entries.length} sitemap URLs.`);
}

const invokedPath = process.argv[1]
  ? pathToFileURL(resolve(process.argv[1])).href
  : undefined;

if (invokedPath === import.meta.url) {
  main();
}
