import type { PredictionCopy, VignetteOutcome } from "../types/workbench";

export const outcomeLabels = {
  covered: "Fits target path",
  ambiguous: "Can route two ways",
  not_covered: "Outside target path"
} satisfies Record<VignetteOutcome, string>;

export const outcomeDescriptions = {
  covered: "the highlighted answer path covers this scenario",
  ambiguous: "the same scenario could reasonably use more than one path",
  not_covered: "the highlighted answer path should not cover this scenario"
} satisfies Record<VignetteOutcome, string>;

export function outcomeLabel(
  outcome: VignetteOutcome | null | undefined,
  predictionCopy?: PredictionCopy
) {
  if (!outcome) return "not marked";
  return predictionCopy?.[outcome]?.label ?? outcomeLabels[outcome];
}
