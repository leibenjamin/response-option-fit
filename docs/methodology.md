# Methodology

Response Option Fit Lab treats a survey answer choice as a possible mismatch
between what a person knows and what the form lets them record. The public page
uses the literal title "When answer choices don't give the respondent's answer
a clear place to go"; the project name remains secondary. Each worked example
starts with the surrounding question or question sequence, the highlighted
answer choice, and the task the reader is being asked to judge. Newer examples
may use synthetic teaching cases first, with the public source moved into a
visible evidence anchor.

## Example Selection

The twelve worked examples are anchored to public U.S. Census Bureau and Office
for National Statistics testing materials because each source shows a distinct
response-option fit problem without requiring sensitive personal examples or
full-instrument critique. A few examples use synthetic or source-grounded
teaching cases (clearly labeled) to make the failure inspectable, while the
public reports remain the evidence anchors.

- **Label ambiguity ("same words, several meanings"):** respondents may
  attach different everyday meanings to the same answer-choice wording.
- **Broad bucket:** a single answer space — a write-in box or one tick-box —
  can collect responses at very different scopes (workplace, business type,
  or whole industry).
- **False premise:** a yes/no answer can hide a not-applicable state.
- **Category boundary blur:** everyday categories can diverge from technical
  classification rules.
- **Sequence overlap:** the meaning of an option can depend on the preceding
  question or answer.
- **Forced precision:** a single exact-looking answer can be required from
  variable or episodic experience.

## Page Layout

The exhibit is laid out across five primary hash-routed views so the worked examples
do not collapse into a single thirty-screen scroll. The overview at `#` is
anchored by a live specimen hook in the hero that routes four field values
(`can't`, `New York`, `follow-up`, `Q2 FY26`) against a tiny intake rule
("one word only"); a sticky knowledge-map rail names the six-pattern
taxonomy along the right side of the page (alongside both the hero and the
embedded example, so it never pushes the example down); and one
fully-working embedded worked example on the U.S. Census ACS commute item
shows the same shape at higher stakes — so a visitor sees the central
failure in miniature, the six recurring shapes it takes, and one full
source-anchored review without clicking through. The full six-pattern map
opens on demand as an overlay rather
than occupying the overview scroll as a block of taxonomy. The walk at
`#walk/<id>` paginates the remaining examples one at a time, with a knowledge-map
drawer that stays open by default (so the visitor sees where they are
without an extra click), prev/next navigation, and mid-walk recap interstitials
appear after the fourth and eighth examples, and a completion screen closes
the sequence with a cold-read capstone — four real instruments shown with no
pattern label or engine, where the visitor taps where they think the answer
choices break and then sees what the cognitive-testing report actually caught —
followed by a remix board of compact contrast prompts and a closing exit
artifact that names the four-role arc the exhibit puts the visitor through
(respondent, form, analyst, reviewer), states one durable habit, and offers one
clear next action. The
build-and-break route at `#build` lets visitors assemble answer choices for two
topics, then shows the tidy frequency table that selection would export. The
export looks ready to chart until the visitor opens the cells: a clean record
and a forced record share one count, split cases cannot be filed in a single
cell, and lost cases never enter the table at all — so the number of people who
answered does not equal the number the export can place. A classification-rule
layer then tests whether an instruction (not another box) repairs the column.
The field
guide at `#field-guide` is a reviewer console with risk tabs, reusable checks,
and static prompts for external LLM review. The reference shelf at `#reference`
carries the glossary, method note, claim boundary, and source appendix as their
own route. The colophon remains a separate production-notes route. Each walk
example renders one of two ways: most render a lightweight **exposition** — the
real survey instrument, a one-line "When …" finding, and an opt-in "show what
breaks" reveal — and a few render a **bespoke per-example puzzle** where a
purpose-built interaction teaches the pattern far better than reading would.

## Worked-Example Model

The walk had, through mid-2026, twelve "interaction engines" — one underlying
mechanic (set a control, pick a case, read a precomputed result) reskinned
twelve times. That made the walk read like a textbook and carried ~3,000 lines
of machinery, so the **2026-05-21 engine-retirement wave removed it.** Two
render paths remain, both drawn from the same hand-verified specimen data
(identity + claim title + survey instrument `answerFrame` + source):

