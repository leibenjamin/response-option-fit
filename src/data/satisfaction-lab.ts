/* Engine for the scale-builder exercise on the #lab page — Exercise 1 of the
   SQLBolt-style multi-exercise practice lab (see project_survey_lab_redirect
   in memory; see docs/design-passes/2026-05-25-strategic-redirect-survey-labs.md).

   AUDIENCE + SCENARIO RULE — the LAB ITSELF must be clever/satisfying/non-
   facile for an analyst-level user (the lab's variety + depth do that
   job across multiple exercises). The scenario INSIDE this single exercise
   is a vehicle for the lesson, intentionally concrete and non-loaded: a
   coffee-shop visit feedback survey. NOT "Brightwater" (the original
   too-generic placeholder) and NOT "you're the manager designing your own
   360" (the second wrong direction). See
   [[feedback-lab-scenarios-for-analyst-user]] in memory for the two
   corrections that landed here.

   The cast (Ada/Ben/Cleo/Dev/Eve) is a fixed set of named fictional
   visitors to a coffee shop with stated true feelings — NOT a distribution.
   Every "where does X land" below is a single deterministic, defensible
   judgment, and the only counts shown are counts over these 5 named people,
   never a population prevalence. */

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

export type Respondent = {
  id: string;
  name: string;
  /* The respondent's true feeling about the visit, in their own words. */
  feeling: string;
  /* Their true feeling on the same -2..+2 axis. This never changes — only the
     options and the question wording do. */
  truth: number;
};

export const cast: Respondent[] = [
  { id: "ada", name: "Ada", feeling: "loved it — perfect latte, already told three friends", truth: 2 },
  { id: "ben", name: "Ben", feeling: "good coffee, friendly staff — a little slow today", truth: 1 },
  { id: "cleo", name: "Cleo", feeling: "drink was fine; the music was too loud", truth: 0 },
  { id: "dev", name: "Dev", feeling: "wrong order; manager fixed it but it was awkward", truth: -1 },
  { id: "eve", name: "Eve", feeling: "espresso machine broke mid-order; she left without coffee", truth: -2 }
];

export type Stem = "plain" | "leading";
export const stemText: Record<Stem, string> = {
  plain: "How was your visit to Roast & Brew?",
  leading: "How great was your visit to Roast & Brew?"
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
export function landingFor(respondent: Respondent, design: Design): ScalePoint | null {
  const points = orderedPoints(design);
  if (points.length === 0) return null;
  const nudge = design.stem === "leading" ? 1 : 0;
  const eff = Math.max(-2, Math.min(2, respondent.truth + nudge));
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

/* The scale the exercise opens on — a bare two-point forced choice with a
   leading stem. It over-reads as satisfied (4 of 5) before the visitor
   touches anything, so the lie is visible on arrival and Task 1 is about
   BUILDING a real scale rather than trimming one. (Trace: leading stem
   nudges everyone +1; the only options are Satisfied/Dissatisfied, so Dev
   at −1 ties and primacy sends him to Satisfied, and only furious Eve
   stays Dissatisfied.) */
export const shippedDesign: Design = {
  selected: ["sat", "dis"],
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
export function worstMisfit(design: Design): Respondent | null {
  let worst: Respondent | null = null;
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

/* The biasing moves present in a design — used for the hostile-task "flip" so
   the reveal names exactly what the visitor just did. */
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

/* The three sub-tasks within the scale-builder exercise (Exercise 1 on the
   #lab page). Tasks are checked live and complete in order (sticky): an
   honest fix, a midpoint edge case, then the hostile goal whose completion
   triggers the "flip" reveal. */
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
      "Redesign the scale so every visitor — even Eve, who left without coffee — has an option that truly fits, and the question doesn't lead.",
    pass: everyoneFits,
    passText:
      "Balanced and complete, with a plain stem. Notice the “satisfied” count just fell to the truth — honest design looks worse for the shop, and that is the point.",
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
    title: "Round the fence-sitter up",
    brief:
      "Cleo is genuinely on the fence — the music was too loud, the drink was fine. Make her read as “satisfied” without changing how she feels.",
    pass: (design) =>
      isSatisfied(landingFor(cast.find((c) => c.id === "cleo")!, design)),
    passText:
      "Cleo never said she was satisfied. You took away her honest middle (or tilted the question), and a forced choice rounded her up. That is how dropping a true neutral quietly inflates the positive side.",
    hint: () =>
      "Right now Cleo can land on a true middle option. What if the scale didn't offer one — or the stem nudged everyone up?"
  },
  {
    id: "order",
    title: "Flip her back with nothing but order",
    brief:
      "Leave Cleo with no true middle, then change ONE thing — switch the option order to negative-first — and push her over to the dissatisfied side.",
    pass: (design) => {
      const p = landingFor(cast.find((c) => c.id === "cleo")!, design);
      return p != null && p.value < 0;
    },
    passText:
      "Same coffee, same feeling — you moved her from “satisfied” to “dissatisfied” with nothing but the order of the list. When two options are equally close, people drift to the one they read first: the primacy effect. Read aloud on the phone it reverses — the last option heard wins (recency). Order is part of the response design, not a cosmetic detail.",
    hint: (design) => {
      const cleo = cast.find((c) => c.id === "cleo")!;
      if (design.selected.includes("neutral")) {
        return "While a true Neutral is offered, Cleo just sits on it and order can't move her. Remove the neutral first, then flip to negative-first.";
      }
      if (design.order === "positive-first") {
        return "With no middle, Cleo is equidistant between the two nearest options. Flip the order to negative-first and watch which one she lands on.";
      }
      const p = landingFor(cleo, design);
      return p != null && p.value < 0
        ? "There she goes."
        : "She needs to be equidistant between a positive and a negative option, with negative-first order. Trim back toward a balanced scale with no neutral.";
    }
  },
  {
    id: "hostile",
    title: "Now play the shop",
    brief:
      "You want the report to say customers are happy. Get at least 4 of your 5 to read as “satisfied” — without removing anyone or changing how they feel.",
    pass: (design) => satisfiedCount(design) >= 4,
    passText: "",
    hint: (design) =>
      `You're at ${satisfiedCount(design)} of 5. You can't change how they feel — only the options and how you ask. What makes complaining hard?`
  }
];
