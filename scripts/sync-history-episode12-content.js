import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { EPISODE12_ASSETS, EPISODE12_IMAGES, EPISODE12_LOCALES, EPISODE12_SLUG, EPISODE12_SOURCE, EPISODE12_STYLES, editionPrefix, imageVariant, imageWidths } from './history-episode12-config.js';

const ROOT = resolve(import.meta.dirname, '..');
const ORIGIN = 'https://mindrink.me';
const read = path => readFileSync(path, 'utf8').replaceAll('\r\n', '\n');
const refreshStyles = html => html.replace(/href="\/styles\.css(?:\?[^\"]*)?"/g, `href="/styles.css?v=${EPISODE12_STYLES}"`);
export const escapeHtml = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function inline(markdown, locale, citations = true) {
  const links = [];
  let text = markdown.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_match, label, url) => {
    links.push(`<a href="${escapeHtml(url)}" rel="noopener noreferrer">${escapeHtml(label)}</a>`);
    return `LINKTOKEN${links.length - 1}ENDTOKEN`;
  });
  text = escapeHtml(text).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>');
  if (citations) text = text.replace(/\[(\d+)\]/g, `<a class="citation" href="#ref-$1" aria-label="${EPISODE12_LOCALES[locale].reference} $1">[$1]</a>`);
  return text.replace(/LINKTOKEN(\d+)ENDTOKEN/g, (_match, index) => links[index]);
}

function figureHtml(block, locale, key) {
  const image = EPISODE12_IMAGES[key];
  if (!image) throw new Error(`Unknown illustration: ${key}`);
  const match = block.match(/^!\[([^\]]+)\]\(_assets\/selected\/([^\s)]+)\)\n\n\*([\s\S]+?)\*\n\n([\s\S]+)$/);
  if (!match || match[2] !== image.file) throw new Error(`Review illustration structure: ${locale}/${key}`);
  const [, alt, , caption, credit] = match;
  const widths = imageWidths(image);
  const portrait = image.height > image.width;
  const classes = ['history-figure', portrait && 'history-figure--portrait', key === 'ur-ziggurat' && 'history-figure--lead'].filter(Boolean).join(' ');
  const sizes = portrait
    ? '(max-width: 480px) 62vw, (max-width: 767px) 320px, 570px'
    : '(max-width: 480px) 72vw, (max-width: 767px) 480px, (max-width: 900px) calc(100vw - 40px), 840px';
  const srcset = widths.map(width => `/${EPISODE12_ASSETS}/${imageVariant(image, width)} ${width}w`).join(', ');
  return `<figure class="${classes}" data-illustration="${key}">
    <img src="/${EPISODE12_ASSETS}/${imageVariant(image, widths[1])}" srcset="${srcset}" sizes="${sizes}" alt="${escapeHtml(alt)}" width="${image.width}" height="${image.height}" style="--history-image-ratio: ${image.width} / ${image.height}" ${key === 'ur-ziggurat' ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} decoding="async">
    <figcaption>${inline(caption.replace(/\n/g, ' '), locale, false)} <span class="history-image-credit">${inline(credit.replace(/\n/g, ' '), locale, false)}</span></figcaption>
</figure>`;
}

function comparisonHtml(block, locale) {
  const [heading, table] = block.trim().split(/\n\s*\n/);
  if (!heading?.startsWith('### ') || !table) throw new Error(`Invalid comparison: ${locale}`);
  const rows = table.split('\n').map(row => row.trim().replace(/^\||\|$/g, '').split('|').map(cell => cell.trim()));
  if (rows.length !== 6 || rows.some(row => row.length !== 3) || !rows[1].every(cell => /^:?-+:?$/.test(cell))) {
    throw new Error(`Expected three columns and four source types: ${locale}`);
  }
  const headers = rows[0];
  return `<div class="history-source-comparison">
    <h3 id="reading-sources-title">${inline(heading.slice(4), locale, false)}</h3>
    <table class="history-source-table" aria-labelledby="reading-sources-title" role="table">
        <thead role="rowgroup"><tr role="row">${headers.map((cell, i) => `<th id="source-col-${i}" scope="col" role="columnheader">${inline(cell, locale, false)}</th>`).join('')}</tr></thead>
        <tbody role="rowgroup">
${rows.slice(2).map((row, i) => `            <tr role="row"><th id="source-row-${i}" scope="row" role="rowheader">${inline(row[0], locale)}</th>${row.slice(1).map((cell, j) => `<td role="cell" headers="source-row-${i} source-col-${j + 1}"><span class="history-source-label" aria-hidden="true">${inline(headers[j + 1], locale, false)}</span>${inline(cell, locale)}</td>`).join('')}</tr>`).join('\n')}
        </tbody>
    </table>
</div>`;
}

