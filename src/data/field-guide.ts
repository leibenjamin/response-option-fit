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
      "\"No\" is dangerous when the item never first checks whether it applies to the respondent.",
    checks: [
      "Before the yes/no item, write the applicability condition the respondent must meet.",
      "Ask what \"No\" could mean: no event, no equipment, no exposure, no memory, or not applicable.",
      "Choose the applicability path: screener, skip, follow-up after \"No\", or visible not-applicable route."
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
      "Exact-looking answers often hide an unstated counting method.",
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
      "The nearest wrong route is label ambiguity. Here the words may be familiar; the harder issue is the missing boundary rule between neighboring device categories."
  },
  {
    id: "bucket-vs-premise",
    prompt:
      "A job question asks for business or industry in one field, so one person writes 'hospital' and another writes 'health care.'",
    options: ["broad_bucket", "false_premise"],
    explanation:
      "The nearest wrong route is false premise. Here the item applies to both respondents; the problem is that one field accepts different answer levels."
  },
  {
    id: "sequence-vs-precision",
    prompt:
      "A respondent says disaster risk was one reason for moving but hesitates because \"Yes\" sounds like the main reason.",
    options: ["sequence_overlap", "forced_precision"],
    explanation:
      "The nearest wrong route is forced precision. This is sequence overlap because the reason series changes the threshold for \"Yes\", not because a number hides a counting recipe."
  },
  {
    id: "label-vs-bucket",
    prompt:
      "A commute option adds examples to clarify paid app rides, while a job field adds examples to model whether answers should be workplace type, sector, or service line.",
    options: ["label_ambiguity", "broad_bucket"],
    explanation:
      "The nearest wrong route is broad bucket. Label ambiguity uses examples to clarify what a label means; broad bucket uses examples to model the expected answer level."
  },
  {
    id: "bucket-vs-sequence",
    prompt:
      "A housing-search form could ask one broad field for how someone heard about a home, or it could ask internet site first and owner advertising next.",
    options: ["broad_bucket", "sequence_overlap"],
    explanation:
      "The nearest wrong route is sequence overlap. Broad bucket is one field too wide; sequence overlap is two adjacent items making one source seem countable twice."
  },
  {
    id: "premise-vs-precision",
    prompt:
      "One case requires recovering whether the household had the equipment before interpreting \"No\"; another requires recovering the counting rule behind a numeric answer.",
    options: ["false_premise", "forced_precision"],
    explanation:
      "The nearest wrong route is forced precision. False premise recovers the denominator or applicability path before interpreting \"No\"; forced precision recovers the rule behind the number."
  }
];

export const recapRetrievalPrompts: Record<number, RecapRetrievalPrompt> = {
  4: {
    threshold: 4,
    prompt:
      "Before example 05, which earlier pattern is easiest to confuse with sequence overlap?",
    options: ["label_ambiguity", "broad_bucket", "false_premise"],
    explanation:
      "Broad bucket is one field too wide; owner advertising is two adjacent items making one source look countable twice."
  },
  8: {
    threshold: 8,
    prompt:
      "Before example 09, which earlier pattern can look like false premise if you only read the \"No\" answer?",
    options: ["broad_bucket", "sequence_overlap", "forced_precision"],
    explanation:
      "Sequence overlap asks what an earlier answer made \"No\" or \"Yes\" mean. False premise asks whether the person belonged in the item at all."
  }
};
