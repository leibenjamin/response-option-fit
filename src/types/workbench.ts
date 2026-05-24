/* Shared specimen data for the walk puzzles and reference surfaces: failure
   pattern, optional source receipt, survey instrument frame, and specimen
   identity. */

export type FailurePattern =
  | "label_ambiguity"
  | "broad_bucket"
  | "false_premise"
  | "category_boundary_blur"
  | "sequence_overlap"
  | "forced_precision";

/* Source receipt: every specimen names one public report. The rendered
   receipt always shows agency, document code, year, retrieval date, and
   a direct link. */
export type SourceReceipt = {
  agency: string;
  documentCode: string;
  reportTitle: string;
  reportType: "cognitive_testing" | "experiment_paper" | "recommendation_doc";
  year: string;
  sectionOrPage: string;
  directUrl: string;
  retrievalDate: string;
};

export type CanonicalCitation = {
  author: string;
  year: number;
  locator: string;
};

export type MethodNote = {
  whyHere: string;
  whatOmitted: string;
};

/* A real respondent's own words from the cited cognitive-testing report. */
export type Verbatim = {
  quote: string;
  attribution: string;
};

/* The survey instrument shown inside the puzzle. Holds the tested
   wording, the surrounding question, and the highlighted answer
   choice. */
export type AnswerFrameTargetKind =
  | "response_option"
  | "text_field"
  | "heading"
  | "yes_no_path"
  | "sequence_item"
  | "numeric_field";

export type AnswerFrameLine = {
  id: string;
  text: string;
  isTarget?: boolean;
  note?: string;
};

export type AnswerFrame = {
  eyebrow: string;
  prompt: string;
  context: [string, ...string[]];
  targetKind: AnswerFrameTargetKind;
  targetLabel: string;
  targetText: string;
  responseOptions?: [AnswerFrameLine, ...AnswerFrameLine[]];
  methodNote?: string;
};

/* The puzzle specimen as exposed to the renderer. */
export type WorkbenchSpecimen = {
  /* Identity */
  id: string;
  number: string;
  /* Short label used in the sticky walk rail and subway strip. Optimized
     for tight horizontal space (12–18 chars). */
  railLabel: string;
  /* Slightly longer editorial label used in field-guide pattern checklists.
     Optimized for visitors who land on `#field-guide` without context
     and need a self-explanatory cross-link to the puzzle.
     Optional: components fall back to `railLabel` when missing. */
  fieldGuideLinkLabel?: string;
  pattern: FailurePattern;
  patternLabel: string;
  canonicalSubtitle: string;
  canonicalCitations: [CanonicalCitation, ...CanonicalCitation[]];

  /* The "When ..." claim title rendered above the puzzle. */
  title: string;

  /* The survey instrument rendered inside the puzzle: surrounding
     question, highlighted target answer, and response options. */
  answerFrame: AnswerFrame;

  /* Source */
  source: SourceReceipt;
  methodNote?: MethodNote | null;

  /* A real respondent's verbatim words from the cited report, surfaced as a
     quiet pulled quote in the reveal. Optional: only the examples whose source
     carries a vivid, on-point respondent sentence get one (identity examples
     never do — see the sensitive-example rule). */
  verbatim?: Verbatim;
};
