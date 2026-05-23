# Interactive Overhaul Audit

## Rationale

The app previously treated public source anchoring as the spine of the
experience: many walk examples rendered as a real instrument, a short finding,
and an optional reveal. That posture was rigorous but not enough of a reason to
use the app instead of reading an article, opening a textbook, or asking a
frontier model for an explanation.

This overhaul changes the product bet. The moat is now interaction: satisfying
micro-decisions, visible ledgers, problem-solving roles, small wins, and
transfer practice. Source rigor remains useful backmatter, but it no longer
drives the primary route.

## Product Principles

- Every walk example must be an interactive puzzle.
- The visitor should do something before the pattern is explained.
- Feedback should show what the data kept, merged, split, dropped, or hid.
- Authored cases are preferred when they make the mechanic clearer or more
  delightful.
- Novelty matters across the sequence. A shared frame is acceptable only when
  the underlying puzzle verb still feels distinct.
- Source notes should be optional unless needed to prevent a misleading claim.
- Old bundle-size or page-length targets are measurement notes, not product
  ceilings. Interaction quality wins over arbitrary limits.
- No scoring, grades, streaks, runtime AI, analytics, uploads, or freeform
  survey inputs.

## Implementation Decisions

- `Workbench` now uses `interactivePuzzleBySpecimenId` for all 12 specimen IDs.
  There is no exposition fallback in the walk path.
- The first-wave shared route-lab bottleneck was replaced by a smaller shared
  shell plus per-example puzzle components. Shared code now handles framing,
  progress, reveal, and optional source details; mechanics live in separate
  modules.
- The active slate replaced the two identity examples with non-identity anchors:
  CPS ASEC reason-for-move catch-alls and NTIA smart-TV / TV-connected-device
  boundary confusion.
- The four existing bespoke puzzles remain, but their source panels are now
  optional details rather than prominent receipts, and each received a second
  pass for stronger visible consequences.
- The hero, featured example, completion copy, source notes, and methodology now
  describe the app as an authored interactive lab.
- Playwright is promoted into the tracked project surface and asserts that every
  route is interactive and no route falls back to exposition.
- Tests now exercise every one of the twelve walk puzzles, not only sampled
  routes.

## Second-Wave Critique And Rationale

- **Discarded assumption:** the app needed source rigor as its trust spine.
  Replacement view: trust comes from honest labeling and optional anchors; user
  interest comes from problem-solving.
- **Discarded assumption:** a shared "route lab" was good enough if every page
  had a different source topic. Replacement view: mechanics must feel different
  across the walk, especially for curious analysts and managers trying a random
  app for novelty.
- **Discarded assumption:** identity examples were needed to preserve pattern
  coverage. Replacement view: broad-bucket and category-boundary lessons can be
  taught with less sensitive, more playful anchors.
- **Kept:** business altitude, medicine gate, owner-advertising leak, and
  usual-hours compression, because each already made the visitor do a distinct
  job.
- **Rejected / replaced:** generic route-lab treatments for ride-hailing, EV
  type, notebook, sump pump, natural disasters, and weeks worked. They worked
  technically but felt too similar and too explanatory.
- **Replacement anchors:** move-reason catch-alls turn broad buckets into
  drawers with hidden write-ins; TV-connected devices turn category boundaries
  into a hidden-rule device board.

## Per-Example Mechanics

1. **Ride-hailing:** route four commutes into or away from one commute option;
   the mode-collision board shows app ride, taxi, informal carpool, and
   bike-share meanings colliding.
2. **Business / industry:** code one answer at several altitudes; the reveal
   shows a mixed-level ledger and the "next coder disagrees" payoff.
3. **Refrigerated medicine:** record three households; add the missing gate.
   The repair copy now explicitly bridges to the later sump-pump denominator
   gate.
4. **Electric vehicle type:** choose the controlling feature rule: plug,
   battery, marketing label, or hybrid identity. Vehicle cards move under the
   chosen rule.
5. **Owner advertising:** record a two-question sequence and close the leak.
   A two-column trace now makes the duplicated or dropped Zillow signal visible.
6. **Usual hours:** flatten volatile weeks into one stored value while a steady
   coworker comparison is visible before the reveal.
7. **Notebook computer:** flip a label-drift deck around laptop, Chromebook,
   detachable tablet, and literal paper notebook cases.
8. **Move reasons:** open catch-all drawers and turn on write-in recoding so
   "wanted cheaper housing" stops being hidden as "Other housing."
9. **Sump pump:** decide the denominator first, then split no flooding, no pump
   failure, and no pump.
10. **TV-connected devices:** choose a hidden boundary rule and watch smart TV,
    Apple TV box, game console, and HDMI laptop cards move.
11. **Natural disasters:** set a reason-strength threshold so any influence,
    contributing reason, and main reason produce different Yes/No results.
12. **Weeks worked:** choose a counting recipe and watch few-hour weeks, PTO,
    gigs, and rounded memory produce exact-looking totals.

## Acceptance Criteria

- `npm run build` succeeds.
- `npm test` succeeds.
- Every `#walk/<id>` route contains `[data-interactive="true"]`.
- No `exposition-<id>` route surface renders in the walk.
- No route exposes text inputs or textareas for survey content.
- Build, field guide, reference, and completion routes remain reachable.
- Desktop sampled routes and all mobile walk routes have no horizontal overflow.
- Forced-colors and reduced-motion modes keep puzzle controls readable.
- Replacement examples render the new IDs and titles; retired identity route
  hashes fall back to the hub.
- Replacement source anchors remain in optional source/backmatter surfaces, not
  primary task copy.

## Residual Risks

- Several new puzzle components still use similar card grids and button rows.
  That is acceptable scaffolding, but future waves should keep looking for more
  tactile or spatial mechanics where the lesson warrants it.
- Old size limits and stale test/doc assumptions should not constrain puzzle
  quality. Measure performance, but do not trim interaction merely to satisfy an
  arbitrary byte ceiling.
- Optional source anchors are still present in many components. That is useful
  context, but future copy should avoid letting those anchors drift back into
  the main value proposition.
- The source shelf is now Census-only for the active slate. Historical local
  research notes still mention the retired ONS identity examples; those notes
  are archival context, not active product direction.
