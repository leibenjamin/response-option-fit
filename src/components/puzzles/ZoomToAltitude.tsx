import { useState } from "react";
import {
  zoomAltitudes,
  zoomAnswer,
  zoomField,
  type Altitude
} from "../../data/zoom-altitude";
import type { WorkbenchSpecimen } from "../../types/workbench";
import { VerbatimQuote } from "../workbench/VerbatimQuote";

/* "Zoom to the right altitude" — bespoke puzzle for Example 02 (business /
   industry, broad bucket). The visitor codes one worker's answer to the open
   industry field, sliding through the altitudes a coder could pick. Every
   altitude is defensible, so committing to one surfaces the failure: the field
   never said which level it wants, so the column mixes employers, workplaces,
   industries, and sectors and can't be compared. Shares the puzzle frame
   (hero / source / reveal) with the other bespoke puzzles; the altitude
   stepper is its own mechanic. Tap/keyboard only, non-judgemental, reveal uses
   only the hand-verified specimen finding. */
export function ZoomToAltitude({
  specimen,
  titleId
}: {
  specimen: WorkbenchSpecimen;
  titleId: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const [committed, setCommitted] = useState<string | null>(null);
  const source = specimen.source;
const shown: Altitude | undefined =
    zoomAltitudes.find((a) => a.id === (active ?? committed)) ?? undefined;
  const committedAltitude = zoomAltitudes.find((a) => a.id === committed);

  return (
    <section
      className="puzzle puzzle--zoom"
      data-testid={`puzzle-zoom-${specimen.id}`}
      data-interactive="true"
    >
      <header className="puzzle-hero">
        <p className="puzzle-eyebrow">
          <span>Example {specimen.number}</span>
          <span aria-hidden="true">/</span>
          <span>{specimen.patternLabel}</span>
          <span aria-hidden="true">/</span>
          <span className="puzzle-role">You are the coder</span>
        </p>
        <h2 className="puzzle-title" id={titleId} tabIndex={-1}>
          One answer. Four defensible codes. Pick one.
        </h2>
        <p className="puzzle-lede">
          A survey collects industry in a single open box. Your job is to code
          what one worker wrote — but the same words sit at several altitudes,
          and the field never said which one it wants.
        </p>
      </header>

      <div className="puzzle-instrument">
        <p className="puzzle-instrument-label">The field asks:</p>
        <p className="puzzle-instrument-prompt">{zoomField}</p>
        <p className="zoom-answer">
          One worker wrote: <span className="zoom-answer-text">{zoomAnswer}</span>
        </p>
      </div>

      <div className="zoom-track-wrap">
        <p className="zoom-track-caption">
          <span>Specific</span>
          <span aria-hidden="true">↔</span>
          <span>Broad</span>
        </p>
        <ol className="zoom-track" role="group" aria-label="Code this answer at an altitude">
          {zoomAltitudes.map((altitude) => {
            const isActive = (active ?? committed) === altitude.id;
            const isCommitted = committed === altitude.id;
            return (
              <li key={altitude.id}>
                <button
                  type="button"
                  className={`zoom-stop ${isActive ? "is-active" : ""} ${
                    isCommitted ? "is-committed" : ""
                  }`}
                  aria-pressed={isActive}
                  onMouseEnter={() => setActive(altitude.id)}
                  onFocus={() => setActive(altitude.id)}
                  onMouseLeave={() => setActive(null)}
                  onBlur={() => setActive(null)}
                  onClick={() => setCommitted(altitude.id)}
                  data-testid={`zoom-stop-${specimen.id}-${altitude.id}`}
                >
                  <span className="zoom-stop-label">{altitude.label}</span>
                  <span className="zoom-stop-code">{altitude.code}</span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="zoom-readout" aria-live="polite">
          {shown ? (
            <p>
              <span className="zoom-readout-code">{shown.code}</span>
              <span className="zoom-readout-note">{shown.defensible}</span>
            </p>
          ) : (
            <p className="zoom-readout-empty">
              Hover or tab through the altitudes, then tap the one you would file
              it under.
            </p>
          )}
        </div>
      </div>

      {committedAltitude && (
        <section className="zoom-ledger" aria-label="Mixed-level coding ledger">
          <div className="zoom-ledger-head">
            <p>Mixed-level ledger</p>
            <span>Your row is now a column value, not a rule.</span>
          </div>
          <ol>
            <li className="is-yours">
              <span>&ldquo;I work at a hospital.&rdquo;</span>
              <strong>{committedAltitude.code}</strong>
              <em>{committedAltitude.label}</em>
            </li>
            <li>
              <span>&ldquo;I file insurance claims at a clinic.&rdquo;</span>
              <strong>Clinic</strong>
              <em>Workplace</em>
            </li>
            <li>
              <span>&ldquo;I make surgical supplies.&rdquo;</span>
              <strong>Medical equipment manufacturing</strong>
              <em>Industry</em>
            </li>
            <li>
              <span>&ldquo;I do payroll for a county health office.&rdquo;</span>
              <strong>Government services</strong>
              <em>Sector</em>
            </li>
          </ol>
        </section>
      )}

      {committed && (
        <section
          className="puzzle-reveal"
          aria-labelledby={`puzzle-reveal-${specimen.id}`}
          data-testid={`puzzle-reveal-${specimen.id}`}
        >
          <p className="puzzle-eyebrow">Same five words, four columns</p>
          <h3 id={`puzzle-reveal-${specimen.id}`}>
            You filed it as{" "}
            <span className="zoom-your-code">
              {committedAltitude?.code}
            </span>
            . The next coder won&rsquo;t.
          </h3>
          <p>{specimen.methodNote?.whyHere}</p>
          <ul className="zoom-spread">
            {zoomAltitudes.map((altitude) => (
              <li
                key={altitude.id}
                className={altitude.id === committed ? "is-yours" : ""}
              >
                <span className="zoom-spread-code">{altitude.code}</span>
                <span className="zoom-spread-label">{altitude.label}</span>
              </li>
            ))}
          </ul>
          <p className="puzzle-reveal-takeaway">
            All four are defensible, so &ldquo;{zoomAnswer}&rdquo; lands in a
            different column depending on who codes it. A count of
            &ldquo;hospitals&rdquo; can&rsquo;t be compared with a count of
            &ldquo;health care&rdquo; — the open box quietly mixed the levels.
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
          This puzzle is authored for the interaction. It borrows the broad
          business/industry answer-space problem from{" "}
          <a href={source.directUrl} target="_blank" rel="noreferrer">
            {source.documentCode}, {source.sectionOrPage}
          </a>
          .
        </p>
      </details>
    </section>
  );
}
