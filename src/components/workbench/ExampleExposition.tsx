import { useState } from "react";
import type { WorkbenchSpecimen } from "../../types/workbench";
import { VerbatimQuote } from "./VerbatimQuote";

/* The lightweight walk renderer. Replaces the twelve bespoke "engines" (one
   interaction primitive reskinned twelve times — the exhibit's deepest stale
   debt, retired 2026-05-21). Most examples don't warrant a deep minigame for
   an expert; they warrant a fast, honest look at the real item and a sharp
   statement of what breaks. The genuinely deep teaching lives in the bespoke
   puzzles (mounted via the Workbench override) and in #build / the capstone.

   This is NOT a text wall: the default view is the real survey instrument plus
   a one-line "When …" headline; the explanation is opt-in behind a single
   reveal. Everything is drawn from the hand-verified specimen data
   (answerFrame + title + methodNote + source) — no engine descriptors, no
   synthetic machinery. */
export function ExampleExposition({
  specimen,
  titleId
}: {
  specimen: WorkbenchSpecimen;
  titleId: string;
}) {
  const [revealed, setRevealed] = useState(false);
  const { answerFrame, source } = specimen;
  const options = answerFrame.responseOptions ?? [];
  // Highlight a single culprit only where the flaw is one option; for items
  // whose flaw is the whole answer set or the question stem (e.g. yes/no
  // paths), the reveal carries the explanation without a misleading highlight.
  const targetCount = options.filter((option) => option.isTarget).length;
  const highlightSingle = targetCount === 1;
  const why = specimen.methodNote?.whyHere;
  const omitted = specimen.methodNote?.whatOmitted;

  return (
    <section className="exposition" data-testid={`exposition-${specimen.id}`}>
      <header className="exposition-head">
        <p className="exposition-eyebrow">
          <span>Example {specimen.number}</span>
          <span aria-hidden="true">/</span>
          <span>{specimen.patternLabel}</span>
        </p>
        <h2 className="exposition-title" id={titleId} tabIndex={-1}>
          {specimen.title}
        </h2>
        <p className="exposition-subtitle">{specimen.canonicalSubtitle}</p>
      </header>

      <div className="exposition-instrument">
        <p className="exposition-instrument-eyebrow">{answerFrame.eyebrow}</p>
        <p className="exposition-prompt">{answerFrame.prompt}</p>
        {options.length > 0 && (
          <ul className="exposition-options">
            {options.map((option) => {
              const flagged = revealed && highlightSingle && option.isTarget;
              return (
                <li
                  key={option.id}
                  className={`exposition-option ${flagged ? "is-flagged" : ""}`}
                  data-testid={`exposition-option-${specimen.id}-${option.id}`}
                >
                  <span className="exposition-option-text">{option.text}</span>
                  {flagged && (
                    <span className="exposition-option-tag">where it breaks</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <button
        type="button"
        className="exposition-reveal-toggle"
        aria-expanded={revealed}
        onClick={() => setRevealed((value) => !value)}
        data-testid={`exposition-reveal-${specimen.id}`}
      >
        {revealed ? "Hide what breaks" : "Show what breaks ↓"}
      </button>

      {revealed && (
        <div
          className="exposition-finding"
          data-testid={`exposition-finding-${specimen.id}`}
        >
          {why && <p className="exposition-finding-lead">{why}</p>}
          {answerFrame.methodNote && (
            <p className="exposition-finding-nuance">{answerFrame.methodNote}</p>
          )}
          {specimen.verbatim && <VerbatimQuote verbatim={specimen.verbatim} />}
        </div>
      )}

      <details className="src-fold exposition-source">
        <summary className="src-fold-summary">
          <span className="src-kicker">Source &amp; scope</span>
          <span className="src-fold-cite">
            {source.agency} · {source.documentCode} · {source.year}
          </span>
        </summary>
        <div className="src-fold-body">
          {omitted && <p>{omitted}</p>}
          <p className="exposition-claim">
            Teaching framing of a real, cited item — not a distribution estimate
            or a validated rewrite.
          </p>
          <dl className="source-manifest-list">
            <dt>Report</dt>
            <dd>{source.reportTitle}</dd>
            <dt>Section / page</dt>
            <dd>{source.sectionOrPage}</dd>
            <dt>Retrieved</dt>
            <dd>{source.retrievalDate}</dd>
            <dt>Link</dt>
            <dd>
              <a
                className="source-manifest-link"
                href={source.directUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {source.directUrl}
              </a>
            </dd>
          </dl>
        </div>
      </details>
    </section>
  );
}
