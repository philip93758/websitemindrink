# Alcohol Unit Calculator Plan

## Summary

Build a static, SEO/AEO-friendly calculator page for Mindrink at `/alcohol-unit-calculator/` that calculates UK alcohol units, US standard drinks, 10g global/Mindrink standard drinks, pure alcohol grams, alcohol calories, and weekly totals from multiple drinks.

The website is currently a static HTML/CSS site with no build system. The Mindrink app has reusable alcohol assumptions in `mindrink/src/domain`, but the website should not import React Native internals or app storage logic.

## Hard Blockers Resolved

These decisions are required before implementation and are now fixed for V1.

### FAQ Copy

Use the FAQ questions and exact answers in the `FAQ And Structured Data` section. JSON-LD must match those visible answers exactly.

### Hero Copy

Use this hero:

- Breadcrumb: `Home / Alcohol unit calculator`
- H1: `Alcohol Unit & Drink Calculator`
- Intro: `Compare UK alcohol units, US standard drinks, 10g standard drinks, pure alcohol grams, and alcohol calories. Add several drinks to estimate a weekly total without storing your data.`

### Weekly Interpretation Thresholds

Use total UK units:

- Low: `0` to `< 7` UK units.
- Moderate: `7` to `14` UK units.
- Higher: `> 14` UK units.

If total is exactly `14.0` UK units, use the moderate message.

### SEO Metadata

Use:

- Title: `Alcohol Unit & Drink Calculator | UK, US & 10g Standards | Mindrink`
- Meta description: `Calculate UK alcohol units, US standard drinks, 10g standard drinks, pure alcohol grams, calories, and weekly drinking totals with Mindrink.`
- Canonical: `https://mindrink.me/alcohol-unit-calculator/`
- Robots: `index, follow`

### Existing `alcohol-units.html` Strategy

No redirect or consolidation. Keep two separate pages with separate canonicals:

- `https://mindrink.me/alcohol-units.html` remains the educational explainer.
- `https://mindrink.me/alcohol-unit-calculator/` becomes the interactive utility.

The two pages should cross-link naturally and avoid duplicated long-form copy.

## Current Codebase Findings

### Website

- Repository: `websitemindrink`
- Static files only; no `package.json` currently exists.
- Existing English AEO pages live at the root as `.html` files:
  - `alcohol-units.html`
  - `dry-day.html`
  - `reduce-drinking.html`
  - `binge-drinking.html`
  - `private-alcohol-tracking.html`
  - `what-to-look-for-in-alcohol-tracker.html`
- Existing AEO styling is in `styles.css` under the "AEO Answer Pages" section.
- Existing homepage knowledge section is in `index.html` under `Understand your drinking`.
- Existing `robots.txt` allows all crawling.
- Existing `sitemap.xml` uses `https://mindrink.me/...`.
- No website analytics implementation was found.

### App Logic To Reuse As Reference Only

- `mindrink/src/domain/drinkTypes.ts`
- `mindrink/src/domain/libUnits.ts`
- `mindrink/src/domain/libCalories.ts`
- `mindrink/src/types/drink.ts`

Important: the app's current `toAlcoholUnits()` uses a 10g pure alcohol unit:

```ts
gramsAlcohol = ml * (abvPct / 100) * 0.789
units = gramsAlcohol / 10
```

The calculator ticket requires UK alcohol units:

```ts
ukUnits = (volumeMl * abvPercent) / 1000
```

So the calculator should reuse the app's ethanol density and calorie assumptions, but should not label the app's current 10g unit calculation as UK units.

Decision: show the app's 10g unit basis as a separate comparison standard, labeled clearly as `10g global standard drinks` or `Mindrink 10g standard`, alongside UK units and US standard drinks.

## Open Decisions Before Implementation

1. Canonical domain:
   - Decision: use the existing production canonical pattern, `https://mindrink.me/...`.
   - Calculator canonical should be `https://mindrink.me/alcohol-unit-calculator/`.
   - Do not introduce `www.mindrink.me` for this page unless the whole site is migrated later.

