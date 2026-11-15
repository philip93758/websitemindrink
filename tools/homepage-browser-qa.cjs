// Offline browser checks: all website files and analytics are served in memory.
const { chromium } = require(process.env.MINDRINK_PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const { readFileSync, mkdirSync } = require('node:fs');
const { resolve, join, extname, sep } = require('node:path');

const root = resolve(__dirname, '..');
const origin = 'http://127.0.0.1:4181';
const locale = process.env.MINDRINK_HOMEPAGE_LOCALE || 'en';
const copy = {
    en: { path: '/', heading: 'Mindrink: a free alcohol tracker', menu: 'Toggle menu', how: 'How it works', discover: 'Discover', nav: ['Why Mindrink', 'How it works', 'Discover', 'Science', 'About'] },
    fr: { path: '/fr/', heading: 'Mindrink : suivi gratuit de la consommation d\u2019alcool', menu: 'Afficher le menu', how: 'Comment \u00e7a marche', discover: 'D\u00e9couvrir', nav: ['Pourquoi Mindrink', 'Comment \u00e7a marche', 'D\u00e9couvrir', 'Science', '\u00c0 propos'] },
    de: { path: '/de/', heading: 'Mindrink: ein kostenloser Alkohol-Tracker', menu: 'Men\u00fc \u00f6ffnen', how: 'So funktioniert es', discover: 'Entdecken', nav: ['Warum Mindrink', 'So funktioniert es', 'Entdecken', 'Wissenschaft', '\u00dcber uns'] },
    es: { path: '/es/', heading: 'Mindrink: registro gratuito de consumo de alcohol', menu: 'Abrir men\u00fa', how: 'C\u00f3mo funciona', discover: 'Descubrir', nav: ['Por qu\u00e9 Mindrink', 'C\u00f3mo funciona', 'Descubrir', 'Ciencia', 'Acerca de'] },
    pt: { path: '/pt/', heading: 'Mindrink: acompanhamento gratuito do consumo de \u00e1lcool', menu: 'Abrir menu', how: 'Como funciona', discover: 'Descobrir', nav: ['Por que Mindrink', 'Como funciona', 'Descobrir', 'Ci\u00eancia', 'Sobre'] },
    id: { path: '/id/', heading: 'Mindrink: pelacak konsumsi alkohol gratis', menu: 'Buka menu', how: 'Cara kerja', discover: 'Jelajahi', nav: ['Mengapa Mindrink', 'Cara kerja', 'Jelajahi', 'Sains', 'Tentang'] },
    it: { path: '/it/', heading: 'Mindrink: un tracker gratuito del consumo di alcol', menu: 'Apri menu', how: 'Come funziona', discover: 'Scopri', nav: ['Perch\u00e9 Mindrink', 'Come funziona', 'Scopri', 'Scienza', 'Chi siamo'] },
    ja: { path: '/ja/', heading: 'Mindrink：無料の飲酒記録アプリ', menu: 'メニューを開く', how: '使い方', discover: 'ガイド', nav: ['私たちの考え方', '使い方', 'ガイド', '科学', 'Mindrinkについて'] },
}[locale];
assert.ok(copy, 'Homepage browser checks require a supported locale');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.jpg': 'image/jpeg' };
const sizes = [[320, 568], [320, 844], [359, 800], [360, 800], [390, 667], [390, 844], [430, 932], [600, 844], [601, 844], [767, 1024], [768, 1024], [900, 900], [901, 900], [1000, 800], [1024, 768], [1280, 800], [1440, 720], [1440, 900], [1920, 1080]];
const sdk = 'let options; export default {init(token,config){options=config},capture(event,properties){const safe=options.before_send({event,properties:{...properties,distinct_id:"test-memory",$current_url:location.href,drink_amount:999}});if(safe)window.__events.push(safe)}};';

async function main() {
    const channel = process.env.MINDRINK_BROWSER_CHANNEL || (process.platform === 'win32' ? 'msedge' : undefined);
    const launchOptions = { headless: true, ...(process.env.MINDRINK_BROWSER_EXECUTABLE ? { executablePath: process.env.MINDRINK_BROWSER_EXECUTABLE } : channel ? { channel } : {}) };
    const browser = await chromium.launch(launchOptions);
    const errors = [], external = [], missing = [], reports = [], scrollbarReports = [];
    async function setup(width, height, mode = 'disabled', targetBrowser = browser) {
        const context = await targetBrowser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: 'reduce', serviceWorkers: 'block', javaScriptEnabled: mode !== 'no-js' });
        const analyticsLoads = [];
        await context.addInitScript(mode => {
            window.__events = [];
            if (mode === 'gpc') Object.defineProperty(navigator, 'globalPrivacyControl', { value: true });
            if (mode === 'dnt') Object.defineProperty(navigator, 'doNotTrack', { value: '1' });
            if (mode === 'optout') localStorage.setItem('mindrink_analytics_opt_out', 'true');
        }, mode);
        await context.route('**/*', async route => {
            const url = new URL(route.request().url());
            if (url.origin !== origin) { external.push(url.origin); return route.abort(); }
            if (url.pathname === '/scripts/analytics-config.js') {
                analyticsLoads.push('config');
                return route.fulfill({ body: `export const POSTHOG_CONFIG={publicToken:${JSON.stringify(mode === 'disabled' ? '' : 'phc_test')},apiHost:"https://eu.i.posthog.com"};`, contentType: 'text/javascript' });
            }
            if (url.pathname === '/scripts/vendor/posthog.js') {
                analyticsLoads.push('sdk');
                return route.fulfill({ body: sdk, contentType: 'text/javascript' });
            }
            let file = resolve(root, '.' + decodeURIComponent(url.pathname));
            if (file !== root && !file.startsWith(root + sep)) return route.abort();
            if (url.pathname.endsWith('/')) file = join(file, 'index.html');
            try { return await route.fulfill({ body: readFileSync(file), contentType: types[extname(file)] || 'application/octet-stream' }); }
            catch { missing.push(url.pathname); return route.fulfill({ status: 404, body: '' }); }
        });
        const page = await context.newPage();
        page.setDefaultTimeout(8000);
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(origin + copy.path);
        return { context, page, analyticsLoads };
    }
    async function screenshot(page, name, fullPage = false) {
        if (!process.env.MINDRINK_QA_SCREENSHOT_DIR) return;
        mkdirSync(process.env.MINDRINK_QA_SCREENSHOT_DIR, { recursive: true });
        await page.screenshot({ path: join(process.env.MINDRINK_QA_SCREENSHOT_DIR, name + '.png'), fullPage });
    }
    try {
        for (const [width, height] of sizes) {
            const { context, page } = await setup(width, height);
            try {
                for (const image of await page.locator('img').all()) {
                    await image.scrollIntoViewIfNeeded();
                    await image.evaluate(image => image.decode());
                }
                await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
                const result = await page.evaluate(() => {
                    const box = element => { const r = element.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width, height: r.height }; };
                    const hero = document.getElementById('home');
                    const heading = document.getElementById('hero-title');
                    const phone = document.querySelector('.home-phone');
                    const copy = document.querySelector('.home-hero-copy');
                    const artImage = document.querySelector('.home-hero-artwork img');
                    const canvas = document.createElement('canvas');
                    canvas.width = artImage.naturalWidth;
                    canvas.height = artImage.naturalHeight;
                    const pixels = canvas.getContext('2d');
                    pixels.drawImage(artImage, 0, 0);
                    const badgeFace = image => {
                        const surface = document.createElement('canvas');
                        surface.width = image.naturalWidth;
                        surface.height = image.naturalHeight;
                        const context = surface.getContext('2d');
                        context.drawImage(image, 0, 0);
                        const data = context.getImageData(0, 0, surface.width, surface.height).data;
                        let top = surface.height, bottom = -1, left = surface.width, right = -1;
                        for (let y = 0; y < surface.height; y++) for (let x = 0; x < surface.width; x++) {
                            if (data[(y * surface.width + x) * 4 + 3] <= 128) continue;
                            top = Math.min(top, y); bottom = Math.max(bottom, y);
                            left = Math.min(left, x); right = Math.max(right, x);
                        }
                        const rectangle = image.getBoundingClientRect();
                        const scaleX = rectangle.width / surface.width, scaleY = rectangle.height / surface.height;
                        return {
                            height: (bottom - top + 1) * scaleY,
                            centerY: rectangle.top + (top + bottom + 1) * scaleY / 2,
                            left: rectangle.left + left * scaleX,
                            right: rectangle.left + (right + 1) * scaleX,
                        };
                    };
                    return {
                        width: innerWidth, height: innerHeight, documentWidth: document.documentElement.scrollWidth,
                        heading: heading.textContent, hero: box(hero), heroCopy: box(copy), art: box(document.querySelector('.home-hero-artwork')),
                        copyVisible: getComputedStyle(copy).display !== 'none',
                        artworkSource: new URL(artImage.currentSrc).pathname,
                        heroBackground: getComputedStyle(hero).backgroundColor,
                        artworkAlpha: {
                            corner: pixels.getImageData(0, 0, 1, 1).data[3],
                            base: pixels.getImageData(Math.floor(canvas.width / 2), canvas.height - 3, 1, 1).data[3],
                        },
                        screen: box(phone), analyticsHeading: box(document.getElementById('app-title')),
                        loggingHeading: box(document.getElementById('logging-title')),
                        product: box(document.getElementById('how-it-works')),
                        supportsSubgrid: CSS.supports('grid-template-rows', 'subgrid'),
                        productCopyGaps: [
                            box(document.querySelector('.home-analysis-row .home-phone')).top - box(document.querySelector('.home-analysis-copy p')).bottom,
                            box(document.querySelector('.home-logging-row .home-phone')).top - box(document.querySelector('.home-logging-copy p')).bottom,
                        ],
                        productBackground: getComputedStyle(document.getElementById('how-it-works')).backgroundColor,
                        productOverlay: getComputedStyle(document.getElementById('how-it-works'), '::before').content,
                        loggingBackground: getComputedStyle(document.getElementById('drink-logging')).backgroundColor,
                        storyCopy: box(document.querySelector('.home-story-copy')),
                        questionColumns: [...document.querySelectorAll('.home-questions > div')].map(box),
                        heroText: box(document.querySelector('.home-hero-text')),
                        heroStores: [...hero.querySelectorAll('a.btn')].map(box),
                        heroBadgeFaces: [...hero.querySelectorAll('.home-store-link img')].map(badgeFace),
                        sections: [...document.querySelectorAll('main > section')].map(section => section.id),
                        phones: [...document.querySelectorAll('.home-phone')].map(box),
                        assets: [...document.images].every(image => image.complete && image.naturalWidth > 0),
                        overflowing: [...document.querySelectorAll('body *')].filter(element => {
                            if (!element.getClientRects().length || getComputedStyle(element).visibility === 'hidden' || element.classList.contains('home-skip-link')) return false;
                            const r = element.getBoundingClientRect(); return r.left < -1 || r.right > innerWidth + 1;
                        }).map(element => element.className || element.tagName),
                        closingStores: [...document.querySelectorAll('#download .home-store-link')].map(box),
                        facts: box(document.querySelector('.home-download-facts')),
                        headerLinks: [...document.querySelectorAll('.nav > .nav-link')].map(link => link.textContent),
                        headerBrand: box(document.querySelector('.logo-section')),
                        headerNav: box(document.querySelector('.nav')),
                    };
                });
                await screenshot(page, `homepage-${width}-${height}-top`);
                if ((width === 1440 && height === 900) || (width === 390 && height === 844)) await screenshot(page, `homepage-${width}-full`, true);
                assert.equal(result.documentWidth, width);
                assert.deepEqual(result.overflowing, [], `No overflow at ${width}x${height}`);
                assert.equal(result.heading, copy.heading);
                assert.ok(result.copyVisible && result.heroCopy.height > 0);
                assert.ok(result.heroStores.every(box => box.top >= 0 && box.bottom < height), 'Both hero store choices stay in the first screen');
                assert.ok(result.art.left >= result.heroText.right - 1 || result.art.top >= result.heroText.bottom - 1, 'Hero text and seated pair do not overlap');
                assert.ok(result.screen.top >= result.hero.bottom && result.art.bottom <= result.hero.bottom + 1);
                assert.ok(Math.abs(result.hero.bottom - result.art.bottom - 1) < 1, 'Bench frame meets the hero boundary without a floating gap');
                assert.match(result.artworkSource, /\/romans-seated-ac-\d+\.webp$/);
                assert.equal(result.heroBackground, 'rgb(255, 244, 230)');
                assert.equal(result.artworkAlpha.corner, 0, 'Artwork has no baked-in rectangular background');
                assert.ok(result.artworkAlpha.base > 200, 'Bench artwork reaches the bottom of its image');
                assert.ok(result.phones.every(box => box.width === (width < 768 ? 260 : 280)));
                assert.deepEqual(result.sections, ['home', 'how-it-works', 'questions', 'why-mindrink', 'resources', 'download']);
                assert.deepEqual(result.headerLinks, copy.nav);
                if (locale === 'de' && width >= 768) assert.ok(result.headerNav.left - result.headerBrand.right >= 12, 'Long German navigation labels leave space around the brand');
                assert.ok(result.assets);
                if (width >= 768) assert.ok(result.analyticsHeading.top <= result.screen.top + 40 && result.analyticsHeading.bottom < height, 'Complete desktop analytics heading visible in first screen');
                if (width >= 768) {
                    assert.equal(result.productBackground, 'rgb(255, 255, 255)', 'Desktop product section has one full-width white background');
                    assert.equal(result.productOverlay, 'none', 'No vertical half-width colour overlay');
                    assert.equal(result.loggingBackground, 'rgba(0, 0, 0, 0)', 'Logging does not create a separate desktop colour ribbon');
                    assert.ok(Math.abs(result.analyticsHeading.top - result.loggingHeading.top) < 1, 'Product headings share one top alignment');
                    assert.ok(Math.abs(result.phones[0].top - result.phones[1].top) < 1, 'Both product phones share one top baseline');
                    if (result.supportsSubgrid) {
                        assert.ok(result.productCopyGaps.every(gap => gap >= 23), 'Shared intro row never overlaps a description');
                        if (locale === 'en') assert.ok(result.productCopyGaps.every(gap => gap < 64), 'English shared intro row avoids oversized copy-to-phone gaps');
                        assert.ok(Math.abs(Math.min(...result.productCopyGaps) - 24) < 1, 'Phones follow the taller description with a 24px gap');
                    }
                    assert.ok(result.phones[0].right < result.phones[1].left, 'Desktop demonstrations sit side by side');
                    assert.ok(result.product.height < 960, 'Product demonstrations do not create two phone-height empty bands');
                    assert.ok(Math.abs(result.storyCopy.left - result.questionColumns[1].left) < 1, 'Supporting desktop content shares the same column rails');
                }
                if (width <= 900) {
                    assert.equal(result.art.width, 220, 'All compact hero widths retain the approved artwork proportions');
                    assert.ok(Math.abs(result.heroStores[0].top - result.heroStores[1].top) < 1, 'Hero badges remain on one row');
                    assert.ok(result.heroBadgeFaces.every(face => Math.abs(face.height - 40) < 1), 'Visible store badge faces have equal 40px heights');
                    assert.ok(Math.abs(result.heroBadgeFaces[0].centerY - result.heroBadgeFaces[1].centerY) < 1, 'Visible store badge faces share a baseline');
                    assert.ok(result.heroStores.every(box => box.height >= 44), 'Smaller badges retain generous tap targets');
                    const badgeSpan = result.heroBadgeFaces[1].right - result.heroBadgeFaces[0].left;
                    assert.ok(result.art.width / badgeSpan >= 0.8, 'Artwork is proportionate to the badge pair');
                }
                if (width > 900) {
                    assert.equal(result.art.width, width <= 1150 ? 330 : 400, 'Desktop artwork size is unchanged');
                    assert.equal(result.heroBadgeFaces[0].height, 50, 'Desktop badge size is unchanged');
                }
                if (width <= 390) assert.ok(result.hero.bottom < 570, `Compact hero at ${width}px ends at ${result.hero.bottom}px`);
                if (width <= 390 && height >= 800) assert.ok(result.screen.top < 790, 'Analytics still appears within a tall mobile first screen');
                if (width < 390) assert.ok(result.closingStores[0].bottom <= result.closingStores[1].top);
                assert.ok(result.closingStores.every(box => box.bottom < result.facts.top));
                reports.push(result);
            } finally { await context.close(); }
        }
        for (const width of [320, 390]) {
            const pair = reports.filter(item => item.width === width);
            assert.equal(pair[0].hero.bottom, pair[1].hero.bottom, 'No screen-height-dependent copy hiding');
            assert.equal(pair[0].screen.top, pair[1].screen.top);
        }
        const scrollbarBrowser = await chromium.launch({ ...launchOptions, ignoreDefaultArgs: ['--hide-scrollbars'] });
        try {
            for (const [width, height] of [[320, 568], [390, 844]]) {
                const { context, page } = await setup(width, height, 'disabled', scrollbarBrowser);
                try {
                    for (const image of await page.locator('#home img').all()) await image.evaluate(image => image.decode());
                    const result = await page.evaluate(() => ({
                        width: innerWidth,
                        clientWidth: document.documentElement.clientWidth,
                        scrollWidth: document.documentElement.scrollWidth,
                        heroBottom: document.getElementById('home').getBoundingClientRect().bottom,
                        badges: [...document.querySelectorAll('#home .home-store-link')].map(element => {
                            const r = element.getBoundingClientRect();
                            return { top: r.top, left: r.left, right: r.right, width: r.width, height: r.height };
                        }),
                    }));
                    await screenshot(page, `homepage-${width}-scrollbar-top`);
                    assert.ok(result.clientWidth < result.width, 'Scrollbar regression must actually reserve a visible gutter');
                    assert.ok(result.scrollWidth <= result.clientWidth, 'Scrollbar layout does not overflow horizontally');
                    assert.ok(Math.abs(result.badges[0].top - result.badges[1].top) < 1, 'Scrollbar does not wrap the hero badge pair');
                    assert.ok(result.badges.every(box => box.left >= 0 && box.right <= result.clientWidth && box.height >= 44));
                    assert.ok(result.heroBottom < 570, 'Scrollbar does not stretch the compact hero');
                    scrollbarReports.push(result);
                } finally { await context.close(); }
            }
        } finally { await scrollbarBrowser.close(); }
        {
            const { context, page } = await setup(390, 844);
            try {
                const menu = page.getByRole('button', { name: copy.menu });
                await menu.click();
                assert.equal(await menu.getAttribute('aria-expanded'), 'true');
                await page.keyboard.press('Escape');
                assert.equal(await menu.getAttribute('aria-expanded'), 'false');
                assert.ok(await menu.evaluate(element => element === document.activeElement));
                await menu.click();
                await page.locator('.nav').getByRole('link', { name: copy.how, exact: true }).click();
                assert.equal(await menu.getAttribute('aria-expanded'), 'false');
                await page.waitForFunction(() => Math.abs(document.getElementById('how-it-works').getBoundingClientRect().top - 88) < 2);
                await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
                await menu.click();
                await page.locator('.language-toggle').click();
                assert.deepEqual(await page.locator('.language-option').evaluateAll(links => links.map(link => link.getAttribute('href'))), ['/', '/fr/', '/de/', '/es/', '/pt/', '/id/', '/it/', '/ja/']);
                await page.keyboard.press('Escape');
                await page.setViewportSize({ width: 1440, height: 900 });
                await page.waitForFunction(() => getComputedStyle(document.querySelector('.menu-toggle')).display === 'none');
                assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
                await page.locator('#why-mindrink a').focus();
                for (const link of await page.locator('.home-resource-links a, #download .home-store-link').all()) {
                    await page.keyboard.press('Tab');
                    assert.ok(await link.evaluate(element => element === document.activeElement && element.matches(':focus-visible') && getComputedStyle(element).outlineStyle === 'solid'));
                }
            } finally { await context.close(); }
        }
        {
            const { context, page } = await setup(390, 844, 'enabled');
            try {
                await page.waitForFunction(() => window.__events.some(event => event.event === 'site_page_viewed'));
                await page.evaluate(() => document.addEventListener('click', event => { if (event.target.closest('.home-store-link')) event.preventDefault(); }));
                const links = await page.locator('.home-store-link').all();
                for (let index = 0; index < links.length; index++) {
                    if (index % 2 === 0) await links[index].locator('img').click();
                    else { await links[index].focus(); await page.keyboard.press('Enter'); }
                    await page.waitForFunction(count => window.__events.filter(event => event.event === 'app_store_clicked').length === count, index + 1);
                }
                const clicks = await page.evaluate(() => window.__events.filter(event => event.event === 'app_store_clicked').map(event => event.properties));
                assert.deepEqual(clicks.map(event => [event.cta_location, event.store]), [['home_hero', 'app_store'], ['home_hero', 'google_play'], ['home_footer', 'app_store'], ['home_footer', 'google_play']]);
                assert.ok(clicks.every(event => event.page_path === copy.path && event.page_family === 'home' && event.drink_amount === undefined && event.$current_url === undefined));
            } finally { await context.close(); }
        }
        for (const mode of ['gpc', 'dnt', 'optout', 'disabled', 'no-js']) {
            const { context, page, analyticsLoads } = await setup(390, 844, mode);
            try {
                assert.equal(await page.locator('.home-store-link').count(), 4);
                assert.ok(await page.getByRole('heading', { level: 1 }).isVisible());
                if (mode === 'no-js') assert.ok(await page.locator('.nav').getByRole('link', { name: copy.discover, exact: true }).isVisible());
                else {
                    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
                    assert.deepEqual(await page.evaluate(() => window.__events), []);
                }
                assert.ok(!analyticsLoads.includes('sdk'), 'Privacy/disabled states do not load the SDK');
                if (['gpc', 'dnt', 'optout'].includes(mode)) assert.deepEqual(analyticsLoads, []);
            } finally { await context.close(); }
        }
        assert.deepEqual(errors, []);
        assert.deepEqual(external, []);
        assert.deepEqual(missing, []);
        console.log(JSON.stringify({ locale, viewports: reports.length, errors, external, missing, responsive: reports.map(({ width, height, hero, screen }) => ({ width, height, heroBottom: hero.bottom, phoneTop: screen.top })), scrollbarReports, desktopCopyGaps: reports.filter(report => report.width >= 768).map(({ width, productCopyGaps }) => ({ width, gaps: productCopyGaps })), storeClicks: 'all four placements/stores once; nested image and keyboard', privacy: 'GPC, DNT, opt-out, disabled config and no-JS checked' }, null, 2));
    } finally { await browser.close(); }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
