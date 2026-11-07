import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createAnalyticsController, sanitizePosthogEvent } from '../scripts/analytics-core.js';

const locales = ['en', 'de', 'fr', 'es', 'pt', 'id', 'it', 'ja'];
const apple = 'https://apps.apple.com/us/app/mindrink/id6756892721';
const google = 'https://play.google.com/store/apps/details?id=com.mindrink.app';
const family = 'blog/best-alcohol-tracking-apps.html';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

function setup(pathname, options = {}) {
  const calls = [];
  let configLoads = 0;
  const controller = createAnalyticsController({
    getContext: () => ({ locale: 'fr', pathname }),
    loadConfig: async () => { configLoads++; return { publicToken: 'test', apiHost: 'https://eu.i.posthog.com' }; },
    loadPosthog: async () => ({ init() {}, capture: (event, properties) => calls.push({ event, properties }) }),
    ...options,
  });
  return { controller, calls, configLoads: () => configLoads };
}

for (const locale of locales) {
  const prefix = locale === 'en' ? '/' : '/' + locale + '/';
  test(locale + ': app discovery has one local explanation link, neutral footer and unchanged store destinations', () => {
    const html = read(prefix.slice(1) + family);
    const section = html.match(/<section\b[^>]*>[\s\S]*?data-app-comparison-section="mindrink"[\s\S]*?<\/section>/)[0];
    // Bound the assertion to the existing fourth-app section, not earlier app descriptions.
    const mindrink = section.slice(section.indexOf('<h2 class="section-title" data-app-comparison-section="mindrink">'));
    assert.equal((html.match(/data-app-comparison-section=/g) || []).length, 1);
    assert.equal((mindrink.match(new RegExp('href="' + prefix + '#how-it-works"', 'g')) || []).length, 1);
    const cta = html.match(/<section class="cta">[\s\S]*?<\/section>/)[0];
    assert.match(cta, /<h2 class="cta-title">[^<]*Mindrink[^<]*<\/h2>/);
    assert.ok(cta.includes(apple));
    assert.ok(cta.includes(google));
    assert.equal((cta.match(/class="btn /g) || []).length, 2);
    const home = read(prefix.slice(1) + 'index.html');
    assert.match(home, /id="how-it-works"/);
  });

  test(locale + ': heading and each store button have independent per-page exposure counts', async () => {
    const { controller, calls } = setup(prefix + family);
    assert.equal(controller.appComparisonSectionViewed('free text'), false);
    assert.equal(controller.appComparisonSectionViewed('mindrink'), true);
    assert.equal(controller.appComparisonSectionViewed('mindrink'), false);
    assert.equal(controller.appStoreViewed(apple, 'home_hero'), false);
    assert.equal(controller.appStoreViewed(apple, 'comparison_footer'), true);
    assert.equal(controller.appStoreViewed(apple + '?private=value', 'comparison_footer'), false);
    assert.equal(controller.appStoreViewed(google, 'comparison_footer'), true);
    assert.equal(controller.appStoreViewed(google, 'comparison_footer'), false);
    controller.appStoreClicked(apple, 'comparison_footer');
    controller.appStoreClicked(apple, 'comparison_footer');
    await controller.ready();
    assert.deepEqual(calls.map(r => r.event), [
      'app_comparison_section_viewed', 'app_store_viewed', 'app_store_viewed',
      'app_store_clicked', 'app_store_clicked',
    ]);
    assert.equal(calls[0].properties.section, 'mindrink');
    assert.equal(calls[0].properties.page_family, 'app_comparison');
    assert.equal(calls[1].properties.store, 'app_store');
    assert.equal(calls[2].properties.store, 'google_play');
    assert.ok(calls.every(r => r.properties.$geoip_disable === true));
  });
}

test('homepage hero/footer exposure is independent and comparison exposure stays confined to comparison pages', async () => {
  for (const pathname of ['/', '/fr/', '/fr/index.html']) {
    const { controller, calls } = setup(pathname);
    assert.equal(controller.appComparisonSectionViewed('mindrink'), false);
    for (const placement of ['home_hero', 'home_footer']) {
      for (const href of [apple, google]) {
        assert.equal(controller.appStoreViewed(href, placement), true);
        assert.equal(controller.appStoreViewed(href, placement), false);
      }
    }
    await controller.ready();
    assert.equal(calls.length, 4);
    assert.ok(calls.every(e => e.properties.page_family === 'home'));
  }
  for (const pathname of ['/fr/es/' + family, '/xx/' + family, '/privacy.html', '/alcohol-unit-calculator/']) {
    const { controller, calls, configLoads } = setup(pathname);
    assert.equal(controller.appComparisonSectionViewed('mindrink'), false);
    assert.equal(controller.appStoreViewed(apple, 'comparison_footer'), false);
    assert.equal(controller.appStoreViewed(apple, 'home_footer'), false);
    await controller.ready();
    assert.equal(configLoads(), 0);
    assert.deepEqual(calls, []);
  }
});

test('stored opt-out, privacy veto and a later opt-out stop all new exposure events', async () => {
  for (const options of [
    { privacySignal: true },
    { storage: { getItem: () => 'true' } },
  ]) {
    const { controller, calls, configLoads } = setup('/fr/' + family, options);
    assert.equal(controller.appComparisonSectionViewed('mindrink'), false);
    assert.equal(controller.appStoreViewed(apple, 'comparison_footer'), false);
    await controller.ready();
    assert.equal(configLoads(), 0);
    assert.deepEqual(calls, []);
  }
  const { controller, calls } = setup('/fr/' + family);
  controller.sitePageViewed();
  await controller.ready();
  await controller.setOptOut(true);
  assert.equal(controller.appComparisonSectionViewed('mindrink'), false);
  assert.equal(controller.appStoreViewed(apple, 'comparison_footer'), false);
  assert.equal(calls.length, 1);
});

test('new exposure payloads reject free text and unrelated pages and remove unapproved fields', () => {
  const extra = { volume: 500, abv: 5, result: 20, href: apple, link_text: 'private', $current_url: 'https://private.test', guide: 'drink_units', calculator_type: 'alcohol_unit', from_page_path: '/private', to_page_path: '/private' };
  const section = { event: 'app_comparison_section_viewed', properties: {
    ...extra, locale: 'fr', page_path: '/fr/' + family, page_family: 'home', section: 'mindrink', cta_location: 'private',
  } };
  assert.deepEqual(sanitizePosthogEvent(section).properties, {
    locale: 'fr', page_path: '/fr/' + family, page_family: 'app_comparison', section: 'mindrink',
  });
  assert.equal(sanitizePosthogEvent({ ...section, properties: { ...section.properties, section: 'private text' } }), null);
  assert.equal(sanitizePosthogEvent({ ...section, properties: { ...section.properties, page_path: '/' } }), null);
  const store = { event: 'app_store_viewed', properties: {
    ...extra, locale: 'fr', page_path: '/fr/?private=value#part', page_family: 'home', cta_location: 'home_hero', store: 'app_store', section: 'mindrink',
  } };
  assert.deepEqual(sanitizePosthogEvent(store).properties, {
    locale: 'fr', page_path: '/fr/', page_family: 'home', cta_location: 'home_hero', store: 'app_store',
  });
  assert.equal(sanitizePosthogEvent({ ...store, properties: { ...store.properties, store: apple } }), null);
  assert.equal(sanitizePosthogEvent({ ...store, properties: { ...store.properties, page_path: '/privacy.html' } }), null);
  const ordinary = sanitizePosthogEvent({ event: 'site_page_viewed', properties: { locale: 'fr', page_path: '/', section: 'mindrink' } });
  assert.equal(ordinary.properties.section, undefined);
});
