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

## Analytics (Cloudflare Web Analytics)

The project's posture is privacy-respecting, not analytics-free: a cookieless,
aggregate beacon is acceptable (see the colophon). Cloudflare Web Analytics fits
the deployment and adds no cookies and no personal data.

### What it measures — and what it does NOT

Cloudflare Web Analytics is **page-traffic** analytics: visits, page views,
rough unique visitors (cookieless, sampled), referrers, countries, devices, and
Core Web Vitals. That answers "how many people reached the lab."

It does **not** do custom events or per-visitor funnels. So it will NOT, on its
own, tell you:

- how far each visitor got (how many exercises they finished),
- how many visitors complete all twelve,
- how many download or copy the completion certificate,
- conversion between any two feature/funnel steps.

Those require **custom event tracking**, which Cloudflare Web Analytics does not
provide. See "Custom events" below.

### Setup — the repo side is already wired; you only touch the dashboard

The app is served at `benlei.org/response-option-fit/` by the mount Worker, which
fetches the Pages assets and re-serves them under the path. Because the Worker
generates the HTML response, the analytics beacon is injected **by the Worker**,
not by `index.html`. That matters two ways: it keeps the beacon out of the local
build and the Playwright suite (which assert no third-party requests), and it
means turning analytics on is a dashboard task, not a code change.

As of 2026-05-31 the repo is wired for this:

- `cloudflare/worker-mount-response-option-fit.js` injects the Cloudflare Web
  Analytics beacon into HTML responses **only when** a `CF_BEACON_TOKEN` Worker
  variable is set (and only when it looks like a real hex token). With no token it
  behaves exactly as before — no beacon, no third-party request.
- `public/_headers` already allows the beacon's domains in the CSP
  (`static.cloudflareinsights.com` for the script, `cloudflareinsights.com` for
  the report), so nothing is CSP-blocked once the beacon is present.

To turn it on:

1. **Make a Web Analytics site and copy the token.** In the Cloudflare dashboard
   (dash.cloudflare.com), left sidebar → **Analytics & Logs → Web Analytics**
   (this is an account-level page, not inside a specific domain). Click **Add a
   site**, enter the hostname `benlei.org`, and create it. Cloudflare then shows a
   `<script>` snippet — you do **not** paste it anywhere; you only need the
   **token**, the hex string inside `data-cf-beacon='{"token":"…"}'`. Copy that
   token. (Stale tutorials tell you to paste the snippet into your HTML — that is
   the manual path; here the Worker injects it, so you skip it.)
2. **Give the token to the Worker.** Dashboard → **Workers & Pages** → open the
   Worker that serves the mount → **Settings → Variables and Secrets** → add a
   variable named exactly `CF_BEACON_TOKEN`, paste the token as the value, and
   **Deploy**. (A plaintext *Variable* is fine — the token is not a secret. If you
   manage the Worker with `wrangler` instead, add it under `[vars]` in
   `wrangler.toml`, or run `wrangler secret put CF_BEACON_TOKEN`, then redeploy.)
3. **Verify.** Open `https://benlei.org/response-option-fit/`, open browser
   devtools → **Network**, reload, and confirm `beacon.min.js` loads from
   `static.cloudflareinsights.com` with no error in the **Console**. Numbers show
   up in the Web Analytics dashboard within a few minutes. The site is the whole
   `benlei.org` hostname; filter to the path `/response-option-fit/` in the
   dashboard to see just the lab.

To turn it back off, delete the `CF_BEACON_TOKEN` variable and redeploy; the
beacon disappears and the site makes no third-party request again. (A simpler-
sounding alternative — the *automatic* per-zone Web Analytics with no token — is
unreliable here because the Worker generates the HTML, so the edge does not
inject the beacon for it. Use the token path above.)

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
