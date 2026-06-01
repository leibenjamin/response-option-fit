const MOUNT_PATH = "/response-option-fit";

/* Cloudflare Web Analytics beacon. It is injected here in the mount Worker —
   not in index.html — so it ships only in production and never loads during the
   local build or the Playwright suite (which assert no third-party requests).
   It is gated on a token: set `CF_BEACON_TOKEN` as a Worker variable after
   enabling Web Analytics in the Cloudflare dashboard (see docs/deployment.md).
   With no token, this Worker behaves exactly as before. The CSP already allows
   the beacon's domains (see public/_headers). */
const CF_BEACON_SRC = "https://static.cloudflareinsights.com/beacon.min.js";

function mountedAssetRequest(request) {
  const sourceUrl = new URL(request.url);
  const assetUrl = new URL(request.url);
  const strippedPath = sourceUrl.pathname.slice(MOUNT_PATH.length);

  assetUrl.pathname = strippedPath || "/";
  return new Request(assetUrl, request);
}

function isNavigationRequest(request) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return false;
  }

  const accept = request.headers.get("accept") ?? "";
  return accept.includes("text/html");
}

function isHtmlResponse(response) {
  return (response.headers.get("content-type") ?? "").includes("text/html");
}

/* A real Cloudflare Web Analytics token is a hex string; refuse anything else so
   a misconfigured variable can never break out of the data attribute. */
function isValidToken(token) {
  return typeof token === "string" && /^[a-f0-9]{16,64}$/i.test(token);
}

function injectBeacon(response, token) {
  const beacon =
    `<script defer src="${CF_BEACON_SRC}" ` +
    `data-cf-beacon='{"token":"${token}"}'></script>`;
  return new HTMLRewriter()
    .on("head", {
      element(element) {
        element.append(beacon, { html: true });
      }
    })
    .transform(response);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === MOUNT_PATH) {
      url.pathname = `${MOUNT_PATH}/`;
      return Response.redirect(url.toString(), 308);
    }

    if (!url.pathname.startsWith(`${MOUNT_PATH}/`)) {
      return new Response("Not found", { status: 404 });
    }

    const assetRequest = mountedAssetRequest(request);
    let assetResponse = await env.ASSETS.fetch(assetRequest);

    if (assetResponse.status === 404 && isNavigationRequest(request)) {
      const fallbackUrl = new URL(assetRequest.url);
      fallbackUrl.pathname = "/index.html";
      assetResponse = await env.ASSETS.fetch(new Request(fallbackUrl, request));
    }

    if (isValidToken(env.CF_BEACON_TOKEN) && isHtmlResponse(assetResponse)) {
      return injectBeacon(assetResponse, env.CF_BEACON_TOKEN);
    }

    return assetResponse;
  }
};
