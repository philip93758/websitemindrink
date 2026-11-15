import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../fr/index.html', import.meta.url), 'utf8');
const section = id => html.match(new RegExp(`<section[^>]*id="${id}"[^>]*>[\\s\\S]*?<\\/section>`))[0];
const title = 'Mindrink | Suivi gratuit de la consommation d\u2019alcool';
const description = 'Mindrink est un outil gratuit de suivi de la consommation d\u2019alcool. Consignez vos boissons et vos jours sans alcool, et comprenez vos habitudes de consommation.';

test('French responsive adjustments are not loaded on the English homepage', () => {
    assert.match(html, /href="\/assets\/homepage\/homepage-fr\.css\?v=/);
    const english = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
    assert.doesNotMatch(english, /homepage-fr\.css/);
});

test('French homepage delivers localized product copy and the same six visible sections', () => {
    assert.ok(html.includes('<h1 id="hero-title">Mindrink : suivi gratuit de la consommation d\u2019alcool</h1>'));
    assert.match(html, /Consignez vos boissons\. Observez vos habitudes\. Faites vos propres choix\./);
    assert.deepEqual([...html.matchAll(/<section[^>]*id="([^"]+)"/g)].map(match => match[1]), ['home', 'how-it-works', 'questions', 'why-mindrink', 'resources', 'download']);
    assert.deepEqual([...section('questions').matchAll(/<dt>([^<]+)<\/dt>/g)].map(match => match[1]), [
        'Mindrink est-elle gratuite ?', 'Ai-je besoin d\u2019un compte ?',
        'Dois-je chercher \u00e0 arr\u00eater de boire ?', 'O\u00f9 mes donn\u00e9es de consommation sont-elles stock\u00e9es ?',
    ]);
    assert.doesNotMatch(section('questions'), /<details|<summary|hidden/);
    assert.ok(section('questions').includes('rapports sur les arr\u00eats inattendus de l\u2019application'));
    assert.ok(section('questions').includes('identifiant al\u00e9atoire, et non \u00e0 votre nom'));
    assert.doesNotMatch(section('why-mindrink').replace(/<[^>]*>/g, ''), /\b(?:je|nous|Philip)\b/i);
    assert.doesNotMatch(html, /<video|<iframe|newsletter|hero-description/);
});

test('French navigation and contextual links keep visitors in their selected language', () => {
    const nav = html.match(/<nav class="nav"[\s\S]*?<\/nav>/)[0];
    assert.deepEqual([...nav.matchAll(/<a href="([^"]+)" class="nav-link">([^<]+)<\/a>/g)].map(match => [match[1], match[2]]), [
        ['#why-mindrink', 'Pourquoi Mindrink'], ['#how-it-works', 'Comment \u00e7a marche'],
        ['/fr/discover/', 'D\u00e9couvrir'], ['/fr/science/', 'Science'], ['/fr/about.html', '\u00c0 propos'],
    ]);
    assert.deepEqual([...nav.matchAll(/<a href="([^"]+)" class="language-option/g)].map(match => match[1]), ['/', '/fr/', '/de/', '/es/', '/pt/', '/id/', '/it/', '/ja/']);
    assert.match(nav, /href="\/fr\/" class="language-option is-active" aria-current="page"/);
    assert.deepEqual([...section('resources').matchAll(/<a href="([^"]+)"/g)].map(match => match[1]), ['/fr/alcohol-unit-calculator/', '/fr/alcohol-units.html', '/fr/dry-day.html', '/fr/reduce-drinking.html']);
    assert.match(section('questions'), /href="\/fr\/privacy\.html"/);
    assert.match(section('questions'), /href="\/fr\/faq\.html"/);
    const footer = html.match(/<footer[\s\S]*?<\/footer>/)[0];
    assert.match(footer, /href="\/fr\/#why-mindrink"/);
    assert.match(footer, /href="\/fr\/#how-it-works"/);
});

test('French search and social metadata agree with visible page identity and structured data', () => {
    assert.match(html, /<html lang="fr">/);
    assert.match(html, /<link rel="canonical" href="https:\/\/mindrink\.me\/fr\/">/);
    assert.ok(html.includes(`<title>${title}</title>`));
    for (const attribute of ['name="description"', 'property="og:description"', 'name="twitter:description"']) {
        assert.ok(html.includes(`<meta ${attribute} content="${description}">`));
    }
    for (const attribute of ['property="og:title"', 'name="twitter:title"']) assert.ok(html.includes(`<meta ${attribute} content="${title}">`));
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
    const page = schemas.find(schema => schema['@type'] === 'WebPage');
    assert.equal(page.name, title);
    assert.equal(page.description, description);
    assert.equal(page.url, 'https://mindrink.me/fr/');
    assert.equal(page.inLanguage, 'fr-FR');
    assert.equal(schemas.find(schema => schema['@type'] === 'Organization').description, description);
    assert.doesNotMatch(html, /noindex|\/en\//);
});

test('French homepage reuses current artwork, full phone captures and both measured store groups', () => {
    assert.match(section('home'), /src="\/assets\/homepage\/romans-seated-ac\.png" width="1254" height="1195"/);
    assert.match(html, /src="\/assets\/homepage\/app-main-analytics-varied\.png" width="1080" height="2304"/);
    assert.match(html, /src="\/assets\/homepage\/app-drink-entry\.png" width="1080" height="2304"/);
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
