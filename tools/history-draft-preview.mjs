// Render private Markdown drafts locally. This tool never writes published pages.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { episode13Inline } from '../scripts/sync-history-episode13-content.js';

const locales = ['en', 'fr', 'de', 'es', 'pt', 'it', 'ja', 'id'];
const names = { en: 'English', fr: 'Français', de: 'Deutsch', es: 'Español', pt: 'Português', it: 'Italiano', ja: '日本語', id: 'Bahasa Indonesia' };
const escape = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

export function renderDraft(locale, source, status) {
  if (!locales.includes(locale) || !['reviewed', 'unverified'].includes(status)) throw new Error('Invalid draft configuration');
  const text = source.replaceAll('\r\n', '\n').trim();
  const clean = text.replace(/^<!-- section:[\w-]+ -->\s*$/gm, '');
  const title = clean.match(/^# ([^\n]+)\n/)?.[1];
  if (!title || /<!--|!\[/.test(clean)) throw new Error('Unexpected draft structure or unsupported images');
  const blocks = clean.replace(/^# [^\n]+\n+/, '').split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
  const body = [], refs = new Set();
  let sections = 0, subsections = 0, references = false;
  for (const block of blocks) {
    if (block.startsWith('### ')) {
      if (references) throw new Error('Unexpected reference subsection');
      subsections++;
      body.push(`<h3>${episode13Inline(block.slice(4), locale, false)}</h3>`);
    } else if (block.startsWith('## ')) {
      if (sections) body.push(references ? '</ol></section>' : '</section>');
      references = ++sections === 5;
      body.push(`<section${references ? ' class="history-references"' : ''}><h2>${episode13Inline(block.slice(3), locale, false)}</h2>${references ? '<ol>' : ''}`);
    } else if (references) {
      for (const line of block.split('\n')) {
        const match = line.match(/^(\d+)\.\s+(.+)$/);
        if (!match || Number(match[1]) !== refs.size + 1) throw new Error('Unexpected reference sequence');
        refs.add(Number(match[1]));
        body.push(`<li id="ref-${match[1]}">${episode13Inline(match[2], locale, false)}</li>`);
      }
    } else {
      if (block.includes('\n')) throw new Error('Unexpected paragraph structure');
      body.push(`<p>${episode13Inline(block, locale)}</p>`);
    }
  }
  if (sections !== 5 || subsections !== 9 || refs.size !== 15) throw new Error('Unexpected article inventory');
  body.push('</ol></section>');
  for (const match of text.matchAll(/\[(\d+)\](?!\()/g)) if (!refs.has(Number(match[1]))) throw new Error('Unresolved citation');
  const navigation = Object.entries(names).map(([key, name]) => `<a href="/${key}/"${key === locale ? ' aria-current="page"' : ''}>${escape(name)}</a>`).join(' · ');
  const notice = status === 'unverified' ? 'UNVERIFIED TRANSLATION — editorial review incomplete' : 'REVIEWED COPY — human editorial approval pending';
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${escape(title)} — local preview</title><link rel="stylesheet" href="/styles.css"><style>.preview-notice{padding:18px 20px;background:#fff3cd;color:#382900;text-align:center;font:600 15px/1.5 system-ui}.preview-languages{padding:18px 20px;text-align:center;font:15px/2 system-ui}.preview-languages a{color:#184fa0}.preview-languages a[aria-current=page]{font-weight:bold}.history-copy>p:first-child{font-size:1.16em}</style></head><body class="history-article-page history-records-page"><div class="preview-notice">LOCAL PREVIEW ONLY · ${notice} · NOT FOR PUBLICATION</div><nav class="preview-languages" aria-label="Preview languages">${navigation}</nav><main><header class="history-hero"><div class="container"><p class="history-series-label">Mindrink Science · Episode 1.4</p><h1 class="history-title">${escape(title)}</h1></div></header><article class="history-article"><div class="history-copy">${body.join('\n')}</div></article></main></body></html>`;
}

export function loadDrafts(config) {
  if (!config || Object.keys(config).sort().join(',') !== [...locales].sort().join(',')) throw new Error('Expected exactly eight languages');
  return Object.fromEntries(locales.map(locale => {
    const item = config[locale];
    if (!item || typeof item.path !== 'string' || !/^[a-f0-9]{64}$/.test(item.sha256) || !['reviewed', 'unverified'].includes(item.status)) throw new Error(`Invalid configuration: ${locale}`);
    const bytes = readFileSync(item.path);
    if (createHash('sha256').update(bytes).digest('hex') !== item.sha256) throw new Error(`Source hash mismatch: ${locale}`);
    const html = renderDraft(locale, bytes.toString('utf8'), item.status);
    return [locale, html];
  }));
}

export function startPreview(configPath, port = 4179) {
  const drafts = loadDrafts(JSON.parse(readFileSync(configPath, 'utf8')));
  const css = readFileSync(join(resolve(import.meta.dirname, '..'), 'styles.css'));
  const server = createServer((req, res) => {
    const path = new URL(req.url, 'http://127.0.0.1').pathname;
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    if (path === '/styles.css') { res.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8' }); res.end(css); return; }
    if (path === '/') { res.writeHead(302, { Location: '/en/' }); res.end(); return; }
    const locale = path.match(/^\/(en|fr|de|es|pt|it|ja|id)\/$/)?.[1];
    if (!locale) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(drafts[locale]);
  });
  server.listen(port, '127.0.0.1', () => console.log(`Local preview: http://127.0.0.1:${port}/en/`));
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (process.argv.length !== 3) throw new Error('Usage: node tools/history-draft-preview.mjs <private-config.json>');
  startPreview(resolve(process.argv[2]));
}
