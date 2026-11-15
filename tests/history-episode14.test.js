import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '..');
const slug = 'greece-wine-and-the-human-mind.html';
// Hashes cover the exact selected source after newline/section-marker normalization.
const hashes = {
  en: '523e11bb5d318412118cc25dfb6f0def1d4683a99b6bd5a04f87cb2738280bf4',
  fr: 'b3d76b8bf4e8f4dfc2dba1103ca735102e8f1e8dcde69fc126c0b2dfe1ed1197',
  de: '792ae7fc2ab5b9f7d7584f1179e93e89a7dac150c4a37f93bd5f4adf13678e65',
  es: '6a6384a3fade25db1dae42fc32472255081645e13d05c4a69dcd1118a23a7b9c',
  pt: '2d4fa469a742ec1c7590fd7b423478f8369d0ba426de4f72864e3741dbf866b3',
  it: '67b36229b812a35e966e73c5d6ef04793fe07cfb0f2df5b2c2e605bc745799d5',
  ja: '8a20154c85d2e114a75e7049610b982a9ecc752c0b96cdc06f603bfcffcc604b',
  id: 'baef8a53fcc960ef1464b1018cd1e2aac402e98348f30ecb914495425842a46a',
};
const read = file => readFileSync(resolve(root, file), 'utf8').replaceAll('\r\n', '\n');
const decode = text => text.replaceAll('&quot;', '"').replaceAll('&gt;', '>').replaceAll('&lt;', '<').replaceAll('&amp;', '&');
function markdown(html) {
  return decode(html.replace(/<a class="citation"[^>]+>(\[\d+\])<\/a>/g, '$1')
    .replace(/<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, '[$2]($1)')
    .replaceAll('<em>', '*').replaceAll('</em>', '*').replaceAll('<strong>', '**').replaceAll('</strong>', '**'));
}
for (const [locale, expected] of Object.entries(hashes)) {
  test(`Episode 1.4 ${locale}: selected text, references and localized routes`, () => {
    const prefix = locale === 'en' ? '' : `${locale}/`, html = read(`${prefix}science/${slug}`);
    const content = html.slice(html.indexOf('<h1 class="history-title">'), html.search(/<nav class="history-series-navigation(?: |")/));
    const blocks = [];
    for (const match of content.matchAll(/<(h[123]|p|li)\b([^>]*)>([\s\S]*?)<\/\1>/g)) {
      const [, tag, attributes, inner] = match;
      if (attributes.includes('history-meta')) continue;
      if (tag.startsWith('h')) blocks.push(`${'#'.repeat(Number(tag[1]))} ${markdown(inner)}`);
      else if (tag === 'li') blocks.push(`${attributes.match(/id="ref-(\d+)"/)[1]}. ${markdown(inner)}`);
      else blocks.push(markdown(inner));
    }
    assert.equal(createHash('sha256').update(blocks.join('\n\n')).digest('hex'), expected);
    assert.equal((html.match(/<h2\b/g) || []).length, 5);
    assert.equal((html.match(/<h3\b/g) || []).length, 9);
    assert.equal((html.match(/<li id="ref-\d+"/g) || []).length, 15);
    const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
    for (const match of html.matchAll(/href="#(ref-\d+)"/g)) assert.ok(ids.has(match[1]), match[1]);
    assert.ok(html.includes(`href="/${prefix}science/egypt-drinking-with-the-gods.html" rel="prev"`));
    for (const language of Object.keys(hashes)) {
      const other = language === 'en' ? '' : `${language}/`;
      assert.ok(html.includes(`hreflang="${language}" href="https://mindrink.me/${other}science/${slug}"`));
      assert.ok(html.includes(`<a href="/${other}science/${slug}" class="language-option`));
    }
    assert.ok(read(`${prefix}science/index.html`).includes(`href="/${prefix}science/${slug}"`));
    assert.ok(read(`${prefix}science/egypt-drinking-with-the-gods.html`).includes(`href="/${prefix}science/${slug}" rel="next"`));
    assert.doesNotMatch(html, /article:published_time|"datePublished"/);
  });
}
