/* Data for Exercises 2–5 on the SQLBolt-style #lab page. Exercise 1 (the
   scale-builder) uses src/data/satisfaction-lab.ts.

   Each exercise here is a compact, distinct interactive widget covering a
   different response-option-design issue, so the lab as a whole covers real
   failure space with variety. See project_survey_lab_redirect in memory for
   the corrected direction (SQLBolt-style multi-exercise lab) and
   feedback-lab-scenarios-for-analyst-user for the audience / scenario rules.

   Scenarios are concrete + non-loaded vehicles for the lessons (workshop
   feedback, age bucketing on a form, "how did you hear about us," a press
   release of a survey result). They are NOT about analysts/managers' day
   jobs and NOT generic fictional brands. */

/* ─── Exercise 2 — Double-barreled detector ─────────────────────────────
   The visitor reads a draft customer survey and flags the items that bundle
   two ideas into one question. */

export type DoubleBarreledItem = {
  id: string;
  text: string;
  /* True iff this item bundles two ideas. */
  isBundled: boolean;
  /* The two ideas, named — shown in the per-item feedback on pass. */
  ideas?: [string, string];
};

export const doubleBarreledItems: DoubleBarreledItem[] = [
  {
    id: "tables",
    text: "How clean were the tables today?",
    isBundled: false
  },
  {
    id: "barista",
    text: "Was your barista friendly and helpful?",
    isBundled: true,
    ideas: ["friendly", "helpful"]
  },
  {
    id: "recommend",
    text: "Would you recommend us to a friend?",
    isBundled: false
  },
  {
    id: "coffee",
    text: "How would you rate our coffee quality and selection?",
    isBundled: true,
    ideas: ["quality", "selection"]
  },
  {
    id: "on-time",
    text: "Did your order arrive on time?",
    isBundled: false
  },
  {
    id: "atmosphere",
    text: "Is our atmosphere comfortable and quiet?",
    isBundled: true,
    ideas: ["comfortable", "quiet"]
  },
  {
    id: "pricing",
    text: "How fair was our pricing?",
    isBundled: false
  },
  {
    id: "pastries",
    text: "How filling and reasonably priced are our pastries?",
    isBundled: true,
    ideas: ["filling", "reasonably priced"]
  }
];

/* ─── Exercise 3 — MECE bucket fixer ──────────────────────────────────────
   A registration form's age buckets have overlapping boundaries; three
   respondents (one at each shared boundary) can't tell which bucket to pick.
   Visitor picks the fix. */

export type BucketBoundaryRespondent = {
  id: string;
  name: string;
  age: number;
  /* The two buckets the original lists put this age into. */
  conflict: [string, string];
};

export const bucketRespondents: BucketBoundaryRespondent[] = [
  { id: "marco", name: "Marco", age: 25, conflict: ["18–25", "25–35"] },
  { id: "lila", name: "Lila", age: 35, conflict: ["25–35", "35–45"] },
  { id: "sam", name: "Sam", age: 45, conflict: ["35–45", "45+"] }
];

export const originalBuckets = ["18–25", "25–35", "35–45", "45+"];

export type BucketFix = {
  id: string;
  label: string;
  isCorrect: boolean;
  /* Why this is right or wrong; shown in feedback after selection. */
  note: string;
};

export const bucketFixes: BucketFix[] = [
  {
    id: "keep",
    label: "Keep the buckets as written.",
    isCorrect: false,
    note: "Every five-year boundary lives in two buckets. Marco (25), Lila (35), and Sam (45) each have two right answers — and split unpredictably."
  },
  {
    id: "end-exclusive",
    label: "Rewrite as 18–24, 25–34, 35–44, 45+.",
    isCorrect: true,
    note: "Now every age lands in exactly one bucket. (Either end-exclusive form works — the key is no shared boundary.)"
  },
  {
    id: "tell-respondents",
    label: "Add a note telling respondents to pick one when in doubt.",
    isCorrect: false,
    note: "Now the boundary ages distribute randomly across two buckets — your data gets noise instead of a fix."
  },
  {
    id: "different-question",
    label: "Drop the buckets and ask for age as a number.",
    isCorrect: false,
    note: "Asking the number works but changes the question entirely. The lesson here is about repairing buckets that overlap — try again."
  }
];

