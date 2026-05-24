/* Data for the "Flatten the week" puzzle (Example 06, usual-hours,
   forced precision). The visitor is the RESPONDENT this time: their real weeks
   vary, but the field wants one "usual hours" number, so they are forced to
   compress — and whichever number they pick, the variation that defines the job
   is erased and a steady worker becomes indistinguishable from them.

   Distinct from the build-and-break export trap (which DECOMPOSES an aggregate
   across people): here the failure is within ONE respondent — forced precision
   compressing a variable reality into a single value, and the visitor feels it
   as the person doing the flattening.

   Faithfulness: the field and its forced-precision failure are from the
   hand-verified specimen (`usual-hours`). The worker's weeks and the answer
   options are AUTHORED TEACHING content (labeled); the options are the kinds of
   answer a real respondent reaches for, not validated wording. */

/* The respondent's actual recent weeks (authored teaching case). Deliberately
   wide-swinging — a shift/gig schedule, not a steady job. */
export const flattenWeeks: number[] = [52, 31, 44, 38];

export const flattenField =
  "How many hours per week do you USUALLY work at your main job?";

export type FlattenOption = {
  id: string;
  label: string;
  value: number;
  /* The reasoning a real respondent might use to land here. */
  gloss: string;
};

export const flattenOptions: [
  FlattenOption,
  FlattenOption,
  FlattenOption,
  FlattenOption
] = [
  { id: "average", label: "The average", value: 41, gloss: "Add them up, divide by four." },
  { id: "typical", label: "A typical week", value: 40, gloss: "Round to the one that feels normal." },
  { id: "busiest", label: "My busiest", value: 52, gloss: "Report the most I ever work." },
  { id: "slowest", label: "My slowest", value: 31, gloss: "Report the least, to be safe." }
];

export const flattenRange = {
  min: Math.min(...flattenWeeks),
  max: Math.max(...flattenWeeks)
};
