import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import test from 'node:test';

const ROOT = join(import.meta.dirname, '..');
const LOCALE_DIRECTORIES = new Set(['de', 'es', 'fr', 'id', 'it', 'ja', 'pt']);

function read(relativePath) {
  return readFileSync(join(ROOT, relativePath), 'utf8');
}

function englishHtmlFiles(directory = ROOT) {
  const files = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;

    const path = join(directory, entry.name);
    const topLevel = relative(ROOT, path).split(/[\\/]/)[0];

    if (entry.isDirectory()) {
      if (!LOCALE_DIRECTORIES.has(topLevel)) files.push(...englishHtmlFiles(path));
    } else if (entry.name.endsWith('.html')) {
      files.push(path);
    }
  }

  return files;
}

test('turns the English Science route into a real hub', () => {
  const hub = read('science/index.html');

  assert.doesNotMatch(hub, /http-equiv=["']refresh/i);
  assert.doesNotMatch(hub, /location\.replace\(["']\/methodology\.html/i);
  assert.match(hub, /<link rel="canonical" href="https:\/\/mindrink\.me\/science\/">/);
  assert.match(hub, /href="\/methodology\.html">Read the methodology<\/a>/);
  assert.match(hub, /href="\/science\/who-invented-alcohol\.html">Read Episode 1\.1<\/a>/);
});

test('publishes Episode 1.1 with its full reference apparatus', () => {
  const episode = read('science/who-invented-alcohol.html');

  assert.match(episode, /<h1 class="history-title">Who Invented Alcohol\?<\/h1>/);
  assert.match(episode, /href="\/science\/" class="nav-link" aria-current="page">Science<\/a>/);
  assert.match(episode, /Episode 1\.2 — Mesopotamia: The World's First Beer Civilization/);
  assert.equal((episode.match(/<li id="ref-\d+">/g) ?? []).length, 8);
});

test('routes every English Science navigation item through the hub', () => {
  const failures = [];

  for (const path of englishHtmlFiles()) {
    const html = readFileSync(path, 'utf8');
    const navigation = html.match(/<nav class="nav">([\s\S]*?)<\/nav>/)?.[1];

    if (!navigation) continue;
    if (!/href="\/science\/" class="nav-link"[^>]*>Science<\/a>/.test(navigation)) {
      failures.push(relative(ROOT, path));
    }
  }

  assert.deepEqual(failures, []);
});
