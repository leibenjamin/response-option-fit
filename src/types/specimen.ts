export type FailurePattern =
  | "label_ambiguity"
  | "broad_bucket"
  | "false_premise"
  | "category_boundary_blur"
  | "sequence_overlap";

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
  reportTitle: string;
  year: string;
  sectionOrPage: string;
  directUrl: string;
  attribution: string;
};

export type Specimen = {
  id: string;
  number: string;
  railLabel: string;
  title: string;
  subtitle: string;
  pattern: FailurePattern;
  patternLabel: string;
  testedWording: string;
  respondentReality: string;
  intendedConstruct: string;
  routeStages: RouteStage[];
  testingFindingSummary: string;
  dataConsequence: string;
  dataLoss: string;
  repairDirection: string;
  safeTakeaway: string;
  source: SourceReceipt;
};
