import type { FailurePattern } from "../types/workbench";

export type PatternApplicationGuide = {
  pattern: FailurePattern;
  fieldGuideId: string;
  warning: string;
  checks: [string, string, string];
};

export type MixedReviewItem = {
  id: string;
  prompt: string;
  options: [FailurePattern, FailurePattern];
  explanation: string;
};

export type RecapRetrievalPrompt = {
  threshold: number;
  prompt: string;
  options: [FailurePattern, FailurePattern, FailurePattern];
  explanation: string;
};

export const patternApplicationGuides: Record<
  FailurePattern,
  PatternApplicationGuide
> = {
  label_ambiguity: {
    pattern: "label_ambiguity",
    fieldGuideId: "field-guide-label_ambiguity",
    warning:
      "If one label carries several meanings, the same real answer can split before analysis begins.",
    checks: [
      "Ask three likely respondents to paraphrase the highlighted answer choice without seeing the intended definition.",
      "Write one scenario where the label is plainly in, one where it is plainly out, and one where ordinary language could go either way.",
      "Add examples only when they clarify the meaning without quietly excluding in-scope answers."
    ]
  },
  broad_bucket: {
    pattern: "broad_bucket",
    fieldGuideId: "field-guide-broad_bucket",
    warning:
      "A broad answer space can make unlike answers look equally acceptable.",
    checks: [
      "List the levels of detail the answer space invites: person, place, organization, activity, category, or write-in.",
      "Check whether two answers at different levels would be coded as if they meant the same thing.",
      "Split the field, add examples, or change the instruction when the survey needs one level and the respondent supplies another."
    ]
  },
  false_premise: {
    pattern: "false_premise",
    fieldGuideId: "field-guide-false_premise",
    warning:
      "No is dangerous when the question never first checked whether the question applies.",
    checks: [
      "Before the yes/no item, write the applicability condition the respondent must meet.",
      "Ask what No could mean: no event, no equipment, no exposure, no memory, or not applicable.",
      "Use a screener, skip, or visible not-applicable route when the denominator matters."
    ]
  },
  category_boundary_blur: {
    pattern: "category_boundary_blur",
    fieldGuideId: "field-guide-category_boundary_blur",
    warning:
      "Boundary blur is not ignorance; the respondent may know the facts and still lack the rule.",
    checks: [
      "Name the feature that should classify the answer: source, ownership, function, timing, technology, or identity cue.",
      "Compare the target option with its nearest neighbor and write what belongs only in each one.",
      "Test the borderline case, not only the easy examples at the center of each category."
    ]
  },
  sequence_overlap: {
    pattern: "sequence_overlap",
    fieldGuideId: "field-guide-sequence_overlap",
    warning:
      "A good answer choice can break when the previous answer changes what it seems to mean.",
    checks: [
      "Read the item aloud with the preceding question and answer choice, not as a standalone sentence.",
      "Mark whether the current item asks for any influence, the main influence, a new source, or a repeated source.",
      "Add instructions, reorder items, or allow multiple responses only after checking what the sequence is trying to measure."
    ]
  },
  forced_precision: {
    pattern: "forced_precision",
    fieldGuideId: "field-guide-forced_precision",
    warning:
      "Exact-looking answers often hide a private counting method.",
    checks: [
      "Write the counting method the survey expects: average, most common, current, any, calendar count, or rounded estimate.",
      "Ask whether a person with variable experience can recover that answer from memory or records.",
      "Use ranges, shorter windows, explicit rules, or follow-ups when one precise number overstates what people know."
    ]
  }
};

export const mixedReviewItems: readonly MixedReviewItem[] = [
  {
    id: "label-vs-boundary",
    prompt:
      "A respondent has a 2-in-1 tablet/laptop, but the survey offers laptop and tablet with no rule for which feature controls the answer.",
    options: ["label_ambiguity", "category_boundary_blur"],
    explanation:
      "The word meanings may be familiar; the harder issue is the boundary between neighboring device categories."
  },
  {
    id: "bucket-vs-premise",
    prompt:
      "A job question asks for business or industry in one field, so one person writes 'hospital' and another writes 'health care.'",
    options: ["broad_bucket", "false_premise"],
    explanation:
      "The item applies to both respondents, but the answer space accepts different levels of detail."
  },
  {
    id: "sequence-vs-precision",
    prompt:
      "After saying they found a home on a website, a respondent reaches a later owner-advertising item and wonders whether to count it again.",
    options: ["sequence_overlap", "forced_precision"],
    explanation:
      "The answer choice is read through a prior answer, not a hidden counting method."
  }
];

export const recapRetrievalPrompts: Record<number, RecapRetrievalPrompt> = {
  4: {
    threshold: 4,
    prompt:
      "Before example 05, which earlier pattern is easiest to confuse with sequence overlap?",
    options: ["label_ambiguity", "category_boundary_blur", "false_premise"],
    explanation:
      "Sequence overlap can look like word ambiguity, but the key question is whether the prior item changed the meaning."
  },
  8: {
    threshold: 8,
    prompt:
      "Before example 09, which earlier pattern can look like false premise if you only read the No answer?",
    options: ["broad_bucket", "sequence_overlap", "forced_precision"],
    explanation:
      "Both can hide different meanings in one answer space. False premise is narrower: the question may not apply to the respondent at all."
  }
};
