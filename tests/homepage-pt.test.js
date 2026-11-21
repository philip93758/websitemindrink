import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../pt/index.html', import.meta.url), 'utf8');
const section = id => html.match(new RegExp(`<section[^>]*id="${id}"[^>]*>[\\s\\S]*?<\\/section>`))[0];

test('Portuguese homepage keeps its offer, practical answers and privacy distinctions', () => {
    assert.ok(html.includes('Mindrink: acompanhamento gratuito do consumo de \u00e1lcool'));
    assert.ok(html.includes('Registre suas bebidas. Veja seus padr\u00f5es. Fa\u00e7a suas pr\u00f3prias escolhas.'));
    assert.ok(html.includes('o teor alco\u00f3lico e a quantidade, e salve no seu di\u00e1rio.'));
    assert.deepEqual([...html.matchAll(/<section[^>]*id="([^"]+)"/g)].map(match => match[1]), ['home', 'how-it-works', 'questions', 'why-mindrink', 'resources', 'download']);
    assert.equal([...section('questions').matchAll(/<dt>/g)].length, 4);
    assert.doesNotMatch(section('questions'), /<details|<summary|hidden/);
    assert.ok(section('questions').includes('ID aleat\u00f3rio, n\u00e3o ao seu nome'));
    assert.ok(section('questions').includes('relat\u00f3rios de falhas coletados separadamente'));
    assert.match(html, /href="\/assets\/homepage\/homepage-pt\.css\?v=/);
});

test('Portuguese navigation and resources keep their localized destinations', () => {
    const nav = html.match(/<nav class="nav"[\s\S]*?<\/nav>/)[0];
    assert.deepEqual([...nav.matchAll(/<a href="([^"]+)" class="nav-link">([^<]+)<\/a>/g)].map(match => [match[1], match[2]]), [
        ['/pt/discover/', 'Descobrir'], ['/pt/science/', 'Ci\u00eancia'], ['/pt/about.html', 'Sobre'],
    ]);
    assert.deepEqual([...nav.matchAll(/<a href="([^"]+)" class="language-option/g)].map(match => match[1]), ['/', '/fr/', '/de/', '/es/', '/pt/', '/id/', '/it/', '/ja/']);
    assert.match(nav, /href="\/pt\/" class="language-option is-active" aria-current="page"/);
    assert.deepEqual([...section('resources').matchAll(/<a href="([^"]+)"/g)].map(match => match[1]), ['/pt/alcohol-unit-calculator/', '/pt/alcohol-units.html', '/pt/dry-day.html', '/pt/reduce-drinking.html']);
    assert.match(section('questions'), /href="\/pt\/privacy\.html"/);
    assert.match(section('questions'), /href="\/pt\/faq\.html"/);
});

test('Portuguese metadata, images and store links are consistent', () => {
    assert.match(html, /<html lang="pt">/);
    assert.match(html, /<link rel="canonical" href="https:\/\/mindrink\.me\/pt\/">/);
    assert.match(html, /<meta property="og:locale" content="pt_BR">/);
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
    const page = schemas.find(schema => schema['@type'] === 'WebPage');
    assert.equal(page.url, 'https://mindrink.me/pt/');
    assert.equal(page.inLanguage, 'pt-BR');
    assert.equal(page.name, 'Mindrink | Acompanhamento gratuito do consumo de \u00e1lcool');
    assert.match(html, /src="\/assets\/homepage\/romans-seated-ac\.png"/);
    for (const file of ['app-main-analytics-varied', 'app-drink-entry']) assert.ok(html.includes(`src="/assets/homepage/${file}.png"`));
    for (const id of ['home', 'download']) {
        const anchors = [...section(id).matchAll(/<a\b[^>]*>/g)].map(match => match[0]);
        assert.equal(anchors.length, 2);
        assert.ok(anchors.every(anchor => /class="btn home-store-link/.test(anchor) && /rel="noopener noreferrer"/.test(anchor)));
    }
    assert.doesNotMatch(html, /noindex|\/en\//);
});
