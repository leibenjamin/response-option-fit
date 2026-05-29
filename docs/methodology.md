# Methodology

Response Option Fit Lab is an interactive teaching lab first. It treats a
survey answer choice as a route: a respondent has a real situation, the form
offers a set of places to put it, and the exported column remembers only the
answer place and downstream code, not the private judgment that got it there.

The deployed home (`/`) is a single SQLBolt-style practice page titled "The
quiet ways a survey lies." It is organized as nine authored exercises, each a
different response-option failure mode. The visitor makes a small decision,
sees an immediate consequence on a fixed cast of authored respondents, and then
recognizes the missing rule. A broader exhibit — an archived twelve-puzzle
walk, a build-and-break export trap, a reviewer field guide, and a reference
shelf — remains reachable by URL hash (see "Archived walk" below).

## The Lab Exercises

The nine exercises each isolate one response-option failure mode and give the
visitor a distinct mechanic, so the page does not feel like one puzzle
reskinned: build a rating scale and watch a leading stem, a missing
strong-negative, a dropped midpoint, and option order each move the result;
flag and repair double-barreled items; screen a false-premise question so
ineligible respondents do not inflate the denominator; fix overlapping age
buckets; assemble a "how did you hear about us" answer set against a cast that
satisfices or skips when their channel is missing; compare agree/disagree,
reverse-worded, and item-specific formats for acquiescence; trade off scale
length; tell a true neutral from "Don't know" from "Not applicable"; and, as a
capstone, review a draft survey and diagnose each part.

Wrong moves are designed cul-de-sacs: recoverable, and informative because the
consequence is shown on the cast rather than scored. The casts are authored and
deterministic; the only counts shown are over the named cast, never a
prevalence or effect-size estimate.

A solved exercise reveals two debrief surfaces. A **receipt** names which
inspection pass it exercised. A **source drawer** then hands over the real
field vocabulary for what was practiced (e.g. double-barreled item, primacy,
satisficing, acquiescence, reverse-worded item), an honest **evidence-strength
label** (textbook consensus / directionally supported / plausible illustration
/ contested), the boundary of what not to overclaim, an optional mode caveat,
and named sources. The label is load-bearing: it stops a contested claim
(reverse-worded items as a net good; a universal "5–7 scale points" rule) from
being dressed the same as a textbook one (double-barreled items are
unanswerable).

A closing knowledge map organizes the nine exercises into four inspection
passes under the lab's own shorthand — SLOT (does every real answer have a
place), RULER (does the scale work), PUSH (does the format push the answer),
BOUNDARY (what would this inspection not prove). The map states plainly that
SLOT / RULER / PUSH / BOUNDARY are house shorthand, not field terms; a glossary
panel classifies each term the lab uses as an established term of art, borrowed,
or a lab coinage; and a closing note keeps response-option design inside the
larger total-survey-error picture (sampling, coverage, nonresponse, mode,
weighting, and processing are out of scope here).

## Interaction Posture

The design priority is interaction and transfer. Each lab exercise (and each
archived walk puzzle) is an interactive module with:

- a role for the visitor, such as mode mapper, form operator, sequence reviewer,
  rule finder, or counting-rule reviewer;
- a small task with visible choices and no freeform input;
- immediate feedback after each move;
- a ledger, trace, or before/after state that shows what the data kept and what
  it lost;
- a reveal that names the pattern only after the visitor has touched the
  problem.

In the archived walk, the opening hook is the smallest version of that problem,
not a detached word game: a survey asks, "In one word, what was your usual way
to get to work last week?", then four honest commute answers arrive. The
visitor decides whether to accept, reject, or demand a rule for each submitted
answer before the walk expands into full answer choices, yes/no paths,
catch-alls, device boundaries, and numeric fields. In that hook, "Accept it"
means the reviewer decides the form can accept the submitted answer under the
visible instruction. It does not mean the survey respondent is answering, and
it does not introduce a database/storage term of art.

## Voice And Terminology

The app separates five voices:

- **App user:** the visitor solving a puzzle. Button labels should name the
  visitor's immediate move: accept, reject, route, choose, open, test, set, add,
  or count.
- **Survey respondent:** the person in the authored or sourced situation. Their
  voice appears in quotes, scenes, and "the respondent writes/chooses/says"
  copy.
- **Survey/form:** the instrument voice: field, answer choice, instruction,
  follow-up, route, and question wording.
- **Analyst/export:** the downstream data view. Use recorded, coded, exported,
  grouped, or counted when describing what the data file or analyst sees.
- **Narrator:** the app's explanatory voice. It names the missing rule only
  after the visitor has seen the consequence.

