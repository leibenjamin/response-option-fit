# Deployment

Response Option Fit Lab is a static Vite app. The production build emits an
`index.html` entry plus content-hashed assets in `dist/assets/`.

## Default build

```bash
npm run build
```

The build emits relative asset paths (`./assets/...`). Relative URLs resolve
against the document URL, so the same artifact works whether it is served at
the root, behind the Cloudflare Worker mount at `/response-option-fit/`, or
from `vite preview`. No coordination between the build base and the deploy
mount path is required.

`npm run build:subpath` is preserved as an explicit alias and is safe to leave
in any deploy configuration that references it.

Preview the production build locally:

```bash
npm run preview
# → http://127.0.0.1:4173/
```

`npm run dev` keeps the dev server at the root (`http://127.0.0.1:5173/`) for
fast iteration; only `vite build` and `vite preview` apply the relative-base
default.

## Alternate mount paths

Set `VITE_BASE_PATH` to the public path (with leading and trailing slashes) to
build for a specific absolute mount path:

```bash
VITE_BASE_PATH=/my-path/ npm run build
```

Use `VITE_BASE_PATH=/` for an absolute root-served build. The configured base
path must match the deployed URL path so asset references resolve correctly.
Most deployments do not need this — the default relative-base output is
mount-agnostic.

## Headers

`public/_headers` is copied into the production build and is compatible with
Cloudflare Pages and Netlify-style static hosts. It provides:

- a restrictive Content Security Policy;
- `X-Content-Type-Options: nosniff`;
- frame protection through `frame-ancestors 'none'` and `X-Frame-Options: DENY`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- a restrictive `Permissions-Policy`;
- HSTS, COOP, CORP, and immutable caching for hashed assets.

Hosts that do not consume `_headers` should mirror those headers in their own
configuration.

## Cloudflare Worker Mount

`cloudflare/worker-mount-response-option-fit.js` is a small Worker helper for
mounting the built app under `/response-option-fit/`. It redirects
`/response-option-fit` to `/response-option-fit/`, strips the mount prefix
before asset lookup, proxies the request to the Pages origin
(`response-option-fit.pages.dev`), and falls back to `index.html` for
HTML-accepting navigation requests that 404.

The build emits relative paths by default, so the same artifact works behind
the Worker mount without any base-path coordination.

## Cloudflare Pages: build deduplication and the build-banner safeguard

Cloudflare Pages content-addresses every uploaded asset by hash. Two deploys
from byte-identical bundles get dedup-mapped to the same stored blob — the
build log shows `Uploaded 0 files (N already uploaded)` when this happens.
That is normally a feature: faster deploys, less storage. It becomes a
**permanent outage** if one of those stored blobs is ever corrupted, because
no future deploy from the same source can dislodge it. We hit this on
2026-05-14: a corrupt `index-CucKQuLe.js` blob returned HTTP 500 for three
consecutive deploys, all dedup-mapped to the same hash.

The defense, in `vite.config.ts`, injects an ISO-timestamp comment into every
JS chunk and every CSS asset *before content-hashing*:

```ts
const BUILD_BANNER = `/*! response-option-fit-lab build ${new Date().toISOString()} */`;
```

Every build now produces unique content hashes. Cloudflare Pages always
uploads a fresh blob; dedup-corruption cannot persist. The banner gzips down
to ~30 bytes per file and is preserved through minification.

When a normal deploy lands, the build log should show `Uploaded N files
(0 already uploaded)` — not `0 files / N already uploaded`. If you see the
latter, the banner is not running (check that `vite.config.ts` has the
`build.rollupOptions.output.banner` setting and the `injectCssBuildBanner`
plugin in the plugins array).

## Cloudflare Pages dashboard settings

The dashboard build configuration is *not in the repo*. To redeploy from
scratch into a clean Pages project, set:

- **Production branch:** `main`
- **Build command:** `npm run build`
- **Build output directory:** `/dist`
- **Root directory:** `/`
- **Node version:** project defaults work (`nodejs@22.16.0` observed)
- **Environment variables:** none required. `VITE_BASE_PATH` is supported as
  an override but should be left unset; the default relative-path build is
  mount-agnostic.

If `VITE_BASE_PATH` is set in the dashboard to an empty value, that empty
string overrides the `vite.config.ts` default via Node's `??` semantics (empty
string is not nullish). The build then uses `base: ""`, which Vite normalizes
to relative paths — same effective output as leaving it unset, but adds an
invisible coupling between dashboard state and build behavior. **Recommended:
remove the `VITE_BASE_PATH` entry from the dashboard env vars entirely.**

## When the live site appears blank

A blank `/response-option-fit/` page almost always means asset URLs the HTML
references are failing to load. Diagnose from outside-in:

1. View source on the live page; copy the script/stylesheet hashes from the
   `./assets/index-*.{js,css}` references.
2. `curl -sI -A "Mozilla/5.0 ... Firefox/121.0" -H "Accept: */*"` each asset
   URL. A 500 from the **Pages origin** (not the Worker) confirms blob
   corruption — fix by pushing any source change that alters bundle hashes;
   the build banner does this automatically on every build.
3. A 404 on the asset URL means manifest mismatch — usually fixed by a fresh
   deploy that re-uploads the index.html and asset set together.
4. A 200 returning HTML content for an asset URL means CF Pages' SPA fallback
   was triggered — the file is genuinely missing from the deploy.

Direct Pages origin probe (bypassing the Worker mount) is the fastest
diagnostic. It removes Worker behavior from the variables.