1. **Exposition** (`ExampleExposition`, the default). The example shows its real
   eyebrow, the "When …" claim, and the actual survey instrument (prompt and
   answer choices, with the flagged choice highlighted on demand). The
   explanation — why the pattern bites, plus any source nuance — is opt-in
   behind one "show what breaks" reveal, so the default view is the item itself,
   not a wall of prose. Source, scope, and the claim boundary sit in one quiet
   collapsed fold. This is the right surface for examples an expert mostly needs
   to *see*, not play.
2. **Bespoke puzzle** (a self-contained component, mounted via a per-specimen
   override in `Workbench`). Used where a purpose-built interaction earns its
   keep — a few examples, each with its own distinct verb, sharing only the
   puzzle frame (hero / reveal / source). Today there are four, across four
   patterns:
   - **Example 02 (business/industry), "Zoom to the right altitude"** —
     broad bucket. The reader codes one worker's open-text answer ("I work at a
     hospital") and slides through the altitudes a coder could pick (employer →
     workplace → industry → sector); every one is defensible, so committing to
     one shows the column will mix levels and can't be compared.
   - **Example 03 (refrigerated medicine), "Play the form"** — false premise.
     The reader is the form, records three respondents, watches a no-medicine
     household get recorded as "had medicine, none spoiled," then adds the
     follow-up the testers recommended and re-records honestly.
   - **Example 05 (owner-advertising), "Stop the leak"** — sequence overlap.
     The reader records one respondent across two adjacent questions whose
     categories overlap, watches a single listing double-count, and discovers
     reordering does nothing while scoping or merging closes the leak.
   - **Example 06 (usual-hours), "Flatten the week"** — forced precision. The
     reader is the respondent: their four weeks swing 31–52 hours, the field
     wants one "usual" number, and whichever defensible number they pick erases
     the variation and makes them indistinguishable from a steady worker.

   The remaining patterns stay exposition deliberately: label ambiguity and
   category-boundary blur have no distinct deep-puzzle mechanic that would not
   either overlap one of these four or regress toward the retired engine
   primitive — so forcing puzzles onto them would recreate the sameness the
   retirement removed. Four genuinely distinct verbs is the ceiling here.

   Puzzles reuse only hand-verified specimen wording and findings; any invented
   people or candidate fixes are labeled teaching content. The deeper hands-on
   teaching lives here, in `#build`, and in the capstone — not in twelve
   near-identical engines.

   **Real respondent words.** Seven examples (three puzzles, four expositions)
   close their reveal with a real respondent's *verbatim* sentence pulled from
   the cited cognitive-testing report — for instance the person who said the
   business field "is asking what kind of business or industry is this, which is
   two different questions … the business is a hospital and the industry is
   health care." Each quote was read straight out of the source PDF and
   confirmed character-for-character (page noted in the data) before shipping.
   This is the exhibit's un-replicable layer: a model can paraphrase a finding,
   but it cannot hand you a real person's confused sentence. The quotes are
   surfaced as quiet pulled quotes with light attribution (survey + year) —
   realness as a teaching asset, not citation ceremony. Examples without a
   vivid, on-point respondent sentence carry none, and the identity examples
   never do (see the sensitive-example rule below).

## Build-And-Break Model

Build-and-break is its own standalone route, separate from the walk's render
paths. It does not ask the visitor to choose a case and read a prewritten
outcome. Instead it makes the visitor the author of the failure, in four beats:

1. **Build:** assemble a small answer set from fixed, plausible chips. More
   choices is not automatically safer.
2. **The export:** the route shows the tidy frequency table that selection would
   produce — the column an analyst opens next. It looks ready to chart.
3. **Open the cells:** decompose the table. Each situation's fate is computed
   live from the selected set — **clean** (exactly one honest home), **split**
   (two or more honest homes, so the answer overlaps and cannot be filed in one
   cell), **forced** (no honest home, but a misleading nearby answer absorbs the
   case under a count that looks identical to a clean one), or **lost** (no
   selected answer can hold the case, so it never reaches the table). The point
   the decomposition makes is that the people who answered outnumber the rows the
   export can place: split cases sit in an "ambiguous" tray, lost cases in a
   "never reached the export" tray, and forced cases hide inside otherwise-clean
   counts.
4. **Add a rule:** test whether a public instruction — not another box —
   repairs the column. The rule keeps the same chips and situations and changes
   only how one recorded home is chosen; for example the commute topic can apply
   the Census-supported longest-distance rule after the visitor has already seen
   the multimodal split. Authored rules are labeled as authored teaching
   instructions and are not source claims.

The export is a teaching tally of the authored situations only — six people,
integer counts — not a distribution or an estimate of real-world frequency.

