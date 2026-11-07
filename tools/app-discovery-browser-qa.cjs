// Offline regression checks using local files and an in-memory SDK.
// Store navigation is prevented after measurement; no production traffic is sent.
const { chromium } = require(process.env.MINDRINK_PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const { readFileSync, mkdirSync } = require('node:fs');
const { resolve, join, extname, sep } = require('node:path');
const root = resolve(__dirname, '..');
const origin = 'http://127.0.0.1:4178';
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.jpg':'image/jpeg', '.webp':'image/webp', '.avif':'image/avif', '.png':'image/png', '.svg':'image/svg+xml' };
const locales = ['en', 'de', 'fr', 'es', 'pt', 'id', 'it', 'ja'];
const sdk = 'let config; const memoryId = crypto.randomUUID();\n'
 + 'export default { init(token, options) { config = options; }, capture(event, properties) {\n'
 + 'const safe = config.before_send({event,properties:{...properties,distinct_id:memoryId,$current_url:location.href,$referrer:"private-test",volume:999,result:123,link_text:"private"}});\n'
 + 'if(safe){window.__events.push(safe);void window.__recordAnalytics(safe);}}};';
(async () => {
 const channel = process.env.MINDRINK_BROWSER_CHANNEL || (process.platform === 'win32' ? 'msedge' : undefined);
 const browser = await chromium.launch({ headless:true, ...(channel ? {channel} : {}) });
 const failures=[], errors=[], external=[], missing=[];
 let passed=0;
 async function check(name, fn) {
  try { await fn(); passed++; } catch(e) { failures.push({name,error:e.message}); }
 }
 async function setup(width=390,mode) {
  const context = await browser.newContext({viewport:{width,height:844},serviceWorkers:'block'});
  const captured=[],assets=[];
  await context.exposeBinding('__recordAnalytics',(_,event)=>captured.push(event));
  await context.addInitScript(mode=>{
   window.__events=[];
   if(mode==='gpc')Object.defineProperty(navigator,'globalPrivacyControl',{value:true});
   if(mode==='dnt')Object.defineProperty(navigator,'doNotTrack',{value:'1'});
   if(mode==='optout')localStorage.setItem('mindrink_analytics_opt_out','true');
   if(mode==='no-observer')window.IntersectionObserver=undefined;
   if(mode==='visibility')Object.defineProperty(document,'visibilityState',{get:()=>window.__visibility||'visible'});
  },mode);
  await context.route('**/*',async route=>{
   const url=new URL(route.request().url());
   if(url.origin!==origin){external.push(url.origin);return route.abort();}
   if(url.pathname==='/scripts/analytics-config.js'){
    assets.push('config');return route.fulfill({body:'export const POSTHOG_CONFIG={publicToken:"phc_test",apiHost:"https://eu.i.posthog.com"};',contentType:'text/javascript'});
   }
   if(url.pathname==='/scripts/vendor/posthog.js'){
    assets.push('sdk');return route.fulfill({body:sdk,contentType:'text/javascript'});
   }
   let file=resolve(root,'.'+decodeURIComponent(url.pathname));
   if(file!==root&&!file.startsWith(root+sep))return route.abort();
   if(url.pathname.endsWith('/'))file=join(file,'index.html');
   try{return await route.fulfill({body:readFileSync(file),contentType:types[extname(file)]||'application/octet-stream'});}
   catch{missing.push(url.pathname);return route.fulfill({status:404,body:''});}
  });
  const page=await context.newPage();
  page.setDefaultTimeout(8000);
  page.on('pageerror',e=>errors.push(e.message));
  return {context,page,captured,assets};
 }
 async function screenshot(page,name) {
  if(!process.env.MINDRINK_QA_SCREENSHOT_DIR)return;
  mkdirSync(process.env.MINDRINK_QA_SCREENSHOT_DIR,{recursive:true});
  await page.screenshot({path:join(process.env.MINDRINK_QA_SCREENSHOT_DIR,name+'.png')});
 }
 const storeButtons = page => page.locator('.cta a[href*="apps.apple.com"], .cta a[href*="play.google.com"]');
 const eventCount = (captured,event,path) => captured.filter(e=>e.event===event&&(!path||e.properties.page_path===path)).length;
 try {
  for(const locale of locales)for(const width of [390,1280]) {
   await check(locale+'/'+width+': section/button exposure, quiet local link and independent homepage placements',async()=>{
    const {context,page,captured}=await setup(width);
    try {
     const prefix=locale==='en'?'/':'/'+locale+'/';
     const path=prefix+'blog/best-alcohol-tracking-apps.html';
     await page.goto(origin+path);
     await page.waitForFunction(()=>window.__events.some(e=>e.event==='site_page_viewed'));
     assert.equal(eventCount(captured,'site_page_viewed',path),1);
     assert.equal(eventCount(captured,'app_comparison_section_viewed'),0);
     assert.equal(eventCount(captured,'app_store_viewed'),0);
     const heading=page.locator('[data-app-comparison-section="mindrink"]');
     await heading.scrollIntoViewIfNeeded();
     await page.waitForFunction(()=>window.__events.some(e=>e.event==='app_comparison_section_viewed'));
     assert.equal(eventCount(captured,'app_comparison_section_viewed'),1);
     assert.equal(eventCount(captured,'app_store_viewed'),0,'footer must not count before it is visible');
     const link=heading.locator('..').locator('a[href="'+prefix+'#how-it-works"]');
     assert.equal(await link.count(),1);
     assert.equal(await link.getAttribute('class'),null,'explanation link stays ordinary text');
     assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
     await screenshot(page,'comparison-'+locale+'-'+width+'-section');
     for(const button of await storeButtons(page).all()) {
      await button.scrollIntoViewIfNeeded();
      assert.ok((await button.boundingBox()).height>=44);
     }
     await page.waitForFunction(()=>window.__events.filter(e=>e.event==='app_store_viewed').length===2);
     await screenshot(page,'comparison-'+locale+'-'+width+'-footer');
     await heading.scrollIntoViewIfNeeded();
     for(const button of await storeButtons(page).all())await button.scrollIntoViewIfNeeded();
     assert.equal(eventCount(captured,'app_comparison_section_viewed'),1);
     assert.equal(eventCount(captured,'app_store_viewed'),2);
     // The site's click handler runs first; suppress only external default navigation.
     await page.evaluate(()=>document.addEventListener('click',e=>{
      if(e.target.closest('a[href*="apps.apple.com"],a[href*="play.google.com"]'))e.preventDefault();
     }));
     await storeButtons(page).first().click();
     await page.waitForFunction(()=>window.__events.some(e=>e.event==='app_store_clicked'));
     assert.equal(eventCount(captured,'app_store_clicked'),1);
     assert.equal(eventCount(captured,'app_store_viewed'),2);
     const comparisonId=captured.find(e=>e.event==='site_page_viewed').properties.distinct_id;
     await link.click();
     assert.equal(new URL(page.url()).pathname,prefix);
     assert.equal(new URL(page.url()).hash,'#how-it-works');
     assert.equal(await page.locator('html').getAttribute('lang'),locale);
     await page.waitForFunction(()=>window.__events.some(e=>e.event==='site_page_viewed'));
     const homeId=await page.evaluate(()=>window.__events.find(e=>e.event==='site_page_viewed').properties.distinct_id);
     assert.notEqual(homeId,comparisonId);
     assert.ok(captured.some(e=>e.event==='internal_navigation_clicked'&&e.properties.from_page_path===path&&e.properties.to_page_path===prefix));
     for(const selector of ['.hero a[href*="apps.apple.com"]','.hero a[href*="play.google.com"]','.cta a[href*="apps.apple.com"]','.cta a[href*="play.google.com"]'])await page.locator(selector).scrollIntoViewIfNeeded();
     await page.waitForFunction(()=>window.__events.filter(e=>e.event==='app_store_viewed').length===4);
     assert.equal(eventCount(captured,'app_store_viewed',prefix),4);
     for(const event of captured)for(const key of ['$current_url','$referrer','volume','result','link_text','$session_id'])assert.equal(event.properties[key],undefined);
    } finally {await context.close();}
   });
  }
  for(const mode of ['gpc','dnt','optout'])await check(mode+': new surfaces stay inert without loading config or SDK',async()=>{
   const {context,page,captured,assets}=await setup(390,mode);
   try {
    for(const path of ['/blog/best-alcohol-tracking-apps.html','/']) {
     await page.goto(origin+path);
     const heading=page.locator('[data-app-comparison-section]');
     if(await heading.count())await heading.scrollIntoViewIfNeeded();
     for(const button of await storeButtons(page).all())await button.scrollIntoViewIfNeeded();
    }
    assert.deepEqual(captured,[]);assert.deepEqual(assets,[]);
   } finally {await context.close();}
  });
  await check('missing IntersectionObserver keeps page and clicks working without inferred exposure',async()=>{
   const {context,page,captured}=await setup(390,'no-observer');
   try {
    await page.goto(origin+'/blog/best-alcohol-tracking-apps.html');
    await page.waitForFunction(()=>window.__events.some(e=>e.event==='site_page_viewed'));
    await page.locator('[data-app-comparison-section]').scrollIntoViewIfNeeded();
    await storeButtons(page).first().scrollIntoViewIfNeeded();
    await page.evaluate(()=>document.addEventListener('click',e=>{if(e.target.closest('.cta a'))e.preventDefault();}));
    await storeButtons(page).first().click();
    await page.waitForFunction(()=>window.__events.some(e=>e.event==='app_store_clicked'));
    assert.equal(eventCount(captured,'app_store_viewed'),0);
    assert.equal(eventCount(captured,'app_comparison_section_viewed'),0);
   } finally {await context.close();}
  });
  await check('background observation waits for a fresh foreground intersection',async()=>{
   const {context,page,captured}=await setup(390,'visibility');
   try {
    await page.goto(origin+'/blog/best-alcohol-tracking-apps.html');
    await page.waitForFunction(()=>window.__events.some(e=>e.event==='site_page_viewed'));
    await page.evaluate(()=>{window.__visibility='hidden';document.dispatchEvent(new Event('visibilitychange'));});
    await page.locator('[data-app-comparison-section]').scrollIntoViewIfNeeded();
    await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    assert.equal(eventCount(captured,'app_comparison_section_viewed'),0);
    await page.evaluate(()=>{window.__visibility='visible';document.dispatchEvent(new Event('visibilitychange'));});
    await page.waitForFunction(()=>window.__events.some(e=>e.event==='app_comparison_section_viewed'));
    assert.equal(eventCount(captured,'app_comparison_section_viewed'),1);
   } finally {await context.close();}
  });
 } finally {await browser.close();}
 console.log(JSON.stringify({passed,failures,errors,external,missing},null,2));
 if(failures.length||errors.length||external.length||missing.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
