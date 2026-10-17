# Website SEO and usability action log

Started: 2026-09-12. Owner: website implementation; analysis remains in Atrium.

This is the durable, version-controlled index of changes that may affect search acquisition or the on-site journey. It is not a deployment log, a raw analytics export, or proof of SEO uplift. Historical entries are a selective backfill, not a complete website changelog.

## Recording rules

- Add an entry for each meaningful SEO/content/UX package, including shared changes that affect multiple languages. Use a stable action ID and link the exact implementation revision and affected paths.
- Separate proposal, implementation, production deployment, and observed Google crawl dates. Never substitute a commit date, sitemap `lastmod`, ticket closeout date, or latest crawl for a verified deployment date.
- Append release evidence and dated findings to the original action. Preserve earlier observations; mark a conclusion superseded with a link if later evidence changes it. Do not silently rewrite history.
- Record exact title/description changes; use a revision diff for larger copy changes. State which titles, structures and user journeys were intentionally preserved.
- Keep exports, credentials and private performance reports outside Git. Link local Atrium evidence instead of copying it into this file. Durable entries may contain sanitized qualitative findings.
- Group actions shipped together under the same production release. Multiple packages in one release are not separate controlled experiments, and changed sibling languages are not untreated controls.
- Documentation-only changes to this log do not refresh page `lastmod` and are not a public SEO release.

## Page-family notation

The eight language prefixes are: English `/`, German `/de/`, French `/fr/`, Spanish `/es/`, Portuguese `/pt/`, Indonesian `/id/`, Italian `/it/`, Japanese `/ja/`.

For each prefix, the calculator is `alcohol-unit-calculator/`, comparison is `blog/best-alcohol-tracking-apps.html`, privacy is `privacy.html`, and homepage is the prefix itself. This notation enumerates the affected URLs; it does not imply every page in the language changed.

## CONTENT-20261017-01 — Approved history-series foreword on all science hubs

- Owner requested replacing the history-series introduction on the science hub with the new approved foreword, on website `dev` only. Implemented locally on 2026-10-17 from baseline `a900ace8cf998abb7a2f73e1550ce9342ddba9d1`. Not committed, pushed or deployed. Atrium's `docs/marketing/Content/History series/foreword/Approved/` was read only; no new writing, translation or provider calls were performed.
- Affected pages: `https://mindrink.me/science/` and `https://mindrink.me/{de,es,fr,id,it,ja,pt}/science/`. Replaced only `.science-history-intro` with the approved localized label, series heading and two paragraphs, preserving the italic series title. English's label is now “An evidence-led history series”; its first paragraph opens “Alcohol is deeply embedded in human civilization.” The Portuguese heading follows the approved title capitalization, “As Origens do Álcool”. Exact source byte hashes:

| Language | Approved file | SHA-256 |
|---|---|---|
| English | `foreword.en.md` | `57207b132a808f6938d0f805892bab7408c8d5401f3c068fbb811415af5c74ff` |
| German | `foreword.de.pipeline-output-2026-10-17-v2.md` | `1f6d64ca4233752a1cbc640c55456bcdf8d739717f84363132eb3a886b268509` |
| Spanish | `foreword.es.pipeline-output-2026-10-17-v2.md` | `0503e2feea4450c65acede9989c92608cdccb44310814e0a712902346ca6f2c1` |
| French | `foreword.fr.pipeline-output-2026-10-17-v2.md` | `a59fd7e5f4c7d72ad3f4cb3367ee379f765a0afcf72fa870711b12795eddc226` |
| Indonesian | `foreword.id.pipeline-output-2026-10-17-v2.md` | `6b5d89df0a61c8e6bceff7b77b7bbcc3f5270dafc25417c71f7ad4c2ca4ebf12` |
| Italian | `foreword.it.pipeline-output-2026-10-17-v2.md` | `b87a9b59a6a302ba34f66ed876272dc35fe49c4b5aa23884b3502f534a9e748b` |
| Japanese | `foreword.ja.pipeline-output-2026-10-17-v2.md` | `3f88820b38608b45fac22881388ebd23df060bc6f9dcaaa2f418c35849de7284` |
| Portuguese | `foreword.pt.pipeline-output-2026-10-17-v2.md` | `411fa7a7e80b8e8c7fafb19511a8862a4d7c5934f369a0c1cb21077f65f7a003` |

- Independent reconstruction of normalized Markdown from each rendered block matches its entire approved source. Outside that block and the hub stylesheet cache version, every hub remains identical to the baseline: the science hero/H1, prominent methodology panel and CTA above the series, two episode cards below it, navigation, metadata, structured data, canonicals, hreflang and destinations are unchanged. All sixteen Episode 1.1/1.2 pages are unchanged and both approved-source checks pass. This is an introduction replacement, not a new page or episode revision.
- Added a scoped 16 px gap between the two foreword paragraphs and refreshed both hub stylesheet URLs to `foreword-20261017a`. No other styling changed. The sitemap updater changed only the eight hubs' lastmod to **2026-10-17**; the other 200 dates and all sitemap URL/alternate structures remain unchanged. These source dates do not establish deployment.
- Added eight exact approved-content regression checks and 32 browser checks covering hub reflow, methodology/series separation, paragraph spacing and same-language methodology/episode journeys at 320/390/768/1280 px. Updated the website agent instructions with the approved-source location and preservation rules; no additional importer or editorial content copy was introduced.
- Validation: **257 automated tests**, analytics-disabled build and **148 browser checks** pass with no failures, page errors or missing local resources. Static SEO checks pass for 208 pages, 4,968 internal links and 859 fragment links. Sitemap dates and whitespace checks pass. English/Japanese mobile and desktop screenshots were visually inspected. The new checks confirm two separated foreword paragraphs, methodology above the series, episode cards below, no horizontal overflow and the localized methodology → hub → Episode 1.1 → Episode 1.2 → hub journeys. External browser traffic was blocked and no production analytics events were sent.
- Implementation commit, push, production deployment/time and subsequent crawl or performance evidence remain pending separate authorization. No deployed change or SEO gain is claimed.
- Release authorization (2026-10-17): owner requested deployment to main after a fresh pre-deployment round passed all 257 automated tests, the build and 148 browser checks. The implementation is identified by the commit carrying `SEO-Action: CONTENT-20261017-01`; hosted CI and actual production-release evidence will be appended after verification. Article pages, methodology and episode cards remain unchanged.

### 2026-10-17 verified production release — Science-hub forewords

