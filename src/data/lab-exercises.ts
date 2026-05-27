/* Data + engines for Exercises 2–5 on the `#lab` page, plus the closing
   knowledge map and the per-exercise micro-receipts.

   ARCHITECTURE (from output-L 2026-05-26): the lab teaches a 4-branch
   inspection map — SLOT / RULER / PUSH / BOUNDARY-AND-PROOF. Each exercise
   produces a small "you practiced…" receipt naming which branches it
   exercised. The closing section assembles those receipts into a compact
   knowledge map with explicit coverage markers (✓ practiced · ◇ planned
   future · ◌ didactic only · ⊘ out of scope).

   PEDAGOGY (from output-M 2026-05-26): every exercise should function as
   a small consequence machine — a plausible move that visibly changes
   respondent reality, exported data, or analyst claim permission. Wrong
   moves are dignified, branch-specific, and recoverable. Feedback follows
   the four-line template (what happened / why it matters / repair move /
   watch for). Each exercise uses a distinct primary verb so the lab
   doesn't feel like the same puzzle reskinned.

   E1 (the scale-builder) lives in src/data/satisfaction-lab.ts.
   E2–E5 are here. */

/* ─── Shared types: branches + coverage markers + post-receipts ─────────── */

export type CoverageStatus = "practiced" | "planned" | "didactic" | "outOfScope";

export type BranchId = "slot" | "ruler" | "push" | "boundary";

/* The marker glyphs used in the UI. */
export const coverageGlyph: Record<CoverageStatus, string> = {
  practiced: "✓",
  planned: "◇",
  didactic: "◌",
  outOfScope: "⊘"
};

export const coverageLabel: Record<CoverageStatus, string> = {
  practiced: "Practiced",
  planned: "Planned future exercise",
  didactic: "Didactic only",
  outOfScope: "Out of scope"
};

export type ExerciseReceipt = {
  /* Branches this exercise touched, with the specific concepts practiced. */
  marks: { branchId: BranchId; concepts: string[] }[];
  /* Optional professional caveat shown alongside the receipt (e.g., the
     pilot-Other caveat after E4). */
  caveat?: string;
};

/* ─── Exercise 2 — Double-barreled flag + repair-selection ────────────────
   Sub-task 1 (flag): the visitor reads a draft coffee-shop survey and
   flags items that bundle ideas. The list is ordered pedagogically
   (warmups → subtler → triple-barreled → "and"-decoys → clean). The
   decoys ("rewards-and-loyalty program", "news-and-promotions emails")
   contain "and" inside a single named entity — flagging them is the
   pedagogically valuable wrong move (variation theory: bundling is about
   TWO distinct measurements, not the word "and"). Triple-barreled item
   is included to make "split into 2" not always the right shape.

   Sub-task 2 (repair): once Sub-task 1 passes, the triple-barreled item
   surfaces a repair-selection beat with three candidate splits — one
   clean (three separate questions), one "partial" (only two ideas
   captured), one "false simplification" (collapse to a vague single
   item). The consequences of each repair are shown explicitly. (This is
   M's "designed cul-de-sacs" pattern.) */

export type DoubleBarreledItem = {
  id: string;
  text: string;
  /* "clean" = single idea, no decoy. "bundled-2" = standard two-way bundle.
     "bundled-3" = triple-barreled. "decoy" = contains "and" but is one
     idea (a named entity / single workflow / single product). */
  kind: "clean" | "bundled-2" | "bundled-3" | "decoy";
  /* For bundled-2 / bundled-3, the named ideas — shown in reveal. */
  ideas?: string[];
  /* For decoy, the name of the single entity — shown to explain why it's
     not bundled. */
  entity?: string;
  /* The per-item feedback line shown on Check. If absent, a default is
     composed from `kind` + `ideas` / `entity`. */
  note?: string;
};

export const doubleBarreledItems: DoubleBarreledItem[] = [
  {
    id: "tables",
    text: "How clean were the tables today?",
    kind: "clean",
    note: "Clean. One idea, one question."
  },
  {
    id: "barista-friendly",
    text: "Was your barista friendly and helpful?",
    kind: "bundled-2",
    ideas: ["friendly", "helpful"],
    note: "Bundled (friendly + helpful). A respondent whose barista was friendly but unhelpful has nowhere honest to land."
  },
  {
    id: "return",
    text: "How likely are you to return for another visit?",
    kind: "clean",
    note: "Clean. “Return for another visit” is one act."
  },
  {
    id: "rewards-program",
    text: "How would you rate our rewards-and-loyalty program?",
    kind: "decoy",
    entity: "the rewards-and-loyalty program (one program)",
    note: "Not bundled. “Rewards-and-loyalty” is the program's name — a single product the respondent rates as one thing. Bundling is about two distinct measurements being asked in one slot, not about the word “and.”"
  },
  {
    id: "coffee-quality",
    text: "Rate our coffee's quality and selection.",
    kind: "bundled-2",
    ideas: ["quality", "selection"],
    note: "Bundled (quality + selection). Excellent coffee that's only offered as drip would force a respondent who values selection to compromise the rating either way."
  },
  {
    id: "news-emails",
    text: "Were our news-and-promotions emails helpful to you?",
    kind: "decoy",
    entity: "the news-and-promotions email (one weekly email)",
    note: "Not bundled. The shop sends one weekly email called “news and promotions”; the respondent rates the email as a single product."
  },
  {
    id: "server-triple",
    text: "Was your server friendly, attentive, and quick?",
    kind: "bundled-3",
    ideas: ["friendly", "attentive", "quick"],
    note: "Triple-barreled (friendly + attentive + quick). A respondent whose server was warm and attentive but slow can't land honestly. Sub-task 2 will look at how to repair it."
  },
  {
    id: "coffee-and-pastry",
    text: "Rate our coffee and our pastry case.",
    kind: "bundled-2",
    ideas: ["coffee", "pastry case"],
    note: "Bundled (coffee + pastry case). Two products, one rating slot. A great coffee and a stale pastry land identically to a mediocre coffee and a perfect pastry."
  },
  {
    id: "atmosphere",
    text: "Is our atmosphere comfortable and quiet?",
    kind: "bundled-2",
    ideas: ["comfortable", "quiet"],
    note: "Bundled (comfortable + quiet). A coffee-shop atmosphere can be cozy AND loud, or quiet AND cold — these are two different judgments."
  },
  {
    id: "wait",
    text: "How long did you wait in line?",
    kind: "clean",
    note: "Clean. Single quantity asked."
  }
];

