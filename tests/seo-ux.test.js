import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const fixture = JSON.parse(readFileSync(new URL('fixtures/seo-ux-locales.json', import.meta.url), 'utf8'));
const read = path => readFileSync(new URL(path, root), 'utf8');
const matches = (html, regex) => [...html.matchAll(regex)].map(match => match[0]);

for (const [locale, families] of Object.entries(fixture.baseline)) {
  const prefix = locale === 'en' ? '' : `${locale}/`;
  test(`${locale}: SEO/UX copy preserves existing sections, hierarchy and language routing`, () => {
    for (const [family, before] of Object.entries(families)) {
      const html = read(prefix + family);
      assert.deepEqual(matches(html, /<section[^>]*>/g), before.sections);
      assert.deepEqual(matches(html, /<h[1-6](?: [^>]*)?>/g), before.headings);
      assert.deepEqual(matches(html, /<link rel="alternate"[^>]*>/g), before.alternates);
      assert.equal(html.match(/<link rel="canonical"[^>]*>/)[0], before.canonical);
      assert.equal(matches(html, /<li(?: |>)/g).length, before.lists);
      if (!(locale === 'es' && family.startsWith('alcohol-unit-calculator'))) {
        assert.equal(html.match(/<title>[^<]*<\/title>/)[0], before.title);
        assert.equal(html.match(/<h1[^>]*>[^<]*<\/h1>/)[0], before.h1);
      }
    }
  });

  test(`${locale}: corresponding calculator slots carry the shared clarity and CTA meaning`, () => {
    const html = read(prefix + 'alcohol-unit-calculator/index.html');
    const copy = fixture.calculator[locale];
    assert.ok(html.includes(`<label for="selected-abv">${copy.abv}</label>`));
    assert.equal(html.split(`<span class="result-label">${copy.unit}</span>`).length - 1, 2);
    assert.ok(html.includes(`>${copy.add}</button>`));
    assert.ok(html.includes(`role="status">${copy.empty}</p>`));
    assert.ok(html.includes(`<p class="hero-intro">${copy.intro}</p>`));
    assert.ok(html.includes(copy.definition));
    const cta = html.match(/<section class="answer-cta">[\s\S]*?<\/section>/)[0];
    assert.ok(cta.includes(`<p>${copy.bridge}</p>`));
    assert.ok(cta.includes(`href="/${prefix}"`));
    assert.doesNotMatch(cta, /apps\.apple|play\.google/);
    const logic = read('scripts/alcohol-unit-calculator.js');
    assert.ok(logic.includes(JSON.stringify(copy.add)));
    assert.ok(logic.includes(JSON.stringify(copy.empty)));
    assert.ok(logic.includes(JSON.stringify(copy.unit)));
  });

  test(`${locale}: comparison corrections, sources and publisher disclosure are present`, () => {
    const html = read(prefix + 'blog/best-alcohol-tracking-apps.html');
    const copy = fixture.comparison[locale];
    assert.ok(html.includes(copy.disclosure));
    assert.ok(html.includes(copy.tBest));
    assert.ok(copy.questions.every(question => html.includes(question)));
    assert.match(html, /<h2 class="section-title">3\. Try Dry<\/h2>/);
    assert.match(html, /href="https:\/\/drinkcontrolapp\.com\/"/);
    assert.match(html, /href="https:\/\/www\.reframeapp\.com\/"/);
    assert.match(html, /href="https:\/\/alcoholchange\.org\.uk\/help-and-support\/managing-your-drinking\/dry-january\/support\/user-guide"/);
    assert.doesNotMatch(html, /<table/);
    const privacy = read(prefix + 'privacy.html');
    assert.match(privacy, /App Store/);
    assert.match(privacy, /Google Play/);
    assert.match(privacy, /Global Privacy Control/);
    assert.match(privacy, /Do Not Track/);
  });
}

test('targeted Portuguese description and Spanish title remain aligned with their approved scope', () => {
  const pt = read('pt/alcohol-unit-calculator/index.html');
  const description = 'Calcule os gramas de álcool puro e as unidades de cada bebida a partir do volume e do teor alcoólico. Compare as medidas com exemplos de cerveja e vinho.';
  assert.ok(pt.includes(`<meta name="description" content="${description}">`));
  assert.ok(pt.includes(`<meta property="og:description" content="${description}">`));
  const es = read('es/alcohol-unit-calculator/index.html');
  assert.ok(es.includes('<title>Calculadora de UBE y gramos de alcohol | Mindrink</title>'));
  assert.ok(es.includes('<h1>Calculadora de UBE y gramos de alcohol</h1>'));
  assert.ok(es.includes('<meta property="og:title" content="Calculadora de UBE y gramos de alcohol">'));
});

const taskFirstCalculatorDescriptions = {
  fr: 'Saisissez le volume et le degré d’alcool d’une boisson pour calculer les grammes d’alcool pur et comparer les unités de 10 g, britanniques et américaines.',
  ja: 'お酒の量とアルコール度数から純アルコール量（g）を計算。10g単位、英国のアルコール単位、米国の標準ドリンクにも換算できます。',
  id: 'Masukkan volume dan kadar alkohol minuman untuk menghitung gram alkohol murni, lalu bandingkan unit 10 g, unit Inggris, dan minuman standar AS.',
};

for (const [locale, description] of Object.entries(taskFirstCalculatorDescriptions)) {
  test(`${locale}: calculator has one approved task-first description and a matching social description`, () => {
    const html = read(`${locale}/alcohol-unit-calculator/index.html`);
    assert.deepEqual(matches(html, /<meta name="description"[^>]*>/g), [
      `<meta name="description" content="${description}">`,
    ]);
    assert.deepEqual(matches(html, /<meta property="og:description"[^>]*>/g), [
      `<meta property="og:description" content="${description}">`,
    ]);
  });
}

test('English FAQ structured answers match the visible revised answers', () => {
  const html = read('alcohol-unit-calculator/index.html');
  const schema = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map(match => JSON.parse(match[1])).find(item => item['@type'] === 'FAQPage');
  assert.equal(schema.mainEntity.length, 9);
  for (const question of schema.mainEntity) {
    assert.ok(html.includes(`<h3>${question.name}</h3>`));
    assert.ok(html.includes(`<p>${question.acceptedAnswer.text}</p>`));
  }
});