The commute topic is source-anchored to ACS journey-to-work materials, but its
named commuters are authored teaching situations. The source support is limited
to the ACS commute item context, the Census FAQ rule that multimodal commutes
are counted by the single method used for the longest distance, the
ride-hailing/carpooling concern, and the placement of "Worked from this address."
Only the commute longest-distance rule uses source-supported rule language. The
usual-reference-week and residual-last commute rules are authored teaching
instructions. The sandwich topic is labeled as a teaching case and makes no
source claim. Neither topic estimates frequency, error rates, or population
effects.

## Capstone Cold Read

The completion screen opens with a cold read: four real worked-example
instruments are re-presented with no pattern label and no engine — just the
sourced question and its actual answer choices, rendered as a tappable form. The
visitor commits a read (tap the answer choice they would flag, or "Something's
missing here," or "It all looks fine to me"), and the reveal shows the option the
cognitive-testing report actually flagged, the pattern, a one-line plain-language
finding, and a link to the full example. The four cases (ride-hailing, electric-
vehicle type, sump-pump flooding, owner-advertising sequence) span four of the
six patterns; the identity examples are deliberately excluded so the cold read
never becomes an out-of-context critique of an ethnicity form. The capstone
reuses verified specimen wording — it adds no source claim — and is
non-judgemental: a pick is "your read," never "wrong," and "looks fine" still
surfaces what testing caught. It tests recognition transfer (catching a problem
cold, on someone else's form), the skill the walk was building.

The completion screen then closes with an **exit artifact** — the through-line
made explicit. It names the four-role arc the exhibit puts the visitor through —
**respondent** (the hub hook), **form** (the Play-the-form puzzle),
**analyst** (the build-and-break export), **reviewer** (the cold read) — and
captures the one durable habit ("before you trust a tidy column, ask which
different answers it quietly merged, and whether the form ever gave them a clear
place to go"), followed by a single clear next action (the field guide, or the
first example if the visitor arrived cold). It is the spine of the whole piece
in one card: *it looks fine; that's the problem.*

The app also carries opt-in local walk progress. Settings and the walk
visited/recap-dismissed snapshots persist to `localStorage` only after
explicit consent through the Remember toggle; the exposition reveal, the
puzzles, and build-and-break selections are session-only React state and never
persist. Stored data is never a grade, survey score, analytics record, or
evidence that a replacement wording has been validated.

Every walk surface shows where a recorded answer stops matching what the
respondent knew. This is a teaching abstraction, not a statistical model: it
does not estimate respondent counts, error rates, or distributional effects.

The repair sandbox presents candidate wording directions and their effects as
design options, each with an explicit caution that the direction is not
validated replacement wording. The apply-the-trace prompt is a short transfer
check, not a graded quiz. Each worked example carries a quiet source
attribution (agency, document code, year) with the full citation and direct
PDF link in a collapsible manifest. Sources were hand-checked against the cited
PDFs, but that check is kept in the background — a quiet credibility backbone,
not a foreground claim — because the exhibit's job is an engaging, hands-on
read, not a display of citation ceremony. The one place verified source
material is brought to the foreground is a real respondent's own verbatim words
in the reveal (see "Real respondent words" above): that is surfaced as delight —
a striking human voice — rather than as a citation, which is why its attribution
stays light and never becomes a page-number parade.

## Authored Versus Source Material

The source reports provide the public evidence base, tested-wording excerpts,
report citations, and direct PDF links. The exhibit adds neutral framing,
synthetic teaching cases, surrounding question context, highlighted answer
choices, pattern labels, repair directions, and concise takeaways so the
examples can be compared in a single interface.

The current provenance vocabulary is:

- **Teaching case:** invented for the lesson; not reported by the source.
- **Reported quote:** direct or close quote from a cited public report.
- **Reported finding:** summarized finding from a cited public report.
- **Source-grounded stress case:** constructed teaching case based on a cited
  source finding.

Teaching cases, build-and-break situations, puzzle vignettes, exposition
findings, and completion-review prompts are learning aids. Build-and-break cards
and puzzles use a status label for authored teaching content rather than a
source provenance claim. They should not be read as official source-agency answer keys
or as tested replacement wording.

## Claim Boundary

The exhibit can support claims about how response options affect interpretation
and why questionnaire testing matters. It does not support claims that alternate
wording is validated, that the twelve examples generalize to all surveys, or that
the summarized findings replace the cited reports.
