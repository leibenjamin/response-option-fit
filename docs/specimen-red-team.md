# Specimen Red-Team Log

This log records the ambiguity review behind the specimen-specific copy pass.
It is a working artifact for future implementation waves, not a claim that the
current wording is validated replacement survey wording.

## Reader Profiles Used

- Domain novice: knows ordinary words like taxi, hybrid, No, and usual, but not
  the survey-method pattern names.
- Survey-methods reader: knows cognitive testing vocabulary and can over-read
  pattern labels before checking the concrete item.
- Fast scanner: looks at button labels, headings, and answer choices before
  reading every context sentence.
- Edge-case respondent proxy: tries to answer from the imagined respondent's
  lived situation rather than from the author's intended taxonomy.

## Cross-Specimen Findings

- The old shared labels made readers translate twice: first from the scenario
  to the highlighted answer path, then from that path into Clean / Unclear /
  Wrong. Replacing them with local labels removes one inference step.
- Several mechanism prompts used "failure" without naming the concrete response
  route. Prompts now name the tested wording or answer path first.
- The route snapshot contained detail copy in data but did not render it. The
  UI now shows that detail so the route is a respondent-perspective explanation,
  not only a four-title diagram.
- Micro-cases were too phrase-like. Each case now includes a mini context and a
  local question prompt before answer choices.
- Nearest-neighbor contrasts now name a concrete neighbor specimen, so learners
  can compare with a visible worked case rather than a free-floating pattern.

## Specimen 01 - Ride-Hailing

- Main risk: earlier abstract wording required readers to infer the referent.
  The revised copy repeatedly names `Taxi or ride-hailing services`, app rides,
  taxi cabs, pooled rides, and informal carpools.
- Novice walkthrough: the frame now tells the reader the construct is a paid
  taxi or app-based ride service. The prediction labels say whether the trip
  matches that paid-service option, whether the label meaning can shift, or
  whether the trip is not this paid-service option.
- Fast-scanner risk: a scanner may still see "shared ride" in a vignette and
  jump to the highlighted option. The carpool vignette and probe language now
  explicitly distinguish informal carpools from paid app rides.
- Mechanism decision: the correct choice now says ride-hailing can mean app
  rides, taxi-like paid service, or shared rides. The vehicle-boundary distractor
  is reserved for Specimen 04.
- Route decision: details explain the trip, the tested option, the app/taxi/
  shared-ride break, and the data consequence.
- Micro-case decision: delivery/courier app service is the near transfer because
  the respondent may know the event but not which service label controls. The
  micromobility distractor reinforces category boundary blur.
- Remaining risk: "ride-hailing" itself remains historically and regionally
  variable; future testing could add locale-specific services beyond Uber/Lyft.

## Specimen 02 - Business / Industry

- Main risk: "business or industry" can be read as employer name, establishment
  type, sector, product line, or work activity. The new labels focus on answer
  level rather than generic fit.
- Novice walkthrough: hospital versus health care is now framed as an answer
  level problem, not as a question of whether either answer is factually wrong.
- Mechanism decision: the correct choice names one answer space spanning
  business type and industry level. Distractors separate numeric precision and
  sequence carryover.
- Route decision: the route details now name concrete possible answers:
  hospital, health care, food delivery, cashier, or employer name.
- Micro-case decision: gig-work company/line-of-work wording extends the same
  broad-bucket risk; changing weekly hours is the forced-precision distractor.
- Remaining risk: some actual coding systems accept multiple levels and recode
  them later; the exhibit should keep saying it is teaching response-route
  strain, not adjudicating occupational coding.

## Specimen 03 - Refrigerated Medicine

- Main risk: a respondent with no refrigerated medicine can answer No even when
  a not-applicable option exists. The label now says "No can hide no medicine."
- Novice walkthrough: the frame separates spoilage, no spoilage, and no
  refrigerated medicine before prediction begins.
- Mechanism decision: the correct answer names a weak inapplicable path, not
  a prior-item problem or medicine-type classification.
- Route decision: details distinguish in-scope no spoilage from out-of-scope no
  refrigerated medicine so No's denominator is explicit.
- Micro-case decision: sump-pump equipment is the near transfer; owner
  advertising is the sequence-overlap distractor.
- Remaining risk: the response set includes a not-applicable option, so readers
  may underestimate why a follow-up after No matters.

## Specimen 04 - Electric Vehicle Type

- Main risk: readers can confuse label ambiguity with boundary blur. The revised
  labels emphasize plug-in, hybrid, gasoline, and everyday electric rules.
- Novice walkthrough: the respondent knows the vehicle but has to decide which
  feature controls classification.
- Mechanism decision: the correct choice says response classes used overlapping
  vehicle features. The ride-hailing neighbor covers lexical ambiguity.
- Route decision: the details now show the sequence: plug-in item first, then
  "another electric vehicle" without naming hybrid directly.
- Micro-case decision: TV-connected devices provide near-transfer boundary blur;
  laptop/notebook is the label-ambiguity distractor.