2. URL shape:
   - Decision: use a static folder page at `alcohol-unit-calculator/index.html`.
   - Public URL should be `/alcohol-unit-calculator/`.
   - Canonical and sitemap should use `https://mindrink.me/alcohol-unit-calculator/`.
   - If the host redirects `/alcohol-unit-calculator` to `/alcohol-unit-calculator/`, that is acceptable.

3. Shared logic format:
   - Decision: keep the website static and use browser-ready JavaScript ES modules for V1.
   - Do not add TypeScript or a build step for this ticket.
   - The ticket mentions `.ts` files under `/shared/alcohol/`, but that is intentionally superseded for the website V1 because the current site has no TypeScript build.
   - Use equivalent `.js` files instead:
     - `shared/alcohol/constants.js`
     - `shared/alcohol/formulas.js`
     - `shared/alcohol/drinks.js`
   - Use clear naming and optional JSDoc typedefs to keep the logic understandable without TypeScript.
   - Do not create `.ts` files for the website implementation unless a later ticket introduces a build pipeline.

4. Test setup:
   - Decision: add formula tests only for V1, plus a manual UI verification checklist.
   - Do not add browser/UI test tooling for V1.
   - Keep testing focused on the shared math, invalid input handling, and rounding behavior.

5. Analytics:
   - Decision: add a privacy-safe no-op tracking wrapper for now.
   - No website analytics provider was found.
   - Do not add a new external analytics dependency as part of V1.
   - Event calls should be easy to wire into a provider later.

6. CTA target:
   - Decision: target the homepage `/` with the button text `Explore Mindrink`.
   - Keep the page useful first and commercial second.

7. Existing URL consistency:
   - Decision: preserve the current `.html` URL pattern for existing pages.
   - The calculator can use `/alcohol-unit-calculator/` because this ticket specifically creates a new utility URL.
   - Do not migrate existing AEO pages to clean URLs as part of this ticket.

## Proposed File Additions

```text
websitemindrink/
  alcohol-unit-calculator/
    index.html
  shared/
    alcohol/
      constants.js
      drinks.js
      formulas.js
  scripts/
    alcohol-unit-calculator.js
  docs/
    Ai/
      active/
        alcohol-unit-calculator-plan.md
```

Optional if formula tests are added:

```text
websitemindrink/
  package.json
  tests/
    alcohol-formulas.test.js
```

## Technical Implementation Decisions

### Input Method

Use standard HTML form controls:

- Drink type: `<select>` populated from `WEBSITE_DRINK_PRESETS`.
- Volume: `<input type="number" inputmode="decimal">`.
- ABV: `<input type="number" inputmode="decimal">`.
- Quantity: `<input type="number" inputmode="numeric" step="1">`.

Do not use sliders, combined free-text inputs, or natural-language parsing in V1.

### Default State

On initial page load:

- Single drink preset: Beer.
- Single drink volume: `500`.
- Single drink ABV: `5`.
- Single drink quantity: `1`.
- Weekly builder rows:
  - Beer, `500ml`, `5%`, quantity `3`.
  - Wine, `175ml`, `12%`, quantity `2`.

### Refresh And Persistence

The calculator is in-memory only for V1:

- Refresh performs a full reset to the default state above.
- Closing and reopening the page performs a full reset.
- Do not use `localStorage`.
- Do not use `sessionStorage`.
- Do not encode calculator state in query parameters.
- Do not store calculator inputs in cookies or backend storage.

### ES Module Loading

Load the calculator script from the page with one deferred module script:

```html
<script type="module" src="/scripts/alcohol-unit-calculator.js"></script>
```

Inside `/scripts/alcohol-unit-calculator.js`, import shared logic with root-relative module paths:

```js
import { WEBSITE_DRINK_PRESETS } from '/shared/alcohol/drinks.js';
import {
  calculateDrinkResult,
  calculateWeeklyTotals,
} from '/shared/alcohol/formulas.js';
```

Do not inline the calculator logic in `index.html` except for JSON-LD and existing small site scripts.

### Edge Case Behavior

