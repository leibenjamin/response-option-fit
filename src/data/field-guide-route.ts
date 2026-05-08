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
    title: "Exhaustive and non-overlap test",
    question:
      "Can every in-scope answer land in exactly one visible place?",
    redFlag:
      "A common answer fits two choices, or it fits only by stretching a broad catch-all.",
    nextMove:
      "List the three most likely edge cases and mark whether each is covered, overlapping, or missing."
  },
  {
    id: "no-means-what",
    title: "No-means-what test",
    question:
      "If someone answers No, what states of the world can that No hide?",
    redFlag:
      "No can mean the event did not happen, the condition was not applicable, or the respondent never had the thing being asked about.",
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
    title: "Sequence-carryover test",
    question:
      "What does the previous question make this answer choice sound like?",
    redFlag:
      "The answer is clear in isolation but feels repetitive, contradictory, or stronger after the earlier item.",
    nextMove:
      "Read the item with the two questions before it and the two questions after it, then test the whole sequence."
  },
  {
    id: "precision-recipe",
    title: "Precision-recipe test",
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

const intakeConstructMapPrompt = `You are reviewing a survey question before fielding. Do not rewrite yet.

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
5. Name what evidence would be needed before treating any rewrite as validated.

Keep the analysis source-bounded. If the item context is missing, say what is missing instead of guessing.`;

const sixPatternRedTeamPrompt = `You are red-teaming survey answer choices for response-option fit.

Question text, answer choices, and nearby sequence:
[paste item]

For each pattern below, provide: verdict (likely issue / possible issue / not evident), the exact wording that triggered the verdict, one respondent scenario, and one cautious next test.

Patterns:
- Label ambiguity: one answer choice can be read in several everyday ways.
- Broad bucket: one answer space accepts answers at different scopes.
- False premise: the item assumes a condition before checking applicability.
- Category boundary blur: nearby choices overlap or lack a clear classifying rule.
- Sequence overlap: prior items change how the current answer is read.
- Forced precision: the item demands an exact-looking answer from variable or hard-to-count experience.

Do not score the survey. Do not invent prevalence. Separate wording concerns from sampling, analysis, and policy concerns.`;

const cognitiveProbePlanPrompt = `Design a small cognitive-interview probe plan for this survey item.

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

For each probe, state what kind of evidence would count as a problem. Keep probes non-leading.`;

const rewriteAlternativesPrompt = `Propose response-option revisions, but do not claim they are validated.

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

For each alternative, explain what it addresses, what it might break, what respondent scenario remains hard, and what evidence is needed before adoption. Avoid polished certainty.`;

const evidencePlanPrompt = `Build an evidence plan for a proposed survey wording change.

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

Keep the plan practical and proportionate to risk.`;

const finalEditReviewPrompt = `Review this final survey item for response-option fit.

Final item:
[paste full question, answer choices, instructions, and nearby items]

Return:
1. One sentence naming what the item measures.
2. A table of likely respondent situations and where each answer would go.
3. Any answer choice that is ambiguous, too broad, overlapping, sequence-dependent, or too precise.
4. Any No, other, none, not applicable, or write-in path that could hide multiple meanings.
5. The safest plain-language instruction to add, if one is needed.
6. A short release note that states what was checked and what remains unvalidated.

Do not provide a score. Do not say the item is valid. Use cautious language and identify missing context.`;

export const promptCards: readonly PromptCard[] = [
  {
    id: "intake-construct-map",
    title: "Intake and construct map",
    purpose:
      "Use before rewriting. It separates the measure, respondent knowledge, answer choices, and evidence boundary.",
    prompt: intakeConstructMapPrompt
  },
  {
    id: "six-pattern-red-team",
    title: "Six-pattern red team",
    purpose:
      "Use after the intake pass. It checks the item against the six recurring response-option fit failures.",
    prompt: sixPatternRedTeamPrompt
  },
  {
    id: "cognitive-probe-plan",
    title: "Cognitive-interview probe plan",
    purpose:
      "Use when you need questions for respondent testing, not another round of desk critique.",
    prompt: cognitiveProbePlanPrompt
  },
  {
    id: "rewrite-alternatives",
    title: "Rewrite alternatives with caveats",
    purpose:
      "Use only after diagnosis. It asks for alternatives while preserving claim boundaries.",
    prompt: rewriteAlternativesPrompt
  },
  {
    id: "evidence-plan",
    title: "Evidence plan",
    purpose:
      "Use when a stakeholder likes a rewrite and you need to slow down the validation claim.",
    prompt: evidencePlanPrompt
  },
  {
    id: "final-edit-review",
    title: "Final edit review",
    purpose:
      "Use before shipping a survey draft, especially when a rewrite has passed through several people.",
    prompt: finalEditReviewPrompt
  }
];