- Remaining risk: plug-in hybrids can still be hard even when categories are
  named; future copy may need an explicit plug-in-hybrid scenario in the Reveal
  residual-risk card.

## Specimen 05 - Owner Advertising

- Main risk: the phrase "other advertising by the owner" is understandable in
  isolation, but the prior internet-site answer changes whether the same listing
  should count again.
- Novice walkthrough: prediction labels now say distinct owner route, prior
  answer overlaps, or not owner advertising.
- Mechanism decision: the correct choice names the prior internet-site item and
  the next owner-advertising category.
- Route decision: details make the respondent's concrete listing visible, such
  as Zillow or Craigslist posted by the owner.
- Micro-case decision: disaster-reason sequence is the near transfer; utilities
  cost is the broad-bucket distractor.
- Remaining risk: "all routes that helped" may still permit intentional double
  reporting, which belongs in the claim-boundary caution.

## Specimen 06 - Usual Hours

- Main risk: "usual" hides the calculation recipe. Readers may think any
  plausible number is a clean answer unless the recipe problem is foregrounded.
- Novice walkthrough: labels now distinguish one number recoverable, recipe
  unstated, and no usual number.
- Mechanism decision: the correct choice names one usual number from variable
  remembered weeks. Broad-bucket wording is kept separate.
- Route decision: details explicitly list average, most common schedule,
  current schedule, and most-of-period as competing recipes.
- Micro-case decision: variable tips are near-transfer forced precision; main
  reason for not looking for work is a broad-bucket distractor.
- Remaining risk: averaging can be legitimate in some instruments. The specimen
  should not imply "average" is inherently wrong.

## Specimen 07 - Notebook Computer

- Main risk: "notebook" looks like a synonym to some readers and a separate
  product family to others. The old explanation was too compressed.
- Novice walkthrough: the frame now centers portable personal computer use, and
  labels say laptop route visible, notebook meaning shifts, or not a laptop
  computer.
- Mechanism decision: the correct explanation names lower-function,
  Chromebook-like, and tablet-like readings.
- Route decision: details distinguish knowing the household device from mapping
  it through the intended label.
- Micro-case decision: gateway/modem/router extends label ambiguity; smart-TV
  devices remain the boundary-blur distractor.
- Remaining risk: Chromebooks and 2-in-1 devices are genuinely borderline for
  some respondents, so the probe should continue to read as exploration.

## Specimen 08 - Kashmiri

- Main risk: broad ethnic categories can look "close enough," while write-in can
  feel unofficial or incomplete. The issue is route architecture, not identity
  legitimacy.
- Novice walkthrough: labels now say specific path visible, broad path competes,
  or specific identity hidden.
- Mechanism decision: the correct choice names broad visible categories
  competing with a specific subgroup identity.
- Route decision: details clarify that the form architecture changes whether
  Kashmiri appears as a normal tick-box or a write-in route.
- Micro-case decision: workplace answer level is the broad-bucket near transfer;
  the Black/African heading is the boundary-blur distractor.
- Remaining risk: this specimen carries design-tradeoff complexity; Reveal must
  keep the comparability and parallel-subgroup cautions visible.

## Specimen 09 - Sump Pump

- Main risk: the item asks about a failure mechanism before establishing that
  the household has the equipment. No can mean no pump, no failure, or no water.
- Novice walkthrough: labels now say pump-failure path clear, No can hide no
  pump, or outside pump-failure cause.
- Mechanism decision: the correct choice names the equipment premise before
  failure, not lexical uncertainty around "sump pump."
- Route decision: details distinguish no equipment from equipment that did not
  fail, preserving the denominator issue.
- Micro-case decision: backup generator is the near transfer; laptop/notebook
  is the label-ambiguity distractor.
- Remaining risk: users may still read "No sump pump" in the visible response
  options and assume the issue is fully solved; the follow-up-after-No rationale
  needs to stay explicit.

## Specimen 10 - Ethnic-Group Heading

- Main risk: respondents scan by different cues: Black, African, White African,
  or familiar combined phrases. The issue is not simply "bad heading wording."
- Novice walkthrough: labels now say heading cue works, heading cues compete,
  or wrong section cue.
- Mechanism decision: the correct choice names colour and geographic cues that
  make several sections partly right.
- Route decision: details explain that heading order controls navigation before
  the respondent reaches the box.
- Micro-case decision: TV-connected devices extend boundary blur; Kashmiri
  write-in architecture is the broad-bucket distractor.
- Remaining risk: terminology choices are culturally and nationally specific;
  the source remains authoritative for the ONS context.

## Specimen 11 - Avoid Natural Disasters

- Main risk: the item text may be clear alone, but a yes/no reason series can
  make Yes feel like a primary-reason answer.
- Novice walkthrough: labels now distinguish any influence, Yes feels primary,
  and no disaster influence.
- Mechanism decision: the correct choice names the reason series and secondary
  motives, not the meaning of natural disaster.
