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
  the cookieless analytics beacon above.
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
network interfaces by default.

## Dependencies

`npm audit --omit=dev` reports no production vulnerabilities: the only runtime
dependencies are `react` and `react-dom`, and the deployed artifact is static
HTML/CSS/JS with no bundled server.

The full `npm audit` reports two *moderate, development-only* advisories
(`esbuild` ≤ 0.24.2, pulled in transitively by `vite`; GHSA-67mh-4wv8-2f99): a
running esbuild dev server can be made to return source to another local origin.
This affects `npm run dev` only — esbuild runs at build time and ships nothing to
production — and is mitigated by the loopback binding above; the source is also
public (open-source repo), so there is no secret to disclose. The current Vite 5
line still pins the affected esbuild, so the clean fix is a major Vite upgrade
rather than a risky transitive `overrides` pin; it is tracked but not forced on a
static portfolio site.

## Accessibility And Privacy Review

The public app is designed around these review targets:

- no inline event handlers or inline scripts;
- only the cookieless analytics beacon loads from a third-party origin;
- external-link target and rel attributes;
- expected production CSP and header configuration;
- skip link and live-region behavior;
- visible keyboard focus;
- text contrast and reduced-motion behavior.
