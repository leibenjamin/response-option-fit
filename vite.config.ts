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

const appBase = process.env.VITE_BASE_PATH ?? "/";

export default defineConfig({
  base: appBase,
  plugins: [react(), injectProdSecurityHeaders()],
  server: { port: 5173, host: "127.0.0.1", strictPort: true }
});
