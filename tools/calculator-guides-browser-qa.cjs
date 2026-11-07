// Local browser regression checks. Every request is fulfilled from this repository
// or an in-memory analytics stub; no production events or server are used.
const { chromium } = require(process.env.MINDRINK_PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const { readFileSync, mkdirSync } = require('node:fs');
const { resolve, join, extname, sep } = require('node:path');
const root = resolve(__dirname, '..');
const origin = 'http://127.0.0.1:4176';
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml' };
const locales = ['en', 'de', 'fr', 'es', 'pt', 'id', 'it', 'ja'];
const sdk = `let config; const memoryId = crypto.randomUUID();
export default { init(token, options) { config = options; }, capture(event, properties) {
 const safe = config.before_send({ event, properties: { ...properties, distinct_id: memoryId,
   $current_url: location.href, $referrer: 'private-test', volume: 999, result: 123 } });
 if (safe) { window.__events.push(safe); void window.__recordAnalytics(safe); }
} };`;

(async () => {
  const channel = process.env.MINDRINK_BROWSER_CHANNEL || (process.platform === 'win32' ? 'msedge' : undefined);
  const browser = await chromium.launch({ headless: true, ...(channel ? { channel } : {}) });
  const failures = [], errors = [], external = [], missing = [];
  let passed = 0;
  async function check(name, fn) {
    try { await fn(); passed++; }
    catch (e) { failures.push({ name, error: e.message }); }
  }
  async function setup(viewport, privacy) {
    const context = await browser.newContext({ viewport, serviceWorkers: 'block' });
    const captured = [], assets = [];
    await context.exposeBinding('__recordAnalytics', (_, event) => captured.push(event));
    await context.addInitScript(mode => {
      window.__events = [];
      if (mode === 'gpc') Object.defineProperty(navigator, 'globalPrivacyControl', { value: true });
      if (mode === 'dnt') Object.defineProperty(navigator, 'doNotTrack', { value: '1' });
      if (mode === 'optout') localStorage.setItem('mindrink_analytics_opt_out', 'true');
    }, privacy);
    await context.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.origin !== origin) { external.push(url.origin); return route.abort(); }
      if (url.pathname === '/scripts/analytics-config.js') {
        assets.push('config');
        return route.fulfill({ body: 'export const POSTHOG_CONFIG = { publicToken: "phc_test", apiHost: "https://eu.i.posthog.com" };', contentType: 'text/javascript' });
      }
      if (url.pathname === '/scripts/vendor/posthog.js') {
        assets.push('sdk');
        return route.fulfill({ body: sdk, contentType: 'text/javascript' });
      }
      let path = resolve(root, '.' + decodeURIComponent(url.pathname));
      if (!path.startsWith(root + sep)) return route.abort();
      if (url.pathname.endsWith('/')) path = join(path, 'index.html');
      try { return await route.fulfill({ body: readFileSync(path), contentType: types[extname(path)] || 'application/octet-stream' }); }
      catch { missing.push(url.pathname); return route.fulfill({ status: 404, body: '' }); }
    });
    const page = await context.newPage();
    page.setDefaultTimeout(8000);
    page.on('pageerror', e => errors.push(e.message));
    return { context, page, captured, assets };
  }
  try {
    for (const locale of locales) for (const width of [390, 1280]) {
      await check(`${locale}/${width}: result links, exposure, click delivery and locale navigation`, async () => {
        const { context, page, captured } = await setup({ width, height: 844 });
        try {
          const prefix = locale === 'en' ? '/' : `/${locale}/`;
          const path = prefix + 'alcohol-unit-calculator/';
          await page.goto(origin + path);
          await page.waitForFunction(() => window.__events.some(e => e.event === 'site_page_viewed'));
          assert.equal(captured.filter(e => e.event === 'site_page_viewed').length, 1, 'duplicate analytics controller');
          const units = page.locator('[data-calculator-guide="drink_units"]');
          const weekly = page.locator('[data-calculator-guide="weekly_patterns"]');
          assert.ok(await weekly.isHidden());
          await units.scrollIntoViewIfNeeded();
          await page.waitForFunction(() => window.__events.some(e => e.event === 'calculator_guide_viewed' && e.properties.guide === 'drink_units'));
          assert.equal(captured.filter(e => e.event === 'calculator_guide_viewed' && e.properties.guide === 'weekly_patterns').length, 0);
          await page.locator('#total-add-row').click();
          await weekly.scrollIntoViewIfNeeded();
          await page.waitForFunction(() => window.__events.some(e => e.event === 'calculator_guide_viewed' && e.properties.guide === 'weekly_patterns'));
          await units.scrollIntoViewIfNeeded();
          await weekly.scrollIntoViewIfNeeded();
          assert.equal(captured.filter(e => e.event === 'calculator_guide_viewed').length, 2, 'exposure must deduplicate');
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
          for (const e of captured) {
            for (const key of ['$current_url', '$referrer', 'volume', 'result', '$session_id']) assert.equal(e.properties[key], undefined);
          }
          if (process.env.MINDRINK_QA_SCREENSHOT_DIR && ['en', 'de', 'it', 'ja'].includes(locale)) {
            mkdirSync(process.env.MINDRINK_QA_SCREENSHOT_DIR, { recursive: true });
            await units.scrollIntoViewIfNeeded();
            await page.screenshot({ path: join(process.env.MINDRINK_QA_SCREENSHOT_DIR, `guide-${locale}-${width}.png`) });
          }
          const calculatorId = captured.find(e => e.event === 'site_page_viewed').properties.distinct_id;
          await units.click();
          assert.equal(new URL(page.url()).pathname, prefix + 'blog/what-counts-as-a-drink-alcohol-units.html');
          assert.equal(await page.locator('html').getAttribute('lang'), locale);
          assert.ok(captured.some(e => e.event === 'internal_navigation_clicked' && e.properties.from_page_path === path && e.properties.to_page_path === prefix + 'blog/what-counts-as-a-drink-alcohol-units.html'));
          await page.waitForFunction(() => window.__events.some(e => e.event === 'site_page_viewed'));
          const articleId = await page.evaluate(() => window.__events.find(e => e.event === 'site_page_viewed').properties.distinct_id);
          assert.notEqual(articleId, calculatorId, 'identifiers must reset between pages');
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
          await page.locator(`main a[href="${prefix}alcohol-units.html"]`).first().click();
          assert.equal(new URL(page.url()).pathname, prefix + 'alcohol-units.html');
          await page.locator(`main a[href="${prefix}blog/what-counts-as-a-drink-alcohol-units.html"]`).click();
          assert.equal(new URL(page.url()).pathname, prefix + 'blog/what-counts-as-a-drink-alcohol-units.html');
          await page.goto(origin + path);
          await page.locator('#total-add-row').click();
          await page.locator('[data-calculator-guide="weekly_patterns"]').click();
          assert.equal(new URL(page.url()).pathname, prefix + 'blog/why-weekly-drinking-patterns-matter.html');
        } finally { await context.close(); }
      });
    }
    for (const mode of ['gpc', 'dnt', 'optout']) {
      await check(`${mode}: calculator guide exposure respects browser privacy`, async () => {
        const { context, page, captured, assets } = await setup({ width: 390, height: 844 }, mode);
        try {
          await page.goto(origin + '/alcohol-unit-calculator/');
          await page.locator('#total-add-row').click();
          await page.locator('[data-calculator-guide="drink_units"]').scrollIntoViewIfNeeded();
          await page.locator('[data-calculator-guide="weekly_patterns"]').scrollIntoViewIfNeeded();
          assert.deepEqual(captured, []);
          assert.deepEqual(assets, []);
        } finally { await context.close(); }
      });
    }
  } finally { await browser.close(); }
  console.log(JSON.stringify({ passed, failures, errors, external, missing }, null, 2));
  if (failures.length || errors.length || external.length || missing.length) process.exitCode = 1;
})().catch(e => { console.error(e); process.exitCode = 1; });
