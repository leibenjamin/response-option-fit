/* Data for the "Stop the leak" bespoke puzzle (Example 05, owner-advertising,
   sequence overlap). The AHS housing-search series asks, one after another,
   how someone found their home. One real listing can match two adjacent
   questions, so the visitor (playing the form) watches a single Zillow listing
   posted by the owner get double-counted or dropped — then tries fixes and
   finds that reordering the questions does nothing (the overlap is the bug),
   while scoping or merging the questions closes the leak.

   Faithfulness: the two questions, the sequence-overlap failure, and the
   finding ("the same listing can look relevant to two adjacent items") are from
   the hand-verified specimen (`owner-advertising`). The respondent and the
   candidate fixes are AUTHORED TEACHING content (labeled), and the fixes are
   design options, not validated replacement wording. */

export type LeakAnswer = "yes" | "no";

export const leakRespondent =
  "Dani found her apartment through a Zillow listing — one that the owner had posted.";

/* The two adjacent questions, in order (from the specimen's answer frame). */
export const leakQuestions: [string, string] = [
  "Did you find your home on an internet site such as Craigslist, apartments.com, realtor.com, or Zillow?",
  "Through some other advertising by the owner?"
];

/* What the analyst's data shows for each way the visitor records the second
   (owner-advertising) question, given the visitor already answered the first
   one "Yes, Zillow." Both are wrong — that is the leak. */
export const leakOutcomes: Record<LeakAnswer, string> = {
  yes: "Counted twice. The export now shows two ways helped Dani find her home — an internet site AND owner advertising — but it was one listing. The owner-advertising count is inflated.",
  no: "The signal vanishes. The owner did advertise — that is how Dani found the place — but because she already named Zillow, the owner-advertising count misses her entirely."
};

export type LeakFix = {
  id: string;
  label: string;
  closes: boolean;
  note: string;
};

export const leakFixes: [LeakFix, LeakFix, LeakFix] = [
  {
    id: "reorder",
    label: "Ask the owner-advertising question first",
    closes: false,
    note: "Reordering changes nothing. The same listing still matches both questions, in either order. The overlap is the bug — not the sequence."
  },
  {
    id: "scope",
    label: "Add to the second question: “not counting a listing you already named”",
    closes: true,
    note: "Now the owner-advertising box catches only channels not already counted, so Dani's one listing lands once."
  },
  {
    id: "merge",
    label: "Merge both into one “select every way that helped” list",
    closes: true,
    note: "One question, each channel offered once. A single listing can only be selected once, so it can't double-count."
  }
];
