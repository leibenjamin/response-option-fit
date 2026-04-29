# Security And Privacy

The application is a static, client-rendered React app.

## Runtime Surface

- No backend, API, authentication, database, analytics, cookies, service worker,
  or browser storage.
- No freeform text inputs, file uploads, or contenteditable regions.
- No remote fonts, images, iframes, or third-party runtime requests.
- Outbound report links use HTTPS and open with `target="_blank"` plus
  `rel="noopener noreferrer"`.

## HTML And Script Safety

The source does not use `dangerouslySetInnerHTML`, `innerHTML` writes, `eval`,
`Function`, or `document.write`. Displayed content is rendered through React
text nodes and component props.

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

## Referrer Policy

The document sets:

```html
<meta name="referrer" content="strict-origin-when-cross-origin" />
```

The five outbound source links also include `noreferrer`, so those clicks do not
send a referrer.

## Development Server

The Vite dev server is bound to `127.0.0.1:5173` with `strictPort: true`. This
keeps local development on loopback and avoids exposing the dev server on other
network interfaces by default.

## Accessibility And Privacy Tests

The Playwright suite checks security and accessibility invariants including:

- no inline event handlers or inline scripts;
- no third-party network requests on load;
- external-link target and rel attributes;
- expected production CSP and header configuration;
- skip link and live-region behavior;
- visible keyboard focus;
- text contrast and reduced-motion behavior.
