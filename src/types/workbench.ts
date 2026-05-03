/* Specimen Workbench data shape. JSON-serializable; every field below can
   be written by hand or generated, then validated and rendered by the
   Workbench component without runtime side effects.

   The shape exists to lock the architecture before any widget UI is built,
   so we discover early whether all six failure patterns can be expressed
   uniformly. If a pattern cannot be described in this shape, the shape is
   wrong, not the pattern. */

export type FailurePattern =
  | "label_ambiguity"
  | "broad_bucket"
  | "false_premise"
  | "category_boundary_blur"
  | "sequence_overlap"
  | "forced_precision";

/* Vignettes are the load-bearing pedagogical content. Each one is either
   a verbatim or close paraphrase from a public questionnaire-testing
   report (provenance: "direct_quote") or an explicit editorial illustration
   constructed by us based on the report's findings (provenance: "editorial").
   The Workbench renders a visible badge on every vignette so the distinction
   is never hidden in a footnote. */
export type VignetteProvenance = "direct_quote" | "editorial";

export type VignetteOutcome = "covered" | "ambiguous" | "not_covered";

export type Vignette = {
  id: string;
  text: string;
  provenance: VignetteProvenance;
  /* Citation is required for direct quotes; optional but encouraged for
     editorial vignettes where the underlying finding has a page citation. */
  citation?: {
    reportTitle: string;
    page: string;
    permalink?: string;
  };
  /* For editorial vignettes only: a one-line note explaining what report
     finding the editorial is grounded in. Direct-quote vignettes leave
     this empty — the citation tells the whole story. Editorial vignettes
     without an attributionNote drift into unmoored fabrication and the
     content authoring step should reject them. */
  attributionNote?: string;
  /* What outcome the *published wording* produces for this vignette under
     the specimen's tested wording. Revealed in the Diagnose beat. Ternary
     because Diagnose reports evidence, not inference. */
  expectedOutcome: VignetteOutcome;
  /* Short answer-key explanation shown after reveal. */
  outcomeRationale: string;
  /* Dynamic probe explanations keyed to the user's hypothetical edit result.
     Probe outcomes are binary, so these two strings explain why the live
     widget currently appears to resolve or not resolve the same vignette. */
  probeRationale: {
    covered: string;
    notCovered: string;
  };
};

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

/* Predict beat: the user marks each vignette covered/ambiguous/not_covered,
   rates confidence, and answers a required mechanism question that anchors
   diagnosis to a wording feature rather than to a respondent stereotype. */
export type ConfidenceLevel = "guessing" | "hunch" | "fairly_sure";

export type MechanismChoice = {
  id: string;
  text: string;
  isCorrect: boolean;
  /* Shown after submission regardless of correctness. */
  explanation: string;
};

export type MechanismQuestion = {
  prompt: string;
  choices: MechanismChoice[];
};

/* Diagnose beat: contrasts the active pattern with its nearest neighbor in
   the catalog. The neighbor and contrast text are authored per specimen so
   the contrast is concrete, not generic. */
export type NeighborContrast = {
  pattern: FailurePattern;
  contrastText: string;
};

/* Probe beat widgets. Each widget config is JSON-shaped and self-contained.
   The diagnostic rule maps widget state to vignette outcomes; no side effects.

   IMPORTANT: every widget must be expressible without drag-only interaction
   (WCAG 2.5.7). Widget kinds that historically suggest drag (bucket splitter,
   sequence reorderer) ship with button-driven primary controls; drag is an
   optional sighted-mouse enhancement.

   Widget diagnostic outcomes are BINARY for the user's edit (covered vs
   not_covered). The page renders cautious copy ("Likely covered," "Still
   appears ambiguous") rather than implying we can ternary-classify the
   user's hypothetical edit. Vignette.expectedOutcome stays ternary because
   it reports the published wording's documented behavior, not an inference
   about the user's edit. */

export type WidgetKind =
  | "example_set_editor"
  | "bucket_splitter"
  | "filter_path_toggle"
  | "classifier_radio"
  | "sequence_reorderer"
  | "time_window_slider";

export type ExampleSetEditorConfig = {
  kind: "example_set_editor";
  initialExampleIds: string[];
  candidates: Array<{ id: string; label: string }>;
  /* For each vignette, the sets of example-IDs that resolve it cleanly. If
     none match, the vignette stays ambiguous. */
  diagnostic: Record<string, { coveredBy: string[][] }>;
};

export type BucketSplitterConfig = {
  kind: "bucket_splitter";
  items: Array<{ id: string; label: string }>;
  initialSplitIndex: number | null;
  candidateSplits: number[];
  /* For each vignette, which split positions produce a clean bucket fit. */
  diagnostic: Record<string, { cleanAt: number[] }>;
};

export type FilterPathToggleConfig = {
  kind: "filter_path_toggle";
  initialState: { hasScreener: boolean; hasNotApplicable: boolean };
  /* For each vignette, the toggle states that resolve it cleanly. Empty
     means no toggle state can resolve this vignette (a forced-floor case). */
  diagnostic: Record<
    string,
    {
      cleanStates: Array<{ hasScreener: boolean; hasNotApplicable: boolean }>;
    }
  >;
};

export type ClassifierRadioConfig = {
  kind: "classifier_radio";
  features: Array<{ id: string; label: string; description: string }>;
  initialFeatureId: string;
  /* For each vignette, which classifying features bin it cleanly. */
  diagnostic: Record<string, { cleanFeatureIds: string[] }>;
};