Then bind the generated static assets to the Worker as `ASSETS` in the
Cloudflare configuration for the deployment target.

## Analytics

This deployment runs **two** layers: Cloudflare's **server-side** traffic
analytics (always on, no code, cannot be ad-blocked) and the client-side Web
Analytics **beacon** (on; adds Core Web Vitals). The beacon is a third-party
request on page load, so the colophon discloses it; see "The client beacon (on)."

### Server-side traffic analytics (what we use — already on)

`benlei.org` is proxied through Cloudflare (orange-cloud), so Cloudflare counts
every request at the edge with nothing added to the page. In the dashboard
(**Analytics & Logs → Traffic**, or the zone's Web Analytics view) filter the
path to `/response-option-fit/` to see the lab's traffic: requests, visits,
bandwidth, cache-hit rate, referrers, countries, devices. Edge-measured, so it
**cannot be ad-blocked** and needs no code. This answers "how many people reached
the lab," which is the number that matters for a portfolio piece. (The
`Cache Hit Rate` and `Bandwidth Served` tiles are the tell that the data is
server-side: only the edge can know them — a client beacon cannot.)

It does **not** do custom events or per-visitor funnels — how far each visitor
got, how many finished all twelve, certificate copies, step-to-step conversion.
Those need **custom event tracking**; see "Custom events" below.

### The client beacon (on)

Cloudflare Web Analytics' client-side **beacon** (`beacon.min.js` from
`static.cloudflareinsights.com`) adds Core Web Vitals and load timing, reported to
the Web Analytics (RUM) dashboard. It is **on** for this deployment.

How it is wired: the token is **not** committed. The repo Worker keeps
`const CF_BEACON_TOKEN = ""`; the live `mount-response-option-fit` Worker has the
hex token set in its dashboard source, and that is what turns injection on. The
token is public (it ships in the page), so this split is only to keep the repo
host-agnostic, not for secrecy. To change it: Workers & Pages →
`mount-response-option-fit` → **Edit code** → set `const CF_BEACON_TOKEN` → **Save
and deploy**. To turn the beacon off, set it back to `""`, redeploy, and walk the
colophon disclosures (below) back.

Two consequences worth knowing:

- The beacon is a **third-party request on page load**, so the colophon discloses
  it — the privacy and materials sections, and the build list at `index.html`
  line 93. Keep those in sync with whether the beacon is on.
- It is **ad-blocked** for much of this site's technical audience, so the RUM
  numbers undercount; the server-side layer above is the count that captures
  everyone. Treat RUM as the "how fast / Core Web Vitals" view and server-side as
  the "how many" view.

Verify it loads — note your own browser may block it (Opera's built-in blocker or
an ad-block extension yields `net::ERR_BLOCKED_BY_CLIENT`, which is the client,
not the site): open `benlei.org/response-option-fit/` in a browser with no ad
blocker (or allowlist the site), DevTools → **Network** → reload → `beacon.min.js`
returns `200` from `static.cloudflareinsights.com` with no **Console** CSP error.

### How the live site is served (background)

`benlei.org/response-option-fit/` is served by the mount Worker, which
**reverse-proxies** `https://response-option-fit.pages.dev` under the path prefix
and **sets the security headers (including the CSP) itself**, overriding whatever
the Pages origin returns. So the live CSP is the Worker's, **not**
`public/_headers` (which governs only the Pages origin and other static hosts).
The local build and the Playwright suite never see any beacon, so they keep
asserting no third-party requests.

### CSP gotchas (handled in the Worker)

Two CSP interactions the beacon depends on, both already handled in the Worker —
check here first if the beacon is ever CSP-blocked again:

- *`beacon.min.js` blocked by `script-src 'self'`.* The build also bakes a
  `<meta http-equiv="Content-Security-Policy">` into the HTML (`vite.config.ts`),
  scoped to `'self'`. A browser enforces **every** CSP it is handed, so that
  strict meta would block the beacon even though the Worker's header CSP allows
  it. The Worker strips that meta on the mounted path (the `meta[http-equiv]`
  handler) so its header is the single authoritative policy.
- *A blocked **inline** script (not `beacon.min.js`, usually near `</body>`).*
  The app ships **no inline scripts** — the whole build is one external module —
  so any inline script on the live page is injected by a Cloudflare **edge**
  feature, independent of the beacon and present even with analytics off. Likely
  **Rocket Loader** or bot-detection JS (its hash changes per request),
  occasionally **Email Address Obfuscation**. Fix it at the source, not by
  loosening the CSP: turn off **Speed → Optimization → Rocket Loader** (and, if
  present, **Scrape Shield → Email Address Obfuscation**) for the zone. The strict
  CSP intentionally forbids inline scripts; keep it that way.

### Custom events (held for a later, cross-app decision)

To get the feature/funnel stats above, emit custom events from the client to a
first-party endpoint and aggregate them privately. The Cloudflare-native,
cookieless option is **Workers Analytics Engine**: a Pages Function (e.g.
`functions/api/event.ts`) writes a data point per event
(`writeDataPoint({ blobs: [name], doubles: [value] })`), queried later via the
GraphQL/SQL API. Candidate events for this app: `exercise_completed` (with the
running count), `all_complete`, `certificate_copied`, `certificate_png`. Keep it
aggregate and id-less to preserve the privacy posture, and acknowledge it in the
colophon.

This is intentionally **not built yet**: the same event/funnel structure is
likely to be designed once and reused across several portfolio apps, so it should
wait for that shared decision rather than being shaped ad hoc here.
