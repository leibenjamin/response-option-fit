const MOUNT_PATH = "/response-option-fit";

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
    const assetResponse = await env.ASSETS.fetch(assetRequest);

    if (assetResponse.status !== 404 || !isNavigationRequest(request)) {
      return assetResponse;
    }

    const fallbackUrl = new URL(assetRequest.url);
    fallbackUrl.pathname = "/index.html";
    return env.ASSETS.fetch(new Request(fallbackUrl, request));
  }
};
