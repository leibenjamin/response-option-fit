import { useState } from "react";
import { mixedReviewItems } from "../data/field-guide";
import { workbenchSpecimens } from "../data/workbench-specimens";
import { patternMeta } from "../lib/pattern-meta";
import { routeToHash } from "../lib/routes";
import { PatternCatalog } from "./PatternCatalog";

type Props = {
  visited: ReadonlySet<string>;
};

/* End-of-walk completion screen. Lives at #walk/done. Opens with a remix board
   so the route is useful even without saved progress; the full map remains
   available behind a disclosure. */
export function CompletionScreen({ visited }: Props) {
  const [reviewAnswers, setReviewAnswers] = useState<Record<string, string>>({});
  const allVisited =
    visited.size > 0 &&
    workbenchSpecimens.every((specimen) => visited.has(specimen.id));
  const visitedCount = workbenchSpecimens.filter((specimen) =>
    visited.has(specimen.id)
  ).length;
  const firstSpecimenId = workbenchSpecimens[0]?.id ?? "";
  const isEmpty = visitedCount === 0;

  return (
    <main
      id="walk-done"
      className="completion"
      aria-labelledby="completion-title"
      data-testid="completion-screen"
    >
      <header className="completion-head">
        <p className="completion-eyebrow">
          {isEmpty ? "Walk summary" : "End of the walk"}
        </p>
        <h1
          className="completion-title"
          id="completion-title"
          tabIndex={-1}
        >
          {allVisited
            ? "You've finished all twelve."
            : isEmpty
            ? "Twelve examples are waiting."
            : "End of the walk."}
        </h1>
        <p className="completion-lede">
          {allVisited ? (
            <>
              You've worked through every example. The twelve engines each
              used a different reviewer surface, from route maps and timelines
              to premise stacks and counting benches. The next read is the
              field guide, where the patterns turn into reusable checks and
              prompts for your own survey drafts.
            </>
          ) : isEmpty ? (
            <>
              You haven't started the walk yet. The exhibit threads twelve
              worked examples through six recurring answer-choice problems,
              one example at a time, with a compact map drawer that fills in as
              you go. The first engine is one click away.
            </>
          ) : (
            <>
              You've reached the wrap-up. You worked through{" "}
              <strong>{visitedCount}</strong> of 12 examples this session.
              The full set is always one click away in the map drawer below,
              and the field guide turns the patterns into portable
              checks for your own survey drafts.
            </>
          )}
        </p>
      </header>

      <section
        className="completion-review"
        aria-labelledby="completion-review-title"
        data-testid="completion-mixed-review"
      >
        <header className="completion-review-head">
          <p className="completion-review-eyebrow">Remix board</p>
          <h2 id="completion-review-title">Tell the close routes apart</h2>
          <p>
            Use these compact contrasts even if you opened the wrap-up directly.
            The point is the distinction, not a saved score.
          </p>
        </header>
        <div className="completion-review-list">
          {mixedReviewItems.map((item) => {
            const selected = reviewAnswers[item.id] ?? null;
            return (
              <fieldset className="completion-review-card" key={item.id}>
                <legend>{item.prompt}</legend>
                <div className="completion-review-options">
                  {item.options.map((pattern) => (
                    <label className="segmented-radio" key={pattern}>
                      <input
                        type="radio"
                        name={`completion-review-${item.id}`}
                        value={pattern}
                        checked={selected === pattern}
                        onChange={() =>
                          setReviewAnswers((answers) => ({
                            ...answers,
                            [item.id]: pattern
                          }))
                        }
                      />
                      <span>{patternMeta[pattern].label}</span>
                    </label>
                  ))}
                </div>
                {selected && (
                  <p className="completion-review-answer">
                    Route distinction: {item.explanation}
                  </p>
                )}
              </fieldset>
            );
          })}
        </div>
      </section>

      <details className="completion-map">
        <summary className="completion-map-title" id="completion-map-title">
          Pattern map and examples
        </summary>
        <PatternCatalog
          variant="full"
          visited={visited}
          currentSpecimenId={null}
          showHeader={false}
        />
      </details>

      <nav className="completion-actions" aria-label="What to read next">
        {isEmpty ? (
          <a
            className="cta-button cta-button--primary"
            href={routeToHash({ kind: "walk", slot: firstSpecimenId })}
            data-testid="completion-start"
          >
            <span>Start with example 01</span>
            <span aria-hidden="true" className="cta-button-arrow">
              →
            </span>
          </a>
        ) : (
          <a
            className="cta-button cta-button--primary"
            href={routeToHash({ kind: "fieldGuide" })}
            data-testid="completion-field-guide"
          >
            <span>Use the field guide</span>
            <span aria-hidden="true" className="cta-button-arrow">
              →
            </span>
          </a>
        )}
        {!isEmpty && (
          <a
            className="cta-button cta-button--secondary"
            href={routeToHash({ kind: "reference" })}
            data-testid="completion-reference"
          >
            <span>Read the reference shelf</span>
            <span aria-hidden="true" className="cta-button-arrow">
              →
            </span>
          </a>
        )}
        <a
          className="cta-button cta-button--secondary"
          href={routeToHash({ kind: "colophon" })}
          data-testid="completion-colophon"
        >
          <span>Read the colophon</span>
          <span aria-hidden="true" className="cta-button-arrow">
            →
          </span>
        </a>
        <a
          className="cta-button cta-button--ghost"
          href={routeToHash({ kind: "hub" })}
          data-testid="completion-hub"
        >
          <span>Back to the overview</span>
          <span aria-hidden="true" className="cta-button-arrow">
            ↑
          </span>
        </a>
      </nav>
    </main>
  );
}
