import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// frame-ancestors is intentionally NOT in the meta CSP — that directive is
// only honored as an HTTP response header and is ignored when delivered via
// <meta http-equiv>. See public/_headers for the real header CSP.
//
// This meta CSP governs static-host and *.pages.dev delivery. On the live
// Worker-mounted path (benlei.org/response-option-fit/) the mount Worker sets
// its own header CSP and strips this meta, so the header is the single
// authoritative policy there — that is also where the analytics allowance is
// added when the beacon is injected. Keep this meta strict; do not widen it for
// analytics.
const PROD_CSP =
  "default-src 'none'; " +
  "script-src 'self'; " +
  "style-src 'self'; " +
  "img-src 'self' data:; " +
  "font-src 'self'; " +
  "connect-src 'self'; " +
  "form-action 'none'; " +
  "base-uri 'self'";

const PROD_HEAD_INJECT = `
    <meta http-equiv="Content-Security-Policy" content="${PROD_CSP}" />
    <meta http-equiv="X-Content-Type-Options" content="nosniff" />`;

function injectProdSecurityHeaders(): Plugin {
  return {
    name: "inject-prod-security-headers",
    apply: "build",
    transformIndexHtml(html) {
      return html.replace(
        /<meta name="description"[^>]*\/>/,
        (match) => `${match}${PROD_HEAD_INJECT}`
      );
    }
  };
}

// The exhibit's production target is benlei.org/response-option-fit/, served
// via a Cloudflare Worker mount. Build emits relative asset paths so the same
// artifact works whether the Worker, a static host, or `vite preview` is
// serving it — relative URLs resolve against the document URL no matter the
// mount path. Dev still defaults to root so `npm run dev` keeps serving at
// http://127.0.0.1:5173/. Override either with VITE_BASE_PATH.
const DEPLOY_BASE = "./";

// A build-time banner is injected into every bundled JS chunk and CSS asset
// so each build produces unique bytes per file. Without this, two builds from
// identical source produce byte-identical artifacts; if Cloudflare Pages ever
// stores a corrupted copy of one of those artifacts, every later dedup-mapped
// deploy will serve the same corruption forever. The banner is one line per
// file, gzips down to ~30 bytes, and guarantees CF Pages actually re-uploads
// on every deploy. Comment syntax `/* ... */` is valid in both JS and CSS.
//
// Injection happens in generateBundle, not through `output.banner`: the
// Vite 8 / Rolldown bundler silently ignored the Rollup-style banner option,
// which stripped the safeguard from every JS chunk. generateBundle is part of
// the shared plugin contract both bundlers honor, and the Playwright suite now
// asserts the banner is the first bytes of every emitted .js/.css asset.
const BUILD_BANNER = `/*! response-option-fit-lab build ${new Date().toISOString()} */`;

function injectBuildBanner(): Plugin {
  return {
    name: "inject-build-banner",
    apply: "build",
    generateBundle(_options, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type === "chunk" && file.fileName.endsWith(".js")) {
          file.code = `${BUILD_BANNER}\n${file.code}`;
        } else if (
          file.type === "asset" &&
          file.fileName.endsWith(".css") &&
          typeof file.source === "string"
        ) {
          file.source = `${BUILD_BANNER}\n${file.source}`;
        }
      }
    }
  };
}

export default defineConfig(({ command, isPreview }) => {
  const buildOrPreview = command === "build" || isPreview === true;
  const appBase = process.env.VITE_BASE_PATH ?? (buildOrPreview ? DEPLOY_BASE : "/");

  return {
    base: appBase,
    plugins: [react(), injectProdSecurityHeaders(), injectBuildBanner()],
    server: { port: 5173, host: "127.0.0.1", strictPort: true }
  };
});
