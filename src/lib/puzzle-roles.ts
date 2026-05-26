/* The walk's role voice, reconciled.
 *
 * Each puzzle keeps its own differentiated VERB (mode mapper, industry coder,
 * shift worker, …) for novelty and memorability — and is tagged with the macro
 * SEAT it belongs to. The four seats are the same four the exhibit's closing
 * "you stood on all four sides" arc names: Respondent, Form, Analyst, Reviewer.
 *
 * Why both: the verbs alone never accumulated into anything (the ending's
 * four-sides claim was asserted, not earned, and leaned on off-walk surfaces);
 * collapsing to four labels alone would have flattened the per-puzzle character.
 * Showing "Your role: <Seat> · <verb>" lets the seat visibly cycle across the
 * walk (so the ending is earned) while the verb stays distinct (so each puzzle
 * still feels its own). This is the single source of truth the shared
 * PuzzleEyebrow reads, so every puzzle renders the role identically.
 *
 * Seat assignment follows what the visitor actually DOES in the puzzle:
 *   Respondent — you are the surveyed person answering (06).
 *   Form       — you are the form recording answers (03, 05).
 *   Analyst    — you code / recode / total the exported data (02, 08, 12).
 *   Reviewer   — you judge or repair the instrument (01, 04, 07, 09, 10, 11).
 */

export type RoleSeat = "Respondent" | "Form" | "Analyst" | "Reviewer";

export type PuzzleRole = {
  seat: RoleSeat;
  verb: string;
};

export const puzzleRoleBySpecimenId: Record<string, PuzzleRole> = {
  "ride-hailing": { seat: "Reviewer", verb: "mode mapper" },
  "business-industry": { seat: "Analyst", verb: "industry coder" },
  "refrigerated-medicine": { seat: "Form", verb: "intake operator" },
  "electric-vehicle-type": { seat: "Reviewer", verb: "rule finder" },
  "owner-advertising": { seat: "Form", verb: "sequence recorder" },
  "usual-hours": { seat: "Respondent", verb: "shift worker" },
  "notebook-computer": { seat: "Reviewer", verb: "label tester" },
  "move-reason-catchall": { seat: "Analyst", verb: "catch-all recoder" },
  "sump-pump": { seat: "Reviewer", verb: "eligibility checker" },
  "tv-connected-devices": { seat: "Reviewer", verb: "boundary setter" },
  "avoid-natural-disasters": { seat: "Reviewer", verb: "threshold setter" },
  "acs-weeks-worked": { seat: "Analyst", verb: "counting-rule auditor" }
};

const FALLBACK: PuzzleRole = { seat: "Reviewer", verb: "reviewer" };

export function puzzleRole(specimenId: string): PuzzleRole {
  return puzzleRoleBySpecimenId[specimenId] ?? FALLBACK;
}
