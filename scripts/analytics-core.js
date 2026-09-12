export const ANALYTICS_EVENTS = Object.freeze({
  sitePageViewed: 'site_page_viewed',
  internalNavigationClicked: 'internal_navigation_clicked',
  calculatorStarted: 'calculator_started',
  calculationCompleted: 'calculation_completed',
  calculatorTotalAdded: 'calculator_total_added',
  appCtaClicked: 'app_cta_clicked',
  appCtaViewed: 'app_cta_viewed',
  appStoreClicked: 'app_store_clicked',
});

export const ANALYTICS_OPT_OUT_KEY = 'mindrink_analytics_opt_out';

const SUPPORTED_LOCALES = new Set(['en', 'de', 'fr', 'es', 'pt', 'id', 'it', 'ja']);
const ALLOWED_CTA_LOCATIONS = new Set(['calculator_footer']);
const ALLOWED_EVENT_NAMES = new Set(Object.values(ANALYTICS_EVENTS));
const SDK_PROPERTY_KEYS = new Set([
  'token',
  'distinct_id',
  '$device_id',
  '$lib',
  '$lib_version',
  '$process_person_profile',
  '$geoip_disable',
]);
const EVENT_PROPERTY_KEYS = new Set([
  'locale',
  'page_path',
  'from_page_path',
  'to_page_path',
  'calculator_type',
  'cta_location',
  'page_family',
  'store',
]);

export function resolveStoreCta(href, pathname, placement) {
  const path = normalizePagePath(pathname);
  const localePrefix = '(?:(?:en|de|fr|es|pt|id|it|ja)/)?';
  const home = new RegExp(`^/${localePrefix}(?:index\\.html)?$`).test(path);
  const comparison = new RegExp(`^/${localePrefix}blog/best-alcohol-tracking-apps\\.html$`).test(path);
  const validPlacement = home
    ? ['home_hero', 'home_footer'].includes(placement)
    : comparison && placement === 'comparison_footer';
  if (!validPlacement) return null;

  try {
    const url = new URL(href);
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return null;
    let store;
    if (url.hostname === 'apps.apple.com'
      && /^\/(?:[a-z]{2}\/)?app\/(?:[^/]+\/)?id6756892721\/?$/.test(url.pathname)) {
      store = 'app_store';
    } else if (url.hostname === 'play.google.com'
      && url.pathname === '/store/apps/details'
      && url.searchParams.get('id') === 'com.mindrink.app') {
      store = 'google_play';
    } else return null;
    return { store, cta_location: placement, page_family: home ? 'home' : 'app_comparison' };
  } catch {
    return null;
  }
}

