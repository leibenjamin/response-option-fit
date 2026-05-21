/* Type shapes for the worked-example walk. After the 2026-05-19 second-
   engine wave every public specimen renders through the experience engine
   (see ExampleExperience.tsx). The 2026-05-20 legacy-cleanup wave removed
   the older case-lab / five-step types that used to live here; what
   remains is the minimum the current code path actually needs.

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

export type VerifiedAgainstSource = {
  date: string;
  method: "manual_pdf_check" | "automated";
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

/* Specimen-specific interaction engine. One per worked example. */

export type ExampleExperienceKind =
  | "meaning_lens"
  | "level_ladder"
  | "eligibility_fork"
  | "feature_rule_board"
  | "source_timeline"
  | "schedule_trace"
  | "device_label_splitter"
  | "visibility_route"
  | "premise_stack"
  | "heading_scanner"
  | "reason_strength_board"
  | "counting_workbench";

export type ExperienceTone =
  | "target"
  | "edge"
  | "outside"
  | "warning"
  | "method"
  | "neutral";

export type ExperienceZone = {
  id: string;
  label: string;
  description: string;
  tone?: ExperienceTone;
};

export type ExperienceControl = {
  id: string;
  label: string;
  description: string;
  effect: string;
};

export type ExperienceCaseResult = {
  zoneId: string;
  note: string;
};

export type ExperienceCase = {
  id: string;
  title: string;
  body: string;
  reading: string;
  provenance: "reported" | "source_grounded" | "teaching";
  defaultZoneId: string;
  tags: string[];
  resultByControl?: Record<string, ExperienceCaseResult>;
};

export type ExperienceEngineInteraction =
  | "lens_map"
  | "level_ladder"
  | "eligibility_fork"
  | "feature_matrix"
  | "source_timeline"
  | "schedule_trace"
  | "device_shelf"
  | "visibility_route"
  | "premise_stack"
  | "heading_scanner"
  | "reason_lanes"
  | "counting_calendar";

type ExperienceEngineBase<
  Kind extends ExampleExperienceKind,
  Interaction extends ExperienceEngineInteraction
> = {
  kind: Kind;
  interaction: Interaction;
  actionLabel: string;
  objectLabel: string;
  surfaceLabel: string;
  feedbackLabel: string;
};

export type ExperienceEngineSpec =
  | ExperienceEngineBase<"meaning_lens", "lens_map">
  | ExperienceEngineBase<"level_ladder", "level_ladder">
  | ExperienceEngineBase<"eligibility_fork", "eligibility_fork">
  | ExperienceEngineBase<"feature_rule_board", "feature_matrix">
  | ExperienceEngineBase<"source_timeline", "source_timeline">
  | ExperienceEngineBase<"schedule_trace", "schedule_trace">
  | ExperienceEngineBase<"device_label_splitter", "device_shelf">
  | ExperienceEngineBase<"visibility_route", "visibility_route">
  | ExperienceEngineBase<"premise_stack", "premise_stack">
  | ExperienceEngineBase<"heading_scanner", "heading_scanner">
  | ExperienceEngineBase<"reason_strength_board", "reason_lanes">
  | ExperienceEngineBase<"counting_workbench", "counting_calendar">;

export type ExperienceRepairOption = {
  id: string;
  label: string;
  headline: string;
  body: string;
  effects: [string, ...string[]];
  caution: string;
};

export type ExperienceTransfer = {
  title: string;
  prompt: string;
  options: [string, string, ...string[]];
  preferredIndex: number;
  feedback: string;
};

export type WorkbenchExperience = {
  kind: ExampleExperienceKind;
  engine: ExperienceEngineSpec;
  title: string;
  lede: string;
  stakes: string;
  reviewerGoal: string;
  surfaceTitle: string;
  controlLabel: string;
  caseLabel: string;
  mapLabel: string;
  instrumentNote: string;
  zones: [ExperienceZone, ExperienceZone, ...ExperienceZone[]];
  controls: [ExperienceControl, ...ExperienceControl[]];
  cases: [ExperienceCase, ...ExperienceCase[]];
  repair: {
    title: string;
    lede: string;
    options: [ExperienceRepairOption, ...ExperienceRepairOption[]];
  };
  transfer: ExperienceTransfer;
  sourceBoundary: {
    title: string;
    body: string;
    limits: [string, ...string[]];
  };
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
  verifiedAgainstSource?: VerifiedAgainstSource;
  methodNote?: MethodNote | null;

  /* Specimen-specific reviewer interaction engine. Every current public
     specimen carries one; the renderer narrows on this. */
  experience: WorkbenchExperience;
};
