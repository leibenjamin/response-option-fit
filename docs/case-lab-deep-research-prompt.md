# Deep Research Prompt: Synthetic-Primary Case Lab Review

Use this prompt with ChatGPT-5.5 Thinking with Extended Thinking or ChatGPT
Deep Research with ChatGPT-5.5 Thinking when additional outside analysis is
worth the time.

```text
You are performing a high-effort content, pedagogy, UX, and evidence-boundary
review of Response Option Fit Lab's synthetic-primary CaseLab redesign.

Do not stop early. Do not optimize for brevity. Think through the topic as a
survey-methods educator, a cognitive-science learning designer, a skeptical
source-audit reviewer, an accessibility reviewer, and a first-time learner.
When you find a problem, propose a concrete repair and explain what tradeoff
the repair introduces.

Context:
- The app teaches survey response-option fit problems.
- Example 01 was changed from a source-first ACS ride-hailing walkthrough to a
  synthetic-primary case lab.
- The new synthetic prompt is: "How did you get to the night market today?
  Choose the one option that best describes your main trip."
- The highlighted answer choice is: "Rideshare".
- The intended meaning is: paid app-based car ride, such as Uber or Lyft.
- Nearby meanings tested include carpool, pooled app ride, bike/scooter share,
  taxi, and friend/coworker ride.
- The main interaction is now a guided scenario deck: one active scenario at a
  time, immediate route feedback, repair bench after all scenarios are sorted,
  then a one-card transfer sort using the same judgment buttons.
- The new learner judgments are:
  1. Highlighted choice fits
  2. Highlighted choice is easy to misread
  3. Another choice fits better
- The real ACS ride-hailing source is retained as a collapsed "Real-world
  anchor" with reported quote/finding/stress-case labels.
- Examples 02-12 still use the legacy Frame -> Predict -> Diagnose -> Probe ->
  Reveal -> Quick Practice flow.

Live implementation findings to audit:
- A build passed after the deck conversion.
- The first active judgment initially fell below the target first viewport on
  desktop and mobile, so the layout was compacted by moving case navigation
  below the active card and placing judgment controls before the explanatory
  respondent-reading line.
- Direct hub anchors such as #workbench-01-ride-hailing need post-render
  scrolling because they are not route hashes.
- Provenance labels in CaseLab use visible badge text plus an accessible label,
  not `<abbr>`.
- The source anchor currently uses reported findings plus one
  source-grounded constructed stress case; do not treat the synthetic
  night-market deck as source evidence.

Primary tasks:
1. Red-team the synthetic night-market case. Identify any wording, taxonomy, or
   scenario choices that confuse label ambiguity with category boundary blur,
   broad bucket, false premise, or ordinary "other answer fits better" logic.
2. Evaluate whether "Rideshare" is the best synthetic label. Compare it against
   "Ride-hailing", "App ride", "Ride app", "App-based ride service", and any
   better teaching labels. Recommend the best target label for learning, not
   for fielding a real survey.
3. Evaluate the three judgment labels. They must be understandable to a novice,
   precise about the highlighted answer choice, and useful across future
   migrated examples. Propose replacements if needed.
4. Evaluate the scenario set. Determine whether each scenario has a clear
   pedagogical role: center case, in-scope misread, negative control, scope
   widening risk, or neighboring category. Flag duplicates, missing edges, or
   cases that are too easy.
5. Evaluate the repair bench. It must teach that a repair should clarify the
   intended target without widening scope. Check whether each repair option and
   per-scenario outcome models that accurately.
6. Evaluate the transfer challenge. It should require retrieval and near
   transfer, not rote matching. Propose a stronger transfer item if this one is
   too obvious or jargon-heavy.
7. Evaluate the provenance vocabulary:
   - Teaching case
   - Reported quote
   - Reported finding
   - Source-grounded stress case
   Say whether these are accurate, novice-readable, and sufficiently different
   from "Source-backed finding" / "Authored scenario".
8. Evaluate the source posture. The invented night-market case must not be
   mistaken for a Census finding. The ACS source must remain credible without
   forcing boring source context into the first screen.
9. Evaluate the UX flow on desktop and mobile. The learner should see the
   survey prompt, highlighted answer choice, and active sorting task quickly.
   Identify any repetition, attention drift, text overload, or hidden essential
   context.
10. Evaluate accessibility and interaction design. Check keyboard operation,
    visible labels, source disclosures, button semantics, mobile target size,
    and whether color or layout alone communicates the answer.
11. Compare this CaseLab approach against the legacy five-beat shell. Decide
    which pieces should be generalized across Examples 02-12 and which should
    remain specific to Example 01.
12. Produce an implementation-ready revision plan. Include data-model changes,
    component changes, copy edits, docs updates, tests, and migration order.

Research anchors to consider:
- Questionnaire Appraisal System QAS-99, especially vague response categories,
  overlapping response categories, missing eligible responses, and assumptions.
- Cognitive interviewing and questionnaire pretesting guidance from Census or
  comparable survey-methods sources.
- Worked-example learning, retrieval practice, pretesting/prequestioning,
  active learning/ICAP, guidance fading, seductive-detail/coherence effects,
  and transfer practice.

Output format:
1. Executive diagnosis: top 10 issues, ranked by severity.
2. What is already working.
3. Detailed critique by subsystem: concept, scenarios, labels, repair bench,
   transfer, provenance, source posture, UX, accessibility, docs.
4. Revised copy proposal for Example 01, including every scenario and feedback
   line.
5. Migration rubric for Examples 02-12.
6. Acceptance tests.
7. Open questions that require product judgment rather than research.

Rules:
- Do not treat invented cases as source evidence.
- Do not recommend fielding any replacement wording as validated.
- Do not invent source findings or prevalence estimates.
- Prefer concrete rewrites over vague critique.
- If a claim depends on a source, name the source or mark the claim as an
  inference.
```

