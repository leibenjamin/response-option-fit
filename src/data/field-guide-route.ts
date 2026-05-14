export type ResponseFitTest = {
  id: string;
  title: string;
  question: string;
  redFlag: string;
  nextMove: string;
};

export type PromptCard = {
  id: string;
  title: string;
  purpose: string;
  prompt: string;
};

export const responseFitTests: readonly ResponseFitTest[] = [
  {
    id: "respondent-knowledge",
    title: "Respondent-knowledge test",
    question:
      "What does the person actually know before they see the answer choices?",
    redFlag:
      "The answer choice asks them to classify, average, infer, or translate more than they know.",
    nextMove:
      "Write one concrete respondent situation, then ask where it would go without relying on expert interpretation."
  },
  {
    id: "exclusive-exhaustive",
    title: "Coverage and exclusivity test",
    question:
      "Can every in-scope answer land in exactly one visible place?",
    redFlag:
      "A common answer fits two choices, or it fits only by stretching a broad catch-all.",
    nextMove:
      "List the three most likely edge cases and mark whether each is covered, overlapping, or missing."
  },
  {
    id: "no-means-what",
    title: "\"No\"-means-what test",
    question:
      "If someone answers \"No\", what states of the world can that \"No\" hide?",
    redFlag:
      "\"No\" can mean the event did not happen, the condition was not applicable, or the respondent never had the thing being asked about.",
    nextMove:
      "Separate applicability from the substantive yes/no question before testing the wording."
  },
  {
    id: "neighbor-category",
    title: "Neighbor-category test",
    question:
      "Which nearby answer choice would a reasonable respondent compare this one against?",
    redFlag:
      "The respondent understands each label but still cannot tell which boundary controls the case.",
    nextMove:
      "Name the classifying feature that should decide the boundary, such as charging behavior, ownership, timing, or source."
  },
  {
    id: "sequence-carryover",
    title: "Previous-question test",
    question:
      "What does the previous question make this answer choice sound like?",
    redFlag:
      "The answer is clear in isolation but feels repetitive, contradictory, or stronger after the earlier item.",
    nextMove:
      "Read the item with the two questions before it and the two questions after it, then test the whole sequence."
  },
  {
    id: "precision-recipe",
    title: "Counting-rule test",
    question:
      "What method should the respondent use to produce this exact-looking answer?",
    redFlag:
      "Different people could average, round, count partial periods, use the most recent period, or guess.",
    nextMove:
      "Either supply the counting rule or change the answer format so the expected precision is honest."
  },
  {
    id: "evidence-boundary",
    title: "Evidence-boundary test",
    question:
      "What evidence would show that the revised answer choices work better?",
    redFlag:
      "A plausible rewrite is being treated as validated because it sounds cleaner.",
    nextMove:
      "Write the test plan: cognitive interviews, respondent debriefing, usability testing, field test, or split-panel comparison."
  }
];

const intakeConstructMapPrompt = `You are helping me review my own survey question before fielding. Do not rewrite yet.

Survey goal:
[paste what the survey is trying to measure]

Question text and answer choices:
[paste the item and nearby instructions]

Population and mode:
[paste who answers and whether this is web, phone, paper, interviewer-administered, etc.]

Task:
1. State the intended measure in one plain sentence.
2. List what a respondent is likely to know before seeing the answer choices.
3. List every answer choice and the type of real-world answer it appears to invite.
4. Identify which choices are response options, answer fields, headings, skip paths, or sequence items.
5. Provide missing-context flags before making any judgment.
6. Use cautious language; do not say the wording is valid or invalid.
7. Give two respondent scenarios and show where each would land.
8. Name the evidence needed before adoption of any later rewrite.

Keep the analysis source-bounded. If context is missing, say what is missing instead of guessing.`;

const coverageExclusivityAuditPrompt = `Audit the answer options for my own survey question. Focus on coverage, overlap, and respondent fit before suggesting edits.

Question text and answer choices:
[paste the item]

Population, mode, and any routing instructions:
[paste context]

Task:
1. Restate the intended measure in cautious language.
2. Create a table with each answer option, the real-world situations it covers, and the situations it may miss.
3. Identify missing-context flags that could change the audit.
4. List at least four respondent scenarios, including edge cases, and show where each would land.
5. Mark any option pair that is not mutually exclusive, or any common answer that is not covered.
6. Separate coverage problems from wording tone, policy disagreement, and analysis choices.
7. Name the evidence needed before adoption of any revised option set.

Do not score the item. Do not invent prevalence.`;

const sixPatternRedTeamPrompt = `You are red-teaming answer choices for my own survey question.

Question text, answer choices, and nearby sequence:
[paste item]

For each pattern below, provide: verdict (likely issue / possible issue / not evident), the exact wording that triggered the verdict, one respondent scenario, missing-context flags, cautious language for the concern, and one next test.

Patterns:
- Label ambiguity: one answer choice can be read in several everyday ways.
- Broad bucket: one answer space accepts answers at different scopes.
- False premise: the item assumes a condition before checking applicability.
- Category boundary blur: nearby choices overlap or lack a clear classifying rule.
- Sequence overlap: prior items change how the current answer is read.
- Forced precision: the item demands an exact-looking answer from variable or hard-to-count experience.

End with the evidence needed before adoption of any rewrite. Do not score the survey. Do not invent prevalence. Separate wording concerns from sampling, analysis, and policy concerns.`;

