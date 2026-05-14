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
mounting the built app under `/response-option-fit/` with an `ASSETS` binding.
It redirects `/response-option-fit` to `/response-option-fit/`, strips the mount
prefix before asset lookup, and falls back to `index.html` for navigation
requests.

The build emits relative paths by default, so the same artifact works behind
the Worker mount without any base-path coordination.

Then bind the generated static assets to the Worker as `ASSETS` in the
Cloudflare configuration for the deployment target.
