import type { AnswerFrameLine, FailurePattern } from "../types/workbench";
import { workbenchSpecimens } from "./workbench-specimens";

/* The end-of-walk capstone: a cold read. The visitor has (maybe) learned the
   six patterns; now four real instruments are shown with no pattern label and
   no engine scaffolding, and the visitor taps where they think the response
   options break. The reveal shows what the cognitive-testing report actually
   caught.

   Everything renders from the verified specimen data (prompt + responseOptions)
   so the cold read never drifts from the sourced wording. A capstone case adds
   only three things: which option the testers flagged (`culpritOptionId`), one
   terse plain-language statement of the finding (`caught`), and a short framing
   line. The capstone uses four high-contrast mechanics and does not need to
   repeat every active specimen.

   `culpritOptionId` values:
     - an option id present in the specimen's responseOptions, or
     - "missing" when the real finding is an absent option (none today, but the
       "Something's missing" affordance is offered as an honest distractor). */

export type CapstoneCulprit = string | "missing";

export type CapstoneCase = {
  id: string;
  specimenId: string;
  /* One-line framing shown above the rendered instrument. Sets the scene a
     reviewer would have, without naming the pattern. */
  scene: string;
  culpritOptionId: CapstoneCulprit;
  /* What the cognitive-testing report actually found, in plain language. Kept
     terse and faithful to the specimen's title / method note / source. */
  caught: string;
};

export type CapstoneResolved = CapstoneCase & {
  number: string;
  prompt: string;
  eyebrow: string;
  options: AnswerFrameLine[];
  pattern: FailurePattern;
  patternLabel: string;
  walkHref: string;
  sourceLabel: string;
};

const CAPSTONE_CASES: CapstoneCase[] = [
  {
    id: "cap-ride-hailing",
    specimenId: "ride-hailing",
    scene:
      "A national survey asks for the one main way someone got to work last week.",
    culpritOptionId: "taxi-ride-hailing",
    caught:
      "Testers read these same words as an app ride, a hired taxi, a shared carpool, even a bike-share. One option, several different commutes — and the recorded data can't tell them apart."
  },
  {
    id: "cap-ev-type",
    specimenId: "electric-vehicle-type",
    scene:
      "After a question about plug-in electric vehicles, a follow-up tries to catch the rest.",
    culpritOptionId: "another-ev",
    caught:
      "“Another type of electric vehicle” had to hold hybrids, mild hybrids, and plug-ins at once. Everyday labels and technical classes don't line up, so identical cars landed in different boxes. The later version named plug-in and hybrid directly."
  },
  {
    id: "cap-sump-pump",
    specimenId: "sump-pump",
    scene:
      "A post-disaster housing module asks whether a power outage caused basement flooding.",
    culpritOptionId: "no",
    caught:
      "“No” quietly merges no flooding, no pump failure, and no pump at all. Testers proposed a follow-up after No because the single answer couldn't separate those states — so “Something's missing” is a fair read too."
  },
  {
    id: "cap-owner-advertising",
    specimenId: "owner-advertising",
    scene:
      "A housing-search series asks, one by one, how someone found their home.",
    culpritOptionId: "owner",
    caught:
      "Right after the internet-site question, “some other advertising by the owner” read as the same listing to many respondents. The earlier answer leaked into this one; the two items overlap."
  }
];

function patternLabelFor(pattern: FailurePattern): string {
  const labels: Record<FailurePattern, string> = {
    label_ambiguity: "Label ambiguity",
    broad_bucket: "Broad bucket",
    false_premise: "False premise",
    category_boundary_blur: "Category boundary blur",
    sequence_overlap: "Sequence overlap",
    forced_precision: "Forced precision"
  };
  return labels[pattern];
}

/* Resolve each case against the live specimen data so prompt/options/source
   stay in lockstep with the sourced wording. A case whose specimen or culprit
   option no longer exists is dropped rather than rendered wrong. */
export const capstoneCases: CapstoneResolved[] = CAPSTONE_CASES.flatMap((item) => {
  const specimen = workbenchSpecimens.find((s) => s.id === item.specimenId);
  if (!specimen) return [];
  const options = specimen.answerFrame.responseOptions ?? [];
  if (options.length === 0) return [];
  if (
    item.culpritOptionId !== "missing" &&
    !options.some((option) => option.id === item.culpritOptionId)
  ) {
    return [];
  }
  return [
    {
      ...item,
      number: specimen.number,
      prompt: specimen.answerFrame.prompt,
      eyebrow: specimen.answerFrame.eyebrow,
      options,
      pattern: specimen.pattern,
      patternLabel: patternLabelFor(specimen.pattern),
      walkHref: `#walk/${specimen.id}`,
      sourceLabel: `${specimen.source.agency} · ${specimen.source.documentCode} · ${specimen.source.year}`
    }
  ];
});
