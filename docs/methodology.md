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
full-instrument critique. Examples 01 and 02 use synthetic-primary case labs:
the night-market and city-employment scenarios are invented for instruction,
while the ACS ride-hailing report and the CPS internet-self-response report
remain the evidence anchors.

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

The exhibit is laid out across four hash-routed views so the worked examples
do not collapse into a single thirty-screen scroll. The overview at `#` keeps
the hero, the six-pattern knowledge map, and one fully-working embedded
worked example, so a visitor sees the work the exhibit can do without
clicking through. The walk at `#walk/<id>` paginates the remaining examples
one at a time, with a sticky pattern map on the right and prev/next
navigation; mid-walk recap interstitials appear after the fourth and eighth
examples, and a completion screen closes the sequence with six compact
contrast prompts. The field guide at
`#field-guide` turns the examples into reusable checks, pattern-specific
checklists, and static prompts for external research tool review. The reference shelf at
`#reference` carries the glossary, method note, claim boundary, and source
appendix as their own route. Examples 01 and 02 use the integrated case-lab
format. The remaining examples use the five-step worked-example format.

## Worked-Example Model

Two worked-example formats currently exist.

Examples 01 and 02 use the integrated case-lab format:

1. Setup: a synthetic survey question and highlighted answer choice.
2. Sort: a guided scenario deck. The first three teaching cases reveal
   feedback immediately on judgment (acquisition support); the last three
   gate feedback behind an explicit Show explanation control (retrieval
   support).
3. Repair bench: preset wording changes and per-scenario consequences.
4. Transfer check: one fresh scenario sorted with the same three judgments.
5. Real-world anchor: collapsed source evidence and claim boundaries.

The case-lab format intentionally reaches the active sorting task faster than
the five-step format. It shows the full answer list on larger screens, keeps
the list behind disclosure on phones, gates the repair bench until the learner
has sorted every teaching case, and gates the transfer check until the learner
has reviewed the repair bench. This keeps source context and repair caveats
visible without making them the first thing a novice has to parse.

Case-lab scenario cards show the respondent-reading line before the judgment
buttons. That line is part of the situation the learner is asked to reason
from, not post-answer feedback.

The remaining examples are rendered in five teaching beats:

1. Frame: the surrounding survey question and highlighted answer choice.
2. Predict: example-specific judgments for each scenario.
3. Diagnose: teaching diagnosis and answer-choice diagram.
4. Probe: a small preset wording change with diagnostic outcomes for each scenario.
5. Reveal: what the source-supported revision addresses and what remains untested.

The prediction labels are authored per example so the learner sees local,
concrete language instead of generic fit terms. Every label set still maps to
the same three judgments: the highlighted answer choice fits the scenario, the
visible wording could send the scenario to more than one answer, or the scenario
belongs outside the highlighted answer choice.

Locked previews appear before gated legacy sections so visitors can see that
Compare routes, Probe, Reveal, and Quick practice are intentionally downstream
of the first judgment. These previews do not expose the answer key.

The app also carries opt-in local practice notes. They remember only predefined
choice IDs and outcomes when the visitor has enabled Remember in Settings. The
notes can show counts such as routes marked, teaching routes matched, and
practice items completed, but they are not grades, survey scores, analytics,
or evidence that a replacement wording has been validated.

The answer-choice diagram uses four explanatory stages: what the person knows,
the tested wording, where the answer choice stops fitting, and what the
recorded answer can hide. Each stage includes short detail copy from the
person's perspective. This structure is not a statistical model and does not
estimate respondent counts, error rates, or distributional effects.

Repair and Probe outcomes are visitor-facing teaching diagnostics, not
validation results.
They distinguish route clearer, still ambiguous, still outside target, tradeoff
remains, method still hidden, and scope widened states so a wording change can
remain partial even when it improves one route. The second example in each
pattern pair also carries a compact bridge note to help visitors compare the
two shapes of the same problem family.

Case-lab repair outcomes add **misread risk** for the current wording when a
nearby out-of-scope scenario can be tempted into the highlighted label without
the exhibit claiming that the answer choice itself has been intentionally
widened.

## Authored Versus Source Material

The source reports provide the public evidence base, tested-wording excerpts,
report citations, and direct PDF links. The exhibit adds neutral framing,
synthetic teaching cases, answer frames, diagram-stage summaries, prediction
labels, pattern labels, and concise takeaways so the examples can be compared
in a single interface.

See [specimen-red-team.md](specimen-red-team.md) for the current ambiguity
audit, copy decisions, and future-wave risks.

The current provenance vocabulary is more specific than the old two-label
system:

- **Teaching case:** invented for the lesson; not reported by the source.
- **Reported quote:** direct or close quote from a cited public report.
- **Reported finding:** summarized finding from a cited public report.
- **Source-grounded stress case:** constructed teaching case based on a cited
  source finding.

Teaching cases, pair bridges, completion-review prompts, case-lab repair
rationales, and Probe rationales are learning aids. They should not be read as
official source-agency answer keys or as tested replacement wording.

## Claim Boundary

The exhibit can support claims about how response options affect interpretation
and why questionnaire testing matters. It does not support claims that alternate
wording is validated, that the twelve examples generalize to all surveys, or that
the summarized findings replace the cited reports.
