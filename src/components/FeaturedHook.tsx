import { useEffect, useRef, useState } from "react";
import { workbenchSpecimens } from "../data/workbench-specimens";
import { routeToHash } from "../lib/routes";

type RouteId = "store" | "reject" | "rule";

type FieldCase = {
  id: string;
  /* The actual value submitted to the field. Rendered in monospace so the
     card reads as a specimen of intake data, not a grammar-class example. */
  value: string;
  /* A short, neutral descriptor under the value. Sets context without
     telegraphing the answer. */
  detail: string;
  /* The short note that appears under the card after the visitor commits
     to a route. Written so all three routes feel respectable; the demo is
     never a quiz. */
  notes: Record<RouteId, string>;
};

const ROUTE_LABELS: Record<RouteId, string> = {
  store: "Store it",
  reject: "Reject it",
  rule: "Needs a rule"
};

const cases: FieldCase[] = [
  {
    id: "bus",
    value: "bus",
    detail: "One-word commute mode.",
    notes: {
      store: "Clean center case. The form can store the word, even if it still does not know which kind of bus.",
      reject: "That makes the rule stricter than the respondent would expect; this is the easiest answer the field can hold.",
      rule: "A rule may still be needed if the survey must split city bus, shuttle, or school bus."
    }
  },
  {
    id: "ride-hailing",
    value: "ride-hailing",
    detail: "Hyphenated service label.",
    notes: {
      store: "You keep a truthful commute answer, but the form never said whether a hyphenated label counts as one word.",
      reject: "The respondent gave a real mode. The punctuation rule, not the answer, is doing the damage.",
      rule: "This needs a public rule for compounds, or better yet a list of answer choices."
    }
  },
  {
    id: "car-pool",
    value: "car pool",
    detail: "Two words for one shared commute.",
    notes: {
      store: "You preserve the respondent's meaning, but the stored answer breaks the one-word instruction.",
      reject: "You enforce the visible rule and lose a normal commute answer.",
      rule: "The form needs a mode rule, not just a word-count rule."
    }
  },
  {
    id: "bike-share",
    value: "bike share",
    detail: "Two-word name for a rented-bike service.",
    notes: {
      store: "You catch the truthful answer, but the field now holds a multiword service label.",
      reject: "The form rejects a legitimate mode because the instruction did not name this edge.",
      rule: "Clarify whether named services count, or give the respondent a response list."
    }
  }
];

type Placements = Record<string, RouteId | undefined>;

const ALL_CASE_IDS = cases.map((c) => c.id);

function tally(placements: Placements) {
  let stored = 0;
  let rejected = 0;
  let needsRule = 0;
  let placed = 0;
  for (const id of ALL_CASE_IDS) {
    const r = placements[id];
    if (!r) continue;
    placed += 1;
    if (r === "store") stored += 1;
    else if (r === "reject") rejected += 1;
    else needsRule += 1;
  }
  return { stored, rejected, needsRule, placed };
}

/* The hub's interactive hook. Sits inside the hero so it's the first
   thing a cold visitor can touch above the fold. Replaces, in order:
   - the earlier corner HeroMiniPuzzle (rideshare, three trips, single
     text reveal),
   - the standalone below-hero OpeningQuestion cold-open
     ("How often do you cook dinner at home?"), and
   - the first FeaturedHook iteration, which routed four trip cases
     into Yes/No against an ACS commute item.

   The current mechanic: a tiny commute-survey intake contract ("one word
   only") that looks obvious until truthful commute answers try to land in it.
   The visitor places four responses — `bus`, `ride-hailing`, `car pool`, and
   `bike share` — into Store it / Reject it / Needs a rule. A running ledger
   shows what the form would keep, and the reveal bridges from this small
   one-word field into the twelve richer response-option puzzles.

   Two design constraints worth preserving across future waves:

   1. The visitor is never told they were wrong. All three routes carry
      respectful notes. The reveal does not score the visitor's reading
      against any "correct" reading — the whole point is that the rule
      was never stated.
   2. The case values read as specimens of intake data, not grammar
      examples. Monospace styling and short editorial descriptors hold
      that posture; if a future wave changes the topic, keep the
      "field value, status label, or interface object" framing so the
      hook does not slip back into cute semantics. See
      docs/design-passes/2026-05-20-hook-topic-v2-chatgpt-research.md
      for the full brainstorm and the constraint local research-5.5 added on
      the third refinement turn. */
