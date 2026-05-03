import type { VignetteOutcome } from "../types/workbench";

export const outcomeLabels = {
  covered: "Clean fit",
  ambiguous: "Unclear fit",
  not_covered: "Wrong path"
} satisfies Record<VignetteOutcome, string>;

export const outcomeDescriptions = {
  covered: "the highlighted answer path fits cleanly",
  ambiguous: "the same reality can route more than one way",
  not_covered: "the highlighted path is the wrong place"
} satisfies Record<VignetteOutcome, string>;

export function outcomeLabel(outcome: VignetteOutcome | null | undefined) {
  return outcome ? outcomeLabels[outcome] : "not marked";
}
