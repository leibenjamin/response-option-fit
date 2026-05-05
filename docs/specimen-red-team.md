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