export function FeaturedHook() {
  const [placements, setPlacements] = useState<Placements>({});
  const revealRef = useRef<HTMLDivElement | null>(null);

  const firstSpecimenId = workbenchSpecimens[0]?.id ?? "";

  const place = (caseId: string, route: RouteId) => {
    setPlacements((prev) => ({ ...prev, [caseId]: route }));
  };

  const reset = () => setPlacements({});

  const { stored, rejected, needsRule, placed } = tally(placements);
  const allPlaced = placed === ALL_CASE_IDS.length;
  const showReveal = allPlaced;
  const usedRule = needsRule > 0;
  const usedStoreAndReject = stored > 0 && rejected > 0;

  useEffect(() => {
    if (!allPlaced) return;
    const node = revealRef.current;
    if (!node) return;

    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const frame = window.requestAnimationFrame(() => {
      node.scrollIntoView({
        block: "nearest",
        behavior: reduceMotion ? "auto" : "smooth"
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [allPlaced]);

  return (
    <aside
      className="featured-hook"
      aria-labelledby="featured-hook-title"
      data-testid="featured-hook"
    >
      <header className="featured-hook-head">
        <p className="featured-hook-eyebrow">Try it · about 30 seconds</p>
        <h2 id="featured-hook-title" className="featured-hook-title">
          A survey asks for one word. Four honest answers arrive.
        </h2>
      </header>

      <div
        className="featured-hook-instrument"
        aria-label="The survey question and storage rule being tested"
      >
        <p className="featured-hook-instrument-label">
          The survey asks:
        </p>
        <p className="featured-hook-instrument-text">
          In one word, what was your usual way to get to work last week?
        </p>
        <p className="featured-hook-instrument-label">
          The form's only instruction:
        </p>
        <p className="featured-hook-instrument-text">
          <code className="featured-hook-instrument-rule">one word only</code>
        </p>
        <p className="featured-hook-instrument-options" aria-hidden="true">
          <span className="featured-hook-instrument-pill">Stored</span>
          <span className="featured-hook-instrument-pill">Rejected</span>
          <span className="featured-hook-instrument-pill">Needs rule</span>
        </p>
      </div>

      <ol className="featured-hook-cases" aria-label="Place each response">
        {cases.map((fieldCase, index) => {
          const chosen = placements[fieldCase.id];
          return (
            <li
              key={fieldCase.id}
              className={`featured-hook-case ${chosen ? `is-placed is-placed--${chosen}` : ""}`}
              data-testid={`featured-hook-case-${fieldCase.id}`}
            >
              <p className="featured-hook-case-num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </p>
              <div className="featured-hook-case-body">
                <p className="featured-hook-case-label">
                  <code className="featured-hook-case-value">
                    {fieldCase.value}
                  </code>
                </p>
                <p className="featured-hook-case-detail">
                  {fieldCase.detail}
                </p>
              </div>
              <div
                className="featured-hook-case-routes"
                role="group"
                aria-label={`Decide how the form should handle “${fieldCase.value}”`}
              >
                {(Object.keys(ROUTE_LABELS) as RouteId[]).map((route) => (
                  <button
                    type="button"
                    key={route}
                    className={`featured-hook-route featured-hook-route--${route} ${chosen === route ? "is-chosen" : ""}`}
                    aria-pressed={chosen === route}
                    onClick={() => place(fieldCase.id, route)}
                    data-testid={`featured-hook-route-${fieldCase.id}-${route}`}
                  >
                    {ROUTE_LABELS[route]}
                  </button>
                ))}
              </div>
              {chosen && (
                <p
                  className="featured-hook-case-note"
                  data-testid={`featured-hook-case-note-${fieldCase.id}`}
                >
                  {fieldCase.notes[chosen]}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      <div
        className="featured-hook-ledger"
        aria-live="polite"
        data-testid="featured-hook-ledger"
      >
        <p className="featured-hook-ledger-label">Recorded so far</p>
        <p className="featured-hook-ledger-counts">
          <span className="featured-hook-ledger-yes">
            <strong>{stored}</strong> Stored
          </span>
          <span className="featured-hook-ledger-sep" aria-hidden="true">·</span>
          <span className="featured-hook-ledger-no">
            <strong>{rejected}</strong> Rejected
          </span>
          <span className="featured-hook-ledger-sep" aria-hidden="true">·</span>
          <span className="featured-hook-ledger-rest">
            <strong>{needsRule}</strong> Needs rule
          </span>
          <span className="featured-hook-ledger-sep" aria-hidden="true">·</span>
          <span className="featured-hook-ledger-rest">
            <strong>{ALL_CASE_IDS.length - placed}</strong> Not placed
          </span>
        </p>
        {!allPlaced && (
          <p className="featured-hook-ledger-hint">
            Place all four responses to open the bridge to the full lab.
          </p>
        )}
      </div>

      <div
        className="featured-hook-reveal"
        aria-live="polite"
        data-testid="featured-hook-reveal"
        ref={revealRef}
      >
        {showReveal && (
          <div className="featured-hook-reveal-inner">
            <p className="featured-hook-reveal-body">
              {allPlaced && usedStoreAndReject && usedRule
                ? "You used all three outcomes. That is the point: every response can be truthful, while the form still has no public rule for what it can store."
                : allPlaced && usedStoreAndReject
                ? "You drew a line between answers the form stores and answers it rejects. Another careful reviewer could draw that line somewhere else."
                : usedRule
                ? "You made the missing rule visible. The answer is not the problem; the storage rule is underpowered."
                : "Three honest commute answers can produce different storage decisions. The form keeps the decision, but the rule that produced it stays in the reviewer's head."}
            </p>
            <p className="featured-hook-reveal-name">
              This is the smallest version of <strong>response-option fit</strong>:
              a truthful answer meets an underspecified answer place. Later
              puzzles swap this one-word field for answer choices, yes/no paths,
              catch-alls, device boundaries, and numeric fields. The problem is
              the same: the form stores something before the rule is clear.
            </p>
            <div className="featured-hook-reveal-actions">
              <a
                className="cta-button cta-button--primary"
                href="#featured-example"
                data-testid="featured-hook-cta-featured"
              >
                <span>Try the first puzzle</span>
                <span aria-hidden="true" className="cta-button-arrow">↓</span>
              </a>
              <a
                className="cta-button cta-button--secondary"
                href={routeToHash({ kind: "walk", slot: firstSpecimenId })}
                data-testid="featured-hook-cta-walk"
              >
                <span>Walk all twelve puzzles</span>
                <span aria-hidden="true" className="cta-button-arrow">→</span>
              </a>
              <button
                type="button"
                className="featured-hook-reset"
                onClick={reset}
                data-testid="featured-hook-reset"
              >
                Reset answers
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
