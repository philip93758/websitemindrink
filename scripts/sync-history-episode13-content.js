import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { EPISODE13_ASSETS, EPISODE13_IMAGES, EPISODE13_LOCALES, EPISODE13_SLUG, EPISODE13_SOURCES, EPISODE13_STYLES, episode13Prefix, episode13Variant, episode13Widths } from './history-episode13-config.js';
import { applyScienceSearchMetadata, escapeMetadata as escapeHtml } from './science-search-metadata.js';
import { linkNextHistoryEpisode } from './history-series-navigation.js';

const ROOT = resolve(import.meta.dirname, '..');
const ORIGIN = 'https://mindrink.me';
const PREVIOUS_SLUG = 'mesopotamia-beer-written-records.html';
const read = path => readFileSync(path, 'utf8').replaceAll('\r\n', '\n');
const sectionIds = ['desirable-life', 'unsettling-effects', 'sacred-intoxication', 'living-with-alcohol', 'references'];
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const styles = html => html.replace(/href="\/styles\.css(?:\?[^"]*)?"/g, `href="/styles.css?v=${EPISODE13_STYLES}"`);

export function parseEpisode13Options(args) {
  const [directory, ...flags] = args;
  if (!directory || directory.startsWith('--')) throw new Error('Usage: node scripts/sync-history-episode13-content.js <episode-1.3-root> [--check] [--locale fr]');
  const options = { sourceDirectory: resolve(directory), check: false };
  for (let i = 0; i < flags.length; i++) {
    if (flags[i] === '--check' && !options.check) options.check = true;
    else if (flags[i] === '--locale' && !options.locale && Object.hasOwn(EPISODE13_LOCALES, flags[i + 1])) options.locale = flags[++i];
    else throw new Error(`Invalid Episode 1.3 argument: ${flags[i]}`);
  }
  return options;
}

function plain(text, locale, citations) {
  let html = escapeHtml(text).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>');
  if (html.includes('*')) throw new Error(`Unbalanced emphasis in ${locale}: ${text.slice(0, 80)}`);
  if (citations) html = html.replace(/\[(\d+)\]/g, `<a class="citation" href="#ref-$1" aria-label="${EPISODE13_LOCALES[locale].reference} $1">[$1]</a>`);
  return html;
}

// Balanced parentheses preserve complete Commons URLs and PDF page fragments.
// Link labels retain emphasis rather than leaking Markdown into the bibliography.
export function episode13Inline(text, locale, citations = true) {
  const links = /\[([^\]\n]+)\]\(/g;
  let html = '', cursor = 0, match;
  while ((match = links.exec(text))) {
    html += plain(text.slice(cursor, match.index), locale, citations);
    let end = links.lastIndex, depth = 1;
    while (end < text.length && depth) {
      if (text[end] === '(') depth++;
      if (text[end] === ')') depth--;
      end++;
    }
    if (depth) throw new Error(`Unclosed link: ${locale}`);
    const url = text.slice(links.lastIndex, end - 1);
    if (!/^https?:\/\/[^\s<>]+$/.test(url)) throw new Error(`Unsupported link: ${locale}`);
    html += `<a href="${escapeHtml(url)}" rel="noopener noreferrer">${plain(match[1], locale, false)}</a>`;
    cursor = end;
    links.lastIndex = end;
  }
  return html + plain(text.slice(cursor), locale, citations);
}

