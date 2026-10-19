import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
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

// SHA-256 of each approved Atrium foreword after CRLF normalization and trim.
// Reconstruct Markdown from the rendered block to protect every approved word,
// paragraph break and emphasis without depending on a sibling checkout in CI.
for (const [locale, approvedHash] of Object.entries({
  en: '4426a5403c2e842873148c12d24c23453cbf9ec21ba43a2ea92b39f8f8dd1fe1',
  de: 'f85f18c06bcfabf9c81cbe105b2cc0a5823b80f75425532c06616e911c84320e',
  es: 'd6f185d8384c39a0cdc39c4d3a08ba7157da4b082b76e1be4fa272c8e9f329bb',
  fr: '19da01e1799dc55bad9ed94df66e935da2db85eb1f69f3f12045303325567719',
  id: 'af119de47ce1ff6bc5935c0143084ab62b4c5f7ec38b8d05a65c0ea8456047f7',
  it: '0237b2415cdd390bdb3b5e3a03058e4469b15d7bcaf4529d55d10222e04e14a8',
  ja: 'bee4e291024109d126719336ddc4bba77bb17233aea9a245ddb37b5e8359ac72',
  pt: '9447c3b894f372c0bc6f5387596ffc745f7d37f90a4558266a23e0306804e3d2',
})) {
  test(`${locale} science hub preserves the approved two-paragraph foreword below methodology`, () => {
    const prefix = locale === 'en' ? '' : `${locale}/`;
    const hub = read(`${prefix}science/index.html`);
    const intro = hub.match(/<div class="science-history-intro">([\s\S]*?)<\/div>/)?.[1];
    assert.ok(intro);
    const label = intro.match(/<p class="science-card-label">([^<]+)<\/p>/)[1];
    const title = intro.match(/<h2 id="science-history-title">([^<]+)<\/h2>/)[1];
    const paragraphs = [...intro.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(match => match[1]);
    assert.equal(paragraphs.length, 2);
    assert.equal((intro.match(/<em>/g) || []).length, 1);
    assert.ok(paragraphs[1].includes(`<em>${title}</em>`));
    assert.doesNotMatch(intro, /<!--|\*|\]\(/);
    const markdown = [`**${label}**`, `## ${title}`, ...paragraphs.map(p => p.replaceAll('<em>', '*').replaceAll('</em>', '*'))].join('\n\n');
    assert.equal(createHash('sha256').update(markdown).digest('hex'), approvedHash);
    assert.ok(hub.indexOf('class="science-methodology"') < hub.indexOf('class="science-history-intro"'));
    assert.ok(hub.indexOf('class="science-history-intro"') < hub.indexOf('class="science-episode-card"'));
    assert.equal((hub.match(/class="science-episode-card"/g) || []).length, 3);
    for (const slug of ['who-invented-alcohol.html', 'mesopotamia-beer-written-records.html', 'egypt-drinking-with-the-gods.html']) {
      assert.ok(hub.includes(`class="science-card-link" href="/${prefix}science/${slug}"`));
    }
    assert.equal((hub.match(/\/styles\.css\?v=foreword-20261017a/g) || []).length, 2);
  });
}

test('publishes Episode 1.1 with its full reference apparatus', () => {
  const episode = read('science/who-invented-alcohol.html');

  assert.match(episode, /<h1 class="history-title">Who Invented Alcohol\?<\/h1>/);
  assert.match(episode, /href="\/science\/" class="nav-link" aria-current="page">Science<\/a>/);
  assert.match(episode, /<p class="history-deck">Long before people learned to make alcoholic drinks,/);
  assert.doesNotMatch(episode, /class="history-opening"/);
  assert.match(episode, /href="\/science\/mesopotamia-beer-written-records\.html" rel="next">Episode 1\.2 — Mesopotamia: What the First Written Records Tell Us About Beer/);
  assert.equal((episode.match(/<li id="ref-\d+">/g) ?? []).length, 15);
  assert.equal((episode.match(/<h2\b/g) ?? []).length, 5);
  assert.equal((episode.match(/<h3\b/g) ?? []).length, 0);
  assert.doesNotMatch(episode, /history-argument-map/);
  assert.equal((episode.match(/<figure class="history-figure/g) ?? []).length, 4);
  assert.match(episode, /German Archaeological Institute, Nico Becker/);
  assert.match(episode, /CC BY-NC-ND 4\.0/);
  assert.match(episode, /PNAS reuse policy/);
});

test('preserves the bounded English Episode 1.1 scientific corrections', () => {
  const episode = read('science/who-invented-alcohol.html');
  const cultivation = episode.match(/<p>Cultivation and domestication[\s\S]*?<\/p>/)?.[0];
  assert.ok(cultivation, 'cultivation explanation exists');
  assert.match(cultivation, /cereals that still retained their wild characteristics/);
  assert.match(cultivation, /href="#ref-14"/);
  assert.match(cultivation, /does not tell us whether the grain had been gathered from the wild or deliberately cultivated/);
  assert.ok(episode.indexOf(cultivation) < episode.indexOf('In 1953, the archaeologist Robert Braidwood'));
  assert.doesNotMatch(episode, /had not yet adopted agriculture|fragments of grape skin|finds show humans moving from encountering fermentation/);
  assert.match(episode, /Neither site tells us when that knowledge first arose/);
  assert.match(episode, /microscopic remains of grapevine tissue/);
  assert.match(episode, /interpreted the site in 2012 primarily as a sanctuary/);
  assert.match(episode, /permanent settlement with a strong ritual component\.<a class="citation" href="#ref-15"/);
  assert.match(episode, /Fermented drink is a possible component of that system, not its demonstrated cause/);
  assert.doesNotMatch(episode, /before agriculture became established in the region/);
  assert.match(episode, /id="ref-14"[^\n]+10\.1073\/pnas\.1612797113/);
  assert.match(episode, /id="ref-15"[^\n]+https:\/\/www\.dainst\.org\/en\/research\/projects\/noslug\/5746/);
  const referenceIds = new Set([...episode.matchAll(/<li id="(ref-\d+)">/g)].map(match => match[1]));
  for (const match of episode.matchAll(/href="#(ref-\d+)"/g)) {
    assert.ok(referenceIds.has(match[1]), `citation ${match[1]} resolves`);
  }
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
    assert.equal((episode.match(/<li id="ref-\d+">/g) ?? []).length, 15, `${locale} reference count`);
    assert.equal((episode.match(/<h2\b/g) ?? []).length, 5, `${locale} section count`);
    assert.equal((episode.match(/<h3\b/g) ?? []).length, 0, `${locale} has no subsections`);
    assert.doesNotMatch(episode, /history-argument-map/, `${locale} argument maps`);
    assert.equal((episode.match(/<figure class="history-figure/g) ?? []).length, 4, `${locale} figure count`);
    assert.equal((episode.match(/loading="lazy" decoding="async">/g) ?? []).length, 4, `${locale} lazy images`);
    assert.doesNotMatch(episode, /<img[^>]+alt=""/, `${locale} contains an empty image description`);
    assert.doesNotMatch(episode, /\*\*|\]\(https?:\/\//, `${locale} contains unconverted Markdown`);
    assert.equal((episode.match(/<link rel="alternate" hreflang=/g) ?? []).length, 9, `${locale} hreflang count`);
  }
});

test('all Episode 1.1 languages cite the cultivation distinction and updated settlement interpretation', () => {
  for (const locale of ['en', ...LOCALE_DIRECTORIES]) {
    const episode = read(`${locale === 'en' ? '' : `${locale}/`}science/who-invented-alcohol.html`);
    const ingredients = episode.match(/<section aria-labelledby="what-title">([\s\S]*?)<\/section>/)?.[1];
    const communal = episode.match(/<section aria-labelledby="why-title">([\s\S]*?)<\/section>/)?.[1];
    assert.ok(ingredients?.includes('href="#ref-14"'), `${locale} cultivation source`);
    const braidwoodIndex = ingredients.search(/Braidwood|ブレイドウッド/);
    assert.ok(braidwoodIndex >= 0 && ingredients.indexOf('href="#ref-14"') < braidwoodIndex, `${locale} cultivation context before bread/beer debate`);
    assert.ok(communal?.includes('2012') && communal.includes('href="#ref-15"'), `${locale} dated interpretation and current source`);
    assert.match(episode, /id="ref-14"[^\n]+10\.1073\/pnas\.1612797113/, locale);
    assert.match(episode, /id="ref-15"[^\n]+https:\/\/www\.dainst\.org\/en\/research\/projects\/noslug\/5746/, locale);
    const refs = new Set([...episode.matchAll(/<li id="(ref-\d+)">/g)].map(match => match[1]));
    for (const match of episode.matchAll(/href="#(ref-\d+)"/g)) {
      assert.ok(refs.has(match[1]), `${locale} citation ${match[1]} resolves`);
    }
  }
});

test('French Episode 1.1 keeps the approved conclusion and caption corrections', () => {
  const episode = read('fr/science/who-invented-alcohol.html');
  const conclusion = episode.match(/<section aria-labelledby="conclusion-title">([\s\S]*?)<div class="history-next">/)[1];
  assert.equal((conclusion.match(/<p>/g) ?? []).length, 4);
  assert.match(conclusion, /n’est probablement pas une invention unique/);
  assert.match(conclusion, /festins collectifs sont bien mieux attestés que l’alcool lui-même/);
  assert.match(conclusion, /pourquoi recommencer à en boire, le partager/);
  assert.doesNotMatch(episode, /avant l’établissement de l’agriculture|av\. J\.-C\.\./);
  assert.match(episode, /récoltées à l’état sauvage ou cultivées/);
});

// These assertions follow the human-approved October editions, rather than
// requiring their independently phrased paragraphs to match September copy.
for (const [locale, count, thesis, social, deliberate, cultivation] of [
  ['de', 4, 'nicht auf eine einmalige Erfindung', 'Feste und gemeinsame Bauarbeit wesentlich besser belegt als Alkohol', 'Falls McGoverns Interpretation zutrifft', 'wild gesammelt oder gezielt angebaut'],
  ['es', 5, 'el alcohol no fuera una invención única', 'banquetes comunitarios están mucho mejor establecidos que el consumo de alcohol', 'Si McGovern tiene razón', 'se recolectó en estado silvestre o se cultivó'],
  ['it', 5, 'l’alcol non sia nato da una singola invenzione', 'banchetti collettivi sono documentati molto meglio dell’alcol', 'Secondo McGovern, intorno al 7000 a.C.', 'raccolti allo stato spontaneo oppure già coltivati'],
  ['pt', 4, 'não resultou de uma única invenção', 'documentam muito melhor os banquetes coletivos', 'Se McGovern estiver correto na sua interpretação dos resíduos', 'recolhidos em estado selvagem ou se já eram cultivados'],
  ['id', 4, 'bukan hasil satu penemuan', 'keberadaan jamuan komunal didukung lebih kuat daripada keberadaan alkohol', 'Jika penafsiran McGovern benar', 'serealia diperoleh dari tumbuhan liar yang dikumpulkan atau dari tanaman yang sengaja ditanam'],
  ['ja', 4, '一度だけ発明されたのではない可能性が高い', 'アルコールが提供されたかどうかは依然として不確か', 'マクガヴァンらの解釈が正しければ', '野生のものとして採集したのか、意図的に栽培したのかは判断できない'],
]) {
  test(`${locale} Episode 1.1 preserves approved uncertainty, cultivation and conclusion distinctions`, () => {
    const episode = read(`${locale}/science/who-invented-alcohol.html`);
    const conclusion = episode.match(/<section aria-labelledby="conclusion-title">([\s\S]*?)<div class="history-next">/)[1];
    assert.equal((conclusion.match(/<p>/g) ?? []).length, count);
    assert.ok(conclusion.includes(thesis));
    assert.ok(conclusion.includes(social));
    assert.ok(episode.includes(deliberate));
    assert.ok(episode.includes(cultivation));
    assert.doesNotMatch(episode, /&lt;!--|section:earliest-drinks|section:ingredients-preparations/);
    assert.ok(episode.includes('id="ref-14"'));
    assert.ok(episode.includes('id="ref-15"'));
  });
}

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
