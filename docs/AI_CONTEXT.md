# Mindrink Website — Agent Context

Agent entry for the public website repository (`websitemindrink`).

## Website docs (this repo)

| Need | Path |
|---|---|
| Active tickets (local) | `docs/Ai/active/` — **gitignored** in this repo |
| SEO/UX action and release-evidence log | [SEO_ACTION_LOG.md](SEO_ACTION_LOG.md) — tracked; sanitized implementation history and links to private Atrium analysis |
| Closed workstreams | **Moved to Atrium** — see below |

## Ownership

- **This repo:** website pages, locale SEO implementation, deployment, content tickets
- **Atrium:** SEO/growth ops, GSC workflow, ticket intake, platform KB (index-only link to this repo)

## Archive (Atrium)

| | Path |
|---|---|
| Local | `../../mindrink-atrium/docs/atrium/archive/mindrink-website/` |
| GitHub | https://github.com/philip93758/mindrink-atrium/tree/dev/docs/atrium/archive/mindrink-website |

## Platform rules (Atrium — separate repo)

Clone sibling repos under the same `Dev/` parent for local paths below.

| Need | Local (sibling) | GitHub |
|---|---|---|
| Hard agent boundaries | [../../mindrink-atrium/AGENTS.md](../../mindrink-atrium/AGENTS.md) | https://github.com/philip93758/mindrink-atrium/blob/dev/AGENTS.md |
| Platform KB entry | [../../mindrink-atrium/docs/atrium/AI_CONTEXT.md](../../mindrink-atrium/docs/atrium/AI_CONTEXT.md) | https://github.com/philip93758/mindrink-atrium/blob/dev/docs/atrium/AI_CONTEXT.md |
| Atrium website index | [../../mindrink-atrium/docs/mindrink-website/README.md](../../mindrink-atrium/docs/mindrink-website/README.md) | https://github.com/philip93758/mindrink-atrium/blob/dev/docs/mindrink-website/README.md |

Do not mirror website docs into Atrium. Do not edit Atrium platform files from a website session unless the human opens that repo separately.

## Sitemap `lastmod` workflow

Analytics-loader cache-version changes alone are excluded from `lastmod`, both in the working tree and in committed history. They do not represent refreshed indexed content.

`sitemap.xml` is committed static output. Keep its per-URL `<lastmod>` values synchronized with significant source changes:

```bash
npm run sitemap:update
npm run sitemap:check
```

- Run `sitemap:update` before committing changes to page content, headings, internal links, structured data, or calculator behaviour.
- The updater maps every sitemap URL to its local HTML file. Calculator pages also track the shared calculator script and alcohol-formula modules.
- A currently edited source receives today's date; unchanged sources use their latest Git commit date.
- Do not hand-stamp every URL with the deployment or sitemap-generation date.
- Do not update `lastmod` for copyright-only, formatting-only, or asset-compression changes that do not significantly change the indexed page. Shared styling and image assets are intentionally not automatic dependencies.
- Keep the existing sitemap URL, canonical, and hreflang structure intact. The updater changes `<lastmod>` values only.
- `npm test` includes the sitemap synchronization check and will direct the agent to run `sitemap:update` when significant page sources are newer.

## Automated static SEO gate

The check belongs in this website repository, not Atrium. Run `npm run seo:check` to check the public source inventory without network access or credentials. `npm run build` includes it, and the existing GitHub Actions deployment depends on a successful build. A failure exits nonzero and prevents that release from deploying; it does not run continuously against the live site.

- `tools/check-site-seo.js` checks exactly the directories/root files staged by `.github/workflows/deploy-pages.yml`. Its tests guard that contract. Private docs, dependencies and authoring tools are not public targets, and the checker itself is not published.
- Every current public HTML page requires one non-empty title, description and H1, its expected document language and self-canonical, consistent Open Graph URL when present, and no `noindex`. The current site contract is eight equivalent language versions plus English `x-default`; language targets must be published, self-inclusive, reciprocal and consistent within each family.
- Internal hyperlinks must resolve to published files, including relative links, query strings, encoded fragments and cross-page anchor IDs. The sitemap must contain each published canonical exactly once, with the same language alternatives as its HTML. Existing `sitemap:check` separately validates modification dates.
- This is a bounded static HTML/XML scanner, not a browser crawler or general schema validator. It does not verify external-site availability, robots.txt/server headers, deployed HTTP behaviour, Google crawl/indexing/snippet choices, copy quality or traffic impact. Keep live GSC analysis in Atrium; do not put analytics credentials into this gate.
- `npm test` exercises positive and deliberately broken fixtures, failure exit status, the real website inventory and deployment wiring. If changing the publishing contract or adding a new language/page family, update the checker and tests deliberately rather than bypassing failures.
- `tests/methodology-references.test.js` protects the equivalent WHO edition notes. Keep the 2018 citation distinct from the newer 2024 background link; editing a reference does not authorize changing calculator thresholds or formulas.

