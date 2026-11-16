import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { listHtmlFiles } from '../scripts/update-analytics-loaders.js';

const labels = {
  en: 'Toggle menu',
  fr: 'Afficher le menu',
  de: 'Menü öffnen',
  es: 'Abrir menú',
  pt: 'Abrir menu',
  id: 'Buka menu',
  it: 'Apri menu',
  ja: 'メニューを開く',
};

for (const [locale, label] of Object.entries(labels)) {
  test(`${locale}: calculator menu has the localized homepage label and starts closed`, () => {
    const prefix = locale === 'en' ? '' : `${locale}/`;
    const read = path => readFileSync(new URL(`../${prefix}${path}`, import.meta.url), 'utf8');
    for (const path of ['index.html', 'alcohol-unit-calculator/index.html']) {
      const html = read(path);
      const buttons = [...html.matchAll(/<button\b[^>]*\bclass="menu-toggle"[^>]*>/g)];
      assert.equal(buttons.length, 1, `${prefix}${path}: one menu toggle`);
      assert.match(buttons[0][0], /\baria-expanded="false"/);
      assert.equal(buttons[0][0].match(/\baria-label="([^"]+)"/)?.[1], label, `${prefix}${path}: accessible name`);
    }
  });
}

test('every published page has a menu name in its own language', () => {
  const alternatives = {
    fr: ['Ouvrir le menu'],
    es: ['Abrir el menú'],
    pt: ['Abrir o menu'],
    it: ['Apri il menu'],
  };
  const files = listHtmlFiles();
  assert.ok(files.length > 0);
  for (const path of files) {
    const html = readFileSync(path, 'utf8');
    const locale = html.match(/<html\b[^>]*\blang="([^"]+)"/)?.[1];
    assert.ok(locale && labels[locale], `${path}: supported document language`);
    const buttons = [...html.matchAll(/<button\b[^>]*\bclass="menu-toggle"[^>]*>/g)];
    assert.equal(buttons.length, 1, `${path}: one menu toggle`);
    const name = buttons[0][0].match(/\baria-label="([^"]+)"/)?.[1];
    assert.ok([labels[locale], ...(alternatives[locale] || [])].includes(name), `${path}: unexpected menu name ${JSON.stringify(name)}`);
    assert.match(buttons[0][0], /\baria-expanded="false"/, `${path}: menu starts closed`);
  }
});
