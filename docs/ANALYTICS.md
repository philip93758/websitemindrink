# Privacy-minimized website analytics

Mindrink uses a locally bundled slim build of `posthog-js` with a PostHog Cloud EU project. Analytics starts without a banner, but remains deliberately limited to aggregate page traffic, internal page transitions, and the alcohol calculator funnel.

## Build configuration

Set these variables for the website build:

```text
POSTHOG_PUBLIC_TOKEN=phc_...
POSTHOG_HOST=https://eu.i.posthog.com
```

`npm run analytics:build` copies the pinned slim SDK into `scripts/vendor/` and generates the ignored public configuration module. If the token is absent or the host is not the exact EU ingestion host, analytics remains inert. `npm run analytics:pages:update` puts the current module loader on every HTML page.

## GitHub Pages deployment

The GitHub Pages workflow reads `POSTHOG_PUBLIC_TOKEN` from a repository Actions variable, or from an Actions secret with the same name when no variable is present. It fixes the ingestion host to `https://eu.i.posthog.com`. Pushes to `dev` run the complete test and build checks without deploying. A push to `main` builds the same clean static artifact and deploys it to the existing `github-pages` environment.

The generated `scripts/analytics-config.js` file remains ignored. Do not commit it; GitHub creates it during the Pages build.

## What is measured

| Event | Trigger | Approved properties |
|---|---|---|
| `site_page_viewed` | Once when any website page loads | `locale`, `page_path` |
| `internal_navigation_clicked` | A link to a different page on mindrink.me is clicked | `locale`, `from_page_path`, `to_page_path` |
| `calculator_started` | First meaningful calculator interaction on a page | `locale`, `page_path`, `calculator_type` |
| `calculation_completed` | A valid, deliberately committed calculation that differs from the previous completed draft | `locale`, `page_path`, `calculator_type` |
| `calculator_total_added` | A successful click on “Add to total” | `locale`, `page_path`, `calculator_type` |
| `app_cta_clicked` | Click on the calculator journey’s app CTA | calculator properties plus `cta_location: calculator_footer` |

Paths never contain query parameters or fragments. Link text, referrers, full URLs, calculator inputs, drink values, results, health information, and free text are never sent.

`internal_navigation_clicked` describes an aggregate edge such as `/discover/` → `/about.html`. The destination page receives a new memory-only identifier, so these events do not create a stitched multi-page visitor journey. PostHog can still show the most common transitions by grouping the explicit from/to paths.

## Privacy behavior

- PostHog uses `persistence: memory`; its ephemeral distinct and device identifiers are not written to cookies, local storage, or session storage and do not survive a page load.
- The website never calls `identify()` and person profiles are disabled.
- Autocapture, automatic page views and page leaves, heatmaps, dead clicks, performance and exception capture, session replay, surveys, feature flags, and device-model access are disabled.
- A final `before_send` allowlist removes standard browser/device metadata, complete URLs, referrers, session identifiers, and every unapproved custom property.
- Every event sends `$geoip_disable: true`.
- Global Privacy Control and Do Not Track disable analytics before the configuration or SDK is loaded.
- The privacy page has a quiet browser-level opt-out. Only the opt-out preference (`mindrink_analytics_opt_out=true`) is stored across page loads.

The HTTPS connection necessarily exposes the request IP to PostHog at network ingress. In the PostHog EU project, an administrator must verify that **IP capture is disabled**, so PostHog does not retain it or use it for geolocation.

## Required PostHog project settings

Before production use, verify in the PostHog Cloud EU project:

1. IP capture and GeoIP enrichment are disabled.
2. Session replay remains disabled.
3. Event data retention is set to **90 days or less**.
4. No transformation, destination, or plugin adds URL, referrer, identity, or device data.

These server-side settings cannot be enforced by website code.

## Verification

Run:

```text
npm test
npm run build
```

Then verify in a browser with a real public token:

1. A normal page sends one allowlisted `site_page_viewed` event without showing a banner.
2. An internal page link sends one transition with normalized `from_page_path` and `to_page_path`.
3. The destination page uses a different ephemeral PostHog identifier.
4. GPC, DNT, and the privacy-page opt-out prevent all PostHog files and requests from loading on the next page load.
5. Payloads contain no query strings, full URLs, referrers, input values, results, free text, or persistent identifiers.
