import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function htmlFiles(directory) {
  const files = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...htmlFiles(path));
    else if (entry.name.endsWith('.html')) files.push(path);
  }

  return files;
}

const localeChecks = {
  de: {
    awkward: /Sitzung|st[aä]rkere?n? Sitzungen/i,
    natural: /Trinkgelegenheiten? mit (?:h[oö]herem|hohem) Konsum/i,
  },
  es: {
    awkward: /sesiones fuertes|sesi[oó]n fuerte/i,
    natural: /episodios? de consumo elevado/i,
  },
  it: {
    awkward: /sessioni (?:pi[uù] )?pesanti|sessione pesante/i,
    natural: /episodi? di consumo (?:pi[uù] )?elevato/i,
  },
};

for (const [locale, checks] of Object.entries(localeChecks)) {
  test(`uses natural high-consumption wording throughout ${locale} pages`, () => {
    const files = htmlFiles(join(ROOT, locale));
    let naturalPhraseFound = false;

    for (const file of files) {
      const html = readFileSync(file, 'utf8');
      assert.doesNotMatch(
        html,
        checks.awkward,
        `${relative(ROOT, file)} still contains the flagged literal translation`,
      );
      naturalPhraseFound ||= checks.natural.test(html);
    }

    assert.ok(naturalPhraseFound, `${locale} pages should retain the natural replacement wording`);
  });
}
