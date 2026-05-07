/* Hash-based routing for the four top-level views.

   This file is the single source of truth for route shape and parsing.
   App.tsx subscribes to hashchange and renders one of:
     hub       - the landing overview (Hero + Pattern Catalog + Featured
                 Example)
     walk      - paginated walk-through; walk.specimenId names the active
                 specimen, or "done" for the completion screen
     reference - Glossary + Method note + Claim boundary + Source appendix
     colophon  - production notes (already exists)

   Old `#exhibit` URLs continue to land on the hub so a stale link from the
   pre-overhaul version still resolves. */

export type WalkSpecimenSlot = string | "done";

export type Route =
  | { kind: "hub" }
  | { kind: "walk"; slot: WalkSpecimenSlot }
  | { kind: "reference" }
  | { kind: "colophon" };

export function parseHash(hash: string, knownSpecimenIds: readonly string[]): Route {
  const normalized = hash.replace(/^#\/?/, "").toLowerCase();
  if (normalized === "" || normalized === "exhibit") {
    return { kind: "hub" };
  }
  if (normalized === "colophon") {
    return { kind: "colophon" };
  }
  if (normalized === "reference") {
    return { kind: "reference" };
  }
  if (normalized === "walk" || normalized === "walk/") {
    return { kind: "walk", slot: knownSpecimenIds[0] ?? "done" };
  }
  if (normalized.startsWith("walk/")) {
    const slot = normalized.slice("walk/".length);
    if (slot === "done") return { kind: "walk", slot: "done" };
    if (knownSpecimenIds.includes(slot)) return { kind: "walk", slot };
    /* Unknown specimen id falls back to the hub so a typo or a removed
       specimen doesn't strand the visitor on a blank page. */
    return { kind: "hub" };
  }
  return { kind: "hub" };
}

export function routeToHash(route: Route): string {
  switch (route.kind) {
    case "hub":
      return "#";
    case "walk":
      return `#walk/${route.slot}`;
    case "reference":
      return "#reference";
    case "colophon":
      return "#colophon";
  }
}
