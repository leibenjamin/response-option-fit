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
full-instrument critique. Some engines use synthetic or source-grounded
teaching cases to make the response route inspectable, while the public
reports remain the evidence anchors.

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
the sequence with a remix board of compact contrast prompts. The field guide at
`#field-guide` is a reviewer console with risk tabs, reusable checks, and
static prompts for external LLM review. The reference shelf at
`#reference` carries the glossary, method note, claim boundary, and source
appendix as their own route. Each example route now renders a specimen-specific
reviewer interaction engine: a lens map, level ladder, eligibility fork,
feature matrix, source timeline, schedule trace, device shelf, visibility
route map, premise stack, heading scanner, reason lanes, or counting calendar.

## Worked-Example Model

The current model is a specimen-specific reviewer interaction engine. Every example
keeps a common evidence spine but changes the surface to match the actual
review task:

1. **Reviewer action:** a page-specific control that appears near the top of
   the route, such as a lens toggle, level cue, threshold rule, section cue, or
   counting method.
2. **Case trace:** one respondent situation at a time, with a visible route
   into the map, stack, timeline, lane, or counting surface.
3. **Survey instrument drawer:** surrounding question, highlighted target
   answer, and source-boundary note, collapsed until the reviewer needs the
   exact wording.
4. **Repair sandbox:** preset repair directions and consequences, worded as
   design options rather than validated replacements.
5. **Apply-the-trace and source boundary:** a short application puzzle plus a
   collapsible receipt for the cited public report.

Every public specimen renders through `experience.engine`. The older
integrated case-lab renderer, five-step renderer, and the per-specimen
data fields that fed them were removed in the 2026-05-20 legacy-cleanup
wave; the renderer is now one path, and the data shape per specimen is
identity + claim title + survey instrument (`answerFrame`) + the
experience engine + source receipt.

The app also carries opt-in local walk progress. Settings and the walk
visited/recap-dismissed snapshots persist to `localStorage` only after
explicit consent through the Remember toggle; the engines themselves do
not persist per-choice interaction state. Stored data is never a grade,
survey score, analytics record, or evidence that a replacement wording
has been validated.

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

Teaching cases, pair bridges, completion-review prompts, repair rationales, and
workspace route notes are learning aids. They should not be read as official
source-agency answer keys or as tested replacement wording.

## Claim Boundary

The exhibit can support claims about how response options affect interpretation
and why questionnaire testing matters. It does not support claims that alternate
wording is validated, that the twelve examples generalize to all surveys, or that
the summarized findings replace the cited reports.
