import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// frame-ancestors is intentionally NOT in the meta CSP — that directive is
// only honored as an HTTP response header and is ignored when delivered via
// <meta http-equiv>. See public/_headers for the real header CSP.
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

export default defineConfig(({ command, isPreview }) => {
  const buildOrPreview = command === "build" || isPreview === true;
  const appBase = process.env.VITE_BASE_PATH ?? (buildOrPreview ? DEPLOY_BASE : "/");

  return {
    base: appBase,
    plugins: [react(), injectProdSecurityHeaders()],
    server: { port: 5173, host: "127.0.0.1", strictPort: true }
  };
});