/* Sub-task 2.2: after Sub-task 2.1 passes, surface a repair-selection for
   the triple-barreled item. Three candidate splits show the cul-de-sac
   pattern (one clean fix, one partial, one false simplification). */

export type DoubleBarreledSplit = {
  id: string;
  label: string;
  verdict: "right" | "partial" | "false-simplification";
  /* Feedback in the four-line format: what happened / why it matters /
     repair move / watch for. */
  whatHappened: string;
  whyItMatters: string;
  repairMove: string;
  watchFor: string;
};

export const tripleSplitOptions: DoubleBarreledSplit[] = [
  {
    id: "three",
    label:
      "Ask three: “Was your server friendly?” + “…attentive?” + “…quick?”",
    verdict: "right",
    whatHappened: "Three separate ratings, three honest signals.",
    whyItMatters:
      "Each trait can move independently — friendly but slow, attentive but cool, etc. Three slots preserve all three signals so the operator can act on whichever is weak.",
    repairMove:
      "Split each trait into its own item; group them under a small heading if you need to keep the section compact.",
    watchFor:
      "Three items costs respondent time. If you only have room for one, decide which trait actually drives the operator's next decision and ask only that."
  },
  {
    id: "drop-friendly",
    label: "Ask two: “Was your server attentive and quick?”",
    verdict: "partial",
    whatHappened:
      "Reduced from three traits to two, but the new item is still bundled — and you silently dropped “friendly” entirely.",
    whyItMatters:
      "“Friendly” is no longer being measured at all (you can't act on what you don't ask), and the remaining item still can't tell whether the server was attentive but slow or the reverse.",
    repairMove:
      "If you must drop a trait, decide the analytic priority and ask the ONE trait that matters most — don't silently drop one and re-bundle the others.",
    watchFor:
      "Partial fixes are the most tempting kind. They feel like progress because the item is shorter, but they create the same failure mode at a smaller scale plus a new gap."
  },
  {
    id: "vague-single",
    label: "Ask one: “Rate your server's service overall.”",
    verdict: "false-simplification",
    whatHappened:
      "Collapsed three signals into one fuzzy rating.",
    whyItMatters:
      "Cleaner question shape, but if the answer lands at 3 of 5 you can't act on it — you don't know which trait failed. A “3” could mean uniformly mediocre, friendly+slow, attentive+cold, or any combination.",
    repairMove:
      "If you genuinely care about overall impression, keep this — but ADD one of the three trait questions back so you can diagnose what's driving the overall score.",
    watchFor:
      "“Overall” questions look clean and survive board-deck slides well. They are also the questions that tell operators the least about what to fix."
  }
];

/* ─── Exercise 3 — MECE bucket tinker (variation theory) ──────────────────
   Editable age buckets + a fixed cast of 10 respondents. The visitor
   adjusts the bucket boundaries (start + end, end-inclusive or null for
   open-ended) and adds/removes buckets. The widget shows, for each
   respondent, how many buckets contain their age (0 = uncovered, 1 =
   clean, 2+ = ambiguous). Three sub-tasks gate sequentially: fix the
   overlap, cover the under-18s, split the 65+ range. Productive failure
   is wired in: try any boundary set and immediately see the consequences. */

export type AgeBucket = {
  id: string;
  /* Inclusive start age. */
  start: number;
  /* Inclusive end age, or null = open-ended ("X+"). */
  end: number | null;
};

export type AgeRespondent = {
  id: string;
  name: string;
  age: number;
};

export const ageRespondents: AgeRespondent[] = [
  { id: "wei", name: "Wei", age: 14 },
  { id: "lin", name: "Lin", age: 17 },
  { id: "marco", name: "Marco", age: 22 },
  { id: "ada", name: "Ada", age: 25 },
  { id: "ben", name: "Ben", age: 30 },
  { id: "lila", name: "Lila", age: 35 },
  { id: "cleo", name: "Cleo", age: 44 },
  { id: "sam", name: "Sam", age: 45 },
  { id: "dev", name: "Dev", age: 65 },
  { id: "pat", name: "Pat", age: 78 }
];

/* The broken starter set: shared boundaries at 25, 35, 45 create overlaps;
   no under-18 coverage; one open-ended bucket lumps 45–100. */
export const startingAgeBuckets: AgeBucket[] = [
  { id: "b1", start: 18, end: 25 },
  { id: "b2", start: 25, end: 35 },
  { id: "b3", start: 35, end: 45 },
  { id: "b4", start: 45, end: null }
];

/* Adjustable bounds for the bucket-edit controls. */
export const ageEditMin = 0;
export const ageEditMax = 100;

export function ageInBucket(age: number, b: AgeBucket): boolean {
  if (age < b.start) return false;
  if (b.end != null && age > b.end) return false;
  return true;
}