- Empty volume, ABV, or quantity: show an incomplete neutral state such as `Enter drink details to see results.`
- `0ml`: valid zero result.
- `0% ABV`: valid zero result.
- Quantity `0`: valid zero result.
- Negative numbers: clamp to `0` or block with HTML `min="0"` and normalize to `0` before calculation.
- ABV above `100`: show a calm validation hint and do not display `NaN`.
- Volume above `5000ml`: show a calm validation hint and do not display `NaN`.
- Quantity above `100`: show a calm validation hint and do not display `NaN`.
- Decimal ABV values such as `4.5` are valid.
- Result placeholders must never show `NaN`, `Infinity`, or `undefined`.

## Existing Page And Duplicate Content Strategy

`alcohol-units.html` already exists and should remain the canonical educational page for explaining alcohol units.

The new calculator page should be positioned as a utility page, not a replacement or duplicate of `alcohol-units.html`.

Strategy:

- No redirect or consolidation is needed because the pages serve different intent.
- `alcohol-units.html` answers "what are alcohol units?" as an educational explainer.
- `/alcohol-unit-calculator/` answers "calculate my drink/weekly totals" as an interactive utility.
- The pages should cross-link naturally, but each should keep a distinct title, meta description, canonical URL, and primary content focus.

Rules:

- Do not redirect `alcohol-units.html`.
- Do not canonicalize `alcohol-units.html` to the calculator.
- Do not canonicalize the calculator to `alcohol-units.html`.
- Keep separate canonicals:
  - `https://mindrink.me/alcohol-units.html`
  - `https://mindrink.me/alcohol-unit-calculator/`
- Keep `alcohol-units.html` explanatory and link naturally to the calculator.
- Keep calculator page focused on interaction, examples, and concise explanations.
- Avoid copying long sections from `alcohol-units.html`; reuse concepts but write calculator-specific copy.

## Shared Alcohol Logic

### `shared/alcohol/constants.js`

Export deterministic constants:

- `ETHANOL_DENSITY_G_PER_ML = 0.789`
- `GLOBAL_STANDARD_DRINK_GRAMS = 10`
- `US_STANDARD_DRINK_GRAMS = 14`
- `ALCOHOL_KCAL_PER_GRAM = 7`

Optional validation limits:

- `MIN_VOLUME_ML = 0`
- `MAX_VOLUME_ML = 5000`
- `MIN_ABV_PERCENT = 0`
- `MAX_ABV_PERCENT = 100`
- `MIN_QUANTITY = 0`
- `MAX_QUANTITY = 100`

### `shared/alcohol/formulas.js`

Provide framework-independent functions:

- `normalizeAlcoholInput(input)`
- `calculateAlcoholGrams(volumeMl, abvPercent)`
- `calculateUkUnits(volumeMl, abvPercent)`
- `calculateGlobalStandardDrinks(alcoholGrams)`
- `calculateUsStandardDrinks(alcoholGrams)`
- `calculateAlcoholCalories(alcoholGrams)`
- `calculateDrinkResult({ volumeMl, abvPercent, quantity })`
- `calculateWeeklyTotals(rows)`
- `buildDrinkTypeBreakdown(rows)`
- `roundAlcoholResult(result)`

Safety rules:

- Empty input returns an empty/safe result object.
- Invalid values never produce displayed `NaN`.
- Negative numbers clamp to safe empty or zero state.
- Rounding:
  - grams: 1 decimal
  - UK units: 1 decimal
  - 10g global/Mindrink standard drinks: 1 decimal
  - US standard drinks: 1 decimal
  - calories: whole number

### `shared/alcohol/drinks.js`

Base presets on app taxonomy, simplified for website V1:

```js
export const WEBSITE_DRINK_PRESETS = [
  { id: 'beer', label: 'Beer', defaultVolumeMl: 500, defaultAbvPercent: 5 },
  { id: 'wine', label: 'Wine', defaultVolumeMl: 175, defaultAbvPercent: 12 },
  { id: 'sparkling_wine', label: 'Sparkling wine', defaultVolumeMl: 125, defaultAbvPercent: 11 },
  { id: 'cider', label: 'Cider', defaultVolumeMl: 330, defaultAbvPercent: 4.5 },
  { id: 'spirits', label: 'Spirits', defaultVolumeMl: 25, defaultAbvPercent: 40 },
  { id: 'cocktail', label: 'Cocktail', defaultVolumeMl: 150, defaultAbvPercent: 15 },
  { id: 'liqueur', label: 'Liqueur', defaultVolumeMl: 40, defaultAbvPercent: 20 },
  { id: 'fortified_wine', label: 'Fortified wine', defaultVolumeMl: 60, defaultAbvPercent: 18 },
  { id: 'custom', label: 'Custom', defaultVolumeMl: '', defaultAbvPercent: '' },
];
```