function figureHtml(block, locale, key) {
  const image = EPISODE13_IMAGES[key];
  if (!image) throw new Error(`Unknown Egypt illustration: ${key}`);
  const match = block.match(/^!\[([^\]]+)\]\(([^\n]+)\)\n\n\*([\s\S]+?)\*((?:\[\d+\])*)\n\n([^\n][\s\S]*)$/);
  if (!match || match[2] !== image.source || !match[5].includes(image.record)) throw new Error(`Unexpected illustration/credit: ${locale}/${key}`);
  const [, alt, , caption, citations, credit] = match;
  const portrait = image.height > image.width;
  const lead = key === 'nebamun-receiving-wine';
  const widths = episode13Widths(image);
  return `<figure class="history-figure${portrait ? ' history-figure--portrait' : ''}${lead ? ' history-figure--lead' : ''}" data-illustration="${key}">
    <img src="/${EPISODE13_ASSETS}/${episode13Variant(image, widths[1])}" srcset="${widths.map(width => `/${EPISODE13_ASSETS}/${episode13Variant(image, width)} ${width}w`).join(', ')}" sizes="${portrait ? '(max-width: 480px) 62vw, (max-width: 767px) 320px, 570px' : '(max-width: 480px) 72vw, (max-width: 767px) 480px, (max-width: 900px) calc(100vw - 40px), 840px'}" alt="${escapeHtml(alt)}" width="${image.width}" height="${image.height}" style="--history-image-ratio: ${image.width} / ${image.height}" ${lead ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} decoding="async">
    <figcaption>${episode13Inline(caption + citations, locale)} <span class="history-image-credit">${episode13Inline(credit, locale, false)}</span></figcaption>
</figure>`;
}

