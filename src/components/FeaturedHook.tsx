import { useState } from "react";
import { workbenchSpecimens } from "../data/workbench-specimens";
import { routeToHash } from "../lib/routes";

type RouteId = "counts" | "doesnt" | "unsure";

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
  counts: "Counts",
  doesnt: "Doesn't count",
  unsure: "Not sure"
};

const cases: FieldCase[] = [
  {
    id: "cant",
    value: "can't",
    detail: "Contraction with apostrophe.",
    notes: {
      counts: "Most editorial styles read a contraction as one written word.",
      doesnt: "Underneath, it is two words bound by an apostrophe.",
      unsure: "The form did not say whether \"word\" means written, spoken, or tokenized."
    }
  },
  {
    id: "new-york",
    value: "New York",
    detail: "Proper noun with a space.",
    notes: {
      counts: "It is one place name even though it has whitespace in it.",
      doesnt: "A naive splitter records two tokens here.",
      unsure: "Place names with spaces are common; the field's rule is silent."
    }
  },
  {
    id: "follow-up",
    value: "follow-up",
    detail: "Hyphenated compound.",
    notes: {
      counts: "Most style guides count a hyphenated compound as a single word.",
      doesnt: "The hyphen is a token boundary in many text processors.",
      unsure: "Editorial style and the machine tokenizer disagree on this one."
    }
  },
  {
    id: "q2-fy26",
    value: "Q2 FY26",
    detail: "Fiscal-period shorthand.",
    notes: {
      counts: "It is one label for a single period — the meaning is unitary.",
      doesnt: "Two tokens by whitespace, and arguably four by character grouping.",
      unsure: "Fiscal shorthand is a field-specific convention the rule never named."
    }
  }
];

type Placements = Record<string, RouteId | undefined>;

const ALL_CASE_IDS = cases.map((c) => c.id);

function tally(placements: Placements) {
  let counts = 0;
  let doesnt = 0;
  let unsure = 0;
  let placed = 0;
  for (const id of ALL_CASE_IDS) {
    const r = placements[id];
    if (!r) continue;
    placed += 1;
    if (r === "counts") counts += 1;
    else if (r === "doesnt") doesnt += 1;
    else unsure += 1;
  }
  return { counts, doesnt, unsure, placed };
}

/* The hub's interactive hook. Sits inside the hero so it's the first
   thing a cold visitor can touch above the fold. Replaces, in order:
   - the earlier corner HeroMiniPuzzle (rideshare, three trips, single
     text reveal),
   - the standalone below-hero OpeningQuestion cold-open
     ("How often do you cook dinner at home?"), and
   - the first FeaturedHook iteration, which routed four trip cases
     into Yes/No against an ACS commute item.

   The current mechanic: a tiny intake contract ("one word only") that
   looks obvious until a real value tries to land in it. The visitor
   places four field values — `can't`, `New York`, `follow-up`, and
   `Q2 FY26` — into Counts / Doesn't count / Not sure. A running ledger
   tallies what the field would record; once any three are placed, a
   pattern-name reveal labels what the visitor just experienced (label
   ambiguity) and bridges into the first full worked example, which
   shows the same shape at higher stakes inside a real Census commute
   item.

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

  const firstSpecimenId = workbenchSpecimens[0]?.id ?? "";

  const place = (caseId: string, route: RouteId) => {
    setPlacements((prev) => ({ ...prev, [caseId]: route }));
  };

  const reset = () => setPlacements({});

  const { counts, doesnt, unsure, placed } = tally(placements);
  const allPlaced = placed === ALL_CASE_IDS.length;
  const showReveal = placed >= 3;
  const usedUnsure = unsure > 0;
  const usedBoth = counts > 0 && doesnt > 0;

  return (
    <aside
      className="featured-hook"
      aria-labelledby="featured-hook-title"
      data-testid="featured-hook"
    >
      <header className="featured-hook-head">
        <p className="featured-hook-eyebrow">Try it · about 30 seconds</p>
        <h2 id="featured-hook-title" className="featured-hook-title">
          A field says &ldquo;one word only.&rdquo; Would this count?
        </h2>
      </header>

      <div
        className="featured-hook-instrument"
        aria-label="The field rule being tested"
      >
        <p className="featured-hook-instrument-label">
          The field's only instruction:
        </p>
        <p className="featured-hook-instrument-text">
          <code className="featured-hook-instrument-rule">one word only</code>
        </p>
        <p className="featured-hook-instrument-options" aria-hidden="true">
          <span className="featured-hook-instrument-pill">Counts</span>
          <span className="featured-hook-instrument-pill">Doesn't</span>
          <span className="featured-hook-instrument-pill">Not sure</span>
        </p>
      </div>

      <ol className="featured-hook-cases" aria-label="Place each value">
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
                aria-label={`Record “${fieldCase.value}” as`}
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
            <strong>{counts}</strong> Counts
          </span>
          <span className="featured-hook-ledger-sep" aria-hidden="true">·</span>
          <span className="featured-hook-ledger-no">
            <strong>{doesnt}</strong> Doesn't
          </span>
          <span className="featured-hook-ledger-sep" aria-hidden="true">·</span>
          <span className="featured-hook-ledger-rest">
            <strong>{unsure}</strong> Not sure
          </span>
          <span className="featured-hook-ledger-sep" aria-hidden="true">·</span>
          <span className="featured-hook-ledger-rest">
            <strong>{ALL_CASE_IDS.length - placed}</strong> not yet placed
          </span>
        </p>
      </div>

      <div
        className="featured-hook-reveal"
        aria-live="polite"
        data-testid="featured-hook-reveal"
      >
        {showReveal && (
          <div className="featured-hook-reveal-inner">
            <p className="featured-hook-reveal-body">
              {allPlaced && usedBoth && usedUnsure
                ? "You used all three columns. That is the field's rule arriving in three different shapes from one reader. Another honest reader would draw the lines somewhere else again."
                : allPlaced && usedBoth
                ? "You committed on every value, but the line you drew between Counts and Doesn't is not the line another careful reader would draw. The field records the column, not the line."
                : usedUnsure
                ? "You flagged at least one value as Not sure. That is the rule failing visibly: “one word only” did not tell you enough to commit."
                : "Three honest readers with the same four values can produce three different recorded counts. The field keeps the count; the rule that produced it stays in the reader's head."}
            </p>
            <p className="featured-hook-reveal-name">
              That gap between the value and the recorded count is{" "}
              <strong>label ambiguity</strong> — &ldquo;one word only&rdquo;
              needs a counting rule before the answer has a clear place to
              go. This is one of six recurring problems the exhibit walks
              through, using twelve worked examples from public
              questionnaire-testing materials.
            </p>
            <div className="featured-hook-reveal-actions">
              <a
                className="cta-button cta-button--primary"
                href="#featured-example"
                data-testid="featured-hook-cta-featured"
              >
                <span>
                  See the same shape in a real Census item
                </span>
                <span aria-hidden="true" className="cta-button-arrow">↓</span>
              </a>
              <a
                className="cta-button cta-button--secondary"
                href={routeToHash({ kind: "walk", slot: firstSpecimenId })}
                data-testid="featured-hook-cta-walk"
              >
                <span>Walk all twelve</span>
                <span aria-hidden="true" className="cta-button-arrow">→</span>
              </a>
              <button
                type="button"
                className="featured-hook-reset"
                onClick={reset}
                data-testid="featured-hook-reset"
              >
                Reset values
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
