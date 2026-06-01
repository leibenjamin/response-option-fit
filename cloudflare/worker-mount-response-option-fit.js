/* Mount Worker for benlei.org/response-option-fit/.

   It reverse-proxies the Cloudflare Pages deployment under the path prefix and
   sets the site's security headers (including the CSP) itself, overriding
   whatever the Pages origin returns. This file is the reference copy of the
   Worker that runs in the Cloudflare dashboard; keep them in sync.

   Cloudflare Web Analytics: set CF_BEACON_TOKEN below to the hex token from the
   dashboard (Analytics & Logs -> Web Analytics -> your site). When it is set,
   the Worker injects the cookieless beacon into HTML responses and widens its
   own CSP to allow it. Leave it "" to keep analytics off. The token is not a
   secret — it ships in the page — so it is fine to hardcode here. See
   docs/deployment.md. */

const PREFIX = "/response-option-fit";
const PAGES_ORIGIN = "https://response-option-fit.pages.dev";

const CF_BEACON_TOKEN = ""; // paste the hex token to enable analytics
const CF_BEACON_SRC = "https://static.cloudflareinsights.com/beacon.min.js";

/* A real Web Analytics token is a hex string; refuse anything else so a
   misconfigured value can never break out of the data attribute. */
function analyticsEnabled() {
  return /^[a-f0-9]{16,64}$/i.test(CF_BEACON_TOKEN);
}

function securityHeaders(base, analyticsOn) {
  const headers = new Headers(base);
  const scriptSrc = analyticsOn
    ? "'self' https://static.cloudflareinsights.com"
    : "'self'";
  const connectSrc = analyticsOn
    ? "'self' https://cloudflareinsights.com"
    : "'self'";
  headers.set(
    "Content-Security-Policy",
    `default-src 'none'; script-src ${scriptSrc}; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src ${connectSrc}; form-action 'none'; base-uri 'self'; frame-ancestors 'none'`
  );
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set(
    "Permissions-Policy",
    "accelerometer=(), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=(), interest-cohort=()"
  );
  return headers;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === PREFIX) {
      url.pathname = `${PREFIX}/`;
      return Response.redirect(url.toString(), 308);
    }

    if (!url.pathname.startsWith(`${PREFIX}/`)) {
      return new Response("Not found", { status: 404 });
    }

    const upstreamUrl = new URL(PAGES_ORIGIN);
    upstreamUrl.pathname = url.pathname.slice(PREFIX.length) || "/";
    upstreamUrl.search = url.search;

    let upstreamResponse = await fetch(
      new Request(upstreamUrl.toString(), {
        method: request.method,
        headers: request.headers,
        body:
          request.method === "GET" || request.method === "HEAD"
            ? undefined
            : request.body,
        redirect: "follow"
      })
    );

    const accept = request.headers.get("accept") || "";
    if (upstreamResponse.status === 404 && accept.includes("text/html")) {
      const fallbackUrl = new URL(PAGES_ORIGIN);
      fallbackUrl.pathname = "/";
      upstreamResponse = await fetch(fallbackUrl.toString(), {
        headers: request.headers,
        redirect: "follow"
      });
    }

    const analyticsOn = analyticsEnabled();
    const headers = securityHeaders(upstreamResponse.headers, analyticsOn);
    const contentType = upstreamResponse.headers.get("content-type") || "";

    if (analyticsOn && contentType.includes("text/html")) {
      /* Injecting changes the body, so drop length/encoding and let the runtime
         re-encode; HTMLRewriter decodes the upstream body to parse it. */
      headers.delete("content-length");
      headers.delete("content-encoding");
      const beacon =
        `<script defer src="${CF_BEACON_SRC}" ` +
        `data-cf-beacon='{"token":"${CF_BEACON_TOKEN}"}'></script>`;
      const transformed = new HTMLRewriter()
        .on("head", {
          element(element) {
            element.append(beacon, { html: true });
          }
        })
        .transform(upstreamResponse);
      return new Response(transformed.body, {
        status: upstreamResponse.status,
        statusText: upstreamResponse.statusText,
        headers
      });
    }

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers
    });
  }
};
