import assert from 'node:assert/strict';
import test from 'node:test';
import { createAnalyticsController, resolveStoreCta, sanitizePosthogEvent } from '../scripts/analytics-core.js';
import { observeCtaExposure, handleStoreCtaClick } from '../scripts/analytics-cta.js';

const apple = 'https://apps.apple.com/us/app/mindrink/id6756892721';
const google = 'https://play.google.com/store/apps/details?id=com.mindrink.app';

test('store events are restricted to existing Mindrink destinations and approved page placements', () => {
  for (const locale of ['', 'de/', 'fr/', 'es/', 'pt/', 'id/', 'it/', 'ja/']) {
    assert.deepEqual(resolveStoreCta(apple + '?source=private#download', '/' + locale, 'home_hero'), {
      store: 'app_store', cta_location: 'home_hero', page_family: 'home',
    });
    assert.equal(resolveStoreCta(google, '/' + locale + 'index.html', 'home_footer').store, 'google_play');
    assert.equal(resolveStoreCta(google, '/' + locale + 'blog/best-alcohol-tracking-apps.html', 'comparison_footer').page_family, 'app_comparison');
  }
  for (const href of ['invalid', apple.replace('https:', 'http:'), apple.replace('id6756892721', 'id123'), apple.replace('apps.apple.com', 'apps.apple.com.evil.test'), google.replace('com.mindrink.app', 'other.app'), 'https://user:password@apps.apple.com/app/id6756892721']) {
    assert.equal(resolveStoreCta(href, '/', 'home_hero'), null);
  }
  for (const path of ['/privacy.html', '/alcohol-unit-calculator/', '/blog/other.html', '/xx/']) {
    assert.equal(resolveStoreCta(apple, path, 'home_footer'), null);
  }
  assert.equal(resolveStoreCta(apple, '/', 'comparison_footer'), null);
  assert.equal(resolveStoreCta(apple, '/fr/blog/best-alcohol-tracking-apps.html', 'home_hero'), null);
});

test('CTA exposure is deduplicated, store events contain no URL, and privacy vetoes cover both', async () => {
  for (const privacySignal of [false, true]) {
    const calls = [];
    const controller = createAnalyticsController({
      privacySignal, getContext: () => ({ locale: 'it', pathname: '/it/' }),
      loadConfig: async () => ({ publicToken: 'test-only', apiHost: 'https://eu.i.posthog.com' }),
      loadPosthog: async () => ({ init() {}, capture: (event, properties) => calls.push({ event, properties }) }),
    });
    controller.appCtaViewed('unknown');
    controller.appCtaViewed('calculator_footer');
    controller.appCtaViewed('calculator_footer');
    controller.appStoreClicked(apple + '?secret=private', 'home_hero');
    await controller.ready();
    assert.equal(calls.length, privacySignal ? 0 : 2);
    if (!privacySignal) {
      assert.equal(calls[0].event, 'app_cta_viewed');
      assert.deepEqual(calls[1], { event: 'app_store_clicked', properties: {
        locale: 'it', page_path: '/it/', store: 'app_store', page_family: 'home', cta_location: 'home_hero', $geoip_disable: true,
      } });
      await controller.setOptOut(true);
      controller.appStoreClicked(google, 'home_footer');
      assert.equal(calls.length, 2);
    }
  }
});

test('final sanitizer validates store categories and drops unapproved properties', () => {
  const event = { event: 'app_store_clicked', properties: {
    store: 'app_store', page_family: 'home', cta_location: 'home_footer', page_path: '/',
    href: apple, result: 19.7, abv: 5, link_text: 'private', calculator_type: 'alcohol_unit', to_page_path: '/private',
  } };
  assert.deepEqual(sanitizePosthogEvent(event).properties, {
    store: 'app_store', page_family: 'home', cta_location: 'home_footer', page_path: '/',
  });
  assert.equal(sanitizePosthogEvent({ ...event, properties: { ...event.properties, store: apple } }), null);
  assert.equal(sanitizePosthogEvent({ ...event, properties: { ...event.properties, cta_location: 'private text' } }), null);
});

function exposureFixture() {
  const target = {};
  let callback;
  const listeners = new Map();
  const state = { observe: 0, disconnect: 0, viewed: 0 };
  const documentObject = {
    visibilityState: 'visible',
    addEventListener: (name, listener) => listeners.set(name, listener),
    removeEventListener: name => listeners.delete(name),
  };
  class Observer {
    constructor(fn, options) { callback = fn; assert.deepEqual(options.threshold, [0.5]); }
    observe(element) { assert.equal(element, target); state.observe++; }
    disconnect() { state.disconnect++; }
  }
  const stop = observeCtaExposure(target, () => state.viewed++, { documentObject, Observer });
  return { state, documentObject, listeners, stop, emit: ratio => callback([{ target, isIntersecting: ratio > 0, intersectionRatio: ratio }]) };
}

test('only half-visible CTA in a foreground document records exposure, once', () => {
  const f = exposureFixture();
  f.emit(0); f.emit(0.49);
  assert.equal(f.state.viewed, 0);
  f.documentObject.visibilityState = 'hidden'; f.emit(1);
  assert.equal(f.state.viewed, 0);
  f.documentObject.visibilityState = 'visible'; f.listeners.get('visibilitychange')();
  assert.equal(f.state.observe, 2);
  f.emit(0.5); f.emit(1);
  assert.equal(f.state.viewed, 1);
  assert.equal(f.listeners.size, 0);
});

test('missing observer, unavailable target, and observer failures do not break the page', () => {
  assert.doesNotThrow(() => observeCtaExposure(null, () => {}, { documentObject: {}, Observer: null }));
  assert.doesNotThrow(() => observeCtaExposure({}, () => {}, {
    documentObject: { removeEventListener() {} }, Observer: class { constructor() { throw new Error('blocked'); } },
  }));
  const f = exposureFixture(); f.stop(); f.emit(1);
  assert.equal(f.state.viewed, 0);
});

test('click integration recognizes only existing button areas without intercepting navigation', () => {
  for (const [pathname, area, expected] of [['/', '.hero', 'home_hero'], ['/it/', '.cta', 'home_footer'], ['/ja/blog/best-alcohol-tracking-apps.html', '.cta', 'comparison_footer']]) {
    const calls = [];
    const controller = { appStoreClicked: (...args) => calls.push(args) };
    const anchor = { href: apple, hasAttribute: () => false, classList: { contains: () => true }, closest: selector => selector === area };
    const event = { target: { closest: () => anchor }, button: 0, defaultPrevented: false };
    handleStoreCtaClick(event, controller, pathname);
    assert.deepEqual(calls, [[apple, expected]]);
    handleStoreCtaClick({ ...event, defaultPrevented: true }, controller, pathname);
    handleStoreCtaClick({ ...event, button: 1 }, controller, pathname);
    anchor.hasAttribute = () => true;
    handleStoreCtaClick(event, controller, pathname);
    assert.equal(calls.length, 1);
    assert.equal(event.defaultPrevented, false);
  }
});
