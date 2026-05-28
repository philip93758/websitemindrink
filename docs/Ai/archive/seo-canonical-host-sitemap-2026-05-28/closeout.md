# SEO Canonical Host and Sitemap Closeout

**Date:** 2026-05-28
**Status:** Closed without Codex implementation

## Outcome

The technical canonical-host/sitemap issue does not need a Codex/Cursor source-code ticket at this point.

The relevant fix was external configuration:

- GitHub Pages `Enforce HTTPS` was enabled by the user.
- The user resubmitted `https://mindrink.me/sitemap.xml` in Google Search Console.
- Next verification is delayed until GSC and Ahrefs recrawl/reprocess the site.

## Why the active ticket was archived

The original active ticket was useful for diagnosis, but source-code implementation could confuse Codex because the primary issue was GitHub Pages hosting behavior rather than website source files.

Local source checks already indicated:

- `sitemap.xml` uses canonical `https://mindrink.me/...` URLs.
- page canonicals generally point to `https://mindrink.me/...`.
- `CNAME` contains `mindrink.me`.

Live checks after enabling HTTPS showed the important behavior was fixed:

- `http://mindrink.me/` redirects to `https://mindrink.me/`.
- `http://mindrink.me/sitemap.xml` redirects to `https://mindrink.me/sitemap.xml`.
- `http://www.mindrink.me/sitemap.xml` redirects to `https://mindrink.me/sitemap.xml`.
- valid `www` page URLs redirect to the non-`www` HTTPS canonical host.
- `https://mindrink.me/sitemap.xml` returns 200.

## Remaining follow-up

Wait for external tools to refresh:

- GSC sitemap processing and URL canonical status.
- Ahrefs Site Audit recrawl.

If Ahrefs/GSC still report HTTP sitemap or host duplication after recrawl, reopen as a hosting/DNS investigation first, not as a content/source rewrite.

## Archived source

The original active ticket is archived in this folder as:

`seo-canonical-host-sitemap-ticket.md`
