# Mindrink Website — Agent Context

Agent entry for the public website repository (`websitemindrink`).

## Website docs (this repo)

| Need | Path |
|---|---|
| Active tickets (local) | `docs/Ai/active/` — **gitignored** in this repo |
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
