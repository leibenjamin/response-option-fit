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

### How the live site is actually served (read this first)

`benlei.org/response-option-fit/` is served by the mount Worker, which
**reverse-proxies** `https://response-option-fit.pages.dev` under the path prefix
and **sets the security headers (including the CSP) itself**, overriding whatever
the Pages origin returns. Two consequences:

- The live CSP is the one in the Worker, **not** `public/_headers`. `public/_headers`
  governs only the Pages origin (`response-option-fit.pages.dev`) and other hosts;
  the Worker overrides it on the mounted path. So the analytics CSP allowance lives
  in the Worker.
- Enabling analytics is a **Worker code change** (the deployed Worker reads no
  environment variables; the token is a constant in the Worker source). The token
  is public — it ships in the page — so hardcoding it in the Worker is fine.

`cloudflare/worker-mount-response-option-fit.js` in the repo is the reference copy
of that Worker, with the beacon injection already written and gated on a
`CF_BEACON_TOKEN` constant (empty by default). The local build and the Playwright
suite never see the beacon (it is injected only by the live Worker), so they keep
asserting no third-party requests.

### Turn analytics on

1. **Make a Web Analytics site and copy the token.** Cloudflare dashboard
   (dash.cloudflare.com) → left sidebar → **Analytics & Logs → Web Analytics**
   (an account-level page, not inside a specific domain) → **Add a site** →
   hostname `benlei.org`. Cloudflare shows a `<script>` snippet; you only need the
   **token**, the hex string inside `data-cf-beacon='{"token":"…"}'`. (If you
   already created a Web Analytics site for `benlei.org`, reuse its token.)
2. **Update the mount Worker's code.** Open the Worker that serves the mount
   (Workers & Pages → your `mount-response-option-fit` Worker → **Edit code**).
   Replace its source with the current
   `cloudflare/worker-mount-response-option-fit.js` from the repo (it keeps the
   exact reverse-proxy + header behavior you have now and adds the gated beacon),
   set `const CF_BEACON_TOKEN = "your-hex-token";` near the top, and **Save and
   deploy**. (If you manage the Worker with `wrangler`, edit the file and
   `wrangler deploy`.) Do **not** paste the `env.ASSETS` version from older notes —
   your Worker proxies the Pages origin and has no assets binding.
3. **Verify.** Open `https://benlei.org/response-option-fit/`, devtools →
   **Network** → reload → confirm `beacon.min.js` loads from
   `static.cloudflareinsights.com` with no **Console** CSP error. Data appears in
   the Web Analytics dashboard within a few minutes; the site is the whole
   `benlei.org` hostname, so filter to the path `/response-option-fit/` to see just
   the lab.

If `beacon.min.js` does not appear: (a) confirm the deployed Worker is the new
source (it should contain `HTMLRewriter`); (b) confirm the token is plain hex —
the `analyticsEnabled()` guard (`^[a-f0-9]{16,64}$`) drops anything else, so copy
just the token value, no quotes or braces; (c) if HTML renders but looks broken,
it is an encoding edge case — tell the maintainer and we adjust the inject branch.

To turn it back off, set `CF_BEACON_TOKEN = ""` and redeploy; the beacon
disappears and the CSP narrows back to `'self'`.

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
