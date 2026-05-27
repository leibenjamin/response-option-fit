/* Hash-based routing for the top-level views.

   This file is the single source of truth for route shape and parsing.
   App.tsx subscribes to hashchange and renders one of:
     lab       - the home destination (empty hash / `#` / `#lab`): the
                 SQLBolt-style multi-exercise practice page on response-
                 option design issues, plus the closing knowledge map
                 (see SatisfactionLab). Replaced the old hub as the
                 default 2026-05-26.
     hub       - the previous landing overview (Hero + FeaturedHook +
                 PatternStrip + FeaturedExample), now accessible only by
                 explicit URL `#hub` for reference / archival.
     walk      - paginated walk-through; walk.specimenId names the active
                 specimen, or "done" for the completion screen
     build     - standalone build-and-break mechanic: visitors assemble
                 answer choices, then computed situations drop through them
     reference - Glossary + Method note + Claim boundary + Source appendix
     fieldGuide - reviewer console, reusable tests, and static prompt pack
     colophon  - production notes

   Old `#exhibit` URLs continue to resolve so stale links from the pre-
   overhaul version still land on the current home. */

export type WalkSpecimenSlot = string | "done";

export type Route =
  | { kind: "lab" }
  | { kind: "hub" }
  | { kind: "walk"; slot: WalkSpecimenSlot }
  | { kind: "build" }
  | { kind: "reference" }
  | { kind: "fieldGuide" }
  | { kind: "colophon" };

export function parseHash(hash: string, knownSpecimenIds: readonly string[]): Route {
  const normalized = hash.replace(/^#\/?/, "").toLowerCase();
  /* Default destination = lab. The "exhibit" hash from pre-overhaul URLs
     also lands here so stale links resolve to the current home. */
  if (normalized === "" || normalized === "exhibit" || normalized === "lab") {
    return { kind: "lab" };
  }
  if (normalized === "hub") {
    return { kind: "hub" };
  }
  if (normalized === "colophon") {
    return { kind: "colophon" };
  }
  if (normalized === "reference") {
    return { kind: "reference" };
  }
  if (normalized === "build") {
    return { kind: "build" };
  }
  if (normalized === "field-guide" || normalized.startsWith("field-guide-")) {
    return { kind: "fieldGuide" };
  }
  if (normalized === "walk" || normalized === "walk/") {
    return { kind: "walk", slot: knownSpecimenIds[0] ?? "done" };
  }
  if (normalized.startsWith("walk/")) {
    const slot = normalized.slice("walk/".length);
    if (slot === "done") return { kind: "walk", slot: "done" };
    if (knownSpecimenIds.includes(slot)) return { kind: "walk", slot };
    /* Unknown specimen id falls back to the lab home so a typo or a
       removed specimen doesn't strand the visitor on a blank page. */
    return { kind: "lab" };
  }
  return { kind: "lab" };
}

export function routeToHash(route: Route): string {
  switch (route.kind) {
    case "lab":
      return "#";
    case "hub":
      return "#hub";
    case "walk":
      return `#walk/${route.slot}`;
    case "build":
      return "#build";
    case "reference":
      return "#reference";
    case "fieldGuide":
      return "#field-guide";
    case "colophon":
      return "#colophon";
  }
}