- Route decision: details name the respondent's competing motives and the
  any-influence versus main-reason split.
- Micro-case decision: owner advertising is near-transfer sequence overlap;
  weeks worked is the forced-precision distractor.
- Remaining risk: "any influence" can be interpreted very broadly; future copy
  may need a stronger caution about intentional multi-select behavior.

## Specimen 12 - ACS Weeks Worked

- Main risk: respondents may remember enough to estimate but not enough to give
  exact calendar weeks. Days-divided-by-five is especially tempting and wrong
  under the partial-week rule.
- Novice walkthrough: labels now say week count recoverable, count recipe
  unstable, or wrong counting rule.
- Mechanism decision: the correct choice names exact-looking counts from
  irregular work histories.
- Route decision: details list calendar-week counts, month conversion,
  day-division, and rounding as competing recipes.
- Micro-case decision: variable arrival time is near-transfer forced precision;
  sump pump is the false-premise distractor.
- Remaining risk: the widget cannot fully repair proxy knowledge, multiple jobs,
  or paid-leave interpretation; those remain Reveal risks.

## 2026-05-06 Novice-Language Audit

This pass treated the target reader as a motivated novice without
survey-methods vocabulary. The audit used the user's report of confusion plus
plain-language guidance from Digital.gov, GOV.UK, and WCAG 2.2 on defining
unusual words and giving clear labels or instructions.

Confusing terms found:

- The hero led with the project name, "Response Option Fit Lab," before saying
  what the page was about. The old deck, "The answer is real. The route is
  wrong.", used "answer," "real," "route," and "wrong" before the reader had a
  topic.
- The top catalog used "Pattern Catalog," "response-fit patterns," "labels,"
  and "Workbench" before explaining why recurring answer-choice problems were
  the organizing unit.
- The standalone primer introduced "prediction," "workbench," "item," "answer
  path," "respondent scenario," "specimen," "source-bounded," "probe," "route
  break," "vignette," and "manifest" faster than a new reader could use them.
- The worked examples repeatedly compressed ordinary tasks into project-local
  terms: "route," "path," "construct," "mechanism," "bucket," "source receipt,"
  and "micro-cases."

Locked user choices and implementation decisions:

- Keep the project name as secondary identity, but lead the page with the
  literal title "When survey answer choices don't match real answers."
- Replace the old hero deck with a concrete explanation: a person can know their
  answer, while the available answer choices can still push it into the wrong
  place.
- Rename the top catalog to "Six recurring answer-choice problems" and explain
  that a pattern is a recurring kind of mismatch before showing method labels.
- Remove the large standalone primer from the main flow. Help now appears
  inside Frame, Predict, Diagnose, Probe, Reveal, and Quick Practice sections.
- Keep internal component/type names such as `Workbench`, `Specimen`, and
  `vignettes` where they are implementation details; the visible UI uses
  "worked example," "example," and "scenario."

Copy rules for future waves:

- Do not introduce an internal term before the page says the plain task it
  supports.
- Prefer "highlighted answer choice," "answer decision," "recorded answer," or
  "place for the answer" over "route," "path," or "target path."
- Prefer "what the survey wanted to measure" over "intended construct."
- Prefer "what the person knows" over "respondent reality."
- Prefer "where the answer choice stops fitting" over "route break."
- Prefer "based only on the cited report" or "report-based" over
  "source-bounded."
- Prefer "source details" over "source receipt" or "manifest."
- Prefer "try one wording change" over "probe," and state that wording changes
  are exploratory and not validated.
- Prefer "wording feature that caused the problem" over "mechanism."
- Prefer "quick practice" over "micro-cases."

Example-anchor checks applied:

- Ride-hailing must distinguish paid taxi/app ride, taxi-only readings,
  app-ride readings, shared-ride readings, and informal carpool readings.
- Business/industry must show how one employer field can invite establishment
  type, broad industry, product/service, job title, or employer name.
- Refrigerated medicine and sump pump must make clear that No can hide
  inapplicable households, not only a substantive "No event" answer.
- Electric vehicle must surface plug-in status, hybrid status, gas-plus-battery
  status, and everyday "electric" language.
- Owner advertising and natural-disaster examples must say the earlier question
  sequence changes what the next Yes answer feels allowed to mean.
- Usual hours and weeks worked must show that a single number can hide average,
  most-common, recent-week, conversion, rounding, or guessing rules.
- Notebook, Kashmiri, and ethnic-heading examples must keep ordinary user cues
  visible before naming the pattern label.

Test observations from this wave:

- `npm run build` failed earlier in the wave after a bulk wording replacement
  touched TypeScript identifiers; those identifiers were restored and the build
  now passes.
- Existing Playwright expectations were stale: they expected the old title,
  old prediction labels, old outcome labels, and a standalone `HowToRead`
  section. The test plan now needs guards for the new hero, the removed primer,
  the new pattern title, and the exploratory wording-change warning.
