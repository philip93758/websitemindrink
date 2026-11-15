import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../ja/index.html', import.meta.url), 'utf8');
const section = id => html.match(new RegExp(`<section[^>]*id="${id}"[^>]*>[\\s\\S]*?<\\/section>`))[0];

test('Japanese homepage keeps its offer, practical answers and privacy distinctions', () => {
    assert.match(html, /<h1 id="hero-title">Mindrink：無料の飲酒記録アプリ<\/h1>/);
    assert.deepEqual([...html.matchAll(/<section[^>]*id="([^"]+)"/g)].map(match => match[1]), ['home', 'how-it-works', 'questions', 'why-mindrink', 'resources', 'download']);
    assert.equal([...section('questions').matchAll(/<dt>/g)].length, 4);
    assert.doesNotMatch(section('questions'), /<details|<summary|hidden/);
    assert.ok(section('questions').includes('お名前ではなくランダムなID'));
    assert.ok(section('questions').includes('それとは別にクラッシュレポート'));
    assert.ok(html.includes('デモ用に生成した記録です。'));
    const analyticsLabel = html.match(/class="home-phone" role="img" aria-label="([^"]+)"/)[1];
    for (const value of ['1.7', '0.7', '29.6', '66%', 'Average/Day', 'Back on track']) assert.ok(analyticsLabel.includes(value));
    assert.match(html, /href="\/assets\/homepage\/homepage-ja\.css\?v=/);
});

test('Japanese navigation and resources keep their localized destinations', () => {
    const nav = html.match(/<nav class="nav"[\s\S]*?<\/nav>/)[0];
    assert.deepEqual([...nav.matchAll(/<a href="([^"]+)" class="nav-link">([^<]+)<\/a>/g)].map(match => [match[1], match[2]]), [
        ['#why-mindrink', '私たちの考え方'], ['#how-it-works', '使い方'], ['/ja/discover/', 'ガイド'], ['/ja/science/', '科学'], ['/ja/about.html', 'Mindrinkについて'],
    ]);
    assert.deepEqual([...nav.matchAll(/<a href="([^"]+)" class="language-option/g)].map(match => match[1]), ['/', '/fr/', '/de/', '/es/', '/pt/', '/id/', '/it/', '/ja/']);
    assert.match(nav, /href="\/ja\/" class="language-option is-active" aria-current="page"/);
    assert.deepEqual([...section('resources').matchAll(/<a href="([^"]+)"/g)].map(match => match[1]), ['/ja/alcohol-unit-calculator/', '/ja/alcohol-units.html', '/ja/dry-day.html', '/ja/reduce-drinking.html']);
    assert.match(section('questions'), /href="\/ja\/privacy\.html"/);
    assert.match(section('questions'), /href="\/ja\/faq\.html"/);
});

test('Japanese metadata, images and store links are consistent', () => {
    assert.match(html, /<html lang="ja">/);
    assert.match(html, /<link rel="canonical" href="https:\/\/mindrink\.me\/ja\/">/);
    assert.match(html, /<meta property="og:locale" content="ja_JP">/);
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
    const page = schemas.find(schema => schema['@type'] === 'WebPage');
    assert.equal(page.url, 'https://mindrink.me/ja/');
    assert.equal(page.inLanguage, 'ja-JP');
    assert.equal(page.name, 'Mindrink | 無料の飲酒記録アプリ');
    assert.match(html, /src="\/assets\/homepage\/romans-seated-ac\.png"/);
    for (const file of ['app-main-analytics-varied', 'app-drink-entry']) assert.ok(html.includes(`src="/assets/homepage/${file}.png"`));
    for (const id of ['home', 'download']) {
        const anchors = [...section(id).matchAll(/<a\b[^>]*>/g)].map(match => match[0]);
        assert.equal(anchors.length, 2);
        assert.ok(anchors.every(anchor => /class="btn home-store-link/.test(anchor) && /rel="noopener noreferrer"/.test(anchor)));
    }
    assert.doesNotMatch(html, /noindex|\/en\//);
});