export function parseEpisode12(markdown, locale) {
  let source = markdown.replaceAll('\r\n', '\n').trim();
  const title = source.match(/^# ([^\n]+)\n/)?.[1];
  if (!title) throw new Error(`Missing title: ${locale}`);
  source = source.replace(/^# [^\n]+\n+/, '');
  const figures = [];
  source = source.replace(/<!-- illustration: ([\w-]+) -->\s*([\s\S]*?)\s*<!-- \/illustration -->/g, (_match, key, block) => {
    figures.push({ key, html: figureHtml(block.trim(), locale, key) });
    return `FIGURETOKEN${figures.length - 1}ENDTOKEN`;
  });
  if (figures.map(figure => figure.key).join() !== Object.keys(EPISODE12_IMAGES).join()) throw new Error(`Review figure order: ${locale}`);
  const comparisons = [];
  source = source.replace(/<!-- comparison: reading-the-sources -->\s*([\s\S]*?)\s*<!-- \/comparison -->/g, (_match, block) => {
    comparisons.push(comparisonHtml(block, locale));
    return 'COMPARISONTOKEN';
  });
  if (comparisons.length !== 1 || /<!--|!\[/.test(source)) throw new Error(`Unsupported source markers: ${locale}`);
  const blocks = source.split(/\n\s*\n/).map(block => block.trim()).filter(Boolean);
  if (blocks.shift() !== 'FIGURETOKEN0ENDTOKEN') throw new Error(`Expected opening image immediately below title: ${locale}`);
  const intro = [];
  while (blocks.length && !blocks[0].startsWith('## ')) intro.push(blocks.shift());
  if (intro.length !== 5) throw new Error(`Review introduction structure: ${locale}`);
  const html = intro.slice(1).map(text => `<p>${inline(text.replace(/\n/g, ' '), locale)}</p>`);
  const ids = ['accounts-title', 'vessel-title', 'people-gods-title', 'references-title'];
  let section = -1;
  let open = false;
  let references = false;
  let referenceCount = 0;
  for (const block of blocks) {
    if (block.startsWith('## ')) {
      if (open) html.push('</section>');
      section += 1;
      references = section === 3;
      open = true;
      html.push(`<section${references ? ' class="history-references"' : ''} aria-labelledby="${ids[section]}">`, `<h2 id="${ids[section]}">${inline(block.slice(3), locale, false)}</h2>`);
      if (references) html.push('<ol>');
    } else if (references) {
      const match = block.match(/^(\d+)\.\s+([\s\S]+)$/);
      if (!match || Number(match[1]) !== ++referenceCount) throw new Error(`Nonsequential reference: ${locale}`);
      html.push(`<li id="ref-${match[1]}">${inline(match[2].replace(/\n/g, ' '), locale)}</li>`);
    } else if (/^FIGURETOKEN\d+ENDTOKEN$/.test(block)) {
      html.push(figures[Number(block.match(/\d+/)[0])].html);
    } else if (block === 'COMPARISONTOKEN') {
      html.push(comparisons[0]);
    } else if (block === '---') {
      if (open) html.push('</section>');
      open = false;
      html.push('<hr class="history-section-break">');
    } else {
      if (/^(#|\||\*\*|<!--)/.test(block)) throw new Error(`Unsupported Markdown block: ${locale}: ${block.slice(0, 60)}`);
      html.push(`<p>${inline(block.replace(/\n/g, ' '), locale)}</p>`);
    }
  }
  if (section !== 3 || referenceCount !== 11) throw new Error(`Review section/reference structure: ${locale}`);
  html.push('</ol>', '</section>');
  const body = html.join('\n');
  if ([...body.matchAll(/href="#ref-(\d+)"/g)].some(match => Number(match[1]) > referenceCount)) throw new Error(`Unresolved citation: ${locale}`);
  return { title, lead: figures[0].html, deck: inline(intro[0].replace(/\n/g, ' '), locale), body };
}

function renderPage(template, previous, parsed, locale, today) {
  const prefix = editionPrefix(locale);
  const url = `${ORIGIN}/${prefix}science/${EPISODE12_SLUG}`;
  const label = previous.match(/<p class="history-meta"><span>[^<]+<\/span><span>([^<]+)<\/span>/)[1].replace('1.1', '1.2');
  const series = previous.match(/<p class="history-series-label">([^<]+)<\/p>/)[1].replace('1.1', '1.2');
  const breadcrumbs = previous.match(/<nav class="breadcrumbs history-breadcrumbs"[\s\S]*?<\/nav>/)[0].replace(/<span>[^<]+<\/span>(\s*<\/nav>)$/, `<span>${label}</span>$1`);
  const meta = previous.match(/<p class="history-meta">[\s\S]*?<\/p>/)[0].replace('1.1', '1.2');
  const previousTitle = previous.match(/<h1 class="history-title">([^<]+)<\/h1>/)[1];
  const scienceLabel = previous.match(/href="[^\"]*science\/" class="nav-link"[^>]*>([^<]+)<\/a>/)[1];
  let page = refreshStyles(template.replaceAll('who-invented-alcohol.html', EPISODE12_SLUG));
  page = page.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(parsed.title)} | Mindrink</title>`)
    .replace(/(<meta (?:name|property)="(?:description|og:description|twitter:description)" content=")[^"]*(">)/g, (_match, start, end) => `${start}${escapeHtml(EPISODE12_LOCALES[locale].description)}${end}`)
    .replace(/(<meta (?:name|property)="(?:og:title|twitter:title)" content=")[^"]*(">)/g, (_match, start, end) => `${start}${escapeHtml(parsed.title)}${end}`)
    .replace(/(<meta (?:name|property)="(?:og:image|twitter:image)" content=")[^"]*(">)/g, `$1${ORIGIN}/${EPISODE12_ASSETS}/ur-ziggurat-lubinski-1440.webp$2`)
    .replace(/<body class="[^"]+">/, '<body class="history-article-page history-records-page">')
    .replace(/<main>[\s\S]*?<\/main>/, `<main>
        <header class="history-hero">
            <div class="container">
                ${breadcrumbs}
                <p class="history-series-label">${series}</p>
                <h1 class="history-title">${escapeHtml(parsed.title)}</h1>
                ${meta}
                ${parsed.lead}
                <p class="history-deck">${parsed.deck}</p>
            </div>
        </header>
        <article class="history-article">
            <div class="history-copy">
${parsed.body.split('\n').map(line => `                ${line}`).join('\n')}
                <nav class="history-series-navigation" aria-label="${series}">
                    <a href="/${prefix}science/who-invented-alcohol.html" rel="prev"><span>${EPISODE12_LOCALES[locale].previous}</span><strong>${previousTitle}</strong></a>
                    <a href="/${prefix}science/">${scienceLabel} <span aria-hidden="true">↑</span></a>
                </nav>
            </div>
        </article>
    </main>`);
  const existingArticle = [...template.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1])).find(schema => schema['@type'] === 'Article');
  // Dates are stable on a no-op import; a dev source date is not release evidence.
  const isNew = !template.includes('history-records-page');
  const published = isNew ? today : existingArticle.datePublished;
  const modified = isNew ? today : existingArticle.dateModified;
  // Retain an explicitly set release timestamp/offset on no-op imports.
  const socialDate = (property, date) => {
    const existing = template.match(new RegExp(`<meta property="article:${property}_time" content="([^"]+)"`))?.[1];
    return !isNew && existing?.slice(0, 10) === date ? existing : `${date}T00:00:00Z`;
  };
  page = page.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (_match, json) => {
    const schema = JSON.parse(json);
    if (schema['@type'] === 'Article') {
      delete schema.alternativeHeadline;
      Object.assign(schema, { headline: parsed.title, description: EPISODE12_LOCALES[locale].description, image: `${ORIGIN}/${EPISODE12_ASSETS}/ur-ziggurat-lubinski-1440.webp`, url, datePublished: published, dateModified: modified, inLanguage: locale });
      schema.mainEntityOfPage['@id'] = url;
    } else if (schema['@type'] === 'BreadcrumbList') {
      Object.assign(schema.itemListElement[2], { name: parsed.title, item: url });
    }
    return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n    </script>`;
  });
  page = page.replace(/(<meta property="article:published_time" content=")[^"]+/, `$1${socialDate('published', published)}`)
    .replace(/(<meta property="article:modified_time" content=")[^"]+/, `$1${socialDate('modified', modified)}`);
  if (page !== template) page = page.replace(/("dateModified": ")[^"]+/, `$1${today}`)
    .replace(/(<meta property="article:modified_time" content=")[^"]+/, `$1${socialDate('modified', today)}`);
  return page;
}

export function syncEpisode12(sourceDirectory, { check = false } = {}) {
  const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin' }).format(new Date());
  const changes = [];
  const queue = (path, text) => { if (!existsSync(path) || read(path) !== text) changes.push({ path, text }); };
  // Validate every source/asset before writing any of the eight editions.
  for (const image of Object.values(EPISODE12_IMAGES)) {
    for (const path of [join(sourceDirectory, '_assets', 'selected', image.file), join(ROOT, EPISODE12_ASSETS, image.file)]) {
      if (createHash('sha256').update(readFileSync(path)).digest('hex') !== image.sha256) throw new Error(`Unapproved original: ${path}`);
    }
    for (const width of imageWidths(image)) {
      if (!existsSync(join(ROOT, EPISODE12_ASSETS, imageVariant(image, width)))) throw new Error('Run the Episode 1.2 image builder first.');
    }
  }
  for (const locale of Object.keys(EPISODE12_LOCALES)) {
    const parsed = parseEpisode12(read(join(sourceDirectory, `${EPISODE12_SOURCE}${locale === 'en' ? '' : '.' + locale}.md`)), locale);
    const prefix = editionPrefix(locale);
    const previousPath = join(ROOT, prefix, 'science/who-invented-alcohol.html');
    const previous = read(previousPath);
    const path = join(ROOT, prefix, 'science', EPISODE12_SLUG);
    const template = existsSync(path) ? read(path) : previous;
    queue(path, renderPage(template, previous, parsed, locale, today));

    const hubPath = join(ROOT, prefix, 'science/index.html');
    let hub = refreshStyles(read(hubPath));
    const firstCard = hub.match(/<article class="science-episode-card">[\s\S]*?<\/article>/)[0];
    const card = firstCard.replaceAll('1.1', '1.2').replaceAll('who-invented-alcohol.html', EPISODE12_SLUG)
      .replace(/<h3>[^<]+<\/h3>/, `<h3>${escapeHtml(parsed.title)}</h3>`)
      .replace(/(<\/h3>\s*<p>)[\s\S]*?(<\/p>)/, `$1${escapeHtml(EPISODE12_LOCALES[locale].description)}$2`);
    const currentCard = [...hub.matchAll(/<article class="science-episode-card">[\s\S]*?<\/article>/g)].map(match => match[0]).find(html => html.includes(EPISODE12_SLUG));
    hub = currentCard ? hub.replace(currentCard, card) : hub.replace(firstCard, `${firstCard}\n                ${card}`);
    hub = hub.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/, (_match, json) => {
      const schema = JSON.parse(json);
      const url = `${ORIGIN}/${prefix}science/${EPISODE12_SLUG}`;
      schema.hasPart = schema.hasPart.filter(part => part.url !== url);
      schema.hasPart.push({ '@type': 'Article', headline: parsed.title, url });
      return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
    });
    queue(hubPath, hub);

    const nextLabel = previous.match(/<div class="history-next">\s*<p>([^<]+)<\/p>/)[1];
    const episodeLabel = previous.match(/<p class="history-meta"><span>[^<]+<\/span><span>([^<]+)<\/span>/)[1].replace('1.1', '1.2');
    let linkedPrevious = refreshStyles(previous).replace(/<div class="history-next">[\s\S]*?<\/div>/, `<div class="history-next">\n                        <p>${nextLabel}</p>\n                        <strong><a href="/${prefix}science/${EPISODE12_SLUG}" rel="next">${episodeLabel} — ${escapeHtml(parsed.title)}</a></strong>\n                    </div>`);
    if (linkedPrevious !== previous) linkedPrevious = linkedPrevious.replace(/("dateModified": ")[^"]+/, `$1${today}`)
      .replace(/(<meta property="article:modified_time" content=")[^"]+/, `$1${today}T00:00:00Z`);
    queue(previousPath, linkedPrevious);
  }
  const sitemapPath = join(ROOT, 'sitemap.xml');
  let sitemap = read(sitemapPath);
  for (const locale of Object.keys(EPISODE12_LOCALES)) {
    const url = `${ORIGIN}/${editionPrefix(locale)}science/${EPISODE12_SLUG}`;
    if (sitemap.includes(`<loc>${url}</loc>`)) continue;
    const alternates = [...Object.keys(EPISODE12_LOCALES), 'x-default'].map(language => `    <xhtml:link rel="alternate" hreflang="${language}" href="${ORIGIN}/${editionPrefix(language === 'x-default' ? 'en' : language)}science/${EPISODE12_SLUG}"/>`).join('\n');
    sitemap = sitemap.replace('</urlset>', `  <url>\n    <loc>${url}</loc>\n${alternates}\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n</urlset>`);
  }
  queue(sitemapPath, sitemap);
  if (check && changes.length) throw new Error(`Episode 1.2 differs from source: ${changes.map(change => change.path).join(', ')}`);
  if (!check) for (const { path, text } of changes) writeFileSync(path, text.replaceAll('\n', '\r\n'));
  console.log(check ? 'Verified all eight Episode 1.2 editions, navigation and approved originals.' : `Synchronized Episode 1.2: ${changes.length} files updated.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (!process.argv[2]) throw new Error('Usage: node scripts/sync-history-episode12-content.js <source-directory> [--check]');
  syncEpisode12(resolve(process.argv[2]), { check: process.argv.includes('--check') });
}