export function bucketsContainingAge(age: number, bs: AgeBucket[]): AgeBucket[] {
  return bs.filter((b) => ageInBucket(age, b));
}

/* A bucket is "valid" iff start ≤ end (when end is set). */
export function bucketIsValid(b: AgeBucket): boolean {
  return b.end == null || b.start <= b.end;
}

export type BucketTask = {
  id: "fix-overlap" | "extend-low" | "split-high";
  title: string;
  brief: string;
  pass: (bs: AgeBucket[]) => boolean;
  /* Pass feedback shown when the task completes. */
  passText: string;
  /* A live hint based on current state. */
  hint: (bs: AgeBucket[]) => string;
};

const allBucketsValid = (bs: AgeBucket[]) => bs.every(bucketIsValid);
const everyoneAtMostOnce = (bs: AgeBucket[]) =>
  allBucketsValid(bs) &&
  ageRespondents.every((r) => bucketsContainingAge(r.age, bs).length <= 1);
const everyoneExactlyOnce = (bs: AgeBucket[]) =>
  allBucketsValid(bs) &&
  ageRespondents.every((r) => bucketsContainingAge(r.age, bs).length === 1);
const hasOlderSplit = (bs: AgeBucket[]) => {
  /* The 65+ split is satisfied when the bucket containing Dev (65)
     starts at or after age 60 — i.e., there's a dedicated older bucket,
     not a generic 45+ lump. */
  const devBucket = bucketsContainingAge(65, bs)[0];
  return devBucket != null && devBucket.start >= 60;
};

export const bucketTasks: BucketTask[] = [
  {
    id: "fix-overlap",
    title: "Fix the overlapping boundaries.",
    brief:
      "Adjust the bucket boundaries so nobody lands in two buckets at once. (Wei and Lin will still land in zero — Task 2 will pick them up.)",
    pass: everyoneAtMostOnce,
    passText:
      "✓ No more double-fits. (Ending the previous bucket one number before the next starts — 18–24 / 25–34 / 35–44 / 45+ — does it.) Wei (14) and Lin (17) still land in zero buckets; Task 2 picks them up.",
    hint: (bs) => {
      if (!allBucketsValid(bs))
        return "One of the buckets has start > end. Fix that before checking fits.";
      const doubles = ageRespondents.filter(
        (r) => bucketsContainingAge(r.age, bs).length >= 2
      );
      if (doubles.length === 0) return "All double-fits gone — almost there.";
      const names = doubles.map((r) => `${r.name} (${r.age})`).join(", ");
      return `Still double-fitting: ${names}. Look at the shared boundary values.`;
    }
  },
  {
    id: "extend-low",
    title: "Cover the under-18 attendees.",
    brief:
      "Wei (14) and Lin (17) signed up for a teen workshop and the form doesn't have a bucket they fit. Add coverage so everyone lands in EXACTLY one bucket — not zero.",
    pass: everyoneExactlyOnce,
    passText:
      "✓ Everyone now fits in exactly one bucket. (You might have added a new bucket OR dropped the bottom of the first bucket — both work; the choice depends on whether you want under-18 as its own analytic group.)",
    hint: (bs) => {
      const zeros = ageRespondents.filter(
        (r) => bucketsContainingAge(r.age, bs).length === 0
      );
      if (zeros.length === 0) return "Everyone fits now.";
      const names = zeros.map((r) => `${r.name} (${r.age})`).join(", ");
      return `Still uncovered: ${names}. Add a bucket below 18, or stretch the lowest bucket down.`;
    }
  },
  {
    id: "split-high",
    title: "Split the 45+ bucket.",
    brief:
      "Dev (65) and Pat (78) are both lumped in with everyone over 45 — twenty years of life experience averaged together. Add a separate older bucket. (Where you put the split is a judgment call: ≥65 is common; ≥60 or ≥55 are defensible too.)",
    pass: (bs) => everyoneExactlyOnce(bs) && hasOlderSplit(bs),
    passText:
      "✓ Dev and Pat now have their own bucket. Splits are a judgment call — the lesson is that one bucket spanning 45–100 was too coarse to support claims about life-stage differences.",
    hint: (bs) => {
      if (!everyoneExactlyOnce(bs))
        return "First make sure everyone still fits in exactly one bucket.";
      return "Edit the high bucket to end at, say, 64, then add a new bucket starting at 65. Or pick a different split.";
    }
  }
];

/* ─── Exercise 4 — Pilot-iterate option-set tinker with ledger ────────────
   The visitor designs a "How did you hear about us?" option set against
   7 authored respondents. Each respondent has a true channel + an effort
   tolerance (high = will fill in "Other"; low = won't, satisfices onto
   the closest plausible offered option). Live ledger shows the four
   tradeoff dimensions per M's "consequence ledger" pattern: COVERAGE
   (everyone has a place), EXCLUSIVITY (no overlaps), ANALYST DETAIL
   (specific vs lumped), and RESPONDENT BURDEN (list length / effort).

   The deep lesson the author flagged: "Other (please specify)" only
   captures HIGH-effort respondents. LOW-effort respondents satisfice
   into the wrong specific options. The professional fix is to PILOT
   (see who's satisficing where) and add SPECIFIC options for those
   channels. */

export type Channel = {
  id: string;
  label: string;
  /* "specific" = a named real channel. "catch-all" = "Other (please
     specify)". "broad" = an over-wide grouping. */
  kind: "specific" | "catch-all" | "broad";
};

