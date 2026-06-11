# Security And Privacy

The application is a static, client-rendered React app.

## Runtime Surface

- No backend, API, authentication, database, cookies, or service worker.
- The build is served from two public origins: the canonical
  `benlei.org/response-option-fit/` (the Cloudflare Worker mount) and the
  Cloudflare Pages deployment it proxies, `response-option-fit.pages.dev`, which
  is directly reachable. Both serve the same static, secret-free artifact; the
  document sets `rel="canonical"` to the apex. The Worker is the authoritative
  security boundary for the canonical URL (see Content Security Policy below).
- Page-traffic measurement is limited to Cloudflare Web Analytics, a cookieless,
  aggregate beacon (page views only, no personal data, no cross-site tracking).
- Optional progress and settings persistence uses browser-local storage only
  when enabled by the reader (the Remember toggle, on by default and clearable in
  the Settings drawer); otherwise progress stays in memory and is lost on reload.
  Stored keys are confined to the `rofl:v1:` namespace.
- No freeform text inputs or contenteditable regions.
- The settings drawer can import a local JSON file. Parsing happens entirely in
  the browser and transmits nothing; the importer rejects any object outside the
  `rofl:v1:` namespace, validates every entry against its schema, and rolls back
  to the prior state if any write fails.
- No remote fonts, images, or iframes. The only third-party runtime request is
  at most the cookieless analytics beacon above — injected by the live mount
  Worker only; the build under test makes no third-party requests, and the
  Playwright suite asserts that.
- Outbound source links use HTTPS and open with `target="_blank"` plus
  `rel="noopener noreferrer"`.

## HTML And Script Safety

The source uses one allowlisted static template path for the colophon:
`Colophon.tsx` reads the authored `#colophon-template` from `index.html` and
renders it with `dangerouslySetInnerHTML`. That path does not include imported,
stored, or user-authored content. The application does not use `eval`,
`Function`, or `document.write`; interactive exhibit content is rendered through
React text nodes and component props.

## Content Security Policy

The Vite build injects a restrictive meta Content Security Policy into
`dist/index.html`:

```text
default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; form-action 'none'; base-uri 'self'
```

`frame-ancestors` is intentionally enforced through HTTP headers in
`public/_headers`, because browsers do not honor that directive when delivered
through a meta tag. The same headers file also includes `X-Frame-Options: DENY`
for compatibility.

On the live deployment (`benlei.org/response-option-fit/`) the Cloudflare mount
Worker sets the authoritative CSP as an HTTP response header and strips this meta
tag, so the header is the single enforced policy there; it is equivalent except
that it permits the analytics beacon's origin. This meta CSP governs static-host
and Pages-origin delivery.

## Worker-Owned Transport And Isolation Headers

The mount Worker also sets the transport- and isolation-level headers itself
rather than inheriting them from the Pages origin's `_headers`, so the live
apex does not depend on upstream passthrough for them:

- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-origin`

Because the app issues no cross-origin requests (`connect-src 'self'`), the
Worker also strips the permissive `Access-Control-Allow-Origin: *` that
Cloudflare Pages stamps on the origin response, so the canonical URL does not
advertise itself as readable by arbitrary origins. The Pages origin
(`response-option-fit.pages.dev`) still carries that default header; it serves
the same secret-free static files, so this is cosmetic rather than a disclosure
risk.

The live apex additionally sits behind a Cloudflare managed challenge for
automated/datacenter clients, which is verification-relevant: a non-browser
client (curl, scanners) may receive Cloudflare's challenge interstitial and its
headers instead of the Worker's. Verify the Worker's headers from a real browser
session, or directly against the Pages origin, which is not challenge-gated.

## Referrer Policy

The document sets:

```html
<meta name="referrer" content="strict-origin-when-cross-origin" />
```

The outbound source links also include `noreferrer`, so those clicks do not
send a referrer.

## Development Server

The Vite dev server is bound to `127.0.0.1:5173` with `strictPort: true`. This
keeps local development on loopback and avoids exposing the dev server on other
network interfaces by default. That binding is the standing mitigation for the
recurring class of Vite/esbuild dev-server advisories (most recently
CVE-2026-39365, a source-map path traversal), all of which require the dev
server to be exposed with `--host`/`server.host` — this project never does
that. Staying on a supported Vite major (see below) keeps dev-server fixes
arriving regardless.

## Dependencies And Supply Chain

The runtime dependencies are `react`, `react-dom`, and `lucide-react` (icon
components compiled into the bundle); the deployed artifact is static
HTML/CSS/JS with no bundled server. The build toolchain is Vite 8 (Rolldown)
with `@vitejs/plugin-react`, TypeScript, and Playwright, on Node 24 LTS pinned
by `.nvmrc` (honored locally and by the Cloudflare Pages build image).

As of the 2026-06-11 audit, `npm audit` and an OSV.dev scan of the full
lockfile both report **zero known vulnerabilities** across all 66 locked
packages. The two advisories previously documented here — the dev-only esbuild
CORS issue (GHSA-67mh-4wv8-2f99) and the Vite 5 dev-server path traversal
(CVE-2026-39365), which had no fix on the 5.x line — were retired by the major
upgrade to Vite 8: esbuild left the dependency tree entirely, and the Vite 5
line is no longer in use. The earlier judgment that the major upgrade was
"tracked but not forced" stopped being right once Vite 5 fell out of the
security-backport window; the upgrade is now the maintained baseline.

Supply-chain guards, in layers:

- `package-lock.json` resolves every package to `registry.npmjs.org` with a
  pinned integrity hash; installs use `npm ci`, which fails on any mismatch.
  During the audit, every locked hash was additionally cross-checked against
  the registry's published hashes (123/123 matched before the upgrade, and the
  post-upgrade tree was re-verified by clean-room `npm ci`).
- `.npmrc` sets `ignore-scripts=true`, so no dependency lifecycle script runs
  on install — locally or during Pages deploys. Install hooks are the
  propagation mechanism of the 2025–2026 npm worm campaigns (Shai-Hulud and
  its successors); this tree needs no install scripts on Linux anyway (only
  the macOS-only `fsevents` declares any).
- Playwright browser builds are fetched by an explicit `npx playwright
  install`, never implicitly.
- The dependency tree is deliberately small (66 locked packages including all
  tooling), which keeps the audit surface reviewable.

## Accessibility And Privacy Review

The public app is designed around these review targets:

- no inline event handlers or inline scripts;
- at most the cookieless analytics beacon loads from a third-party origin
  (live mount only — the tested build loads nothing third-party);
- external-link target and rel attributes;
- expected production CSP and header configuration;
- skip link and live-region behavior;
- visible keyboard focus;
- text contrast and reduced-motion behavior.
