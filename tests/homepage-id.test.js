import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../id/index.html', import.meta.url), 'utf8');
const section = id => html.match(new RegExp(`<section[^>]*id="${id}"[^>]*>[\\s\\S]*?<\\/section>`))[0];

test('Indonesian homepage keeps its offer, practical answers and privacy distinctions', () => {
    assert.match(html, /<h1 id="hero-title">Mindrink: pelacak konsumsi alkohol gratis<\/h1>/);
    assert.ok(html.includes('Catat minumanmu. Lihat polamu. Tentukan pilihanmu sendiri.'));
    assert.deepEqual([...html.matchAll(/<section[^>]*id="([^"]+)"/g)].map(match => match[1]), ['home', 'how-it-works', 'questions', 'why-mindrink', 'resources', 'download']);
    assert.equal([...section('questions').matchAll(/<dt>/g)].length, 4);
    assert.doesNotMatch(section('questions'), /<details|<summary|hidden/);
    assert.ok(section('questions').includes('diaktifkan secara default'));
    assert.ok(section('questions').includes('tidak dinonaktifkan oleh pengaturan tersebut'));
    assert.ok(html.includes('catatan dibuat secara sintetis untuk demonstrasi.'));
    assert.match(html, /href="\/assets\/homepage\/homepage-id\.css\?v=/);
});

test('Indonesian navigation and resources keep their localized destinations', () => {
    const nav = html.match(/<nav class="nav"[\s\S]*?<\/nav>/)[0];
    assert.deepEqual([...nav.matchAll(/<a href="([^"]+)" class="nav-link">([^<]+)<\/a>/g)].map(match => [match[1], match[2]]), [
        ['#why-mindrink', 'Mengapa Mindrink'], ['#how-it-works', 'Cara kerja'], ['/id/discover/', 'Jelajahi'], ['/id/science/', 'Sains'], ['/id/about.html', 'Tentang'],
    ]);
    assert.deepEqual([...nav.matchAll(/<a href="([^"]+)" class="language-option/g)].map(match => match[1]), ['/', '/fr/', '/de/', '/es/', '/pt/', '/id/', '/it/', '/ja/']);
    assert.match(nav, /href="\/id\/" class="language-option is-active" aria-current="page"/);
    assert.deepEqual([...section('resources').matchAll(/<a href="([^"]+)"/g)].map(match => match[1]), ['/id/alcohol-unit-calculator/', '/id/alcohol-units.html', '/id/dry-day.html', '/id/reduce-drinking.html']);
    assert.match(section('questions'), /href="\/id\/about\.html#privacy"/);
    assert.match(section('questions'), /href="\/id\/faq\.html"/);
});

test('Indonesian metadata, images and store links are consistent', () => {
    assert.match(html, /<html lang="id">/);
    assert.match(html, /<link rel="canonical" href="https:\/\/mindrink\.me\/id\/">/);
    assert.match(html, /<meta property="og:locale" content="id_ID">/);
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
    const page = schemas.find(schema => schema['@type'] === 'WebPage');
    assert.equal(page.url, 'https://mindrink.me/id/');
    assert.equal(page.inLanguage, 'id-ID');
    assert.equal(page.name, 'Mindrink | Pelacak Konsumsi Alkohol Gratis');
    assert.match(html, /src="\/assets\/homepage\/romans-seated-ac\.png"/);
    for (const file of ['app-main-analytics-varied', 'app-drink-entry']) assert.ok(html.includes(`src="/assets/homepage/${file}.png"`));
    for (const id of ['home', 'download']) {
        const anchors = [...section(id).matchAll(/<a\b[^>]*>/g)].map(match => match[0]);
        assert.equal(anchors.length, 2);
        assert.ok(anchors.every(anchor => /class="btn home-store-link/.test(anchor) && /rel="noopener noreferrer"/.test(anchor)));
    }
    assert.doesNotMatch(html, /noindex|\/en\//);
});
