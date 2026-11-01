import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Import the explicitly selected season overview without changing the sources.
const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const args = process.argv.slice(2);
const check = args.includes('--check');
const inputs = args.filter(arg => arg !== '--check');
if (inputs.length !== 1) throw new Error('Usage: node scripts/sync-history-overview.js <source-directory> [--check]');
const source = resolve(inputs[0]);
const locales = ['en', 'fr', 'de', 'es', 'pt', 'it', 'ja', 'id'];
const slugs = ['who-invented-alcohol.html', 'mesopotamia-beer-written-records.html', 'egypt-drinking-with-the-gods.html'];
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const updates = [];
for (const locale of locales) {
  const name = locale === 'en' ? 'season-1.en.md' : `season-1.${locale}.pipeline-output-2026-10-31-v2.md`;
  const text = readFileSync(join(source, name), 'utf8').replaceAll('\r\n', '\n').trim();
  const blocks = text.split(/\n\n+/);
  if (blocks.length !== 33 || !/^# [^\n]+$/.test(blocks[0]) || !/^\*\*[^*\n]+\*\*$/.test(blocks[1]) || /\n/.test(blocks[2])) {
    throw new Error(`Unexpected overview structure: ${locale}`);
  }
  const prefix = locale === 'en' ? '' : `${locale}/`;
  const path = join(root, prefix, 'science/index.html');
  let html = readFileSync(path, 'utf8').replaceAll('\r\n', '\n');
  const intro = html.match(/<div class="science-history-intro">[\s\S]*?<\/div>/)?.[0];
  const label = intro?.match(/<p class="science-card-label">[^<]+<\/p>/)?.[0];
  const cards = [...html.matchAll(/<article class="science-episode-card"(?: data-status="forthcoming")?>[\s\S]*?<\/article>/g)];
  if (!intro || !label || ![3, 11].includes(cards.length)) throw new Error(`Unexpected existing hub: ${locale}`);
  const newIntro = `<div class="science-history-intro">\n                    ${label}\n                    <h2 id="science-history-title">${escape(blocks[0].slice(2))}</h2>\n                    <p class="science-history-question">${escape(blocks[1].slice(2, -2))}</p>\n                    <p>${escape(blocks[2])}</p>\n                </div>`;
  let index = 3;
  const rendered = [];
  for (let episode = 1; episode <= 11; episode++) {
    const heading = blocks[index++].match(/^### (.*?1\.\d+\D*) — (.+)$/);
    const description = blocks[index++];
    if (!heading || !new RegExp(`1\\.${episode}(?!\\d)`).test(heading[1]) || /\n|[*<>]/.test(description)) throw new Error(`Unexpected episode ${episode}: ${locale}`);
    let action;
    let status = '';
    if (episode <= 3) {
      const href = `/${prefix}science/${slugs[episode - 1]}`;
      if (!existsSync(join(root, prefix, 'science', slugs[episode - 1]))) throw new Error(`Missing article ${href}`);
      action = cards[episode - 1][0].match(/<a class="science-card-link" href="[^"]+">[^<]+<\/a>/)?.[0];
      if (!action?.includes(`href="${href}"`)) throw new Error(`Missing localized article link: ${href}`);
    } else {
      const forthcoming = blocks[index++]?.match(/^\*([^*\n]+)\*$/)?.[1];
      if (!forthcoming) throw new Error(`Missing forthcoming label: ${locale} ${episode}`);
      status = ' data-status="forthcoming"';
      action = `<span class="science-episode-status">${escape(forthcoming)}</span>`;
    }
    rendered.push(`<article class="science-episode-card"${status}>\n                    <div>\n                        <p class="science-card-label">${escape(heading[1])}</p>\n                        <h3>${escape(heading[2])}</h3>\n                        <p>${escape(description)}</p>\n                    </div>\n                    ${action}\n                </article>`);
  }
  if (index !== blocks.length) throw new Error(`Unconsumed source content: ${locale}`);
  html = html.replace(intro, newIntro);
  const currentCards = [...html.matchAll(/<article class="science-episode-card"(?: data-status="forthcoming")?>[\s\S]*?<\/article>/g)];
  const start = currentCards[0].index;
  const end = currentCards.at(-1).index + currentCards.at(-1)[0].length;
  html = html.slice(0, start) + rendered.join('\n                ') + html.slice(end);
  html = html.replaceAll('/styles.css?v=foreword-20261017a', '/styles.css?v=history-overview-20261101a');
  updates.push({ path, html });
}
const changed = updates.filter(({ path, html }) => readFileSync(path, 'utf8').replaceAll('\r\n', '\n') !== html);
if (check && changed.length) throw new Error(`Overview differs from source: ${changed.map(item => item.path).join(', ')}`);
if (!check) for (const { path, html } of changed) writeFileSync(path, html.replaceAll('\n', '\r\n'));
console.log(check ? 'Verified eight localized history overviews.' : `Updated ${changed.length} localized history overviews.`);
