# SEO Follow-up Ticket: French Comparison Page Mindrink Pros/Cons Cleanup

**Date:** 2026-05-28
**Priority:** Low-Medium
**Evidence strength:** Content-quality audit observation
**Target repo:** `websitemindrink`
**Target page:**

- `fr/blog/best-alcohol-tracking-apps.html`

## Goal

Clean up the French comparison page’s Mindrink section so the `Avantages` and `Inconvénients` lists read consistently and do not classify privacy/offline-use advantages as disadvantages.

This is a small editorial quality pass, not a new SEO targeting task.

## Background

During the accepted DE/FR SEO comparison-page audit, Athena flagged a pre-existing French content inconsistency:

In the Mindrink section, under `Inconvénients`, the current list includes:

- local-only data / information stays on device, described as ideal for confidentiality;
- no internet connection required.

Those read like advantages, not disadvantages. The section would be clearer if it distinguishes actual trade-offs from benefits.

## Scope

Modify only:

`fr/blog/best-alcohol-tracking-apps.html`

Focus area: the `4. Mindrink` section, especially the `Avantages` and `Inconvénients` lists.

## Recommended change direction

Keep the current positive positioning honest:

- simple;
- private;
- no account/cloud requirement if accurate;
- non-judgmental tracking;
- useful for understanding habits.

But rewrite the disadvantages as real trade-offs.

Possible directions for `Inconvénients`:

- local-only storage can be a limitation if the user wants cloud sync, cross-device access, or account-based history;
- no coaching/program/community if the user wants structured behavior-change support;
- lighter feature set than a full reduction program, if accurate for the current app.

Example direction, not mandatory final copy:

```html
<p class="feature-text"><strong>Inconvénients</strong></p>
<ul style="margin: 8px 0 16px; padding-left: 24px;">
    <li style="padding: 4px 0;">Données locales seulement : idéal pour la confidentialité, mais moins adapté si vous voulez synchroniser vos données entre plusieurs appareils.</li>
    <li style="padding: 4px 0;">Pas de programme guidé ou de communauté : Mindrink convient mieux à l’observation personnelle qu’à un accompagnement structuré.</li>
</ul>
```

Adjust wording to match the current product truth. Do not invent missing/available features.

## Non-goals

Do not:

- change DE page content;
- change title/meta/H1 unless a direct typo is found;
- change SEO targeting;
- add new competitor claims;
- make medical claims;
- change canonical, hreflang, sitemap, or tracking;
- create new pages.

## Acceptance criteria

- The Mindrink `Avantages` list contains benefits.
- The Mindrink `Inconvénients` list contains genuine trade-offs/limitations, not benefits mislabeled as drawbacks.
- French remains natural, correctly accented, and non-salesy.
- No claims are added unless they are true for the current product.
- Only the French target page is changed, unless a directly necessary supporting typo/doc update is approved.

## Validation

Run from `C:/Users/phili/Workspace/Dev/websitemindrink`:

```bash
git diff -- fr/blog/best-alcohol-tracking-apps.html
node --test tests/alcohol-formulas.test.js
git diff --check -- fr/blog/best-alcohol-tracking-apps.html
```

Optional static link/canonical sanity check:

- confirm the page still has one `<title>`, one meta description, and one self-canonical;
- confirm no new broken root-relative links were introduced.

## Reference

Completed parent workstream archive:

`docs/Ai/archive/seo-de-fr-comparison-pages-content-2026-05-28/final-synthesis.md`
