import type { PredictionCopy, VignetteOutcome } from "../types/workbench";

export const outcomeLabels = {
  covered: "Answer choice fits",
  ambiguous: "Could be marked more than one way",
  not_covered: "Needs a different answer"
} satisfies Record<VignetteOutcome, string>;

export const outcomeDescriptions = {
  covered: "the highlighted answer choice works for this scenario",
  ambiguous: "the same scenario could reasonably be marked more than one way",
  not_covered: "the highlighted answer choice should not be used for this scenario"
} satisfies Record<VignetteOutcome, string>;

export function outcomeLabel(
  outcome: VignetteOutcome | null | undefined,
  predictionCopy?: PredictionCopy
) {
  if (!outcome) return "not marked";
  return predictionCopy?.[outcome]?.label ?? outcomeLabels[outcome];
}
