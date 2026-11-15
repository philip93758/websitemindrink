import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../es/index.html', import.meta.url), 'utf8');
const section = id => html.match(new RegExp(`<section[^>]*id="${id}"[^>]*>[\\s\\S]*?<\\/section>`))[0];

test('Spanish homepage keeps the approved sections and practical answers visible', () => {
    assert.match(html, /<h1 id="hero-title">Mindrink: registro gratuito de consumo de alcohol<\/h1>/);
    assert.ok(html.includes('Anota tus bebidas. Ve tus patrones. Toma tus propias decisiones.'));
    assert.ok(html.includes('Tus registros de consumo de alcohol permanecen en tu dispositivo.'));
    assert.deepEqual([...html.matchAll(/<section[^>]*id="([^"]+)"/g)].map(match => match[1]), ['home', 'how-it-works', 'questions', 'why-mindrink', 'resources', 'download']);
    assert.equal([...section('questions').matchAll(/<dt>/g)].length, 4);
    assert.doesNotMatch(section('questions'), /<details|<summary|hidden/);
    assert.match(section('questions'), /activado de forma predeterminada/);
    assert.match(section('questions'), /informes de errores t\u00e9cnicos se recopilan por separado/);
    assert.match(html, /href="\/assets\/homepage\/homepage-es\.css\?v=/);
});

test('Spanish homepage preserves navigation, localized resources and language routes', () => {
    const nav = html.match(/<nav class="nav"[\s\S]*?<\/nav>/)[0];
    assert.deepEqual([...nav.matchAll(/<a href="([^"]+)" class="nav-link">([^<]+)<\/a>/g)].map(match => [match[1], match[2]]), [
        ['#why-mindrink', 'Por qu\u00e9 Mindrink'], ['#how-it-works', 'C\u00f3mo funciona'], ['/es/discover/', 'Descubrir'], ['/es/science/', 'Ciencia'], ['/es/about.html', 'Acerca de'],
    ]);
    assert.deepEqual([...nav.matchAll(/<a href="([^"]+)" class="language-option/g)].map(match => match[1]), ['/', '/fr/', '/de/', '/es/', '/pt/', '/id/', '/it/', '/ja/']);
    assert.match(nav, /href="\/es\/" class="language-option is-active" aria-current="page"/);
    assert.deepEqual([...section('resources').matchAll(/<a href="([^"]+)"/g)].map(match => match[1]), ['/es/alcohol-unit-calculator/', '/es/alcohol-units.html', '/es/dry-day.html', '/es/reduce-drinking.html']);
    assert.match(section('questions'), /href="\/es\/about\.html#privacy"/);
    assert.match(section('questions'), /href="\/es\/faq\.html"/);
});

test('Spanish metadata, structured data, images and store links remain consistent', () => {
    assert.match(html, /<html lang="es">/);
    assert.match(html, /<link rel="canonical" href="https:\/\/mindrink\.me\/es\/">/);
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
    const page = schemas.find(schema => schema['@type'] === 'WebPage');
    assert.equal(page.url, 'https://mindrink.me/es/');
    assert.equal(page.inLanguage, 'es-ES');
    assert.equal(page.name, 'Mindrink | Registro gratuito de consumo de alcohol');
    assert.match(html, /src="\/assets\/homepage\/romans-seated-ac\.png"/);
    assert.equal([...html.matchAll(/aria-label="Descargar Mindrink en el App Store"/g)].length, 2);
    for (const file of ['app-main-analytics-varied', 'app-drink-entry']) assert.ok(html.includes(`src="/assets/homepage/${file}.png"`));
    for (const id of ['home', 'download']) {
        const anchors = [...section(id).matchAll(/<a\b[^>]*>/g)].map(match => match[0]);
        assert.equal(anchors.length, 2);
        assert.ok(anchors.every(anchor => /class="btn home-store-link/.test(anchor) && /rel="noopener noreferrer"/.test(anchor)));
    }
    assert.doesNotMatch(html, /noindex|\/en\//);
});
