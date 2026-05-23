# Methodology

Response Option Fit Lab is now an interactive teaching lab first. It treats a
survey answer choice as a route: a respondent has a real situation, the form
offers a set of places to put it, and the exported column remembers only the
place the form managed to store.

The public page still uses the literal title "When answer choices don't give
the respondent's answer a clear place to go." The implementation, however, is
not organized as a source-first review. It is organized as twelve authored
problem-solving puzzles that let the visitor make a small decision, see an
immediate consequence, and then recognize the missing rule.

## Interaction Posture

The design priority is delight and transfer, not citation ceremony. Each walk
puzzle has an interactive module with:

- a role for the visitor, such as route mapper, form, scanner, rule finder, or
  counting recipe;
- a small task with visible choices and no freeform input;
- immediate feedback after each move;
- a ledger, trace, or before/after state that shows what the data kept and what
  it lost;
- a reveal that names the pattern only after the visitor has touched the
  problem.

The opening hook is the smallest version of the app's problem, not a detached
word game: a survey asks, "In one word, what was your usual way to get to work
last week?", then four honest commute answers arrive. The visitor decides
whether to store, reject, or demand a rule for each answer before the app
expands into full answer choices, yes/no paths, catch-alls, device boundaries,
and numeric fields.

The twelve walk puzzles are:

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

## Novelty Over Uniformity

The walk should not feel like twelve reskinned cards. Reusing primitives is fine
when it keeps the implementation maintainable, but the user's job should vary:
map a route, find a rule, sort a label, trace a signal, open a gate, draw a
device boundary, set a threshold, or expose a counting recipe. Future work should
prefer a new satisfying mechanic over a smaller or more citation-heavy surface
when those goals conflict.

Performance, page length, and test count are things to observe. They are not
reasons to collapse the lab back into article-like exposition.

## Source Posture

Sources are optional anchors, not the product's moat. Public Census Bureau
materials still inform the active answer-choice problems and remain available
in the reference shelf or optional details, but most cases, people, routes,
feedback, and visual consequences are authored teaching material. The earlier
Kashmiri and ethnic-heading examples are retired from the active slate.

The app should not imply that authored puzzle feedback is a source finding, a
validated replacement wording, or an official agency answer key. When a real
respondent quote appears, it is still treated as quoted source material. When a
small puzzle case appears, it should be read as a teaching case unless the UI
explicitly says otherwise.

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

- No backend, analytics, automated analyzer, upload, or freeform survey text input.
- No score, grade, leaderboard, streak, or claim that the visitor's choices
  validate a survey design.
- No claim that any repair direction is tested replacement wording.
- No claim that authored situations estimate prevalence or error rates.
- Source links and citations may support context, but should not be allowed to
  pull the primary experience back toward a dry article or textbook.
