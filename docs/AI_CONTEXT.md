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

## Multilingual SEO and UX changes

- Record meaningful SEO/content/UX changes in [SEO_ACTION_LOG.md](SEO_ACTION_LOG.md), including affected URLs/locales, changed slots, implementation revision and the separate actual deployment evidence when known. Append dated analysis outcomes; never treat a commit or sitemap date as the production release date. Keep raw/private analytics in Atrium, linked rather than copied into Git.
- Use corresponding existing content slots across all eight languages. Local search terms and natural wording may differ; new explanations, section roles, features and CTA journeys must have equivalent coverage.
- Do not introduce new locale-only sections or restore intentionally removed content. A shared structural change needs explicit approval and localized coverage before release.
- `tests/seo-ux.test.js` and its locale fixture protect the current sections, heading hierarchy, language routing, calculator labels, CTA meaning and comparison disclosures. Existing differences in localized FAQs and comparison introductions are preserved by the baseline, not endorsed as a pattern for new divergence. Update that structural baseline only for an approved change.
- Keep the calculator CTA pointed at the same-language homepage. Store-click measurement belongs on existing homepage/comparison buttons. See [ANALYTICS.md](ANALYTICS.md) for event meaning and privacy constraints.

## History episode content sync

Episode 1.1's approved Markdown is in Atrium's `docs/marketing/Content/History series/Ep 1.1/` folder. From this website repository, import and verify all eight editions with:

```bash
npm run science:episode:sync -- "../mindrink-atrium/docs/marketing/Content/History series/Ep 1.1"
npm run science:episode:sync -- "../mindrink-atrium/docs/marketing/Content/History series/Ep 1.1" --check
npm run sitemap:update
npm run build
npm test
```

- Keep the first source paragraph as the article introduction in the hero; the remaining introductory paragraphs belong in the article body.
- Preserve the responsive flowcharts and credited images. The importer removes the translated thesis/antithesis/synthesis prefixes from visible chart labels.
- Keep the source's five main sections and six subsections in their current order: image placement relies on that structure. If the structure changes, update the importer before running it.
- When references or the opening change, reconcile the article checks with the approved source. Verify that every citation resolves and review the page on mobile and desktop.
- `--check` verifies article content without writing files. Re-importing unchanged content preserves its article modification date.

### Episode 1.2 — Mesopotamia

The approved eight-language source is Atrium's `docs/marketing/Content/History series/Ep 1.2/`. Import without editing that sibling repository:

```bash
npm run science:episode12:sync -- "../mindrink-atrium/docs/marketing/Content/History series/Ep 1.2"
npm run science:episode12:sync -- "../mindrink-atrium/docs/marketing/Content/History series/Ep 1.2" --check
npm run sitemap:update
npm run build
npm test
```

- The route is `science/mesopotamia-beer-written-records.html` under each language prefix. The importer updates the matching Science hub card/CollectionPage, Episode 1.1 next link, and missing sitemap entries. It does not publish or commit.
- Source markers control all five image positions and the source-comparison table. Preserve the opening image below the title and before the first paragraph, the five introduction paragraphs, four main headings (including references), all 11 references and the comparison's four source types. Unsupported structural changes must fail for review, not silently omit content.
- The comparison is a semantic table on desktop and stacks with localized labels on mobile. Keep captions, credits and mobile image-height limits readable; never crop artifacts to fit.
- Approved original images and responsive derivatives live in `assets/science/history/episode-1-2/`. Its [provenance record](../assets/science/history/episode-1-2/README.md) documents rights, hashes and regeneration. Normal content sync needs no image-processing dependency.
- Run both episode importers with `--check` after changing series navigation. Episode 1.1 now uses the approved next page title/number rather than its outdated planned teaser.
- `--check` is read-only; repeat imports preserve publication/modification dates when content is unchanged. Source dates are not verified deployment dates. Record actual release evidence separately in the action log.
