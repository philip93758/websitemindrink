import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  ANALYTICS_EVENTS,
  ANALYTICS_OPT_OUT_KEY,
  browserPrivacySignalActive,
  createAnalyticsController,
  normalizePagePath,
  resolveInternalNavigation,
  sanitizePosthogEvent,
} from '../scripts/analytics-core.js';
import {
  ANALYTICS_LOADER,
  listHtmlFiles,
  withAnalyticsLoader,
} from '../scripts/update-analytics-loaders.js';

function createStorage(optedOut = false) {
  const values = new Map();
  if (optedOut) values.set(ANALYTICS_OPT_OUT_KEY, 'true');
  return {
    values,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

function createSdk({ captureThrows = false } = {}) {
  const calls = {
    init: [],
    capture: [],
    stopRecording: 0,
    persistenceCleared: 0,
    sessionPersistenceCleared: 0,
  };
  const sdk = {
    init: (...args) => calls.init.push(args),
    capture: (...args) => {
      if (captureThrows) throw new Error('network unavailable');
      calls.capture.push(args);
    },
    stopSessionRecording: () => { calls.stopRecording += 1; },
    persistence: { clear: () => { calls.persistenceCleared += 1; } },
    sessionPersistence: { clear: () => { calls.sessionPersistenceCleared += 1; } },
  };
  return { sdk, calls };
}

function createController({ optedOut, privacySignal, config, sdkOptions } = {}) {
  const { sdk, calls } = createSdk(sdkOptions);
  const storage = createStorage(optedOut);
  let configLoads = 0;
  let sdkLoads = 0;
  const controller = createAnalyticsController({
    storage,
    privacySignal,
    getContext: () => ({ locale: 'de', pathname: '/de/alcohol-unit-calculator/?drink=wine#result' }),
    loadConfig: async () => {
      configLoads += 1;
      return config ?? { publicToken: 'phc_public_test', apiHost: 'https://eu.i.posthog.com' };
    },
    loadPosthog: async () => {
      sdkLoads += 1;
      return sdk;
    },
  });
  return {
    controller,
    calls,
    storage,
    getConfigLoads: () => configLoads,
    getSdkLoads: () => sdkLoads,
  };
}

test('analytics initializes immediately for one aggregate site page view', async () => {
  const { controller, calls, getConfigLoads, getSdkLoads } = createController();

  controller.sitePageViewed();
  controller.sitePageViewed();
  await controller.ready();

  assert.equal(getConfigLoads(), 1);
  assert.equal(getSdkLoads(), 1);
  assert.deepEqual(calls.capture.map(([event]) => event), [ANALYTICS_EVENTS.sitePageViewed]);
});

test('stored opt-out and browser privacy signals prevent even loading PostHog configuration', async () => {
  for (const options of [{ optedOut: true }, { privacySignal: true }]) {
    const { controller, calls, getConfigLoads, getSdkLoads } = createController(options);
    controller.sitePageViewed();
    controller.calculatorStarted();
    await controller.ready();

    assert.equal(getConfigLoads(), 0);
    assert.equal(getSdkLoads(), 0);
    assert.deepEqual(calls.capture, []);
  }
});

test('re-enabling after a stored opt-out starts analytics without a consent prompt', async () => {
  const { controller, calls, storage } = createController({ optedOut: true });
  controller.sitePageViewed();

  await controller.setOptOut(false);

  assert.equal(controller.getState(), 'enabled');
  assert.equal(storage.values.has(ANALYTICS_OPT_OUT_KEY), false);
  assert.deepEqual(calls.capture.map(([event]) => event), [ANALYTICS_EVENTS.sitePageViewed]);
});

test('SDK initialization enforces memory-only, no-profile, no-autocapture configuration', async () => {
  const { controller, calls } = createController();
  controller.sitePageViewed();
  await controller.ready();

  const [token, config] = calls.init[0];
  assert.equal(token, 'phc_public_test');
  assert.equal(config.api_host, 'https://eu.i.posthog.com');
  assert.equal(config.autocapture, false);
  assert.equal(config.capture_pageview, false);
  assert.equal(config.capture_pageleave, false);
  assert.equal(config.capture_heatmaps, false);
  assert.equal(config.capture_dead_clicks, false);
  assert.equal(config.capture_exceptions, false);
  assert.equal(config.capture_performance, false);
  assert.equal(config.disable_session_recording, true);
  assert.equal(config.disable_surveys, true);
  assert.equal(config.advanced_disable_flags, true);
  assert.equal(config.person_profiles, 'never');
  assert.equal(config.persistence, 'memory');
  assert.equal(config.disableDeviceModel, true);
  assert.equal('cookieless_mode' in config, false);
});

test('aggregate navigation and calculator events contain only approved properties', async () => {
  const { controller, calls } = createController();
  controller.sitePageViewed();
  await controller.ready();

  controller.internalNavigationClicked('/de/about.html?source=private#team');
  controller.calculatorStarted();
  controller.calculatorStarted();
  controller.calculationCompleted();
  controller.calculatorTotalAdded();
  controller.appCtaClicked('unapproved_location');
  controller.appCtaClicked('calculator_footer');

  assert.deepEqual(calls.capture.map(([event]) => event), [
    'site_page_viewed',
    'internal_navigation_clicked',
    'calculator_started',
    'calculation_completed',
    'calculator_total_added',
    'app_cta_clicked',
  ]);

  const pageView = calls.capture[0][1];
  assert.deepEqual(pageView, {
    locale: 'de',
    page_path: '/de/alcohol-unit-calculator/',
    $geoip_disable: true,
  });

  const navigation = calls.capture[1][1];
  assert.deepEqual(navigation, {
    locale: 'de',
    from_page_path: '/de/alcohol-unit-calculator/',
    to_page_path: '/de/about.html',
    $geoip_disable: true,
  });

  for (const [, properties] of calls.capture.slice(2)) {
    assert.equal(properties.locale, 'de');
    assert.equal(properties.page_path, '/de/alcohol-unit-calculator/');
    assert.equal(properties.calculator_type, 'alcohol_unit');
    assert.equal(properties.$geoip_disable, true);
    assert.equal('volume' in properties, false);
    assert.equal('abv' in properties, false);
    assert.equal('result' in properties, false);
  }
  assert.equal(calls.capture.at(-1)[1].cta_location, 'calculator_footer');
});

test('opting out stops capture, stores only the preference, and clears in-memory SDK state', async () => {
  const { controller, calls, storage } = createController();
  controller.sitePageViewed();
  await controller.ready();

  await controller.setOptOut(true);
  const captureCount = calls.capture.length;
  controller.calculationCompleted();
  controller.internalNavigationClicked('/de/about.html');

  assert.equal(controller.getState(), 'opted_out');
  assert.equal(storage.values.get(ANALYTICS_OPT_OUT_KEY), 'true');
  assert.equal(calls.capture.length, captureCount);
  assert.equal(calls.stopRecording, 1);
  assert.equal(calls.persistenceCleared, 1);
  assert.equal(calls.sessionPersistenceCleared, 1);
});

test('GPC and common Do Not Track values are recognized', () => {
  assert.equal(browserPrivacySignalActive({ globalPrivacyControl: true }), true);
  assert.equal(browserPrivacySignalActive({ navigatorDoNotTrack: '1' }), true);
  assert.equal(browserPrivacySignalActive({ windowDoNotTrack: 'yes' }), true);
  assert.equal(browserPrivacySignalActive({ msDoNotTrack: '0' }), false);
});

test('only same-origin, different-page links become aggregate transitions', () => {
  const context = { origin: 'https://mindrink.me', pathname: '/discover/' };
  assert.deepEqual(resolveInternalNavigation('/about.html?source=nav#team', context), {
    from_page_path: '/discover/',
    to_page_path: '/about.html',
  });
  assert.equal(resolveInternalNavigation('/discover/#topic', context), null);
  assert.equal(resolveInternalNavigation('https://example.com/about', context), null);
  assert.equal(resolveInternalNavigation('mailto:hello@mindrink.me', context), null);
});

test('missing or non-EU configuration keeps analytics inert', async () => {
  for (const config of [
    { publicToken: '', apiHost: 'https://eu.i.posthog.com' },
    { publicToken: 'phc_public_test', apiHost: 'https://us.i.posthog.com' },
  ]) {
    const { controller, calls, getSdkLoads } = createController({ config });
    controller.sitePageViewed();
    await controller.ready();
    assert.equal(getSdkLoads(), 0);
    assert.deepEqual(calls.capture, []);
  }
});

test('analytics failures never escape into page or calculator actions', async () => {
  const { controller } = createController({ sdkOptions: { captureThrows: true } });
  controller.sitePageViewed();
  await controller.ready();
  assert.doesNotThrow(() => controller.internalNavigationClicked('/de/about.html'));
  assert.doesNotThrow(() => controller.calculatorStarted());
  assert.doesNotThrow(() => controller.calculationCompleted());
  assert.doesNotThrow(() => controller.calculatorTotalAdded());
  assert.doesNotThrow(() => controller.appCtaClicked('calculator_footer'));
});

test('the final event filter removes URLs, query data, free text, and calculator values', () => {
  const sanitized = sanitizePosthogEvent({
    event: 'calculation_completed',
    properties: {
      token: 'phc_public_test',
      distinct_id: 'ephemeral',
      locale: 'en',
      page_path: '/alcohol-unit-calculator/',
      calculator_type: 'alcohol_unit',
      $current_url: 'https://mindrink.me/alcohol-unit-calculator/?volume=500',
      $referrer: 'https://example.com/private-search',
      $session_id: 'not-needed',
      volume: 500,
      abv: 5,
      total_grams: 19.7,
      note: 'free form text',
    },
  });

  assert.deepEqual(sanitized.properties, {
    token: 'phc_public_test',
    distinct_id: 'ephemeral',
    locale: 'en',
    page_path: '/alcohol-unit-calculator/',
    calculator_type: 'alcohol_unit',
  });
  assert.equal(normalizePagePath('/path/?secret=yes#result'), '/path/');
});

test('calculator integration passes no inputs or results to analytics helpers', async () => {
  const source = await readFile(new URL('../scripts/alcohol-unit-calculator.js', import.meta.url), 'utf8');
  assert.match(source, /trackCalculationCompleted\(\);/);
  assert.match(source, /trackCalculatorTotalAdded\(\);/);
  assert.match(source, /trackAppCtaClicked\('calculator_footer'\);/);
  assert.doesNotMatch(source, /trackCalculationCompleted\([^)]\S/);
  assert.doesNotMatch(source, /trackCalculatorTotalAdded\([^)]\S/);
  assert.doesNotMatch(source, /identify\(|initAnalyticsConsent|calculator_single_drink_changed/);
});

test('every HTML page has exactly one current analytics loader', async () => {
  const files = listHtmlFiles();
  assert.equal(files.length > 180, true);

  for (const file of files) {
    const html = await readFile(file, 'utf8');
    assert.equal(html, withAnalyticsLoader(html), file);
    assert.equal(html.split(ANALYTICS_LOADER).length - 1, 1, file);
  }
});
