/* Per-pattern metadata that is shared across the layout — hub pattern
   strip, hub modal, walk-mode rail map, subway strip, and recap
   interstitials all read from this single source.

   `accentVar` is a CSS custom property name that maps to a pattern-
   tinted ink color. The actual color tokens live in src/index.css; this
   file only names them so the components stay token-stable.

   `expandedBody` is the longer plain-language description the full-
   variant catalog cards render under the canonical subtitle. Keeping it
   here gives the pattern card one source of truth. */

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
  /* The longer plain-language description shown only in the full
     catalog variant (not in the slim rail or the in-scroll strip). */
  expandedBody: string;
  /* The CSS custom-property name for this pattern's accent color. */
  accentVar: string;
};

export const patternMeta: Record<FailurePattern, PatternMeta> = {
  label_ambiguity: {
    pattern: "label_ambiguity",
    label: "Label ambiguity",
    canonicalSubtitle: "Same words, several meanings",
    expandedBody:
      "The wording of a single answer choice can be read in more than one everyday way. Two respondents in the same real situation can pick different answers because they understand the same words differently.",
    accentVar: "--pat-label-ambiguity"
  },
  broad_bucket: {
    pattern: "broad_bucket",
    label: "Broad bucket",
    canonicalSubtitle: "One answer space accepts answers at several levels",
    expandedBody:
      "A single answer space — a write-in box or one tick-box — accepts responses at very different scopes. The same job, for example, can be reported as a workplace, a business type, or a whole industry, and all three look like fitting answers.",
    accentVar: "--pat-broad-bucket"
  },
  false_premise: {
    pattern: "false_premise",
    label: "False premise",
    canonicalSubtitle: "Question assumes a condition that may not hold",
    expandedBody:
      "A question assumes a condition holds — for instance, that the household owns the equipment being asked about — without first checking whether that is true for this respondent.",
    accentVar: "--pat-false-premise"
  },
  category_boundary_blur: {
    pattern: "category_boundary_blur",
    label: "Category boundary blur",
    canonicalSubtitle: "Nearby categories lack a clear rule",
    expandedBody:
      "Two or more nearby answer choices share enough features that the line between them is unclear. The respondent may understand each word and still not know which neighbor a real case belongs in.",
    accentVar: "--pat-category-boundary-blur"
  },
  sequence_overlap: {
    pattern: "sequence_overlap",
    label: "Sequence overlap",
    canonicalSubtitle: "Earlier question changes how the next answer is read",
    expandedBody:
      "An earlier question changes how the next question or answer choice is read. After the earlier answer, a later one can feel like a repeat or a contradiction even when its wording is clear in isolation.",
    accentVar: "--pat-sequence-overlap"
  },
  forced_precision: {
    pattern: "forced_precision",
    label: "Forced precision",
    canonicalSubtitle: "One exact answer where reality varies",
    expandedBody:
      "A single survey question asks for one exact-looking number or one specific answer about a situation that varies over time or is hard to count exactly.",
    accentVar: "--pat-forced-precision"
  }
};