/* Full option bank. The visitor toggles items on/off. */
export const channelBank: Channel[] = [
  { id: "social", label: "Social media", kind: "specific" },
  { id: "search", label: "Search engine", kind: "specific" },
  { id: "friend", label: "Friend or family", kind: "specific" },
  { id: "print", label: "Print ad", kind: "specific" },
  { id: "other", label: "Other (please specify)", kind: "catch-all" },
  { id: "walked-by", label: "Walked by your shop", kind: "specific" },
  { id: "industry-referral", label: "Word of mouth from someone in the industry", kind: "specific" },
  { id: "podcast", label: "Podcast or audio ad", kind: "specific" },
  { id: "local-event", label: "Local event or fair", kind: "specific" },
  { id: "outdoor-sign", label: "Outdoor sign or billboard", kind: "specific" },
  { id: "online-other", label: "Online (catch-all)", kind: "broad" }
];

export const startingChannels = ["social", "search", "friend", "print"];

export type ChannelRespondent = {
  id: string;
  name: string;
  /* The channel they actually came through; references a channelBank id. */
  trueChannelId: string;
  /* "high" = will pick "Other" honestly if their channel isn't listed.
     "low"  = avoids the extra effort of filling in Other; satisfices
     onto their satisficeTo target instead. */
  effort: "high" | "low";
  /* Which specific channel they satisfice onto (when their true channel
     isn't offered AND they're low-effort, OR when neither true channel
     nor Other are offered). */
  satisficeTo: string;
  story: string;
};

export const channelRespondents: ChannelRespondent[] = [
  {
    id: "ada",
    name: "Ada",
    trueChannelId: "social",
    effort: "high",
    satisficeTo: "social",
    story: "saw a TikTok of your latte art"
  },
  {
    id: "ben",
    name: "Ben",
    trueChannelId: "search",
    effort: "high",
    satisficeTo: "search",
    story: "googled “best coffee near me”"
  },
  {
    id: "cleo",
    name: "Cleo",
    trueChannelId: "industry-referral",
    effort: "low",
    satisficeTo: "friend",
    story: "her dentist's receptionist mentioned you"
  },
  {
    id: "dev",
    name: "Dev",
    trueChannelId: "walked-by",
    effort: "high",
    satisficeTo: "print",
    story: "walked past on her way to work for a week, finally came in"
  },
  {
    id: "eve",
    name: "Eve",
    trueChannelId: "print",
    effort: "high",
    satisficeTo: "print",
    story: "saw your ad in the neighborhood magazine"
  },
  {
    id: "pat",
    name: "Pat",
    trueChannelId: "podcast",
    effort: "low",
    satisficeTo: "social",
    story: "heard a podcast host plug your beans"
  },
  {
    id: "lin",
    name: "Lin",
    trueChannelId: "local-event",
    effort: "low",
    satisficeTo: "friend",
    story: "met you at the food fair last weekend"
  }
];

export type ChannelLandingState = "clean" | "other" | "satisficed";
export type ChannelLanding = {
  state: ChannelLandingState;
  pickedId: string;
};

export function channelLandingFor(
  r: ChannelRespondent,
  offered: string[]
): ChannelLanding {
  if (offered.includes(r.trueChannelId)) {
    return { state: "clean", pickedId: r.trueChannelId };
  }
  if (offered.includes("other") && r.effort === "high") {
    return { state: "other", pickedId: "other" };
  }
  /* Satisfice onto the wrong specific option. If the satisfice target
     isn't offered either, fall back to the first offered option. */
  const target = offered.includes(r.satisficeTo)
    ? r.satisficeTo
    : offered[0] ?? "";
  return { state: "satisficed", pickedId: target };
}

export type ChannelTallies = {
  clean: number;
  other: number;
  satisficed: number;
  total: number;
};

export function channelTallies(offered: string[]): ChannelTallies {
  let clean = 0;
  let other = 0;
  let satisficed = 0;
  for (const r of channelRespondents) {
    const l = channelLandingFor(r, offered);
    if (l.state === "clean") clean += 1;
    else if (l.state === "other") other += 1;
    else satisficed += 1;
  }
  return { clean, other, satisficed, total: channelRespondents.length };
}

/* The 4-dimension ledger from M. Each is a 3-level qualitative reading:
   "low" / "medium" / "high". Labels-not-numbers per M ("avoid false
   precision"). */
export type LedgerLevel = "low" | "medium" | "high";
export type ChannelLedger = {
  /* Coverage: does every respondent have a place to answer (Clean OR Other)? */
  coverage: LedgerLevel;
  /* Exclusivity: are the offered options distinct? "broad" option drops this. */
  exclusivity: LedgerLevel;
  /* Analyst detail: how much specificity does the export preserve?
     Driven by share of Clean answers vs Other / satisficed (which hide
     the true channel). */
  analystDetail: LedgerLevel;
  /* Respondent burden: list length + effort tolerance. More options =
     more reading; "Other" offered = potential write-in burden for
     high-effort respondents. */
  respondentBurden: LedgerLevel;
};

