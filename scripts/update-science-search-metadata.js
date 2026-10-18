import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { applyScienceSearchMetadata, SCIENCE_SEARCH_METADATA, SCIENCE_SEARCH_ROUTES } from './science-search-metadata.js';

const ROOT = resolve(import.meta.dirname, '..');

export function updateScienceSearchMetadata({ check = false } = {}) {
  const updates = [];
  // Validate and render all 24 pages before writing any change.
  for (const [family, route] of Object.entries(SCIENCE_SEARCH_ROUTES)) {
    for (const locale of Object.keys(SCIENCE_SEARCH_METADATA[family])) {
      const path = resolve(ROOT, locale === 'en' ? '' : locale, route);
      const original = readFileSync(path, 'utf8');
      const updated = applyScienceSearchMetadata(original, locale, family);
      if (original !== updated) updates.push({ path, updated });
    }
  }
  if (check && updates.length) throw new Error(`Science metadata differs: ${updates.map(update => update.path).join(', ')}`);
  if (!check) for (const { path, updated } of updates) writeFileSync(path, updated);
  console.log(check ? 'Verified search/social metadata for all 24 science pages.' : `Updated science search/social metadata on ${updates.length} pages; no body or schema changes.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  if (args.some(arg => arg !== '--check') || args.length > 1) throw new Error('Usage: node scripts/update-science-search-metadata.js [--check]');
  updateScienceSearchMetadata({ check: args.includes('--check') });
}
