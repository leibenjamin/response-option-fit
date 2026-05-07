# Methodology

Response Option Fit Lab treats a survey answer choice as a possible mismatch
between what a person knows and what the form lets them record. The public page
uses the literal title "When survey answer choices don't match real answers";
the project name remains secondary. Each worked example starts with the
surrounding question or question sequence, the highlighted answer choice, and
the task the reader is being asked to judge.

## Example Selection

The twelve worked examples were selected from public U.S. Census Bureau and Office
for National Statistics testing materials because each shows a distinct
response-option fit problem without requiring sensitive personal examples or
full-instrument critique:

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

The exhibit is laid out across three hash-routed views so the worked examples
do not collapse into a single thirty-screen scroll. The overview at `#` keeps
the hero, the six-pattern knowledge map, and one fully-working embedded
worked example, so a visitor sees the work the exhibit can do without
clicking through. The walk at `#walk/<id>` paginates the remaining examples
one at a time, with a sticky pattern map on the right and prev/next
navigation; mid-walk recap interstitials appear after the fourth and eighth
examples, and a completion screen closes the sequence. The reference shelf
at `#reference` carries the glossary, method note, claim boundary, and source
appendix as their own route. The five-beat worked-example shell is identical
across all twelve examples in either context.

## Worked-Example Model

Each example is rendered in five teaching beats:

1. Frame: the surrounding survey question and highlighted answer choice.
2. Predict: example-specific judgments for each scenario.
3. Diagnose: report-based answer key and answer-choice diagram.
4. Probe: a small edit with live rationales for each scenario.
5. Reveal: what the source-supported revision addresses and what remains untested.

The prediction labels are authored per example so the learner sees local,
concrete language instead of generic fit terms. Every label set still maps to
the same three judgments: the highlighted answer choice fits the scenario, the
visible wording could send the scenario to more than one answer, or the scenario
belongs outside the highlighted answer choice.

The answer-choice diagram uses four explanatory stages: what the person knows,
the tested wording, where the answer choice stops fitting, and what the
recorded answer can hide. Each stage includes short detail copy from the
person's perspective. This structure is not a statistical model and does not
estimate respondent counts, error rates, or distributional effects.

## Authored Versus Source Material

The source reports provide the public evidence base, tested-wording excerpts,
report citations, and direct PDF links. The exhibit adds neutral framing,
answer frames, diagram-stage summaries, prediction labels, pattern labels, and concise
takeaways so the examples can be compared in a single interface.

See [specimen-red-team.md](specimen-red-team.md) for the current ambiguity
audit, copy decisions, and future-wave risks.

The provenance badges distinguish source-backed findings from authored
scenarios. A source-backed finding may be a reported finding, quotation, or
close paraphrase from a cited public report. An authored scenario is a
constructed teaching case grounded in the cited report's wording or
response-choice structure.

## Claim Boundary

The exhibit can support claims about how response options affect interpretation
and why questionnaire testing matters. It does not support claims that alternate
wording is validated, that the twelve examples generalize to all surveys, or that
the summarized findings replace the cited reports.