- Desktop and mobile layout checks need to stay in the focused smoke suite
  because expanded prose can easily push the first catalog hint below the first
  viewport or create horizontal overflow.

## 2026-05-06 Sequence-of-Encounter Vocabulary Walkthrough

This pass simulates the page from each persona's first scroll downward, marking
where a recurring word lands cold (no prior definition) and where the reader
must hold two terms at once to interpret a third. The aim is to catch terms
that "look fine in a sentence" but trip a first-time reader who has not yet
built up the page's local vocabulary.

### Personas Used (richer set than the prior pass)

- **N1 - Survey-naive general reader.** Speaks ordinary English, has filled
  out forms, has never heard the words *construct*, *cognitive testing*,
  *bucket*, *taxonomy*, *vignette*, *recipe* (in a counting sense), or
  *aggregation*. Reads top-down and assumes consecutive lines are connected.
- **N2 - Hiring evaluator (analyst-adjacent, the actual target reader).**
  Knows *measurement*, *survey*, *bias*, *classification*; fluent in product
  English. May not have read survey-methods literature. Skim-reads first.
  Will reward concrete, will punish vague.
- **N3 - Survey-methods professional.** Knows *construct*, *cognitive testing*,
  *probe*, *vignette*, *response option*, the QAS-99 vocabulary. Risk:
  over-reads pattern names from prior literature; may guess outcomes from
  the label without actually re-reading the case.
- **N4 - ESL/LEP reader (B2 English).** Reads vocabulary, struggles with
  idioms, compressed noun phrases, and uncommon collocations like *misfit*,
  *recipe*, *hunch*, *spell* (of work).
- **N5 - Fast scanner.** Reads only headings, eyebrows, button labels, and
  the highlighted-target block. Skips lede paragraphs unless they look short.
  Predicts before reading rationales.
- **N6 - Edge-case respondent proxy.** Imagines themselves as the survey
  respondent, not as the page reader. Asks "what would I personally pick?"
  before asking "what does this teach?".

### What Each Persona Sees First (Hero through first Specimen)

#### Hero block

- Eyebrow "Editorial exhibit / Census + ONS questionnaire-testing review".
  - N1, N4: stop on "ONS" (undefined acronym). The next paragraph spells out
    "Office for National Statistics," but the eyebrow lands cold.
  - N5: skips entirely; sees only the H1.
  - **Verdict:** acceptable - resolved within five lines - but the abbreviation
    ordering could be flipped.
- Title "When survey answer choices don't match real answers."
  - All personas: clear.
- Subtitle "A person can know their answer, but the available survey choices
  can still push that answer into the wrong place."
  - All personas: clear. The metaphor "push into the wrong place" works.
- Body paragraph: clear; defines "questionnaire-testing examples" and names
  both agencies. Good.
- Scope receipt strip:
  - "12 examples / 6 problem types / 0 survey scores / 0 generated rewrites"
    - "no AI output, no model in the loop"
    - N1, N4: "model in the loop" is a phrase from ML/agent literature. A
      novice may parse "model" as either AI model or statistical model and
      not know which. Better: "no AI output, no model behind the page."

#### Pattern catalog ("Six recurring answer-choice problems")

- Lede defines "pattern" inline. Good.
- Card layout: number, **patternLabel**, italic *canonicalSubtitle*, body
  sentence (`prerequisiteVocab`).
  - N1 reading the first card: sees `Label ambiguity`, then the italic
    canonicalSubtitle (now "Same words, several meanings" — earlier
    versions used the Latin-rooted "Lexical ambiguity," which N1 had
    flagged as more technical than the label being subtitled), then a
    plain-English body sentence that no longer relies on the bare term
    "label" but instead names "the wording of a single answer choice."
    The earlier three-definitions-in-a-row regression is resolved.
  - N2 reading "Broad bucket": "bucket" is data-engineering/programming
    metaphor. The italic "One answer field covers too much" rescues the
    metaphor. Acceptable.
  - N3: comfortable with all six. Risk is over-reading.
  - N4: "Forced precision" is two abstract Latin-rooted nouns next to each
    other. The italic "One exact answer required" rescues it.

#### Reference shelf glossary

- Title "Six ways answer choices can misfit real situations."
  - N1, N4: "misfit" used as a verb ("misfit X") is uncommon. A noun reading
    ("a misfit") is more familiar. Better: "miss," "fail to match," or
    "do not fit."
- Glossary cards repeat the patternLabel + italic canonicalSubtitle pattern
  and add a body sentence. Carries the same Lexical-ambiguity issue.

#### First Workbench (Frame beat)

- Eyebrow "Example 01 / Label ambiguity" - clear.
- Title and subtitle - example-specific, plain.
- "Tested wording" eyebrow + the survey wording in a quote block.
  - N1, N5: "Tested wording" can read as either "wording the survey put
    through testing" or "wording you should test now." The blockquote
    immediately below disambiguates. Acceptable. If we later see complaints,
    consider "Wording the survey used."
