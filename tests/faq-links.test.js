import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

test('routes each English FAQ answer to the page promised by its question', () => {
  const faq = readFileSync(join(ROOT, 'faq.html'), 'utf8');
  const weeklyArticle = join(ROOT, 'blog', 'why-weekly-drinking-patterns-matter.html');

  assert.match(
    faq,
    /Can I reduce drinking without quitting\?[\s\S]*?href="\/reduce-drinking\.html"/,
  );
  assert.match(
    faq,
    /Why track weekly patterns\?[\s\S]*?href="\/blog\/why-weekly-drinking-patterns-matter\.html"/,
  );
  assert.ok(existsSync(weeklyArticle), 'weekly-pattern FAQ target must exist');
});