export type SequenceReordererConfig = {
  kind: "sequence_reorderer";
  items: Array<{ id: string; label: string }>;
  initialOrder: string[];
  initialAllowMulti: boolean;
  /* For each vignette, the configurations that resolve it cleanly. */
  diagnostic: Record<
    string,
    {
      cleanOrders: string[][];
      requiresMulti: boolean;
    }
  >;
};

export type TimeWindowSliderConfig = {
  kind: "time_window_slider";
  windows: Array<{ id: string; label: string; days: number }>;
  initialWindowId: string;
  /* For each vignette, which windows produce stable, recoverable answers. */
  diagnostic: Record<string, { stableWindowIds: string[] }>;
};

export type WidgetConfig =
  | ExampleSetEditorConfig
  | BucketSplitterConfig
  | FilterPathToggleConfig
  | ClassifierRadioConfig
  | SequenceReordererConfig
  | TimeWindowSliderConfig;

/* Reveal beat splits into two visibly separate blocks, both required. The
   "remainsUntested" block must name at least one residual risk by string
   so the page never reads as endorsement of the user's edit or the source
   team's revision. */
export type RevealAddresses = {
  revisionDescription: string;
  sourcePageRef: string;
};

export type RevealRemainsUntested = {
  residualRisks: [string, ...string[]];
  claimBoundaryNote: string;
};

export type Reveal = {
  addresses: RevealAddresses;
  remainsUntested: RevealRemainsUntested;
};

/* Micro-cases run after Reveal: one near-transfer (same pattern, fresh
   wording), one distractor (tempting but adjacent pattern). The user picks
   the failing wording feature; explanation reveals immediately. */
export type MicroCaseKind = "near_transfer" | "distractor";

type MicroCaseBase = {
  id: string;
  wording: string;
  pattern: FailurePattern;
  featureChoices: string[];
  correctFeatureIndex: number;
  explanation: string;
};

export type NearTransferCase = MicroCaseBase & { kind: "near_transfer" };
export type DistractorCase = MicroCaseBase & { kind: "distractor" };
export type MicroCase = NearTransferCase | DistractorCase;

/* The microCases tuple is ordered: [near_transfer, distractor]. TypeScript
   enforces both the length and the order through the discriminated tuple. */
export type MicroCasePair = [NearTransferCase, DistractorCase];

/* Optional counterexample beat: shown inside Reveal for specimens whose
   source report documents an iterated wording that improved data quality. */
export type Counterexample = {
  eyebrow: string;
  beforeWording: string;
  afterWording: string;
  evidenceOfImprovement: string;
  sourcePageRef: string;
};

/* Existing route stages stay; the Diagnose beat reuses the route map. */
export type RouteStageKind =
  | "respondent_reality"
  | "tested_wording"
  | "route_break"
  | "data_consequence";

export type RouteStage = {
  id: string;
  kind: RouteStageKind;
  eyebrow: string;
  title: string;
  detail: string;
};

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

/* The Workbench specimen. Every beat's content lives here; the component
   tree renders this without computing pedagogically meaningful state. */
export type WorkbenchSpecimen = {
  /* Identity */
  id: string;
  number: string;
  railLabel: string;
  pattern: FailurePattern;
  patternLabel: string;
  canonicalSubtitle: string;
  canonicalCitations: [CanonicalCitation, ...CanonicalCitation[]];

  /* Frame beat */
  title: string;
  subtitle: string;
  testedWording: string;
  answerFrame: AnswerFrame;
  intendedConstruct: string;
  /* A short narrative anchor for informed-guessing scaffolding. */
  sampleRespondent: string;
  /* Pre-vocabulary surfaced in Frame: pattern name + one-sentence definition,
     so the Predict beat is not simultaneously teaching terminology. */
  prerequisiteVocab: string;

  /* Predict beat */
  vignettes: Vignette[];
  mechanismQuestion: MechanismQuestion;

  /* Diagnose beat */
  routeStages: RouteStage[];
  neighborContrast: NeighborContrast;

  /* Probe beat */
  widget: WidgetConfig;
  probePrompt: string;

  /* Reveal beat */
  reveal: Reveal;

  /* Micro-cases — ordered tuple [near_transfer, distractor]. */
  microCases: MicroCasePair;

  /* Source */
  source: SourceReceipt;
  verifiedAgainstSource?: VerifiedAgainstSource;
  methodNote?: MethodNote | null;

  /* Optional counterexample */
  counterexample?: Counterexample;
};

/* Catalog metadata: the ordered set of specimens, with the pacing model the
   exhibit recommends. Sessions are not enforced — the user is free to read
   straight through — but the Workbench surfaces "good stopping point" cues
   at session boundaries. */
export type SessionPlan = {
  sessions: Array<{
    label: string;
    specimenIds: string[];
    mixedReviewIds?: string[];
  }>;
  capstoneSpecimenIds: string[];
};

/* Per-pattern metadata used by the Pattern Glossary's neighbor-pattern map. */
export type PatternMeta = {
  pattern: FailurePattern;
  label: string;
  oneLine: string;
  /* Patterns most often confused with this one. The glossary draws a small
     visual link between adjacent cards based on these IDs. */
  neighbors: FailurePattern[];
};