- Implementation revision: [`ad4fdf51e110a5c33c3ce9e5beed813ad107c8d7`](https://github.com/philip93758/websitemindrink/commit/ad4fdf51e110a5c33c3ce9e5beed813ad107c8d7); [release diff](https://github.com/philip93758/websitemindrink/compare/a900ace8cf998abb7a2f73e1550ce9342ddba9d1...ad4fdf51e110a5c33c3ce9e5beed813ad107c8d7). Committed and pushed to `dev`; [hosted dev CI run 39066785173](https://github.com/philip93758/websitemindrink/actions/runs/39066785173) passed before main was fast-forwarded and pushed to that exact revision. This release follow-up supersedes the earlier uncommitted/unpublished status.
- Verification before release: 257 automated tests, build and all sitemap dates passed again after committing. The fresh pre-deployment browser round passed all 148 checks without failures, page errors or missing local resources. All eight forewords matched the approved files, both episode source checks passed, and the sixteen article pages remained unchanged.
- Actual production release: [main run 39066848325](https://github.com/philip93758/websitemindrink/actions/runs/39066848325), successful build and deployment for `ad4fdf51e110a5c33c3ce9e5beed813ad107c8d7`. The [GitHub Pages deployment job](https://github.com/philip93758/websitemindrink/actions/runs/39066848325/job/117496264633) completed on **2026-10-17 at 20:28:58 UTC** (22:28:58 Europe/Berlin). This is verified publication evidence, separate from source modification dates.
- Live verification on ordinary public URLs: all eight science hubs, all sixteen unchanged article pages, sitemap.xml, robots.txt and both unversioned/versioned stylesheet URLs returned HTTP 200 without redirects or noindex headers and matched the released source after newline normalization. All seven resources directly referenced by the hubs were available. The new forewords and paragraph spacing are present; methodology, episode destinations, metadata and hreflang remain as validated. Production analytics configuration is present with the expected EU host. Raw HTTP checks did not execute tracking or send production analytics events.
- The release-evidence follow-up changes documentation only, not public pages, styles or sitemap dates. Treat the eight-language foreword update as one release package; Google crawl/indexing, snippets and traffic effects remain unverified.

## CONTENT-20261016-01 — Episode 1.2 approved eight-language source import

- Owner requested implementing the ready Episode 1.2 files from Atrium's `docs/marketing/Content/History series/Ep 1.2/approved/` in website `dev`. Implemented locally on 2026-10-16 from baseline `e60296c822cfc02bb48842c90b2c8bf59ef989a2`, preserving its already committed Episode 1.1 v3 work. This package is not committed, pushed or deployed. Atrium sources were read only; no new translation, editorial rewriting or model calls were performed.
- All eight approved sources were imported/verified. English already matched the approved source and remains byte-identical. Changed pages are `/{de,es,fr,id,it,ja,pt}/science/mesopotamia-beer-written-records.html` on `https://mindrink.me`. The shared filename stem is `Mesopotamia - What the First Written Records Tell Us About Beer`; English is the canonical `.md`, six localized files use `.<locale>.pipeline-output-2026-10-15-v2.md`, and Japanese uses `.ja.pipeline-output-2026-10-15-v3.md`.

| Language | Exact approved source SHA-256 |
|---|---|
| English | `0cd5885259871c571a29e300e7f6d6a03d2fec5fbeed39caea0dbdfc003f9fc8` |
| German | `7bb16101dc5e38a0fcbb963f8bfa4ee122b78c2df6b4db2bb54826820b363639` |
| Spanish | `3de70df3116fcb9457d0e639869088da15ecd06800957f85cb209f3c9a76f972` |
| French | `4833e12973d1dbe540fd1c9f3f3b49602880910c140322d0ba4848715a357252` |
| Indonesian | `520b22ddeeeb93055f88ba76c49de545f6041837e758f4fa84011668251931ba` |
| Italian | `8190fdbbdc84e8fa4cc9c1a18edeae8a521115edbe982c28fc12abb9eb02aa55` |
| Japanese | `ae608ed3bec668e120531f2463df60061931a1c6ea39166afcaada562b44da5e` |
| Portuguese | `7ec3a7bd4fcc20dda1b944436da537394f5f6b4cd9f4f33ae2d5ca39795964c0` |

- Extended the existing Episode 1.2 importer with explicit `--approved` selection. It requires exactly one canonical or dated `pipeline-output` file per locale, refuses missing/ambiguous candidates and unknown CLI options, and validates all eight sources before any page write. The three editorial section markers must appear after their matching body headings in order and never render as text. Original image hashes are still validated both in the parent episode's `_assets/selected/` and in the website, with responsive variants checked before writing. Updated the website agent instructions and added focused regression tests for selection, ambiguity and markers.
- Independent raw-source comparisons verified every prose paragraph including the standfirst (31 per edition, except Indonesian and Japanese with 32), all eleven complete references, five images with their exact approved alt text/captions/credits, and every external source URL. Source titles, publication dates, descriptions, canonicals and reciprocal eight-language/x-default hreflang are preserved. All eight Episode 1.1 pages and science hubs remain byte-identical to the baseline; article image assets and shared styles are unchanged.
- Only the seven changed articles' Article/social modification dates and sitemap lastmod changed to **2026-10-16**. The remaining 201 sitemap dates are unchanged. These are source modification dates, not publication or deployment evidence. Both approved-source checks pass and a repeat import is a no-op.
- Validation: **249 automated tests**, the analytics-disabled build and **116 browser checks** pass with no page errors or missing local resources. The static SEO gate passes for 208 pages, 4,968 internal links and 859 fragment links. All sitemap dates are current; whitespace checks pass. Browser coverage includes cold citation jumps, delayed image loading, reserved image sizing, navigation and overflow at 320/390/768/1280 px. The first browser launch was blocked by the Windows sandbox; the same local QA passed outside it, with all external browser traffic blocked. No production analytics events were sent.
- Actual implementation revision, production deployment/time, subsequent crawl and performance outcomes remain pending separately requested commit/release steps. No deployed change or SEO gain is claimed.
- Release authorization (2026-10-16): owner requested deployment to main after the fresh pre-deployment checks passed (249 automated tests, build and 116 browser checks). The release also includes the previously committed CONTENT-20261014-01 package. The Episode 1.2 implementation is identified by the commit carrying `SEO-Action: CONTENT-20261016-01`; hosted CI and actual production evidence will be appended after verification. The pre-existing literal asterisks in the reference 11 link label are a known cosmetic issue, not changed by this release.

### 2026-10-16 verified production release — Episodes 1.1 and 1.2

- Released together: CONTENT-20261014-01, implemented in [`e60296c822cfc02bb48842c90b2c8bf59ef989a2`](https://github.com/philip93758/websitemindrink/commit/e60296c822cfc02bb48842c90b2c8bf59ef989a2), and CONTENT-20261016-01, implemented in [`ff656dc97dd256e337026ecf0031308d2a428ca6`](https://github.com/philip93758/websitemindrink/commit/ff656dc97dd256e337026ecf0031308d2a428ca6). The [combined release diff](https://github.com/philip93758/websitemindrink/compare/0361656b5232752694ebe4c0aaee6ceb0cd9ec6b...ff656dc97dd256e337026ecf0031308d2a428ca6) changes six Episode 1.1 editions and seven Episode 1.2 editions. Treat these as one publication package, not separate experiments. This follow-up supersedes the earlier uncommitted/unpublished statuses.
- Pushed the exact implementation revision to `dev`; [hosted dev CI run 38856803001](https://github.com/philip93758/websitemindrink/actions/runs/38856803001) passed before main was fast-forwarded and pushed. Post-commit local checks also passed: 249 automated tests, build and all sitemap dates; the fresh pre-deployment browser suite had passed all 116 checks with no page errors or missing resources. Both episode approved-source checks pass.
- Verified production release: [main run 38856875215](https://github.com/philip93758/websitemindrink/actions/runs/38856875215), successful build and deployment for `ff656dc97dd256e337026ecf0031308d2a428ca6`. The [GitHub Pages deployment job](https://github.com/philip93758/websitemindrink/actions/runs/38856875215/job/116830301487) completed on **2026-10-16 at 05:39:37 UTC** (07:39:37 Europe/Berlin). This is actual publication evidence, separate from the 14/16 October source modification dates and the original publication dates.
- Live verification on ordinary public URLs: all sixteen Episode 1.1/1.2 pages, sitemap.xml and robots.txt returned HTTP 200 without redirects or noindex headers and matched the released source after newline normalization. English/French Episode 1.1 and English Episode 1.2 remain unchanged. The live sitemap retains exactly the thirteen intended modification-date changes versus the previous release; canonicals, hreflang, article metadata and references match the validated files. Responsive Episode 1.2 image variants, the referenced stylesheet and analytics modules returned HTTP 200. Production analytics configuration is present with the expected EU host; raw HTTP checks did not execute tracking or send production analytics events.
- This release-evidence follow-up changes documentation only, not public pages or sitemap dates. Subsequent Google crawl, indexing, snippets and traffic effects remain unverified. The reference 11 cosmetic issue noted above remains intentionally unchanged.

## CONTENT-20261014-01 — Episode 1.1 approved v3 text refresh

- Owner requested importing the newly revised editions from Atrium's `docs/marketing/Content/History series/Ep 1.1/approved/` into website `dev`, keeping English and French unchanged. Implemented locally on 2026-10-14 from baseline `0361656b5232752694ebe4c0aaee6ceb0cd9ec6b`. Not committed, pushed or deployed. Atrium sources were read only; no additional writing, translation or provider review was performed.
- Affected pages: `/{de,es,it,pt,id,ja}/science/who-invented-alcohol.html` on `https://mindrink.me`. Each imported source is named `Who Invented Alcohol.<locale>.pipeline-polished-2026-10-13-v3.md`. These replace the prior editions implemented and deployed under CONTENT-20261013-01; that earlier release evidence remains historical.

| Language | Approved v3 SHA-256 |
|---|---|
| German | `21cc2475dcc191b0661085a4e5dfc007aaba5da4463ff0e3083089453d51d011` |
| Spanish | `cd6e6eac3742d13f74c18cdf48bb7f1055d0f2dda0349d48ca98b2db26a1eb5e` |
| Italian | `57dcbe133454c236a05568449dbc38eca7d02be0dd9bfdad068de4508af46a85` |
| Portuguese | `b2eaa1e199cc8fc47fd5f9f5cc3b7d5dca76d3d8db424a02234ebf6f19a50690` |
| Indonesian | `b70e13c9128f73523bd038c41bb3d118318ede4fc99ddb94c8ea559b2ec26adb` |
| Japanese | `983b2d71da544ae6fa4737c62009433e0bbd80e348df51a622c7bf5ac46157e2` |

- Used the existing scoped importer with `--approved --locales de,es,it,pt,id,ja`; no importer, fixture, test or style changes were needed. Independent comparisons confirmed all approved prose paragraphs and all fifteen complete bibliography entries per locale reached the HTML. Paragraph counts including the deck remain DE 29, ES 32, IT 34, PT 33, ID 31, JA 33. Four-figure markup, captions and credits remain unchanged in every edition, as do canonicals, reciprocal hreflang, publication dates, section roles and Episode 1.2 destinations. Neither hub nor Episode 1.2 changed.
- English and French approved source hashes remain `1396b4118dd5e76db3396d5d6dacb54ebcbbc3d81b05f1bfe1f6df4e91b71f3f` and `8c42b18a07f88adc8dfc2ff90cebeea34df561fab4e422dbed32a7d6bba4e29e`. Both complete website files remain byte-identical to the frozen copies (English `5fe2971a15cd15056ec30fa81c1f2096c66c7bbcd69b9cb6e022f4786614050f`, French `a9d458258a492979cdeeef68847a9619b3d8b300815d8a24fa38328982d9ead5`).
- Only the six revised articles' Article/social modification metadata and sitemap lastmod changed to **2026-10-14**. The other 202 sitemap dates stayed unchanged. These are source modification dates, not verified publication dates.
- Validation: all eight approved-source comparisons, **246 automated tests**, analytics-disabled build and **116 browser checks** passed, with no browser page errors or missing local resources. Static SEO checks passed for 208 pages, 4,968 internal links and 859 fragment links; all sitemap dates were current. Browser checks cover citation targets, cold image loading and sizing, navigation and mobile/desktop overflow. External browser traffic was blocked, with no production analytics events sent. Whitespace checks passed.
- Actual deployment revision/time and subsequent Google crawl, snippets or traffic impact remain pending a separately requested release. No deployed change or performance gain is claimed.
- Local commit follow-up (2026-10-14): owner authorized committing this validated package to `dev`. Implementation revision is the commit carrying `SEO-Action: CONTENT-20261014-01`. This supersedes the earlier uncommitted status; push and production deployment have not been requested or performed.
- Release follow-up (2026-10-16): committed revision `e60296c822cfc02bb48842c90b2c8bf59ef989a2` was pushed and deployed together with the Episode 1.2 refresh. See CONTENT-20261016-01's verified production-release section and [main run 38856875215](https://github.com/philip93758/websitemindrink/actions/runs/38856875215) for CI, actual publication time and live-match evidence. This supersedes the earlier pending-push/deployment status; English and French remain unchanged.

## CONTENT-20261013-01 — Approved Episode 1.1 revisions in six languages

- Owner authorized importing revised Episode 1.1 text from Atrium's `docs/marketing/Content/History series/Ep 1.1/approved/` into website `dev`, preserving English and French. Implemented locally from website baseline `52e340a5ef8433ec792163efc3cb732959339abd`. Not committed, pushed or deployed; source dates are not production dates. Atrium files were read only.
- Affected pages: `/{de,es,it,pt,id,ja}/science/who-invented-alcohol.html` on `https://mindrink.me`. Imported the approved title/subtitle, deck, continuous essay and references without further rewriting. The source's next-episode wording remains linked to Episode 1.2's existing localized title and route rather than the outdated planned teaser. No hub, Episode 1.2, calculator, navigation destination or shared style changed.
- Exact source editions and byte hashes:

| Language | File in the approved folder | SHA-256 |
|---|---|---|
| German | `Who Invented Alcohol.de.pipeline-polished-2026-10-12.md` | `308dec55612b7eb700728b40352f4ebd436899c848111b23f61f58b95b079358` |
| Spanish | `Who Invented Alcohol.es.pipeline-polished-2026-10-11.md` | `99ab9cd57118881eaee250e8993d5a0dab0f1bed40ea243c50f6cd0e6744a65a` |
| Italian | `Who Invented Alcohol.it.pipeline-polished-2026-10-12-v2.md` | `56e0a39cb5c12fd398422ce00cfdf87804013a0c366d0caddf3eefaed32e5ce8` |
| Portuguese | `Who Invented Alcohol.pt.pipeline-polished-2026-10-12-v2.md` | `4d1e2f185712784c79f6d00b7d20b8bbe0405522bf45a77d43d0918138198c58` |
| Indonesian | `Who Invented Alcohol.id.pipeline-polished-2026-10-12-v2.md` | `c680563149231d5ff3cec8084230e818ba39ad3d604cb40a4324e46c345c70e6` |
| Japanese | `Who Invented Alcohol.ja.pipeline-polished-2026-10-13-v2.md` | `b6f7e6e6f8322dee9066bc34aa017d13fd84cedfede783936fd2078d306934ef` |

- Importer maintenance: explicit `--approved` source selection requires exactly one canonical or dated polished file per locale and refuses ambiguous candidates. `--locales de,es,it,pt,id,ja` limits writes while all eight sources are parsed before any write. Approved editorial section markers are validated and omitted from rendered text. Existing credited figures are reused. The Italian inline-bold next-episode sentence is recognized as navigation, not duplicated body prose. Original publication dates remain intact; only the six changed articles' Article/social modification metadata and sitemap lastmod changed to **2026-10-13**. Canonicals and the complete reciprocal eight-language/x-default hreflang set remain intact.
- Frozen-edition verification: the approved English/French source checks passed, and both complete website files stayed byte-identical before/after (SHA-256 English `5fe2971a15cd15056ec30fa81c1f2096c66c7bbcd69b9cb6e022f4786614050f`, French `a9d458258a492979cdeeef68847a9619b3d8b300815d8a24fa38328982d9ead5`). No source content was copied back into Atrium or into those two pages.
- Validation: all eight approved-source comparisons passed; **246 automated tests**, build and **116 browser checks** passed, with no browser page errors or missing resources. Static SEO checks passed for 208 pages, 4,968 internal links and 859 fragments; all 208 sitemap dates were current. Independent raw-source-to-HTML comparisons verified every prose paragraph including the deck (DE 29, ES 32, IT 34, PT 33, ID 31, JA 33), all fifteen complete bibliography entries per edition, and unchanged four-figure markup/captions/credits. Regression assertions now protect the approved scientific distinctions and the five-paragraph Spanish/Italian conclusions rather than requiring superseded September phrases. Browser checks cover cold citation jumps, reserved image space and page reflow at 320/390/768/1280 px. External browser requests were blocked; no production analytics events were sent.
- Scope/limits: this is faithful implementation of the human-selected editions, not a new translation or scientific review. The authoring closeout's optional Indonesian note was retained in the approved bytes. Actual publication revision/time, Google crawl, snippets and traffic outcomes remain pending a separate release.

### 2026-10-13 verified production release

- Owner subsequently authorized deployment to main. Implementation revision: [`7201599e4ee4ee4d3396da1f1b5171f1520704c6`](https://github.com/philip93758/websitemindrink/commit/7201599e4ee4ee4d3396da1f1b5171f1520704c6), committed and pushed to `dev`; [hosted dev CI run 38348440338](https://github.com/philip93758/websitemindrink/actions/runs/38348440338) passed. Main was fast-forwarded to the same revision. This follow-up supersedes the historical uncommitted/unpublished status above.
- Fresh pre-deployment checks passed: all eight approved-source comparisons, 246 automated tests, build, sitemap validation and all 116 browser checks, with no page errors or missing resources. Openings and conclusions were inspected in all six revised languages at 390/1280 px, with no page overflow. Native conclusion anchors settled below the fixed header after image loading. English/French file hashes remain unchanged.
- Verified production release: [main run 38348536829](https://github.com/philip93758/websitemindrink/actions/runs/38348536829), successful build and deployment. The [GitHub Pages deployment job](https://github.com/philip93758/websitemindrink/actions/runs/38348536829/job/115135510520) completed on **2026-10-13 at 04:52:40 UTC** (06:52:40 Europe/Berlin). This is the publication evidence; do not substitute an earlier source or commit date.
- Live verification: all eight Episode 1.1 pages, sitemap.xml and robots.txt returned HTTP 200 on ordinary public URLs and matched the released source after newline normalization. German, Spanish, Italian, Portuguese, Indonesian and Japanese contain the selected revisions; English and French remain unchanged. The deployed analytics configuration is present and configured for the EU host. No production analytics events or credentials were emitted by these checks.
- The release-record follow-up changes documentation only, not public article content or sitemap dates. Google crawl, snippet adoption and traffic impact remain unverified; treat the six language revisions as one release package.

## RELEASE-20261012-02 — Calculator clarity, reading links and Italian/Japanese localization

- Owner authorized pre-deployment checks and deployment to main on 2026-10-12. Released the four commits `1195876`, `b6f1f05`, `2a78483` and [`738664fb3646a4470df4aaa1e116c1198de19bde`](https://github.com/philip93758/websitemindrink/commit/738664fb3646a4470df4aaa1e116c1198de19bde); [combined implementation diff](https://github.com/philip93758/websitemindrink/compare/2601d9d...738664f). Actions UX-20261012-01, SEO-20261012-02, SEO-20261012-03 with its dual-unit follow-up, and SEO-20261012-04 shipped together. Evaluate them as one release package.
- Pre-release verification: the automated test suite and build passed, as did all **116 browser checks**, with no page errors or missing local resources. Coverage includes eight-language decimal input, validation, unrounded totals, removal, localized navigation and mobile layouts, plus Italian 10 g/12 g results and Japanese examples. The static SEO check passed for **208 pages, 4,920 internal links and 811 fragment links**, including metadata, canonicals, reciprocal hreflang and sitemap coverage. Sitemap modification dates were current for all 208 URLs; the fourteen affected pages retain their 2026-10-12 source dates. Saved Italian/Japanese phone previews were inspected. No further implementation changes were required by this pre-deployment round.
- Hosted dev CI: [run 38306619742](https://github.com/philip93758/websitemindrink/actions/runs/38306619742), successful for `738664f`. Main was then fast-forwarded to that same revision.
- Verified production release: [run 38306746872](https://github.com/philip93758/websitemindrink/actions/runs/38306746872), build and deployment successful. The [GitHub Pages deployment job](https://github.com/philip93758/websitemindrink/actions/runs/38306746872/job/115002691225) completed on **2026-10-12 at 20:50:36 UTC** (22:50:36 Europe/Berlin).
- Live verification: all fourteen changed HTML pages, the shared calculator script, constants, formulas and sitemap returned HTTP 200 on their normal public URLs and matched the released source after newline normalization: **18 public files verified**. The deployed analytics configuration was present and configured for the EU host. The checks did not send production analytics events or expose credentials.
- The earlier pending/unrequested deployment statements in the four historical action entries describe their pre-release state; this record supersedes those statuses. Italian results now retain Mindrink's 10 g measure alongside Italian 12 g UA, and Japan retains 10 g drinks with localized pure-alcohol terminology. App threshold quantities and the other language conventions remain unchanged. Subsequent Google crawl, snippet adoption and traffic impact remain unverified.
- This release-evidence follow-up is documentation only; it does not change public content or sitemap modification dates.

## SEO-20261012-04 — Japanese pure-alcohol and 10 g drink localization

- Owner request and implementation date: 2026-10-12. Started on local website branch `dev`, based on `11958768a35ef9036908ae7ac2781ab5ed1d9b1b` (“Clarify calculator calories and link localized reading paths”). Japanese implementation commit: pending; this chat did not commit, push, merge or deploy. During final validation the separate, owner-authorized Italian action was committed as `b6f1f05`; the Japanese work remains uncommitted for review against that HEAD. The Italian 12 g changes (SEO-20261012-03), calorie wording and both localized calculator article links were preserved.
- Affected public pages: `https://mindrink.me/ja/alcohol-unit-calculator/`, `https://mindrink.me/ja/methodology.html`, `https://mindrink.me/ja/blog/what-counts-as-a-drink-alcohol-units.html`, and `https://mindrink.me/ja/alcohol-units.html`. Related files: Japanese copy in the shared calculator script, Japanese copy fixtures, `tests/japanese-units.test.js`, shared browser QA, this log and `docs/AI_CONTEXT.md`. Reused the pending Italian reference configuration/formulas; no separate Japanese calculator or change to shared constants/formula behavior.
- Primary sources checked on 2026-10-12: [MHLW/e-Health Net — 飲酒量の単位](https://kennet.mhlw.go.jp/information/information/alcohol/a-02-001.html) explicitly shows final update **2022-12-23**, distinguishes the traditional approximately 20 g 単位 from the 10 g ドリンク, and illustrates the 0.8 approximation. [MHLW — 健康に配慮した飲酒に関するガイドライン](https://www.mhlw.go.jp/stf/newpage_38541.html) and its linked [final guideline PDF](https://www.mhlw.go.jp/content/12200000/001223643.pdf) emphasize pure alcohol grams and use 0.8; the [official publication announcement](https://www.mhlw.go.jp/stf/newpage_37908.html) is dated **2024-02-19**. Used the final published guideline, not consultation drafts or the older “moderate drinking” recommendation as a safe allowance. [Tokyo — 飲酒](https://kenko-station.metro.tokyo.lg.jp/category3/kenkozukuri/inshu/) uses 純アルコール量, quantity/volume/strength inputs and 0.8, including 日本酒1合 = 180 ml and canned chūhai. No explicit publication/update date was visible on the Tokyo page; the access date is not its update date.
- Research decision: lead with 純アルコール量（g） and use ドリンク（10 g） for the unchanged Japanese reference result. Explain the traditional approximately 20 g 単位 separately; 合 is a volume of 180 ml, whose alcohol grams depend on strength. Neither reference is a recommended or safe allowance, and Japan is not described as having one universally used “20 g standard drink.” Official terminology informed the copy; no keyword-volume or SEO-uplift claim is made. All three requested sources are linked next to relevant explanations and in the existing methodology reference area.

Important exact copy changes:

| Slot | Before | After |
|---|---|---|
| Calculator title/H1/OG title | アルコール単位計算機 | 純アルコール量計算機 (HTML title retains `\| Mindrink`) |
| Selected results, totals, added-row reference labels and examples heading | 10g単位 / 標準単位 | ドリンク（10 g） |
| Grams result label | アルコール量 | 純アルコール量（g） |
| Quantity / selected-result heading | 杯数 / この飲み物 | 数量（杯・本など） / 入力した数量の結果 |
| Guide and methodology highlighted definition | 1単位 = 純アルコール10グラム | 1ドリンク = 純アルコール10 g |
| Both formula explanations | 10g単位 = (容量（ml） × (アルコール度数（%） ÷ 100) × 0.789) ÷ 10 | ドリンク（10 g） = (容量（ml） × (アルコール度数（%） ÷ 100) × 0.789) ÷ 10 |
| Guide H1/BlogPosting headline | 1杯はどのくらい？アルコール単位と基準量を理解する | 1杯はどのくらい？純アルコール量とドリンクを理解する |
| Guide title/OG/Twitter title | 1杯はどのくらい？アルコール単位ガイド \| Mindrink ブログ | 1杯はどのくらい？純アルコール量とドリンク \| Mindrink ブログ |
| Short explainer title/H1/OG title | 一般的な飲み物には何単位のアルコールがありますか？ | ビール・日本酒・缶チューハイの純アルコール量は？ (HTML title retains `\| Mindrink`) |
| Methodology title/OG/Twitter title | Mindrinkの算出方法 – アルコール単位の計算方法 | Mindrinkの算出方法 – 純アルコール量と10 gドリンク |

Exact description changes; existing meta, OG, Twitter and Article/BlogPosting descriptions were synchronized where present:

| Page | Before | After |
|---|---|---|
| Calculator | お酒の量とアルコール度数から純アルコール量（g）を計算。10g単位、英国のアルコール単位、米国の標準ドリンクにも換算できます。 | お酒の容量・アルコール度数・数量から純アルコール量（g）を計算。ドリンク（10 g）、英国単位、米国標準ドリンクへの換算と、ビール・日本酒・缶チューハイの例を確認できます。 |
| Methodology | Mindrinkがアルコール単位をどのように計算し、飲酒パターンをどう解釈し、国ごとのガイドラインや上限値をどう扱うかを説明します。根拠を公開し、日々の記録を安心して読み解ける透明性のある算出方法と判断基準を紹介します。 | Mindrinkの純アルコール量（g）と10 gドリンクの計算方法、アプリの上限値とその根拠を説明します。日本で従来使われてきた単位（約20 g）との違い、公式資料の係数0.8とMindrinkの0.789による計算の違いも確認できます。 |
| Guide | 1杯はどのくらいなのかを、アルコール単位と標準ドリンクの考え方から解説します。ビール、ワイン、スピリッツの具体例を通じて、飲んだ量を比べやすくし、日々の記録や振り返り、週ごとの確認に活かすためのガイドです。換算の目安も学べます。 | 「1杯」の飲酒量を純アルコール量（g）で比較。ドリンク（10 g）、従来の単位（約20 g）、容量を表す合の違いを、ビール・日本酒・焼酎・缶チューハイの例で解説します。 |
| Short explainer | ビール、ワイン、蒸留酒を10g単位で比較し、英国単位や米国標準ドリンクとの違いも確認できます。 | ビール・日本酒・焼酎・缶チューハイの純アルコール量（g）とドリンク（10 g）を比較。従来の単位（約20 g）や英国・米国の基準との違いも解説します。 |

- Calculation behavior: retained density **0.789 g/ml**, Japanese **10 g** drinks, UK units from 10 ml pure alcohol, US standard drinks from 14 g, and alcohol-only calories. Quantity is included before conversion; totals sum unrounded inputs before display rounding. Two 500 ml/5% beers total 39.45 g → 39.5 g displayed and 3.9 drinks, not 4.0 from adding rounded rows. Official 0.8 examples are identified as approximations: beer500 ml/5% → 20 g, while the site's formula gives 19.725 g → 19.7 g displayed. The calculator is not forced to return the official rounded illustration.

Worked examples in existing slots:

| Input (one serving) | Unrounded grams using 0.789 | Displayed grams | Drinks of 10 g |
|---|---|---|---|
| Beer 500 ml, 5% | 19.725 | 19.7 | 2.0 |
| Sake 1合 = 180 ml, 15% | 21.303 | 21.3 | 2.1 |
| Shōchū 100 ml, 25%, before dilution | 19.725 | 19.7 | 2.0 |
| Canned chūhai 350 ml, 7% | 19.3305 | 19.3 | 1.9 |
| Canned chūhai 500 ml, 9% | 35.505 | 35.5 | 3.6 |

- Methodology protection: renamed its Japanese 10 g reference to ドリンク consistently while retaining the actual app thresholds and gram quantities. The complete principal threshold table is byte-identical after line-ending normalization (SHA-256 `74332e90d1bd637dccf9dee414f2c33c42b4c455e30df5f1d798cdfda5380548`); the explanatory note explicitly says 20 drinks = 200 g and that these are not replacement Japanese national limits. Corrected the existing Canadian example's one-decimal conversion from 80.7 g → 8.0 to approximately 8.1 drinks; the gram input and app thresholds are unchanged. Removed universal/“WHO-style” claims about the 10 g convention. Existing WHO 2018/2024 reference distinction remains intact.
- Common UX: retained all four pages' section roles, heading hierarchy, table-row/example counts, navigation, canonicals/hreflang, calculator controls/presets, both contextual article links and the bottom same-language app invitation. Japanese source prose/examples fit existing slots; no promotional section, appendix, country detection, geolocation, selector, serving shortcut or restored removed content. Corrected サイダー to シードル in the existing cider option. The Japanese calculator comparison table has a local 600 px minimum width within its existing horizontal scroll wrapper to prevent long Japanese headings collapsing into single-character columns; shared styles and other languages are unchanged.
- Content dates: Japanese methodology and guide `dateModified` are 2026-10-12; the guide's matching social modification timestamp uses `+02:00`. Original publication dates are preserved. Sitemap update/check was run; only the three changed Japanese article/explainer dates needed updating because calculator dependency dates were already 2026-10-12. Concurrent Italian dates remain intact.
- Final validation on 2026-10-12: **240 automated tests passed**, including Japanese raw/rounded examples, quantity/unrounded totals, calculator/short tables, metadata alignment, five visible/structured FAQ answers, unchanged Japanese structure/thresholds and Italian 12 g behavior. Analytics-disabled build passed with 208 pages/URLs, 4,920 internal links and 811 fragments; sitemap and diff-whitespace checks passed. All **116 browser checks passed**, with no page errors or missing files: required eight-language decimal typing/presets/limits, totals/removal, history figures/citations, methodology overflow and localized logo regressions; Italian 12 g cases; and Japanese examples, quantity validation, added-row labels, unrounded totals, both article links, bottom CTA, official sources and all four pages' reflow at 320/390/1280 px. The local table minimum width was checked for phone scrolling and desktop fit after screenshot review exposed cramped headings. Japanese phone/desktop screenshots were inspected for the calculator results/summary/table and all four pages' explanatory copy; methodology formula and references were inspected in readable crops. External browser requests were blocked, with no production analytics events sent. Local screenshots and test/browser results are in gitignored `docs/Ai/active/japanese-localization-2026-10-12/qa/`.
- Production deployment revision/time: pending a separately requested release. Google crawl date/snippet adoption: unknown, with no GSC extraction. Remaining limitations: no independent Japanese native-speaker review; Tokyo's update date is not exposed; input strength/volume still comes from labels/user entries. No traffic improvement or deployed change is claimed.

### 2026-10-12 local commit approval

- Owner approved committing this Japanese package to `dev`. Implementation revision: the commit carrying `SEO-Action: SEO-20261012-04`. The final parent is `2a78483310c7a3399f767ae7ec80e3ad8884938f`, preserving the separate Italian follow-up that keeps Mindrink's 10 g result alongside Italian 12 g UA. This supersedes the earlier uncommitted handoff status for Japan; push, merge and deployment remain unrequested.
- Rechecked the final combined working tree: 242 automated tests, analytics-disabled build, sitemap update/check and static SEO checks passed (208 pages/URLs, 4,920 internal links, 811 fragments). All 116 browser checks passed again, with no page errors or missing local files; external traffic was blocked. Production release time and Google crawl dates remain separate and unverified.

## SEO-20261012-03 — Italian 12 g alcohol-unit localization

### 2026-10-12 owner correction — retain the Mindrink result alongside Italian UA

- Owner clarified that the calculator must keep the app's 10 g result visible. The Italian-only result layout described in the original entry below is superseded by this correction. Local implementation is based on committed revision `b6f1f05`; owner authorized a local commit on 2026-10-12. Implementation revision: the commit carrying `SEO-Action: SEO-20261012-03-followup`. No push or deployment performed.
- The Italian calculator now shows **Unità Mindrink (10 g)** first and **Unità alcoliche italiane (12 g)** second. Italian UA replace the former UK result slot, retaining five result cards, the same controls, navigation, article links and bottom app invitation. Added-drink summaries and the examples table also show both Mindrink and Italian counts. UK calculations and display remain unchanged in the other seven languages; US drinks, grams, calories, validation, equivalents, quantities and raw-total calculations remain intact. Calculator cache version advances to `calculator-20261012it2`.
- Examples: 500 ml at 5% = 19.725 g → 2.0 Mindrink units / 1.6 Italian UA; 175 ml at 12% → 1.7 / 1.4; 25 ml at 40% → 0.8 / 0.7. Two 500 ml beers at 5% = 39.45 g → **3.9 Mindrink units / 3.3 Italian UA**, summed before display rounding.
- WHO source checked on 2026-10-12: [WHO — Making alcohol screening and brief intervention routine in primary health care](https://www.who.int/docs/librariesprovider2/default-document-library/sbi-2-pager-%28a4%29_final.pdf?download=true&sfvrsn=6c5dfc5b_4), page 2, explicitly uses 10 g of pure alcohol per standard drink in **AUDIT** and notes that countries use differing definitions. Cite this specific measurement context, alongside ISS/PASSI's Italian 12 g definition, without claiming a universal national unit or revising health limits. The link was added in the calculator's existing unit definition and methodology's existing reference paragraph. The WHO 2018 citation and 2024 background note remain unchanged.
- Calculator meta/OG descriptions: “Inserisci volume e gradazione alcolica per calcolare i grammi di alcol puro e confrontare le unità alcoliche italiane da 12 g, le unità UK e i drink standard USA.” → “Inserisci volume e gradazione alcolica per calcolare i grammi di alcol puro e confrontare le unità Mindrink da 10 g, le UA italiane da 12 g e i drink standard USA.” Existing hero/explanation copy, guide's calculator description and methodology link wording were aligned; titles, canonicals, hreflang, publication dates and app thresholds were preserved.
- Italian test baselines were deliberately updated for the owner-approved result labels and WHO reference link. New renderer checks cover both actual numeric outputs, dual added-row summaries, raw-value conversion and clearing incomplete values. Validation: **242 automated tests and 116 browser checks passed**, with no page errors or missing files, including the concurrent Japanese work's checks. The analytics-disabled build, 208-page sitemap and static SEO gate passed (4,920 internal links, 811 fragments). Italian selected/total results, dual added-row summaries, real decimal typing, incomplete/invalid inputs, removal and article/CTA links were verified at 375/1280 px. Phone/desktop screenshots were inspected: both result labels/values and the combined summary wrap cleanly, with the existing horizontal-scroll examples table retained on phones. External browser requests were blocked. Local screenshots are in gitignored `docs/Ai/active/italian-units-20261012/screenshots-dual/`. Sitemap source dates remain 2026-10-12; no deployment date or Google crawl date is inferred from them. The concurrent Japanese edits are preserved separately.

- Owner approval and local implementation: 2026-10-12 on website `dev`, based on `11958768a35ef9036908ae7ac2781ab5ed1d9b1b`. Status: implemented and locally verified; owner authorized a local commit on 2026-10-12. Implementation revision: the commit carrying `SEO-Action: SEO-20261012-03`. No push, merge or deployment authorized for this action. Implementation and sitemap dates are source dates, not production or Google crawl dates.
- Affected URLs: `/it/alcohol-unit-calculator/`, `/it/methodology.html`, `/it/blog/what-counts-as-a-drink-alcohol-units.html`, `/it/alcohol-units.html`. Shared changes: calculator renderer, alcohol constants/formulas, calculation/content/browser tests, Italian fixture entries and `docs/AI_CONTEXT.md`. The other seven languages retain their 10 g reference and existing HTML content.
- Primary sources checked on 2026-10-12: [ISS/PASSI — consumo di bevande alcoliche](https://www.epicentro.iss.it/passi/indicatori/alcol), whose definition is **12 g of ethanol per Italian UA**; [NHS — alcohol units](https://www.nhs.uk/live-well/alcohol-advice/calculating-alcohol-units/) for UK units of 10 ml pure alcohol; [NIAAA — standard drink](https://www.niaaa.nih.gov/alcohols-effects-health/what-standard-drink) for US standard drinks of 14 g. These checks support measurement definitions; no new Italian drinking recommendations or revised app thresholds are introduced. ISS links sit beside each Italian definition and within the existing methodology reference area.
- Calculation/display: the existing reference result slot becomes Italian 12 g UA for document language `it`. Grams remain `volume ml × (ABV % ÷ 100) × 0.789 × quantity`; Italian UA are unrounded grams divided by 12. Added-drink summaries, quantities, totals and tables use the same convention. Totals sum raw grams before display rounding. Italian results/tables use decimal commas. UK units, US standard drinks, alcohol grams, alcohol-only calories, presets, equivalents, validation, editor state and analytics calls are preserved. `GLOBAL_STANDARD_DRINK_GRAMS` and existing global-result fields remain 10 g; default callers and the other seven language references remain unchanged.
- Explanations: calculator, guide examples and short-answer table/FAQ now use 12 g Italian UA. The methodology retains its 10 g formula, worked app examples and entire threshold table, with explicit app labels and a conversion explanation: 20 Mindrink units = 200 g = approximately 16.7 Italian UA. This does not change the underlying gram quantity or app behavior. The existing WHO 2018 citation and 2024 background note remain unchanged. No new sections, measurement selector, country detection or local serving presets were added; original publication dates, titles/H1s, canonicals, hreflang, navigation and article journey remain intact. Applicable article modification dates are 2026-10-12.

Representative copy changes:

| Slot | Before | After |
|---|---|---|
| Calculator result labels and examples heading | Unità da 10 g | Unità alcoliche italiane (12 g) |
| Guide definition | 1 unità = 10 grammi di alcol puro | 1 UA italiana = 12 grammi di alcol puro |
| Guide formula | Unità da 10 g = (Volume in ml × (gradazione alcolica (%) ÷ 100) × 0,789) ÷ 10 | UA italiane = (Volume in ml × (gradazione alcolica (%) ÷ 100) × 0,789) ÷ 12 |
| Methodology definition | 1 unità = 10 grammi di alcol puro | 1 unità Mindrink = 10 grammi di alcol puro |
| Short-answer table heading | Unità da 10 g | UA italiane (12 g) |

Exact description changes (all existing matching social/schema description slots were synchronized):

| Page | Before | After |
|---|---|---|
| Calculator: meta/OG | Inserisci volume e gradazione alcolica per calcolare i grammi di alcol puro e confrontare le unità da 10 g, le unità UK e i drink standard USA. | Inserisci volume e gradazione alcolica per calcolare i grammi di alcol puro e confrontare le unità alcoliche italiane da 12 g, le unità UK e i drink standard USA. |
| Guide: meta/OG/Twitter/BlogPosting | Cosa conta come un drink? Una guida semplice per capire le unità alcoliche e le bevande standard, con esempi per birra, vino e superalcolici. | Cosa conta come un drink? Scopri le unità alcoliche italiane da 12 g, il riferimento Mindrink da 10 g e gli esempi per birra, vino e superalcolici. |
| Short explainer: meta/OG | Calcola unità alcoliche da 10 g per birra, vino e superalcolici, con esempi e equivalenze tra Regno Unito e USA. | Calcola le unità alcoliche italiane da 12 g per birra, vino e superalcolici, con esempi e confronti con le unità UK e i drink standard USA. |

Calculation examples, rounded only for display:

| Drink | Raw alcohol grams | Italian 12 g UA | Existing 10 g reference |
|---|---|---|---|
| 500 ml beer, 5% | 19.725 | 1.6 | 2.0 |
| 175 ml wine, 12% | 16.569 | 1.4 | 1.7 |
| 25 ml spirits, 40% | 7.89 | 0.7 | 0.8 |
| Two 500 ml beers, 5% | 39.45 | 3.3 | 3.9 |

- Baseline/publication check on 2026-10-12: local HEAD is `1195876`, a committed baseline one commit ahead of both remote branches; fresh `git ls-remote` returns `2601d9d` for `dev` and `main`. Public Actions runs also show successful `2601d9d` runs ([main release run](https://github.com/philip93758/websitemindrink/actions/runs/38295384267), [dev validation run](https://github.com/philip93758/websitemindrink/actions/runs/38295383319)). A direct production GET of the Italian calculator returned HTTP 200, the earlier `Calorie` label and neither contextual article link. Thus UX-20261012-01 and SEO-20261012-02 are preserved locally but are not yet verified live. This localization also retains both new article links and the bottom same-language app invitation.
- Validation on 2026-10-12: 235 automated tests passed, including 12 g conversion/quantity/unrounded totals, default/seven-language calculation protection, table values, FAQ schema parity and a hash check protecting the complete existing app threshold table. Italian content baselines were deliberately updated; the other locale entries were preserved. Sitemap update/check and build passed with analytics disabled: 208 pages/URLs, 4,918 internal links and 811 fragment links. Only three sitemap dates changed because all eight calculator dependency dates already read 2026-10-12 from the baseline.
- Browser validation: all **104 checks passed**, with no page errors or missing files. This includes the required eight-language decimal-typing, image/citation/navigation and methodology regressions; seven-language/Italian reference and raw-total checks; and Italian labels, quantity, preset/input validation, added-row summaries, removal, equivalents, both article links and bottom CTA at 375/1280 px. All four Italian pages were checked for page overflow and visible ISS links at both widths. Phone/desktop screenshots were inspected for calculator result/summary wrapping and explanatory text/table readability; the wide calculator comparison table retains its existing horizontal scroll on phones. Browser requests to external origins were blocked; no production analytics events were sent. Local screenshots are in gitignored `docs/Ai/active/italian-units-20261012/screenshots/`.
- Production deployment revision/time for this localization: pending a separate request and verified release. Google crawl observation/time and displayed snippets: unknown; no new GSC inspection performed. No independent native-speaker review claimed. The Italian visibility decline is context, not evidence of causation or a promise that unit localization will recover traffic. Any later release/follow-up should record this action alongside the two pending baseline actions and distinguish implementation, deployment, crawl and measured outcome dates.

## SEO-20261012-02 — Contextual calculator links into the article path

- Owner approval and implementation: 2026-10-12 on website `dev`, based on `2601d9dc7f7779899d9aa9d3bc6a97a8f74864b1`, alongside the calorie wording correction UX-20261012-01. Owner authorized committing both actions on 2026-10-12. Implementation revision: the commit introducing these two entries. Production deployment and Google crawl dates remain pending.
- Affected pages: `alcohol-unit-calculator/index.html` under all eight language prefixes. Add one short paragraph after the unit-reference list linking to the same-language `blog/what-counts-as-a-drink-alcohol-units.html` (step 3), and one after the examples table linking to `blog/why-weekly-drinking-patterns-matter.html` (step 6). Sixteen ordinary text links; equivalent placement and purpose in every locale.
- Purpose: help readers understand serving sizes, reference units and weekly patterns through existing articles. The calculator's app invitation remains in its existing bottom position. No promotional block, new section/heading, formula, preset or country-unit feature is included.
- Measurement: the existing `internal_navigation_clicked` event records locale and source/destination paths for these links; no analytics code or privacy setting changes. Compare link-click counts per recorded calculator page load. Article views, onward links and store clicks are separate aggregates, not an ordered visitor or Google-attributed funnel. See [analytics measurement notes](ANALYTICS.md#calculator-links-into-the-nine-step-article-path).
- Source modification dates in sitemap follow the edited calculators and do not prove production publication. If deployed with UX-20261012-01, evaluate the two actions as one release package. No ranking or traffic gain is claimed before observation.
- Validation (2026-10-12): all 225 existing automated tests, the build and all 88 browser regressions passed. The SEO gate checked 208 pages and 4,916 internal links, sixteen more than before this action. Thirty-two targeted checks covered both new links in eight languages at 320/1280 px: correct shared placement, same-language navigation, no page overflow and preserved bottom app destination. A local SDK stub verified the existing navigation event's exact locale/source/destination properties and the destination page-load event, with different identifiers after navigation. External requests were blocked; no production events were sent. Live ingestion is a separate post-deployment check.

## UX-20261012-01 — Clarify calories from alcohol in all calculator languages

- Owner approval and implementation: 2026-10-12 on website `dev`, based on `2601d9dc7f7779899d9aa9d3bc6a97a8f74864b1`. Owner authorized committing this action with SEO-20261012-02 on 2026-10-12. Implementation revision: the commit introducing these two entries. Production deployment and subsequent Google crawl dates remain pending.
- Affected pages: `alcohol-unit-calculator/index.html` under all eight language prefixes. Changed slots: the calorie result label for the selected drink and the optional total, sixteen labels in total.
- Reason: the existing calculation multiplies pure alcohol grams by 7 kcal/g. It measures energy from alcohol, excluding sugar, mixers and other ingredients. The old generic calorie label could be read as total beverage energy.
- Exact old → new labels: EN `Calories` → `Calories from alcohol`; DE `Kalorien` → `Kalorien aus Alkohol`; FR `Calories` → `Calories provenant de l’alcool`; ES `Calorías` → `Calorías del alcohol`; PT `Calorias` → `Calorias do álcool`; ID `Kalori` → `Kalori dari alkohol`; IT `Calorie` → `Calorie dell’alcol`; JA `カロリー` → `アルコール由来のカロリー`.
- Shared structure, result values, formulas, calculator inputs, metadata, unit references, article links, app invitation and tracking remain unchanged. No serving shortcuts or country-unit feature is included. Sitemap dates follow the eight page-source changes; they do not establish deployment dates.
- Validation (2026-10-12): all 225 existing automated tests and the build passed, including the 208-page SEO and sitemap checks. Sixteen local browser checks covered all eight languages at 320/1280 px: both result labels matched their localized copy, no label/card/page overflow occurred, and the default drink and its added total still returned 138 calories. External requests were blocked; no production analytics events were sent. No traffic improvement is claimed; this is a wording accuracy correction.

## RELEASE-20261012-01 — October SEO corrections published

- Owner authorized pre-deployment checks and promotion to main on 2026-10-12. Implementation revision: [`6cbc5ee91bdcf46317f581dd42fe2140768669bb`](https://github.com/philip93758/websitemindrink/commit/6cbc5ee91bdcf46317f581dd42fe2140768669bb), committed on 2026-10-02. The three actions below shipped together; assess them as one release package.
- Pre-release verification (2026-10-12): all 225 automated tests, build and all 88 browser regressions passed, with no browser page errors or missing local resources. The static SEO gate verified 208 pages, 4,900 internal links and 811 fragment links, including metadata, canonicals, reciprocal hreflang and sitemap coverage. Sitemap lastmod validation passed for all 208 URLs. Source modification dates remain 2026-10-02 for the nine changed pages; they are not the publication date.
- Episode 1.2's eight source-sync checks passed. Episode 1.1's legacy source-sync command could not run because Atrium's originals have moved into the separate ongoing editorial workflow. Neither episode's website pages changed in this release; their existing article and browser regression checks passed. No pending Atrium editorial content was imported.
- Hosted dev CI: [run 38294900112](https://github.com/philip93758/websitemindrink/actions/runs/38294900112), successful for the implementation revision. Main was then fast-forwarded to the same revision.
- Verified production release: [run 38295127650](https://github.com/philip93758/websitemindrink/actions/runs/38295127650), build and deployment successful. The [GitHub Pages deployment job](https://github.com/philip93758/websitemindrink/actions/runs/38295127650/job/114964377963) completed on **2026-10-12 at 19:04:24 UTC** (21:04:24 Europe/Berlin).
- Live verification (2026-10-12): all eight methodology pages, the Italian calculator page, sitemap.xml and robots.txt returned HTTP 200 and matched the released source after newline normalization. The deployed analytics configuration was present and configured for the EU host; no credentials or production analytics events were recorded by this check.
- This follow-up records actual release evidence and supersedes the unpublished status in the historical implementation entries below. Its documentation-only commit does not change public content or sitemap dates. Subsequent Google crawl, displayed snippets and traffic impact remain unverified.

## SEO-20261002-02 — Automatic website SEO release gate

- Approval/implementation: 2026-10-02, on local website `dev` based on `6d2bb37475c55ea1172495b436bee58d1d2d5aad`. Not committed, pushed or deployed. The gate will run in hosted CI only after this change is committed/pushed; it does not continuously monitor production.
- Ownership/files: website `tools/check-site-seo.js`, `tests/site-seo.test.js`, `package.json` and `docs/AI_CONTEXT.md`. Atrium remains the owner of analysis and private analytics evidence. No new runtime dependencies, credentials, external requests or scheduled automation.
- Coverage: every published HTML page's title/description/H1, document language, self-canonical and optional Open Graph URL; accidental noindex; all eight language alternates plus English x-default, published destinations and reciprocal clusters; internal links and fragment IDs; exact sitemap coverage and alternate parity. The existing sitemap-date check remains separate.
- Release wiring: `npm run seo:check` is part of `npm run build`; the existing GitHub Actions build precedes the production deployment job. Regression tests also verify the public inventory against the staging commands, so private docs/tools are not treated as valid public destinations. The check fails with nonzero exit status rather than silently warning.
- Limits: a bounded offline HTML/XML scanner, not a live crawler, external-link checker, schema validator or guarantee of Google indexing/ranking. No live robots/header, crawl-date or traffic observations were made. This is preventive quality control, not an SEO experiment with a claimed uplift.
- Verification (2026-10-02): all 225 tests passed, including deliberately broken SEO fixtures, CLI failure/success status and deployment-inventory agreement. Analytics-disabled build passed; the new gate checked 208 pages, 4,900 internal links and 811 fragment links. Existing browser QA passed all 88 checks with no page errors or missing local resources; external traffic was blocked. Production revision/time and Google crawl date: not applicable to the unpublished tooling; record the release separately if shipped with public content changes.
- Release follow-up (2026-10-12): committed as `6cbc5ee`, pushed and exercised successfully in both dev and main CI. Production deployment is verified in RELEASE-20261012-01 above.

## SEO-20261002-01 — WHO edition wording across all languages

- Approval/implementation: 2026-10-02, on local website `dev` based on `6d2bb37475c55ea1172495b436bee58d1d2d5aad`. Not committed, pushed or deployed. No Atrium files changed.
- Affected pages: `methodology.html` under all eight language prefixes listed above. Changed slots: the existing WHO source link label and its following explanatory paragraph; Article `dateModified` and those pages' sitemap `lastmod` now 2026-10-02. Original publication dates are preserved.
- Correction: the existing note described the 2018 report as the latest full edition. Keep and explicitly label the [2018 WHO report](https://www.who.int/publications/i/item/9789241565639); link the [2024 WHO report](https://www.who.int/publications/i/item/9789240096745) as newer background. The 2024 publication is not presented as a replacement basis for the site's thresholds. Sources checked on 2026-10-02.
- New English note (equivalent meaning in all eight locales): “The link above points to the 2018 edition. For newer background, see WHO’s 2024 report on alcohol, health and treatment of substance use disorders. The guideline sources for the thresholds on this page are unchanged.” Exact localized notes are protected by `tests/methodology-references.test.js` and visible in the implementation diff once committed.
- Preserved: existing sections/headings, page metadata other than Article modification date, original sources, thresholds, formulas, worked examples, calculator behaviour, CTA journeys, canonical/hreflang and tracking. No locale-only explanation or section. This is source accuracy, not a new health recommendation or promised traffic gain.
- Concurrent pending work: SEO-20260929-01's Italian calculator meta/OG correction remains intact and unpublished. The sitemap updater refreshes that still-uncommitted page's source date to 2026-10-02 as well; it does not prove any release on either date. If shipped together, assess them as one release package, not isolated experiments.
- Verification (2026-10-02): all eight localized reference regressions and all 225 full-suite tests passed; build, loader, sitemap and new SEO gate passed. Pre-edit content hashes confirm all eight methodology pages remain identical outside the WHO reference block and Article modification date. The pending Italian calculator still differs from HEAD only in its two approved descriptions. Sitemap changes are limited to those nine pages. Existing browser QA passed 88 checks; 16 additional reference-block checks passed across eight locales at 375/1280 px (link visibility, no page/block overflow), with English/Japanese phone screenshot spot-checks. No independent native-speaker review is claimed. Actual production revision/time, subsequent Google crawl and search-result display: unknown until a separately approved release and verification.
- Release follow-up (2026-10-12): all eight corrections are verified live from implementation revision `6cbc5ee`; see RELEASE-20261012-01 above for the deployment time and evidence.

## SEO-20260929-01 — Italian calculator description accuracy

- Approval: owner approved this bounded correction on 2026-09-29, including regression checks and this log entry.
- Status: implemented locally on website `dev`, based on `6d2bb37475c55ea1172495b436bee58d1d2d5aad`; not committed, pushed or deployed. Implementation date is not a production or Google crawl date.
- URL/source: `https://mindrink.me/it/alcohol-unit-calculator/`; `it/alcohol-unit-calculator/index.html`.
- Changed slots: exactly one meta description and its matching Open Graph description.
- Before, both slots: “Calcola unità standard, unità UK, drink US, grammi di alcol puro, calorie e totali settimanali facoltativi.”
- After, both slots: “Inserisci volume e gradazione alcolica per calcolare i grammi di alcol puro e confrontare le unità da 10 g, le unità UK e i drink standard USA.”
- Reason: the current shared calculator provides drink calculations and an optional total, not a dedicated weekly mode. Replace the legacy weekly-total promise and output list with the actual volume/strength-to-result task. The other seven locales already avoid that weekly-mode promise. This is an accuracy/consistency correction, not evidence that the old description caused the Italian click decline.
- Preserved: Italian title/H1 `Calcolatore unità alcoliche`, social title, all visible copy, controls, examples, layout, formulas, tracking, links, canonical/hreflang and the same-language Explore Mindrink journey. No other language changed, no extra Italian explanation and no structural baseline reset.
- Verification (2026-09-29): all 30 focused SEO/UX checks and all 188 full-suite tests passed, including the new exact/unique Italian meta/OG description check and existing multilingual title/structure/routing protections. Build passed with analytics disabled; loader and sitemap checks cover 208 pages/URLs. Direct comparison against the starting revision confirms the remaining Italian HTML is identical after line-ending normalization. Only this page's sitemap `lastmod` changed, from 2026-09-13 to 2026-09-29; other 207 URLs remain unchanged. No visible/layout/interaction changes required a new browser baseline. No production events were sent.
- Production revision/time, subsequent Google crawl and displayed snippet: pending a separately approved release and verification. Keep these distinct from today's source/sitemap date; no traffic gain is claimed. Compare release-aligned periods when available, record any concurrent changes and do not assume Google displays the meta description.
- Context: [Atrium proposal reconciliation](../../mindrink-atrium/docs/atrium/active/website-calculator-seo-2026-08-23/proposal-next-round-2026-09-12.md); [private 29 September SEO analysis](../../mindrink-atrium/reports/gsc/2026-09-29/seo-results-2026-09-29.md). No new analytics extraction performed.
- Follow-up (2026-10-02): copy and its regression remain unchanged and unpublished. The existing updater moved this still-dirty page's sitemap source date from 2026-09-29 to 2026-10-02 alongside the eight methodology corrections (SEO-20261002-01). The earlier verification record above is retained; neither source date is deployment evidence.
- Release follow-up (2026-10-12): both corrected Italian descriptions are verified live from implementation revision `6cbc5ee`; see RELEASE-20261012-01 above. Google crawl and snippet adoption remain unverified.

## CONTENT-20260920-14 — Episode 1.2 localized flow and readability

- Status: local Atrium raw content and website `dev`, based on `86db13b`; not committed, pushed or deployed. Owner explicitly froze English and requested natural local-language prose in the other seven editions.
- Final owner-requested review (2026-09-20): refined remaining literal transitions, the Agu'a passage and natural idioms in each language; repaired Japanese court-hymn sentence grammar and clarified Indonesian brewing prose. English remains unchanged. Owner subsequently authorized committing and deploying this package; actual deployment evidence is separate from this pre-release record.
- Reviewed German, French, Spanish, Italian, European Portuguese, Indonesian and Japanese individually. First pass aligned the synopsis, institutional limits, southern Mesopotamian writing scope, special provisions and conclusion argument with frozen English. Second pass addressed sentence rhythm, literal phrasing, repeated abstractions, transitions and jargon; Indonesian brewing terms received short explanations. Final proofreading checked consistency and rendered synopsis readability on phone and desktop. No independent native-speaker review is claimed.
- Retained title/subtitle, the three argumentative sections and conclusion structure. Preserved every citation in its original order, all eleven bibliography entries, all five complete image/credit blocks and original publication dates. English raw content is unchanged relative to its committed source; English HTML retains Git blob `907d7db890496946a21db84d764057b7889cd913`. Episode 1.1 is unchanged.
- Raw sources: the seven `Mesopotamia - What the First Written Records Tell Us About Beer.{de,fr,es,it,pt,id,ja}.md` files in `../mindrink-atrium/docs/marketing/Content/History series/Ep 1.2/`. Website pages: `/{de,fr,es,it,pt,id,ja}/science/mesopotamia-beer-written-records.html` on `https://mindrink.me`.
- Import changed exactly seven HTML files. Updated only their seven sitemap lastmod values to 2026-09-20 and corresponding article modification metadata; canonicals, hreflang and navigation remain unchanged. Both episode source-sync checks, build, sitemap validation, 187 automated tests and 88 browser regressions passed. Inspected 390/1280 px screenshots for every edited locale: no horizontal overflow or broken citation targets. Existing unrelated Atrium changes were preserved.

## CONTENT-20260920-13 — Final bounded English Episode 1.2 edits

- Status: local Atrium raw content and website `dev`; not committed, pushed or deployed. English only, based on website `6437fef`.
- Applied the owner's ten targeted edits: synopsis thesis; limited institutional scope in the introduction; southern Mesopotamian scope for early writing; narrower special-distribution wording without “temporary workers”; concrete institutional archive bias; drinking rather than holding the jar; plain Ninkasi payoff; grammatical Hammurabi penalty phrasing; and two conclusion micro-edits. No restructuring, cuts, new research section or conclusion rewrite.
- Source: `../mindrink-atrium/docs/marketing/Content/History series/Ep 1.2/Mesopotamia - What the First Written Records Tell Us About Beer.md`. Page: `https://mindrink.me/science/mesopotamia-beer-written-records.html`. Preserved all references, figures, credits, headings, original publication date and canonical/hreflang; other languages and Episode 1.1 unchanged.
- Validation: English-only import updated one HTML file. Both episode source checks, build, sitemap check and 187 tests passed. Mobile/desktop checks at 390/1280 px found no overflow or broken citation targets; inspected the synopsis rendering. Same-day modification and sitemap dates remain current. No independent source re-review or live deployment claimed.

## CONTENT-20260920-12 — Final Japanese, Italian and Spanish Episode 1.1 pass

- Status: local Atrium raw content and website `dev`; not committed, pushed or deployed. Preserved all pending edits to the other five editions and unrelated Atrium work.
- The supplied review explicitly used older cached copies. Current sources already contained the shared scientific corrections (cultivation/domestication, microscopic vine tissue, current Göbekli interpretation, references 14–15) and most proposed idiomatic edits. Retained those rather than repeating a general rewrite. Worked through Japanese, Italian, then Spanish.
- Removed the remaining implication of an observed Jiahu learning process, applied remaining targeted phrasing (Japanese collective work, Italian wine/labour/collective meals, Spanish grain processing/wine/construction), and replaced each conclusion with four independently phrased paragraphs following the approved argument. Preserved the Japanese ingredients heading and all fifteen references in each edition.
- Removed the agriculture clause from the three Enclosure D captions and recorded the localized captions in Atrium `IMAGE_SELECTION.md`. Raw sources: `../mindrink-atrium/docs/marketing/Content/History series/Ep 1.1/Who Invented Alcohol.{ja,it,es}.md`. Affected pages: `/ja/science/who-invented-alcohol.html`, `/it/science/who-invented-alcohol.html`, `/es/science/who-invented-alcohol.html` on `https://mindrink.me`.
- Validation: importer changed only these three HTML pages; all eight source comparisons, build, sitemap check and 187 tests passed. Inspected each conclusion at 390/1280 px: no horizontal overflow, fifteen references and no broken citation targets. Publication dates, canonical/hreflang, credited figures and actual Episode 1.2 navigation remain intact. Same-day modification/sitemap dates remain 2026-09-20.
- This completes the requested bounded editorial pass across all eight editions; no further general stylistic review planned. No independent native-speaker approval or live deployment claimed.

## CONTENT-20260920-11 — Final bounded Portuguese Episode 1.1 editorial pass

- Status: local Atrium raw content and website `dev`; not committed, pushed or deployed. Other pending language edits are preserved.
- Applied the owner's remaining PT-PT wording changes, replaced Jiahu's learning-process phrasing with deliberate preparation, and removed the Enclosure D caption's agriculture clause. Recorded the approved Portuguese caption in Atrium `IMAGE_SELECTION.md`. Standardized archaeological dates with spaced thousands, including the localized tablet description; bibliographic publication years, titles and identifiers remain unchanged.
- Used the supplied four-paragraph conclusion under “Origens difíceis de reconstituir”, retaining supporting citations and all fifteen references. Preserved the cultivation/domestication explanation and the remaining article structure, figures, metadata, canonical/hreflang and actual Episode 1.2 link.
- Source/page: `../mindrink-atrium/docs/marketing/Content/History series/Ep 1.1/Who Invented Alcohol.pt.md`; `https://mindrink.me/pt/science/who-invented-alcohol.html`. Import updated Portuguese HTML only.
- Validation: all eight source comparisons, build, sitemap check and 184 tests passed. Added Portuguese regression coverage. Inspected 390/1280 px conclusion screenshots: no horizontal overflow, fifteen references and no broken citation targets. Same-day modification/sitemap dates remain 2026-09-20. No broader language review or independent native-speaker approval claimed.

## CONTENT-20260920-10 — Final bounded Indonesian Episode 1.1 editorial pass

- Status: implemented in Atrium raw content and website `dev`; not committed, pushed or deployed. Pending English/French/German work is preserved.
- Scope: applied the owner's remaining Indonesian phrasing edits, described Jiahu's capability without implying an observed learning process, and removed the Enclosure D caption's agriculture clause. Recorded the approved caption in Atrium `IMAGE_SELECTION.md` and updated the importer. Retained the explicitly approved sentences and existing cultivation/domestication distinction.
- Replaced the conclusion with four naturally phrased Indonesian paragraphs following the approved argument: no single inventor, natural fermentation and human control, different ingredients and places, social uses with stronger evidence for feasting than alcohol at Göbekli, then Mesopotamian written records. Preserved all fifteen bibliography entries and supporting citations; no broader structural rewrite.
- Source/page: `../mindrink-atrium/docs/marketing/Content/History series/Ep 1.1/Who Invented Alcohol.id.md`; `https://mindrink.me/id/science/who-invented-alcohol.html`. Original publication date, figures, actual Episode 1.2 link and canonical/hreflang remain intact.
- Validation: all eight source comparisons, build, sitemap check and 183 automated tests passed. Added Indonesian regression coverage and inspected conclusion screenshots at 390/1280 px. Same-day modification/sitemap dates remain 2026-09-20. No independent native-speaker approval or production deployment claimed; no further general language review in this pass.

## CONTENT-20260920-09 — Final bounded German Episode 1.1 editorial pass

- Status: implemented in Atrium raw content and website `dev`; not committed, pushed or deployed. Pending English/French changes remain intact.
- Scope: owner's five final German points only. Removed the Enclosure D caption's agriculture clause in the importer and recorded the approved German caption in Atrium `IMAGE_SELECTION.md`. Rephrased Jiahu's capability without implying an observed learning process; applied the requested category/wine/vessel/context wording and the cautious closing sentence on Göbekli's possible alcohol use. Simplified the Raqefet sentence with grammatical “Dass … ist plausibel, aber nicht bewiesen”.
- Replaced the conclusion with four independently phrased German paragraphs following the approved argument: no single invention, natural fermentation and human control, different ingredients/places, social uses with stronger evidence for feasting than alcohol at Göbekli, then Mesopotamian written records. Retained citations and all fifteen bibliography entries. No general rewrite, section reordering or further stylistic review.
- Source/page: `../mindrink-atrium/docs/marketing/Content/History series/Ep 1.1/Who Invented Alcohol.de.md`; `https://mindrink.me/de/science/who-invented-alcohol.html`. Only German HTML changed in this import; opening, scientific corrections, images, actual Episode 1.2 link, canonical/hreflang and original publication date are preserved.
- Validation: all eight source comparisons, build, sitemap and 182 automated tests passed. Added German regression checks. Reviewed conclusion rendering at 390/1280 px; no horizontal overflow and all fifteen references present. Same-day modification/sitemap dates remain correctly at 2026-09-20. German content is otherwise frozen after this pass; no independent native-speaker approval or production deployment claimed.

## CONTENT-20260920-08 — Final bounded French Episode 1.1 editorial pass

- Status: local Atrium and website `dev` only; not committed, pushed or deployed. Pending English conclusion/caption edits from CONTENT-20260920-07 are preserved.
- Owner supplied a French review based on an older page. The five scientific corrections were already present, as were several cited idiomatic fixes. Kept the corrected opening, cultivation explanation and updated Göbekli interpretation; did not duplicate or undo them. Applied the remaining requested French formulations, including the shorter Jiahu synthesis, wine terminology, contextual-use/funerary wording and Dietrich paragraph. Fixed the doubled full stop after the Raqefet date abbreviation.
- Replaced the French conclusion with four idiomatic paragraphs following the approved English argument: no single invention, human use of natural fermentation, different ingredients/places, uncertain but meaningful social uses, then Mesopotamian written records. Existing supporting citations and all fifteen bibliography entries remain. No section reordering, broader cuts or new scientific claims.
- Raw source: `../mindrink-atrium/docs/marketing/Content/History series/Ep 1.1/Who Invented Alcohol.fr.md`; page: `https://mindrink.me/fr/science/who-invented-alcohol.html`. Removed the French Enclosure D caption's agriculture clause in the importer and recorded the approved French caption in Atrium's existing `IMAGE_SELECTION.md`, preserving its other edits.
- Validation: importer updated only French; all eight source comparisons, build, sitemap and 181 automated tests passed. Added a French conclusion/caption regression test. Inspected the conclusion at 390/1280 px; no horizontal overflow and fifteen references present. Original publication date, canonical/hreflang, figures and actual Episode 1.2 navigation remain unchanged. Sitemap and modification dates correctly remain 2026-09-20 for this same-day update.
- French copy is otherwise frozen after this requested pass. No independent native-speaker approval or production deployment is claimed.

## CONTENT-20260920-07 — Owner-supplied English Episode 1.1 conclusion

- Status: implemented locally on Atrium and website `dev`; not committed, pushed or deployed. Based on website `9f6eff4`.
- Scope: replace only the English conclusion under “Beginnings we cannot fully recover” with the owner's four supplied paragraphs, preserving the wording and attaching existing references to the relevant archaeological and written-record claims. Raw source updated first: `../mindrink-atrium/docs/marketing/Content/History series/Ep 1.1/Who Invented Alcohol.md`; website URL: `https://mindrink.me/science/who-invented-alcohol.html`.
- Preserved: other seven languages, opening, remaining sections, fifteen bibliography entries, figures, metadata, canonical/hreflang and actual Episode 1.2 navigation. The source retains the supplied older Episode 2 teaser; the existing importer continues to render the actual Episode 1.2 title/link. No series renumbering or wider editorial pass.
- Validation: eight-language source-sync check, build, sitemap check and all 180 automated tests passed. Import changed only the English HTML. Same-day modification and sitemap dates remain correctly at 2026-09-20; original publication date is unchanged. No production deployment performed.

- Follow-up, 2026-09-20: at the owner's request, removed the English Göbekli Enclosure D caption's “before agriculture became established” clause in Atrium `IMAGE_SELECTION.md` and the website importer, then regenerated the English article. Existing image-selection edits are preserved. The cultivation paragraph already explicitly says pre-domestication bread/brewing evidence cannot distinguish gathered from cultivated grain, so it was left unchanged. Other languages untouched. Source sync, sitemap and 180 tests passed; added a regression assertion against the removed English caption wording. Still local dev only.

## CONTENT-20260920-06 — Episode 1.1 scientific corrections in the other seven languages

- Status: implemented locally on website `dev`; not committed, pushed or deployed at recording. Existing English and earlier translation work is preserved.
- Owner request: extend only CONTENT-20260920-05's five scientific corrections to the other languages, one at a time, using natural language-specific phrasing rather than literal English sentence patterns. Sequence: French, German, Spanish, European Portuguese, Italian, Japanese, Indonesian. Each Atrium `dev` source was edited before importing/checking its corresponding website page; final German/Japanese sentence refinements were re-imported and rechecked.
- Sources/URLs: `Who Invented Alcohol.{fr,de,es,pt,it,ja,id}.md` in `../mindrink-atrium/docs/marketing/Content/History series/Ep 1.1/`; corresponding `https://mindrink.me/{fr,de,es,pt,it,ja,id}/science/who-invented-alcohol.html` pages.
- Changes in each edition: remove the broad pre-agriculture claim at Raqefet; add a short cultivation/domestication distinction immediately before Braidwood's bread/beer discussion; replace the implied accidental-to-deliberate sequence between Raqefet and Jiahu; identify microscopic grapevine tissue rather than fruit skin; distinguish the 2012 sanctuary interpretation from newer evidence of domestic activity/permanent settlement with a strong ritual role. Japanese explicitly distinguishes 栽培 from 栽培化. The alcohol/feasting caveats remain unchanged.
- References: append the same original-language Arranz-Otaegui et al. 2016 bibliographic entry as reference 14 and a locally worded DAI project entry/access date as reference 15. Retain the original thirteen references and citation numbers; all eight editions now have fifteen references. Extend automated checks for both new sources and their placement across every language.
- Preserved: English raw source and HTML are byte-identical to the start of this pass. All seven openings, conclusions, titles, heading order, existing bibliography entries, images/captions/credits, layout, navigation, canonical/hreflang and original publication dates remain intact. Source comparisons show four replaced paragraphs, one added explanatory paragraph and two appended references per language; no whole-article rewrite or Episode 1.2 page change. Page/asset hashes identify only the seven corresponding HTML files as changed.
- Validation on 2026-09-20: source-sync checks after individual imports and on the final eight-language set passed. Build, sitemap validation and 180 automated tests passed. All 88 browser regression checks passed with no browser errors or missing assets. Additional checks exercised both new reference links at 390/1280 px for each of the seven languages. Reviewed all seven mobile cultivation paragraphs, plus French/Japanese desktop views. Sitemap dates were already 2026-09-20 from the earlier same-day refinements; the updater correctly left them unchanged. Screenshots are local temporary QA artifacts, not publication evidence or independent native-speaker approval.
- Production revision/time, crawl observation and search outcome: not yet recorded. The scientific corrections now cover all eight languages; the rest of Episode 1.1 remains frozen.

## CONTENT-20260920-05 — Episode 1.1 English bounded scientific corrections

- Status: implemented locally on website `dev`; not committed, pushed or deployed at recording. Existing translation work is preserved.
- Owner-approved scope: five factual/interpretive patches and two new references, English only. Updated Atrium `dev` raw source `../mindrink-atrium/docs/marketing/Content/History series/Ep 1.1/Who Invented Alcohol.md` first, then imported the English page at `https://mindrink.me/science/who-invented-alcohol.html`.
- Changes: remove the Raqefet introduction's broad agriculture claim; add the short cultivation-versus-domestication explanation before the bread/beer discussion; replace the implied Raqefet-to-Jiahu accidental-to-deliberate transition; correct grape skin to microscopic grapevine tissue; date the older Göbekli sanctuary interpretation to 2012 and explain newer domestic/permanent-settlement evidence without strengthening the alcohol hypothesis. Append references 14 (Arranz-Otaegui et al., 2016, doi:10.1073/pnas.1612797113) and 15 (current DAI project overview, accessed 2026-09-20).
- Preserved: frozen opening, conclusion, titles, section order, existing thirteen references and citation numbering, images/captions/credits, styles, byline, navigation, canonical/hreflang and original publication date (2026-08-29). No further stylistic rewrite. Other seven languages remain unchanged by this pass; corresponding scientific patches are intentionally deferred under the English-first instruction.
- Implementation: revision containing this action ID, based on website `6f0f7b0` plus pending translation changes. English `dateModified` and sitemap `lastmod` become 2026-09-20; the updater changed only one of 208 URLs during this pass. Importer unchanged; English reference-count and scientific-content regression checks updated.
- Validation on 2026-09-20: eight-edition Episode 1.1 source-sync check, build, sitemap check and 179 automated tests passed. All 88 browser regressions passed with no browser errors or missing assets. Additional phone/desktop checks confirmed both new citation links resolve visibly; reviewed the cultivation paragraph at 390/1280 px. Before/after hashes confirm only the English Episode 1.1 raw Markdown changed within that source folder, and only its English HTML changed among website pages/images; translations and image assets are byte-identical to the start of this pass. Git whitespace checks passed.
- Production revision/time, crawl observation and search outcome: not yet recorded. Content stays otherwise frozen; this is not authorization for another style pass or a production release.

## CONTENT-20260920-04 — Episode 1.1 remaining-language editorial refinement

- Status: implemented locally on website `dev`; not committed, pushed or deployed at recording. Pending French and German changes from CONTENT-20260920-02/03 are preserved.
- Owner request: apply the supplied language-by-language editorial review in Atrium raw content first, then website `dev`. Sources: `Who Invented Alcohol.{id,ja,pt,it,es}.md` in `../mindrink-atrium/docs/marketing/Content/History series/Ep 1.1/`, edited in the separately scoped Atrium `dev` working tree before import.
- Exact URLs: `https://mindrink.me/{id,ja,pt,it,es}/science/who-invented-alcohol.html` (five corresponding locale URLs).
- Changes: fuller idiomatic line edits for Indonesian and Japanese; lighter/moderate edits for European Portuguese, Italian and Spanish. Replace literal transitions, abstract phrasing and the metaphor that alcohol built Göbekli Tepe. Rework each conclusion into three paragraphs within its existing section, retaining the distinction between material traces, proposed brewing and uncertain social interpretation. Indonesian explicitly distinguishes wine from the grape ingredient.
- Preserved: all titles/subtitles, five section headings per edition, thirteen reference entries and all 34 citation occurrences in their existing order, four images with captions/credits, scientific examples, navigation, metadata descriptions, canonical/hreflang and original publication dates. English and the prior French/German revisions are byte-identical to the start of this pass; no Episode 1.2 source or page changed. No shared styles or importer changes.
- Implementation: revision containing this action ID, based on website `6f0f7b0` plus pending French/German work. Only the five edited pages gain new `dateModified` / sitemap `lastmod` values of 2026-09-20; earlier French/German dates remain intact.
- Validation on 2026-09-20: all eight Episode 1.1 source-sync checks, build and 178 automated tests passed; 88 browser checks passed without failures, browser errors or missing assets. Independently compared reference entries, figures, headings, citation sequence, publication metadata and canonical/hreflang against HEAD for all five editions. Inspected mobile openings (390 px) and desktop conclusions (1280 px) for each. Source/page hashes confirm the scoped changes and preservation of earlier work. Local QA: `docs/Ai/reviews/other-episode11-2026-09-20/` (ignored).
- Production revision/time, crawl observation and search outcome: not yet recorded. Modification dates are not deployment evidence, and automated QA is not independent native-speaker approval.

## CONTENT-20260920-03 — Episode 1.1 German editorial refinement

- Status: implemented locally on website `dev`; not committed, pushed or deployed at recording. Pending French changes from CONTENT-20260920-02 are preserved.
- Owner request: apply the supplied German editorial review to Atrium raw content first, then website `dev`. Source: `../mindrink-atrium/docs/marketing/Content/History series/Ep 1.1/Who Invented Alcohol.de.md`, revised in the separately scoped Atrium `dev` working tree.
- Exact URL: `https://mindrink.me/de/science/who-invented-alcohol.html`.
- Changed slots: natural German wording in the introduction and existing sections; three-paragraph conclusion; consistent dotted thousands in ancient dates, including reference 13 (`3.100–3.000 v. Chr.`). Use `Forschende`/team wording for generic research groups while retaining named professional titles. Preserve attributed and uncertain archaeological interpretations, rather than treating possible brewing or social uses as established facts.
- Preserved: title, subtitle, five section headings, thirteen sources and citation sequence, four images/captions/credits, navigation, metadata descriptions, canonical/hreflang and original publication date. Bibliography titles retain their original wording and numerical conventions. English, French and all other editions are unchanged by this pass. No shared styles or importer changes.
- Implementation: revision containing this action ID, based on website `6f0f7b0` plus pending French work. German article `dateModified` and its sitemap `lastmod` advance to 2026-09-20; no other new sitemap date changes.
- Validation on 2026-09-20: all eight source-sync checks, build and 178 automated tests passed; 88 browser checks passed without failures, browser errors or missing assets. Source hashes confirm only German Episode 1.1 changed in this pass; the pending French page is byte-identical. Compared figures, references (allowing reference 13 date typography), headings and citation sequence against HEAD. Local previews: `docs/Ai/reviews/german-episode11-2026-09-20/` (ignored).
- Production revision/time, crawl observation and search outcome: not yet recorded. Modification dates are not deployment evidence.

## CONTENT-20260920-02 — Episode 1.1 French editorial refinement

- Status: implemented locally on website `dev`; not committed, pushed or deployed at recording.
- Owner request: revise the French Atrium raw source first, then sync website `dev`, following the supplied native-French editorial review. Source: `../mindrink-atrium/docs/marketing/Content/History series/Ep 1.1/Who Invented Alcohol.fr.md` in the separately scoped Atrium `dev` working tree.
- Exact URL: `https://mindrink.me/fr/science/who-invented-alcohol.html`.
- Changed slots: introduction and existing Raqefet, Jiahu, cereal-processing, Georgia and collective-life paragraphs; conclusion rewritten as three paragraphs with its existing citation sequence. Replace literal English phrasing with natural French without turning archaeological interpretations into established facts. The Mesopotamia transition describes written evidence without claiming it gives an unmediated view of daily life.
- Preserved: title, subtitle, all five section headings, thirteen references, four credited figures/captions, source links, navigation, metadata descriptions, canonical/hreflang and original publication date. Existing `av. J.-C.` notation with thousands separators already covered the body and reference 13; captions have no calendar dates to convert. English and the other six Episode 1.1 translations, plus every Episode 1.2 edition, are unchanged.
- Implementation: revision containing this action ID, based on website `6f0f7b0`. Only the French article `dateModified` and its sitemap `lastmod` advance to 2026-09-20. No shared style or importer change.
- Validation on 2026-09-20: all eight Episode 1.1 source-sync checks and the build passed; 178 automated tests and 88 browser checks passed, with no browser errors or missing assets. Inspected the French opening and rewritten conclusion at 390 and 1280 px. Figures, references, headings and citation sequence match HEAD; source hashes confirm only the French Episode 1.1 Markdown changed. Local previews: `docs/Ai/reviews/french-episode11-2026-09-20/` (ignored).
- Production revision/time, crawl observation and search outcome: not yet recorded. Modification dates are not deployment evidence.

## CONTENT-20260920-01 — Episode 1.2 English editorial refinement

- Status: implemented locally on website `dev`; not committed, pushed or deployed at recording.
- Owner request: edit the Atrium English source first, then sync the website. Episode 1.1 English is the frozen style benchmark; translations are outside this pass.
- Source: `../mindrink-atrium/docs/marketing/Content/History series/Ep 1.2/Mesopotamia - What the First Written Records Tell Us About Beer.md`, revised in the separately scoped Atrium `dev` working tree before import.
- Exact URL: `https://mindrink.me/science/mesopotamia-beer-written-records.html`.
- Changed slots: three-sentence synopsis, city/surplus/record-keeping introduction, more direct wording throughout the three existing body sections and conclusion. Preserve the uncertainty around reconstruction and drinking straws; retain the Agu'a example and final payoff.
- Preserved: title, subtitle, section headings/order, all eleven references, five illustrations with captions/credits, publication date, descriptions, canonical/hreflang and navigation. No changes to Episode 1.1, translated pages, hub, shared styles or importer.
- Implementation: the revision containing this action ID, based on `26ea217`; the matching raw-source edit remains in Atrium. English article `dateModified` and only its sitemap `lastmod` advance to 2026-09-20. These are modification dates, not deployment evidence.
- Validation on 2026-09-20: English source-sync check and build passed; 178 automated tests and 88 browser checks passed without failures. Inspected English opening/intro at 390 and 1280 px. Compared figures, reference entries, headings and citation sequence against HEAD (line-ending normalized): unchanged. Source hashes confirm all 21 other Markdown files in the two episode folders are untouched by this pass. Local QA artifacts: `docs/Ai/reviews/english-episode12-2026-09-20/` (ignored).
- Production revision/time, crawl observation and search outcome: not yet recorded. This is an editorial readability change, not a claimed ranking improvement.

## CONTENT-20260915-02 — Episodes 1.1 and 1.2 native-voice / idiomatic passes (eight languages)

- Status: implemented on local website `dev`. **Not pushed or deployed.** Article dates and sitemap `lastmod` are not production evidence.
- Source: Atrium `docs/marketing/Content/History series/Ep 1.1/` (`2cacd61`, native-voice pass; archaeology yields traces, not experiments) and `Ep 1.2/` (`cc0edfa`, residual idiomatic pass across eight languages). Atrium markdown was not edited from this repo.
- Scope: all eight `/…/science/who-invented-alcohol.html` and `/…/science/mesopotamia-beer-written-records.html` editions.
- Change: idiomatic / native-voice copy only. Continuous-essay structures, figures, standfirsts, and section counts unchanged.
- Metadata: keep existing `datePublished`. `dateModified` and sitemap `lastmod` may move to 2026-09-15 for this copy change.
- Publication remains a separate step.

## CONTENT-20260915-01 — Episode 1.2 calque localization (seven languages)

- Status: implemented on local website `dev`. **Not pushed or deployed.** Article dates and sitemap `lastmod` are not production evidence.
- Source: Atrium `docs/marketing/Content/History series/Ep 1.2/` (`3158b9c`, “localize Ep 1.2 calques by meaning, not French syntax”). Atrium markdown was not edited from this repo.
- Scope: English, German, Spanish, Portuguese, Indonesian, Italian, Japanese `/…/science/mesopotamia-beer-written-records.html`. French unchanged.
- Change: meaning-first calque fixes (DE/ES/PT/IT patches; JA/ID line edits; light English polish). Structure, figures and standfirst pattern unchanged.
- Metadata: keep existing `datePublished`. `dateModified` and sitemap `lastmod` may move to 2026-09-15 for this copy change.
- Publication remains a separate step.

## CONTENT-20260914-05 — Episode 1.2 Japanese closing couplet

- Status: implemented on local website `dev`. **Not pushed or deployed.** Article dates and sitemap `lastmod` are not production evidence.
- Source: Atrium `docs/marketing/Content/History series/Ep 1.2/Mesopotamia - What the First Written Records Tell Us About Beer.ja.md` (`a680e0c`, “recast the Japanese Ep 1.2 closing couplet”). Atrium markdown was not edited from this repo.
- Scope: Japanese `/ja/science/mesopotamia-beer-written-records.html` only. Other seven editions unchanged.
- Change: replace the closing calque on beer “eluding” us with a native contrast on what remains unknown versus the culture around the drink.
- Metadata: keep existing `datePublished`. `dateModified` and sitemap `lastmod` may move to 2026-09-14 for this copy change.
- Publication remains a separate step.

## CONTENT-20260914-04 — Episode 1.2 continuous-essay rewrite (eight languages)

- Status: implemented on local website `dev`. **Not pushed or deployed.** Article dates and sitemap `lastmod` are not production evidence.
- Source: Atrium `docs/marketing/Content/History series/Ep 1.2/` (`308ab1f` align translations with French essay; `9e6cf75` native-essay polish; `cc8158f` etages/calques wording; French Roth/claim calibrations already in tree). Atrium markdown was not edited from this repo.
- Scope: all eight `/…/science/mesopotamia-beer-written-records.html` editions. Hub card titles update from the approved article titles; descriptions stay the interface strings in the Episode 1.2 config.
- Structure: one-paragraph standfirst; essay continuum after the ziggurat; three body sections without `###` subsections; no source-comparison table; shared five-figure set including `straw-drinking-seal` and `hammurabi-stele`.
- Metadata: keep existing `datePublished`. `dateModified` and sitemap `lastmod` may move to 2026-09-14 for this significant copy change.
- Publication remains a separate step.

## CONTENT-20260914-03 — Episode 1.1 continuous-essay rewrite (eight languages)

- Status: implemented on local website `dev`. **Not pushed or deployed.** Article dates and sitemap `lastmod` are not production evidence.
- Source: Atrium `docs/marketing/Content/History series/Ep 1.1/` (`504402b` English tighten; `10922be` localized native essays). Atrium markdown was not edited from this repo.
- Scope: all eight `/…/science/who-invented-alcohol.html` editions. Hub card titles/descriptions unchanged unless the sync detects a title change.
- Structure: five `##` sections including references; no body `###` subsections; argument-map diagrams removed; same four credited figures, placed by first-mention anchors.
- Metadata: keep existing `datePublished`. `dateModified` and sitemap `lastmod` may move to 2026-09-14 for this significant copy change.
- Publication remains a separate step.

## CONTENT-20260914-02 — Episode 1.2 French continuous-essay rewrite

- Status: implemented on local website `dev`, then shipped to production on 2026-09-14 (`7940ccf` on `main`). Article dates and sitemap `lastmod` are not production evidence.
- Source: Atrium `docs/marketing/Content/History series/Ep 1.2/Mesopotamia - What the First Written Records Tell Us About Beer.fr.md` (`9cdf5d2`, “rewrite Ep 1.2 French article as a continuous essay”). The Atrium French markdown was not edited from this repo.
- Scope: French `/fr/science/mesopotamia-beer-written-records.html` only. English and the six other editions are unchanged.
- Structure: one-paragraph standfirst; essay continuum after the ziggurat; three body sections without `###` subsections; no source-comparison table. Title, images, hub card description and Episode 1.1 next-link title are unchanged.
- Metadata: keep French `datePublished` 2026-09-13. `dateModified` and sitemap `lastmod` may move to 2026-09-14 for this significant copy change.
- Publication remains a separate step.

## RELEASE-20260914-PROD-FR — Verified French Episode 1.2 standfirst production deployment

Recorded 2026-09-14 after live verification. This ships CONTENT-20260914-01 only; the other seven Episode 1.2 editions are unchanged.

| Field | Record |
|---|---|
| Production revision | `96ab7e08805f75e74f5f4e3212185c2c9fa9f50d` — Import the adapted French Episode 1.2 standfirst |
| Also included | `b08aa4e` — Record verified French Episode 1.2 production deployment (documentation only; not a public page change) |
| Previous live revision | `e5c7832` at 2026-09-13 17:25:32 +02:00 |
| Production time | 2026-09-14 08:22:54 +02:00 (deploy job completed 2026-09-14T06:22:59Z; live `Last-Modified` 06:22:54 GMT) |
| Workflow | [Deploy website to GitHub Pages](https://github.com/philip93758/websitemindrink/actions/runs/34813187284), push to `main`. Build and deploy succeeded. |
| Host | `https://mindrink.me` |
| Live `Last-Modified` | Mon, 14 Sep 2026 06:22:54 GMT |
| Action IDs in this release | CONTENT-20260914-01 |
| Live verification | French Episode 1.2 200 with the two-paragraph standfirst; writing-history passage in the first section; old four-paragraph lead absent. English Episode 1.2 200 still using the deck, Puabi seal and Rama inscription. French `datePublished` remains 2026-09-13 (`article:published_time` `2026-09-13T00:00:00+02:00`); `dateModified` is 2026-09-14. |
| Not claimed | Search ranking, crawl processing, or traffic effect. Sitemap `lastmod` is not this deployment timestamp. |
| Not done in this closeout | Google Search Console URL Inspection or sitemap resubmission |

## CONTENT-20260914-01 — Episode 1.2 French standfirst adaptation

- Status: implemented on local website `dev`, then shipped in [RELEASE-20260914-PROD-FR](#release-20260914-prod-fr--verified-french-episode-12-standfirst-production-deployment). Article dates and sitemap `lastmod` remain separate from the verified production time.
- Source: Atrium `docs/marketing/Content/History series/Ep 1.2/Mesopotamia - What the First Written Records Tell Us About Beer.fr.md` (uncommitted 14 September adaptation). The Atrium French markdown was not edited from this repo.
- Scope: French `/fr/science/mesopotamia-beer-written-records.html` only. English and the six other editions are unchanged.
- Copy: the standfirst is now two paragraphs. The proto-cuneiform / earliest-accounts passage moves into the first section, after Agu’a and before “Neuf sortes de bière”. Title, images, captions, hub card and Episode 1.1 next-link are unchanged.
- Metadata: keep French `datePublished` 2026-09-13. `dateModified` and sitemap `lastmod` may move to 2026-09-14 for this significant copy change.
- Production (2026-09-14): shipped in [RELEASE-20260914-PROD-FR](#release-20260914-prod-fr--verified-french-episode-12-standfirst-production-deployment). Do not treat sitemap `lastmod` or article dates as the live publication time. No search-traffic or ranking effect is claimed.

## RELEASE-20260913-PROD — Verified production deployment

Recorded 2026-09-13 after live verification. This is the production evidence for the September website batch. Commit dates, article `datePublished`/`dateModified`, and sitemap `lastmod` remain separate and do not replace this timestamp.

| Field | Record |
|---|---|
| Production revision | `2e32be5d6e6a5875ec04a283470c440572736a7a` — Align Episode 1.2 metadata with planned September 13 release |
| Previous live revision | `cb7ad1f` (GitHub Pages deploy 2026-09-01) |
| Production time | 2026-09-13 12:25:03 +02:00 (deploy job completed 2026-09-13T10:25:03Z) |
| Workflow | [Deploy website to GitHub Pages #21](https://github.com/philip93758/websitemindrink/actions/runs/34751766880), `workflow_dispatch` on `main`. Build and deploy succeeded. Same-commit push run [#20](https://github.com/philip93758/websitemindrink/actions/runs/34749295825) stayed queued and never published. |
| Host | `https://mindrink.me` |
| Live `Last-Modified` | Sun, 13 Sep 2026 10:24:58 GMT |
| Action IDs in this release | CONTENT-20260912-01; RELEASE-20260912-SEO-UX (SEO-20260912-01, SEO-20260912-02, SEO-20260912-03, UX-20260912-01, SEO-20260912-04); SEO-20260912-05; SEO-20260912-06; CONTENT-20260912-02; QA-20260913-01; RELEASE-20260913-01 |
| Live verification | All eight Episode 1.2 URLs 200; Science hub Episode 1.2 card present; sitemap lists the eight Mesopotamia URLs with alternates; opening WebP 200; homepage and calculator 200; EN article inspected in-browser. Live Episode 1.2 `datePublished`/`dateModified` is 2026-09-13 (`article:published_time`/`article:modified_time` `2026-09-13T00:00:00+02:00`). |
| Not claimed | Search ranking, crawl processing, or traffic effect. Sitemap `lastmod` is not this deployment timestamp. |
| Not done in this closeout | Google Search Console URL Inspection or sitemap resubmission; Atrium PostHog adapter allowlist for `app_cta_viewed` and `app_store_clicked`; post-release GSC comparison windows |

## RELEASE-20260913-PROD-FR — Verified French Episode 1.2 production deployment

Recorded 2026-09-13 after live verification. This is a second production deploy the same day as [RELEASE-20260913-PROD](#release-20260913-prod--verified-production-deployment). It ships CONTENT-20260913-01 only; the other seven Episode 1.2 editions are unchanged.

| Field | Record |
|---|---|
| Production revision | `e5c78325b1280dfc9973afde3f4bb305115d3012` — Import the approved French Episode 1.2 text and replacement images |
| Also included | `080a846` — Record verified 13 September production deployment in the SEO action log (documentation only; not a public page change) |
| Previous live revision | `2e32be5` at 2026-09-13 12:25:03 +02:00 |
| Production time | 2026-09-13 17:25:32 +02:00 (deploy job completed 2026-09-13T15:25:28Z; live `Last-Modified` 15:25:32 GMT) |
| Workflow | [Deploy website to GitHub Pages](https://github.com/philip93758/websitemindrink/actions/runs/34765531501), push to `main`. Build and deploy succeeded. |
| Host | `https://mindrink.me` |
| Live `Last-Modified` | Sun, 13 Sep 2026 15:25:32 GMT |
| Action IDs in this release | CONTENT-20260913-01 |
| Live verification | French Episode 1.2 200 with standfirst, straw-drinking seal and Hammurabi stele; both new WebPs 200; French Science hub 200; English Episode 1.2 200 still using the Puabi seal and Rama inscription close-up. French `datePublished` remains 2026-09-13 (`article:published_time` `2026-09-13T00:00:00+02:00`). |
| Not claimed | Search ranking, crawl processing, or traffic effect. Sitemap `lastmod` is not this deployment timestamp. |
| Not done in this closeout | Google Search Console URL Inspection or sitemap resubmission |

## CONTENT-20260913-01 — Episode 1.2 French revision

- Status: implemented on local website `dev`, then shipped in [RELEASE-20260913-PROD-FR](#release-20260913-prod-fr--verified-french-episode-12-production-deployment). Article dates and sitemap `lastmod` remain separate from the verified production time.
- Source: Atrium `docs/marketing/Content/History series/Ep 1.2/Mesopotamia - What the First Written Records Tell Us About Beer.fr.md` and `IMAGE_SELECTION.md` (“French revision, 13 September 2026”). The Atrium French markdown was not edited from this repo.
- Scope: French `/fr/science/mesopotamia-beer-written-records.html` only. English and the six other editions keep their published prose and the original Puabi-seal / Hammurabi-inscription figures.
- Structure: French standfirst (`###` heading plus four paragraphs) now sits under the title; the ziggurat photograph follows that standfirst. Extra `###` subsections are preserved. Hub card title/description and Episode 1.1 next-link title are unchanged.
- Images: French figures 4–5 become the Met straw-drinking seal (`met-324572-straw-seal`) and Mbzt Hammurabi stele (`hammurabi-stele-mbzt`). Original JPEGs are stored byte-for-byte; WebP variants are proportional quality-84 resizes. The replaced photographs remain in the asset folder for the other seven languages. [Provenance](../assets/science/history/episode-1-2/README.md).
- Metadata: keep French `datePublished` 2026-09-13 and `+02:00` social timestamps. `dateModified` may stay 2026-09-13 when the revision lands on that calendar date.
- Production (2026-09-13): shipped in [RELEASE-20260913-PROD-FR](#release-20260913-prod-fr--verified-french-episode-12-production-deployment). Do not treat sitemap `lastmod` or article dates as the live publication time. No search-traffic or ranking effect is claimed.

## RELEASE-20260913-01 — Episode 1.2 release-date preparation

- User-approved intended release date: 2026-09-13. Set Episode 1.2 publication/modification metadata to that date in all eight languages; social timestamps explicitly use the local +02:00 offset. Earlier episodes and articles retain their original publication dates.
- The importer preserves explicitly set matching-date social timestamps on no-op imports. This is release preparation, not evidence of a live publication. Dev push/CI is requested; main deployment is not authorized in this step. Record the actual deployment separately and revisit the date if release slips.
- Production (2026-09-13): shipped in [RELEASE-20260913-PROD](#release-20260913-prod--verified-production-deployment). Live Episode 1.2 publication/modification metadata matches the prepared 2026-09-13 values. The verified first-publication time is the Pages deploy above, not this metadata-prep commit.

## QA-20260913-01 — Pre-release corrections on dev

- Scope: fix Q01/Q02/R01/R02/R03/N01 from the local release audits. Implemented on local `dev` after `a002bb5`; recorded in the commit adding this entry, not pushed or deployed by this task. The older QA entries below describe the state at the time they were written, not the current corrected candidate.
- Calculator: preserve raw editor input/caret during each keystroke; synchronize fields explicitly for presets. Decimal ABV is no longer overwritten while typing. Reject fractional quantities instead of silently truncating them. All eight locale entry points use the refreshed calculator script version; no calculation formulas, national unit definitions, privacy behavior or CTA destinations changed.
- History figures/citations: both episodes in all eight languages carry their original image aspect ratio into definite responsive widths, preserving mobile height caps and lazy loading while reserving layout space. Shared citation offsets account for the fixed header. Both importers and the Episode 1.2 style-version config retain the correction; no prose, captions, credits, image files or publication dates changed.
- Modification metadata: corrected the 24 methodology/comparison/unit-blog Article/BlogPosting `dateModified` values to 2026-09-13, the metadata-repair date; matching blog `article:modified_time` uses the same local date with an explicit offset. Preserve every original `datePublished`. Sitemap dates remain governed by the separate significant-change updater.
- FAQs: synchronized schema to existing visible FAQs on English binge-drinking, dry-day, private-alcohol-tracking, reduce-drinking and what-to-look-for-in-alcohol-tracker pages, plus Italian FAQ wording. No visible questions/answers were added or restored, and no rich-result benefit is claimed.
- Navigation/layout: seven translated homepage logos now retain their language prefix. Long source URL spans wrap on all methodology pages; intentionally scrollable tables are unchanged. Stylesheet cache keys refreshed on affected pages.
- Regression coverage: 25 additional default tests protect the fixes. Optional `npm run test:browser` exercises actual typing and delayed/cold image layout in all eight languages and both episodes; its runner stays under `tools/`, outside the public deployment inventory. The existing content/structure baseline still applies, with only stylesheet cache tokens and independently tested modification timestamps normalized.
- Verified locally: 178 default tests, 88 durable browser checks and the earlier 90-check interactive journey suite pass. Both source importers pass read-only checks; build, analytics-loader and sitemap validation pass. The refreshed 208-page SEO/link audit has no errors or FAQ mismatch warnings; all 5,061 internal links and 972 fragments resolve. The seven logo-click browser tests retain locale. Only the pre-existing optional methodology Article-image recommendation remains in that schema scan. EN desktop and FR mobile article screenshots inspected; no cropping, stretching or overflow observed.
- Publication remains a separate step: confirm Episode 1.2's real first-publication date and validate the live deployment after release. No production analytics, GSC requests or deployment actions performed here.
- Production (2026-09-13): shipped in [RELEASE-20260913-PROD](#release-20260913-prod--verified-production-deployment). Live checks covered all eight Episode 1.2 editions, the Science hub card, sitemap entries and the opening image. Calculator typing and cold-load citation jumps were not re-tested on production in this closeout.

## CONTENT-20260912-02 — History Episode 1.2

- Status: implemented on local website `dev`, based on `a9be5c1`; implementation is recorded in the commit adding this entry. **Not pushed or deployed by this task**. Article source dates and sitemap dates do not establish a production release. Production evidence was added later under [RELEASE-20260913-PROD](#release-20260913-prod--verified-production-deployment).
- Approved source: Atrium `docs/marketing/Content/History series/Ep 1.2/`, eight language editions of *Mesopotamia: What the First Written Records Tell Us About Beer*, including the 2026-09-12 illustration selection. Latest source-content revision at intake: `5f7f160` (prose polish across eight languages).
- New URLs: `science/mesopotamia-beer-written-records.html` under each of the eight language prefixes above. Existing URLs updated: each localized `science/` hub and `science/who-invented-alcohol.html`.
- Content: preserve the approved article prose, five captioned/credited images, all 11 numbered references and four-row source comparison. Same section roles and interface coverage in every language. The opening photograph precedes the introduction; the comparison is a semantic table that stacks with localized labels on phones. No new claims, medical advice, calculator CTA or unpublished next-episode teaser.
- Navigation: second episode card in the hub's existing history series, below the prominent methodology section; matching CollectionPage data. Episode 1.1's outdated planned “Episode 2” title becomes a linked, accurately numbered Episode 1.2 teaser. The new article links back to Episode 1.1 and the same-language Science hub; language selectors retain the article route.
- Search implementation: canonical, reciprocal eight-language plus x-default alternates, Article/BreadcrumbList data, descriptions/social metadata, eight new sitemap entries and scoped lastmod updates (208 URLs total). Refresh the style-cache version on the 24 affected Science pages; do not reset unrelated page dates.
- Media: preserve five original JPEGs and attribution/rights records; serve proportional, bounded WebP variants through srcset/sizes. No extra crops, retouching, artifact labels or upscaling. Do not assign one blanket licence to the selection.
- Reproducibility: dedicated Episode 1.2 importer with read-only `--check`, validation before writes and no-op date preservation; Episode 1.1 importer retains the approved next-page link/title. [Workflow](AI_CONTEXT.md#episode-12--mesopotamia), [image provenance](../assets/science/history/episode-1-2/README.md).
- Local verification: build, 208-page analytics-loader and sitemap checks; 153 regression tests passed after updating the old 200-page inventory expectation. Browser checks compared every approved source paragraph/caption/credit/table cell and image alt in all eight languages, exercised 40 layouts (320/375/390/768/1280 px) and eight hub → Episode 1.2 → previous → next journeys. No missing local resources, unresolved citations, horizontal page overflow or browser errors. EN desktop and FR/JA mobile visuals reviewed. Local artifacts are gitignored in `docs/Ai/reviews/episode-1-2-2026-09-12/`.
- Release follow-up: record the actual deployment revision/time and verify all eight live editions, sitemap and image loads before treating this as published. No search-traffic or ranking effect is claimed.
- Production (2026-09-13): shipped in [RELEASE-20260913-PROD](#release-20260913-prod--verified-production-deployment). All eight live editions, sitemap entries and the opening image were verified. Treat this as first publication of Episode 1.2. No search-traffic or ranking effect is claimed.
- QA follow-up (2026-09-13): committing this implementation is not release sign-off. Fresh browser QA found decimal ABV typing corruption in all eight calculators (also reproduced on main) and cold-load mobile citation jumps missing Episode 1.2 references as lazy images acquire layout space. The earlier stale article modification metadata, FAQ schema/content mismatches and methodology source-URL overflow also remain open. No fixes for these findings are included in this content commit. Build and 153 regression tests pass, but do not cover these browser failures. Local evidence: `docs/Ai/reviews/qa-round-2026-09-12/report.md` (gitignored). Those QA items were later corrected in `01f98b2` (QA-20260913-01) and shipped in the same production release. First-publication date is recorded in [RELEASE-20260913-PROD](#release-20260913-prod--verified-production-deployment).

## Historical register — backfilled 2026-09-12

Dates below are source-record or commit dates, not verified production timestamps. See the [private historical analysis](../../mindrink-atrium/reports/gsc/2026-09-12/seo-history-review-2026-09-12.md) for comparison windows, metrics and limitations.

| ID | Recorded date and source | Scope and action | Production evidence / evaluation |
|---|---|---|---|
| SEO-20260528-01 | 2026-05-28 archived closeout; external setting, no implementation commit | Canonical host and sitemap: owner enabled GitHub Pages Enforce HTTPS and resubmitted the HTTPS sitemap. | Closeout records live redirects and a 200 HTTPS sitemap; exact switch time unknown. Operational correction verified in that record; traffic attribution unresolved. |
| SEO-20260528-02 | 2026-05-28 archived closeout; source commit `7218d0b` dated 2026-05-29 | German/French comparisons: tracking/selection-oriented titles, H1s, introductions and internal links, plus the then-approved locale-specific sections. | The closeout and commit have different dates; neither establishes rollout. Historical analysis finds modest sustained French exposure/click gains and broadly steady German clicks, not proven causality. Later common-structure rule supersedes further locale-only expansion. |
| SEO-20260823-01 | 2026-08-23, `0425c16` and `781cda7` | Calculator intent/metadata and relevant unit-page links. ES/PT/DE snippet alignment; English multi-convention positioning and localized copy/link refinements. Exact path lists and before/after text are in the two diffs. | Rollout timestamp unverified. Early follow-up is mixed/provisional; intentional content cuts must not be restored or treated as a defect. |
| SEO-20260823-02 | 2026-08-23, `1a4e620` | Eight homepages: remove incomplete SoftwareApplication structured data. | Rollout unverified; technical correction, no isolated search-lift claim. |
| SEO-20260823-03 | 2026-08-23, `f118276` | Responsive homepage hero images and associated assets. | Rollout unverified; performance-related confounder for overlapping content comparisons, not a measured ranking win. |
| SEO-20260825-01 | 2026-08-25, `15b4ff7` | Per-page sitemap modification-date generation and verification. | Rollout unverified. Content modification dates are not production or crawl dates. |
| UX-20260829-01 | 2026-08-29, `a78eec6` (merge `881aa98`) | Privacy-minimized website PostHog instrumentation and privacy explanations across locales. | Exact deployment time unverified. A measurement change, not evidence of increased traffic; subsequent metric definitions must be compared consistently. |
| CONTENT-20260829-01 | 2026-08-29–30, `8b7c8d5`, `24a5e5a`, `242e508`, `4560cbd` | Science hub/history episode creation, localization, content and argument-map revisions. | Rollout times unverified. Record as concurrent content/discovery changes; do not attribute all whole-site movement to calculators. |
| DECISION-20260831-01 | 2026-08-31 recorded owner decision | Reject direct-store calculator/answer-page conversion redesign; retain the Explore Mindrink educational journey. | Not implemented. This decision is not a deployed SEO action. |
| UX-20260901-01 | 2026-09-01, `cb7ad1f` | Navigation/translation fixes: German, Spanish and Italian answer-page breadcrumbs; Japanese homepage and English FAQ links. | Rollout timestamp unverified. Exact affected pages are in the commit diff. |
| CONTENT-20260912-01 | 2026-09-12, `0fecb5c` | Revised history episode synchronized across all eight languages. Pre-existing local commit before the SEO/UX implementation below. | Shipped with [RELEASE-20260913-PROD](#release-20260913-prod--verified-production-deployment) as a concurrent change alongside `c23908f`. Implementation date is not the production date. |

Historical source records:

- [Canonical-host closeout in Atrium](../../mindrink-atrium/docs/atrium/archive/mindrink-website/seo-canonical-host-sitemap-2026-05-28/closeout.md).
- [German/French comparison closeout in Atrium](../../mindrink-atrium/docs/atrium/archive/mindrink-website/seo-de-fr-comparison-pages-content-2026-05-28/final-synthesis.md).
- [Calculator ticket batch in Atrium](../../mindrink-atrium/docs/atrium/active/website-calculator-seo-2026-08-23/).
- [Shared multilingual UX decision](../../mindrink-atrium/docs/marketing/website-multilingual-ux-contract-2026-09-12.md).

## 2026-09-12 implementation batch

### Release envelope — RELEASE-20260912-SEO-UX

| Field | Record |
|---|---|
| Implementation | `c23908fecda4ac4ca97f385bdcebc739ec34af5f` — Improve multilingual SEO copy, calculator clarity and CTA measurement |
| Commit timestamp | 2026-09-12T18:59:14+02:00; source implementation time only |
| Before revision | `0fecb5c`; the preceding history-episode change is preserved |
| Branch/status at recording | Website `dev`; implemented and locally verified; not pushed or deployed by this task |
| Actual production revision/time | `2e32be5` at 2026-09-13 12:25:03 +02:00 — see [RELEASE-20260913-PROD](#release-20260913-prod--verified-production-deployment). Do not start a post-release GSC window from the 2026-09-12 commit date. Exclude the partial 2026-09-13 release day. |
| Deployment evidence | Pages run [#21](https://github.com/philip93758/websitemindrink/actions/runs/34751766880) succeeded; live `mindrink.me` verified 2026-09-13. This batch shipped with later September actions listed in that release record, not as `c23908f` alone. |
| Crawl observations after release | Not yet recorded; URL Inspection crawl times are still unknown. |
| Outcome | Not yet measurable; no production effect claimed |
| Verification | 73 tests, build, 200-page analytics-loader check and 200-URL sitemap check passed; 32 responsive layout checks across eight languages |
| Detailed local closeout | [Implementation closeout](Ai/active/seo-ux-2026-09-12/closeout.md), gitignored |

#### SEO-20260912-01 — Portuguese calculator description

- URL: `/pt/alcohol-unit-calculator/`.
- Existing slots changed: meta description and Open Graph description. Title and H1 preserved.
- Hypothesis: retain the existing volume/strength-to-result promise but make comparison more concrete with beer/wine examples. The previous description already explained the task; this is a candidate refinement, not a repair of an absent promise. Low observed click capture supports investigation, but incomplete detailed query/market data does not prove the snippet is the cause.
- After: “Calcule os gramas de álcool puro e as unidades de cada bebida a partir do volume e do teor alcoólico. Compare as medidas com exemplos de cerveja e vinho.”
- Before: “Indique o volume e o teor alcoólico para calcular unidades e gramas de álcool puro — não a alcoolemia — e comparar referências do Reino Unido e dos EUA.”
- Measurement: exact-page clicks, impressions and CTR, with position and available query/device/country context. Record an actually observed Google result separately; the meta description is only a candidate, not guaranteed displayed text.
- Confounding: shared calculator content and UX in SEO-20260912-03 changed in the same commit. This is not a description-only experiment if shipped together.

#### SEO-20260912-02 — Spanish calculator UBE-first search promise

- URL: `/es/alcohol-unit-calculator/`.
- Title before: “Calculadora de gramos de alcohol y UBE | Mindrink”.
- Title after: “Calculadora de UBE y gramos de alcohol | Mindrink”.
- H1 before: “Calculadora de gramos de alcohol y unidades”.
- H1 after: “Calculadora de UBE y gramos de alcohol”. Open Graph title aligned; meta description preserved.
- Hypothesis: give the visible UBE calculation-query cluster clearer priority while keeping grams and convention limits explicit. Named-query observations are a suppressed subset, not a complete demand estimate.
- Measurement: page-level performance and available UBE versus grams query groups; do not assign anonymous page clicks to a named keyword or confuse blended page position with that keyword's rank.

#### SEO-20260912-03 — Shared calculator clarity and on-page wording

- URLs: all eight calculator pages.
- Existing slots refined equivalently: introduction, alcohol-strength label, explicit 10 g reference, add-this-drink wording, and explanatory unit definition. Add a matching empty-total status within the existing controls in every locale; correct hidden-total display behavior.
- English existing FAQ: clarify one-drink UK-unit/gram formulas and quantity handling; synchronize the corresponding structured answers. No new English-only FAQ or explanation added.
- Unchanged: formulas, input fields, main sections/order, canonical/hreflang, current FAQ counts and Italian/Japanese titles. Existing locale structural drift is preserved and documented, not expanded or approved as a future pattern.
- Hypothesis: users can understand inputs and results without mistaking a reference convention for a universal standard. This is a shared usability improvement, not a keyword-specific ranking test.
- Measurement: calculator-start/completion and CTA-exposure counts using the documented event definitions; repeated result events are not unique people. GSC separately measures page acquisition.

#### UX-20260912-01 — Existing app journey and measurement

- URLs: CTA bridge text on all eight calculators; privacy explanation on all eight privacy pages; instrumentation on existing homepage/comparison store buttons.
- Content: distinguish calculating a drink from recording patterns over time. Same Explore Mindrink CTA position, role and same-language homepage destination; no direct-store calculator CTA.
- Added `app_cta_viewed`: once per page load when at least half the existing calculator CTA button intersects the viewport in an active document. Exposure is not attention.
- Added `app_store_clicked`: exact existing Mindrink Apple/Google store destinations only, with allowlisted store, placement and page-family categories. A click is not an install.
- Privacy constraints unchanged: no drink values, full destination URLs, persistent identity, replay, autocapture or cross-page person tracking; honor existing GPC/DNT/opt-out vetoes.
- All 200 pages have an analytics-loader version change. Only eight calculators, eight comparisons and eight privacy pages have substantive page-copy changes in this batch; loader-only changes do not reset all sitemap dates.
- Measurement dependency: after deployment, the Atrium reporting adapter must recognize both new events and distinguish their introduction date. Earlier missing events are **unmeasured**, not zero conversions. This website implementation did not modify that adapter.
- Verification after release still needed: first live event payloads, privacy vetoes and event availability in reporting. No production events were sent during local verification. Production HTML/instrumentation shipped in [RELEASE-20260913-PROD](#release-20260913-prod--verified-production-deployment); live payload and Atrium adapter checks remain outstanding.
- Contract: [Analytics documentation](ANALYTICS.md).

#### SEO-20260912-04 — Multilingual comparison credibility

- URLs: all eight `blog/best-alcohol-tracking-apps.html` pages.
- Existing slots: app descriptions, pros/considerations, fit descriptions, selection questions and article-purpose/publisher disclosure.
- Correct Try Dry's year-round use, DrinkControl statistics and backup/sync distinction, and Reframe's logging/program scope. Clarify Mindrink local drink-record privacy and backup limitations; remove unsupported competitor tradeoffs.
- Add corresponding official source links and publisher disclosure within existing slots; keep the four-app order and existing CTA journey. No new comparison table, section, or language-only depth.
- Titles preserved, including the working French and Japanese app-selection intent. Local source revision is the exact before/after archive.
- Hypothesis: visitors can make a more informed choice and recognize the publisher's interest. Search benefit remains unproven; assess each comparison page and existing store clicks separately.
- Official source verification and responsive checks are recorded in the local closeout. Vendor facts may change; later corrections need their own dated entry.

### Evidence linked to this batch

- [Longer SEO history](../../mindrink-atrium/reports/gsc/2026-09-12/seo-history-review-2026-09-12.md): final returned daily history through 2026-09-10; includes older data-anomaly and deployment-date caveats.
- [Earlier same-day page/query refinement](../../mindrink-atrium/reports/gsc/2026-09-12/seo-live-refinement-2026-09-12.md): explicitly uses 2026-08-13–2026-09-09 versus 2026-07-16–2026-08-12. Do not relabel its figures as the later rolling window.
- [PostHog observations](../../mindrink-atrium/reports/local-analytics-pull/posthog-browser-2026-09-12/findings.md): pre-release evidence with low counts and possible QA influence; not cross-page visitor or organic-search attribution.
- Raw exports remain in Atrium's ignored inputs; these private links may be unavailable in a website-only clone. Use the report on disk, not an invented or reconstructed baseline.

### Follow-up protocol — manual, not a scheduled task

1. Record the actual production revision/time and all action IDs included in that release. If a release contains intervening changes, list them rather than assuming it exactly equals `c23908f`. Done for this batch in [RELEASE-20260913-PROD](#release-20260913-prod--verified-production-deployment).
2. Verify representative live versions for every changed language/page family. Record later URL Inspection observations with query time and returned crawl time; latest crawl alone does not identify the first processing of new copy.
3. Freeze an appropriate pre-release baseline from complete finalized GSC days, using source-native date conventions. Start a post-release comparison only after the actual release, exclude its partial day, and clearly distinguish any optional post-crawl window.
4. Prefer equal, non-overlapping 28-day windows with matching weekday coverage. At low volume, extend to 56 days if needed; an early 7/14-day check is directional, not a winner declaration or universal waiting rule.
5. Compare exact pages first, then explicitly defined URL families. Report clicks and impressions alongside CTR; compare available query groups, devices/countries and impression-weighted position without treating suppressed rows as zero. Record coverage and concurrent site/search changes.
6. Evaluate PostHog separately with stable definitions. New-event introduction, consent/privacy vetoes, QA traffic and changing instrumentation affect counts. GSC clicks do not identify which PostHog observations came from organic search; store clicks do not establish installs.
7. Append the analysis date, actual coverage windows, private report link, conclusion/confidence, and decision: retain, revise, revert, or insufficient evidence. Bundle-level observations must not be advertised as a causal effect of one sentence.

## 2026-09-12 follow-up — SEO-20260912-05

### French, Japanese and Indonesian calculator descriptions

| Field | Record |
|---|---|
| Approval | Owner approved the proposed additional language improvements and a local `dev` commit on 2026-09-12 |
| Status | Implemented and locally verified at recording; later shipped in [RELEASE-20260913-PROD](#release-20260913-prod--verified-production-deployment) |
| Implementation revision | The commit containing this entry and the unique trailer `SEO-Action: SEO-20260912-05`; parent `c23908f`. Resolve its hash and source timestamp with `git log -1 --format="%H %cI" --fixed-strings --grep="SEO-Action: SEO-20260912-05"` |
| Changed URLs | `/fr/alcohol-unit-calculator/`, `/ja/alcohol-unit-calculator/`, `/id/alcohol-unit-calculator/` |
| Changed slots | Exactly one meta description and matching Open Graph description per page |
| Shared promise | Enter a drink's volume and alcohol strength, calculate pure alcohol grams, and compare named unit conventions |
| Preserved | Entire remainder of each HTML page, including title/H1, visible content, examples, FAQs, formulas, controls, links, canonical/hreflang and CTA journey. No other language or comparison page rewritten |
| Production revision/time and crawl evidence | Production: `2e32be5` / 2026-09-13 12:25:03 +02:00 in [RELEASE-20260913-PROD](#release-20260913-prod--verified-production-deployment). Crawl evidence not yet recorded; implementation date is not a recrawl date. |
| Evaluation | Pending post-release evidence; no traffic gain claimed |

Exact wording applied to both description tags:

| Language | Before | After |
|---|---|---|
| French | Calculez les unités standard, unités UK, verres standard US, grammes d'alcool pur, calories et totaux hebdomadaires facultatifs. | Saisissez le volume et le degré d’alcool d’une boisson pour calculer les grammes d’alcool pur et comparer les unités de 10 g, britanniques et américaines. |
| Japanese | 標準単位、UK単位、米国標準ドリンク、純アルコール量、カロリー、任意の週合計を計算します。 | お酒の量とアルコール度数から純アルコール量（g）を計算。10g単位、英国のアルコール単位、米国の標準ドリンクにも換算できます。 |
| Indonesian | Hitung unit standar, unit UK, minuman standar AS, gram alkohol murni, kalori, dan total mingguan sukarela. | Masukkan volume dan kadar alkohol minuman untuk menghitung gram alkohol murni, lalu bandingkan unit 10 g, unit Inggris, dan minuman standar AS. |

Reason and limits:

- Replace a list of outputs with a straightforward description of the task; remove the awkward Indonesian “voluntary weekly total” wording. This is an editorial relevance hypothesis, not a data-proven high-volume keyword opportunity.
- Preserve the Italian calculator and French/Japanese comparison titles; defer the German grams-focused title idea. This approval does not implement those deferred ideas or authorize page consolidation.
- Google can select other visible content for the snippet. Open Graph consistency is social metadata hygiene, not a guarantee about the Google result. See [Google's snippet guidance](https://developers.google.com/search/docs/appearance/snippet).
- Source proposal: [dated language review](Ai/active/seo-ux-2026-09-12/remaining-language-review.md), gitignored. Existing private GSC evidence is linked above; no new analytics extraction was performed for this implementation.

Verification on 2026-09-12:

- 76 tests passed, including three new checks for exact approved meta/OG descriptions and the existing eight-language title, structure and routing checks.
- Build passed with analytics disabled; verified the loader on 200 HTML pages and the sitemap on 200 URLs. No production analytics events were sent.
- Per-page comparison against `c23908f` confirms no differences after excluding the two description tags. No layout change requires a new responsive baseline.
- Sitemap updater reported all values current: these pages already had the 2026-09-12 content date from the earlier batch. No sitemap URLs or dates were rewritten for this follow-up.
- This commit also establishes the sanitized historical action log and its discoverability/maintenance rule in `docs/AI_CONTEXT.md`. Private reports remain untracked.

Follow-up: SEO-20260912-05 shipped with RELEASE-20260912-SEO-UX in [RELEASE-20260913-PROD](#release-20260913-prod--verified-production-deployment). The three pages also received the shared earlier content/UX changes, so their outcomes cannot isolate these descriptions. Apply the manual comparison protocol above and append a dated result linked to the actual release and private analysis. No recurring monitoring was created here.

## 2026-09-12 follow-up — SEO-20260912-06

### Alcohol-unit accuracy and contextual calculator-link parity

| Field | Record |
|---|---|
| Approval | Owner approved the bounded accuracy/internal-link pass, website `dev` implementation, change-log update and local commit |
| Status | Implemented and locally verified at recording; later shipped in [RELEASE-20260913-PROD](#release-20260913-prod--verified-production-deployment) |
| Implementation revision | Commit containing the unique trailer `SEO-Action: SEO-20260912-06`, based on `d6bb958`. Resolve its hash/time with `git log -1 --format="%H %cI" --fixed-strings --grep="SEO-Action: SEO-20260912-06"` |
| Exact affected page families | `methodology.html`, `alcohol-units.html`, `blog/what-counts-as-a-drink-alcohol-units.html`, under each of the eight prefixes defined above: 24 pages |
| Preserved | All titles/descriptions, headings, sections, table/list structure, existing link destinations, calculator code/controls, and app CTA journeys. No new FAQ questions or language-only sections |
| Production revision/time and crawl evidence | Production: `2e32be5` / 2026-09-13 12:25:03 +02:00 in [RELEASE-20260913-PROD](#release-20260913-prod--verified-production-deployment). Crawl evidence not yet recorded. |
| Search outcome | Not measured; this is a content-correctness and navigation improvement, not a demonstrated ranking lift |

Accuracy changes within existing slots:

- All eight methodology pages and eight unit guides now explicitly divide the percentage by 100. English equivalent: `Units of 10 g = (Volume in ml × (ABV (%) ÷ 100) × 0.789) ÷ 10`. The preceding existing sentence explains to use `5` for `5%`; equivalent wording appears in every language.
- The French methodology example changes `(150 × 12 × 0,789) ÷ 10 ≈ 1,4` to `(150 × (12 ÷ 100) × 0,789) ÷ 10 ≈ 1,4`. The displayed intended result was already correct; the written calculation lacked the percentage conversion.
- The French guide's 175 ml / 12% wine comparison now states approximately **1.2 US standard drinks**, rather than 1. It clarifies that a different unit definition changes the reported count, not the alcohol content of an otherwise identical drink.
- Opening unit definitions identify 10 g as Mindrink's comparison reference, rather than a universal national definition. The methodology's adjacent paragraph uses the verified Australian 10 g example without broad claims of universal research adoption.
- Unit-explainer country/FAQ wording distinguishes UK units of 10 ml pure alcohol (approximately 8 g) from US standard drinks of 14 g. The English grams-divided-by-8 table is explicitly approximate. This does not change the calculator's existing UK formula.
- German/French/Indonesian short-answer examples now state serving size and strength: 330 ml beer at 5% is about 1.3 units; 250 ml wine at 13% is about 2.6 units. This replaces vague 2.4-unit wine examples inconsistent with their existing tables. Correct existing Italian/Spanish/Portuguese/Japanese serving examples remain localized in the same slots.
- English pint examples specify British 568 ml servings. English/Italian/Japanese guide introductions now say alcohol amount depends on both size and strength, replacing unconditional pint-versus-shot comparisons.
- All eight answer-page FAQ schemas match their five existing visible questions and answers. The English schema previously described a different question set; it now reflects the visible FAQ without adding body content. Local punctuation discrepancies were also synchronized. No Google FAQ-rich-result benefit is claimed.

Contextual calculator links:

| Existing slot | Added missing same-language calculator links | Existing behavior retained |
|---|---|---|
| Methodology's unit-explanation paragraph linking to the unit guide | English, French, Italian, Japanese, Indonesian | German/Spanish/Portuguese calculator links and all guide/definition links |
| Unit explainer's short-answer paragraph | French, Spanish, Portuguese, Italian, Japanese, Indonesian | English/German introductory links; existing Spanish/Portuguese/German later calculator links and dry-day CTAs |
| Unit blog guide | None needed | All eight already link to the local calculator |

The extra Spanish/Portuguese introductory links provide the corresponding early opportunity across all languages; their existing later links were not deleted or moved. Eleven contextual links were added overall, with no new navigation section.

Verification on 2026-09-12:

- **134 tests passed**, including 58 new checks covering the 24-page metadata/structure baseline, eight-language formula text and link slots, all eight FAQ schemas, 32 worked guide examples, and the corrected French and wine-serving examples.
- Build passed with analytics disabled; the analytics loader and sitemap checks cover 200 pages/URLs. The sitemap updater changed only the 24 affected content dates; the other 176 URLs are unchanged.
- Phone preview: changed formula and calculator-link paragraphs fit on all 24 pages at a 390 px viewport override (375 px available document width). French formula visually inspected; Japanese desktop formula also checked and its calculator link followed to the correct local page.
- Existing long reference URLs overflow on the French methodology phone view; those paragraphs and shared styles were not changed. This is a separate pre-existing wrapping issue, not a clean whole-page mobile audit verdict. The large guidance table has its existing scrollable wrapper.
- Temporary preview closed/stopped and viewport restored. No production events, release, outreach, publisher credentials or Atrium source changes were made.

Primary references checked for the unit definitions (not a review of all medical guidance on these pages): [NHS alcohol units](https://www.nhs.uk/live-well/alcohol-advice/calculating-alcohol-units/), [NIAAA US standard drinks](https://www.niaaa.nih.gov/alcohols-effects-health/what-standard-drink), [Australian standard drinks guide](https://www.health.gov.au/topics/alcohol/about-alcohol/standard-drinks-guide). Existing application risk thresholds, source editions and wider health recommendations remain outside this pass.

Follow-up: SEO-20260912-06 shipped with earlier September actions in [RELEASE-20260913-PROD](#release-20260913-prod--verified-production-deployment). Use the dated baseline/report links and manual evaluation protocol above; correct explanatory text and links cannot be credited separately when released as a bundle. Later analysis should distinguish editorial correctness, crawler discovery, and measured traffic change.

## Reusable action entry

```text
ID / short name:
Recorded date / owner:
Status: proposed | implemented | deployed | evaluated | superseded
Page family / locales / exact URLs:
Reason / evidence link / confidence:
Changed slots and exact before/after text (or revision diff):
Shared-frame parity / deliberately unchanged elements:
Implementation revision and timestamp:
Production revision / timestamp / verification evidence: unknown until verified
Concurrent action IDs / confounders:
Crawl observation time / returned crawl time: unknown until inspected
Baseline and follow-up dates / coverage / source definitions:
Success measure / guardrails:
Dated evaluation / private report / conclusion / next decision:
Superseded by (if applicable; retain earlier record):
```
