# Deployment

Response Option Fit Lab is a static Vite app. The production build emits an
`index.html` entry plus content-hashed assets in `dist/assets/`.

## Default build

The exhibit's production target is `benlei.org/response-option-fit/`, so the
default build emits assets under `/response-option-fit/`:

```bash
npm run build
```

`npm run build:subpath` is preserved as an explicit alias for the same output
and is safe to leave in any deploy configuration that references it.

Preview the production build locally — `vite preview` reads the same base from
`vite.config.ts` and serves the built `dist/` at the mount path:

```bash
npm run preview
# → http://127.0.0.1:4173/response-option-fit/
```

`npm run dev` keeps the dev server at the root (`http://127.0.0.1:5173/`) for
fast iteration; only `vite build` and `vite preview` apply the subpath default.

## Alternate mount paths

Set `VITE_BASE_PATH` to the public path (with leading and trailing slashes) to
build for any other mount:

```bash
VITE_BASE_PATH=/my-path/ npm run build
```

Use `VITE_BASE_PATH=/` for a root-served build. The configured base path must
match the deployed URL path so asset references resolve correctly.

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

Because the Worker only serves paths under `/response-option-fit/`, the built
assets must reference that mount path. The default `npm run build` already
emits the correct paths.

Then bind the generated static assets to the Worker as `ASSETS` in the
Cloudflare configuration for the deployment target.
