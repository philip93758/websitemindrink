import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
export const ROOT_DIR = resolve(SCRIPT_DIR, '..');
export const ANALYTICS_LOADER = '<script type="module" src="/scripts/analytics.js?v=analytics-20260829b"></script>';

const IGNORED_DIRECTORIES = new Set(['.git', '.codex', '.agents', 'node_modules']);
const ANALYTICS_LOADER_PATTERN = /[ \t]*<script\s+type=["']module["']\s+src=["']\/scripts\/analytics\.js\?v=[^"']+["']\s*><\/script>[ \t]*(?:\r?\n)?/g;

export function listHtmlFiles(directory = ROOT_DIR) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!IGNORED_DIRECTORIES.has(entry.name)) {
        files.push(...listHtmlFiles(resolve(directory, entry.name)));
      }
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(resolve(directory, entry.name));
    }
  }
  return files.sort();
}

export function withAnalyticsLoader(html) {
  const newline = html.includes('\r\n') ? '\r\n' : '\n';
  const withoutExistingLoader = html.replace(ANALYTICS_LOADER_PATTERN, '');
  const bodyIndex = withoutExistingLoader.indexOf('</body>');
  if (bodyIndex === -1) {
    throw new Error('HTML document has no closing body tag');
  }
  const separator = withoutExistingLoader.slice(0, bodyIndex).endsWith(newline) ? '' : newline;
  return withoutExistingLoader.replace(
    /([ \t]*)<\/body>/,
    `${separator}    ${ANALYTICS_LOADER}${newline}$1</body>`,
  );
}

function main() {
  const check = process.argv.includes('--check');
  const unexpected = process.argv.slice(2).filter((argument) => argument !== '--check');
  if (unexpected.length > 0) throw new Error(`Unknown argument: ${unexpected.join(' ')}`);

  const stale = [];
  const files = listHtmlFiles();
  for (const file of files) {
    const current = readFileSync(file, 'utf8');
    const expected = withAnalyticsLoader(current);
    if (current === expected) continue;
    stale.push(relative(ROOT_DIR, file));
    if (!check) writeFileSync(file, expected, 'utf8');
  }

  if (check && stale.length > 0) {
    console.error(`${stale.length} HTML page(s) do not have the current analytics loader.`);
    console.error(stale.slice(0, 10).map((file) => `  ${file}`).join('\n'));
    process.exitCode = 1;
    return;
  }

  const action = check ? 'Verified' : 'Updated';
  console.log(`${action} the analytics loader on ${files.length} HTML pages${check ? '.' : ` (${stale.length} changed).`}`);
}

const invokedPath = process.argv[1]
  ? pathToFileURL(resolve(process.argv[1])).href
  : undefined;

if (invokedPath === import.meta.url) main();