Mapping note:

- App has separate spirits: `whiskey`, `vodka`, `gin`, `tequila`, `rum`, `cognac_brandy`, `pastis_ouzo`.
- Website V1 should collapse those into `spirits`.

## Calculator Page Structure

Target page:

```text
/alcohol-unit-calculator/
```

Static path:

```text
alcohol-unit-calculator/index.html
```

Metadata:

- `<title>`: `Alcohol Unit & Drink Calculator | UK, US & 10g Standards | Mindrink`
- Meta description: `Calculate UK alcohol units, US standard drinks, 10g standard drinks, pure alcohol grams, calories, and weekly drinking totals with Mindrink.`
- Canonical: `https://mindrink.me/alcohol-unit-calculator/`
- Open Graph URL: `https://mindrink.me/alcohol-unit-calculator/`
- Open Graph title: `Alcohol Unit & Drink Calculator`
- Open Graph description should match or closely summarize the meta description.
- Robots: `index, follow`

Page structure:

1. Header
2. Hero with:
   - breadcrumb
   - `h1`: `Alcohol Unit & Drink Calculator`
   - intro, max 2 short sentences
3. Calculator section above the fold
4. What are alcohol units?
5. Alcohol units vs UK, US, 10g standard drinks, and pure alcohol grams
6. Common drink examples table
7. Weekly drinking patterns
8. FAQ
9. One CTA block
10. Footer

Hero copy:

- Breadcrumb: `Home / Alcohol unit calculator`
- H1: `Alcohol Unit & Drink Calculator`
- Intro: `Compare UK alcohol units, US standard drinks, 10g standard drinks, pure alcohol grams, and alcohol calories. Add several drinks to estimate a weekly total without storing your data.`

Heading hierarchy:

- `h1`: `Alcohol Unit & Drink Calculator`
- `h2`: `Calculate alcohol units and standard drinks`
- `h3`: `Single drink`
- `h3`: `Weekly total`
- `h2`: `What are alcohol units?`
- `h2`: `Alcohol units vs standard drinks vs pure alcohol grams`
- `h3`: `UK alcohol units`
- `h3`: `10g global and Mindrink standard drinks`
- `h3`: `US standard drinks`
- `h2`: `Common drink examples`
- `h2`: `Weekly drinking patterns`
- `h2`: `FAQ`
- `h2`: CTA heading, e.g. `Understand patterns over time`

Do not skip heading levels inside the main page content.

Use existing semantic AEO patterns:

- `body.answer-page`
- `section.answer-hero`
- `section.answer-content`
- `section.answer-block`
- `section.answer-cta`
- `table.answer-table`

Add page-specific classes for calculator UI:

- `.calculator-shell`
- `.calculator-grid`
- `.calculator-field`
- `.calculator-results`
- `.calculator-result`
- `.weekly-builder`
- `.weekly-row`
- `.weekly-breakdown`

## Single Drink Calculator UX

Inputs:

- Drink type
- Volume in ml
- ABV %
- Quantity

Input controls:

- Drink type: `<select>` populated from `WEBSITE_DRINK_PRESETS`.
- Volume in ml: numeric `<input type="number">`.
- ABV %: numeric `<input type="number">`, supports decimals.
- Quantity: numeric `<input type="number">`, supports whole numbers; use `step="1"`.
- Do not use sliders for V1 because exact serving sizes and ABV values matter.
- Do not use free-text parsing for V1.

Default on load:

- Single drink calculator defaults to Beer, `500ml`, `5%`, quantity `1`.
- Weekly builder starts with two example rows:
  - `3 x 500ml beer @ 5%`
  - `2 x 175ml wine @ 12%`
- Example rows are editable and are not stored after page exit/reload.

Refresh behavior:

- Page refresh resets the single drink calculator to Beer, `500ml`, `5%`, quantity `1`.
- Page refresh resets the weekly builder to the two editable example rows.
- Do not persist calculator state with `localStorage`, `sessionStorage`, cookies, URL query parameters, or backend storage in V1.

Outputs, always visible together:

- UK alcohol units
- 10g global/Mindrink standard drinks
- US standard drinks
- Pure alcohol grams
- Calories from alcohol

Rules:

- Instant recalculation.
- No submit button.
- No tabs.
- No modals.
- No standard toggle.
- Accessible labels for all inputs.
- Mobile-first layout.
- Invalid inputs show safe empty/result state.
- `0ml`, `0% ABV`, or quantity `0` are valid zero states and should display `0.0` standards and `0` calories.
- Empty fields should show a neutral placeholder/result state, not zero, so users can tell input is incomplete.
- Negative values should be clamped to zero or rejected by validation before calculation.
- Values above validation limits should not crash the UI and should show a calm validation hint.
- Decimal ABV values such as `4.5` must be supported.
- Decimal volume values can be accepted by the math layer, but UI copy should still label volume in ml.

## Weekly Builder UX

User actions:

- Add drink row.
- Edit drink type.
- Edit volume.
- Edit ABV.
- Edit quantity.
- Duplicate row.
- Delete row.

Weekly outputs:

- Total UK units.
- Total 10g global/Mindrink standard drinks.
- Total US standard drinks.
- Total pure alcohol grams.
- Estimated alcohol calories.
- Breakdown by drink type.

Storage rules:

- Keep weekly rows in JavaScript memory only for the current page session.
- Do not use `localStorage`.
- Do not use `sessionStorage`.
- Do not set cookies.
- Do not send drink values to analytics.
- Data disappears after leaving/reloading the page.
- This is intentional for V1 privacy and simplicity, not a bug.

Refresh behavior:

- Browser refresh resets the calculator to default Beer and weekly example rows.
- Do not show a warning before refresh/navigation in V1.
- Later persistence, if desired, must be an explicit privacy/product decision.

Neutral interpretation copy:

Interpretation thresholds use total UK units for V1:

- Low: `0` to `< 7` UK units.
- Moderate: `7` to `14` UK units.
- Higher: `> 14` UK units.

Interpretation copy:

- Low: "Your weekly total is relatively low. Tracking over time can still help you understand patterns."
- Moderate: "Your weekly total shows a noticeable pattern. Dry days can make weekly drinking easier to observe."
- Higher: "Your weekly total is higher. Seeing patterns over time may help you decide what feels right for you."

Threshold notes:

- These ranges are for neutral product interpretation only.
- Do not present them as diagnosis or personalized medical advice.
- If total is exactly `14.0` UK units, use the moderate message.
- If no weekly rows have valid values, show: "Add drinks to see a weekly pattern summary."

Avoid:

- "danger"
- "alcoholic"
- "addiction"
- "you must stop"
- diagnosis-style wording

## Common Examples Table

Include at least:

| Drink | Volume | ABV | UK units | 10g global standard drinks | US standard drinks | Pure alcohol grams |
| --- | --- | --- | --- | --- | --- | --- |
| Beer | 500ml | 5% | 2.5 | 2.0 | 1.4 | 19.7g |
| Wine | 175ml | 12% | 2.1 | 1.7 | 1.2 | 16.6g |
| Wine | 250ml | 12% | 3.0 | 2.4 | 1.7 | 23.7g |
| Spirit | 25ml | 40% | 1.0 | 0.8 | 0.6 | 7.9g |
| Spirit | 50ml | 40% | 2.0 | 1.6 | 1.1 | 15.8g |
| Cider | 330ml | 4.5% | 1.5 | 1.2 | 0.8 | 11.7g |

Generate table values from the same shared formula module if possible, or manually verify values against the module.

## FAQ And Structured Data

Visible FAQ must match JSON-LD exactly.

Questions:

1. How do you calculate alcohol units?
   - Answer: `UK alcohol units are calculated as volume in millilitres multiplied by ABV percentage, then divided by 1000. Pure alcohol grams are calculated as volume in millilitres multiplied by ABV as a decimal, then multiplied by 0.789.`