## Claude Code Repository Review Variant

Use this prompt with Claude Code or another repo-local coding agent after the
implementation compiles. It is intentionally codebase-specific.

```text
You are auditing the Response Option Fit Lab repository after the Example 01
CaseLab hardening wave. Work from the actual files, not just the prose plan.
Do not make edits unless explicitly asked; first produce a review packet with
findings and concrete patches you would recommend.

Repository context:
- React + TypeScript + Vite static app.
- Example 01 may have `caseLab` data and should render the new guided CaseLab
  shell.
- Examples 02-12 should still render the legacy workbench flow.
- The CaseLab deck should show one active teaching case at a time, gate repair
  until all cases are sorted, gate transfer until the repair bench is reviewed,
  and keep the real source anchor collapsed after the learner has acted.

Audit tasks:
1. Run `npm run build` and record any errors or bundle regressions.
2. Inspect `src/types/workbench.ts`, `src/components/workbench/CaseLab.tsx`,
   `src/data/workbench-specimens.ts`, and `src/index.css` for dead types,
   brittle assumptions, unhandled states, and layout debt.
3. Browser-check `#walk/ride-hailing` at 1440x900 and 390x844. Report the
   first judgment button's top/bottom positions and whether it is visible in
   the first viewport.
4. Browser-check `#workbench-01-ride-hailing`, `#featured-example`,
   `#walk/business-industry`, `#field-guide`, and `#reference`. Verify direct
   element anchors do not break route hashes.
5. Review accessibility semantics: provenance badges, deck navigation,
   judgment buttons, repair buttons, transfer buttons, feedback live regions,
   details summaries, and keyboard order.
6. Red-team the Example 01 content against label ambiguity, category boundary
   blur, broad bucket, false premise, sequence overlap, and forced precision.
7. Check docs for stale claims that all examples are sourced walkthroughs or
   that `Reported quote` includes paraphrased findings.
8. Produce ranked findings with file/line references, then propose the smallest
   safe implementation patch for each issue.

Rules:
- Do not treat invented teaching cases as Census evidence.
- Do not propose validated survey wording.
- Do not migrate Examples 02-12 during this audit.
- Prefer concrete code and copy changes over generic critique.
```