export function channelLedger(offered: string[]): ChannelLedger {
  const t = channelTallies(offered);
  const captured = t.clean + t.other;
  /* Coverage: high if everyone has somewhere honest, medium if Other is
     doing most of the lift (some satisficed), low if many satisficed. */
  let coverage: LedgerLevel;
  if (t.satisficed === 0) coverage = "high";
  else if (t.satisficed <= 1) coverage = "medium";
  else coverage = "low";
  /* Exclusivity: drops if a broad option is offered (lumps multiple
     specific channels). */
  const hasBroad = offered.some(
    (id) => (channelBank.find((c) => c.id === id)?.kind ?? null) === "broad"
  );
  let exclusivity: LedgerLevel = hasBroad ? "medium" : "high";
  if (hasBroad && offered.length <= 4) exclusivity = "low";
  /* Analyst detail: high when most respondents land Clean; drops when
     many land on Other (free text — not specific) or satisficed (false
     attribution). */
  let analystDetail: LedgerLevel;
  if (t.clean === t.total) analystDetail = "high";
  else if (captured === t.total && t.other <= 2) analystDetail = "medium";
  else analystDetail = "low";
  /* Respondent burden: rises with list length, with an extra step for
     Other (high-effort respondents have to write in). */
  let respondentBurden: LedgerLevel;
  if (offered.length <= 4) respondentBurden = "low";
  else if (offered.length <= 7) respondentBurden = "medium";
  else respondentBurden = "high";
  return { coverage, exclusivity, analystDetail, respondentBurden };
}

/* Pass: everyone lands Clean. Other doesn't count — it captures, but
   doesn't preserve analyst detail. */
export function channelPassed(offered: string[]): boolean {
  return channelTallies(offered).clean === channelRespondents.length;
}

/* ─── Exercise 5 — Cold review queue (interleaved synthesis) ──────────────
   Six small "finding cards." For each card, the visitor sorts it into a
   bucket: response-option-fit problem / sampling problem / sample-size
   uncertainty / not enough information. After sorting, response-option-
   fit cards reveal a sub-multi-select for WHICH response-option failure
   (leading frame / missing strong-negative / primacy / loaded labels /
   false premise). Pass = every card correctly bucketed AND every
   response-option-fit card's failures correctly identified. */

export type FindingBucket =
  | "responseOption"
  | "sampling"
  | "sampleSize"
  | "notEnoughInfo";

export const findingBucketLabel: Record<FindingBucket, string> = {
  responseOption: "Response-option fit",
  sampling: "Sampling problem",
  sampleSize: "Sample-size uncertainty",
  notEnoughInfo: "Not enough information"
};

export const findingBucketHint: Record<FindingBucket, string> = {
  responseOption:
    "Something in how the answer choices were written / arranged / labeled biased the result.",
  sampling: "The respondent pool was wrong, not the answer menu.",
  sampleSize:
    "The number of respondents is too small to support the headline.",
  notEnoughInfo:
    "The shown design looks fine; you'd need to see more to judge."
};

export type ResponseOptionSubtype =
  | "leading"
  | "missingStrongNeg"
  | "primacy"
  | "loadedLabels"
  | "falsePremise";

export const responseOptionSubtypeLabel: Record<ResponseOptionSubtype, string> = {
  leading: "Leading stem",
  missingStrongNeg: "Missing strong-negative",
  primacy: "Primacy / option order",
  loadedLabels: "Loaded category labels",
  falsePremise: "False premise (denominator merging)"
};

export type FindingCard = {
  id: string;
  /* The headline / report claim. */
  headline: string;
  /* The underlying survey design + methodology notes. */
  stem?: string;
  options?: readonly string[];
  methodologyNotes?: readonly string[];
  /* The correct bucket. */
  correctBucket: FindingBucket;
  /* If correctBucket === "responseOption": the present subtypes. */
  subtypes?: ResponseOptionSubtype[];
  /* Bucket-level feedback shown when correctly sorted. */
  bucketNote: string;
};

export const findingCards: FindingCard[] = [
  {
    id: "app-launch",
    headline: "“92% of users would recommend our new app.”",
    stem: "How great was your experience with our new app?",
    options: ["Loved it", "Liked it", "Was okay"],
    methodologyNotes: ["Asked of every user who opened the app once."],
    correctBucket: "responseOption",
    subtypes: ["leading", "missingStrongNeg", "primacy"],
    bucketNote:
      "Response-option fit. Three biasing moves stack: the stem leads (“how great”), there's no place worse than “okay,” and the positives sit first."
  },
  {
    id: "manager-rating",
    headline: "“Manager rating: 4.2 / 5 across the company.”",
    stem: "Overall, how would you rate your manager?",
    options: [
      "Truly exceptional",
      "Great",
      "Good",
      "Adequate",
      "Could improve"
    ],
    methodologyNotes: ["Anonymous; all employees asked; 78% response rate."],
    correctBucket: "responseOption",
    subtypes: ["loadedLabels", "missingStrongNeg", "primacy"],
    bucketNote:
      "Response-option fit. A 5-point scale that LOOKS balanced isn't — the labels are asymmetric (“Truly exceptional → Could improve”), and the worst available answer is still gentle critique."
  },
  {
    id: "nps",
    headline: "“Net Promoter Score: 78 — top-tier.”",
    stem: "How likely are you to recommend us, on a scale of 0 to 10?",
    options: ["0 (not at all)", "…", "10 (extremely)"],
    methodologyNotes: [
      "Asked only of customers who completed a purchase in the past 30 days.",
      "Customers who churned within 30 days are not included."
    ],
    correctBucket: "sampling",
    bucketNote:
      "Sampling problem. The 0–10 NPS scale is fine; the trick is WHO was asked. Successful recent purchasers will look glowing in any survey."
  },
  {
    id: "small-n",
    headline: "“Internal dashboard CSAT: 8.4 / 10.”",
    stem: "How satisfied are you with the dashboard, 1 to 10?",
    options: ["1 (not at all)", "…", "10 (extremely)"],
    methodologyNotes: ["n = 23 respondents from the analytics team."],
    correctBucket: "sampleSize",
    bucketNote:
      "Sample-size uncertainty. The response options are clean; the headline is built on 23 people. That's a real number, but the gap between 7.4 and 8.4 is well inside noise."
  },
  {
    id: "outage-medicine",
    headline:
      "“Only 12% of households lost refrigerated medicine during the outage.”",
    stem: "Did your household lose refrigerated medicine during the power outage?",
    options: ["Yes", "No"],
    methodologyNotes: [
      "Asked of every household in the post-outage survey."
    ],
    correctBucket: "responseOption",
    subtypes: ["falsePremise"],
    bucketNote:
      "Response-option fit, but the subtle kind. The Yes/No merges three different respondent states: (a) no power outage at this address, (b) outage but no refrigerated medicine, (c) outage + medicine but nothing spoiled. The “No” you see in the export hides all three behind one denominator."
  },
  {
    id: "remote-pref",
    headline: "“87% of staff feel their work matters.”",
    stem: "My work has meaningful impact on the organization.",
    options: [
      "Strongly agree",
      "Agree",
      "Neutral",
      "Disagree",
      "Strongly disagree"
    ],
    methodologyNotes: [],
    correctBucket: "notEnoughInfo",
    bucketNote:
      "Not enough information. The scale is balanced, labeled symmetrically, and the stem is plain. To judge the 87%, you'd want to see who was asked, how the sample was drawn, and the response rate — methodology, not response-option."
  }
];