2. What is a UK alcohol unit?
   - Answer: `One UK alcohol unit is 10ml, or about 8g, of pure alcohol. A 500ml beer at 5% ABV contains about 2.5 UK units.`
3. What is a US standard drink?
   - Answer: `A US standard drink contains 14g of pure alcohol. This calculator divides pure alcohol grams by 14 to estimate US standard drinks.`
4. What is a 10g global standard drink?
   - Answer: `Some countries and health references use 10g of pure alcohol as a standard drink. Mindrink also uses this 10g basis for global comparisons, so the calculator shows it separately from UK and US measures.`
5. Are alcohol units the same in every country?
   - Answer: `No. UK alcohol units, US standard drinks, and 10g standard drinks use different reference amounts. Comparing through pure alcohol grams is the clearest way to move between systems.`
6. How many units are in a beer?
   - Answer: `A 500ml beer at 5% ABV contains about 2.5 UK units, 2.0 10g standard drinks, 1.4 US standard drinks, and 19.7g of pure alcohol.`
7. How many units are in a glass of wine?
   - Answer: `A 175ml glass of wine at 12% ABV contains about 2.1 UK units, 1.7 10g standard drinks, 1.2 US standard drinks, and 16.6g of pure alcohol.`
8. Can this calculator tell me if I drink too much?
   - Answer: `No. The calculator estimates alcohol amounts and weekly patterns, but it does not diagnose drinking or give personal medical advice. If you are concerned about your drinking, consider speaking with a qualified health professional.`
9. Does Mindrink store my calculator data?
   - Answer: `No. This calculator is stateless in V1. Your inputs are used in the browser for the current page session and are not stored after you leave or refresh the page.`

Structured data:

- `@context`: `https://schema.org`
- `@type`: `FAQPage`
- `mainEntity`: one entry per visible FAQ item

No exaggerated medical claims.

## Internal Linking Plan

Add links to calculator from:

- `alcohol-units.html`
- `dry-day.html`
- `binge-drinking.html`
- `reduce-drinking.html`
- `index.html`, in the `Understand your drinking` section
- `faq.html`

Calculator links to:

- `/alcohol-units.html`
- `/dry-day.html`
- `/reduce-drinking.html`
- `/private-alcohol-tracking.html`

Anchor text examples:

- "calculate alcohol units"
- "how alcohol units work"
- "what is a dry day"
- "reduce drinking without quitting"
- "private alcohol tracking"

Avoid:

- "click here"
- "learn more"
- repeated app-download framing

## Layout And Responsive Design

Use existing website breakpoints where possible and keep additional CSS scoped to calculator classes.

Breakpoints:

- Mobile: default layout up to `767px`.
- Tablet/desktop: enhance from `768px` and above.
- Wide desktop: rely on existing `.container` and `.narrow` constraints.

Mobile behavior:

- Calculator fields stack vertically.
- Result cards use one column.
- Weekly rows stack into labeled controls with action buttons below the inputs.
- Tables stay horizontally scrollable using the existing `.answer-table-wrap` pattern.
- No sticky panels or fixed CTAs.

Desktop behavior:

- Single drink form can use a compact grid.
- Results can use a 2-column or 4-column grid depending on available width.
- Weekly rows can use a row/grid layout with compact duplicate/delete buttons.

## Performance Budget

The page should remain a fast static utility page.

Budget:

- No new external runtime dependencies.
- No framework bundle.
- Calculator JS target: under 20KB uncompressed.
- Additional CSS target: under 12KB uncompressed.
- No image required for this utility page unless reused from existing assets.
- Avoid layout shift by giving result blocks stable structure.
- Calculator should be interactive immediately after the module loads.

Performance checks:

- Page should work with existing CSS and one small JS module.
- Avoid expensive recalculation loops; calculations are simple and event-driven.
- Debounce analytics event calls if a real provider is wired later, but do not debounce UI calculations.

## CTA Rules

Exactly one CTA block on the calculator page.

CTA placement:

- Near bottom after FAQ.

CTA copy:

- Text: "Tracking over time can make drinking patterns easier to understand."
- Button: "Explore Mindrink"

CTA target:

- `/`

Rules:

- No sticky CTA.
- No popup.
- No newsletter capture.
- Internal links should not be styled as CTA buttons.

