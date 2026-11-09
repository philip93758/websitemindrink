import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, statSync } from 'node:fs';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const html = read('index.html');
const section = id => html.match(new RegExp(`<section[^>]*id="${id}"[^>]*>[\\s\\S]*?<\\/section>`))[0];

test('English homepage delivers its product offer, six sections and open practical answers in HTML', () => {
    assert.match(html, /<h1 id="hero-title">Mindrink: a free alcohol tracker<\/h1>/);
    assert.match(html, /Log your drinks\. See your patterns\. Make your own choices\./);
    assert.deepEqual([...html.matchAll(/<section[^>]*id="([^"]+)"/g)].map(match => match[1]), ['home', 'how-it-works', 'questions', 'why-mindrink', 'resources', 'download']);
    assert.deepEqual([...section('questions').matchAll(/<dt>([^<]+)<\/dt>/g)].map(match => match[1]), ['Is Mindrink free?', 'Do I need an account?', 'Do I have to be trying to quit?', 'Where are my drinking records stored?']);
    assert.doesNotMatch(section('questions'), /<details|<summary|hidden/);
    assert.match(section('questions'), /masked recordings of taps and navigation/);
    assert.match(section('questions'), /Technical error reports are collected separately and are not disabled by that switch/);
    assert.doesNotMatch(section('why-mindrink').replace(/<[^>]*>/g, ''), /\b(?:I|we|our|founder)\b/i);
    assert.match(section('download'), /Free\. No account\. No subscription\./);
    assert.doesNotMatch(html, /<video|<iframe|newsletter|hero-description|Useful reading/);
});

test('store badges preserve the existing event selector and placement contract', () => {
    for (const id of ['home', 'download']) {
        const fragment = section(id);
        const anchors = [...fragment.matchAll(/<a\b[^>]*>/g)].map(match => match[0]);
        assert.equal(anchors.length, 2);
        assert.ok(anchors.every(anchor => /class="btn home-store-link/.test(anchor) && /target="_blank"/.test(anchor) && /rel="noopener noreferrer"/.test(anchor) && /aria-label=/.test(anchor)));
        assert.equal(anchors.filter(anchor => anchor.includes('id6756892721')).length, 1);
        assert.equal(anchors.filter(anchor => anchor.includes('com.mindrink.app')).length, 1);
    }
    assert.match(section('home'), /class="hero home-hero"/);
    assert.match(section('download'), /class="cta home-section home-download"/);
    assert.equal([...html.matchAll(/src="\/scripts\/analytics\.js\?v=/g)].length, 1);
});

test('homepage keeps the existing navigation, language routes and useful resource destinations', () => {
    const nav = html.match(/<nav class="nav"[\s\S]*?<\/nav>/)[0];
    assert.deepEqual([...nav.matchAll(/<a href="([^"]+)" class="nav-link">([^<]+)<\/a>/g)].map(match => [match[1], match[2]]), [['#why-mindrink', 'Why Mindrink'], ['#how-it-works', 'How it works'], ['/discover/', 'Discover'], ['/science/', 'Science'], ['/about.html', 'About']]);
    assert.deepEqual([...nav.matchAll(/<a href="([^"]+)" class="language-option/g)].map(match => match[1]), ['/', '/fr/', '/de/', '/es/', '/pt/', '/id/', '/it/', '/ja/']);
    assert.deepEqual([...section('resources').matchAll(/<a href="([^"]+)"/g)].map(match => match[1]), ['/alcohol-unit-calculator/', '/alcohol-units.html', '/dry-day.html', '/reduce-drinking.html']);
    assert.match(html, /<link rel="canonical" href="https:\/\/mindrink.me\/">/);
    assert.doesNotMatch(html, /noindex|\/en\//);
    assert.match(html, /<meta name="robots" content="index, follow">/);
});

test('original artwork and native captures are retained, with bounded delivery of the refined hero', () => {
    const assets = {
        'romans-b.png': '7df746c667b382ec2f4357aa506db5688ca1e2b63474b7cbead5944d4c2fbe3d',
        'romans-seated-ac.png': 'e3547039c662da0971e1f8c49d55cc0aba591059656f1b7848986c6da706521d',
        'app-main-analytics-varied.png': '039496ccec06c4d24792d25de35f1ac7baf8a19f0c7868c67d94e1ff60a77458',
        'app-drink-entry.png': '8502a350ad237cd49e67933d033529f2a2f925cf4ea3ecb8443161d3b5bbb3a1',
        'app-store.svg': 'a26fc5b38380272c92e9019a2eb8b45542a66814b3e2b203772db8904b9fb99f',
        'google-play.png': 'f72611e2df8e88204009fd896d05d5e8e83c77009c63943bbffa169559934849',
    };
    for (const [name, hash] of Object.entries(assets)) assert.equal(createHash('sha256').update(readFileSync(new URL(`assets/homepage/${name}`, root))).digest('hex'), hash, name);
    assert.ok(statSync(new URL('assets/homepage/romans-seated-ac-800.webp', root)).size < 200_000);
    assert.match(section('home'), /src="\/assets\/homepage\/romans-seated-ac\.png" width="1254" height="1195"/);
    for (const width of [400, 800, 1200]) assert.ok(section('home').includes(`romans-seated-ac-${width}.webp ${width}w`));
    assert.match(html, /sizes="\(max-width: 900px\) 220px, \(max-width: 1150px\) 330px, 400px"/);
    assert.match(html, /id="analytics-caption">Mindrink app &middot; Example data/);
    assert.match(html, /width="1080" height="2304"/);
});

test('new styling and progressive navigation are scoped to the English homepage', () => {
    assert.match(html, /<body class="home-page">/);
    assert.match(html, /<noscript><style>/);
    assert.match(html, /aria-controls="main-nav"/);
    const script = read('scripts/homepage.js');
    assert.match(script, /event\.key !== 'Escape'/);
    assert.doesNotMatch(script, /URLSearchParams|romanConcept|heroMode|localStorage|fetch\(/);
    for (const locale of ['de', 'fr', 'es', 'pt', 'id', 'it', 'ja']) assert.doesNotMatch(read(`${locale}/index.html`), /homepage\.css|scripts\/homepage\.js|class="home-page"/);
});
