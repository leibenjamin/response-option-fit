/* Data for the "Play the form" bespoke puzzle (Example 03, refrigerated
   medicine, false premise). The visitor plays the form and records three
   respondents using the real Yes / No / No-refrigerated-medicine buttons.

   Faithfulness: the prompt, the three buttons, and the reveal all come from
   the hand-verified specimen (`refrigerated-medicine` in workbench-specimens.ts:
   prompt "During the outage period, did any refrigerated medicine spoil?",
   options Yes/No/No refrigerated medicine, and the methodNote that testers
   recommended keeping the no-medicine option and adding a follow-up after "No"
   because some respondents did not volunteer the inapplicable state). The
   three respondents are AUTHORED TEACHING CASES (labeled as such) — not source
   quotes. No unverified verbatim is used. */

export type FormChoiceId = "yes" | "no" | "no-medicine";

export type FormChoice = { id: FormChoiceId; label: string };

export const playFormPrompt =
  "During the outage period, did any refrigerated medicine spoil?";

export const playFormChoices: [FormChoice, FormChoice, FormChoice] = [
  { id: "yes", label: "Yes" },
  { id: "no", label: "No" },
  { id: "no-medicine", label: "No refrigerated medicine" }
];

export type FormVignette = {
  id: string;
  who: string;
  says: string;
  truth: string;
  /* The button this respondent's own yes/no mental model leads them to tap. */
  naturalTap: FormChoiceId;
  /* The button that records the truth honestly with no follow-up. */
  honest: FormChoiceId;
  /* What an analyst reads from the export for each possible recorded button. */
  recordedAs: Record<FormChoiceId, string>;
  /* The false-premise case: the respondent's natural tap hides the truth. */
  isTrap: boolean;
  /* Whether the proposed "after No, ask: do you keep refrigerated medicine?"
     follow-up rescues this case. */
  followUpRescues: boolean;
};

export const playFormVignettes: [FormVignette, FormVignette, FormVignette] = [
  {
    id: "renu",
    who: "Renu",
    says: "My insulin lives in the fridge. The power was out two days, it got warm, and I had to throw it out.",
    truth: "Has refrigerated medicine. It spoiled.",
    naturalTap: "yes",
    honest: "yes",
    recordedAs: {
      yes: "Refrigerated medicine spoiled during the outage.",
      no: "Had refrigerated medicine; nothing spoiled.",
      "no-medicine": "No refrigerated medicine in the household."
    },
    isTrap: false,
    followUpRescues: false
  },
  {
    id: "theo",
    who: "Theo",
    says: "I keep insulin cold too. But the outage was short — the fridge stayed cold and nothing went bad.",
    truth: "Has refrigerated medicine. Nothing spoiled.",
    naturalTap: "no",
    honest: "no",
    recordedAs: {
      yes: "Refrigerated medicine spoiled during the outage.",
      no: "Had refrigerated medicine; nothing spoiled.",
      "no-medicine": "No refrigerated medicine in the household."
    },
    isTrap: false,
    followUpRescues: false
  },
  {
    id: "sam",
    who: "Sam",
    says: "We don't keep any medicine that needs refrigerating. None of us takes anything like that.",
    truth: "No refrigerated medicine at all.",
    naturalTap: "no",
    honest: "no-medicine",
    recordedAs: {
      yes: "Refrigerated medicine spoiled during the outage.",
      no: "Had refrigerated medicine; nothing spoiled.",
      "no-medicine": "No refrigerated medicine in the household."
    },
    isTrap: true,
    followUpRescues: true
  }
];

/* Pure helper: given a recorded button, the follow-up state, and the
   vignette, return what the export holds and whether it matches the truth.
   Exported for tests so the lesson ("a no-medicine household taps No and is
   recorded as having medicine, until the follow-up exists") is locked. */
export type FormOutcome = {
  recorded: string;
  honest: boolean;
  viaFollowUp: boolean;
};

export function recordOutcome(
  vignette: FormVignette,
  choice: FormChoiceId,
  followUpAdded: boolean
): FormOutcome {
  // The follow-up only fires after a "No" tap, and only changes anything for
  // a household that actually has no refrigerated medicine.
  if (followUpAdded && choice === "no" && vignette.honest === "no-medicine") {
    return {
      recorded: vignette.recordedAs["no-medicine"],
      honest: true,
      viaFollowUp: true
    };
  }
  return {
    recorded: vignette.recordedAs[choice],
    honest: choice === vignette.honest,
    viaFollowUp: false
  };
}