- "Survey question and answer choices" heading + prompt + bullet context +
  full response options list with the highlighted target marked. Good.
- "Highlighted response option" / "Highlighted answer choice" / "Highlighted
  answer choices" / "Highlighted device label" / etc.
  - N5 (fast scanner) compares specimens and notices the label varies. This
    is real noise without payoff. **Fix:** standardize to a small fixed
    set: `Highlighted answer choice`, `Highlighted answer field`,
    `Highlighted section heading`, `Highlighted answer choice in the series`.
- "Source context note" details summary.
  - N1: "context note" reads as "note about context," but the inside is
    actually a clarification about what part of the source we are using.
    Better summary label: "Background from the source."
- Right rail: "What the survey wanted to measure," "What the person knows,"
  "Problem type in plain language," "Source details."
  - "What the survey wanted to measure" is good. Several `intendedConstruct`
    bodies under it are too dense:
    - EV: "Vehicle technology type." - N1, N4 may not parse "vehicle
      technology type" as a meaningful phrase.
    - Owner ad: "Housing-search source." - N1, N4: terse; "source" without
      verb context.
    - ACS weeks: "Annual work-duration reporting without exactness that
      irregular work histories cannot support." - N1, N4 parse fail.
    - Ethnic heading: "A heading that lets respondents find the right
      boxes without resolving a race-versus-geography conflict." - N1
      manages but it is a double-negative construction.

#### Predict beat

- Eyebrow "Step 1 / Make a judgment." Clear.
- Title "For each scenario, choose what the highlighted answer choice would
  do." Acceptable but slightly abstract; "would do" is vague.
- Lede: tasks `taskPrompt` + "After that, choose the wording feature that
  caused the problem."
  - N1, N4: "wording feature" is project-local. A novice may parse
    "feature" as software feature or as "characteristic of the wording."
    The rescue is the legend chips immediately after, which use plain
    labels. Better lede phrasing: "After that, choose the part of the
    wording that causes the problem."
- Prediction-mini-legend chips: short label + body. Each label is per
  specimen so the reader is meeting fresh shorthand. The body explains.
- Vignette card:
  - Provenance badge `Source-backed finding` / `Authored scenario`. Both
    are intelligible; tooltip explains. Good.
  - Vignette text: third-person mini-stories. Clear.
- Prediction buttons: per-specimen labels.
  - Some EV labels: "Belongs in other-EV item" / "Vehicle boundary
    unclear" / "Belongs elsewhere in sequence." N1 may not catch
    "other-EV item" as a back-reference to the second response option.
- Mechanism fieldset legend: per-specimen prompts that quote the survey
  wording verbatim. Strong. Phrasing varies; some are "Why can [...] send
  similar commuters to different answers?" - acceptable.
- Confidence: Guessing / Hunch / Fairly sure.
  - N4: "Hunch" is colloquial; OK because the alternatives are familiar
    English.

#### Diagnose beat

- Title "Compare your choices with the report-based explanation." Clear.
- Per-vignette: "Report-based answer:" badge + "You said:" badge +
  rationale paragraph. Good.
- "Wording feature check" block:
  - N1: "feature" again here. Better: "Why the wording broke down" or
    "What part of the wording is the issue."
