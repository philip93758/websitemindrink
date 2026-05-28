# SEO Ticket: Canonical Host and Sitemap Consolidation

**Date:** 2026-05-28
**Source:** Mindrink Atrium first manual SEO export analysis
**Priority:** High
**Evidence strength:** Data-backed from GSC manual export + Ahrefs Site Audit exports
**Target repo:** `websitemindrink`

## Goal

Make `https://mindrink.me` the single canonical website host/protocol in crawl signals, redirects, and sitemap discovery.

This ticket is about technical signal hygiene only. Do not change page copy, keyword targeting, content structure, or localized SEO messaging in this ticket.

## Why this matters

The first Atrium manual SEO analysis found that search/crawl signals are noisy across protocol and host variants.

Evidence from the 2026-05-28 manual exports:

- Ahrefs Site Audit reports 168 indexable pages present in multiple sitemaps.
- The affected pages are referenced in both:
  - `http://mindrink.me/sitemap.xml`
  - `https://mindrink.me/sitemap.xml`
- Ahrefs reports 161 non-indexable HTTP URLs canonicalizing to HTTPS equivalents.
- GSC page export shows duplicate path entries split across `https://mindrink.me/...` and `https://www.mindrink.me/...`, including:
  - `/blog/how-to-count-alcohol-units.html`
  - `/methodology.html`
  - `/blog/`
  - `/blog/why-tracking-your-drinking-helps.html`
- Ahrefs 3xx export shows homepage-level `www` redirects, but GSC still has deeper-path `www` impressions.

This should be fixed before major content optimization, because it affects crawl clarity, sitemap quality, and measurement quality.

## Current known repo observations

From local inspection of `websitemindrink` on 2026-05-28:

- `sitemap.xml` itself appears to use canonical `https://mindrink.me/...` URLs.
- Many HTML pages already use canonical tags pointing to `https://mindrink.me/...`.
- Several pages use client-side JavaScript to force HTTPS, for example:

```html
<script defer>
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        location.replace('https:' + window.location.href.substring(window.location.protocol.length));
    }
</script>
```

Client-side HTTPS redirects do not replace server/CDN-level redirects for SEO. Search crawlers and GSC should see direct HTTP status redirects before page render.

## Scope

Implement or verify server/CDN/static-host redirect rules so that:

1. `http://mindrink.me/<path>` redirects directly to `https://mindrink.me/<path>`.
2. `http://www.mindrink.me/<path>` redirects directly to `https://mindrink.me/<path>`.
3. `https://www.mindrink.me/<path>` redirects directly to `https://mindrink.me/<path>`.
4. `https://mindrink.me/<path>` remains the canonical final URL.
5. `/sitemap.xml` is discoverable only as the canonical HTTPS sitemap in robots/GSC submission context.
6. The generated/static `sitemap.xml` contains only `https://mindrink.me/...` URLs.

## Non-goals

Do not:

- Rewrite content.
- Change titles/meta descriptions for keyword reasons.
- Change language alternates unless a concrete canonical/hreflang bug is found.
- Move pages or consolidate `alcohol-units.html` and `alcohol-unit-calculator/`.
- Introduce `www.mindrink.me` as canonical.
- Add tracking, analytics, or paid SEO tooling.

## Implementation notes for Codex/Cursor

Start with discovery. This repo is a static website; redirect behavior may live outside the repo depending on host provider.

### Step 1 — inspect hosting/deploy config

Check for files such as:

- `netlify.toml`
- `vercel.json`
- `_redirects`
- `.github/workflows/*`
- DNS/deploy notes in docs

If no host config exists in repo, report that redirect rules must be configured in the hosting provider/DNS/CDN, and add the exact recommended rules to a docs handoff rather than inventing repo-only redirects.

### Step 2 — inspect crawler entrypoints

Check:

- `robots.txt`
- `sitemap.xml`
- any sitemap index files
- any hard-coded references to `http://mindrink.me/sitemap.xml`
- any hard-coded `www.mindrink.me` URLs

### Step 3 — fix only repo-owned canonical/sitemap issues

If repo-owned files contain non-canonical URLs, change them to `https://mindrink.me/...`.

If `sitemap.xml` is already clean, do not churn it.

### Step 4 — add host-level redirect config only if the platform is known

If the repo clearly deploys to Netlify, Vercel, Cloudflare Pages, or another identifiable platform, add the minimal canonical redirect config for that platform.

If the platform is unknown, create/update a docs note with the required redirect behavior and leave source untouched except for verifiable canonical/sitemap cleanup.

## Acceptance criteria

Source/static checks:

- `sitemap.xml` contains no `http://mindrink.me` URLs.
- `sitemap.xml` contains no `www.mindrink.me` URLs.
- `robots.txt`, if present, points to `https://mindrink.me/sitemap.xml` or does not conflict.
- No canonical tags point to `http://mindrink.me` or `www.mindrink.me`.
- No Open Graph/Twitter URL tags introduce `www.mindrink.me` as the canonical shared URL.

Runtime checks after deploy/staging, if accessible:

```bash
curl -I http://mindrink.me/
curl -I http://mindrink.me/blog/how-to-count-alcohol-units.html
curl -I http://www.mindrink.me/blog/how-to-count-alcohol-units.html
curl -I https://www.mindrink.me/blog/how-to-count-alcohol-units.html
curl -I https://mindrink.me/sitemap.xml
```

Expected:

- non-canonical variants return 301/308 to the matching `https://mindrink.me/<path>` URL;
- canonical `https://mindrink.me/sitemap.xml` returns 200;
- redirects should avoid unnecessary chains where possible.

SEO verification after deploy:

- Resubmit or confirm canonical sitemap in GSC.
- Re-run Ahrefs Site Audit after recrawl.
- Expected Ahrefs improvement:
  - no duplicate `http://mindrink.me/sitemap.xml` / `https://mindrink.me/sitemap.xml` sitemap references;
  - fewer or no `www`/HTTP duplicate crawl paths;
  - canonical host remains `https://mindrink.me`.

## Validation commands

Local static checks:

```bash
grep -R "http://mindrink.me\|www.mindrink.me" --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=docs --include='*.html' --include='*.xml' --include='*.txt' .
node --test tests/alcohol-formulas.test.js
```

If the implementer adds redirect config, include platform-specific validation in the PR/summary.

## References

Atrium analysis artifact:

`C:/Users/phili/Workspace/Dev/mindrink-atrium/docs/Ai/active/manual-seo-inputs/first-export-analysis-2026-05-28.md`

Relevant section:

`Technical consolidation: canonical host, HTTP/HTTPS, and sitemap duplication`
