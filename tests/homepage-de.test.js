import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../de/index.html', import.meta.url), 'utf8');
const section = id => html.match(new RegExp(`<section[^>]*id="${id}"[^>]*>[\\s\\S]*?<\\/section>`))[0];
const title = 'Mindrink | Kostenloser Alkohol-Tracker';
const description = 'Mindrink ist ein kostenloser Alkohol-Tracker. Erfasse Getr\u00e4nke und alkoholfreie Tage und erkenne deine Trinkmuster.';

test('German responsive adjustments remain isolated from English and French', () => {
    assert.match(html, /href="\/assets\/homepage\/homepage-de\.css\?v=/);
    for (const file of ['index.html', 'fr/index.html']) {
        assert.doesNotMatch(readFileSync(new URL('../' + file, import.meta.url), 'utf8'), /homepage-de\.css/);
    }
});

test('German homepage exposes its offer and all four practical answers in the approved composition', () => {
    assert.match(html, /<h1 id="hero-title">Mindrink: ein kostenloser Alkohol-Tracker<\/h1>/);
    assert.ok(html.includes('Erfasse deine Getr\u00e4nke. Erkenne deine Muster. Triff deine eigenen Entscheidungen.'));
    assert.deepEqual([...html.matchAll(/<section[^>]*id="([^"]+)"/g)].map(match => match[1]), ['home', 'how-it-works', 'questions', 'why-mindrink', 'resources', 'download']);
    assert.deepEqual([...section('questions').matchAll(/<dt>([^<]+)<\/dt>/g)].map(match => match[1]), [
        'Ist Mindrink kostenlos?', 'Brauche ich ein Konto?', 'Muss ich aufh\u00f6ren wollen?', 'Wo werden meine Trinkdaten gespeichert?',
    ]);
    assert.doesNotMatch(section('questions'), /<details|<summary|hidden/);
    assert.match(section('questions'), /davon getrennte Absturzberichte/);
    assert.match(section('questions'), /Nutzungsanalyse in den Einstellungen deaktivieren/);
    assert.doesNotMatch(section('why-mindrink').replace(/<[^>]*>/g, ''), /\b(?:ich|wir|Philip)\b/i);
    assert.doesNotMatch(html, /<video|<iframe|newsletter|hero-description/);
});

test('German navigation preserves its existing labels and all contextual destinations remain German', () => {
    const nav = html.match(/<nav class="nav"[\s\S]*?<\/nav>/)[0];
    assert.deepEqual([...nav.matchAll(/<a href="([^"]+)" class="nav-link">([^<]+)<\/a>/g)].map(match => [match[1], match[2]]), [
        ['/de/discover/', 'Entdecken'], ['/de/science/', 'Wissenschaft'], ['/de/about.html', '\u00dcber uns'],
    ]);
    assert.deepEqual([...nav.matchAll(/<a href="([^"]+)" class="language-option/g)].map(match => match[1]), ['/', '/fr/', '/de/', '/es/', '/pt/', '/id/', '/it/', '/ja/']);
    assert.match(nav, /href="\/de\/" class="language-option is-active" aria-current="page"/);
    assert.deepEqual([...section('resources').matchAll(/<a href="([^"]+)"/g)].map(match => match[1]), ['/de/alcohol-unit-calculator/', '/de/alcohol-units.html', '/de/dry-day.html', '/de/reduce-drinking.html']);
    assert.match(section('questions'), /href="\/de\/privacy\.html"/);
    assert.match(section('questions'), /href="\/de\/faq\.html"/);
    const footer = html.match(/<footer[\s\S]*?<\/footer>/)[0];
    assert.match(footer, /href="\/de\/#why-mindrink"/);
    assert.match(footer, /href="\/de\/#how-it-works"/);
});

test('German search, social and structured metadata use the same localized identity', () => {
    assert.match(html, /<html lang="de">/);
    assert.match(html, /<link rel="canonical" href="https:\/\/mindrink\.me\/de\/">/);
    assert.ok(html.includes(`<title>${title}</title>`));
    for (const attribute of ['name="description"', 'property="og:description"', 'name="twitter:description"']) assert.ok(html.includes(`<meta ${attribute} content="${description}">`));
    for (const attribute of ['property="og:title"', 'name="twitter:title"']) assert.ok(html.includes(`<meta ${attribute} content="${title}">`));
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
    const page = schemas.find(schema => schema['@type'] === 'WebPage');
    assert.equal(page.name, title);
    assert.equal(page.description, description);
    assert.equal(page.url, 'https://mindrink.me/de/');
    assert.equal(page.inLanguage, 'de-DE');
    assert.equal(schemas.find(schema => schema['@type'] === 'Organization').description, description);
    assert.doesNotMatch(html, /noindex|\/en\//);
});

test('German homepage retains the same complete product images, store destinations and progressive navigation', () => {
    assert.match(section('home'), /src="\/assets\/homepage\/romans-seated-ac\.png" width="1254" height="1195"/);
    for (const file of ['app-main-analytics-varied', 'app-drink-entry']) assert.ok(html.includes(`src="/assets/homepage/${file}.png" width="1080" height="2304"`));
    assert.match(html, /Back on track/);
    assert.match(html, /Save drink/);
    assert.match(html, /<noscript><style>/);
    assert.match(html, /aria-controls="main-nav"/);
    for (const id of ['home', 'download']) {
        const anchors = [...section(id).matchAll(/<a\b[^>]*>/g)].map(match => match[0]);
        assert.equal(anchors.length, 2);
        assert.ok(anchors.every(anchor => /class="btn home-store-link/.test(anchor) && /target="_blank"/.test(anchor) && /rel="noopener noreferrer"/.test(anchor) && /aria-label=/.test(anchor)));
        assert.equal(anchors.filter(anchor => anchor.includes('id6756892721')).length, 1);
        assert.equal(anchors.filter(anchor => anchor.includes('com.mindrink.app')).length, 1);
    }
    assert.equal([...html.matchAll(/src="\/scripts\/analytics\.js\?v=/g)].length, 1);
});
