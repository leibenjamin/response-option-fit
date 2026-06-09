/* Data + engines for the authored `#lab` exercises (except E1, which lives in
   satisfaction-lab.ts), plus the closing knowledge map and per-exercise
   micro-receipts.

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

   E1 (the scale-builder) lives in src/data/satisfaction-lab.ts. The display
   order is positional; internal data ids remain stable for receipts, drawers,
   and map links. */

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
   7 authored respondents. Each respondent has a true channel + a write-in
   tolerance (high = will type into "Other" when their channel is missing;
   low = won't, so they pick the closest listed option or skip). Live
   ledger shows four tradeoff dimensions per M's "consequence ledger":
   ANSWER-SPACE COVERAGE (everyone has a place), MUTUAL EXCLUSIVITY (no
   overlaps), ANALYST DETAIL (specific vs lumped), RESPONDENT BURDEN
   (list length / effort).

   The lesson, stated safely (Run N audit, §7): "Other (please specify)"
   helps but is not a full repair for a missing option. It asks the
   respondent to notice the mismatch, choose the escape hatch, and write a
   better answer — and not everyone will. In THIS authored cast, four
   won't, so a bare "Other" leaves them mis-filed or absent. The
   professional move is to PILOT (watch where people mis-file or skip) and
   PROMOTE common write-ins to their own listed options. We do NOT claim
   "Other mainly captures high-effort respondents" as a general empirical
   law — only that a write-in is extra effort some respondents decline. */

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
   Two BROAD buckets bisect the eight specifics cleanly by online/offline,
   so Task 2 (fit the list to a decision) has a clean two-bucket answer:
     online_broad  → social, search, podcast
     offline_broad → friend, wordofmouth, print, walkby, event */
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
  { id: "online_broad", label: "Online", kind: "broad" },
  { id: "offline_broad", label: "Offline (print, word of mouth, in person)", kind: "broad" }
];

/* Which specific channels each broad bucket swallows. A respondent is
   "lumped" if an offered broad bucket covers their true channel. */
export const broadBucketCoverage: Record<string, string[]> = {
  online_broad: ["social", "search", "podcast"],
  offline_broad: ["friend", "wordofmouth", "print", "walkby", "event"]
};

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

/* The stories deliberately don't keyword-match their channel — you can't
   skim "TikTok → Social media" and transcribe. Several point the WRONG way
   (a coworker reshared it → still Social, not word-of-mouth; a podcast HOST
   plugged it → Podcast, not "someone mentioned us"), so the only way to get
   everyone clean is to reason about each person's real channel and watch the
   live landing confirm it. The notes describe EFFORT (the model's key
   variable) and whether they have a fallback — not where each one rounds to,
   which the cast shows live. */