## Multilingual SEO and UX changes

- Record meaningful SEO/content/UX changes in [SEO_ACTION_LOG.md](SEO_ACTION_LOG.md), including affected URLs/locales, changed slots, implementation revision and the separate actual deployment evidence when known. Append dated analysis outcomes; never treat a commit or sitemap date as the production release date. Keep raw/private analytics in Atrium, linked rather than copied into Git.
- Use corresponding existing content slots across all eight languages. Local search terms and natural wording may differ; new explanations, section roles, features and CTA journeys must have equivalent coverage.
- Do not introduce new locale-only sections or restore intentionally removed content. A shared structural change needs explicit approval and localized coverage before release.
- `tests/seo-ux.test.js` and its locale fixture protect the current sections, heading hierarchy, language routing, calculator labels, CTA meaning and comparison disclosures. Existing differences in localized FAQs and comparison introductions are preserved by the baseline, not endorsed as a pattern for new divergence. Update that structural baseline only for an approved change.
- Keep the calculator CTA pointed at the same-language homepage. Store-click measurement belongs on existing homepage/comparison buttons. See [ANALYTICS.md](ANALYTICS.md) for event meaning and privacy constraints.

### Calculator reference units

- The Japanese calculator retains **10 g per ドリンク**. Use `純アルコール量（g）` for grams and `ドリンク（10 g）` for its reference output; distinguish Japan's traditional roughly 20 g `単位` and the physical volume `1合 = 180 ml`. These reference quantities are not drinking recommendations. Keep the shared 0.789 g/ml density; Japanese official illustrations often use the simplified 0.8 factor, explained in the existing Japanese formula/reference slots. `tests/japanese-units.test.js` and browser QA protect the examples, quantity/totals, FAQ parity, preserved structure and unchanged app threshold table. Sources and review limits are recorded in SEO-20261012-04.
- The owner-approved Italian calculator shows **Mindrink units (10 g)** alongside **Italian UA (12 g)**. Its original reference result stays `selected-global` / `total-global`; `selected-italian` / `total-italian` replace the UK result slots in Italian only. Added-drink summaries and examples also show both measures. `CALCULATOR_REFERENCE_GRAMS_BY_LOCALE` in `shared/alcohol/constants.js` selects 12 g only for the Italian UA calculation; the other seven languages and default formula callers retain 10 g. Do not replace the app result with the national reference again. The 10 g definition is also used by WHO's AUDIT; cite that specific context rather than claiming a universal national unit.
- `calculateDrinkResult(input, referenceGrams)` returns `referenceUnits`; `calculateTotals(rows, referenceGrams)` returns `totalReferenceUnits`. Quantity is included before conversion, and totals use unrounded grams. Round only the display results. The existing `globalStandardDrinks` / `totalGlobalStandardDrinks` fields and `GLOBAL_STANDARD_DRINK_GRAMS = 10` retain the app comparison reference. UK units remain based on 10 ml of pure alcohol; US standard drinks remain 14 g; calories represent alcohol alone.
- The Italian methodology's app thresholds, source editions and quantities in grams remain unchanged. Do not relabel its 10 g threshold tables as 12 g units or imply that the app changed convention. The Italian explanation cites [ISS/PASSI's 12 g definition](https://www.epicentro.iss.it/passi/indicatori/alcol); this is a measurement definition, not a new drinking recommendation.
- The Italian entries in the accuracy/SEO fixtures were deliberately refreshed for this localization on 2026-10-12. Formula, table, FAQ-schema and browser checks protect the Italian conversion, unrounded totals, unchanged app threshold table, and calculations in the other seven languages. Cache versions and sitemap dependency dates do not establish deployment or Google crawl dates.

## History episode content sync

Episode 1.1's approved Markdown is in Atrium's `docs/marketing/Content/History series/Ep 1.1/approved/` folder. From this website repository, import the six revised editions and verify all eight with:

```bash
npm run science:episode:sync -- "../mindrink-atrium/docs/marketing/Content/History series/Ep 1.1/approved" --approved --locales de,es,it,pt,id,ja
npm run science:episode:sync -- "../mindrink-atrium/docs/marketing/Content/History series/Ep 1.1/approved" --approved --check
npm run sitemap:update
npm run build
npm test
```

- Keep the first source paragraph as the article deck in the hero; the remaining introductory paragraphs belong in the article body.
- `--approved` requires exactly one canonical or dated `pipeline-polished` source per language in the explicitly supplied directory. Multiple candidates stop the import; do not silently select the latest draft. It validates all eight sources before writing and reuses the website's existing credited images. Legacy canonical filenames plus `_assets/selected` remain supported without this flag.
- `--locales` limits the write/check set. English and French were frozen for the 13 October 2026 six-language refresh; keep the scoped write command above unless the owner explicitly includes them in a subsequent edit. A full `--check` remains read-only and confirms they match their approved originals.
- Editorial `<!-- section:... -->` markers are validated and omitted from rendered headings and prose. Preserve all fifteen references and the source's paragraph divisions, including the five-paragraph Spanish/Italian conclusions. Next-episode teaser variants link to Episode 1.2's actual localized title, not its superseded planned title.
- All eight editions are continuous essays: five `##` sections (including references), no body `###` subsections, and no argument-map diagrams. Image placement follows first-mention anchors (Jiahu, Georgian jar sites, Göbekli Tepe enclosure then pillar). If that structure changes, update the importer before running it.
- Preserve credited images and captions. When references or the opening change, reconcile the article checks with the approved source. Verify that every citation resolves and review the page on mobile and desktop.
- `--check` verifies article content without writing files. Re-importing unchanged content preserves its article modification date.

### Episode 1.2 — Mesopotamia

The approved eight-language source is Atrium's `docs/marketing/Content/History series/Ep 1.2/approved/`. Import without editing that sibling repository:

```bash
npm run science:episode12:sync -- "../mindrink-atrium/docs/marketing/Content/History series/Ep 1.2/approved" --approved
npm run science:episode12:sync -- "../mindrink-atrium/docs/marketing/Content/History series/Ep 1.2/approved" --approved --locale fr
npm run science:episode12:sync -- "../mindrink-atrium/docs/marketing/Content/History series/Ep 1.2/approved" --approved --check
npm run sitemap:update
npm run build
npm test
```

- The route is `science/mesopotamia-beer-written-records.html` under each language prefix. The importer always validates all eight sources and all seven approved originals before writing. `--locale fr` writes only the French article (and French hub/Episode 1.1 only if their substance changed). A full sync still writes all eight editions. Missing sitemap entries are added; `sitemap:update` refreshes `lastmod` after a significant page change. It does not publish or commit.
- `--approved` requires exactly one canonical or dated `pipeline-output` file per locale in the selected directory; missing or ambiguous candidates stop the import rather than selecting a draft. Its original image assets are validated in the parent episode's `_assets/selected/` and against the website copies. Legacy canonical filenames and assets directly inside the source directory remain supported without the flag. Editorial `<!-- section:... -->` markers must identify the three body sections in order and are omitted from the rendered text.
- Source markers control all five image positions. All eight editions are continuous essays: a one-paragraph `###` standfirst, opening image, continuum paragraphs before the first section, three body sections without `###` subsections or the source-comparison table, and the shared figure set (`straw-drinking-seal`, `hammurabi-stele` rather than the earlier Puabi/Rama pair). Unsupported structural changes must fail for review, not silently omit content.
- Keep captions, credits and mobile image-height limits readable; never crop artifacts to fit.
- Approved original images and responsive derivatives live in `assets/science/history/episode-1-2/`. Its [provenance record](../assets/science/history/episode-1-2/README.md) documents rights, hashes and regeneration. Normal content sync needs no image-processing dependency.
- Run both episode importers with `--check` after changing series navigation. Episode 1.1 now uses the approved next page title/number rather than its outdated planned teaser.
- `--check` is read-only; repeat imports preserve publication/modification dates when content is unchanged. Source dates are not verified deployment dates. Record actual release evidence separately in the action log.

## Pre-release QA regressions

- `npm test` covers localized header-logo destinations, FAQ schema/visible-answer parity, corrected article modification metadata, calculator editor-state preservation and image-ratio markup. Keep original publication dates; maintain applicable Article/BlogPosting `dateModified` and `article:modified_time` separately from sitemap lastmod.
- Both history importers must retain each image's `--history-image-ratio` derived from its width/height. The responsive CSS uses a definite, proportionally capped width to reserve space before lazy decoding. Do not revert to auto width on phones: cold citation jumps can miss their targets even when warm screenshots look correct.
- Run `npm run test:browser` before releasing changes to calculator input, article figures/citations or localized navigation. This optional authoring check needs an installed Playwright module/browser; it is separate from the production build. Set `MINDRINK_PLAYWRIGHT_MODULE` to an existing module path if it is not locally resolvable; optionally set `MINDRINK_BROWSER_CHANNEL` (Windows defaults to Edge). Do not commit machine-specific runtime paths or automatically install a browser in production.
- The browser check blocks external traffic and tests actual character-by-character decimal input, invalid quantities, cold/delayed image loads, stable sizing in both episodes at 320/390/768/1280 px, methodology phone overflow and same-language logo clicks across eight languages. A warm-image test or whole-value field fill alone is not sufficient.
