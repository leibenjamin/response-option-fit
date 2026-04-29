# Deployment

Response Option Fit Lab is a static Vite app. The production build emits an
`index.html` entry plus content-hashed assets in `dist/assets/`.

## Root Deployment

Use this for hosts that serve the app at `/`:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Subpath Deployment

Use the convenience script for `/response-option-fit/`:

```bash
npm run build:subpath
```

For another mount path, set `VITE_BASE_PATH` to the public path with leading and
trailing slashes:

```bash
VITE_BASE_PATH=/my-path/ npm run build
```

The configured base path must match the deployed URL path so asset references
resolve correctly.

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
mounting the built app under `/response-option-fit/` with an `ASSETS` binding.
It redirects `/response-option-fit` to `/response-option-fit/`, strips the mount
prefix before asset lookup, and falls back to `index.html` for navigation
requests.

Build the app with:

```bash
npm run build:subpath
```

Then bind the generated static assets to the Worker as `ASSETS` in the
Cloudflare configuration for the deployment target.
