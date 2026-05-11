# AEO Content & Knowledge Layer Plan

## Summary

Create a structured answer layer for search and AI parsing. English pages live at root as static `.html` pages. Translations can follow later in existing language folders after the English structure is proven.

## Key Changes

- Add 6 English AEO pages:
  - `/alcohol-units.html`
  - `/dry-day.html`
  - `/reduce-drinking.html`
  - `/binge-drinking.html`
  - `/private-alcohol-tracking.html`
  - `/what-to-look-for-in-alcohol-tracker.html`
- Use a shared static HTML structure:
  - `h1`
  - `section#short-answer`
  - `section#explanation`
  - `section#examples`
  - `section#interpretation`
  - `section#faq`
  - `section#cta`
- Add compact homepage section titled `Understand your drinking`.
- Restructure `faq.html` into Basics / Habits / Tracking and link to all 6 AEO pages.
- Add FAQ JSON-LD to all AEO pages.
- Update `sitemap.xml` with all indexable AEO pages.

## Implementation Order

1. Store this plan in `docs/Ai/active/aeo-plan.md`.
2. Keep the obsolete redirect stub `blog/why-tracking-your-drinking-helps.html` deleted.
3. Build `/alcohol-units.html` first as the reusable pattern.
4. Add `/dry-day.html`.
5. Add homepage knowledge section.
6. Update `faq.html`.
7. Add the remaining 4 pages.
8. Run internal linking pass.
9. Add JSON-LD FAQ schema to all AEO pages.
10. Update and validate `sitemap.xml`.
11. Later phase: translate/localize pages into existing language folders.

## Test Plan

- Serve locally with `npx serve .`.
- Verify all 6 URLs load directly.
- Verify homepage and FAQ links resolve.
- Verify no orphan pages and each AEO page has at least 2 incoming internal links.
- Verify sitemap count equals indexable HTML count.
- Verify no sitemap URL points to a missing or `noindex` page.
- Validate FAQ JSON-LD with Google Rich Results test manually.
- Check mobile readability for homepage section, FAQ groups, tables, and CTA blocks.

## Assumptions

- Static `.html` URLs are preferred over clean URLs.
- No `/en/` folder and no `/pages/en/` source folder.
- English AEO pages are root-level public pages, not blog posts.
- New pages should be answer-first, skimmable, and not written in blog style.
- Google Search Console submission/indexing is manual after deployment.
