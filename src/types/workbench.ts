/* Type shapes for the worked-example walk. The 2026-05-21 engine-retirement
   wave removed the twelve "experience engine" types (one interaction primitive
   reskinned twelve times); walk examples now render either a bespoke puzzle
   (see src/components/puzzles/) or the lightweight ExampleExposition from this
   same specimen data. What remains here is the minimum the current code path
   needs: the failure pattern, the source receipt, the survey instrument
   (answerFrame), and the specimen itself.

   The shape stays here, rather than next to each consumer, so the data
   author can lock the contract in one place. */

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

/* The survey instrument shown inside the engine. Holds the tested
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
  taskPrompt: string;
  methodNote?: string;
};

/* The worked example as exposed to the renderer. */
export type WorkbenchSpecimen = {
  /* Identity */
  id: string;
  number: string;
  /* Short label used in the sticky walk rail and subway strip. Optimized
     for tight horizontal space (12–18 chars). */
  railLabel: string;
  /* Slightly longer editorial label used in field-guide pattern checklists.
     Optimized for visitors who land on `#field-guide` without context
     and need a self-explanatory cross-link to the worked example.
     Optional: components fall back to `railLabel` when missing. */
  fieldGuideLinkLabel?: string;
  pattern: FailurePattern;
  patternLabel: string;
  canonicalSubtitle: string;
  canonicalCitations: [CanonicalCitation, ...CanonicalCitation[]];

  /* The "When …" claim title rendered above the engine. */
  title: string;

  /* The survey instrument rendered inside the engine: surrounding
     question, highlighted target answer, and response options. */
  answerFrame: AnswerFrame;

  /* Source */
  source: SourceReceipt;
  methodNote?: MethodNote | null;
};
