// Optional authoring QA. Supply an installed Playwright module and browser;
// No dependency installation, server or production traffic. Optional local
// screenshots use MINDRINK_QA_SCREENSHOT_DIR for authoring review.
const { chromium } = require(process.env.MINDRINK_PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve, join, extname, sep } = require('node:path');
const root = resolve(__dirname, '..');
const origin = 'http://127.0.0.1:4175';
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'};
const locales = ['en','de','es','fr','id','it','ja','pt'];

(async () => {
  const channel = process.env.MINDRINK_BROWSER_CHANNEL || (process.platform === 'win32' ? 'msedge' : undefined);
  const browser = await chromium.launch({ headless:true, ...(channel ? {channel} : {}) });
  const failures = [], errors = [], missing = [];
  let passed = 0;
  async function check(name, fn) {
    try { await fn(); passed++; }
    catch (error) { failures.push({name,error:error.message}); }
  }
  try {
    const context = await browser.newContext({ viewport:{width:390,height:844}, serviceWorkers:'block' });
    await context.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.origin !== origin) return route.abort();
      let path = resolve(root, '.' + decodeURIComponent(url.pathname));
      if (path !== root && !path.startsWith(root + sep)) return route.abort();
      if (url.pathname.endsWith('/')) path = join(path, 'index.html');
      try {
        const body = readFileSync(path);
        // Delayed figure responses exercise cold loading, not only warm layout.
        if (url.pathname.startsWith('/assets/science/')) await new Promise(r => setTimeout(r, 350));
        await route.fulfill({body, contentType:types[extname(path)] || 'application/octet-stream'});
      } catch { missing.push(url.pathname); await route.fulfill({status:404,body:''}); }
    });
    const page = await context.newPage();
    page.setDefaultTimeout(8000);
    page.on('pageerror', e => errors.push(e.message));
    for (const locale of locales) {
      const prefix = locale === 'en' ? '/' : `/${locale}/`;
      await check(`${locale}: real decimal typing, editing, limits and presets`, async () => {
        await page.goto(origin + prefix + 'alcohol-unit-calculator/');
        await page.waitForFunction(() => document.querySelector('#selected-uk-units').textContent.replace(',', '.') === '2.5');
        assert.equal(await page.locator('#selected-global').textContent(), locale === 'it' ? '1,6' : '2.0');
        const abv = page.locator('#selected-abv');
        for (const value of ['4.5','0.5','12.5']) {
          await abv.fill(''); await abv.pressSequentially(value);
          assert.equal(await abv.inputValue(), value);
          assert.equal((await page.locator('#selected-uk-units').textContent()).replace(',', '.'), (500 * Number(value) / 1000).toFixed(1));
        }
        await abv.press('Backspace'); await abv.pressSequentially('6');
        assert.equal(await abv.inputValue(), '12.6');
        await abv.fill('101'); assert.ok(await page.locator('#total-add-row').isDisabled());
        await page.locator('#selected-drink-type').selectOption('wine');
        assert.equal(await abv.inputValue(), '12');
        await page.locator('#selected-quantity').fill('1.5');
        assert.ok(await page.locator('#total-add-row').isDisabled());
      });
      await check(`${locale}: reference conversion and unrounded totals retain other outputs`, async () => {
        await page.goto(origin + prefix + 'alcohol-unit-calculator/');
        await page.waitForFunction(() => document.querySelector('#selected-global').textContent !== '');
        const number = async id => Number((await page.locator(`#${id}`).textContent()).replace(',', '.'));
        await page.locator('#total-add-row').click();
        await page.locator('#total-add-row').click();
        assert.equal(await number('total-global'), locale === 'it' ? 3.3 : 3.9);
        assert.equal(await number('total-uk-units'), 5);
        assert.equal(await number('total-us'), 2.8);
        assert.equal(await number('total-calories'), 276);
        assert.equal(await number('total-equivalent-beer'), 2);
        await page.locator('.total-remove').first().click();
        assert.equal(await number('total-global'), locale === 'it' ? 1.6 : 2);
        await page.locator('.total-remove').click();
        assert.ok(await page.locator('#total-totals').isHidden());
        assert.ok(await page.locator('#total-empty').isVisible());
      });
      for (const slug of ['who-invented-alcohol.html','mesopotamia-beer-written-records.html']) {
        for (const width of [320,390,768,1280]) await check(`${locale}/${slug}/${width}: cold citation and image stability`, async () => {
          await page.setViewportSize({width,height:844});
          await page.goto(origin + prefix + 'science/' + slug);
          const before = await page.locator('figure img').evaluateAll(images => images.map(im => ({w:im.clientWidth,h:im.clientHeight})));
          await page.locator('a.citation[href="#ref-1"]').first().click();
          await page.waitForFunction(() => {
            const y = document.getElementById('ref-1').getBoundingClientRect().top;
            return y >= document.querySelector('.header').getBoundingClientRect().bottom && y < innerHeight - 40;
          });
          await page.locator('figure img').evaluateAll(images => Promise.all(images.map(async im => {im.loading='eager';await im.decode();})));
          const after = await page.locator('figure img').evaluateAll(images => images.map(im => ({w:im.clientWidth,h:im.clientHeight,ratio:im.naturalWidth/im.naturalHeight})));
          after.forEach((im,i) => {
            assert.ok(Math.abs(im.w-before[i].w)<=2 && Math.abs(im.h-before[i].h)<=2, 'image space shifted after decode');
            assert.ok(Math.abs(im.w/im.h-im.ratio)<0.025, 'distorted image');
            if(width<=480) assert.ok(im.h<=361, 'mobile image too tall');
          });
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth+1));
        });
      }
      await check(`${locale}: methodology phone reflow`, async () => {
        await page.setViewportSize({width:375,height:844});
        await page.goto(origin+prefix+'methodology.html');
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth<=innerWidth));
      });
      await check(`${locale}: homepage logo retains language`, async () => {
        await page.goto(origin+prefix); await page.locator('.logo-section a').click();
        assert.equal(new URL(page.url()).pathname, prefix);
        assert.equal(await page.locator('html').getAttribute('lang'), locale);
      });
    }
    for (const width of [375,1280]) {
      await check(`it/${width}: labels, quantities, decimal precision and article journey`, async () => {
        await page.setViewportSize({width,height:844});
        await page.goto(origin+'/it/alcohol-unit-calculator/');
        await page.waitForFunction(() => document.querySelector('#selected-global').textContent === '1,6');
        assert.equal(await page.locator('.result-label').filter({hasText:'Unità alcoliche italiane (12 g)'}).count(), 2);
        assert.equal(await page.locator('.result-label').filter({hasText:'Calorie dell’alcol'}).count(), 2);
        const number = async id => Number((await page.locator(`#${id}`).textContent()).replace(',', '.'));
        await page.locator('#selected-quantity').fill('2');
        assert.equal(await number('selected-global'), 3.3);
        await page.locator('#total-add-row').click();
        assert.equal(await number('total-global'), 3.3);
        assert.match(await page.locator('.drink-list-units').textContent(), /3,3 Unità alcoliche italiane \(12 g\)/);
        await page.locator('#selected-drink-type').selectOption('wine');
        assert.equal(await number('selected-global'), 2.8); // quantity remains 2
        await page.locator('#selected-quantity').fill('1');
        assert.equal(await number('selected-global'), 1.4);
        await page.locator('#selected-drink-type').selectOption('spirits');
        assert.equal(await number('selected-global'), 0.7);
        await page.locator('#selected-drink-type').selectOption('beer');
        await page.locator('#selected-abv').fill('');
        await page.locator('#selected-abv').pressSequentially('5.01');
        assert.equal(await number('selected-global'), 1.6);
        assert.equal(await number('selected-grams'), 19.8);
        await page.locator('#selected-quantity').fill('0');
        assert.ok(await page.locator('#total-add-row').isDisabled());
        await page.locator('#selected-quantity').fill('1');
        await page.locator('#selected-volume').fill('');
        assert.equal(await page.locator('#selected-global').textContent(), '');
        assert.ok(await page.locator('#total-add-row').isDisabled());
        await page.locator('#selected-volume').fill('500');
        assert.equal(await number('selected-global'), 1.6);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth<=innerWidth));
        if (process.env.MINDRINK_QA_SCREENSHOT_DIR) {
          await page.screenshot({path:join(process.env.MINDRINK_QA_SCREENSHOT_DIR, `calculator-${width}.png`), fullPage:true});
        }
        assert.equal(await page.locator('.answer-cta a').getAttribute('href'), '/it/');
        for (const slug of ['what-counts-as-a-drink-alcohol-units.html','why-weekly-drinking-patterns-matter.html']) {
          await page.locator(`main a[href="/it/blog/${slug}"]`).click();
          assert.equal(new URL(page.url()).pathname, `/it/blog/${slug}`);
          assert.equal(await page.locator('html').getAttribute('lang'), 'it');
          await page.goto(origin+'/it/alcohol-unit-calculator/');
        }
      });
      for (const path of ['methodology.html','alcohol-units.html','blog/what-counts-as-a-drink-alcohol-units.html']) {
        await check(`it/${path}/${width}: source links and page reflow`, async () => {
          await page.setViewportSize({width,height:844});
          await page.goto(origin+'/it/'+path);
          assert.ok(await page.locator('main a[href="https://www.epicentro.iss.it/passi/indicatori/alcol"]').first().isVisible());
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth<=innerWidth));
          if (process.env.MINDRINK_QA_SCREENSHOT_DIR) {
            await page.screenshot({path:join(process.env.MINDRINK_QA_SCREENSHOT_DIR, `${path.replace(/\//g,'-')}-${width}.png`), fullPage:true});
          }
        });
      }
    }
  } finally { await browser.close(); }
  console.log(JSON.stringify({passed,failures,errors,missing},null,2));
  if(failures.length || errors.length || missing.length) process.exitCode=1;
})().catch(error => { console.error(error); process.exitCode=1; });