const cognitiveProbePlanPrompt = `Design a small cognitive-interview probe plan for my own survey item.

Item:
[paste question and answer choices]

Known concern:
[paste suspected response-option fit issue]

Create:
1. A neutral paraphrase probe: ask the respondent to say what the question is asking in their own words.
2. A response-option probe: ask how they chose among the answer choices.
3. A boundary probe: present one borderline scenario and ask where it belongs.
4. An applicability probe: check whether No, blank, or not applicable could be confused.
5. A sequence probe: ask whether earlier questions changed how this one sounded.
6. A burden probe: ask what memory, records, or calculation the item required.

For each probe, state the missing-context flags, one respondent scenario it is meant to reveal, what evidence would count as a problem, and what evidence would be needed before adoption of any change. Keep probes non-leading and use cautious language.`;

const rewriteAlternativesPrompt = `Propose response-option revisions for my own survey question, but do not claim they are validated.

Diagnosis:
[paste the specific response-option fit problem]

Original item:
[paste question, instructions, and answer choices]

Constraints:
[paste mode, trend requirements, legal wording, space limits, or must-keep categories]

Produce three alternatives:
1. Minimal edit: changes the fewest words.
2. Structural edit: changes answer choices, skip path, or sequence.
3. Testing edit: best candidate for cognitive interviews or a split test.

For each alternative, explain what it addresses, what it might break, what respondent scenario remains hard, what missing-context flags could change the recommendation, and what evidence is needed before adoption. Use cautious language and avoid polished certainty.`;

const evidencePlanPrompt = `Build an evidence plan for a proposed change to my own survey question.

Original wording:
[paste original]

Proposed wording:
[paste proposed]

Suspected problem:
[paste diagnosis]

Plan:
1. What would cognitive interviews need to show?
2. What would usability testing need to show for this mode?
3. What respondent debriefing question would identify misunderstandings?
4. What item nonresponse, edit failure, or distribution pattern would be worth monitoring?
5. What comparison, benchmark, or split-panel result would strengthen the case?
6. What claim should remain off-limits even if the proposed wording looks cleaner?

Include missing-context flags, two respondent scenarios to test, cautious language for the strongest supported claim, and the evidence needed before adoption. Keep the plan practical and proportionate to risk.`;

const llmOutputRedTeamPrompt = `Red-team an LLM-generated review or rewrite of my own survey question. Do not assume the output is correct.

Original question and answer choices:
[paste original item]

LLM output to review:
[paste the generated critique or rewrite]

Task:
1. Identify any unsupported claim, invented context, hidden assumption, or overconfident wording.
2. Check whether the output separates diagnosis, rewrite, and validation.
3. List missing-context flags that the output ignored.
4. Test the output against at least three respondent scenarios.
5. Name any answer-option coverage, overlap, false-premise, sequence, or precision issue the output missed.
6. Rewrite the output's strongest claim in cautious language.
7. State the evidence needed before adoption of any suggested wording.

Do not give the output a score. Do not treat fluency as evidence.`;

const finalEditReviewPrompt = `Review this final version of my own survey item for response-option fit.

Final item:
[paste full question, answer choices, instructions, and nearby items]

Return:
1. One sentence naming what the item measures.
2. A table of respondent scenarios or likely situations and where each answer would go.
3. Any answer choice that is ambiguous, too broad, overlapping, sequence-dependent, or too precise.
4. Any No, other, none, not applicable, or write-in path that could hide multiple meanings.
5. Missing-context flags that could change the review.
6. The safest plain-language instruction to add, if one is needed.
7. Cautious language for what was checked and what remains unvalidated.
8. Evidence needed before adoption.

Do not provide a score. Do not say the item is valid. Use cautious language and identify missing context.`;

export const promptCards: readonly PromptCard[] = [
  {
    id: "intake-construct-map",
    title: "Intake and construct map",
    purpose:
      "Use on your own survey before rewriting. It separates the measure, respondent knowledge, answer choices, and evidence boundary.",
    prompt: intakeConstructMapPrompt
  },
  {
    id: "coverage-exclusivity-audit",
    title: "Answer-option coverage and exclusivity audit",
    purpose:
      "Use on your own survey to check whether common answers are covered once, only once, and at the right level.",
    prompt: coverageExclusivityAuditPrompt
  },
  {
    id: "six-pattern-red-team",
    title: "Six-pattern response-option red team",
    purpose:
      "Use on your own survey after the intake pass. It checks the item against the six recurring response-option fit failures.",
    prompt: sixPatternRedTeamPrompt
  },
  {
    id: "cognitive-probe-plan",
    title: "Cognitive-interview probe plan",
    purpose:
      "Use on your own survey when you need questions for respondent testing, not another round of desk critique.",
    prompt: cognitiveProbePlanPrompt
  },
  {
    id: "rewrite-alternatives",
    title: "Rewrite alternatives with caveats",
    purpose:
      "Use on your own survey only after diagnosis. It asks for alternatives while preserving claim boundaries.",
    prompt: rewriteAlternativesPrompt
  },
  {
    id: "evidence-plan",
    title: "Evidence plan",
    purpose:
      "Use on your own survey when a stakeholder likes a rewrite and you need to slow down the validation claim.",
    prompt: evidencePlanPrompt
  },
  {
    id: "llm-output-red-team",
    title: "LLM-output red-team review",
    purpose:
      "Use on your own survey after a model suggests a critique or rewrite, so fluency does not pass for evidence.",
    prompt: llmOutputRedTeamPrompt
  },
  {
    id: "final-edit-review",
    title: "Final edit review",
    purpose:
      "Use on your own survey before sending a draft into review or testing, especially when a rewrite has passed through several people.",
    prompt: finalEditReviewPrompt
  }
];
