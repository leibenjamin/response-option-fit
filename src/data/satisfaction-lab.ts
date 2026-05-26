/* Data + pure deterministic engine for the prototype "satisfaction scale" lab —
   the first survey-question goal-lab (see docs/design-passes/2026-05-25-strategic-
   redirect-survey-labs.md). AUTHORED teaching scenario (fictional product +
   fictional cast); no source needed. The cast is a fixed set of named respondents
   with stated true feelings — NOT a distribution. Every "where does X land"
   below is a single deterministic, defensible judgment, and the only counts shown
   are counts over these 5 named people, never a population prevalence. */

export type ScalePoint = {
  id: string;
  label: string;
  /* The feeling this option represents, on a -2 (furious) .. +2 (delighted)
     axis. Used only to decide which option is closest to a respondent's feeling. */
  value: number;
  tone: "pos" | "mid" | "neg";
};

/* The full, balanced option bank, listed most-positive to most-negative. */
export const scaleBank: ScalePoint[] = [
  { id: "vsat", label: "Very satisfied", value: 2, tone: "pos" },
  { id: "sat", label: "Satisfied", value: 1, tone: "pos" },
  { id: "ssat", label: "Somewhat satisfied", value: 0.5, tone: "pos" },
  { id: "neutral", label: "Neutral", value: 0, tone: "mid" },
  { id: "sdis", label: "Somewhat dissatisfied", value: -0.5, tone: "neg" },
  { id: "dis", label: "Dissatisfied", value: -1, tone: "neg" },
  { id: "vdis", label: "Very dissatisfied", value: -2, tone: "neg" }
];

export const ALL_POINT_IDS = scaleBank.map((p) => p.id);

export type Customer = {
  id: string;
  name: string;
  /* The respondent's true feeling, in their own words. */
  feeling: string;
  /* Their true feeling on the same -2..+2 axis. This never changes — only the
     options and the question wording do. */
  truth: number;
};

export const cast: Customer[] = [
  { id: "ada", name: "Ada", feeling: "loved it — already told three friends", truth: 2 },
  { id: "ben", name: "Ben", feeling: "happy overall, a couple of small gripes", truth: 1 },
  { id: "cleo", name: "Cleo", feeling: "honestly mixed — some good, some bad", truth: 0 },
  { id: "dev", name: "Dev", feeling: "let down; it underdelivered", truth: -1 },
  { id: "eve", name: "Eve", feeling: "furious — it failed when she needed it most", truth: -2 }
];

export type Stem = "plain" | "leading";
export const stemText: Record<Stem, string> = {
  plain: "How was your experience with Brightwater?",
  leading: "How great was your experience with Brightwater?"
};

export type Order = "positive-first" | "negative-first";

export type Design = {
  selected: string[];
  stem: Stem;
  order: Order;
};

export const defaultDesign: Design = {
  selected: [...ALL_POINT_IDS],
  stem: "plain",
  order: "positive-first"
};

/* The selected options in the order the respondent reads them. */
export function orderedPoints(design: Design): ScalePoint[] {
  const chosen = scaleBank.filter((p) => design.selected.includes(p.id));
  return design.order === "positive-first" ? chosen : [...chosen].reverse();
}

/* Where one respondent lands: the offered option whose value is closest to their
   feeling — nudged one notch toward positive if the stem is leading ("how
   great…"). Ties break toward whichever option they read FIRST (primacy), so the
   order toggle matters. Deterministic; returns null only if no options exist. */
export function landingFor(customer: Customer, design: Design): ScalePoint | null {
  const points = orderedPoints(design);
  if (points.length === 0) return null;
  const nudge = design.stem === "leading" ? 1 : 0;
  const eff = Math.max(-2, Math.min(2, customer.truth + nudge));
  let best = points[0];
  let bestDist = Math.abs(points[0].value - eff);
  for (const p of points) {
    const d = Math.abs(p.value - eff);
    if (d < bestDist - 1e-9) {
      best = p;
      bestDist = d;
    }
  }
  return best;
}

/* The mildly-biased scale the lab opens on — a plausibly "shipped" version that
   already over-reads as satisfied, so the visitor sees the lie before fixing it.
   (Leading stem + no strong-negative options.) */
export const shippedDesign: Design = {
  selected: ["vsat", "sat", "ssat", "neutral", "sdis"],
  stem: "leading",
  order: "positive-first"
};

export const SATISFIED_THRESHOLD = 0.5;

/* How many of the fixed cast TRULY feel satisfied (truth >= threshold) — the
   honest number the autopsy is compared against. (Ada + Ben = 2.) */
export const trueSatisfiedCount = cast.filter(
  (c) => c.truth >= SATISFIED_THRESHOLD
).length;