/* Pass check for a single card: bucket must match AND for response-option
   cards, the subtype set must match exactly. */
export type CardAnswer = {
  bucket: FindingBucket | null;
  subtypes: Set<ResponseOptionSubtype>;
};

export function cardIsPassed(card: FindingCard, ans: CardAnswer): boolean {
  if (ans.bucket !== card.correctBucket) return false;
  if (card.correctBucket !== "responseOption") return true;
  const expected = new Set(card.subtypes ?? []);
  if (ans.subtypes.size !== expected.size) return false;
  for (const s of expected) if (!ans.subtypes.has(s)) return false;
  return true;
}

/* ─── Per-exercise micro-receipts (mapping to the 4-branch map) ──────────
   After each exercise passes, the lab shows a small receipt naming which
   branch(es) of the closing map the exercise exercised. The caveat field
   (where present) carries M's "professional caveat" framing — e.g., the
   pilot-Other caveat for E4. */

export const exerciseReceipts: Record<string, ExerciseReceipt> = {
  E1: {
    marks: [
      { branchId: "ruler", concepts: ["balance", "neutral midpoint"] },
      { branchId: "push", concepts: ["leading frame", "option order (primacy)"] }
    ]
  },
  E2: {
    marks: [{ branchId: "slot", concepts: ["one answerable thing at a time"] }],
    caveat:
      "“And” is a syntactic marker, not a bundling test. The check is whether two different judgments are being asked for one answer slot."
  },
  E3: {
    marks: [{ branchId: "slot", concepts: ["mutually exclusive boundaries", "coverage of the full range"] }]
  },
  E4: {
    marks: [{ branchId: "slot", concepts: ["completeness", "the “Other” tradeoff"] }],
    caveat:
      "“Other, please specify” is a coverage patch, not an analysis category. Respondents who avoid the extra effort satisfice into a wrong specific option instead — pilot, observe satisficing, then promote common write-ins to their own options."
  },
  E5: {
    marks: [{ branchId: "boundary", concepts: ["response-option failures vs other survey problems"] }]
  }
};

/* ─── Closing knowledge map — SLOT/RULER/PUSH/BOUNDARY ───────────────────
   Per output-L's recommendation. Each branch has a small set of nodes
   marked with coverage status. The closing section renders this as a
   2x2 grid; expandable details surface the `ask` and `remember` per node. */

export type KnowledgeNode = {
  id: string;
  label: string;
  status: CoverageStatus;
  ask: string;
  remember: string;
  /* "E1" .. "E5" if a single exercise covered it; "future" / "none" for
     ◇ planned / ◌ didactic / ⊘ out-of-scope. */
  exerciseIds: string[];
  /* Optional cue to a real source (Krosnick, Tourangeau, etc.). */
  sourceCue?: string;
  /* Optional boundary / scope note. */
  boundaryNote?: string;
};

export type KnowledgeBranch = {
  id: BranchId;
  label: string;
  question: string;
  memorySentence: string;
  nodes: KnowledgeNode[];
};

