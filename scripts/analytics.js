import {
  browserPrivacySignalActive,
  createAnalyticsController,
  resolveInternalNavigation,
} from '/scripts/analytics-core.js?v=analytics-20260829b';

const COPY = {
  en: {
    title: 'Website analytics',
    enabled: 'Privacy-minimized website analytics is currently on.',
    optedOut: 'Website analytics is off in this browser.',
    blocked: 'Your browser privacy signal keeps website analytics off.',
    disable: 'Turn off website analytics',
    enable: 'Turn on website analytics',
  },
  de: {
    title: 'Website-Analyse',
    enabled: 'Die datensparsame Website-Analyse ist derzeit aktiviert.',
    optedOut: 'Die Website-Analyse ist in diesem Browser deaktiviert.',
    blocked: 'Das Datenschutzsignal deines Browsers hält die Website-Analyse deaktiviert.',
    disable: 'Website-Analyse deaktivieren',
    enable: 'Website-Analyse aktivieren',
  },
  fr: {
    title: 'Analyse du site',
    enabled: 'L’analyse du site respectueuse de la vie privée est actuellement activée.',
    optedOut: 'L’analyse du site est désactivée dans ce navigateur.',
    blocked: 'Le signal de confidentialité de votre navigateur maintient l’analyse désactivée.',
    disable: 'Désactiver l’analyse du site',
    enable: 'Activer l’analyse du site',
  },
  es: {
    title: 'Analítica del sitio',
    enabled: 'La analítica del sitio con datos mínimos está activada.',
    optedOut: 'La analítica del sitio está desactivada en este navegador.',
    blocked: 'La señal de privacidad de tu navegador mantiene desactivada la analítica.',
    disable: 'Desactivar la analítica del sitio',
    enable: 'Activar la analítica del sitio',
  },
  pt: {
    title: 'Análise do site',
    enabled: 'A análise do site com dados mínimos está ativada.',
    optedOut: 'A análise do site está desativada neste navegador.',
    blocked: 'O sinal de privacidade do navegador mantém a análise desativada.',
    disable: 'Desativar análise do site',
    enable: 'Ativar análise do site',
  },
  id: {
    title: 'Analitik situs',
    enabled: 'Analitik situs dengan data minimal sedang aktif.',
    optedOut: 'Analitik situs dimatikan di browser ini.',
    blocked: 'Sinyal privasi browser kamu membuat analitik tetap dimatikan.',
    disable: 'Matikan analitik situs',
    enable: 'Aktifkan analitik situs',
  },
  it: {
    title: 'Analytics del sito',
    enabled: 'L’analytics del sito con dati minimi è attualmente attiva.',
    optedOut: 'L’analytics del sito è disattivata in questo browser.',
    blocked: 'Il segnale di privacy del browser mantiene disattivata l’analytics.',
    disable: 'Disattiva analytics del sito',
    enable: 'Attiva analytics del sito',
  },
  ja: {
    title: 'ウェブサイト分析',
    enabled: 'データを最小限にしたウェブサイト分析は現在オンです。',
    optedOut: 'このブラウザではウェブサイト分析がオフです。',
    blocked: 'ブラウザのプライバシー信号により、分析はオフになっています。',
    disable: 'ウェブサイト分析をオフにする',
    enable: 'ウェブサイト分析をオンにする',
  },
};

const documentLocale = document.documentElement.lang.split('-', 1)[0];
const locale = COPY[documentLocale] ? documentLocale : 'en';
const copy = COPY[locale];

function getBrowserStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

const privacySignal = browserPrivacySignalActive({
  globalPrivacyControl: navigator.globalPrivacyControl,
  navigatorDoNotTrack: navigator.doNotTrack,
  windowDoNotTrack: window.doNotTrack,
  msDoNotTrack: navigator.msDoNotTrack,
});

const controller = createAnalyticsController({
  storage: getBrowserStorage(),
  privacySignal,
  getContext: () => ({ locale, pathname: window.location.pathname }),
  loadConfig: async () => {
    const module = await import('/scripts/analytics-config.js');
    return module.POSTHOG_CONFIG;
  },
  loadPosthog: async () => {
    const module = await import('/scripts/vendor/posthog.js?v=posthog-1.422.5');
    return module.default;
  },
});

function renderOptOutControl() {
  const root = document.querySelector('[data-analytics-opt-out]');
  if (!root) return;

  const state = controller.getState();
  const title = document.createElement('h3');
  const status = document.createElement('p');
  title.textContent = copy.title;
  status.setAttribute('aria-live', 'polite');
  status.textContent = state === 'blocked'
    ? copy.blocked
    : state === 'opted_out'
      ? copy.optedOut
      : copy.enabled;

  root.replaceChildren(title, status);
  if (state === 'blocked') return;

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = state === 'opted_out' ? copy.enable : copy.disable;
  button.addEventListener('click', () => {
    if (controller.getState() === 'enabled') {
      void controller.setOptOut(true).then(renderOptOutControl);
      return;
    }

    void controller.setOptOut(false).finally(() => window.location.reload());
  });
  root.append(button);
}

function handleInternalNavigation(event) {
  if (event.defaultPrevented || (event.button !== undefined && event.button !== 0)) return;
  const anchor = event.target.closest?.('a[href]');
  if (!anchor || anchor.hasAttribute('download')) return;

  const transition = resolveInternalNavigation(anchor.href, {
    origin: window.location.origin,
    pathname: window.location.pathname,
  });
  if (transition) controller.internalNavigationClicked(transition.to_page_path);
}

controller.sitePageViewed();
document.addEventListener('click', handleInternalNavigation, { capture: true });

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderOptOutControl, { once: true });
} else {
  renderOptOutControl();
}

export const trackCalculatorStarted = () => controller.calculatorStarted();
export const trackCalculationCompleted = () => controller.calculationCompleted();
export const trackCalculatorTotalAdded = () => controller.calculatorTotalAdded();
export const trackAppCtaClicked = (ctaLocation) => controller.appCtaClicked(ctaLocation);