export function isSatisfied(point: ScalePoint | null): boolean {
  return point != null && point.value >= SATISFIED_THRESHOLD;
}

export function satisfiedCount(design: Design): number {
  return cast.filter((c) => isSatisfied(landingFor(c, design))).length;
}

/* True iff every respondent has an option that actually fits their feeling
   (within half a notch) and the question is not leading — i.e. an honest scale. */
export function everyoneFits(design: Design): boolean {
  if (design.stem !== "plain") return false;
  return cast.every((c) => {
    const p = landingFor(c, design);
    return p != null && Math.abs(p.value - c.truth) <= 0.5 + 1e-9;
  });
}

/* The respondent with no fitting option, for honest-task feedback (or null). */
export function worstMisfit(design: Design): Customer | null {
  let worst: Customer | null = null;
  let worstGap = 0.5 + 1e-9;
  for (const c of cast) {
    const p = landingFor(c, design);
    const gap = p == null ? Infinity : Math.abs(p.value - c.truth);
    if (gap > worstGap) {
      worstGap = gap;
      worst = c;
    }
  }
  return worst;
}

/* The biasing moves present in a design — used for the hostile-task "flip" so the
   reveal names exactly what the visitor just did. */
export type BiasTell = { id: string; present: boolean; tell: string };
export function biasTells(design: Design): BiasTell[] {
  const has = (id: string) => design.selected.includes(id);
  const noStrongNeg = !has("vdis") && !has("dis");
  const noNeutral = !has("neutral");
  const negSide = ["sdis", "dis", "vdis"].filter(has).length;
  const posSide = ["ssat", "sat", "vsat"].filter(has).length;
  return [
    {
      id: "leading",
      present: design.stem === "leading",
      tell: "A leading stem (“how great…?”) nudges every answer up before a single option is read."
    },
    {
      id: "no-strong-neg",
      present: noStrongNeg,
      tell: "No strong-negative option — a furious customer has nowhere worse to go than a soft complaint."
    },
    {
      id: "unbalanced",
      present: posSide > negSide,
      tell: `An unbalanced scale: ${posSide} positive options to ${negSide} negative — the visual center sits in the positive zone.`
    },
    {
      id: "no-neutral",
      present: noNeutral,
      tell: "No neutral option — genuinely mixed people get rounded onto one side."
    },
    {
      id: "primacy",
      present: design.order === "positive-first",
      tell: "Positive options listed first — ties and quick answers drift toward the top."
    }
  ];
}

/* The SQLBolt-style task ladder. Tasks are checked live and complete in order
   (sticky): an honest fix, a midpoint edge case, then the hostile goal whose
   completion triggers the "flip" reveal. Each could NOT be replaced by a
   sentence of prose — the visitor has to actually build the scale that does it. */
export type LabTask = {
  id: string;
  title: string;
  brief: string;
  pass: (design: Design) => boolean;
  passText: string;
  hint: (design: Design) => string;
};

export const tasks: LabTask[] = [
  {
    id: "honest",
    title: "Make it honest",
    brief:
      "Redesign the scale so every customer — even furious Eve — has an option that truly fits, and the question doesn't lead.",
    pass: everyoneFits,
    passText:
      "Balanced and complete, with a plain stem. Notice the “read as satisfied” count just fell to the truth — honest design looks worse for the vendor, and that is the point.",
    hint: (design) => {
      if (design.stem === "leading") {
        return "The stem is leading (“how great…?”) — it tilts every answer upward before a single option is read. Try the plain wording.";
      }
      const m = worstMisfit(design);
      return m
        ? `${m.name} (${m.feeling}) has no option that fits — the scale needs more room on that side.`
        : "Almost — give every feeling a fitting option and use the plain stem.";
    }
  },
  {
    id: "cleo",
    title: "Round Cleo up",
    brief:
      "Cleo is genuinely on the fence. Make her read as “satisfied” — without changing how she feels.",
    pass: (design) =>
      isSatisfied(landingFor(cast.find((c) => c.id === "cleo")!, design)),
    passText:
      "Cleo never said she was satisfied. You took away her honest middle (or tilted the question), and a forced choice rounded her up. That is how dropping “Neutral” quietly inflates the positive side.",
    hint: () =>
      "Right now Cleo can land on a true middle option. What if the scale didn't offer one — or the stem nudged everyone up?"
  },
  {
    id: "hostile",
    title: "Now play the vendor",
    brief:
      "You want the report to say customers are happy. Get at least 4 of your 5 to read as “satisfied” — without removing anyone or changing how they feel.",
    pass: (design) => satisfiedCount(design) >= 4,
    passText: "",
    hint: (design) =>
      `You're at ${satisfiedCount(design)} of 5. You can't change how they feel — only the options and how you ask. What makes complaining hard?`
  }
];

