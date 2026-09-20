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
