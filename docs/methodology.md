# Methodology

Response Option Fit Lab is an interactive teaching lab first. It treats a
survey answer choice as a route: a respondent has a real situation, the form
offers a set of places to put it, and the exported column remembers only the
answer place and downstream code, not the private judgment that got it there.

The deployed home (`/`) is a single SQLBolt-style practice page titled "The
quiet ways a survey lies." It is organized as twelve authored exercises, each a
different response-option failure mode. The visitor makes a small decision,
sees an immediate consequence on a fixed cast of authored respondents, and then
recognizes the missing rule. An earlier version of this project was a multi-route
exhibit (an overview hub, a paginated twelve-puzzle walk anchored to public
Census cognitive-testing reports, a build-and-break export trap, a reviewer field
guide, and a reference shelf); it was retired on 2026-05-31 in favor of the
focused lab and remains in the project's git history.

## The Lab Exercises

The twelve exercises each isolate one response-option failure mode and give the
visitor a distinct mechanic, so the page does not feel like one puzzle
reskinned: build a rating scale and watch a leading stem, a missing
strong-negative, a dropped midpoint, and option order each move the result;
flag and repair double-barreled items; screen a false-premise question so
ineligible respondents do not inflate the denominator; fix overlapping age
buckets; assemble a "how did you hear about us" answer set against a cast that
satisfices or skips when their channel is missing; compare agree/disagree,
reverse-worded, and item-specific formats for acquiescence; trade off scale
length; tell a true neutral from "Don't know" from "Not applicable"; label every
point of a scale by building the middle labels and checking semantic balance;
spot the collision created by vague frequency words, then replace them without
falling into a fake 0-100 precision trap; classify option lists before deciding
what to rotate so an ordinal scale does not get scrambled — and see how the
survey mode flips which end of a fixed list gets the advantage (primacy on
screen, recency read aloud); and, as a capstone, review a draft survey and
diagnose each part.

All twelve are framed around a single running example — one coffee shop's
surveys, Roast & Brew's — so the domain stays fixed while the design problem
changes from exercise to exercise. The running example is a teaching device, not
a story: it holds the variable constant the way a textbook reuses one dataset,
and it deliberately avoids recurring-character callbacks or narrative beats that
would read as gimmicky to the professional audience. The capstone then reviews
that same shop's draft survey, so the arc closes where it started.

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

A closing knowledge map organizes the twelve exercises into four inspection
passes under the lab's own shorthand — SLOT (does every real answer have a
place), RULER (does the scale work), PUSH (does the format push the answer),
BOUNDARY (what would this inspection not prove). The map states plainly that
SLOT / RULER / PUSH / BOUNDARY are house shorthand, not field terms; a glossary
panel classifies each term the lab uses as an established term of art, borrowed,
or a lab coinage; and a closing note keeps response-option design inside the
larger total-survey-error picture (sampling, coverage, nonresponse, mode,
weighting, and processing are out of scope here).

## Interaction Posture

The design priority is interaction and transfer. Each lab exercise is an
interactive module with:

- a role for the visitor, such as mode mapper, form operator, sequence reviewer,
  rule finder, or counting-rule reviewer;
- a small check or decision with visible choices and no freeform input;
- immediate feedback after each move;
- a ledger, trace, or before/after state that shows what the data kept and what
  it lost;
- a reveal that names the pattern only after the visitor has touched the
  problem.

## Voice And Terminology

The app separates five voices:

- **App user:** the visitor solving an exercise. Button labels should name the
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

## Interaction Variety

The lab should not feel like twelve repeated cards. Reusing primitives is fine
when it keeps the implementation maintainable, but the user's job should vary:
build a scale, find a rule, sort a label, repair an item, open a gate, refit an
option set, set a threshold, build a ruler, spot a collision, classify a list,
or judge a format. Future work should prefer a distinct mechanic over a smaller
but less useful surface when those goals conflict.

Performance, page length, and test count are things to observe. They are not
reasons to collapse the lab back into article-like exposition.

## Source Posture

Sources are anchors, not the substrate. The lab is author-first: its scenarios
and casts are authored teaching material, labeled as authored and illustrative.
Where the lab states a design principle, the per-exercise source drawers name
the standard survey-methodology references behind it — Pew Research Center
("Writing Survey Questions"), Krosnick & Presser, Schuman & Presser, AAPOR,
Saris & Gallhofer, Revilla/Saris/Krosnick, Tourangeau, Fowler, Willis, the
CDC/NCHS Q-Bank, and the Census DICE questionnaire-design guidance — and pair
each with an evidence-strength label so the claim is not stated past what the
source supports.

The app should not imply that an authored cast's behavior is a source finding,
a validated replacement wording, an official agency answer key, or a population
estimate. Named sources are cited at the author/title/org level; the lab does
not invent page numbers. A cast or exercise case should be read as a teaching
illustration unless the UI explicitly says otherwise.

## Learning Model

The app uses prediction, retrieval, contrast, and visible consequence instead
of long explanation. The intended sequence is:

1. Touch the problem quickly.
2. Make a plausible choice.
3. See the route, ledger, or export consequence.
4. Name the pattern after the failure is visible.
5. Carry the move to the next exercise.

This is why the lab leads with interaction rather than a lightweight exposition
fallback. A text explanation can be useful backmatter, but it is not the
experience this app is trying to sell.

Where it is clean and specific, a reveal also names the **decision the bad number
drives** — not just that a count moved, but what a reader does with it (an owner
acts on an inflated "satisfied" and leaves the problem in place; a contaminated
denominator becomes a muddy adoption number the team tunes against). This is for
the audience, who make decisions on survey data; the "so what" is the point. It
is kept factual about what the data shows or hides, never a melodramatic business
outcome, and it is used on a few exercises, not forced onto every one.

## Boundaries

- No backend, upload, automated analyzer, or freeform survey text input. On-device
  progress (completed exercises + certificate count) is opt-in and clearable;
  any visitor analytics stay cookieless and aggregate.
- No score or grade on the work, no leaderboard or streak, and no claim that the
  visitor's choices validate a survey design. The completion certificate is a
  self-issued keepsake, gated on finishing all twelve — not an accredited
  credential, and its verification code is a content checksum, not a signature.
- No claim that any repair direction is tested replacement wording.
- No claim that authored situations estimate prevalence or error rates.
- No claim stated past what the cited evidence supports: contested or
  magnitude-dependent points (reverse-worded items, an optimal scale length,
  whether "Other" mainly captures higher-effort respondents) are framed as
  tradeoffs or defaults and carry a "contested" or "directionally supported"
  label, not the weight of a textbook consensus.
- Source links and citations may support context, but should not be allowed to
  pull the primary experience back toward a dry article or textbook.