export const responseOptionKnowledgeMap: KnowledgeBranch[] = [
  {
    id: "slot",
    label: "Slot",
    question: "Can every real answer land somewhere true?",
    memorySentence:
      "A response set first has to give reality a truthful place to land — no missing runway, no overlapping runway, no “pick one answer for two different things.”",
    nodes: [
      {
        id: "slot.completeness",
        label: "Missing options",
        status: "practiced",
        ask: "Is there a truthful answer for every plausible respondent?",
        remember:
          "If the option set has no home for someone, the export still looks clean — but the respondent has already been forced into fiction.",
        exerciseIds: ["E4"]
      },
      {
        id: "slot.mece",
        label: "Clean boundaries",
        status: "practiced",
        ask: "Can each respondent fit in one bucket without guessing?",
        remember:
          "Shared boundary values silently force respondents to choose, and they choose unpredictably.",
        exerciseIds: ["E3"]
      },
      {
        id: "slot.doubleBarrel",
        label: "One answerable thing",
        status: "practiced",
        ask: "Does one response represent one judgment?",
        remember:
          "One answer cannot honestly carry two independent experiences — and “and” is not the test; meaning is.",
        exerciseIds: ["E2"],
        boundaryNote:
          "Partly a question-wording issue, included here because it creates an answer-slot failure."
      },
      {
        id: "slot.catchAllEffort",
        label: "Pilot “Other” write-ins",
        status: "practiced",
        ask:
          "Are low-effort respondents satisficing onto a wrong option instead of filling in “Other”?",
        remember:
          "“Other, please specify” is a coverage patch, not an analysis category. Promote common write-ins to their own options.",
        exerciseIds: ["E4"]
      },
      {
        id: "slot.dkNaPna",
        label: "DK / NA / prefer not",
        status: "planned",
        ask:
          "Are uncertain or ineligible respondents being forced into substantive answers?",
        remember:
          "An opt-out can protect measurement rather than weaken it — uncertain respondents stop contaminating the substantive distribution.",
        exerciseIds: ["future"],
        sourceCue: "Krosnick & Presser on DK / no-opinion."
      }
    ]
  },
  {
    id: "ruler",
    label: "Ruler",
    question: "Does the scale measure the intended distinction?",
    memorySentence:
      "A scale is a measuring instrument with tick marks, labels, a center, endpoints, and assumptions about how much precision a respondent can actually supply.",
    nodes: [
      {
        id: "ruler.balance",
        label: "Balance & symmetry",
        status: "practiced",
        ask: "Does the scale give equal room to both sides of the judgment?",
        remember:
          "A positive-heavy scale can manufacture a positive-looking result before analysis begins.",
        exerciseIds: ["E1", "E5"]
      },
      {
        id: "ruler.midpoint",
        label: "Neutral midpoint",
        status: "practiced",
        ask: "Can a truly neutral respondent land there honestly?",
        remember:
          "A midpoint can be necessary for genuine neutrality, but it can also attract satisficing. Include or exclude deliberately.",
        exerciseIds: ["E1"]
      },
      {
        id: "ruler.scaleLength",
        label: "Scale length",
        status: "planned",
        ask:
          "Does the number of points match what respondents can actually distinguish?",
        remember:
          "More points do not automatically mean more truth — beyond roughly 5–7 categories, reliability gains often flatten or reverse.",
        exerciseIds: ["future"],
        sourceCue: "Krosnick & Presser; Saris & Gallhofer."
      },
      {
        id: "ruler.labels",
        label: "Full verbal labels",
        status: "planned",
        ask:
          "Can respondents interpret each point, or do you make them invent the middle?",
        remember:
          "Endpoint-only numeric scales push respondents to make up the middle — labeling every point often helps consistency.",
        exerciseIds: ["future"]
      },
      {
        id: "ruler.fakePrecision",
        label: "Vague units / fake precision",
        status: "planned",
        ask:
          "Do the options imply more precision than respondents can supply?",
        remember:
          "A 1–100 slider can look scientific while collecting guesses dressed up in decimals — and “often / sometimes / rarely” are not stable units without anchors.",
        exerciseIds: ["future"]
      }
    ]
  },
  {
    id: "push",
    label: "Push",
    question: "Does the option set steer the respondent?",
    memorySentence:
      "Answer choices can nudge, tilt, prime, tire, flatter, or invite agreement before the respondent has fully reported their answer.",
    nodes: [
      {
        id: "push.leadingFrame",
        label: "Leading frame",
        status: "practiced",
        ask: "Does the wording pre-commit to a desired answer?",
        remember:
          "A response set can look neutral while the stem has already tilted the floor.",
        exerciseIds: ["E1", "E5"]
      },
      {
        id: "push.order",
        label: "Option order",
        status: "practiced",
        ask:
          "Could the first-read or last-heard option be advantaged?",
        remember:
          "Order effects are mode-sensitive — visual self-administered modes often invite primacy; interviewer-administered modes can invite recency.",
        exerciseIds: ["E1", "future"],
        sourceCue: "Krosnick & Presser on response-order effects."
      },
      {
        id: "push.loadedLabels",
        label: "Loaded category labels",
        status: "practiced",
        ask:
          "Are the labels themselves doing the biasing, even on a numerically balanced scale?",
        remember:
          "“Truly exceptional → Could improve” is a 5-point scale that's asymmetric in meaning, not in count.",
        exerciseIds: ["E5"]
      },
      {
        id: "push.acquiescence",
        label: "Acquiescence (yea-saying)",
        status: "planned",
        ask:
          "Is the format inviting agreement instead of measuring the construct?",
        remember:
          "Agree / disagree formats can pull yes-saying respondents toward agreement regardless of content — item-specific scales are often cleaner.",
        exerciseIds: ["future"],
        sourceCue: "Krosnick & Presser."
      },
      {
        id: "push.satisficing",
        label: "Satisficing",
        status: "didactic",
        ask:
          "Are respondents likely to conserve effort rather than fully retrieve and judge?",
        remember:
          "Some answers are adequate-enough responses to the form, not full reports of the person. Long lists + grids + late items invite it.",
        exerciseIds: ["none"],
        sourceCue: "Krosnick's satisficing taxonomy."
      },
      {
        id: "push.reverseCoded",
        label: "Reverse-coded item traps",
        status: "didactic",
        ask:
          "Is this “quality check” actually making the item harder to answer?",
        remember:
          "Reverse-worded items often add confusion and noise rather than catching careless respondents — not the magic attention check they look like.",
        exerciseIds: ["none"]
      }
    ]
  },
  {
    id: "boundary",
    label: "Boundary & proof",
    question: "What does this inspection not cover, and how would a professional test it?",
    memorySentence:
      "Response-option fit is one inspection pass; professional credibility comes from knowing the pass and knowing where it stops.",
    nodes: [
      {
        id: "boundary.slice",
        label: "Option issue vs survey issue",
        status: "practiced",
        ask:
          "Is the answer menu broken, or is another part of the survey broken?",
        remember:
          "Sampling, sample size, recall window, mode, weighting can all break a survey. They are not the same failure as the answer choices.",
        exerciseIds: ["E5"]
      },
      {
        id: "boundary.sampling",
        label: "Sampling / nonresponse",
        status: "outOfScope",
        ask: "Is the respondent pool wrong rather than the answer menu?",
        remember:
          "A perfect option set cannot fix a bad sample — and a clean number can hide the sample's tilt.",
        exerciseIds: ["none"]
      },
      {
        id: "boundary.mode",
        label: "Full mode design",
        status: "outOfScope",
        ask:
          "Is the mode changing how people see, hear, or process the options?",
        remember:
          "Mode matters, but this lab only names mode where it affects how response options behave.",
        exerciseIds: ["none"]
      },
      {
        id: "boundary.analysis",
        label: "Analysis / weighting / visualization",
        status: "outOfScope",
        ask: "Is the distortion happening after collection?",
        remember:
          "Downstream analysis can mislead, but it is not response-option fit.",
        exerciseIds: ["none"]
      },
      {
        id: "boundary.cognitiveTesting",
        label: "Cognitive testing",
        status: "didactic",
        ask:
          "Did real respondents interpret and use the options as intended?",
        remember:
          "Looking clean is not evidence; pretesting is where hidden option failures surface.",
        exerciseIds: ["future"],
        sourceCue: "Willis; CDC/NCHS Q-Bank; Census DICE."
      }
    ]
  }
];

