import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import test from 'node:test';

const ROOT = join(import.meta.dirname, '..');
const LOCALE_DIRECTORIES = new Set(['de', 'es', 'fr', 'id', 'it', 'ja', 'pt']);
const LOCALIZED_SCIENCE = {
  de: { label: 'Wissenschaft', title: 'Wer hat den Alkohol erfunden?' },
  es: { label: 'Ciencia', title: '¿Quién inventó el alcohol?' },
  fr: { label: 'Science', title: 'Qui a inventé l’alcool ?' },
  id: { label: 'Sains', title: 'Siapa Penemu Alkohol?' },
  it: { label: 'Scienza', title: 'Chi ha inventato l’alcol?' },
  ja: { label: '科学', title: 'アルコールは誰が発明したのか' },
  pt: { label: 'Ciência', title: 'Quem inventou o álcool?' },
};

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

function allHtmlFiles(directory) {
  const files = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...allHtmlFiles(path));
    else if (entry.name.endsWith('.html')) files.push(path);
  }

  return files;
}

test('turns the English Science route into a real hub', () => {
  const hub = read('science/index.html');

  assert.doesNotMatch(hub, /http-equiv=["']refresh/i);
  assert.doesNotMatch(hub, /location\.replace\(["']\/methodology\.html/i);
  assert.match(hub, /<link rel="canonical" href="https:\/\/mindrink\.me\/science\/">/);
  assert.match(hub, /class="science-methodology-panel"/);
  assert.match(hub, /href="\/methodology\.html">Explore the Mindrink methodology<\/a>/);
  assert.match(hub, /href="\/science\/who-invented-alcohol\.html">Read Episode 1\.1<\/a>/);
  assert.ok(hub.indexOf('science-methodology') < hub.indexOf('science-history-series'));
});

test('publishes Episode 1.1 with its full reference apparatus', () => {
  const episode = read('science/who-invented-alcohol.html');

  assert.match(episode, /<h1 class="history-title">Who Invented Alcohol\?<\/h1>/);
  assert.match(episode, /href="\/science\/" class="nav-link" aria-current="page">Science<\/a>/);
  assert.match(episode, /<p class="history-deck">Fermentation is far older than humanity\./);
  assert.doesNotMatch(episode, /class="history-opening"/);
  assert.match(episode, /Episode 2 — Mesopotamia: The World's First Beer Civilization/);
  assert.equal((episode.match(/<li id="ref-\d+">/g) ?? []).length, 8);
  assert.equal((episode.match(/<div class="history-argument-map">/g) ?? []).length, 2);
  assert.doesNotMatch(episode, /history-argument-label">(?:Thesis|Antithesis|Synthesis)\b/);
  assert.equal((episode.match(/<figure class="history-figure/g) ?? []).length, 4);
  assert.match(episode, /German Archaeological Institute, Nico Becker/);
  assert.match(episode, /CC BY-NC-ND 4\.0/);
  assert.match(episode, /PNAS reuse policy/);
});

test('publishes every approved translation as a localized hub and episode', () => {
  for (const [locale, expected] of Object.entries(LOCALIZED_SCIENCE)) {
    const hub = read(`${locale}/science/index.html`);
    const episode = read(`${locale}/science/who-invented-alcohol.html`);

    assert.doesNotMatch(hub, /http-equiv=["']refresh/i, `${locale} hub still redirects`);
    assert.match(hub, /class="science-methodology-panel"/, `${locale} methodology is not prominent`);
    assert.match(hub, new RegExp(`href="\/${locale}\/methodology\\.html"`));
    assert.match(hub, new RegExp(`href="\/${locale}\/science\/who-invented-alcohol\\.html"`));
    assert.ok(hub.indexOf('science-methodology') < hub.indexOf('science-history-series'), `${locale} hierarchy`);
    assert.ok(episode.includes(`<h1 class="history-title">${expected.title}</h1>`), `${locale} title is missing`);
    assert.doesNotMatch(episode, /class="history-opening"/, `${locale} opening is duplicated in the body`);
    assert.equal((episode.match(/<li id="ref-\d+">/g) ?? []).length, 8, `${locale} reference count`);
    assert.equal((episode.match(/<div class="history-argument-map">/g) ?? []).length, 2, `${locale} argument maps`);
    assert.doesNotMatch(episode, /history-argument-label">[^<]+(?:—|――)/, `${locale} argument-map prefixes`);
    assert.equal((episode.match(/<figure class="history-figure/g) ?? []).length, 4, `${locale} figure count`);
    assert.equal((episode.match(/loading="lazy" decoding="async">/g) ?? []).length, 4, `${locale} lazy images`);
    assert.doesNotMatch(episode, /<img[^>]+alt=""/, `${locale} contains an empty image description`);
    assert.doesNotMatch(episode, /\*\*|\]\(https?:\/\//, `${locale} contains unconverted Markdown`);
    assert.equal((episode.match(/<link rel="alternate" hreflang=/g) ?? []).length, 9, `${locale} hreflang count`);
  }
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

test('routes every localized Science navigation item through its hub', () => {
  const failures = [];

  for (const [locale, expected] of Object.entries(LOCALIZED_SCIENCE)) {
    const root = join(ROOT, locale);
    const files = allHtmlFiles(root);

    for (const path of files) {
      const html = readFileSync(path, 'utf8');
      const navigation = html.match(/<nav class="nav">([\s\S]*?)<\/nav>/)?.[1];

      if (!navigation) continue;
      const expectedLink = `href="/${locale}/science/" class="nav-link"`;
      if (!navigation.includes(expectedLink) || !navigation.includes(`>${expected.label}</a>`)) {
        failures.push(relative(ROOT, path));
      }
    }
  }

  assert.deepEqual(failures, []);
});

test('keeps the Japanese Why Mindrink and About labels distinct', () => {
  const homepage = read('ja/index.html');

  assert.match(homepage, /href="#why-mindrink" class="nav-link">私たちの考え方<\/a>/);
  assert.match(homepage, /href="\/ja\/#why-mindrink" class="footer-link">私たちの考え方<\/a>/);
  assert.match(homepage, /href="\/ja\/about\.html" class="nav-link">Mindrinkについて<\/a>/);
  assert.doesNotMatch(homepage, /href="#why-mindrink"[^>]*>Mindrinkについて<\/a>/);
});
