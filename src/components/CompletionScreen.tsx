import { workbenchSpecimens } from "../data/workbench-specimens";
import { routeToHash } from "../lib/routes";
import { PatternCatalog } from "./PatternCatalog";

type Props = {
  visited: ReadonlySet<string>;
};

/* End-of-walk completion screen. Lives at #walk/done. Renders the full
   knowledge map with everything filled in and points the visitor toward
   the reference shelf and the colophon as the natural next reads. */
export function CompletionScreen({ visited }: Props) {
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
              You've worked through every example. The same five-beat shell —
              Frame, Predict, Diagnose, Probe, Reveal — appeared across all
              six failure patterns. The next two reads are the reference
              shelf and the colophon.
            </>
          ) : isEmpty ? (
            <>
              You haven't started the walk yet. The exhibit threads twelve
              worked examples through six recurring answer-choice problems,
              one example at a time, with a knowledge map that fills in as
              you go. The first example is one click away.
            </>
          ) : (
            <>
              You've reached the wrap-up. You worked through{" "}
              <strong>{visitedCount}</strong> of 12 examples this session.
              The full set is always one click away in the knowledge map
              below, and the reference shelf collects the patterns,
              boundaries, and source citations behind every example.
            </>
          )}
        </p>
      </header>

      <section
        className="completion-map"
        aria-labelledby="completion-map-title"
      >
        <h2 className="completion-map-title" id="completion-map-title">
          What you saw
        </h2>
        <PatternCatalog
          variant="full"
          visited={visited}
          currentSpecimenId={null}
          showHeader={false}
        />
      </section>

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
