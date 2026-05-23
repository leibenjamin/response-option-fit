import { useState } from "react";
import { mixedReviewItems } from "../data/field-guide";
import { workbenchSpecimens } from "../data/workbench-specimens";
import { patternMeta } from "../lib/pattern-meta";
import { Capstone } from "./Capstone";
import { ExitArtifact } from "./ExitArtifact";
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
            ? "You've solved all twelve."
            : isEmpty
            ? "Twelve examples are waiting."
            : "End of the walk."}
        </h1>
        <p className="completion-lede">
          {allVisited ? (
            <>
              You've worked through every example — twelve answer-choice traps,
              now rebuilt as twelve interactive puzzles. The next read is the
              field guide, where the moves turn into reusable checks and
              prompts for your own survey drafts.
            </>
          ) : isEmpty ? (
            <>
              You haven't started the walk yet. The exhibit threads twelve
              interactive puzzles through six recurring answer-choice
              problems, one puzzle at a time, with a compact map drawer that
              fills in as you go. The first puzzle is one click away.
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

      <Capstone />

      <section
        className="completion-review"
        aria-labelledby="completion-review-title"
        data-testid="completion-mixed-review"
      >
        <header className="completion-review-head">
          <p className="completion-review-eyebrow">More practice · remix board</p>
          <h2 id="completion-review-title">Tell the close routes apart</h2>
          <p>
            A different drill: these compact contrasts test whether you can
            separate the patterns that look alike. The point is the distinction,
            not a saved score.
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

      <ExitArtifact isEmpty={isEmpty} firstSpecimenId={firstSpecimenId} />
    </main>
  );
}