export const channelRespondents: ChannelRespondent[] = [
  {
    id: "ada",
    name: "Ada",
    trueChannelId: "social",
    effort: "high",
    satisficeTo: "",
    story: "started following you after a coworker kept reposting your latte art",
    satisficeNote: "high-effort: she'll type her real channel into Other if it isn't listed (and only give up if there's no Other)."
  },
  {
    id: "ben",
    name: "Ben",
    trueChannelId: "search",
    effort: "high",
    satisficeTo: "",
    story: "was comparing nearby cafés on his phone and yours came up first",
    satisficeNote: "high-effort: writes his real channel into Other when it's missing."
  },
  {
    id: "eve",
    name: "Eve",
    trueChannelId: "print",
    effort: "high",
    satisficeTo: "",
    story: "spotted your ad while flipping through the neighborhood magazine",
    satisficeNote: "high-effort: writes it into Other if there's no print option."
  },
  {
    id: "cleo",
    name: "Cleo",
    trueChannelId: "wordofmouth",
    effort: "low",
    satisficeTo: "friend",
    story: "heard about you from her dentist's receptionist, in passing",
    satisficeNote: "low-effort: won't write anything in — she just picks whichever listed option feels closest. (A receptionist isn't “friend or family.”)"
  },
  {
    id: "pat",
    name: "Pat",
    trueChannelId: "podcast",
    effort: "low",
    satisficeTo: "social",
    story: "heard a podcast host she trusts plug your beans mid-episode",
    satisficeNote: "low-effort: won't type a write-in — she grabs the nearest listed option instead."
  },
  {
    id: "dev",
    name: "Dev",
    trueChannelId: "walkby",
    effort: "low",
    satisficeTo: "",
    story: "passed your window every morning for a week before coming in",
    satisficeNote: "low-effort, and nothing close fits “I just walked by” — with no real home she leaves it blank."
  },
  {
    id: "lin",
    name: "Lin",
    trueChannelId: "event",
    effort: "low",
    satisficeTo: "",
    story: "tasted your cold brew at the Saturday night market",
    satisficeNote: "low-effort: won't write in a one-off like a night market — another silent drop-out."
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
  /* 2. An offered broad bucket that covers them → lumped (one tap, fits, but
     loses the specific channel). Preferred over Other / satisficing. */
  for (const bucketId of offered) {
    if (broadBucketCoverage[bucketId]?.includes(r.trueChannelId)) {
      return { state: "lumped", pickedId: bucketId };
    }
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

/* True mutual-exclusivity violation: a broad bucket AND a specific channel it
   covers are BOTH offered, so a respondent has two valid homes. Two
   non-overlapping broad buckets (Task 2's answer) do NOT count as overlap. */
export function offeredHasOverlap(offered: string[]): boolean {
  return offered.some(
    (id) =>
      broadBucketCoverage[id] != null &&
      broadBucketCoverage[id].some((specific) => offered.includes(specific))
  );
}

/* Only broad buckets offered (no specific channels, no Other) — the lean
   "fit the list to the decision" shape Task 2 asks for. */
export function channelOnlyBroad(offered: string[]): boolean {
  return (
    offered.length > 0 &&
    offered.every((id) => broadBucketCoverage[id] != null)
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
  /* Low only when a broad bucket overlaps a specific it covers — NOT just
     because a broad bucket is present (two clean buckets are exclusive). */
  const exclusivity: LedgerLevel = offeredHasOverlap(offered) ? "low" : "high";
  const respondentBurden: LedgerLevel =
    offered.length <= 4 ? "low" : offered.length <= 8 ? "medium" : "high";
  return { coverage, exclusivity, analystDetail, respondentBurden };
}

/* Everyone lands on their TRUE channel — the all-clean state. (Lumped,
   Other, satisficed, and abandoned all fall short.) */
export function channelAllClean(offered: string[]): boolean {
  return channelTallies(offered).clean === channelRespondents.length;
}

/* Everyone lumped into a broad bucket — Task 2's "fit the list to the
   online-vs-offline decision" state. */
export function channelAllLumped(offered: string[]): boolean {
  return channelTallies(offered).lumped === channelRespondents.length;
}

/* The two-task ladder, redesigned 2026-05-29. Task 1 (CAPTURE): read past the
   keyword-wrong stories, give everyone their true channel; discover that
   "Other" can't rescue the low-effort visitors. Task 2 (FIT): the gestalt
   flip — the owner's question changes to "online vs offline, nothing finer,"
   so the per-channel detail becomes burden and the broad bucket that was WRONG
   in Task 1 is exactly RIGHT here. The right grain depends on the decision. */
export type ChannelTask = {
  id: "capture" | "fit";
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
      "The starter four leave two visitors mis-filed and two gone entirely. Read each story past the obvious keyword — a coworker resharing a post is still Social; a podcast HOST plugging you is Podcast, not “someone mentioned us.” Add options until all seven land on their TRUE channel. (Tempted to just add “Other”? Try it — the low-effort visitors won't bother with the write-in, so they mis-file or skip anyway.)",
    pass: channelAllClean,
    passText:
      "✓ All seven on their true channel — and you had to reason it out, not skim it. Notice what “Other” alone did not do: a write-in is extra effort, and the low-effort visitors declined it, so they mis-filed or skipped. “Other” helps, but it isn't a full repair for a missing option.",
    hint: (offered) => {
      const t = channelTallies(offered);
      if (t.abandoned > 0)
        return `${t.abandoned} visitor(s) left it blank — no option fits them and they won't write one in. Work out the real channel behind their story and add it.`;
      if (t.satisficed > 0)
        return `${t.satisficed} visitor(s) mis-filed onto a close-but-wrong option. Whose real channel still isn't offered? Don't trust the obvious keyword — read what actually happened.`;
      if (t.lumped > 0)
        return "Someone's getting swallowed by a broad bucket instead of their real channel — add their specific option.";
      if (t.other > 0)
        return "Someone's parked in “Other.” That captures them but loses the channel — add their specific option so it's structured.";
      return "Almost — everyone needs their own true channel offered.";
    }
  },
  {
    id: "fit",
    title: "Now fit the list to the decision",
    brief:
      "Forget per-channel for a moment. The owner is deciding ONE thing: should she shift her ad budget online? She needs online vs offline — nothing finer. Rebuild the answer choices for THAT question, with the least burden on respondents. (The two broad buckets you avoided in Task 1 are waiting on the shelf.)",
    pass: (offered) => channelOnlyBroad(offered) && channelAllLumped(offered),
    passText:
      "✓ Same seven people, a different right answer. In Task 1 every channel had to earn its own option, because the report was per-channel. Here the only question is online vs offline — so the detail is burden, and the broad split you avoided before is now exactly right. Completeness is downstream of the reporting task: there's no universally “complete” list — the right grain is the one the decision needs. (Watch the ledger — detail dropped on purpose; coverage, exclusivity, and burden all stayed healthy.)",
    hint: (offered) => {
      if (channelAllLumped(offered) && channelOnlyBroad(offered)) return "Done.";
      if (channelAllClean(offered))
        return "This question doesn't need per-channel detail — swap the eight specifics for the two broad buckets (“Online” and “Offline”).";
      if (!channelOnlyBroad(offered))
        return "Drop everything except the two broad buckets — any specific channel or the “Other” box is finer detail than this decision needs.";
      return "You need BOTH buckets: the online visitors need “Online,” the offline visitors need “Offline.” Add the missing one.";
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
    text: "Roast & Brew is famous for its delightful service. How satisfied were you with your visit?",
    options: [
      "Very satisfied",
      "Satisfied",
      "Neutral",
      "Dissatisfied",
      "Very dissatisfied"
    ],
    correct: "push",
    whenRight:
      "PUSH. The five points are a balanced satisfaction scale, and they match the question — that part's fine. The problem is the lead-in, “famous for its delightful service,” which primes a positive answer before anyone reads an option. That's the leading-stem move from Exercise 1. Fix: drop the praise — just “How satisfied were you with your visit?”",
    hint:
      "The scale and the question agree (both about satisfaction), and the five points are balanced. So what's tilting the answer before the options are even read — and which lens is about wording that steers?"
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

/* ─── Exercise 6 — Scale length / granularity (RULER) ─────────────────────
   The counterintuitive 5–7 rule, felt. Each of six visitors has a true
   latent satisfaction on a 0–100 axis and a "discrimination width" — the
   smallest gap they can reliably tell apart (W). The visitor picks the
   number of scale points; the engine maps each true feeling to the nearest
   point and reports two things:
     - DISTINCTIONS KEPT: do genuinely-different visitors (>W apart) get
       forced onto the same answer? Too few points crushes real differences.
     - EACH ANSWER TRUSTWORTHY: are the points farther apart than W, so a
       respondent can reliably tell adjacent points apart? Too many points
       (gaps < W) is false precision — the same person would wobble between
       neighbours on a different day.
   Sweet spot ≈ 5–7. The arc: Task 1 (keep distinctions) tempts you UP — even
   11 points satisfies it — then Task 2 (also stay trustworthy) reveals 11's
   unreliability and pulls you back. The "crank to 11" is a costly affordance
   (output-M): selectable, and its specific failure is shown. */

export const scaleLengthChoices = [2, 3, 5, 7, 11] as const;
export const scaleLengthStart = 3;
/* Discrimination width: gaps narrower than this can't be reliably told
   apart, and any two visitors closer than this aren't "genuinely
   different." */
export const scaleDiscriminationWidth = 12;

export type ScaleLengthVisitor = {
  id: string;
  name: string;
  feeling: string;
  /* True latent satisfaction, 0 (hated it) .. 100 (adored it). */
  trueval: number;
};

export const scaleLengthCast: ScaleLengthVisitor[] = [
  { id: "ada", name: "Ada", feeling: "adored it", trueval: 92 },
  { id: "ben", name: "Ben", feeling: "liked it a lot", trueval: 78 },
  { id: "cleo", name: "Cleo", feeling: "mildly positive", trueval: 60 },
  { id: "dev", name: "Dev", feeling: "slightly underwhelmed", trueval: 48 },
  { id: "eve", name: "Eve", feeling: "unhappy", trueval: 30 },
  { id: "fin", name: "Fin", feeling: "hated it", trueval: 12 }
];

export function scalePointPositions(n: number): number[] {
  if (n <= 1) return [50];
  return Array.from({ length: n }, (_, i) => (i * 100) / (n - 1));
}

const scaleLabelSets: Record<number, string[]> = {
  2: ["Dissatisfied", "Satisfied"],
  3: ["Dissatisfied", "Neutral", "Satisfied"],
  5: [
    "Very dissatisfied",
    "Dissatisfied",
    "Neutral",
    "Satisfied",
    "Very satisfied"
  ],
  7: [
    "Very dissatisfied",
    "Dissatisfied",
    "Slightly dissatisfied",
    "Neutral",
    "Slightly satisfied",
    "Satisfied",
    "Very satisfied"
  ]
};

export function scalePointLabels(n: number): string[] {
  if (scaleLabelSets[n]) return scaleLabelSets[n];
  /* For 11 points: a 0–10 numeric scale with only the ends anchored. */
  return Array.from({ length: n }, (_, i) =>
    i === 0 ? "0 (hated it)" : i === n - 1 ? `${n - 1} (adored it)` : `${i}`
  );
}

export type ScaleLanding = {
  index: number;
  label: string;
  /* True iff the second-nearest point is within W of the true feeling —
     i.e., the respondent could plausibly have picked the neighbour. */
  ambiguous: boolean;
  altLabel: string | null;
};

export function scaleLandingFor(v: ScaleLengthVisitor, n: number): ScaleLanding {
  const pts = scalePointPositions(n);
  const labels = scalePointLabels(n);
  const dists = pts.map((p) => Math.abs(p - v.trueval));
  let best = 0;
  for (let i = 1; i < pts.length; i += 1) {
    /* Strictly nearer wins; on a tie the higher (more positive) point wins. */
    if (dists[i] <= dists[best]) best = i;
  }
  /* Second-nearest. */
  let second = -1;
  for (let i = 0; i < pts.length; i += 1) {
    if (i === best) continue;
    if (second === -1 || dists[i] < dists[second]) second = i;
  }
  const ambiguous =
    second !== -1 && dists[second] <= scaleDiscriminationWidth;
  return {
    index: best,
    label: labels[best],
    ambiguous,
    altLabel: second !== -1 ? labels[second] : null
  };
}

/* Genuinely-different visitors (>W apart) who are forced onto the same point. */
export function scaleCollapsedPairs(n: number): number {
  const W = scaleDiscriminationWidth;
  let count = 0;
  for (let i = 0; i < scaleLengthCast.length; i += 1) {
    for (let j = i + 1; j < scaleLengthCast.length; j += 1) {
      const a = scaleLengthCast[i];
      const b = scaleLengthCast[j];
      if (
        Math.abs(a.trueval - b.trueval) > W &&
        scaleLandingFor(a, n).index === scaleLandingFor(b, n).index
      ) {
        count += 1;
      }
    }
  }
  return count;
}

/* Visitors sharing a point with someone genuinely different — grouped by
   point label, for the readout. */
export function scaleCollapsedGroups(
  n: number
): { label: string; names: string[] }[] {
  const W = scaleDiscriminationWidth;
  const byIndex = new Map<number, ScaleLengthVisitor[]>();
  for (const v of scaleLengthCast) {
    const idx = scaleLandingFor(v, n).index;
    byIndex.set(idx, [...(byIndex.get(idx) ?? []), v]);
  }
  const groups: { label: string; names: string[] }[] = [];
  for (const [idx, members] of byIndex) {
    const genuine = members.some((a) =>
      members.some((b) => Math.abs(a.trueval - b.trueval) > W)
    );
    if (genuine && members.length > 1) {
      groups.push({
        label: scalePointLabels(n)[idx],
        names: members.map((m) => m.name)
      });
    }
  }
  return groups;
}

export function scaleGap(n: number): number {
  return n <= 1 ? 100 : 100 / (n - 1);
}

export type ScaleMeters = {
  distinctions: LedgerLevel;
  trustworthy: LedgerLevel;
};

export function scaleMeters(n: number): ScaleMeters {
  const collapsed = scaleCollapsedPairs(n);
  const distinctions: LedgerLevel =
    collapsed === 0 ? "high" : collapsed <= 2 ? "medium" : "low";
  const trustworthy: LedgerLevel =
    scaleGap(n) >= scaleDiscriminationWidth ? "high" : "low";
  return { distinctions, trustworthy };
}

export type ScaleTask = {
  id: "distinct" | "sweet-spot";
  title: string;
  brief: string;
  pass: (n: number) => boolean;
  passText: string;
  hint: (n: number) => string;
};

export const scaleTasks: ScaleTask[] = [
  {
    id: "distinct",
    title: "Stop crushing real differences",
    brief:
      "At this few points, visitors who genuinely differ are forced to give the same answer. Add points until no two genuinely-different visitors share a response. (Yes, even 11 points satisfies this — hold that thought.)",
    pass: (n) => scaleMeters(n).distinctions === "high",
    passText:
      "✓ No two genuinely-different visitors are forced to agree now. Tempted to stop at the most points possible? Task 2 is about why more isn't automatically better.",
    hint: (n) => {
      const g = scaleCollapsedGroups(n);
      if (g.length === 0) return "Distinctions kept — on to Task 2.";
      const ex = g[0];
      return `Still collapsing: ${ex.names.join(" & ")} all land on “${ex.label}” though they feel quite differently. Add points.`;
    }
  },
  {
    id: "sweet-spot",
    title: "Keep every answer trustworthy too",
    brief:
      "Now crank it to the most points and watch the second meter — when the gaps get narrower than what people can actually tell apart, the same person would wobble between neighbours on a different day. Settle on a length that keeps BOTH meters high.",
    pass: (n) => {
      const m = scaleMeters(n);
      return m.distinctions === "high" && m.trustworthy === "high";
    },
    passText:
      "✓ Distinctions kept AND every answer trustworthy — which is why 5 to 7 points is the usual professional default. Fewer crushes real differences; more (11+) collects digits people can't reliably supply (false precision). More options is not more truth.",
    hint: (n) => {
      const m = scaleMeters(n);
      if (m.trustworthy !== "high")
        return `At ${n} points the gaps are narrower than people can reliably distinguish — answers wobble. Back off to fewer points.`;
      if (m.distinctions !== "high")
        return "Don't go so far that genuinely-different visitors collapse again.";
      return "Both meters high — that's the sweet spot.";
    }
  }
];

/* ─── Exercise 7 — Don't know / Not applicable / Neutral (SLOT) ────────────
   Non-substantive options, and the expert distinction the lab most wants an
   analyst to carry: a true neutral, a "don't know / no opinion," and a "not
   applicable / never tried it" are THREE different states. Omitting the
   opt-outs forces the no-view people onto the scale (usually onto Neutral),
   so the chart calls them "raters" and the Neutral bar becomes a garbage
   magnet. Counterintuitive payoff: adding an opt-out IMPROVES the data.

   Mechanic = compare four designs (variation theory): hold the cast fixed,
   vary only which opt-outs are offered, and watch each person route live.
   Designs: none / +DK / +NA / +both. Two gated tasks:
     1. Get the non-answers off the satisfaction scale (DK or both).
     2. Keep each opt-out meaning ONE thing — a "don't know" shouldn't
        secretly contain people who never tried it (only "both").
   The wrong-but-instructive states are shown by flipping designs: the
   Neutral-magnet (none), and the DK that quietly swallows never-tried
   people (+DK only). */

export type E7State = "pos" | "neg" | "neutral" | "dk" | "na";

export type E7Visitor = {
  id: string;
  name: string;
  state: E7State;
  story: string;
};

export const oatMilkCast: E7Visitor[] = [
  { id: "ada", name: "Ada", state: "pos", story: "orders the oat latte every visit" },
  { id: "ben", name: "Ben", state: "pos", story: "switched to oat milk and loves it" },
  { id: "cleo", name: "Cleo", state: "neg", story: "thinks your oat milk splits in the cup" },
  { id: "dev", name: "Dev", state: "neutral", story: "tried it; honestly could take it or leave it" },
  { id: "eve", name: "Eve", state: "dk", story: "had it once months ago — no real opinion" },
  { id: "fin", name: "Fin", state: "na", story: "is allergic to oats; never orders it" },
  { id: "gia", name: "Gia", state: "na", story: "didn't even know you offered oat milk" }
];

export type E7Design = {
  id: "none" | "dk" | "na" | "both";
  label: string;
  hasDK: boolean;
  hasNA: boolean;
  /* Per-design consequence shown under the routing. */
  note: string;
};

export const oatMilkDesigns: E7Design[] = [
  {
    id: "none",
    label: "5-point scale only",
    hasDK: false,
    hasNA: false,
    note: "No way out. The no-opinion visitor and both never-tried visitors get forced onto the nearest non-committal answer — Neutral. Now “Neutral” holds one genuinely neutral person and three who have no business in the average. The bar looks meaningful and isn't."
  },
  {
    id: "dk",
    label: "+ “Don't know / no opinion”",
    hasDK: true,
    hasNA: false,
    note: "Better — the no-opinion visitor finally has a home, and the satisfaction scale is clean. But the two who never TRIED oat milk also grab “Don't know” (it's the closest “I can't answer”), so that bucket now secretly mixes “no opinion” with “never tried.” You can't tell them apart later."
  },
  {
    id: "na",
    label: "+ “Not applicable / haven't tried it”",
    hasDK: false,
    hasNA: true,
    note: "The two never-tried visitors route cleanly to “Not applicable.” But the no-opinion visitor still has nowhere to go and falls back onto Neutral — one phantom still propping up the satisfaction bar."
  },
  {
    id: "both",
    label: "+ both opt-outs",
    hasDK: true,
    hasNA: true,
    note: "Clean. Every answer means exactly what it says: three real views and one genuine Neutral on the scale, “no opinion” in Don't-know, “never tried” in Not-applicable. Now “% satisfied among people with a view” is a number you can defend."
  }
];

export type E7Slot = "scale-pos" | "scale-neg" | "scale-neutral" | "dk" | "na";
export type E7Landing = {
  slot: E7Slot;
  /* Display label for where they landed. */
  label: string;
  /* "clean" = lands where they belong; "forced" = pushed onto Neutral;
     "conflated" = a never-tried person lumped into Don't-know. */
  quality: "clean" | "forced" | "conflated";
};

export function oatMilkLandingFor(v: E7Visitor, d: E7Design): E7Landing {
  switch (v.state) {
    case "pos":
      return { slot: "scale-pos", label: "Satisfied", quality: "clean" };
    case "neg":
      return { slot: "scale-neg", label: "Dissatisfied", quality: "clean" };
    case "neutral":
      return { slot: "scale-neutral", label: "Neutral", quality: "clean" };
    case "dk":
      return d.hasDK
        ? { slot: "dk", label: "Don't know", quality: "clean" }
        : { slot: "scale-neutral", label: "Neutral", quality: "forced" };
    case "na":
      if (d.hasNA) return { slot: "na", label: "Not applicable", quality: "clean" };
      if (d.hasDK) return { slot: "dk", label: "Don't know", quality: "conflated" };
      return { slot: "scale-neutral", label: "Neutral", quality: "forced" };
  }
}

export function oatMilkPhantomOnScale(d: E7Design): number {
  return oatMilkCast.filter(
    (v) => oatMilkLandingFor(v, d).quality === "forced"
  ).length;
}

export function oatMilkConflation(d: E7Design): number {
  return oatMilkCast.filter(
    (v) => oatMilkLandingFor(v, d).quality === "conflated"
  ).length;
}

export type OatMilkTask = {
  id: "off-scale" | "distinct-opt-outs";
  title: string;
  brief: string;
  pass: (d: E7Design) => boolean;
  passText: string;
  hint: (d: E7Design) => string;
};

export const oatMilkTasks: OatMilkTask[] = [
  {
    id: "off-scale",
    title: "Get the non-answers off the satisfaction scale",
    brief:
      "Three visitors have no view of the oat milk to give — one has no opinion, two never tried it. Right now they're forced onto Neutral, inflating it. Add the opt-out that gives the no-view visitors somewhere honest to go, so nobody is pushed onto the satisfaction scale who shouldn't be there.",
    pass: (d) => oatMilkPhantomOnScale(d) === 0,
    passText:
      "✓ The satisfaction scale now holds only people with a real view. Notice the headline “% satisfied” just changed — the forced answers were quietly shaping it.",
    hint: (d) =>
      oatMilkPhantomOnScale(d) > 0
        ? `${oatMilkPhantomOnScale(d)} visitor(s) are still forced onto Neutral. They need a “Don't know” to escape to.`
        : "No one's forced onto the scale now — on to Task 2."
  },
  {
    id: "distinct-opt-outs",
    title: "Keep each opt-out meaning one thing",
    brief:
      "Look closely at what you just added. A “Don't know” bucket that secretly contains people who NEVER TRIED the drink isn't honest data either — “no opinion” and “never tried” are different states. Add the second opt-out so every option means exactly one thing.",
    pass: (d) => oatMilkPhantomOnScale(d) === 0 && oatMilkConflation(d) === 0,
    passText:
      "✓ A true Neutral (tried it, felt mid), a “Don't know” (has a basis to judge, no opinion), and a “Not applicable” (no basis at all) are three different states — and now each option holds exactly one of them. An opt-out didn't weaken the survey; it's what makes the rest of the numbers trustworthy.",
    hint: (d) => {
      if (oatMilkPhantomOnScale(d) > 0)
        return "First get everyone with no view off the satisfaction scale (Task 1).";
      if (oatMilkConflation(d) > 0)
        return "The never-tried visitors are hiding inside “Don't know.” Give them their own “Not applicable.”";
      return "Every opt-out means one thing now.";
    }
  }
];

/* ─── Exercise 8 (data id E8) — False premise / eligibility (SLOT) ────────
   A Yes/No that assumes a prior state merges several different respondent
   states into one answer, so the export looks clean while the denominator
   is wrong. Question: "Did order-ahead save you time?" A bare Yes/No is
   answered by people who never installed the app and people who have it but
   never used order-ahead — they have no basis, yet they land in "No,"
   inflating it.

   REDESIGN 2026-05-29 (was: two pre-labeled toggles the task named, i.e.
   instruction-following). Now the reviewer CHOOSES screeners from a shelf of
   candidates, two of which are productive-failure decoys — so Task 1 is a
   real eligibility decision, not a button-press:
     - feature  (correct): "have you used order-ahead?" establishes basis.
     - app      (necessary, not sufficient): "do you use the app?" — alone it
       leaves Dev (has app, never used the feature) in the denominator; its
       real job is to SPLIT the drop-outs in Task 2.
     - smartphone (decoy, under-screen): everyone owns a phone → screens out
       no one → denominator stays dirty. A screen must exclude the no-basis
       people, not just sound relevant.
     - weekly   (decoy, over-screen): drops Cleo, an occasional-but-real user
       whose "No, it was slower" is valid signal → a false negative. Too-tight
       screens throw away the very complaint you're trying to measure.
   The funnel resolves a drop-out's reason in canonical order (app → feature →
   …) so app-before-feature still splits never-installed vs has-app-never-used. */

export type FpCustomer = {
  id: string;
  name: string;
  story: string;
  hasApp: boolean;
  /* usedFeature === has a basis to judge order-ahead. */
  usedFeature: boolean;
  /* Frequent user — only relevant to the over-screen decoy. */
  usesWeekly: boolean;
  ownsPhone: boolean;
  /* Outcome answer if they reach the question. No-basis people, forced to
     answer about something they never did, land in "No". */
  answer: "yes" | "no";
};

export const fpCast: FpCustomer[] = [
  { id: "ada", name: "Ada", story: "uses order-ahead daily; it saves her the line", hasApp: true, usedFeature: true, usesWeekly: true, ownsPhone: true, answer: "yes" },
  { id: "ben", name: "Ben", story: "orders ahead on busy mornings; loves it", hasApp: true, usedFeature: true, usesWeekly: true, ownsPhone: true, answer: "yes" },
  { id: "cleo", name: "Cleo", story: "tried order-ahead twice; it was actually slower", hasApp: true, usedFeature: true, usesWeekly: false, ownsPhone: true, answer: "no" },
  { id: "dev", name: "Dev", story: "has the app but has never used order-ahead", hasApp: true, usedFeature: false, usesWeekly: false, ownsPhone: true, answer: "no" },
  { id: "eve", name: "Eve", story: "doesn't have the app at all", hasApp: false, usedFeature: false, usesWeekly: false, ownsPhone: true, answer: "no" },
  { id: "fin", name: "Fin", story: "pays at the counter; never installed the app", hasApp: false, usedFeature: false, usesWeekly: false, ownsPhone: true, answer: "no" }
];

export type FpScreenerId = "feature" | "app" | "smartphone" | "weekly";
export type FpScreener = {
  id: FpScreenerId;
  /* The question, exactly as it would appear before the outcome item. */
  label: string;
  /* Does this customer pass the screen (stay in)? */
  keeps: (c: FpCustomer) => boolean;
  kind: "correct" | "necessary" | "decoy-loose" | "decoy-overscreen";
  /* Shown only once the screener is active — names what it just did. */
  activeNote: string;
};

export const fpScreeners: FpScreener[] = [
  {
    id: "feature",
    label: "Have you used order-ahead?",
    keeps: (c) => c.usedFeature,
    kind: "correct",
    activeNote: "Keeps only people who have actually used order-ahead — the ones with a basis to answer."
  },
  {
    id: "app",
    label: "Do you use our app?",
    keeps: (c) => c.hasApp,
    kind: "necessary",
    activeNote: "Keeps app users. Necessary, but not enough on its own — someone can have the app and still have never used order-ahead."
  },
  {
    id: "smartphone",
    label: "Do you own a smartphone?",
    keeps: (c) => c.ownsPhone,
    kind: "decoy-loose",
    activeNote: "Everyone here owns a phone, so this screens out no one. Sounding relevant isn't the same as excluding the people with no basis."
  },
  {
    id: "weekly",
    label: "Do you use order-ahead at least weekly?",
    keeps: (c) => c.usesWeekly,
    kind: "decoy-overscreen",
    activeNote: "Too tight: it drops Cleo, who used order-ahead twice and found it slower. Her “No” is exactly the signal you want — and you just threw it away."
  }
];

/* Canonical order for resolving WHY a screened-out person dropped (and for the
   Task-2 split: app first, then feature). */
export const fpScreenerOrder: FpScreenerId[] = ["app", "feature", "smartphone", "weekly"];

export const fpStartActive: FpScreenerId[] = [];

export type FpLanding =
  | { stage: "outcome"; answer: "yes" | "no"; basis: boolean }
  /* Screened out by `byId`; `wrong` = a real-basis person dropped (a false negative). */
  | { stage: "screened"; byId: FpScreenerId; basis: boolean; wrong: boolean };

export function fpLandingFor(c: FpCustomer, active: FpScreenerId[]): FpLanding {
  /* First active screener (in canonical order) that this customer fails. */
  for (const id of fpScreenerOrder) {
    if (!active.includes(id)) continue;
    const s = fpScreeners.find((x) => x.id === id)!;
    if (!s.keeps(c)) {
      return { stage: "screened", byId: id, basis: c.usedFeature, wrong: c.usedFeature };
    }
  }
  return { stage: "outcome", answer: c.answer, basis: c.usedFeature };
}

export type FpFunnel = {
  outcomeYes: number;
  outcomeNo: number;
  outcomeTotal: number;
  /* Outcome answerers with no basis (the contamination). */
  merged: number;
  /* Real-basis users wrongly screened out (false negatives). */
  wronglyScreened: number;
  /* Drop-out reasons, for the funnel split. */
  outNoApp: number;
  outNoFeature: number;
  outOther: number;
};

export function fpFunnel(active: FpScreenerId[]): FpFunnel {
  const f: FpFunnel = {
    outcomeYes: 0,
    outcomeNo: 0,
    outcomeTotal: 0,
    merged: 0,
    wronglyScreened: 0,
    outNoApp: 0,
    outNoFeature: 0,
    outOther: 0
  };
  for (const c of fpCast) {
    const l = fpLandingFor(c, active);
    if (l.stage === "outcome") {
      f.outcomeTotal += 1;
      if (l.answer === "yes") f.outcomeYes += 1;
      else f.outcomeNo += 1;
      if (!l.basis) f.merged += 1;
    } else {
      if (l.wrong) f.wronglyScreened += 1;
      if (l.byId === "app") f.outNoApp += 1;
      else if (l.byId === "feature") f.outNoFeature += 1;
      else f.outOther += 1;
    }
  }
  return f;
}

export type FpTask = {
  id: "clean" | "informative";
  title: string;
  brief: string;
  pass: (active: FpScreenerId[]) => boolean;
  passText: string;
  hint: (active: FpScreenerId[]) => string;
};

export const fpTasks: FpTask[] = [
  {
    id: "clean",
    title: "Get the denominator honest",
    brief:
      "Add the one screener that lets only real order-ahead users reach the question. Two of the four are traps — one screens no one out, one screens too many.",
    pass: (a) => {
      const f = fpFunnel(a);
      return f.merged === 0 && f.wronglyScreened === 0;
    },
    passText:
      "✓ The denominator just got honest. The bare question read “4 of 6 say order-ahead didn't save time”; now it's “1 of 3 who actually used it” — same world, a completely different headline.",
    hint: (a) => {
      const f = fpFunnel(a);
      if (f.wronglyScreened > 0)
        return `Too hard — ${f.wronglyScreened} real user (Cleo, who tried it and found it slower) just dropped out. Her “No” is valid; keep everyone with a basis.`;
      if (f.merged > 0)
        return `Still ${f.merged} answering with no basis. “Owns a smartphone” or “uses the app” isn't enough — only actual order-ahead use is.`;
      return "Only real users reach the question now — on to Task 2.";
    }
  },
  {
    id: "informative",
    title: "Make the drop-outs tell you why",
    brief:
      "Now split the drop-outs: never installed the app (a discovery problem) vs. has it but never tried order-ahead (adoption)? Add the screener that separates them — order matters.",
    pass: (a) => {
      const f = fpFunnel(a);
      return f.merged === 0 && f.wronglyScreened === 0 && a.includes("app") && a.includes("feature");
    },
    passText:
      "✓ Now the drop-outs aren't one undifferentiated pile: two never installed the app; one has it but hasn't tried order-ahead — so you know whether to fix discovery or adoption. An ordered screener turns who-fell-out into data.",
    hint: (a) => {
      const f = fpFunnel(a);
      if (f.merged > 0 || f.wronglyScreened > 0)
        return "First get Task 1's clean denominator back (the feature screener, not the over-tight weekly one).";
      return a.includes("app")
        ? "Both the app and feature screeners are on — the funnel now splits the drop-outs."
        : "Add the “do you use the app?” screener too, so never-installed separates from has-app-never-used.";
    }
  }
];

/* ─── Exercise 9 (data id E9) — Acquiescence / yea-saying (PUSH) ───────────
   Agree/disagree formats invite agreement regardless of content: some
   people ("yea-sayers") tick Agree even when their real view is mixed or
   negative, so agreement is inflated. The instinctive fix — a reverse-worded
   check item — DETECTS the yea-sayers (they agree with both a statement and
   its opposite) but doesn't tell you what they actually think, and it makes
   careful respondents parse an awkward second item. The real fix is
   item-specific wording ("How friendly was the barista?"), which removes the
   thing there is to agree with. (Precise term: the second item is reverse-
   WORDED; flipping its score to align with the first is reverse-CODING. The
   drawer spells this out.) Mechanic = compare three designs; distinct
   counterintuitive beat (the textbook reverse-wording move is the trap).
   Verb: COMPARE. */

export type AcqView = "friendly" | "unfriendly" | "mixed";
export type AcqRespondent = {
  id: string;
  name: string;
  trueView: AcqView;
  yeaSayer: boolean;
  story: string;
};

/* The stories give only each person's REAL experience — no "easy agreer"
   labels. The yea-saying reveals itself as the mismatch: Cleo felt brushed off,
   yet the agree/disagree format records her "Agree, the barista was friendly."
   The user reads that contradiction instead of being told who's a yea-sayer.
   (Eve is a yea-sayer who genuinely liked her visit — so her Agree is
   coincidentally accurate, yet the reverse-worded check still flags her: the
   check catches a response STYLE, not a wrong answer.) */
export const acqCast: AcqRespondent[] = [
  { id: "ada", name: "Ada", trueView: "friendly", yeaSayer: false, story: "the barista was genuinely warm with her" },
  { id: "ben", name: "Ben", trueView: "unfriendly", yeaSayer: false, story: "found the barista cold and rushed" },
  { id: "cleo", name: "Cleo", trueView: "unfriendly", yeaSayer: true, story: "felt brushed off at the counter" },
  { id: "dev", name: "Dev", trueView: "mixed", yeaSayer: true, story: "had a so-so, forgettable encounter" },
  { id: "eve", name: "Eve", trueView: "friendly", yeaSayer: true, story: "had a genuinely nice visit" },
  { id: "fin", name: "Fin", trueView: "unfriendly", yeaSayer: false, story: "was plainly unimpressed with the service" }
];

export type AcqDesign = "agree" | "reverse" | "item";
export const acqDesignLabel: Record<AcqDesign, string> = {
  agree: "Agree / disagree",
  reverse: "+ reverse-worded check",
  item: "Item-specific wording"
};
export const acqDesignStem: Record<AcqDesign, string> = {
  agree: "“The barista was friendly.”  Strongly agree → Strongly disagree",
  reverse: "“The barista was friendly.” AND “The barista was unfriendly.”  (agree/disagree to each)",
  item: "“How friendly was the barista?”  Very unfriendly → Very friendly"
};
export const acqDesignNote: Record<AcqDesign, string> = {
  agree: "Agree/disagree invites agreement. The yea-sayers tick Agree no matter what they actually felt, so two people who found the barista cold (and one who was lukewarm) get recorded as agreeing the barista was friendly. Agreement is inflated before you analyze a thing.",
  reverse: "The reverse-worded item catches the yea-sayers — they agree with “friendly” AND “unfriendly,” which is a contradiction, so you can flag them as inconsistent. But notice two things: you still don't know what they actually think, and every careful respondent had to stop and parse a second, opposite-worded item. Detection is not measurement — treat it as a deliberate, pretested check, not a free attention test.",
  item: "There's nothing here to simply agree with — the respondent has to place the barista on a scale of friendliness. The acquiescence pull is gone, and every recorded answer now matches the person's real view."
};

/* Recorded answer per design. For agree/reverse the primary item is the
   "friendly" statement. */
export function acqRecorded(c: AcqRespondent, d: AcqDesign): string {
  if (d === "item") {
    return c.trueView === "friendly"
      ? "Friendly"
      : c.trueView === "unfriendly"
        ? "Unfriendly"
        : "Neutral";
  }
  /* agree / reverse: the "barista was friendly" item. */
  if (c.yeaSayer) return "Agree";
  return c.trueView === "friendly" ? "Agree" : "Disagree";
}

/* Does the recorded answer match the person's true view? */
export function acqMatchesTrue(c: AcqRespondent, d: AcqDesign): boolean {
  if (d === "item") return true;
  const saysFriendly = acqRecorded(c, d) === "Agree";
  return saysFriendly === (c.trueView === "friendly");
}

/* In the reverse design, yea-sayers agree with both items → flagged. */
export function acqFlagged(c: AcqRespondent, d: AcqDesign): boolean {
  return d === "reverse" && c.yeaSayer;
}

export function acqTrackTrueLevel(d: AcqDesign): LedgerLevel {
  const matches = acqCast.filter((c) => acqMatchesTrue(c, d)).length;
  if (matches === acqCast.length) return "high";
  if (matches >= acqCast.length - 2) return "medium";
  return "low";
}

/* Task 1's pass needs the visitor's JUDGMENT, not just the active design:
   switching to the reverse-worded check is the textbook move, but it only
   completes the task once the visitor recognizes the check DETECTED the
   yea-sayers without MEASURING anything (judgedFlagged). The tempting wrong
   judgment ("it fixed it") is the productive-failure beat. */
export type AcqTask = {
  id: "detect" | "measure";
  title: string;
  brief: string;
  pass: (d: AcqDesign, judgedFlagged: boolean) => boolean;
  passText: string;
  hint: (d: AcqDesign, judgedFlagged: boolean) => string;
};

/* The judgment prompt shown once the reverse-worded check is active. */
export const acqJudgmentQuestion =
  "The check flags everyone who agreed with both “friendly” and “unfriendly.” Did it fix your measurement of how friendly the barista actually was?";
export const acqJudgmentFixed = "Yes — the fakers are caught";
export const acqJudgmentFlagged = "No — it flagged them, but the friendly number didn't move";
export const acqJudgmentWrongNote =
  "Look again. The headline still reads the same number “agree the barista was friendly” — the flagged answers are still inside it. And you can't just delete the three: one of them genuinely did find the barista friendly. You now know WHO answers unreliably, not what any of them actually think.";

export const acqTasks: AcqTask[] = [
  {
    id: "detect",
    title: "Try the textbook fix — then judge it",
    brief:
      "Agreement reads high — but read the rows: some “Agree, the barista was friendly” answers come from people who felt brushed off or so-so. They tick Agree on anything. The standard move is a reverse-worded check (ask the opposite too, flag anyone who agrees with both). Add it — then decide whether it actually fixed your measurement.",
    pass: (d, judgedFlagged) => d === "reverse" && judgedFlagged,
    passText:
      "✓ Right call. The check flags the easy-agreers — useful to know — but your friendly number didn't move: their “Agree”s are still in it, two careful respondents had to untangle a double-worded item, and you still don't know what the flagged three actually think. You detected the problem; you didn't measure around it.",
    hint: (d, judgedFlagged) =>
      d !== "reverse"
        ? "Switch to the “+ reverse-worded check” design to try the textbook fix."
        : judgedFlagged
          ? "You judged it right — detection isn't measurement. On to Task 2."
          : "It's on — now make the call below: did flagging the agree-with-everything respondents actually fix what you're measuring?"
  },
  {
    id: "measure",
    title: "Now actually measure it",
    brief:
      "Detection isn't measurement. Of the three designs, pick the one that removes the thing there is to agree with — so a recorded answer has to track the person's real view, not their willingness to nod along.",
    pass: (d) => d === "item" && acqTrackTrueLevel(d) === "high",
    passText:
      "✓ Every recorded answer now matches the respondent's real view, because there's no statement to nod along to — you asked them to rate, not to agree. That's the durable fix: where you can, replace agree/disagree with item-specific response options. (A reverse-worded check is a detection patch, not a substitute.)",
    hint: (d) =>
      d === "item"
        ? "Answers track true views now."
        : d === "reverse"
          ? "The check detects, it doesn't measure. Which design removes the statement people nod along to?"
          : "Agree/disagree is what invites the nodding. Which design asks them to rate instead of agree?"
  }
];

/* ─── Exercise 10 — Full verbal labels / verbal anchors (RULER) ──────────
   Endpoint-only numeric scales make respondents invent what the middle points
   mean. Fully labeling the points can help, but the words themselves must still
   be semantically balanced. This version makes the visitor build the ruler
   from word choices rather than choosing a pre-named design. */

export type LabelScaleSlotId = "slot2" | "slot3" | "slot4";
export type LabelScaleWordId =
  | "number-2"
  | "number-3"
  | "number-4"
  | "dissatisfied"
  | "neither"
  | "satisfied"
  | "fair"
  | "good"
  | "great";

export type LabelScaleSlots = Record<LabelScaleSlotId, LabelScaleWordId>;

export type LabelScaleWord = {
  id: LabelScaleWordId;
  label: string;
  kind: "number" | "balanced" | "trap";
};

export const labelScaleSlotOrder: LabelScaleSlotId[] = ["slot2", "slot3", "slot4"];

export const labelScaleStartSlots: LabelScaleSlots = {
  slot2: "number-2",
  slot3: "number-3",
  slot4: "number-4"
};

export const labelScaleBalancedSlots: LabelScaleSlots = {
  slot2: "dissatisfied",
  slot3: "neither",
  slot4: "satisfied"
};

export const labelScaleWordBank: LabelScaleWord[] = [
  { id: "dissatisfied", label: "Dissatisfied", kind: "balanced" },
  { id: "neither", label: "Neither satisfied nor dissatisfied", kind: "balanced" },
  { id: "satisfied", label: "Satisfied", kind: "balanced" },
  { id: "fair", label: "Fair", kind: "trap" },
  { id: "good", label: "Good", kind: "trap" },
  { id: "great", label: "Great", kind: "trap" },
  { id: "number-2", label: "2", kind: "number" },
  { id: "number-3", label: "3", kind: "number" },
  { id: "number-4", label: "4", kind: "number" }
];

const labelScaleWordsById: Record<LabelScaleWordId, LabelScaleWord> =
  Object.fromEntries(labelScaleWordBank.map((w) => [w.id, w])) as Record<
    LabelScaleWordId,
    LabelScaleWord
  >;

export function labelScaleWordLabel(id: LabelScaleWordId): string {
  return labelScaleWordsById[id].label;
}

export function labelScaleLabels(slots: LabelScaleSlots): string[] {
  return [
    "Very dissatisfied",
    labelScaleWordLabel(slots.slot2),
    labelScaleWordLabel(slots.slot3),
    labelScaleWordLabel(slots.slot4),
    "Very satisfied"
  ];
}

export function labelScaleAllMiddleVerbal(slots: LabelScaleSlots): boolean {
  return labelScaleSlotOrder.every(
    (slot) => labelScaleWordsById[slots[slot]].kind !== "number"
  );
}

export function labelScaleBalanced(slots: LabelScaleSlots): boolean {
  return labelScaleSlotOrder.every(
    (slot) => slots[slot] === labelScaleBalancedSlots[slot]
  );
}

export function labelScaleNote(slots: LabelScaleSlots): string {
  if (!labelScaleAllMiddleVerbal(slots)) {
    return "The endpoints are clear, but a numbered middle still asks visitors to invent what that point means. The export gets digits, not shared meanings.";
  }
  if (!labelScaleBalanced(slots)) {
    return "Every point has words now, so the ruler looks finished. But the middle words do not form a balanced satisfaction scale, so neutral or mildly disappointed visits get pulled into better-sounding labels.";
  }
  return "Each point has a stable verbal meaning and the negative side has the same room as the positive side. The labels now act like tick marks on a ruler rather than decorations around a number.";
}

export type LabelScaleVisitor = {
  id: string;
  name: string;
  story: string;
  trueSlot: 0 | 1 | 2 | 3 | 4;
};

export const labelScaleCast: LabelScaleVisitor[] = [
  { id: "ada", name: "Ada", story: "loved the visit", trueSlot: 4 },
  { id: "ben", name: "Ben", story: "liked it", trueSlot: 3 },
  { id: "cleo", name: "Cleo", story: "felt exactly in the middle", trueSlot: 2 },
  { id: "dev", name: "Dev", story: "was mildly disappointed", trueSlot: 1 },
  { id: "eve", name: "Eve", story: "had a very bad visit", trueSlot: 0 }
];

export type LabelScaleLanding = {
  label: string;
  quality: "clean" | "invented" | "pulled";
  note: string;
};

export function labelScaleLandingFor(
  v: LabelScaleVisitor,
  slots: LabelScaleSlots
): LabelScaleLanding {
  const labels = labelScaleLabels(slots);
  if (!labelScaleAllMiddleVerbal(slots)) {
    const inventedNote =
      v.trueSlot === 0 || v.trueSlot === 4
        ? "endpoint is clear"
        : "middle meaning invented";
    return {
      label: labels[v.trueSlot],
      quality: v.trueSlot === 0 || v.trueSlot === 4 ? "clean" : "invented",
      note: inventedNote
    };
  }
  if (!labelScaleBalanced(slots)) {
    const pulled = v.trueSlot === 1 || v.trueSlot === 2 || v.trueSlot === 3;
    return {
      label: labels[v.trueSlot],
      quality: pulled ? "pulled" : "clean",
      note:
        v.trueSlot === 2
          ? `middle lands on “${labels[v.trueSlot]}”`
          : pulled
            ? "wording nudges the report"
            : "endpoint is clear"
    };
  }
  return {
    label: labels[v.trueSlot],
    quality: "clean",
    note: "label matches the true view"
  };
}

export function labelScaleInventedCount(slots: LabelScaleSlots): number {
  return labelScaleCast.filter(
    (v) => labelScaleLandingFor(v, slots).quality === "invented"
  ).length;
}

export function labelScalePulledCount(slots: LabelScaleSlots): number {
  return labelScaleCast.filter(
    (v) => labelScaleLandingFor(v, slots).quality === "pulled"
  ).length;
}

export type LabelScaleTask = {
  id: "label-points" | "balance-words";
  title: string;
  brief: string;
  pass: (slots: LabelScaleSlots) => boolean;
  passText: string;
  hint: (slots: LabelScaleSlots) => string;
};

export const labelScaleTasks: LabelScaleTask[] = [
  {
    id: "label-points",
    title: "Stop making people invent the middle",
    brief:
      "The endpoints are named, but the middle points are just numbers. Fill all three middle slots with words a visitor can interpret.",
    pass: labelScaleAllMiddleVerbal,
    passText:
      "✓ The middle is no longer a private invention. Every point now says what it means. Check 2 asks whether those words are fair.",
    hint: (slots) =>
      labelScaleAllMiddleVerbal(slots)
        ? "Every point is labeled now — on to the wording balance."
        : `${labelScaleInventedCount(slots)} visitor(s) are using a number whose meaning the survey never defined.`
  },
  {
    id: "balance-words",
    title: "Make the labels a fair ruler",
    brief:
      "A word on every point is not enough if the words lean. Build the three middle labels so a genuinely middling visit can still land in the middle.",
    pass: labelScaleBalanced,
    passText:
      "✓ The ruler is labeled and balanced. Now a middle visit can stay in the middle, mild dissatisfaction does not have to sound extreme, and positive answers still have room to be genuinely strong.",
    hint: (slots) => {
      if (!labelScaleAllMiddleVerbal(slots))
        return "First label every point; an unlabeled middle is still an invented middle.";
      if (!labelScaleBalanced(slots))
        return `${labelScalePulledCount(slots)} visitor(s) are being nudged by the middle words. A balanced satisfaction ruler needs equal room around the midpoint.`;
      return "Every point is labeled and the words are balanced.";
    }
  }
];

/* ─── Exercise 11 — Vague quantifiers / fake precision (RULER) ───────────
   "Rarely / sometimes / often" are not units. This exercise first asks the
   visitor to find the collision in the cast, then to repair the unit without
   falling into 0–100 pseudo-precision or count ranges with no reference period. */

export type QuantifierPeriod = "none" | "past30";
export type QuantifierUnit = "vague" | "score" | "ranges";

export type QuantifierFormat = {
  period: QuantifierPeriod;
  unit: QuantifierUnit;
};

export const quantifierPeriods: { id: QuantifierPeriod; label: string }[] = [
  { id: "none", label: "No time frame" },
  { id: "past30", label: "Past 30 days" }
];

export const quantifierUnits: { id: QuantifierUnit; label: string }[] = [
  { id: "vague", label: "Rarely / Sometimes / Often" },
  { id: "score", label: "0–100 frequency score" },
  { id: "ranges", label: "Count ranges" }
];

export type QuantifierVisitor = {
  id: string;
  name: string;
  story: string;
  visits30: number;
  vagueWord: "Rarely" | "Sometimes" | "Often";
  score: number;
};

export const quantifierCast: QuantifierVisitor[] = [
  { id: "ada", name: "Ada", story: "stops in almost every workday", visits30: 18, vagueWord: "Often", score: 88 },
  { id: "ben", name: "Ben", story: "comes after Saturday errands", visits30: 4, vagueWord: "Often", score: 62 },
  { id: "cleo", name: "Cleo", story: "drops by when a meeting runs long", visits30: 4, vagueWord: "Sometimes", score: 41 },
  { id: "dev", name: "Dev", story: "used to come daily, now only twice", visits30: 2, vagueWord: "Rarely", score: 25 },
  { id: "eve", name: "Eve", story: "tried it once this month", visits30: 1, vagueWord: "Sometimes", score: 18 }
];

export type QuantifierLanding = {
  label: string;
  quality: "clean" | "vague" | "fake";
  note: string;
};

export function anchoredVisitRange(n: number): string {
  if (n === 0) return "0";
  if (n <= 2) return "1–2";
  if (n <= 5) return "3–5";
  if (n <= 10) return "6–10";
  return "11 or more";
}

export function quantifierLandingFor(
  v: QuantifierVisitor,
  format: QuantifierFormat
): QuantifierLanding {
  if (format.unit === "vague") {
    return {
      label: v.vagueWord,
      quality: "vague",
      note: `${v.visits30} visits, but their personal standard says “${v.vagueWord}”`
    };
  }
  if (format.unit === "score") {
    return {
      label: `${v.score}/100`,
      quality: "fake",
      note: `${v.visits30} visits became a private precision score`
    };
  }
  if (format.period === "none") {
    return {
      label: anchoredVisitRange(v.visits30),
      quality: "vague",
      note: `${v.visits30} visits, but no time frame anchors the count`
    };
  }
  return {
    label: anchoredVisitRange(v.visits30),
    quality: "clean",
    note: `${v.visits30} visits in the past 30 days`
  };
}

export function quantifierBadCount(format: QuantifierFormat): number {
  return quantifierCast.filter(
    (v) => quantifierLandingFor(v, format).quality !== "clean"
  ).length;
}

export function quantifierQuestion(format: QuantifierFormat): string {
  if (format.unit === "score") {
    return format.period === "past30"
      ? "In the past 30 days, on a 0–100 scale, how frequent were your visits?"
      : "On a 0–100 scale, how frequent are your visits?";
  }
  if (format.unit === "ranges") {
    return format.period === "past30"
      ? "In the past 30 days, about how many times did you visit Roast & Brew?"
      : "About how many times do you visit Roast & Brew?";
  }
  return format.period === "past30"
    ? "In the past 30 days, how often did you visit Roast & Brew?"
    : "How often do you visit Roast & Brew?";
}

export function quantifierOptions(format: QuantifierFormat): string[] {
  if (format.unit === "score") {
    return ["0 (never)", "1", "2", "…", "99", "100 (constantly)"];
  }
  if (format.unit === "ranges") {
    return ["0", "1–2", "3–5", "6–10", "11 or more"];
  }
  return ["Rarely", "Sometimes", "Often"];
}

export function quantifierNote(format: QuantifierFormat): string {
  if (format.unit === "vague") {
    return format.period === "past30"
      ? "The time frame is now explicit, but the answer words still ask visitors to translate counts into private frequency standards."
      : "The answer words sound familiar, but they are not units. The same real frequency can report differently.";
  }
  if (format.unit === "score") {
    return "The vague words are gone, but the precision is fake. A person can count visits; they cannot reliably translate a habit into a private 0–100 score that another analyst can interpret.";
  }
  if (format.period === "none") {
    return "The answers are count ranges, but the count has no clock. One visitor may count this week while another counts the whole season.";
  }
  return "The reference period is explicit and every option is a countable range. The categories are coarse enough to answer, but sharp enough for the owner’s decision about occasional versus regular visitors.";
}

export function quantifierMeters(format: QuantifierFormat): ScaleMeters {
  return {
    distinctions: format.period === "past30" ? "high" : "low",
    trustworthy: format.unit === "ranges" && format.period === "past30" ? "high" : "low"
  };
}

export type QuantifierVisitorId = (typeof quantifierCast)[number]["id"];
export type QuantifierCollisionKind = "same-count" | "same-word";

export type QuantifierCollision = {
  ids: readonly [QuantifierVisitorId, QuantifierVisitorId];
  kind: QuantifierCollisionKind;
  explanation: string;
};

export const quantifierCollisions: QuantifierCollision[] = [
  {
    ids: ["ben", "cleo"],
    kind: "same-count",
    explanation:
      "Ben and Cleo both came 4 times, but one says Often and the other says Sometimes."
  },
  {
    ids: ["ada", "ben"],
    kind: "same-word",
    explanation:
      "Ada came 18 times and Ben came 4 times, but both report Often."
  },
  {
    ids: ["cleo", "eve"],
    kind: "same-word",
    explanation:
      "Cleo came 4 times and Eve came 1 time, but both report Sometimes."
  }
];

function sortedPair(ids: readonly string[]): string {
  return [...ids].sort().join("|");
}

export function quantifierCollisionFor(
  selectedIds: readonly string[]
): QuantifierCollision | null {
  if (selectedIds.length !== 2) return null;
  const key = sortedPair(selectedIds);
  return quantifierCollisions.find((c) => sortedPair(c.ids) === key) ?? null;
}

export function quantifierHasCollision(selectedIds: readonly string[]): boolean {
  return quantifierCollisionFor(selectedIds) !== null;
}

export function quantifierFormatPasses(format: QuantifierFormat): boolean {
  return format.period === "past30" && format.unit === "ranges";
}

export type QuantifierTask = {
  id: "spot-collision" | "fix-unit";
  title: string;
  brief: string;
  pass: (selectedIds: readonly string[], format: QuantifierFormat) => boolean;
  passText: string;
  hint: (selectedIds: readonly string[], format: QuantifierFormat) => string;
};

export const quantifierTasks: QuantifierTask[] = [
  {
    id: "spot-collision",
    title: "Find the collision in the answers",
    brief:
      "Tap exactly two visitors whose vague-word answers prove that the words are not shared units.",
    pass: quantifierHasCollision,
    passText:
      "✓ The cast exposes the problem: the words do not map cleanly to visit counts. Now fix the unit without pretending the ruler is more precise than it is.",
    hint: (selectedIds) => {
      if (selectedIds.length < 2) return "Select two visitors and compare their count with their word.";
      const collision = quantifierCollisionFor(selectedIds);
      return collision
        ? collision.explanation
        : "That pair is plausible to inspect, but it does not prove the word/count collision. Try matching same count to different words, or same word to different counts.";
    }
  },
  {
    id: "fix-unit",
    title: "Anchor the unit without fake precision",
    brief:
      "Set the answer format so visitors report a countable habit over a named time frame. Avoid both vague words and the 0–100 precision trap.",
    pass: (selectedIds, format) =>
      quantifierHasCollision(selectedIds) && quantifierFormatPasses(format),
    passText:
      "✓ The response options now have a time frame, a countable unit, and ranges that match the decision. You fixed the ruler without pretending it can measure decimals of habit.",
    hint: (selectedIds, format) => {
      if (!quantifierHasCollision(selectedIds)) return "First prove the vague words collide in the cast.";
      if (format.period !== "past30") return "The count still needs a clock; otherwise each visitor chooses the time frame privately.";
      if (format.unit === "vague") return "The time frame helps, but Rarely / Sometimes / Often still are not shared units.";
      if (format.unit === "score")
        return `${quantifierBadCount(format)} private scores look precise, but the analyst cannot tell what they mean in visits.`;
      return "The reference period, count ranges, and precision are defensible.";
    }
  }
];

/* ─── Exercise 12 — Option order / randomization (PUSH) ──────────────────
   Standalone order exercise. The productive failure is applying the right
   order fix to the wrong kind of list: nominal unordered lists often need
   rotation / randomization to distribute primacy, while ordinal scales carry
   meaning through their sequence and should stay ordered (though direction can
   be reversed across respondents in a controlled design). */

export type NominalOrderMode = "fixed" | "rotated";
export type OrdinalOrderMode = "randomized" | "ordered";
/* Order effects are mode-sensitive: a visual/self-administered list tends to
   favor the FIRST option (primacy); a list read aloud (phone/interviewer) can
   favor the LAST one heard (recency). Same fixed list, different end drifts. */
export type NominalReadMode = "screen" | "phone";
export type OrderListKind = "unclassified" | "unordered" | "continuum";

export type OrderRespondent = {
  id: string;
  name: string;
  trueReason: string;
  story: string;
  uncertain: boolean;
};

export const orderCast: OrderRespondent[] = [
  { id: "ada", name: "Ada", trueReason: "Social media", story: "came after seeing a friend's repost", uncertain: false },
  { id: "ben", name: "Ben", trueReason: "Walked by", story: "noticed the sign on his usual route", uncertain: false },
  { id: "cleo", name: "Cleo", trueReason: "Podcast ad", story: "remembered a host mentioning the beans", uncertain: false },
  { id: "dev", name: "Dev", trueReason: "Search", story: "looked up a nearby place between meetings", uncertain: false },
  { id: "eve", name: "Eve", trueReason: "Local event", story: "sampled cold brew at a market", uncertain: true },
  { id: "fin", name: "Fin", trueReason: "Friend or family", story: "was nudged by a cousin's text", uncertain: true }
];

/* Order matters for the demo: the two uncertain respondents' true reasons
   ("Local event", "Friend or family") must sit in the MIDDLE, so that drifting
   to the first option (primacy) OR the last (recency) is clearly wrong for
   them — never a coincidence with their truth. */
export const nominalOrderOptions = [
  "Social media",
  "Search",
  "Friend or family",
  "Podcast ad",
  "Local event",
  "Walked by"
];

export const ordinalOrderedLabels = [
  "Very dissatisfied",
  "Dissatisfied",
  "Neutral",
  "Satisfied",
  "Very satisfied"
];

export const ordinalRandomizedLabels = [
  "Neutral",
  "Very satisfied",
  "Dissatisfied",
  "Satisfied",
  "Very dissatisfied"
];

export type OrderLanding = {
  nominalPick: string;
  nominalQuality: "clean" | "primacy" | "recency";
  ordinalQuality: "clean" | "scrambled";
};

export function orderLandingFor(
  r: OrderRespondent,
  nominal: NominalOrderMode,
  ordinal: OrdinalOrderMode,
  readMode: NominalReadMode = "screen"
): OrderLanding {
  const drifts = nominal === "fixed" && r.uncertain;
  const lastOption = nominalOrderOptions[nominalOrderOptions.length - 1];
  return {
    nominalPick: drifts
      ? readMode === "screen"
        ? nominalOrderOptions[0]
        : lastOption
      : r.trueReason,
    nominalQuality: drifts
      ? readMode === "screen"
        ? "primacy"
        : "recency"
      : "clean",
    ordinalQuality: ordinal === "ordered" ? "clean" : "scrambled"
  };
}

export function orderDriftCount(nominal: NominalOrderMode): number {
  // The same uncertain respondents drift under a fixed order; only WHICH end
  // they land on changes with mode, so the count is mode-independent.
  return orderCast.filter((r) => nominal === "fixed" && r.uncertain).length;
}

export function orderMeters(
  nominal: NominalOrderMode,
  ordinal: OrdinalOrderMode
): { nominalFairness: LedgerLevel; ordinalMeaning: LedgerLevel } {
  return {
    nominalFairness: nominal === "rotated" ? "high" : "low",
    ordinalMeaning: ordinal === "ordered" ? "high" : "low"
  };
}

export type OrderTask = {
  id: "classify-lists" | "set-order";
  title: string;
  brief: string;
  pass: (
    nominal: NominalOrderMode,
    ordinal: OrdinalOrderMode,
    nominalKind: OrderListKind,
    ordinalKind: OrderListKind
  ) => boolean;
  passText: string;
  hint: (
    nominal: NominalOrderMode,
    ordinal: OrdinalOrderMode,
    nominalKind: OrderListKind,
    ordinalKind: OrderListKind
  ) => string;
};

export const orderTasks: OrderTask[] = [
  {
    id: "classify-lists",
    title: "Name what kind of list each one is",
    brief:
      "Before choosing a repair, classify the channel list and the satisfaction list. One is a set of named categories; one is a ruler.",
    pass: (_nominal, _ordinal, nominalKind, ordinalKind) =>
      nominalKind === "unordered" && ordinalKind === "continuum",
    passText:
      "✓ Correct split. The channel choices are unordered categories; the satisfaction labels are a continuum. Now set the order treatment for each.",
    hint: (_nominal, _ordinal, nominalKind, ordinalKind) => {
      if (nominalKind === "unordered" && ordinalKind === "continuum") {
        return "Now choose the order treatment that fits each kind of list.";
      }
      if (nominalKind === "unclassified" || ordinalKind === "unclassified") {
        return "Classify both lists before you choose the treatment.";
      }
      return "Check whether the list names categories you can rearrange, or scale points whose sequence carries meaning.";
    }
  },
  {
    id: "set-order",
    title: "Set the order treatment list by list",
    brief:
      "Use rotation where a fixed first slot would steer attention, and preserve order where the sequence carries meaning.",
    pass: (nominal, ordinal, nominalKind, ordinalKind) =>
      nominalKind === "unordered" &&
      ordinalKind === "continuum" &&
      nominal === "rotated" &&
      ordinal === "ordered",
    passText:
      "✓ Correct split. Rotate unordered nominal options; keep ordinal scales in a meaningful continuum. In production you may reverse an ordinal scale direction across respondents, but you do not scramble the middle.",
    hint: (nominal, ordinal, nominalKind, ordinalKind) => {
      if (nominalKind !== "unordered" || ordinalKind !== "continuum")
        return "First classify the two lists correctly.";
      if (nominal !== "rotated")
        return `${orderDriftCount(nominal)} uncertain visitor(s) are drifting to whichever channel the mode favors — the first on screen, the last when read aloud. Rotating neutralizes both.`;
      if (ordinal !== "ordered")
        return "The satisfaction scale is scrambled — randomization just broke the ruler.";
      return "The unordered list is rotated and the ordered scale is ordered.";
    }
  }
];

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
    marks: [{ branchId: "slot", concepts: ["completeness", "the “Other” tradeoff", "the right grain depends on the decision"] }],
    caveat:
      "“Other, please specify” is an escape hatch, not a full repair for a missing option — and not an analysis category. Some respondents who'd rather not write a sentence pick the closest listed option instead. And “complete” is relative: a broad bucket that loses needed detail for one question is exactly right for another — match the grain to the decision the answers serve."
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
  },
  E6: {
    marks: [{ branchId: "ruler", concepts: ["scale length / granularity", "the 5–7 rule of thumb"] }],
    caveat:
      "More scale points is not more truth: too few crushes real differences, too many collects digits respondents can't reliably supply. The 5–7 range is a default, not a law — match it to the distinction you actually need."
  },
  E7: {
    marks: [{ branchId: "slot", concepts: ["non-substantive options (DK / NA)", "neutral ≠ don't-know ≠ not-applicable"] }],
    caveat:
      "An opt-out can IMPROVE data, not weaken it: it keeps people with no view from contaminating the average. But a true Neutral, a “Don't know,” and a “Not applicable” are three different states — don't let one option quietly stand in for another."
  },
  E8: {
    marks: [{ branchId: "slot", concepts: ["false-premise items", "eligibility screening / the denominator"] }],
    caveat:
      "A clean-looking export can hide a wrong denominator: a Yes/No that assumes a prior state merges people who were never eligible with people giving a real answer. Screen eligibility before you ask the outcome — and an ordered funnel also tells you WHY people dropped out."
  },
  E9: {
    marks: [{ branchId: "push", concepts: ["acquiescence / yea-saying", "agree-disagree vs item-specific wording"] }],
    caveat:
      "Agree/disagree formats invite agreement regardless of content. A reverse-worded check detects yea-sayers but doesn't measure their real view (and adds respondent burden); where you can, replace agree/disagree with item-specific response options."
  },
  E10: {
    marks: [{ branchId: "ruler", concepts: ["full verbal labels", "semantic balance", "verbal anchors"] }],
    caveat:
      "Labeling every point can help, but the labels themselves still have to be balanced and interpretable. A fully labeled scale with a positive-tilted middle is still a tilted ruler."
  },
  E11: {
    marks: [{ branchId: "ruler", concepts: ["vague quantifiers", "reference period", "fake precision"] }],
    caveat:
      "Vague words are not stable units, but fake precision is not a cure. The professional move is to anchor the reference period and choose ranges that fit the decision."
  },
  E12: {
    marks: [{ branchId: "push", concepts: ["response-order effects", "randomization", "ordinal scale order"] }],
    caveat:
      "Randomization is useful for unordered lists, not a universal cleanup move. Ordinal scales need a meaningful continuum; mode matters because visual lists tend toward primacy while spoken lists can invite recency."
  }
};

/* ─── Per-exercise source drawers ─────────────────────────────────────────
   The credibility layer Run N (docs/research/2026-05-27-terms-and-evidence,
   §12) recommended: each exercise gets a collapsed drawer that hands the
   visitor the REAL field vocabulary for what they just practiced, an honest
   evidence-strength badge, the boundary of what NOT to overclaim, and named
   sources they could cite. This is what lets a visitor hold their own with a
   methodologist — and it keeps the lab honest about where the fixed cast is
   an illustration rather than an empirical finding. Keyed by data-id. The
   evidence strengths and safe phrasings are taken from Run N §6.1 / §12 /
   §13; sources are the verified anchors in §1.3 (no fabricated page nums). */

export type EvidenceStrength =
  | "textbook-consensus"
  | "directionally-supported"
  | "plausible-illustration"
  | "contested";

export const evidenceStrengthMeta: Record<
  EvidenceStrength,
  { label: string; gloss: string }
> = {
  "textbook-consensus": {
    label: "Textbook consensus",
    gloss: "Standard, widely-agreed survey-methodology guidance."
  },
  "directionally-supported": {
    label: "Directionally supported",
    gloss:
      "The direction is well documented; the size of the effect varies with topic, mode, and wording."
  },
  "plausible-illustration": {
    label: "Plausible illustration",
    gloss: "A defensible teaching example, not a specific empirical finding."
  },
  contested: {
    label: "Contested · use with care",
    gloss:
      "Real but debated; the lab states only the part the evidence supports."
  }
};

export type FieldTerm = { term: string; gloss: string };

export type SourceDrawer = {
  /* One sentence: the transferable thing this exercise teaches. */
  teaches: string;
  /* The real terminology a methodologist would use for it. */
  fieldTerms: FieldTerm[];
  /* Which of the lab's own coinages showed up here (links to glossary). */
  labShorthand?: string;
  evidence: EvidenceStrength;
  /* 2–4 sentences on what the evidence actually supports. */
  supports: string;
  /* The honesty line: what NOT to overclaim. */
  boundary: string;
  /* Named anchors (author / title / org). No page numbers invented. */
  sources: string[];
  /* Optional visual-vs-oral or device caveat where it matters. */
  modeCaveat?: string;
};

export const sourceDrawers: Record<string, SourceDrawer> = {
  E1: {
    teaches:
      "A scale's wording, balance, options, and order are all part of the measurement — change them and the same feelings can report differently.",
    fieldTerms: [
      { term: "leading / biased wording", gloss: "A stem that nudges the answer in one direction before options are read." },
      { term: "balanced scale", gloss: "Symmetric positive and negative categories around a center — semantically, not just numerically." },
      { term: "midpoint / neutral category", gloss: "The middle position; a midpoint is not automatically psychologically neutral." },
      { term: "response-order effects (primacy / recency)", gloss: "Answers shift with the order options appear in." }
    ],
    labShorthand: "SLOT · RULER · PUSH",
    evidence: "directionally-supported",
    supports:
      "Leading wording can shift answers toward the favored side; removing a midpoint changes the task for middle-position respondents; missing strong-negative categories push some dissatisfied people onto a weaker option, a skip, or “Other”; and option order can become part of the measurement. Primacy and recency in particular are textbook response-order effects.",
    boundary:
      "The fixed cast shows direction, not magnitude. A uniform “+1” shift for every respondent is a teaching animation, not an empirical effect size — real sizes depend on topic, mode, and wording.",
    sources: [
      "Pew Research Center, “Writing Survey Questions”",
      "Krosnick & Presser, “Question and Questionnaire Design” (2010)",
      "Schuman & Presser, “Questions and Answers in Attitude Surveys” (1981)"
    ],
    modeCaveat:
      "Order effects are mode-sensitive: visual / self-administered lists more often risk primacy; interviewer-read lists can risk recency."
  },
  E2: {
    teaches: "One answer slot cannot cleanly measure two different judgments.",
    fieldTerms: [
      { term: "double-barreled question / item", gloss: "A question that asks about more than one concept while allowing one answer." }
    ],
    labShorthand: "SLOT",
    evidence: "textbook-consensus",
    supports:
      "A double-barreled item combines more than one concept. Respondents who feel differently about the parts cannot answer unambiguously, and analysts cannot tell which concept the recorded answer reflects.",
    boundary:
      "Not every compound sentence is double-barreled. “And” is a clue, not the test — the test is whether one response has to cover two distinct constructs.",
    sources: [
      "Pew Research Center, “Writing Survey Questions”",
      "Fowler, “Improving Survey Questions”",
      "Krosnick & Presser (2010)"
    ]
  },
  E3: {
    teaches:
      "Closed categories should give every respondent exactly one home — overlaps and gaps both create avoidable classification error.",
    fieldTerms: [
      { term: "mutually exclusive categories", gloss: "No respondent has two valid homes on the list." },
      { term: "exhaustive categories", gloss: "Every expected answer has a place — bounded by respondent burden." },
      { term: "category boundaries", gloss: "Where one option ends and the next begins; overlaps make boundary cases arbitrary." }
    ],
    labShorthand: "BOUNDARY · (consulting: MECE)",
    evidence: "textbook-consensus",
    supports:
      "Closed-ended categories should not overlap and should cover the range. Overlaps like 18–25 and 25–35 make a boundary case's bucket arbitrary; gaps leave some respondents no home. Either way the data records how people resolved the ambiguity, not just what is true of them.",
    boundary:
      "Exhaustiveness is bounded by burden — you can't list everything. The goal is meaningful, non-overlapping categories for the construct, not infinite ones. “MECE” is consulting shorthand; the survey phrasing is “mutually exclusive and exhaustive.”",
    sources: [
      "Pew Research Center, “Writing Survey Questions”",
      "AAPOR, “Best Practices for Survey Research”",
      "Krosnick & Presser (2010)"
    ]
  },
  E4: {
    teaches:
      "“Other (please specify)” doesn't fully repair an incomplete list — and what counts as “complete” depends on the decision: the right category grain is the one the analysis needs.",
    fieldTerms: [
      { term: "closed / open / partially-closed question", gloss: "Fixed options, free text, or fixed options plus an “Other” write-in." },
      { term: "residual category (“Other”)", gloss: "A catch-all for answers the list didn't anticipate." },
      { term: "satisficing", gloss: "Giving an acceptable rather than optimal answer to save effort (Krosnick)." },
      { term: "category granularity / fitness for use", gloss: "How fine the categories are; the right level depends on the construct and the decision, not a universal ideal." },
      { term: "option-set coverage", gloss: "Whether expected answers have a place — distinct from “coverage error” in sampling." }
    ],
    labShorthand: "SLOT · option-set coverage",
    evidence: "directionally-supported",
    supports:
      "Satisficing is well supported, and closed lists shape what becomes visible. When a plausible option is missing, some respondents pick a close-enough listed option, skip, or use “Other.” And category granularity should match the construct: collapsing categories loses detail, but detail the decision doesn't need is just respondent burden — “complete” is relative to the question.",
    boundary:
      "Do not claim “Other” mainly captures high-effort respondents — too strong without direct evidence about other-specify behavior in this mode. The cast illustrates the mechanism, not a population rate.",
    sources: [
      "Krosnick, “Response Strategies for Coping with the Cognitive Demands of Attitude Measures” (1991)",
      "Krosnick & Presser (2010)",
      "Pew Research Center, “Writing Survey Questions”"
    ],
    modeCaveat:
      "Write-in behavior also varies by device — typing an “Other” on a phone keyboard is more burdensome than on a desktop."
  },
  E5: {
    teaches:
      "Diagnosis is the skill: name which failure class each item shows — and notice when a number is actually fine.",
    fieldTerms: [
      { term: "failure classes", gloss: "Stem wording vs option wording vs option set vs category boundaries vs scale design — distinct problems." },
      { term: "total survey error", gloss: "The umbrella for every way a survey number can mislead, of which response-option fit is one slice." }
    ],
    labShorthand: "SLOT · RULER · PUSH · BOUNDARY",
    evidence: "textbook-consensus",
    supports:
      "Response-option design is one measurement-error source. A misleading survey number can also come from coverage, sampling variability, nonresponse, recall / reference period, mode, weighting, or processing. A good reviewer separates these — and resists “fixing” an item that is already sound.",
    boundary:
      "This lab inspects response options; it does not certify a whole instrument. Pretesting and cognitive interviewing are the evidence layer that confirms a fix actually worked.",
    sources: [
      "AAPOR, “Standard Definitions” (total survey error)",
      "AAPOR, “Best Practices for Survey Research”",
      "Willis, “Cognitive Interviewing” (2005); CDC/NCHS Q-Bank"
    ]
  },
  E6: {
    teaches:
      "More scale points are not automatically more truth — too few crushes real differences, too many asks for distinctions people can't reliably supply.",
    fieldTerms: [
      { term: "scale length / number of scale points", gloss: "How many ordered categories a rating scale offers." },
      { term: "verbal anchors / fully labeled scale", gloss: "Words on the points; labeling every point beats labeling only the ends." }
    ],
    labShorthand: "RULER",
    evidence: "contested",
    supports:
      "More points can add detail, but returns often diminish and burden or ambiguity can rise. For many attitude items a 5–7 point range is a common default. The best length depends on the construct, the labels, the population, and how the data will be used.",
    boundary:
      "There is no universal “5–7” law, and reliability does not simply “reverse” past seven points — don't state either as a rule. Cite a specific study before claiming a precise threshold.",
    sources: [
      "Krosnick & Presser (2010)",
      "Revilla, Saris & Krosnick, “Choosing the Number of Categories in Agree–Disagree Scales” (2014)",
      "Saris & Gallhofer, “Design, Evaluation, and Analysis of Questionnaires” (2014)"
    ]
  },
  E7: {
    teaches:
      "Midpoint, neutral, “Don't know”, “No opinion”, and “Not applicable” are different options with different consequences — not interchangeable.",
    fieldTerms: [
      { term: "midpoint", gloss: "The middle scale position — may read as moderate, ambivalent, or neither." },
      { term: "neutral category", gloss: "“Neither side”; a truly neutral respondent needs a home." },
      { term: "non-substantive options (“Don't know” / “No opinion”)", gloss: "The person can't or won't give a substantive answer." },
      { term: "not applicable", gloss: "The question's premise doesn't apply to this respondent." }
    ],
    labShorthand: "SLOT",
    evidence: "directionally-supported",
    supports:
      "A midpoint is a scale position; a neutral category means “neither side”; “Don't know”/“No opinion” are non-substantive; “Not applicable” means the premise doesn't apply. Offering an explicit opt-out can improve measurement by separating uncertainty from real answers.",
    boundary:
      "“Don't know” is context-dependent — offered too readily it can become an easy exit and invite satisficing. None of these five substitute for one another.",
    sources: [
      "Krosnick & Presser (2010)",
      "Schuman & Presser (1981)",
      "Pew Research Center, “Writing Survey Questions”"
    ]
  },
  E8: {
    teaches:
      "A question that assumes a fact the respondent doesn't share has no honest answer — they need an escape before the substantive options.",
    fieldTerms: [
      { term: "false-premise question", gloss: "Presupposes something untrue for the respondent (a use, an experience, an opinion)." },
      { term: "screening / filter question", gloss: "A prior item that routes only eligible respondents into the question." },
      { term: "not applicable / “haven't used it”", gloss: "The escape that separates the premise from the measurement." }
    ],
    labShorthand: "SLOT",
    evidence: "textbook-consensus",
    supports:
      "If a question presupposes something untrue for a respondent, forcing them into substantive options manufactures answers. A screening / filter step or a “not applicable” path keeps ineligible people out of the denominator and tells you why people dropped out.",
    boundary:
      "“Not applicable” and “Don't know” are not the same, and a screen can hide routing problems if overused — design the escape on purpose, and pretest the funnel.",
    sources: [
      "Pew Research Center, “Writing Survey Questions”",
      "CDC/NCHS Q-Bank",
      "Krosnick & Presser (2010)"
    ]
  },
  E9: {
    teaches:
      "Agree/disagree formats invite agreement regardless of content; item-specific wording removes the thing there is to agree with.",
    fieldTerms: [
      { term: "acquiescence (yea-saying)", gloss: "Agreeing regardless of content. “Yea-saying” is informal; acquiescence is the formal term." },
      { term: "reverse-worded item", gloss: "An item worded in the opposite direction. Distinct from reverse-CODING — flipping its score during scale construction." },
      { term: "item-specific wording", gloss: "Replacing agree/disagree with its own answer scale (“How friendly…?”), so there's nothing to merely agree with." },
      { term: "response style / method effect", gloss: "Systematic ways people use a scale regardless of content; reverse-worded items can add their own." }
    ],
    labShorthand: "PUSH",
    evidence: "directionally-supported",
    supports:
      "Agree/disagree batteries are well known to invite acquiescence, and replacing them with item-specific scales is standard advice. A reverse-worded check can detect easy agreers — they agree with a statement and its opposite.",
    boundary:
      "Whether reverse-worded items catch more than they cost is contested — they can confuse careful respondents and add method effects. Use them deliberately and pretest; they are not free attention checks.",
    sources: [
      "Krosnick & Presser (2010)",
      "Schuman & Presser (1981)",
      "van Sonderen, Sanderman & Coyne, “Ineffectiveness of Reverse Wording” (2013)"
    ]
  },
  E10: {
    teaches:
      "Scale labels are part of the measurement instrument: endpoint-only numbers make respondents invent the middle, and built-out middle words still have to form a balanced ruler.",
    fieldTerms: [
      { term: "verbal labels / verbal anchors", gloss: "Words attached to response categories or scale points so respondents know what each point means." },
      { term: "fully labeled scale", gloss: "A response scale where every point has a verbal label, not only the endpoints." },
      { term: "semantic balance", gloss: "The positive and negative labels carry comparable meaning around a true middle." }
    ],
    labShorthand: "RULER",
    evidence: "directionally-supported",
    supports:
      "Survey-methodology guidance treats labels and anchors as part of scale design. Fully labeling points can reduce private interpretation of the middle, and balanced verbal labels help the scale measure both sides of the construct. The word-bank mechanic is an authored teaching contrast, not validated replacement wording.",
    boundary:
      "Do not claim every scale must always label every point. The best label strategy depends on mode, construct, population, screen space, and whether the words remain clear rather than overloaded.",
    sources: [
      "Krosnick & Presser (2010)",
      "Saris & Gallhofer (2014)",
      "Pew Research Center, “Writing Survey Questions”"
    ],
    modeCaveat:
      "Visual web surveys make all labels available at once; phone/interviewer modes add memory burden when every point is read aloud."
  },
  E11: {
    teaches:
      "Vague frequency words collide with actual counts, and shiny numeric precision can still be a weak ruler; anchored ranges tied to a reference period are easier to defend.",
    fieldTerms: [
      { term: "vague quantifiers", gloss: "Frequency or amount words such as often, sometimes, rarely, usually, many, or few." },
      { term: "reference period", gloss: "The time span the respondent is asked to report about." },
      { term: "response-category anchoring", gloss: "Making category meanings explicit enough that respondents use them similarly." },
      { term: "false precision / pseudo-precision", gloss: "A response format that looks more exact than respondents can reliably supply." }
    ],
    labShorthand: "RULER",
    evidence: "directionally-supported",
    supports:
      "Vague quantifiers are a standard survey-design risk because respondents map them to different numeric realities. Reference periods and countable ranges make the answer task clearer. The cast collision and 0–100 frequency score are teaching contrasts: they show why a shared unit matters without claiming a measured population effect.",
    boundary:
      "Anchored ranges are still design choices, not natural law. They must fit the analysis need, the expected distribution, and what respondents can reasonably recall. A 0–100 scale isn't automatically wrong either — it tips into false precision only when respondents don't share the unit, reference period, or reporting rule.",
    sources: [
      "Tourangeau, Rips & Rasinski, “The Psychology of Survey Response” (2000)",
      "Fowler, “Improving Survey Questions”",
      "Pew Research Center, “Writing Survey Questions”"
    ]
  },
  E12: {
    teaches:
      "Order effects are real, but the repair depends on first classifying the list: rotate unordered options; preserve the meaningful order of ordinal scales.",
    fieldTerms: [
      { term: "response-order effects", gloss: "Differences in answers caused by the order in which response options are presented." },
      { term: "primacy effect", gloss: "Earlier options receive extra selection in some visual/self-administered contexts." },
      { term: "recency effect", gloss: "Later-heard options receive extra selection in some interviewer-administered contexts." },
      { term: "randomization / rotation", gloss: "Changing option order across respondents to distribute order advantage." },
      { term: "ordinal scale", gloss: "A scale whose category sequence carries substantive meaning." }
    ],
    labShorthand: "PUSH",
    evidence: "directionally-supported",
    supports:
      "Order can influence responses, and many unordered closed-ended lists are randomized or rotated to avoid a single option always appearing first or last. Ordinal scales are different: the order communicates the continuum, so they should remain meaningful even if direction is experimentally reversed or split-balanced. The exercise makes that classification step explicit before the repair.",
    boundary:
      "Randomization does not eliminate every context effect, and it is not always appropriate. Trend questions, ordinal scales, and mode-specific designs need deliberate order decisions.",
    sources: [
      "Pew Research Center, “Writing Survey Questions”",
      "Krosnick & Presser (2010)",
      "Schuman & Presser (1981)"
    ],
    modeCaveat:
      "Pew summarizes the common mode pattern: telephone/interviewer lists can show recency, while self-administered visual lists can show primacy."
  }
};

/* ─── Closing “where this comes from” / further reading ───────────────────
   A rationed set (Run N §8 warns against bibliography confetti): the core
   texts the lab leans on + the free public resources a visitor can open
   today. Real, verifiable works; author/title/year only. */
export type ReadingItem = {
  name: string;
  what: string;
  kind: "core-text" | "public-resource";
};

export const furtherReading: ReadingItem[] = [
  {
    kind: "core-text",
    name: "Krosnick & Presser, “Question and Questionnaire Design” (2010)",
    what: "The reference chapter behind most of this lab: scales, midpoints, acquiescence, satisficing, order effects."
  },
  {
    kind: "core-text",
    name: "Tourangeau, Rips & Rasinski, “The Psychology of Survey Response” (2000)",
    what: "The four-step response process (comprehend → retrieve → judge → respond) the closing lens uses."
  },
  {
    kind: "core-text",
    name: "Schuman & Presser, “Questions and Answers in Attitude Surveys” (1981)",
    what: "Classic experiments on wording, response order, and the middle option."
  },
  {
    kind: "core-text",
    name: "Saris & Gallhofer, “Design, Evaluation, and Analysis of Questionnaires” (2014)",
    what: "Scale length, balance, and measurement quality, with evidence."
  },
  {
    kind: "public-resource",
    name: "Pew Research Center — “Writing Survey Questions”",
    what: "Free, readable walkthrough of wording, order, open vs. closed, and balance."
  },
  {
    kind: "public-resource",
    name: "Pew Research Center — “When Online Survey Respondents Only ‘Select Some That Apply’”",
    what: "Why a check-all list and a forced-choice (yes/no per item) battery aren't interchangeable — select-all can under-collect endorsements."
  },
  {
    kind: "public-resource",
    name: "AAPOR — “Best Practices” & “Standard Definitions”",
    what: "Survey rigor, and the total-survey-error vocabulary (coverage, nonresponse, measurement)."
  },
  {
    kind: "public-resource",
    name: "CDC/NCHS Q-Bank",
    what: "Searchable bank of real evaluated questions and cognitive-interview findings."
  },
  {
    kind: "public-resource",
    name: "U.S. Census Bureau — DICE design guidelines: “…Web Surveys and Censuses” + “…CAPI and CATI Instruments” (v. April 1, 2026)",
    what: "Current public Census questionnaire-design guidance for web, phone, and in-person instruments — question components and mode-specific presentation. (DICE = Data Ingest and Collection for the Enterprise.)"
  },
  {
    kind: "public-resource",
    name: "Willis, “Cognitive Interviewing: A Tool for Improving Questionnaire Design” (2005)",
    what: "How professionals pretest a question before trusting it."
  }
];

/* ─── Terms of art vs the lab's own shorthand ────────────────────────────
   The author's concern: a visitor shouldn't leave thinking the lab's
   coinages (SLOT/RULER/PUSH, "the flip") are established survey vocabulary,
   or misuse a borrowed term (MECE) with a real methodologist. This glossary
   is rendered as an expandable panel in the closing map and as the source
   of the small "term" markers. Classifications are conservative and were
   verified against Run N (docs/research/2026-05-27-terms-and-evidence,
   §4.2 term-audit table). */
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
    term: "Verbal labels · verbal anchors · fully labeled scale",
    status: "established",
    note: "Standard scale-design language: words attached to the points of a scale, with “fully labeled” meaning every point has a verbal label rather than only the endpoints."
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
  /* The plain-language dual label shown beside the house shorthand, e.g.
     "SLOT · every real answer has a true home" — so the memorable shorthand
     never reads as a canonical field term (output-04 closing-map note). */
  gloss: string;
  memorySentence: string;
  nodes: KnowledgeNode[];
};

export const responseOptionKnowledgeMap: KnowledgeBranch[] = [
  {
    id: "slot",
    label: "Slot",
    question: "Can every real answer land somewhere true?",
    gloss: "every real answer has a true home",
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
          "When their channel is missing, do some respondents pick the closest wrong option instead of writing into “Other”?",
        remember:
          "“Other, please specify” is an escape hatch, not a full repair — a write-in is extra effort some decline. Pilot, then promote common write-ins to their own options.",
        exerciseIds: ["E4"]
      },
      {
        id: "slot.dkNaPna",
        label: "DK / NA / not a neutral",
        status: "practiced",
        ask:
          "Are uncertain or ineligible respondents being forced into substantive answers — and is a true neutral being confused with “don't know” or “not applicable”?",
        remember:
          "An opt-out can protect measurement rather than weaken it — and a true Neutral, a “Don't know,” and a “Not applicable” are three different states, not one.",
        exerciseIds: ["E7"],
        sourceCue: "Krosnick & Presser on DK / no-opinion."
      },
      {
        id: "slot.falsePremise",
        label: "False premise / eligibility",
        status: "practiced",
        ask:
          "Does the question assume a prior state, so people with no basis still answer and merge into one bucket?",
        remember:
          "A Yes/No that presumes exposure pools the never-eligible with the real answers — a clean export over a wrong denominator. Screen eligibility first.",
        exerciseIds: ["E8"]
      }
    ]
  },
  {
    id: "ruler",
    label: "Ruler",
    question: "Does the scale measure the intended distinction?",
    gloss: "the scale measures the intended distinction",
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
        status: "practiced",
        ask:
          "Does the number of points match what respondents can actually distinguish?",
        remember:
          "More points do not automatically mean more truth — too few crushes real differences; past a handful of well-labeled points, returns tend to diminish and you risk asking for distinctions finer than people can supply. The best length depends on the construct, the labels, and the use.",
        exerciseIds: ["E6"],
        sourceCue: "Krosnick & Presser; Saris & Gallhofer."
      },
      {
        id: "ruler.labels",
        label: "Full verbal labels",
        status: "practiced",
        ask:
          "Can respondents interpret each point, or do you make them invent the middle?",
        remember:
          "Endpoint-only numeric scales push respondents to make up the middle — labeling every point can help, but only if the words themselves stay balanced.",
        exerciseIds: ["E10"],
        sourceCue: "Krosnick & Presser; Saris & Gallhofer."
      },
      {
        id: "ruler.fakePrecision",
        label: "Vague units / fake precision",
        status: "practiced",
        ask:
          "Do the options imply more precision than respondents can supply?",
        remember:
          "A 0–100 frequency score can look scientific while collecting guesses dressed up in decimals — and “often / sometimes / rarely” are not stable units without a reference period and anchors.",
        exerciseIds: ["E11"],
        sourceCue: "Tourangeau; Fowler."
      },
      {
        id: "ruler.numericValues",
        label: "Numeric scale values",
        status: "didactic",
        ask:
          "Could the numbers printed on the points (0–10 vs −5 to +5) change what the same word labels mean?",
        remember:
          "The numbers are part of the instrument, not neutral tags: respondents read meaning into them, so a 0–10 and a −5-to-+5 version of the same labeled scale can pull different answers — a negative number reads as failure, not merely “low.” This lab names the effect but does not drill it.",
        exerciseIds: ["none"],
        sourceCue: "Schwarz et al. (1991), numeric values of rating scales."
      }
    ]
  },
  {
    id: "push",
    label: "Push",
    question: "Does the option set steer the respondent?",
    gloss: "the format doesn’t steer the answer",
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
          "Order effects are mode-sensitive — visual self-administered modes often invite primacy; interviewer-administered modes can invite recency. First classify the list: rotate unordered categories; keep ordinal scales meaningful.",
        exerciseIds: ["E1", "E12"],
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
        status: "practiced",
        ask:
          "Is the format inviting agreement instead of measuring the construct?",
        remember:
          "Agree / disagree formats pull yes-saying respondents toward agreement regardless of content. Reverse-worded items detect but don't measure them; item-specific wording removes the pull.",
        exerciseIds: ["E9"],
        sourceCue: "Krosnick & Presser."
      },
      {
        id: "push.satisficing",
        label: "Satisficing",
        status: "planned",
        ask:
          "Are respondents likely to conserve effort rather than fully retrieve and judge?",
        remember:
          "Some answers are adequate-enough responses to the form, not full reports of the person. Long lists + grids + late items invite it.",
        exerciseIds: ["future"],
        sourceCue: "Krosnick's satisficing taxonomy."
      },
      {
        id: "push.gridFatigue",
        label: "Long grids / straight-lining",
        status: "planned",
        ask:
          "Is a repeated matrix inviting respondents to stop differentiating among items?",
        remember:
          "Long batteries can turn thoughtful judgment into patterning — especially when every row uses the same response options and the form feels repetitive.",
        exerciseIds: ["future"],
        sourceCue: "Krosnick on satisficing; DICE/Census mode guidance."
      },
      {
        id: "push.selectAll",
        label: "Select-all vs. forced-choice",
        status: "planned",
        ask:
          "Can respondents stop after a few boxes instead of judging every item?",
        remember:
          "A check-all list and a yes/no-per-item battery aren't equivalent — select-all can under-collect because people stop once they've picked enough; forced-choice makes them weigh each item, at the cost of more burden.",
        exerciseIds: ["future"],
        sourceCue: "Pew on select-all-that-apply vs. forced-choice."
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
    gloss: "what this inspection doesn’t cover",
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
        id: "boundary.standards",
        label: "Standards-governed categories",
        status: "outOfScope",
        ask:
          "Are the categories yours to design, or fixed by an external reporting standard?",
        remember:
          "Some answer choices aren't a local craft decision — demographic and identity categories used for official or comparable reporting are constrained by external standards, required disaggregation, and cross-survey comparability. That's a governance question this craft-level lab names but does not work through.",
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
      "I wouldn't assume an 11-point scale is automatically more precise — for many attitude items 5–7 points is a common starting range, and gains beyond that are often small or context-dependent. The best length still depends on the construct, the labels, the population, the mode, and how the data will be used.",
    sourceCue: "Krosnick & Presser on scale points; Saris & Gallhofer."
  },
  {
    id: "label-every-point",
    text:
      "I'd label every response point when the mode and screen space allow — endpoint-only numeric scales ask respondents to invent the middle. The catch: full labels only help if the words stay balanced and legible.",
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
      "A “Don't know” or “No opinion” option can IMPROVE measurement when the alternative is forcing uncertain respondents to guess — though offered too readily it can also invite satisficing, so the call depends on whether the question is one people can reasonably lack a view on.",
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
      "Reverse-worded items aren't magic attention checks — they can confuse careful respondents, and the evidence on whether they catch more than they cost is mixed, so use them deliberately and pretest.",
    sourceCue: "Survey-methodology critiques of reverse-worded items."
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