`Storage rule` is intentionally rejected as primary app language. It is not a
familiar survey-methods term for likely users, and it sounds more like product
or database infrastructure than survey response design. `Record it` was also
rejected as a universal button because it can mean form operation, analyst
coding, archival capture, or respondent answer entry depending on the context.
Use `recorded` only when the visitor is explicitly operating a form or when the
copy is describing a downstream data record.

## Archived Walk

The earlier twelve-puzzle "walk" predates the lab and remains reachable at
`#walk` for reference. Its puzzles are anchored to public Census Bureau
cognitive-testing reports (see source-notes.md) and use the same interaction
posture. They are:

1. **Ride-hailing:** route commutes into one option and watch app ride, taxi,
   carpool, and bike-share meanings split the column.
2. **Business / industry:** code one worker's answer at several altitudes and
   watch employer, workplace, industry, and sector mix.
3. **Refrigerated medicine:** play the form, mis-record a no-medicine
   household, then add the missing gate.
4. **Electric vehicle type:** classify vehicle cards under hidden technical and
   everyday rules.
5. **Owner advertising:** stop a signal from leaking across two adjacent
   questions.
6. **Usual hours:** compress a volatile schedule into one number and see the
   swing disappear.
7. **Notebook computer:** sort portable devices before "notebook" drifts across
   laptop, Chromebook, tablet, and literal-notebook meanings.
8. **Move reasons:** open catch-all drawers and see concrete moving reasons stay
   hidden until write-in recoding is enabled.
9. **Sump pump:** open the denominator gate between no flooding, no pump
   failure, and no pump.
10. **TV-connected devices:** switch hidden boundary rules and see Apple TV,
    Roku-like boxes, game systems, and connected laptops move.
11. **Natural disasters:** set whether Yes means any reason or the main reason.
12. **Weeks worked:** count the same year under different private recipes.

The answer-set builder, the field guide, the cold-read capstone, and the exit
artifact remain part of the same interaction arc: respondent, form, analyst,
reviewer.

## Interaction Variety

The walk should not feel like twelve repeated cards. Reusing primitives is fine
when it keeps the implementation maintainable, but the user's job should vary:
map a route, find a rule, sort a label, trace a signal, open a gate, draw a
device boundary, set a threshold, or expose a counting recipe. Future work should
prefer a distinct mechanic over a smaller but less useful surface when those
goals conflict.

Performance, page length, and test count are things to observe. They are not
reasons to collapse the lab back into article-like exposition.

## Source Posture

Sources are anchors, not the substrate. The lab is author-first: its scenarios
and casts are authored teaching material, labeled as authored and illustrative.
Where the lab states a design principle, the per-exercise source drawers name
the standard survey-methodology references behind it — Pew Research Center
("Writing Survey Questions"), Krosnick & Presser, Schuman & Presser, AAPOR,
Saris & Gallhofer, Revilla/Saris/Krosnick, Willis, and the CDC/NCHS Q-Bank —
and pair each with an evidence-strength label so the claim is not stated past
what the source supports. The archived walk separately anchors its twelve
puzzles to public Census Bureau cognitive-testing reports (see
source-notes.md).

The app should not imply that an authored cast's behavior is a source finding,
a validated replacement wording, an official agency answer key, or a population
estimate. Named sources are cited at the author/title/org level; the lab does
not invent page numbers. When a real respondent quote appears (in the walk
reveals), it is treated as quoted source material. When a cast or exercise case
appears, it should be read as a teaching illustration unless the UI explicitly
says otherwise.

## Learning Model

The app uses prediction, retrieval, contrast, and visible consequence instead
of long explanation. The intended sequence is:

1. Touch the problem quickly.
2. Make a plausible choice.
3. See the route, ledger, or export consequence.
4. Name the pattern after the failure is visible.
5. Carry the move to the next puzzle.

This is why the walk no longer has a lightweight exposition fallback. A text
explanation can be useful backmatter, but it is not the experience this app is
trying to sell.

## Boundaries

- No backend, analytics, runtime AI, upload, or freeform survey text input.
- No score, grade, leaderboard, streak, or claim that the visitor's choices
  validate a survey design.
- No claim that any repair direction is tested replacement wording.
- No claim that authored situations estimate prevalence or error rates.
- No claim stated past what the cited evidence supports: contested or
  magnitude-dependent points (reverse-worded items, an optimal scale length,
  whether "Other" mainly captures higher-effort respondents) are framed as
  tradeoffs or defaults and carry a "contested" or "directionally supported"
  label, not the weight of a textbook consensus.
- Source links and citations may support context, but should not be allowed to
  pull the primary experience back toward a dry article or textbook.
