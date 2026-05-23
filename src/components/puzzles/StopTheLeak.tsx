import { useState } from "react";
import {
  leakFixes,
  leakOutcomes,
  leakQuestions,
  leakRespondent,
  type LeakAnswer
} from "../../data/stop-the-leak";
import type { WorkbenchSpecimen } from "../../types/workbench";
import { VerbatimQuote } from "../workbench/VerbatimQuote";

/* "Stop the leak" — bespoke puzzle for Example 05 (owner-advertising, sequence
   overlap). The visitor plays the form recording one respondent across two
   adjacent questions whose categories overlap; a single listing double-counts
   or drops, and then the visitor tries fixes and discovers reordering does
   nothing while scoping/merging closes the leak. Shares the puzzle frame;
   the leak mechanic is its own. Tap/keyboard only, non-judgemental (the form
   leaks, not the visitor), reveal uses only the hand-verified finding. */
export function StopTheLeak({
  specimen,
  titleId
}: {
  specimen: WorkbenchSpecimen;
  titleId: string;
}) {
  const [answer, setAnswer] = useState<LeakAnswer | null>(null);
  const [fixId, setFixId] = useState<string | null>(null);
  const source = specimen.source;
  const fix = leakFixes.find((f) => f.id === fixId) ?? null;

  return (
    <section
      className="puzzle puzzle--leak"
      data-testid={`puzzle-leak-${specimen.id}`}
      data-interactive="true"
    >
      <header className="puzzle-hero">
        <p className="puzzle-eyebrow">
          <span>Example {specimen.number}</span>
          <span aria-hidden="true">/</span>
          <span>{specimen.patternLabel}</span>
          <span aria-hidden="true">/</span>
          <span className="puzzle-role">You are the form</span>
        </p>
        <h2 className="puzzle-title" id={titleId} tabIndex={-1}>
          Two questions in a row. One answer leaks across both.
        </h2>
        <p className="puzzle-lede">
          A housing survey asks, one after another, how someone found their home.
          You record one respondent — and watch a single listing land in two
          boxes at once.
        </p>
      </header>

      <div className="puzzle-instrument">
        <p className="puzzle-instrument-label">The respondent:</p>
        <p className="leak-respondent">{leakRespondent}</p>
        <ol className="leak-questions">
          <li>
            <span className="leak-q-num" aria-hidden="true">Q1</span>
            <span>{leakQuestions[0]}</span>
            <span className="leak-q-answer">Dani: Yes — Zillow</span>
          </li>
          <li className="leak-q-target">
            <span className="leak-q-num" aria-hidden="true">Q2</span>
            <span>{leakQuestions[1]}</span>
          </li>
        </ol>
      </div>

      <div className="leak-record">
        <p className="leak-record-prompt">
          Record Dani&rsquo;s answer to Q2. The owner advertised — on that same
          Zillow listing.
        </p>
        <div className="puzzle-buttons" role="group" aria-label="Record Q2 as">
          {(["yes", "no"] as LeakAnswer[]).map((value) => (
            <button
              type="button"
              key={value}
              className={`puzzle-button ${answer === value ? "is-chosen" : ""}`}
              aria-pressed={answer === value}
              onClick={() => setAnswer(value)}
              data-testid={`leak-answer-${specimen.id}-${value}`}
            >
              {value === "yes" ? "Yes" : "No"}
            </button>
          ))}
        </div>
        {answer && (
          <>
            <div
              className="puzzle-outcome is-gap"
              aria-live="polite"
              data-testid={`leak-outcome-${specimen.id}`}
            >
              <p className="puzzle-outcome-verdict">{leakOutcomes[answer]}</p>
            </div>
            <div className="leak-trace" data-testid={`leak-trace-${specimen.id}`}>
              <div className="leak-trace-column is-source">
                <span>Q1 internet site</span>
                <strong>Zillow listing</strong>
                <em>recorded here</em>
              </div>
              <div
                className={`leak-trace-bridge ${
                  answer === "yes" ? "is-duplicate" : "is-dropped"
                }`}
                aria-hidden="true"
              />
              <div className="leak-trace-column is-target">
                <span>Q2 other owner advertising</span>
                <strong>Same listing</strong>
                <em>
                  {fix?.closes
                    ? "scoped out by the fix"
                    : answer === "yes"
                      ? "double-counted"
                      : "dropped"}
                </em>
              </div>
            </div>
          </>
        )}
      </div>

      {answer && (
        <section className="leak-fixes" data-testid={`leak-fixes-${specimen.id}`}>
          <p className="leak-fixes-lead">
            Neither answer is right, because the bug isn&rsquo;t Dani&rsquo;s — it
            is the two questions overlapping. Try a fix and watch the leak.
          </p>
          <div className="puzzle-buttons" role="group" aria-label="Try a fix">
            {leakFixes.map((candidate) => (
              <button
                type="button"
                key={candidate.id}
                className={`leak-fix ${fixId === candidate.id ? "is-chosen" : ""}`}
                aria-pressed={fixId === candidate.id}
                onClick={() => setFixId(candidate.id)}
                data-testid={`leak-fix-${specimen.id}-${candidate.id}`}
              >
                {candidate.label}
              </button>
            ))}
          </div>
          {fix && (
            <div
              className={`puzzle-outcome ${fix.closes ? "is-honest" : "is-gap"}`}
              aria-live="polite"
              data-testid={`leak-fix-outcome-${specimen.id}`}
            >
              <p className="puzzle-outcome-verdict">
                <span className="leak-fix-flag">
                  {fix.closes ? "Leak closed" : "Still leaking"}
                </span>{" "}
                {fix.note}
              </p>
            </div>
          )}
        </section>
      )}

      {fix && (
        <section
          className="puzzle-reveal"
          aria-labelledby={`puzzle-reveal-${specimen.id}`}
          data-testid={`puzzle-reveal-${specimen.id}`}
        >
          <p className="puzzle-eyebrow">What testing caught</p>
          <h3 id={`puzzle-reveal-${specimen.id}`}>
            The fix is scope, not order.
          </h3>
          <p>{specimen.methodNote?.whyHere}</p>
          <p className="puzzle-reveal-takeaway">
            {specimen.answerFrame.methodNote} Adjacent questions about
            overlapping channels double-count unless one of them is scoped to say
            what it does <em>not</em> include.
          </p>
          {specimen.verbatim && <VerbatimQuote verbatim={specimen.verbatim} />}
        </section>
      )}

      <details
        className="puzzle-source puzzle-source--optional"
        data-testid={`puzzle-source-${specimen.id}`}
      >
        <summary>Optional real-world anchor</summary>
        <p className="puzzle-source-claim">
          Dani and the candidate fixes are authored teaching content. The
          adjacent-question overlap is adapted from{" "}
          <a href={source.directUrl} target="_blank" rel="noreferrer">
            {source.documentCode}, {source.sectionOrPage}
          </a>
          .
        </p>
      </details>
    </section>
  );
}
