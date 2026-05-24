import { useEffect, useRef, useState } from "react";
import { workbenchSpecimens } from "../data/workbench-specimens";
import { routeToHash } from "../lib/routes";

type RouteId = "accept" | "reject" | "rule";

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
  accept: "Accept it",
  reject: "Reject it",
  rule: "Needs a rule"
};

const cases: FieldCase[] = [
  {
    id: "bus",
    value: "bus",
    detail: "One-word commute mode.",
    notes: {
      accept: "Clean center case. You can accept the submitted word, even if the form still does not know which kind of bus.",
      reject: "That makes the rule stricter than the respondent would expect; this is the easiest answer the field can hold.",
      rule: "A rule may still be needed if the survey must split city bus, shuttle, or school bus."
    }
  },
  {
    id: "ride-hailing",
    value: "ride-hailing",
    detail: "Hyphenated service label.",
    notes: {
      accept: "You let a truthful commute answer through, but the instruction never said whether a hyphenated label counts as one word.",
      reject: "The respondent gave a real mode. The punctuation rule, not the answer, is doing the damage.",
      rule: "This needs a public rule for compounds, or better yet a list of answer choices."
    }
  },
  {
    id: "car-pool",
    value: "car pool",
    detail: "Two words for one shared commute.",
    notes: {
      accept: "You preserve the respondent's meaning, but the accepted answer conflicts with the one-word instruction.",
      reject: "You enforce the visible rule and lose a normal commute answer.",
      rule: "The form needs a mode rule, not just a word-count rule."
    }
  },
  {
    id: "bike-share",
    value: "bike share",
    detail: "Two-word name for a rented-bike service.",
    notes: {
      accept: "You catch the truthful answer, but the field now accepts a multiword service label.",
      reject: "The form rejects a legitimate mode because the instruction did not name this edge.",
      rule: "Clarify whether named services count, or give the respondent a response list."
    }
  }
];

type Placements = Record<string, RouteId | undefined>;

const ALL_CASE_IDS = cases.map((c) => c.id);

function tally(placements: Placements) {
  let accepted = 0;
  let rejected = 0;
  let needsRule = 0;
  let decided = 0;
  for (const id of ALL_CASE_IDS) {
    const r = placements[id];
    if (!r) continue;
    decided += 1;
    if (r === "accept") accepted += 1;
    else if (r === "reject") rejected += 1;
    else needsRule += 1;
  }
  return { accepted, rejected, needsRule, decided };
}

/* The hub's interactive hook. Sits inside the hero so it is the first thing a
   cold visitor can touch above the fold.

   The mechanic is a tiny commute-survey intake contract ("one word only") that
   looks obvious until truthful commute answers try to land in it. The visitor
   decides four responses with Accept it / Reject it / Needs a rule. "Accept it"
   is the app user's reviewer decision: can this submitted answer pass under
   the visible instruction? It is not the respondent's act and not a database
   storage term.

   Preserve two design constraints: the visitor is never told they were wrong,
   and the case values should read as specimens of intake data rather than as
   grammar examples. */
export function FeaturedHook() {
  const [placements, setPlacements] = useState<Placements>({});
  const revealRef = useRef<HTMLDivElement | null>(null);

  const firstSpecimenId = workbenchSpecimens[0]?.id ?? "";

  const place = (caseId: string, route: RouteId) => {
    setPlacements((prev) => ({ ...prev, [caseId]: route }));
  };

  const reset = () => setPlacements({});

  const { accepted, rejected, needsRule, decided } = tally(placements);
  const allDecided = decided === ALL_CASE_IDS.length;
  const showReveal = allDecided;
  const usedRule = needsRule > 0;
  const usedAcceptAndReject = accepted > 0 && rejected > 0;

  useEffect(() => {
    if (!allDecided) return;
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
  }, [allDecided]);

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
        aria-label="The survey question and answer instruction being tested"
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
          <span className="featured-hook-instrument-pill">Accepted</span>
          <span className="featured-hook-instrument-pill">Rejected</span>
          <span className="featured-hook-instrument-pill">Needs rule</span>
        </p>
      </div>

      <ol className="featured-hook-cases" aria-label="Decide each response">
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
        <p className="featured-hook-ledger-label">Decisions so far</p>
        <p className="featured-hook-ledger-counts">
          <span className="featured-hook-ledger-yes">
            <strong>{accepted}</strong> Accepted
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
            <strong>{ALL_CASE_IDS.length - decided}</strong> Not decided
          </span>
        </p>
        {!allDecided && (
          <p className="featured-hook-ledger-hint">
            Decide all four responses to open the bridge to the full lab.
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
              {allDecided && usedAcceptAndReject && usedRule
                ? "You used all three outcomes. That is the point: every response can be truthful while the form still has no public rule for accepting it."
                : allDecided && usedAcceptAndReject
                ? "You drew a line between answers the form accepts and answers it rejects. Another careful reviewer could draw that line somewhere else."
                : usedRule
                ? "You made the missing rule visible. The answer is not the problem; the answer instruction is underpowered."
                : "Three honest commute answers can produce different review decisions. The form accepts an answer, but the rule that produced the decision stays in the reviewer's head."}
            </p>
            <p className="featured-hook-reveal-name">
              This is the smallest version of <strong>response-option fit</strong>:
              a truthful answer meets an underspecified answer place. Later
              puzzles swap this one-word field for answer choices, yes/no paths,
              catch-alls, device boundaries, and numeric fields. The problem is
              the same: the form asks for an answer before the acceptance rule
              is clear.
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
