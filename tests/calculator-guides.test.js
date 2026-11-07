import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createAnalyticsController, sanitizePosthogEvent } from '../scripts/analytics-core.js';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const locales = ['en', 'de', 'fr', 'es', 'pt', 'id', 'it', 'ja'];

for (const locale of locales) {
  const prefix = locale === 'en' ? '/' : `/${locale}/`;
  test(`${locale}: guides stay beside the matching results and link to local articles`, () => {
    const html = read(prefix.slice(1) + 'alcohol-unit-calculator/index.html');
    const unit = html.indexOf('data-calculator-guide="drink_units"');
    const weekly = html.indexOf('data-calculator-guide="weekly_patterns"');
    assert.ok(unit > html.indexOf('class="calculator-results selected-results"'));
    assert.ok(unit < html.indexOf('class="total-actions"'));
    assert.ok(weekly > html.indexOf('id="total-totals"'));
    assert.ok(weekly < html.indexOf('</section>', html.indexOf('id="calculator"')));
    for (const [guide, slug] of [['drink_units', 'what-counts-as-a-drink-alcohol-units'], ['weekly_patterns', 'why-weekly-drinking-patterns-matter']]) {
      assert.equal(html.split(`data-calculator-guide="${guide}"`).length - 1, 1);
      assert.ok(html.includes(`href="${prefix}blog/${slug}.html" data-calculator-guide="${guide}"`));
    }
    const guide = read(prefix.slice(1) + 'blog/what-counts-as-a-drink-alcohol-units.html');
    const hero = guide.match(/<h1 class="page-title">[\s\S]*?<\/p>/)[0];
    assert.ok(hero.includes(`href="${prefix}alcohol-units.html"`));
    const answer = read(prefix.slice(1) + 'alcohol-units.html').match(/<main>[\s\S]*?<\/main>/)[0];
    assert.ok(answer.includes(`href="${prefix}blog/what-counts-as-a-drink-alcohol-units.html"`));
  });
}

function fixture(pathname = '/de/alcohol-unit-calculator/', privacySignal = false) {
  const events = [];
  const controller = createAnalyticsController({
    privacySignal,
    getContext: () => ({ locale: 'de', pathname }),
    loadConfig: async () => ({ publicToken: 'phc_test', apiHost: 'https://eu.i.posthog.com' }),
    loadPosthog: async () => ({ init() {}, capture: (event, properties) => events.push({ event, properties }) }),
  });
  return { controller, events };
}

test('guide exposures deduplicate independently and preserve the minimal payload', async () => {
  const { controller, events } = fixture('/de/alcohol-unit-calculator/?private=value#total');
  assert.equal(controller.calculatorGuideViewed('drink_units'), true);
  assert.equal(controller.calculatorGuideViewed('drink_units'), false);
  assert.equal(controller.calculatorGuideViewed('weekly_patterns'), true);
  assert.equal(controller.calculatorGuideViewed('private text'), false);
  await controller.ready();
  assert.deepEqual(events, ['drink_units', 'weekly_patterns'].map(guide => ({
    event: 'calculator_guide_viewed',
    properties: { locale: 'de', page_path: '/de/alcohol-unit-calculator/', calculator_type: 'alcohol_unit', guide, $geoip_disable: true },
  })));
  await controller.setOptOut(true);
  assert.equal(controller.calculatorGuideViewed('weekly_patterns'), false);
});

test('guide exposure stays disabled outside calculators and under privacy signals', async () => {
  for (const [path, blocked] of [['/de/', false], ['/de/alcohol-unit-calculator/', true]]) {
    const { controller, events } = fixture(path, blocked);
    assert.equal(controller.calculatorGuideViewed('drink_units'), false);
    await controller.ready();
    assert.deepEqual(events, []);
  }
});

test('guide properties accept fixed names only and cannot leak into other events', () => {
  assert.equal(sanitizePosthogEvent({ event: 'calculator_guide_viewed', properties: { guide: 'private free text' } }), null);
  assert.equal(sanitizePosthogEvent({ event: 'calculator_guide_viewed', properties: {} }), null);
  const event = sanitizePosthogEvent({ event: 'calculator_guide_viewed', properties: {
    guide: 'drink_units', locale: 'de', $current_url: 'https://example.org/private', volume: 500, result: 19.7,
  } });
  assert.deepEqual(event.properties, { guide: 'drink_units', locale: 'de' });
  assert.deepEqual(sanitizePosthogEvent({ event: 'calculator_started', properties: { guide: 'drink_units' } }).properties, {});
});