export function parseEpisode13(markdown, locale) {
  if (!Object.hasOwn(EPISODE13_LOCALES, locale)) throw new Error(`Unknown Episode 1.3 locale: ${locale}`);
  let source = markdown.replaceAll('\r\n', '\n').trim();
  const markers = [...source.matchAll(/^<!-- section:([\w-]+) -->[ \t]*$/gm)].map(m => m[1]);
  if (markers.length) {
    const positions = source.split(/^## [^\n]+\n/gm).slice(1).map(block => block.trimStart().match(/^<!-- section:([\w-]+) -->/)?.[1] ?? null);
    if (JSON.stringify(markers) !== JSON.stringify(sectionIds.slice(0, 4)) || JSON.stringify(positions) !== JSON.stringify([...sectionIds.slice(0, 4), null])) throw new Error(`Unexpected section markers: ${locale}`);
    source = source.replace(/^<!-- section:[\w-]+ -->[ \t]*$/gm, '');
  }
  const title = source.match(/^# ([^\n]+)\n/)?.[1];
  if (!title) throw new Error(`Missing Egypt title: ${locale}`);
  source = source.replace(/^# [^\n]+\n+/, '');
  const figures = [];
  source = source.replace(/<!-- illustration: ([\w-]+) -->\s*([\s\S]*?)\s*<!-- \/illustration -->/g, (_match, key, block) => {
    figures.push({ key, html: figureHtml(block.trim(), locale, key) });
    return `FIGURETOKEN${figures.length - 1}ENDTOKEN`;
  });
  if (figures.map(f => f.key).join() !== Object.keys(EPISODE13_IMAGES).join() || /<!--|!\[/.test(source)) throw new Error(`Unexpected figure order/source markers: ${locale}`);
  const blocks = source.split(/\n\s*\n/).map(block => block.trim()).filter(Boolean);
  if (!blocks[0]?.startsWith('### ')) throw new Error(`Missing Egypt subtitle: ${locale}`);
  const subtitle = episode13Inline(blocks.shift().slice(4), locale, false);
  const intro = [];
  while (blocks.length && !blocks[0].startsWith('FIGURETOKEN') && !blocks[0].startsWith('#')) intro.push(paragraph(blocks.shift(), locale));
  if (![1, 3].includes(intro.length) || blocks.shift() !== 'FIGURETOKEN0ENDTOKEN') throw new Error(`Expected selected opening paragraphs and lead image: ${locale}`);
  // ES/PT/ID place the image after the opening hook; the other editions place
  // it after all three introductory paragraphs. Preserve each selected order.
  const html = [], subheadings = [0, 0, 0, 0, 0];
  while (blocks.length && !blocks[0].startsWith('## ')) html.push(paragraph(blocks.shift(), locale));
  if (intro.length + html.length !== 3) throw new Error(`Expected three introductory paragraphs in total: ${locale}`);
  let section = -1, references = 0, rightsNote = false;
  for (const block of blocks) {
    if (block.startsWith('## ')) {
      if (section >= 0) html.push('</section>');
      section++;
      if (!sectionIds[section]) throw new Error(`Too many Egypt sections: ${locale}`);
      html.push(`<section${section === 4 ? ' class="history-references"' : ''} aria-labelledby="${sectionIds[section]}-title">`, `<h2 id="${sectionIds[section]}-title">${episode13Inline(block.slice(3), locale, false)}</h2>`);
      if (section === 4) html.push('<ol>');
    } else if (block.startsWith('### ') && section >= 0 && section < 3) {
      subheadings[section]++;
      html.push(`<h3>${episode13Inline(block.slice(4), locale, false)}</h3>`);
    } else if (/^FIGURETOKEN\d+ENDTOKEN$/.test(block) && section >= 0 && section < 3) {
      html.push(figures[Number(block.match(/\d+/)[0])].html);
    } else if (section === 4 && references < 16) {
      const reference = block.match(/^(\d+)\.\s+([\s\S]+)$/);
      if (!reference || Number(reference[1]) !== ++references) throw new Error(`Nonsequential Egypt reference: ${locale}`);
      html.push(`<li id="ref-${references}">${episode13Inline(reference[2], locale)}</li>`);
      if (references === 16) html.push('</ol>');
    } else if (section === 4) {
      if (rightsNote || /^\d+\. /.test(block)) throw new Error(`Unexpected text after references: ${locale}`);
      rightsNote = true;
      html.push(paragraph(block, locale, ' class="history-rights-note"'));
    } else if (section >= 0) html.push(paragraph(block, locale));
    else throw new Error(`Content outside Egypt sections: ${locale}`);
  }
  if (section !== 4 || references !== 16 || !rightsNote || subheadings.join() !== '3,3,3,0,0') throw new Error(`Expected Egypt 3 × 3 structure, conclusion, 16 references and rights note: ${locale}`);
  html.push('</section>');
  const parsed = { title, subtitle, intro, lead: figures[0].html, body: html.join('\n') };
  for (const match of JSON.stringify(parsed).matchAll(/href=\\"#ref-(\d+)\\"/g)) {
    if (Number(match[1]) < 1 || Number(match[1]) > 16) throw new Error(`Unresolved Egypt citation: ${locale}`);
  }
  return parsed;
}

function paragraph(block, locale, className = '') {
  if (/^(#|\||\d+\. |FIGURETOKEN|<|!\[)/.test(block)) throw new Error(`Unsupported Egypt block: ${locale}: ${block.slice(0, 60)}`);
  return `<p${className}>${episode13Inline(block.replace(/\n/g, ' '), locale)}</p>`;
}

function renderPage(template, parsed, locale, today, existing) {
  const prefix = episode13Prefix(locale);
  const url = `${ORIGIN}/${prefix}science/${EPISODE13_SLUG}`;
  const previousTitle = template.match(/<h1 class="history-title">([^<]+)<\/h1>/)[1];
  const series = template.match(/<p class="history-series-label">([^<]+)<\/p>/)[1].replace('1.2', '1.3');
  const meta = template.match(/<p class="history-meta">[\s\S]*?<\/p>/)[0].replace('1.2', '1.3');
  const breadcrumbs = template.match(/<nav class="breadcrumbs history-breadcrumbs"[\s\S]*?<\/nav>/)[0].replace('1.2', '1.3');
  const scienceLabel = template.match(/href="[^"]*science\/" class="nav-link"[^>]*>([^<]+)<\/a>/)[1];
  const schemas = html => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
  const prior = existing && schemas(existing).find(schema => schema['@type'] === 'Article');
  const published = prior ? prior.datePublished : today;
  const modified = prior ? prior.dateModified : today;
  let page = styles(template.replaceAll(PREVIOUS_SLUG, EPISODE13_SLUG));
  const image = EPISODE13_IMAGES['nebamun-receiving-wine'];
  const socialImage = `${ORIGIN}/${EPISODE13_ASSETS}/${episode13Variant(image, image.width)}`;
  page = page.replace(/<body class="[^"]+">/, '<body class="history-article-page history-records-page history-egypt-page">')
    .replace(/(<meta (?:name|property)="(?:og:image|twitter:image)" content=")[^"]*(">)/g, `$1${socialImage}$2`)
    .replace(/<main>[\s\S]*?<\/main>/, `<main>
        <header class="history-hero">
            <div class="container">
                ${breadcrumbs}
                <p class="history-series-label">${series}</p>
                <h1 class="history-title">${escapeHtml(parsed.title)}</h1>
                ${meta}
                <p class="history-subtitle">${parsed.subtitle}</p>
                <div class="history-standfirst">
                    ${parsed.intro.join('\n                    ')}
                </div>
                ${parsed.lead}
            </div>
        </header>
        <article class="history-article">
            <div class="history-copy">
${parsed.body.split('\n').map(line => `                ${line}`).join('\n')}
                <nav class="history-series-navigation" aria-label="${series}">
                    <a href="/${prefix}science/${PREVIOUS_SLUG}" rel="prev"><span>${EPISODE13_LOCALES[locale].previous}</span><strong>${previousTitle}</strong></a>
                    <a href="/${prefix}science/">${scienceLabel} <span aria-hidden="true">↑</span></a>
                </nav>
            </div>
        </article>
    </main>`);
  page = page.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (_match, json) => {
    const schema = JSON.parse(json);
    if (schema['@type'] === 'Article') Object.assign(schema, { headline: parsed.title, description: EPISODE13_LOCALES[locale].description, image: socialImage, url, datePublished: published, dateModified: modified, inLanguage: locale, mainEntityOfPage: { '@type': 'WebPage', '@id': url } });
    else if (schema['@type'] === 'BreadcrumbList') Object.assign(schema.itemListElement[2], { name: parsed.title, item: url });
    return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2).replaceAll('<', '\\u003c')}\n    </script>`;
  });
  const dateValue = (kind, date) => {
    const old = existing?.match(new RegExp(`<meta property="article:${kind}_time" content="([^"]+)"`))?.[1];
    return old?.slice(0, 10) === date ? old : `${date}T00:00:00Z`;
  };
  page = page.replace(/(<meta property="article:published_time" content=")[^"]+/, `$1${dateValue('published', published)}`)
    .replace(/(<meta property="article:modified_time" content=")[^"]+/, `$1${dateValue('modified', modified)}`);
  page = applyScienceSearchMetadata(page, locale, 'episode13');
  if (existing && page !== existing) page = page.replace(/("dateModified": ")[^"]+/, `$1${today}`)
    .replace(/(<meta property="article:modified_time" content=")[^"]+/, `$1${dateValue('modified', today)}`);
  return page;
}

export function syncEpisode13(sourceDirectory, { check = false, locale: requestedLocale } = {}) {
  if (requestedLocale && !Object.hasOwn(EPISODE13_LOCALES, requestedLocale)) throw new Error(`Unknown Episode 1.3 locale: ${requestedLocale}`);
  const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin' }).format(new Date());
  // Validate all human-selected sources and credited originals before any write.
  const parsed = Object.fromEntries(Object.entries(EPISODE13_SOURCES).map(([locale, selected]) => {
    const path = join(sourceDirectory, selected.file), bytes = readFileSync(path);
    if (digest(bytes) !== selected.sha256) throw new Error(`Selected source changed; review before importing: ${path}`);
    return [locale, parseEpisode13(bytes.toString('utf8'), locale)];
  }));
  for (const image of Object.values(EPISODE13_IMAGES)) {
    if (digest(readFileSync(join(ROOT, EPISODE13_ASSETS, image.file))) !== image.sha256) throw new Error(`Unapproved Egypt original: ${image.file}`);
    for (const width of episode13Widths(image)) if (!existsSync(join(ROOT, EPISODE13_ASSETS, episode13Variant(image, width)))) throw new Error('Run the Episode 1.3 image builder first');
  }
  const changes = [];
  const queue = (path, text) => { if (!existsSync(path) || read(path) !== text) changes.push({ path, text }); };
  for (const locale of requestedLocale ? [requestedLocale] : Object.keys(EPISODE13_LOCALES)) {
    const prefix = episode13Prefix(locale), copy = EPISODE13_LOCALES[locale];
    const previousPath = join(ROOT, prefix, 'science', PREVIOUS_SLUG), previous = read(previousPath);
    const path = join(ROOT, prefix, 'science', EPISODE13_SLUG), existing = existsSync(path) ? read(path) : null;
    queue(path, renderPage(previous, parsed[locale], locale, today, existing));
    let linked = linkNextHistoryEpisode(previous, { href: `/${prefix}science/${EPISODE13_SLUG}`, label: copy.next, title: escapeHtml(parsed[locale].title) });
    if (linked !== previous) linked = styles(linked).replace(/("dateModified": ")[^"]+/, `$1${today}`)
      .replace(/(<meta property="article:modified_time" content=")[^"]+/, `$1${today}T00:00:00Z`);
    queue(previousPath, linked);
    const hubPath = join(ROOT, prefix, 'science/index.html'), hub = read(hubPath);
    const cards = [...hub.matchAll(/<article class="science-episode-card">[\s\S]*?<\/article>/g)].map(m => m[0]);
    const previousCard = cards.find(card => card.includes(PREVIOUS_SLUG));
    if (!previousCard) throw new Error(`Missing previous hub card: ${locale}`);
    const card = previousCard.replaceAll(PREVIOUS_SLUG, EPISODE13_SLUG).replaceAll('1.2', '1.3')
      .replace(/<h3>[^<]+<\/h3>/, `<h3>${escapeHtml(parsed[locale].title)}</h3>`)
      .replace(/(<\/h3>\s*<p>)[\s\S]*?(<\/p>)/, `$1${escapeHtml(copy.description)}$2`);
    const currentCard = cards.find(c => c.includes(EPISODE13_SLUG));
    let updatedHub = currentCard ? hub.replace(currentCard, card) : hub.replace(previousCard, `${previousCard}\n                ${card}`);
    updatedHub = updatedHub.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/, (_match, json) => {
      const schema = JSON.parse(json), url = `${ORIGIN}/${prefix}science/${EPISODE13_SLUG}`;
      schema.hasPart = [...schema.hasPart.filter(part => part.url !== url), { '@type': 'Article', headline: parsed[locale].title, url }];
      return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
    });
    queue(hubPath, updatedHub);
  }
  const sitemapPath = join(ROOT, 'sitemap.xml');
  let sitemap = read(sitemapPath);
  for (const locale of requestedLocale ? [requestedLocale] : Object.keys(EPISODE13_LOCALES)) {
    const url = `${ORIGIN}/${episode13Prefix(locale)}science/${EPISODE13_SLUG}`;
    if (sitemap.includes(`<loc>${url}</loc>`)) continue;
    const alternates = [...Object.keys(EPISODE13_LOCALES), 'x-default'].map(l => `    <xhtml:link rel="alternate" hreflang="${l}" href="${ORIGIN}/${episode13Prefix(l === 'x-default' ? 'en' : l)}science/${EPISODE13_SLUG}"/>`).join('\n');
    sitemap = sitemap.replace('</urlset>', `  <url>\n    <loc>${url}</loc>\n${alternates}\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n</urlset>`);
  }
  queue(sitemapPath, sitemap);
  if (check && changes.length) throw new Error(`Episode 1.3 differs from selected sources/navigation: ${changes.map(change => change.path).join(', ')}`);
  if (!check) for (const { path, text } of changes) writeFileSync(path, text.replaceAll('\n', '\r\n'));
  console.log(check ? 'Verified selected English/V2 Egypt text, illustrations, navigation and sitemap.' : `Synchronized Episode 1.3: ${changes.length} files updated; no commit, push or deployment.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { sourceDirectory, ...options } = parseEpisode13Options(process.argv.slice(2));
  syncEpisode13(sourceDirectory, options);
}
