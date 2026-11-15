import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../it/index.html', import.meta.url), 'utf8');
const section = id => html.match(new RegExp(`<section[^>]*id="${id}"[^>]*>[\\s\\S]*?<\\/section>`))[0];

test('Italian homepage keeps its offer, practical answers and privacy distinctions', () => {
    assert.match(html, /<h1 id="hero-title">Mindrink: un tracker gratuito del consumo di alcol<\/h1>/);
    assert.ok(html.includes('Registra ci\u00f2 che bevi. Osserva le tue abitudini. Fai le tue scelte.'));
    assert.deepEqual([...html.matchAll(/<section[^>]*id="([^"]+)"/g)].map(match => match[1]), ['home', 'how-it-works', 'questions', 'why-mindrink', 'resources', 'download']);
    assert.equal([...section('questions').matchAll(/<dt>/g)].length, 4);
    assert.doesNotMatch(section('questions'), /<details|<summary|hidden/);
    assert.ok(section('questions').includes('ID casuale, non al tuo nome'));
    assert.ok(section('questions').includes('separatamente segnalazioni di arresti anomali'));
    assert.ok(html.includes('dati sintetici generati per la dimostrazione.'));
    assert.match(html, /href="\/assets\/homepage\/homepage-it\.css\?v=/);
});

test('Italian navigation and resources keep their localized destinations', () => {
    const nav = html.match(/<nav class="nav"[\s\S]*?<\/nav>/)[0];
    assert.deepEqual([...nav.matchAll(/<a href="([^"]+)" class="nav-link">([^<]+)<\/a>/g)].map(match => [match[1], match[2]]), [
        ['#why-mindrink', 'Perch\u00e9 Mindrink'], ['#how-it-works', 'Come funziona'], ['/it/discover/', 'Scopri'], ['/it/science/', 'Scienza'], ['/it/about.html', 'Chi siamo'],
    ]);
    assert.deepEqual([...nav.matchAll(/<a href="([^"]+)" class="language-option/g)].map(match => match[1]), ['/', '/fr/', '/de/', '/es/', '/pt/', '/id/', '/it/', '/ja/']);
    assert.match(nav, /href="\/it\/" class="language-option is-active" aria-current="page"/);
    assert.deepEqual([...section('resources').matchAll(/<a href="([^"]+)"/g)].map(match => match[1]), ['/it/alcohol-unit-calculator/', '/it/alcohol-units.html', '/it/dry-day.html', '/it/reduce-drinking.html']);
    assert.match(section('questions'), /href="\/it\/privacy\.html"/);
    assert.match(section('questions'), /href="\/it\/faq\.html"/);
});

test('Italian metadata, images and store links are consistent', () => {
    assert.match(html, /<html lang="it">/);
    assert.match(html, /<link rel="canonical" href="https:\/\/mindrink\.me\/it\/">/);
    assert.match(html, /<meta property="og:locale" content="it_IT">/);
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
    const page = schemas.find(schema => schema['@type'] === 'WebPage');
    assert.equal(page.url, 'https://mindrink.me/it/');
    assert.equal(page.inLanguage, 'it-IT');
    assert.equal(page.name, 'Mindrink | Tracker gratuito del consumo di alcol');
    assert.match(html, /src="\/assets\/homepage\/romans-seated-ac\.png"/);
    for (const file of ['app-main-analytics-varied', 'app-drink-entry']) assert.ok(html.includes(`src="/assets/homepage/${file}.png"`));
    for (const id of ['home', 'download']) {
        const anchors = [...section(id).matchAll(/<a\b[^>]*>/g)].map(match => match[0]);
        assert.equal(anchors.length, 2);
        assert.ok(anchors.every(anchor => /class="btn home-store-link/.test(anchor) && /rel="noopener noreferrer"/.test(anchor)));
    }
    assert.doesNotMatch(html, /noindex|\/en\//);
});
