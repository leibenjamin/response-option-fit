# Security And Privacy

The application is a static, client-rendered React app.

## Runtime Surface

- No backend, API, authentication, database, cookies, or service worker.
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

## Accessibility And Privacy Review

The public app is designed around these review targets:

- no inline event handlers or inline scripts;
- only the cookieless analytics beacon loads from a third-party origin;
- external-link target and rel attributes;
- expected production CSP and header configuration;
- skip link and live-region behavior;
- visible keyboard focus;
- text contrast and reduced-motion behavior.