/* ─── Exercise 4 — Missing-option finder ───────────────────────────────────
   A "How did you hear about us?" question has four options; three respondents
   answer, but a fourth has nowhere to go. The visitor picks the missing
   option from a candidate list. */

export type HearAboutOption = {
  id: string;
  label: string;
};

export const hearAboutOptions: HearAboutOption[] = [
  { id: "social", label: "Social media" },
  { id: "search", label: "Search engine" },
  { id: "friend", label: "Friend or family" },
  { id: "print", label: "Print ad" }
];

export type HearAboutRespondent = {
  id: string;
  name: string;
  story: string;
  /* The id of the option that fits — or null if none. */
  fits: string | null;
};

export const hearAboutRespondents: HearAboutRespondent[] = [
  {
    id: "ada",
    name: "Ada",
    story: "saw a TikTok of your latte art and walked in the next day",
    fits: "social"
  },
  {
    id: "ben",
    name: "Ben",
    story: "googled “best coffee near me” and you were the top result",
    fits: "search"
  },
  {
    id: "cleo",
    name: "Cleo",
    story: "her dentist's receptionist mentioned you in passing",
    fits: null
  }
];

export type HearAboutFix = {
  id: string;
  label: string;
  /* "right" = best general fix; "specific" = also valid but narrower; "wrong" = doesn't help. */
  verdict: "right" | "specific" | "wrong";
  note: string;
};

export const hearAboutFixes: HearAboutFix[] = [
  {
    id: "other",
    label: "Add an “Other (please specify)” option.",
    verdict: "right",
    note: "Right — when you can't enumerate every channel, this catches the unexpected. Without it, Cleo either picks wrong (corrupting the data) or abandons the form."
  },
  {
    id: "industry",
    label: "Add a “Word of mouth from someone in the industry” option.",
    verdict: "specific",
    note: "Fits Cleo, but only that case. The next surprise (a podcast, a passing car, a sandwich-board down the street) is back in the same trap. A catch-all option is the more durable fix."
  },
  {
    id: "passing-by",
    label: "Add a “Walked by your shop” option.",
    verdict: "wrong",
    note: "Doesn't fit Cleo. A new specific option only helps the cases you predicted."
  },
  {
    id: "skip",
    label: "Let Cleo skip the question.",
    verdict: "wrong",
    note: "Skipping silently drops her from the channel mix entirely. That's a hidden gap in the data, not a fix."
  }
];

/* ─── Exercise 5 — Spot the bias ──────────────────────────────────────────
   A press-release headline shows "92% would recommend"; the visitor sees the
   underlying scale + stem + order and multi-selects which biases are at play.
   This is the synthesis exercise — the same moves named in Exercise 1's flip
   appear here in a finished result. */

export const spotBiasHeadline = "92% of customers would recommend our new app.";

export const spotBiasDesign = {
  stem: "How great was your experience with our new app?",
  options: ["Loved it", "Liked it", "Was okay"] as const,
  orderNote: "(positive options listed first)"
};

export type BiasOption = {
  id: string;
  label: string;
  /* True iff this bias is actually present in the shown design. */
  isPresent: boolean;
  /* Specific feedback shown after selection. */
  note: string;
};

export const biasOptions: BiasOption[] = [
  {
    id: "leading",
    label: "Leading stem (“how great…?”)",
    isPresent: true,
    note: "Yes — “how great” nudges every answer up before a single option is read."
  },
  {
    id: "missing-strong-neg",
    label: "Missing strong-negative options",
    isPresent: true,
    note: "Yes — the worst available answer is “Was okay,” which a furious customer still has to pick. Dissatisfaction has nowhere to go."
  },
  {
    id: "primacy",
    label: "Primacy effect from positive-first ordering",
    isPresent: true,
    note: "Yes — when options are equally close, the first-read one wins. The two most positive options are at the top."
  },
  {
    id: "small-sample",
    label: "Small sample size",
    isPresent: false,
    note: "Not visible in the design shown — and not a response-option-design issue. (You'd need to see the methodology, not the question.)"
  },
  {
    id: "sampling-bias",
    label: "Sampling bias",
    isPresent: false,
    note: "Not visible in the design shown — and not a response-option-design issue. (Who was asked is a separate problem from how they were asked.)"
  },
  {
    id: "stem-too-long",
    label: "Question wording is too long",
    isPresent: false,
    note: "Not really — the stem is short. Length isn't the bias; the leading framing is."
  }
];