- RouteSnapshot ("Answer choice at a glance / How the answer choice can
  stop fitting"):
  - Stage eyebrows: "What the person knows / Survey label / Where the
    answer choice stops fitting / What the recorded answer can hide."
    - "Survey label" appears for some specimens; "Survey wording" for
      others; "Tested heading" for one. Inconsistent.
    - **Fix:** use `Survey wording` for the second stage everywhere. The
      first stage stays `What the person knows`; the third `Where the
      answer choice stops fitting`; the fourth `What the recorded answer
      can hide`.
- "Compare with a similar problem type" button → neighbor contrast card.
  Good.

#### Method note (collapsed)

- Summary: "Why this example is here." Clear.
- Body: `whyHere` and `whatOmitted` strings.
  - N1, N4 trip on:
    - "broader OUTFLOOD module" (sump pump) - undefined acronym
    - "broader IUS device taxonomy" (notebook) - undefined acronym + Latin
    - "full CPS instrument flow" (business/industry) - "instrument flow"
      reads as factory machinery; CPS undefined here
    - "broader commute taxonomy" (ride-hailing) - "taxonomy" is jargon

#### Probe beat

- Eyebrow "Step 3 / Try one wording change." Clear.
- Title "Explore what your edit might clarify."
  - N1: "your edit" is misleading; the user is choosing among preset
    options and watching scenarios update, not freely editing wording.
    Better: "See how a small wording change affects each scenario."
- Lede: `probePrompt` + "exploratory" + "does not validate replacement
  wording."
  - The phrase "does not validate replacement wording" is enforced by a
    test, so keep verbatim. Add a softer one-line lead so a novice arrives
    at the cautionary clause primed: "This is a sketch, not a tested
    fix..."
- widgetLabel:
  - "Clarifying examples" - vague; better "Examples to add to the wording."
  - "Where to split one answer field" - clear.
  - "Who should answer this question" - clear.
  - "Classification rule" - "rule" is ambiguous; better "Which feature
    classifies the answer."
  - "Question order" - clear.
  - "Reporting window" - "window" is data-analyst metaphor; better
    "Time period to ask about."
- Outcome badges "Under your edit: clearer for this scenario / still
  unclear for this scenario." Plain and good.

#### Reveal beat

- Eyebrow "Step 4 / What the source supports." Clear.
- Title "What the cited report says the revision addressed."
  - "Revision" is moderate jargon (a noun derived from "revise"). N1
    usually knows it. Acceptable; do not flip to "change" universally
    because tests pin the orientation line.
- Cards: "What this revision addresses" / "What still needs testing."
- Counterexample eyebrows: "Iterated wording" (most) and "Partial repair"
  (sump pump).
  - N1, N4: "iterated" is software jargon. Better "Updated wording" or
    "Newer wording." "Partial repair" is OK if the broader frame says
    we are not declaring a fix; but "Partial fix" reads more plainly.
- `revisionDescription` content per specimen is generally fine.

#### Quick practice (microcases)

- Section eyebrow "Quick practice" + title "Try the same idea on two
  short examples." Good.
- Per-case eyebrow: `Practice {n} / Same problem type` or
  `Nearby problem type`. Good.
- Submitted explanation block: "Why this choice fits / Wording feature:
  {label}".
  - "Wording feature:" - same project-local term. Better
    "What about the wording: {label}" so the reader can read the labels
    without a glossary lookup.

### Cross-Cutting Word-Level Risks

Words and phrases that lose their grip on a first encounter and where
they appear:

- **"Lexical ambiguity"** (catalog + glossary subtitle for `label_ambiguity`):
  Latinate; more technical than the label being subtitled. Replace.
- **"Bucket"** (catalog label, microCase wording in some specimens):
  data-engineering metaphor; partly rescued by the canonical subtitle.
  Keep as label, but never use as the only definition.
- **"Construct"** (internal type names + brief copy in glossary): visible
  rendered string is "What the survey wanted to measure," which is
  already the plain-language replacement. Internal `intendedConstruct`
  field is fine.
- **"Recipe"** (usual hours, weeks worked predictionCopy and rationales):
  metaphor; ambiguous to N4 between cooking sense and method sense. Keep
  but pair with "method" or "rule" the first time it appears.
- **"Recoverable"** (usual hours and weeks worked predictionCopy): data-
  engineering jargon. Replace with "can fit" or "can be given."
- **"Aggregation strain"** (usual hours subtitle): analyst phrase. Replace.
- **"Misfit"** as verb (glossary title): unusual. Replace.
- **"Iterated"** (counterexample eyebrows): jargon. Replace.
- **"Mechanism"** in copy: already swept; visible UI now uses "wording
  feature." Next sweep replaces "wording feature" with "part of the
  wording" in lede and explanation labels.
- **"Establishment"** (business/industry bucket items): survey-methods
  jargon. Pair with "type of workplace" the first time.
- **"Response set"** (refrigerated medicine, sump pump targetText): jargon.
  Replace with "answer choices."
- **"Eligibility screener"** (FilterPathToggle widget label, microcase
  feature choices): keep, because shorter alternatives lose specificity,
  but make sure the UI never relies on the term alone - the checkbox
  body should also describe the function.
- **"OUTFLOOD / OUTMED / RMOVHS / WMDISAS / IUS / CPS / AHS"** in
  `methodNote.whatOmitted` and `sourcePageRef`: these acronyms are fine
  when displayed inside source-detail blocks (where they cite section
  codes) but should not appear in the prose narrating "what the example
  leaves out" without decoding.

### Pattern-by-Pattern Boundary Audit

Goal: make sure (a) the pattern's plain definition is sharp, (b) each
specimen's vignettes cover the meaningful edges, and (c) the microcase
distractor draws the right contrast.

#### Label ambiguity (Specimens 01 ride-hailing, 07 notebook)

- Plain definition: "The wording of a single answer choice can be read in
  more than one everyday way."
- Specimen 01 vignettes cover: app-ride understanding, taxi-only reading,
  shared-ride reading, Lyft user, neighbor carpool. Edges: covered (×2),
  ambiguous (×2), not_covered (×1). Good distribution.
- Specimen 07 vignettes cover: lower-function, Chromebook, tablet, plain
  laptop, tablet-only. Good distribution.
- Boundary against `category_boundary_blur`: the *word* is the issue, not
  the *line between categories*. Mechanism distractor in 01 explicitly
  rules out vehicle-class boundary. Good.
- Boundary against `false_premise`: distractor in 01 explicitly rules out
  "assumes every respondent used a taxi or app ride." Good.
- **Coverage gap noted but acceptable:** neither specimen has a vignette
  where the label is so fully clear that "covered" requires no reading.
  The Lyft-work vignette in 01 and the conventional-laptop vignette in
  07 fill this role. OK.

#### Broad bucket (02 business/industry, 08 Kashmiri)

- Plain definition: "A single answer space — a write-in box or one tick-box
  — accepts responses at very different scopes, so unlike answers can all
  look acceptable."
- Specimen 02 vignettes cover: hospital/health-care (level conflict),
  food delivery (service line vs business), grocery store (right level),
  cashier (occupation level), business name (employer level). Good
  range; edges: ambiguous (×2), covered (×1), not_covered (×2).
- Specimen 08 sits awkwardly under broad_bucket. The "bucket" here is
  the architecture (visible boxes vs. write-in) rather than one wide
  text field. The general definition still fits ("the broader visible
  level absorbs the more specific identity"), but a careful reader
  may notice the structural difference.
  - **Pedagogical fix:** the existing `mechanismQuestion.choices[0]`
    explicitly says "made a broad visible category compete with a
    specific subgroup identity," which is the right framing. Keep, but
    consider adding one sentence to the Frame metadata that names the
    level-vs-architecture distinction.

#### False premise (03 refrigerated medicine, 09 sump pump)

- Plain definition: "The yes/no answer choices let No absorb a household
  the question never applied to."
- Specimen 03: the response set already includes "No refrigerated
  medicine," so this is a partially-mitigated false premise. The
  specimen documents that some respondents still said "No" instead of
  using the not-applicable option, and the report recommended a follow-
  up. The mechanism question makes this explicit ("competed with a
  weakly visible not-applicable option").
  - **Pedagogical fix:** none needed; the specimen now reads as "even
    with a not-applicable option, a yes/no path can still pull people
    in."
- Specimen 09 (sump pump): cleaner false premise; "No sump pump" option
  exists but the proposed follow-up was not adopted, and the prompt
  begins "did water collect because your sump pump stopped working,"
  which presupposes the equipment.
- Both specimens have only one "ambiguous" vignette and several
  "covered/not_covered" vignettes. That distribution is fine because the
  failure mode for false premise is concentrated in one node (the
  applicability path).

#### Category boundary blur (04 EV, 10 ethnic heading)

- Plain definition: "Two or more nearby answer choices share enough
  features that the line between them is unclear, even when each word is
  understood."
- Specimen 04 vignettes cover: plug-ins-are-hybrids, hybrid-doesn't-plug,
  electric-means-plug-in, battery-only, plug-in hybrid, non-plug hybrid.
  Six vignettes; covers the meaningful boundary cases. Good.
- Specimen 10 vignettes cover: expected-Black-African, looking-for-Black,
  White African, multiple ticks, Black British clean. Good.
- Boundary against label_ambiguity: distractor in 04 (`notebook` device)
  is exactly the right contrast. Good.

#### Sequence overlap (05 owner ad, 11 disasters)

- Plain definition: "An earlier question or item changes how the next
  answer choice is read."
- Specimen 05: prior internet-site item changes owner-advertising. Five
  vignettes cover Zillow-already, changed-No-to-Yes, yard sign,
  agent-only listing, Craigslist-by-owner. Good coverage.
- Specimen 11: a *series* of yes/no reasons primes a primary-reason
  reading. Six vignettes cover small-factor, part-of-reason, forced-
  yes, primary-only, primary-clean, no-influence. Good.
- The two specimens demonstrate two distinct shapes of sequence effect
  (one-prior-item and series-of-items). The neighbor contrasts make
  this clear.

#### Forced precision (06 hours, 12 weeks)

- Plain definition: "A single survey question asks for one exact-looking
  answer about a situation that varies or is hard to count exactly."
- Specimen 06 vignettes cover: more-of-an-average, ninety-percent
  reasoning, variable averaging, stable forty, no usual week. Good.
- Specimen 12 vignettes cover: not-exactly, rounded guess, days-divided-
  by-five, full-year stable. Only four vignettes. Could add one for a
  partial-week scenario (the partial-week instruction is exactly the
  proposed fix). Optional improvement; current coverage is acceptable.

### Microcase Distractor Map (kept consistent)

| Specimen | Near-transfer | Distractor pattern |
| --- | --- | --- |
| 01 ride-hailing | label_ambiguity (delivery app) | category_boundary_blur (micromobility) |
| 02 business/industry | broad_bucket (gig company/line of work) | forced_precision (variable hours) |
| 03 refrigerated medicine | false_premise (sump pump) | sequence_overlap (rental app/owner) |
| 04 EV | category_boundary_blur (smart TV) | label_ambiguity (laptop/notebook) |
| 05 owner ad | sequence_overlap (disaster reasons) | broad_bucket (utilities cost) |
| 06 usual hours | forced_precision (variable tips) | broad_bucket (main reason) |
| 07 notebook | label_ambiguity (gateway/modem/router) | category_boundary_blur (smart TV) |
| 08 Kashmiri | broad_bucket (workplace levels) | category_boundary_blur (Black/African heading) |
| 09 sump pump | false_premise (backup generator) | label_ambiguity (notebook) |
| 10 ethnic heading | category_boundary_blur (smart TV) | broad_bucket (Kashmiri write-in) |
| 11 disasters | sequence_overlap (owner ad) | forced_precision (weeks worked) |
| 12 weeks worked | forced_precision (variable arrival time) | false_premise (sump pump) |

Each pattern appears as a near-transfer at least twice and as a
distractor at least once across the 12 specimens. Every adjacent pair
in the microcase distractor map is also represented somewhere as a
near-transfer, so the discrimination is reciprocal.

### Implementation Decisions for the Vocabulary Wave

- Replace `Lexical ambiguity` canonicalSubtitle with a plain phrase.
  All other canonicalSubtitles are plain; Lexical was the lone holdout.
- Glossary title: `misfit` → `miss`.
- DiagnoseBeat: "Wording feature check" → "Why the wording broke down."
- MicroCaseBeat: "Wording feature: " → "What about the wording: ".
- PredictBeat lede: "wording feature that caused the problem" →
  "part of the wording that causes the problem."
- ProbeBeat title: "Explore what your edit might clarify" →
  "See how a small wording change affects each scenario."
- ProbeBeat lede: keep the existing "does not validate replacement wording"
  exactly (test-anchored), add a softer lead-in about exploration.
- ProbeBeat widgetLabel set:
  - "Clarifying examples" → "Examples to add to the wording"
  - "Classification rule" → "Which feature classifies the answer"
  - "Reporting window" → "Time period to ask about"
- FrameBeat collapsible details summary: "Source context note" →
  "Background from the source."
- RouteSnapshot stage eyebrows for the second stage: standardize to
  `Survey wording` everywhere (was a mix of `Survey label`, `Survey
  wording`, and `Tested heading`).
- Counterexample eyebrows: "Iterated wording" → "Updated wording";
  "Partial repair" → "Partial fix."
- targetLabel standardization to a small fixed set (response_option →
  "Highlighted answer choice"; text_field/numeric_field → "Highlighted
  answer field"; heading → "Highlighted section heading"; yes_no_path →
  "Highlighted answer choices"; sequence_item → "Highlighted answer
  choice in the series").
- Specimen-specific copy:
  - 04 EV `intendedConstruct`: "Vehicle technology type." →
    "What technology the vehicle uses (battery only, gasoline, or both)."
  - 05 owner ad `intendedConstruct`: "Housing-search source." →
    "How the person found the home."
  - 12 weeks worked `intendedConstruct`: "Annual work-duration reporting
    without exactness that irregular work histories cannot support." →
    "How many calendar weeks the person worked over the past year."
  - 10 heading `intendedConstruct`: rephrase to drop double-negative.
  - 06 hours subtitle "aggregation strain" → plain phrasing.
  - 06 hours predictionCopy: "One number recoverable" →
    "One number can fit"; "No usual number" stays.
  - 12 weeks predictionCopy: "Week count recoverable" →
    "Week count can be given"; "Count recipe unstable" → "Count method
    unclear"; "Wrong counting rule" → "Wrong counting method."
  - 03 refrigerated and 09 sump-pump `targetText`:
    "...response set" → "...answer choices."
  - methodNote `whatOmitted` decoders: expand OUTFLOOD/IUS/CPS/AHS in
    prose. Keep the section codes only inside `sourcePageRef` strings.
- Hero scope receipt: "no AI output, no model in the loop" → "no AI
  output, no model behind the page" (clarifies "model").

### Risks Held Over for a Future Wave

- "Tested wording" remains; if user testing surfaces confusion, switch
  to "Wording the survey used" everywhere and update the test guards.
- "Hunch" stays; ESL replacement candidates ("guess feeling," "lean")
  cost more than they save.
- "Recipe" stays in usual-hours/weeks-worked but is paired with "method"
  on first encounter.
- "Bucket" remains the catalog label because the project's identifier
  vocabulary uses it consistently; the canonical subtitle and prereq
  vocab paragraph carry the meaning.
- The Kashmiri specimen's "broad bucket via answer architecture vs.
  one-field broad bucket" distinction is documented in this audit but
  not surfaced in the UI; surface it if a future test pass shows users
  conflating Specimen 02 and Specimen 08.
- Adding more vignettes per specimen risks bloat; the current 4-6 per
  specimen plus 2 microcases gives ~70 judgment calls across the page,
  which is already at the edge of the pacing budget.
- The Reveal beat's title and cards still use "revision," which is mild
  jargon; left as-is because it is anchored by tests and because the
  surrounding context resolves it. If a future wave widens the scope of
  test rewrites, switch to "change."

### How to Use This Audit Going Forward

When updating copy, run a sequence-of-encounter pass: for each new term
introduced anywhere on the page, confirm that the immediately preceding
prose either defines the term, gives a concrete example, or pairs it
with a familiar synonym. The page is novice-readable to the extent that
no reader has to hold an undefined term in working memory while reading
the next line.