/* "Things you can now say without bluffing" — the credentialing panel
   from L. Each is a sourced factoid the visitor can drop in expert
   conversation. The named sources here are real (Krosnick, Presser,
   Tourangeau, Willis, AAPOR, Q-Bank, Census DICE); the specific phrasing
   is calibrated to claim only what the named source supports. */

export type CredentialingFact = {
  id: string;
  text: string;
  /* Loose attribution — a name to drop, not a footnote citation. */
  sourceCue?: string;
};

export const credentialingFacts: CredentialingFact[] = [
  {
    id: "scale-length",
    text:
      "I wouldn't assume an 11-point scale is more precise — the familiar 5–7 point range is the safer professional default because reliability gains tend to flatten or reverse past about seven categories.",
    sourceCue: "Krosnick & Presser on scale points; Saris & Gallhofer."
  },
  {
    id: "label-every-point",
    text:
      "I'd rather label every response point when possible — endpoint-only numeric scales ask respondents to invent the middle.",
    sourceCue: "Survey-methodology literature on verbal anchors."
  },
  {
    id: "midpoint",
    text:
      "A neutral midpoint isn't automatically lazy design. It can capture genuine neutrality — though it can also attract satisficing, so include it on purpose.",
    sourceCue: "Krosnick & Presser midpoint tradeoff."
  },
  {
    id: "dk",
    text:
      "A “Don't know” or “No opinion” option can IMPROVE measurement when the alternative is forcing uncertain respondents to guess.",
    sourceCue: "Krosnick & Presser; Andrews findings on DK options."
  },
  {
    id: "acquiescence",
    text:
      "Agree / disagree formats invite acquiescence — an item-specific scale (“how important…” / “how often…”) is usually cleaner.",
    sourceCue: "Krosnick & Presser."
  },
  {
    id: "order-mode",
    text:
      "Option-order effects are mode-sensitive — visual self-administered surveys often show primacy; interviewer-administered modes can produce recency.",
    sourceCue: "Krosnick & Presser on response-order effects."
  },
  {
    id: "reverse-coded",
    text:
      "Reverse-worded items aren't magic attention checks; they often add confusion and noise rather than catching careless respondents.",
    sourceCue: "Survey-methodology critiques of reverse coding."
  },
  {
    id: "cognitive-testing",
    text:
      "The professional move isn't just to inspect the written options — it's to PRETEST them with real respondents. Willis-style cognitive interviewing and repositories like NCHS Q-Bank or the Census Bureau's questionnaire-design guidance are the references I'd reach for.",
    sourceCue: "Willis on cognitive interviewing; CDC/NCHS Q-Bank; Census DICE."
  },
  {
    id: "discrimination",
    text:
      "I'd separate response-option failures from adjacent survey errors — sampling, nonresponse, mode, weighting can all matter, but they aren't the same problem, and the fix is different in each case.",
    sourceCue: "AAPOR Standard Definitions; survey-methodology literature."
  }
];

/* Optional expert lens: the Tourangeau response process. Renders in the
   closing section as a small alternative view. */
export const tourangeauProcess = {
  source: "Tourangeau, Rips & Rasinski — The Psychology of Survey Response (2000)",
  blurb:
    "Survey methodologists often explain a survey answer as a process: comprehend the question, retrieve information, judge what applies, report an answer. Response options can fail at any step.",
  steps: [
    {
      id: "attend",
      label: "Read / attend",
      examples: [
        "option order",
        "visual layout",
        "grid fatigue",
        "mode-specific scanning"
      ]
    },
    {
      id: "comprehend",
      label: "Comprehend",
      examples: [
        "ambiguous labels",
        "loaded labels",
        "vague quantifiers",
        "bundled concepts"
      ]
    },
    {
      id: "retrieve",
      label: "Retrieve",
      examples: [
        "recall-window ambiguity",
        "categories that don't match memory",
        "“recently” without a frame"
      ]
    },
    {
      id: "judge",
      label: "Judge",
      examples: [
        "missing midpoint",
        "no DK / no-opinion",
        "scale-length mismatch",
        "forced precision"
      ]
    },
    {
      id: "report",
      label: "Report",
      examples: [
        "missing option",
        "effortful “Other”",
        "acquiescence",
        "satisficing"
      ]
    }
  ]
} as const;