## Analytics Plan

Add a privacy-safe no-op wrapper in V1:

```js
function trackCalculatorEvent(eventName) {
  if (typeof window.mindrinkTrack === 'function') {
    window.mindrinkTrack(eventName);
  }
}
```

Track only:

- `calculator_page_view`
- `calculator_single_drink_changed`
- `calculator_weekly_row_added`
- `calculator_weekly_row_deleted`
- `calculator_cta_clicked`

Do not send:

- exact drink quantities
- exact ABV
- exact volume
- exact weekly totals
- drink row contents
- personal identifiers

Events remain no-ops in V1. A real provider can be wired later without changing calculator behavior.

## Sitemap, Robots, Canonical

Tasks:

- Add calculator URL to `sitemap.xml`.
- Keep `robots.txt` unchanged unless a crawler issue is discovered.
- Add page canonical.
- Ensure no `noindex`.
- Ensure homepage or FAQ links to the page.

Canonical:

- Use `https://mindrink.me/alcohol-unit-calculator/` to match the static folder URL.
- Do not use `https://www.mindrink.me/alcohol-unit-calculator`.

Google Search Console indexing request is manual after deployment.

## Testing Plan

### Formula Tests

If a minimal Node test setup is added, cover:

- `500ml beer at 5% = 2.5 UK units`
- `500ml beer at 5% ~= 19.7g alcohol`
- `500ml beer at 5% ~= 2.0 10g global standard drinks`
- `US standard drinks = grams / 14`
- `10g global standard drinks = grams / 10`
- `calories = grams * 7`
- invalid values return safe empty/result state
- empty inputs do not display `NaN`

### Manual UI Checks

Cover:

- preset selection updates fields
- custom input works
- single drink results update instantly
- weekly totals update after adding a row
- duplicate row preserves row values
- deleting row updates totals
- invalid input does not crash the page
- calculator is usable on mobile
- all result standards are visible simultaneously
- CTA appears exactly once
- FAQ JSON-LD matches visible FAQ
- sitemap URL resolves

### Browser And Device Checks

Manual cross-browser coverage for V1:

- Chrome desktop.
- Safari desktop or iOS Safari if available.
- Firefox desktop.
- Mobile viewport around `390px` width.
- Desktop viewport around `1440px` width.

Minimum browser expectations:

- ES module support required.
- Numeric inputs should remain usable if browser-specific steppers differ.
- Page content remains readable if JavaScript fails; calculator interaction requires JavaScript.

## Implementation Order

1. Confirm open decisions:
   - any remaining copy preferences
2. Add shared alcohol logic.
3. Add formula tests if test setup is approved.
4. Add drink presets.
5. Build `alcohol-unit-calculator/index.html`.
6. Add page-specific calculator JS.
7. Add calculator styles to `styles.css`.
8. Add FAQ visible content and JSON-LD.
9. Add internal links from existing pages.
10. Add sitemap entry.
11. Run local static verification.
12. Manual mobile and SEO checks.

## Acceptance Checklist

- `/alcohol-unit-calculator/` loads.
- Calculator appears above the fold.
- No account required.
- No personal data stored.
- No exact drink data sent to analytics.
- UK units, 10g global/Mindrink standard drinks, US standard drinks, grams, and calories show together.
- Weekly builder supports multiple rows.
- Breakdown by drink type is accurate.
- Page uses semantic HTML.
- FAQ is visible and matches JSON-LD.
- Exactly one CTA block exists.
- Page is linked internally from at least five places.
- Calculator links naturally to at least three related pages.
- Sitemap includes the page.
- Page is crawlable and not noindexed.
- Formula tests pass if test setup is added.
- Mobile layout is readable.

## Risks

- If users request `/alcohol-unit-calculator`, the host should redirect or resolve cleanly to `/alcohol-unit-calculator/`.
- The ticket names TypeScript files, but V1 intentionally uses JavaScript modules to match the static website architecture.
- Existing app "units" are 10g units, not UK units; careless reuse would produce incorrect UK values.
- Formula tests cover math, but V1 relies on manual UI checks for browser interaction regressions.
- Analytics events are intentionally no-ops until a website analytics provider is chosen later.
