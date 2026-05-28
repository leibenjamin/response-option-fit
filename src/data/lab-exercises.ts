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
   flags items that bundle two (or three) separable judgments into one
   answer slot. The set is built to defeat the "just look for the word
   'and'" heuristic:
     - Two of the bundled items use NO "and" at all (a comma, or a
       verb + adverb), so the reader has to test for two *separable
       judgments*, not a conjunction.
     - One item is triple-barreled.
     - Two decoys DO contain "and" but are NOT bundled: one because the
       "and" sits inside a named product ("rewards-and-loyalty program"),
       one because the "and" sits in the question's OBJECT ("recommend us
       to friends and family") rather than in two measured attributes.
   Flagging a decoy is the pedagogically valuable wrong move (variation
   theory: the test is "could a respondent feel oppositely about the two
   parts?", never the presence of "and"). Items are interleaved so the
   flaggable ones aren't simply the first few.

   Sub-task 2 (repair): once Sub-task 1 passes, the triple-barreled item
   surfaces a repair-selection beat with three candidate splits — one
   clean (three separate questions), one "partial" (only two ideas
   captured), one "false simplification" (collapse to a vague single
   item). The consequences of each repair are shown explicitly. (This is
   output-M's "designed cul-de-sacs" pattern.) */

export type DoubleBarreledItem = {
  id: string;
  text: string;
  /* "clean" = single idea. "bundled-2" = two separable judgments in one
     slot. "bundled-3" = triple-barreled. "decoy" = contains "and" but is
     NOT bundled (named entity, or "and" in the object, not two measured
     attributes). */
  kind: "clean" | "bundled-2" | "bundled-3" | "decoy";
  /* For bundled-2 / bundled-3, the named separable parts — shown on Check. */
  ideas?: string[];
  /* True for bundled items that contain NO "and" — used to spotlight that
     the word isn't the test. */
  noAnd?: boolean;
  /* The per-item feedback line shown on Check. */
  note: string;
};

export const doubleBarreledItems: DoubleBarreledItem[] = [
  {
    id: "tables",
    text: "How clean were the tables today?",
    kind: "clean",
    note: "Clean. One thing measured (cleanliness), one answer."
  },
  {
    id: "barista-friendly",
    text: "Was your barista friendly and helpful?",
    kind: "bundled-2",
    ideas: ["friendly", "helpful"],
    note: "Bundled — friendly and helpful are separable. A barista can be warm but useless, or brisk but a real help; that respondent has nowhere honest to land."
  },
  {
    id: "recommend-ff",
    text: "Would you recommend us to friends and family?",
    kind: "decoy",
    note: "Not bundled — even though it says “and.” The thing being measured is one: your likelihood to recommend. “Friends and family” is just the set phrase for who you'd tell, not two separate ratings. The word “and” isn't the test."
  },
  {
    id: "hot-fresh",
    text: "Did you get a hot, fresh drink?",
    kind: "bundled-2",
    ideas: ["hot", "fresh"],
    noAnd: true,
    note: "Bundled — and notice there's no “and.” Hot and fresh are separable: a drink can arrive hot but made from stale grounds, or freshly pulled but gone lukewarm. The comma hides the same two-judgments problem."
  },
  {
    id: "coffee-quality",
    text: "Rate our coffee's quality and selection.",
    kind: "bundled-2",
    ideas: ["quality", "selection"],
    note: "Bundled — quality and selection move independently. Superb espresso with only two beans on offer forces a trade-off in a single score."
  },
  {
    id: "barista-triple",
    text: "Was your barista friendly, attentive, and quick?",
    kind: "bundled-3",
    ideas: ["friendly", "attentive", "quick"],
    note: "Triple-barreled — three separable traits in one slot. A barista who was warm and attentive but slow can't answer. Sub-task 2 looks at how to repair it."
  },
  {
    id: "rewards-program",
    text: "How would you rate our rewards-and-loyalty program?",
    kind: "decoy",
    note: "Not bundled. “Rewards-and-loyalty” is the program's name — one product the respondent rates as a single thing. (This is the easy decoy: when the “and” lives inside a named entity, it's not measuring two things.)"
  },
  {
    id: "fix-quickly",
    text: "Did the barista fix your order quickly?",
    kind: "bundled-2",
    ideas: ["fixed it", "did it quickly"],
    noAnd: true,
    note: "Bundled — no “and” again. It asks two things at once: was it fixed, and was that quick? Someone whose order was fixed but slowly (or fast but still wrong) can't answer yes or no honestly."
  },
  {
    id: "atmosphere",
    text: "Is our atmosphere comfortable and quiet?",
    kind: "bundled-2",
    ideas: ["comfortable", "quiet"],
    note: "Bundled — comfortable and quiet are different judgments. A café can be cozy but loud, or silent but cramped."
  },
  {
    id: "wait",
    text: "How long did you wait in line?",
    kind: "clean",
    note: "Clean. One quantity asked."
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
      "Ask three: “Was your barista friendly?” + “…attentive?” + “…quick?”",
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
    label: "Ask two: “Was your barista attentive and quick?”",
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
  /* The 45-and-up lump is "split" once Sam (45) and Pat (78) no longer
     share a bucket — i.e., the old 45→100 span has at least one internal
     boundary. This accepts EVERY reasonable split (45–54/55+, 45–59/60+,
     45–64/65+, three-way, …) rather than hard-coding a cutoff; the earlier
     `start >= 60` check wrongly rejected a 45–54 / 55+ split even though
     the task copy called it defensible. Both ages are in exactly one
     bucket here because this is gated behind everyoneExactlyOnce. */
  const sam = bucketsContainingAge(45, bs)[0];
  const pat = bucketsContainingAge(78, bs)[0];
  return sam != null && pat != null && sam.id !== pat.id;
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
    title: "Split the 45-and-up group in two",
    brief:
      "Sam (45), Dev (65), and Pat (78) are all lumped together — three life stages averaged into one bucket. Put a boundary inside the 45-and-up range so a 45-year-old and a 78-year-old no longer share a bucket. (Where exactly is a judgment call: a 65+ split is common; 55+ or 60+ are defensible too.)",
    pass: (bs) => everyoneExactlyOnce(bs) && hasOlderSplit(bs),
    passText:
      "✓ The 45-and-up lump is split — Sam and Pat now sit in different buckets. It's a judgment call where the line goes; the lesson is that one bucket spanning 45 to 100 was too coarse to support any claim about life-stage differences.",
    hint: (bs) => {
      if (!everyoneExactlyOnce(bs))
        return "First make sure everyone still fits in exactly one bucket.";
      if (!hasOlderSplit(bs))
        return "Add a new bucket (e.g., 65+) and pull the previous bucket's end down to meet it — any split that separates the 45-year-old from the 78-year-old counts.";
      return "Done — Sam and Pat are in different buckets now.";
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

/* Full option bank. The visitor toggles items on/off. "friend" and
   "wordofmouth" are deliberately split: "friend or family" is narrow
   (intimates), and the lab's key case (Cleo, below) heard about the shop
   from an acquaintance — a channel "friend or family" silently excludes.
   "online_broad" is the over-wide bucket that lumps the three digital
   channels (social / search / podcast). */
export const channelBank: Channel[] = [
  { id: "social", label: "Social media", kind: "specific" },
  { id: "search", label: "Search engine", kind: "specific" },
  { id: "friend", label: "A friend or family member", kind: "specific" },
  { id: "print", label: "Print ad (newspaper or magazine)", kind: "specific" },
  { id: "wordofmouth", label: "Someone else mentioned us (coworker, acquaintance, etc.)", kind: "specific" },
  { id: "podcast", label: "Podcast or audio ad", kind: "specific" },
  { id: "walkby", label: "Walked past / saw your storefront", kind: "specific" },
  { id: "event", label: "A local event, fair, or market", kind: "specific" },
  { id: "other", label: "Other (please specify)", kind: "catch-all" },
  { id: "online_broad", label: "Online", kind: "broad" }
];

/* Which specific channels the broad "Online" bucket swallows. */
export const broadCoveredChannels = new Set(["social", "search", "podcast"]);

export const startingChannels = ["social", "search", "friend", "print"];

export type ChannelRespondent = {
  id: string;
  name: string;
  /* The channel they actually came through; references a channelBank id. */
  trueChannelId: string;
  /* "high" = will fill in "Other (please specify)" if their channel isn't
     listed. "low" = avoids the write-in; satisfices onto satisficeTo if
     that's offered, otherwise gives up (abandons / leaves it blank). */
  effort: "high" | "low";
  /* The wrong-but-plausible listed option a low-effort respondent grabs
     when their true channel is absent. "" = nothing plausible, so they
     abandon. (Realism note in `satisficeNote`.) */
  satisficeTo: string;
  story: string;
  /* Why this satisfice (or abandon) is the realistic move — shown on the
     row when they're not clean. */
  satisficeNote: string;
};

export const channelRespondents: ChannelRespondent[] = [
  {
    id: "ada",
    name: "Ada",
    trueChannelId: "social",
    effort: "high",
    satisficeTo: "",
    story: "saw a TikTok of your latte art",
    satisficeNote: "would reach for Other and type “TikTok,” or give up if there's no Other."
  },
  {
    id: "ben",
    name: "Ben",
    trueChannelId: "search",
    effort: "high",
    satisficeTo: "",
    story: "googled “best coffee near me”",
    satisficeNote: "would use Other to write “Google,” or give up without it."
  },
  {
    id: "eve",
    name: "Eve",
    trueChannelId: "print",
    effort: "high",
    satisficeTo: "",
    story: "saw your ad in the neighborhood magazine",
    satisficeNote: "would write it into Other; no plausible listed option otherwise."
  },
  {
    id: "cleo",
    name: "Cleo",
    trueChannelId: "wordofmouth",
    effort: "low",
    satisficeTo: "friend",
    story: "her dentist's receptionist mentioned you",
    satisficeNote: "a receptionist isn't “friend or family,” but with no general word-of-mouth option she rounds to the closest one — quietly mis-filing herself."
  },
  {
    id: "pat",
    name: "Pat",
    trueChannelId: "podcast",
    effort: "low",
    satisficeTo: "social",
    story: "heard a podcast host plug your beans",
    satisficeNote: "“I heard it on my phone” → she grabs Social media, the nearest digital-sounding option. Now a podcast ad reads as social-media reach."
  },
  {
    id: "dev",
    name: "Dev",
    trueChannelId: "walkby",
    effort: "low",
    satisficeTo: "",
    story: "walked past for a week, finally came in",
    satisficeNote: "no listed option fits “I just walked by,” and she won't bother with a write-in — so she leaves it blank and vanishes from the data."
  },
  {
    id: "lin",
    name: "Lin",
    trueChannelId: "event",
    effort: "low",
    satisficeTo: "",
    story: "met you at the food fair last weekend",
    satisficeNote: "“a fair” has no home here and she won't write one in — another silent drop-out."
  }
];

/* Five landing states (vs the old three): a respondent can land on their
   true channel (clean), be swallowed by a broad bucket (lumped — counted
   but coarse), write into Other (other — captured, unstructured),
   mis-file onto a wrong listed option (satisficed), or give up entirely
   (abandoned — silently absent from the data). */
export type ChannelLandingState =
  | "clean"
  | "lumped"
  | "other"
  | "satisficed"
  | "abandoned";
export type ChannelLanding = {
  state: ChannelLandingState;
  /* The option id they picked, or "" if abandoned. */
  pickedId: string;
};

export function channelLandingFor(
  r: ChannelRespondent,
  offered: string[]
): ChannelLanding {
  /* 1. True channel offered → clean (always preferred). */
  if (offered.includes(r.trueChannelId)) {
    return { state: "clean", pickedId: r.trueChannelId };
  }
  /* 2. A broad bucket that genuinely covers them → lumped (one tap, fits,
     but loses the specific channel). Preferred over Other / satisficing. */
  if (offered.includes("online_broad") && broadCoveredChannels.has(r.trueChannelId)) {
    return { state: "lumped", pickedId: "online_broad" };
  }
  /* 3. High-effort respondents will write into Other. */
  if (r.effort === "high" && offered.includes("other")) {
    return { state: "other", pickedId: "other" };
  }
  /* 4. Otherwise, satisfice onto a plausible wrong option if one is offered. */
  if (r.satisficeTo !== "" && offered.includes(r.satisficeTo)) {
    return { state: "satisficed", pickedId: r.satisficeTo };
  }
  /* 5. Nothing plausible → they give up. */
  return { state: "abandoned", pickedId: "" };
}

export type ChannelTallies = {
  clean: number;
  lumped: number;
  other: number;
  satisficed: number;
  abandoned: number;
  total: number;
};

export function channelTallies(offered: string[]): ChannelTallies {
  const t: ChannelTallies = {
    clean: 0,
    lumped: 0,
    other: 0,
    satisficed: 0,
    abandoned: 0,
    total: channelRespondents.length
  };
  for (const r of channelRespondents) {
    t[channelLandingFor(r, offered).state] += 1;
  }
  return t;
}

export function offeredHasBroad(offered: string[]): boolean {
  return offered.some(
    (id) => (channelBank.find((c) => c.id === id)?.kind ?? null) === "broad"
  );
}

/* The 4-dimension ledger (output-M's "consequence ledger"). Each is a
   3-level qualitative reading — low / medium / high — never a fake
   numeric score. The four are genuinely independent so each task can
   target a different one:
     - Coverage      : did everyone answer at all? (abandoners hurt this)
     - Analyst detail: how many answers preserve the TRUE channel? (clean only)
     - Exclusivity   : are the options non-overlapping? (a broad bucket kills it)
     - Respondent burden: how long is the list? */
export type LedgerLevel = "low" | "medium" | "high";
export type ChannelLedger = {
  coverage: LedgerLevel;
  exclusivity: LedgerLevel;
  analystDetail: LedgerLevel;
  respondentBurden: LedgerLevel;
};

export function channelLedger(offered: string[]): ChannelLedger {
  const t = channelTallies(offered);
  const answered = t.total - t.abandoned;
  const coverage: LedgerLevel =
    t.abandoned === 0 ? "high" : answered >= t.total - 1 ? "medium" : "low";
  const analystDetail: LedgerLevel =
    t.clean === t.total ? "high" : t.clean >= 4 ? "medium" : "low";
  const exclusivity: LedgerLevel = offeredHasBroad(offered) ? "low" : "high";
  const respondentBurden: LedgerLevel =
    offered.length <= 4 ? "low" : offered.length <= 8 ? "medium" : "high";
  return { coverage, exclusivity, analystDetail, respondentBurden };
}

/* Everyone lands on their TRUE channel — the all-clean state. (Lumped,
   Other, satisficed, and abandoned all fall short.) */
export function channelAllClean(offered: string[]): boolean {
  return channelTallies(offered).clean === channelRespondents.length;
}

/* The two-task ladder. Task 1 drives Coverage + Analyst detail (get
   everyone onto their true channel; discover that "Other" can't rescue
   low-effort people). Task 2 drives Exclusivity + Respondent burden (the
   broad-bucket and Other padding are dead weight — ship the leanest list
   that stays all-clean). */
export type ChannelTask = {
  id: "capture" | "trim";
  title: string;
  brief: string;
  pass: (offered: string[]) => boolean;
  passText: string;
  hint: (offered: string[]) => string;
};

export const channelTasks: ChannelTask[] = [
  {
    id: "capture",
    title: "Get everyone onto their real channel",
    brief:
      "The starter four leave Cleo and Pat mis-filed and Dev and Lin gone entirely. Add options until all seven land on their TRUE channel — watch Coverage and Analyst detail climb. (Tempted to just add “Other”? Try it — these four are all low-effort and won't write one in.)",
    pass: channelAllClean,
    passText:
      "✓ All seven on their true channel. Notice what “Other” alone could NOT do: the four missing-channel visitors are low-effort, so they mis-filed or vanished rather than type a write-in. Coverage is about giving people a real place — not a catch-all they won't use.",
    hint: (offered) => {
      const t = channelTallies(offered);
      if (t.abandoned > 0)
        return `${t.abandoned} visitor(s) left it blank — no option fits them and they won't write one in. Add the specific channel(s) they came through.`;
      if (t.satisficed > 0)
        return `${t.satisficed} visitor(s) mis-filed onto a wrong option. Find whose true channel still isn't offered (look at Cleo and Pat) and add it.`;
      if (t.lumped > 0)
        return "Someone's getting swallowed by the broad “Online” bucket instead of their real channel — add their specific option.";
      if (t.other > 0)
        return "Someone's parked in “Other.” That captures them but loses the channel — add their specific option so it's structured.";
      return "Almost — everyone needs their own true channel offered.";
    }
  },
  {
    id: "trim",
    title: "Ship the leanest honest list",
    brief:
      "A teammate wants to add an “Online” catch-all and an “Other” box “to be safe.” Try them and watch Exclusivity and Respondent burden — then ship the shortest list that keeps everyone clean.",
    pass: (offered) =>
      channelAllClean(offered) &&
      !offeredHasBroad(offered) &&
      offered.length <= 8,
    passText:
      "✓ Lean and all-clean. The “Online” bucket lumped three distinct channels into one (Exclusivity drops, and you can't tell TikTok from a podcast afterward); “Other” just added length the low-effort visitors never used. Every option should earn its place.",
    hint: (offered) => {
      if (!channelAllClean(offered))
        return "First get everyone back to clean — Task 1's state.";
      if (offeredHasBroad(offered))
        return "The broad “Online” bucket overlaps social / search / podcast — it tanks Exclusivity. Drop it.";
      if (offered.length > 8)
        return "The list is long enough to be a burden. Drop any option no real visitor needs (the “Other” box, for one — nobody used it).";
      return "Lean and clean.";
    }
  }
];

/* ─── Exercise 5 — Review the draft before it ships (capstone) ────────────
   Roast & Brew (the same shop from Exercises 1–4) is about to email an
   "improved" feedback survey. The visitor is the last reviewer. They read
   the actual draft — five questions plus the note about who it goes to —
   and diagnose each element with one of four inspection lenses (SLOT /
   RULER / PUSH / BOUNDARY) or mark it as already fine.

   This replaces the old "six disconnected finding cards" (which read like
   a pop quiz on unrelated topics). It is deliberately coherent: one shop,
   one survey, problems the visitor already practiced (a leading stem from
   E1, a double-barreled item from E2, overlapping age buckets from E3, a
   narrow channel list from E4), plus a clean decoy (don't flag what's
   fine) and a sampling note that is a real problem but NOT a
   response-option one (the BOUNDARY of what this whole lab inspects). It
   also introduces the four-lens vocabulary in use, right before the
   closing map formalizes it. Reuse-in-a-new-context = spacing + retrieval
   + transfer (output-M). */

export type ReviewDiagnosis = "slot" | "ruler" | "push" | "boundary" | "fine";

/* The lens labels + the one-line inspection question each asks. These are
   the lab's own SLOT/RULER/PUSH/BOUNDARY framing (see the closing map),
   shown here as the diagnosis choices so the visitor meets them in use. */
export const reviewDiagnosisLabel: Record<ReviewDiagnosis, string> = {
  slot: "SLOT problem",
  ruler: "RULER problem",
  push: "PUSH problem",
  boundary: "Real, but not an answer-choice problem",
  fine: "This one's fine — ship it"
};

export const reviewDiagnosisAsk: Record<ReviewDiagnosis, string> = {
  slot: "No honest place to answer (missing / overlapping / two-things-at-once).",
  ruler: "The scale can't measure the thing (undefined units, no range, bad labels).",
  push: "The wording or order steers the answer.",
  boundary: "A real survey problem, but about who was asked — not the answer choices.",
  fine: "Clean as written."
};

export type ReviewElement = {
  id: string;
  /* "question" renders as a survey item; "footnote" as the who-it-goes-to note. */
  kind: "question" | "footnote";
  /* Small label, e.g. "Question 1" / "Before you send". */
  label: string;
  /* The stem / footnote text. */
  text: string;
  /* The answer options shown (questions only). */
  options?: readonly string[];
  /* The correct diagnosis. */
  correct: ReviewDiagnosis;
  /* Explanation shown once diagnosed correctly (connects back to E1–E4). */
  whenRight: string;
  /* A gentle nudge shown on a wrong pick. */
  hint: string;
};

export const reviewElements: ReviewElement[] = [
  {
    id: "q-delightful",
    kind: "question",
    label: "Question 1",
    text: "How delightful was your visit to Roast & Brew?",
    options: [
      "Very satisfied",
      "Satisfied",
      "Neutral",
      "Dissatisfied",
      "Very dissatisfied"
    ],
    correct: "push",
    whenRight:
      "PUSH. The scale underneath is actually balanced — the problem is the word “delightful,” which pre-loads a positive answer before anyone reads an option. That's the leading-stem move you ran in Exercise 1. Fix: ask “How was your visit?”",
    hint:
      "Look at the scale vs the wording. The five points are balanced and fine. So what's tilting the answer — and which lens is about wording that steers?"
  },
  {
    id: "q-barista",
    kind: "question",
    label: "Question 2",
    text: "Was your barista friendly and fast?",
    options: ["Yes", "No"],
    correct: "slot",
    whenRight:
      "SLOT. Double-barreled — friendly and fast are separable. A barista who was warm but slow (or brisk but quick) leaves the respondent with no honest Yes or No. Exercise 2's trap, in the wild. Fix: split into two questions.",
    hint:
      "Could a visitor feel one way about part of this and the opposite about the other part? If so, where does that answer go?"
  },
  {
    id: "q-often",
    kind: "question",
    label: "Question 3",
    text: "How often do you visit us?",
    options: ["Rarely", "Sometimes", "Often"],
    correct: "ruler",
    whenRight:
      "RULER. “Rarely / sometimes / often” have no fixed units — your “often” may be someone else's “sometimes,” so two identical visit habits can land on different answers. The scale's tick marks aren't defined. Fix: use real frequencies (e.g., “1–3 times a month”).",
    hint:
      "Two people who both visit, say, twice a month — would they reliably pick the same word here? If not, what does the scale fail to pin down?"
  },
  {
    id: "q-age",
    kind: "question",
    label: "Question 4",
    text: "Your age?",
    options: ["18–25", "25–40", "40+"],
    correct: "slot",
    whenRight:
      "SLOT. The boundaries overlap — 25 sits in two buckets, 40 in two — and there's no bucket under 18. A 25-year-old has two right answers and picks unpredictably. Exercise 3's MECE problem. Fix: 18–24 / 25–39 / 40+ (and decide whether under-18 matters).",
    hint:
      "Pick an age that sits exactly on a boundary. How many buckets does it belong to? And is everyone covered?"
  },
  {
    id: "q-visits",
    kind: "question",
    label: "Question 5",
    text: "About how many times did you visit us last month?",
    options: ["0", "1–3", "4–8", "9 or more"],
    correct: "fine",
    whenRight:
      "Fine — ship it. Non-overlapping buckets, a real zero, an open top end, one clear thing measured over a stated period. Not every question is broken; flagging this one would only cost you credibility with the owner.",
    hint:
      "Check the buckets for overlap, gaps, and a stated time period. If you can't find a fault… maybe there isn't one. Restraint is part of review."
  },
  {
    id: "footnote-sample",
    kind: "footnote",
    label: "Before you send",
    text:
      "This survey will be emailed only to Roast & Brew loyalty-app members who visited in the past 7 days. 34 responses are expected.",
    correct: "boundary",
    whenRight:
      "Right to flag, wrong toolbox. Only recent, opted-in regulars get asked, so the results will skew rosy no matter how clean the answer choices are — and 34 responses is thin. Both are real problems, but they're about WHO is asked, not how. That's the boundary of what this lab inspects: fixing answer choices can't fix a tilted sample.",
    hint:
      "Nothing here is about answer choices at all. Is the problem how the questions are written — or who's being asked?"
  }
];

export type ReviewAnswers = Record<string, ReviewDiagnosis | null>;

export function reviewElementIsPassed(
  el: ReviewElement,
  answers: ReviewAnswers
): boolean {
  return answers[el.id] === el.correct;
}

export function reviewAllPassed(answers: ReviewAnswers): boolean {
  return reviewElements.every((el) => reviewElementIsPassed(el, answers));
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
    marks: [
      { branchId: "slot", concepts: ["spotting bundles + bad buckets in a real draft"] },
      { branchId: "ruler", concepts: ["spotting an undefined scale"] },
      { branchId: "push", concepts: ["spotting a leading stem"] },
      { branchId: "boundary", concepts: ["telling an answer-choice problem from a sampling one"] }
    ],
    caveat:
      "Reviewing a real draft means knowing when to STOP flagging: the clean question stays, and the sampling note is a real problem you raise elsewhere — not something cleaner answer choices can fix."
  }
};

/* ─── Terms of art vs the lab's own shorthand ────────────────────────────
   The author's concern: a visitor shouldn't leave thinking the lab's
   coinages (SLOT/RULER/PUSH, "the flip") are established survey vocabulary,
   or misuse a borrowed term (MECE) with a real methodologist. This glossary
   is rendered as an expandable panel in the closing map and as the source
   of the small "term" markers. Classifications are conservative; Run N
   (docs/research/2026-05-27-terms-and-evidence) is staged to verify and
   refine them. */
export type TermStatus = "established" | "borrowed" | "lab";

export const termStatusLabel: Record<TermStatus, string> = {
  established: "Established survey term",
  borrowed: "Borrowed from another field",
  lab: "This lab's own shorthand"
};

export type GlossaryTerm = {
  term: string;
  status: TermStatus;
  note: string;
};

export const termGlossary: GlossaryTerm[] = [
  {
    term: "Double-barreled question",
    status: "established",
    note: "Standard survey-methodology term: one item that asks about two things at once, so a respondent who feels differently about each has no honest answer."
  },
  {
    term: "Leading question",
    status: "established",
    note: "Standard term: wording that nudges the respondent toward a particular answer before they read the options."
  },
  {
    term: "Primacy & recency effects",
    status: "established",
    note: "Standard response-order terms: in self-administered (read) lists the first options gain an edge; in spoken (heard) lists the last ones do. (Krosnick & Presser.)"
  },
  {
    term: "Satisficing",
    status: "established",
    note: "Standard term (Krosnick): giving an adequate-enough answer — picking a listed option, skipping the write-in — instead of fully retrieving and judging."
  },
  {
    term: "Acquiescence / yea-saying",
    status: "established",
    note: "Standard term: the pull toward agreeing with a statement regardless of content, which agree/disagree formats invite."
  },
  {
    term: "Balanced scale · neutral midpoint · scale points",
    status: "established",
    note: "Ordinary, standard survey-design vocabulary for the shape of a rating scale."
  },
  {
    term: "Vague quantifiers",
    status: "established",
    note: "Standard term for undefined frequency words (“often,” “sometimes,” “rarely”) that respondents interpret differently."
  },
  {
    term: "MECE",
    status: "borrowed",
    note: "Borrowed from management consulting (“mutually exclusive, collectively exhaustive”). A survey methodologist would just say the categories must be mutually exclusive and exhaustive — “MECE” itself isn't survey jargon, so don't lean on the acronym with one."
  },
  {
    term: "Response-option fit",
    status: "lab",
    note: "This lab's framing phrase for the whole topic. The field talks about “response categories” or “answer choices” and whether they're adequate; “fit” is our shorthand."
  },
  {
    term: "SLOT · RULER · PUSH · BOUNDARY",
    status: "lab",
    note: "Our four-lens shorthand for organizing the failures — useful for remembering, but a survey methodologist won't recognize the words. The concepts inside each lens (double-barreled, primacy, etc.) are the real terms; lead with those."
  },
  {
    term: "“The flip” · “hostile goal”",
    status: "lab",
    note: "Names for two exercise devices in this lab, not field terms."
  }
];

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
