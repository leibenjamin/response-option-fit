/* Hash-based routing for the top-level views.

   The site is the response-options lab. App.tsx subscribes to hashchange and
   renders one of:
     lab       - the home (empty hash / `#` / `#lab`): the SQLBolt-style
                 multi-exercise practice page plus the closing knowledge map
                 (see SatisfactionLab).
     colophon  - production notes (`#colophon`).

   An earlier version had additional routes (an overview hub, a paginated walk,
   a build-and-break mechanic, a field guide, and a reference shelf); those were
   retired 2026-05-31. Any unrecognized hash — including those old URLs and the
   pre-overhaul `#exhibit` — resolves to the lab so old links still land on the
   current home. */

export type Route = { kind: "lab" } | { kind: "colophon" };

export function parseHash(hash: string): Route {
  const normalized = hash.replace(/^#\/?/, "").toLowerCase();
  if (normalized === "colophon") {
    return { kind: "colophon" };
  }
  return { kind: "lab" };
}

export function routeToHash(route: Route): string {
  switch (route.kind) {
    case "lab":
      return "#";
    case "colophon":
      return "#colophon";
  }
}
