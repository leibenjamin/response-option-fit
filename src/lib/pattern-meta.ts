/* Per-pattern metadata that is shared across the new layout — Hub catalog,
   walk-mode rail map, subway strip, and recap interstitials all read from
   this single source.

   The `accentVar` is a CSS custom property name that maps to a pattern-tinted
   ink color. The actual color tokens live in src/index.css; this file only
   names them so the components stay token-stable. */

import type { FailurePattern } from "../types/workbench";

export const patternOrder: readonly FailurePattern[] = [
  "label_ambiguity",
  "broad_bucket",
  "false_premise",
  "category_boundary_blur",
  "sequence_overlap",
  "forced_precision"
];

type PatternMeta = {
  pattern: FailurePattern;
  /* Plain-language label that doubles as the catalog card title. */
  label: string;
  /* The italicized canonical subtitle from the catalog. */
  canonicalSubtitle: string;
  /* The CSS custom-property name for this pattern's accent color. */
  accentVar: string;
};

export const patternMeta: Record<FailurePattern, PatternMeta> = {
  label_ambiguity: {
    pattern: "label_ambiguity",
    label: "Label ambiguity",
    canonicalSubtitle: "Same words, several meanings",
    accentVar: "--pat-label-ambiguity"
  },
  broad_bucket: {
    pattern: "broad_bucket",
    label: "Broad bucket",
    canonicalSubtitle: "One answer space covers too much",
    accentVar: "--pat-broad-bucket"
  },
  false_premise: {
    pattern: "false_premise",
    label: "False premise",
    canonicalSubtitle: "Question assumes too much",
    accentVar: "--pat-false-premise"
  },
  category_boundary_blur: {
    pattern: "category_boundary_blur",
    label: "Category boundary blur",
    canonicalSubtitle: "Categories overlap",
    accentVar: "--pat-category-boundary-blur"
  },
  sequence_overlap: {
    pattern: "sequence_overlap",
    label: "Sequence overlap",
    canonicalSubtitle: "Earlier question changes the next answer",
    accentVar: "--pat-sequence-overlap"
  },
  forced_precision: {
    pattern: "forced_precision",
    label: "Forced precision",
    canonicalSubtitle: "One exact answer required",
    accentVar: "--pat-forced-precision"
  }
};
