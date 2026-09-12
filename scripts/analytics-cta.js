// Exposure is a viewport observation, not proof of attention or an ordered funnel.
export function observeCtaExposure(target, onViewed, {
  documentObject = document,
  Observer = window.IntersectionObserver,
} = {}) {
  if (!target || !Observer) return () => {};
  let observer;
  let finished = false;
  const stop = () => {
    finished = true;
    observer?.disconnect();
    documentObject.removeEventListener('visibilitychange', onVisibilityChange);
  };
  const onVisibilityChange = () => {
    // Request a fresh intersection after returning to a backgrounded tab.
    if (!finished && documentObject.visibilityState === 'visible') {
      observer.disconnect();
      observer.observe(target);
    }
  };
  try {
    observer = new Observer((entries) => {
      if (finished || documentObject.visibilityState !== 'visible') return;
      if (entries.some(entry => entry.target === target && entry.isIntersecting && entry.intersectionRatio >= 0.5)) {
        stop();
        try { onViewed(); } catch { /* Analytics must never affect the calculator. */ }
      }
    }, { threshold: [0.5] });
    documentObject.addEventListener('visibilitychange', onVisibilityChange);
    observer.observe(target);
  } catch {
    stop();
  }
  return stop;
}

export function handleStoreCtaClick(event, controller, pathname = window.location.pathname) {
  if (event.defaultPrevented || (event.button !== undefined && event.button !== 0)) return;
  const anchor = event.target.closest?.('a[href]');
  if (!anchor || anchor.hasAttribute('download') || !anchor.classList.contains('btn')) return;
  let placement;
  if (anchor.closest('.hero')) placement = 'home_hero';
  else if (anchor.closest('.cta')) {
    placement = /\/blog\/best-alcohol-tracking-apps\.html$/.test(pathname)
      ? 'comparison_footer' : 'home_footer';
  }
  if (placement) controller.appStoreClicked(anchor.href, placement);
}