export function normalizePagePath(pathname = '/') {
  const pathOnly = String(pathname).split(/[?#]/, 1)[0].replace(/\\/g, '/');
  const withLeadingSlash = pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`;
  const normalized = withLeadingSlash.replace(/\/{2,}/g, '/');
  const path = normalized.length > 1 && normalized.endsWith('/') ? normalized : normalized || '/';
  return path.length <= 240 ? path : '/';
}

export function resolveInternalNavigation(href, { origin, pathname } = {}) {
  try {
    const siteOrigin = new URL(origin).origin;
    const destination = new URL(href, siteOrigin);
    if (destination.origin !== siteOrigin || !/^https?:$/.test(destination.protocol)) return null;

    const fromPagePath = normalizePagePath(pathname);
    const toPagePath = normalizePagePath(destination.pathname);
    if (fromPagePath === toPagePath) return null;

    return {
      from_page_path: fromPagePath,
      to_page_path: toPagePath,
    };
  } catch {
    return null;
  }
}

export function browserPrivacySignalActive({
  globalPrivacyControl,
  navigatorDoNotTrack,
  windowDoNotTrack,
  msDoNotTrack,
} = {}) {
  const doNotTrackValues = [navigatorDoNotTrack, windowDoNotTrack, msDoNotTrack]
    .map((value) => String(value ?? '').toLowerCase());
  return globalPrivacyControl === true
    || doNotTrackValues.includes('1')
    || doNotTrackValues.includes('yes');
}

export function sanitizePosthogEvent(event) {
  if (!event || !ALLOWED_EVENT_NAMES.has(event.event)) return null;

  const properties = {};
  for (const [key, value] of Object.entries(event.properties || {})) {
    if ((SDK_PROPERTY_KEYS.has(key) || EVENT_PROPERTY_KEYS.has(key)) && value !== undefined) {
      properties[key] = value;
    }
  }

  if (event.event === ANALYTICS_EVENTS.appStoreClicked) {
    if (!['app_store', 'google_play'].includes(properties.store)) return null;
    const placements = properties.page_family === 'home'
      ? ['home_hero', 'home_footer']
      : properties.page_family === 'app_comparison' ? ['comparison_footer'] : [];
    if (!placements.includes(properties.cta_location)) return null;
    delete properties.calculator_type;
    delete properties.from_page_path;
    delete properties.to_page_path;
  } else {
    delete properties.store;
    delete properties.page_family;
  }

  return { ...event, properties };
}

function validConfig(config) {
  if (!config?.publicToken || typeof config.publicToken !== 'string') return null;

  try {
    const apiHost = new URL(config.apiHost || 'https://eu.i.posthog.com');
    if (apiHost.protocol !== 'https:' || apiHost.hostname !== 'eu.i.posthog.com') return null;
    return { publicToken: config.publicToken.trim(), apiHost: apiHost.origin };
  } catch {
    return null;
  }
}

function safeStorageRead(storage) {
  try {
    return storage?.getItem(ANALYTICS_OPT_OUT_KEY) === 'true';
  } catch {
    return false;
  }
}

function safeStorageWrite(storage, optedOut) {
  try {
    if (optedOut) storage?.setItem(ANALYTICS_OPT_OUT_KEY, 'true');
    else storage?.removeItem(ANALYTICS_OPT_OUT_KEY);
  } catch {
    // The in-memory choice still applies for this page visit.
  }
}

export function createAnalyticsController({
  loadConfig,
  loadPosthog,
  storage,
  getContext,
  privacySignal = false,
}) {
  const blockedByPrivacySignal = Boolean(privacySignal);
  let optedOut = blockedByPrivacySignal || safeStorageRead(storage);
  let sdk = null;
  let initialization = null;
  let eventQueue = [];
  let sitePageViewRequested = false;
  let sitePageViewQueued = false;
  let calculatorStarted = false;
  let appCtaViewed = false;

  function contextProperties({ includePagePath = true, calculator = false } = {}) {
    const context = getContext?.() || {};
    const properties = {
      locale: SUPPORTED_LOCALES.has(context.locale) ? context.locale : 'en',
    };
    if (includePagePath) properties.page_path = normalizePagePath(context.pathname);
    if (calculator) properties.calculator_type = 'alcohol_unit';
    return properties;
  }

  function captureNow(item) {
    if (optedOut || !sdk) return false;
    try {
      sdk.capture(item.event, { ...item.properties, $geoip_disable: true });
      return true;
    } catch {
      return false;
    }
  }

  function flushQueue() {
    const queued = eventQueue;
    eventQueue = [];
    queued.forEach(captureNow);
  }

  async function ensureInitialized() {
    if (optedOut) return null;
    if (sdk) {
      flushQueue();
      return sdk;
    }
    if (initialization) return initialization;

    initialization = (async () => {
      const config = validConfig(await loadConfig());
      if (!config || optedOut) return null;

      const loadedSdk = await loadPosthog();
      if (!loadedSdk || typeof loadedSdk.init !== 'function' || optedOut) return null;

      loadedSdk.init(config.publicToken, {
        api_host: config.apiHost,
        autocapture: false,
        capture_pageview: false,
        capture_pageleave: false,
        capture_heatmaps: false,
        capture_dead_clicks: false,
        capture_exceptions: false,
        capture_performance: false,
        rageclick: false,
        disable_session_recording: true,
        disable_surveys: true,
        advanced_disable_flags: true,
        person_profiles: 'never',
        persistence: 'memory',
        disableDeviceModel: true,
        before_send: sanitizePosthogEvent,
      });

      if (optedOut) return null;
      sdk = loadedSdk;
      flushQueue();
      return sdk;
    })().catch(() => {
      eventQueue = [];
      return null;
    }).finally(() => {
      initialization = null;
    });

    return initialization;
  }

  function enqueue(event, extraProperties = {}, contextOptions = {}) {
    if (optedOut || !ALLOWED_EVENT_NAMES.has(event)) return false;
    const item = {
      event,
      properties: { ...contextProperties(contextOptions), ...extraProperties },
    };
    if (sdk) return captureNow(item);
    eventQueue.push(item);
    void ensureInitialized();
    return true;
  }

  function requestSitePageView() {
    sitePageViewRequested = true;
    if (sitePageViewQueued || optedOut) return false;
    sitePageViewQueued = true;
    return enqueue(ANALYTICS_EVENTS.sitePageViewed);
  }

  async function setOptOut(nextOptOut) {
    if (blockedByPrivacySignal && !nextOptOut) return false;
    optedOut = Boolean(nextOptOut);
    safeStorageWrite(storage, optedOut);

    if (optedOut) {
      eventQueue = [];
      if (sdk) {
        try {
          sdk.stopSessionRecording?.();
          sdk.persistence?.clear?.();
          sdk.sessionPersistence?.clear?.();
        } catch {
          // The controller state still prevents every future capture call.
        }
      }
      return true;
    }

    if (sitePageViewRequested) requestSitePageView();
    await ensureInitialized();
    return true;
  }

  return Object.freeze({
    getState: () => (blockedByPrivacySignal ? 'blocked' : optedOut ? 'opted_out' : 'enabled'),
    setOptOut,
    ready: () => initialization || Promise.resolve(sdk),
    sitePageViewed: requestSitePageView,
    internalNavigationClicked(toPagePath) {
      const context = getContext?.() || {};
      const fromPagePath = normalizePagePath(context.pathname);
      const normalizedDestination = normalizePagePath(toPagePath);
      if (fromPagePath === normalizedDestination) return false;
      return enqueue(
        ANALYTICS_EVENTS.internalNavigationClicked,
        {
          from_page_path: fromPagePath,
          to_page_path: normalizedDestination,
        },
        { includePagePath: false },
      );
    },
    calculatorStarted() {
      if (calculatorStarted || optedOut) return false;
      calculatorStarted = true;
      return enqueue(ANALYTICS_EVENTS.calculatorStarted, {}, { calculator: true });
    },
    calculationCompleted: () => enqueue(
      ANALYTICS_EVENTS.calculationCompleted,
      {},
      { calculator: true },
    ),
    calculatorTotalAdded: () => enqueue(
      ANALYTICS_EVENTS.calculatorTotalAdded,
      {},
      { calculator: true },
    ),
    appCtaClicked(ctaLocation) {
      if (!ALLOWED_CTA_LOCATIONS.has(ctaLocation)) return false;
      return enqueue(
        ANALYTICS_EVENTS.appCtaClicked,
        { cta_location: ctaLocation },
        { calculator: true },
      );
    },
    appCtaViewed(ctaLocation) {
      if (appCtaViewed || optedOut || !ALLOWED_CTA_LOCATIONS.has(ctaLocation)) return false;
      appCtaViewed = true;
      return enqueue(
        ANALYTICS_EVENTS.appCtaViewed,
        { cta_location: ctaLocation },
        { calculator: true },
      );
    },
    appStoreClicked(href, placement) {
      const properties = resolveStoreCta(href, getContext?.()?.pathname, placement);
      return properties ? enqueue(ANALYTICS_EVENTS.appStoreClicked, properties) : false;
    },
  });
}
