import { useState } from "react";
import {
  flattenField,
  flattenOptions,
  flattenRange,
  flattenWeeks,
  type FlattenOption
} from "../../data/flatten-the-week";
import type { WorkbenchSpecimen } from "../../types/workbench";
import { VerbatimQuote } from "../workbench/VerbatimQuote";
import { PuzzleEyebrow } from "./PuzzleFrame";

/* "Flatten the week" puzzle for Example 06 (usual-hours, forced
   precision). The visitor is the respondent: their weeks vary 31–52, the field
   wants one number, and every defensible choice erases the variation and makes
   them indistinguishable from a steady worker. Shares the puzzle frame; the
   compress-your-own-week mechanic is its own. Tap/keyboard only, no freeform
   input (canned options), non-judgemental, reveal uses the verified finding. */
export function FlattenTheWeek({
  specimen,
  titleId
}: {
  specimen: WorkbenchSpecimen;
  titleId: string;
}) {
  const [picked, setPicked] = useState<FlattenOption | null>(null);
  const source = specimen.source;
  const max = Math.max(...flattenWeeks);

  return (
    <section
      className="puzzle puzzle--flatten"
      data-testid={`puzzle-flatten-${specimen.id}`}
      data-interactive="true"
    >
      <header className="puzzle-hero">
        <PuzzleEyebrow specimen={specimen} />
        <h2 className="puzzle-title" id={titleId} tabIndex={-1}>
          Your weeks don’t match. The form wants one number.
        </h2>
        <p className="puzzle-lede">
          Here are your last four weeks at work. The survey asks for your{" "}
          <em>usual</em> hours — a single value. Pick the answer you’d actually
          give, then see what the form keeps and what it throws away.
        </p>
      </header>

      {/* Once the visitor picks one number, every bar glides to that one
         height — the "flatten" is shown, not just told. The per-week value
         labels keep their real numbers, so the contrast (equal bars, unequal
         weeks) is what the eye lands on. Collapse is reduced-motion-safe: the
         global reduced-motion rule zeroes the transition to an instant flatten. */}
      <div
        className={`flatten-weeks ${picked ? "is-flattened" : ""}`}
        aria-label="Your last four weeks of hours"
      >
        {flattenWeeks.map((hours, index) => {
          const naturalPct = Math.round((hours / max) * 100);
          const flatPct = picked ? Math.round((picked.value / max) * 100) : null;
          return (
            <div className="flatten-week" key={index}>
              <span className="flatten-week-label" aria-hidden="true">
                wk {index + 1}
              </span>
              <span
                className={`flatten-week-bar ${picked ? "is-flattened" : ""}`}
                style={{ height: `${flatPct ?? naturalPct}%` }}
              />
              <span className="flatten-week-value">{hours}h</span>
            </div>
          );
        })}
      </div>

      <aside className="flatten-ghost" aria-label="Steady-worker comparison">
        <div>
          <p className="flatten-ghost-label">Steady coworker ghost</p>
          <p className="flatten-ghost-bars" aria-hidden="true">
            <span /> <span /> <span /> <span />
          </p>
        </div>
        <p>
          This coworker works the same number every week. Once you choose one
          number, the form can make your volatile month look just as steady.
        </p>
      </aside>

      <div className="puzzle-instrument">
        <p className="puzzle-instrument-label">The field asks:</p>
        <p className="puzzle-instrument-prompt">{flattenField}</p>
        <div className="puzzle-buttons" role="group" aria-label="Record one number">
          {flattenOptions.map((option) => (
            <button
              type="button"
              key={option.id}
              className={`flatten-option ${picked?.id === option.id ? "is-chosen" : ""}`}
              aria-pressed={picked?.id === option.id}
              onClick={() => setPicked(option)}
              data-testid={`flatten-option-${specimen.id}-${option.id}`}
            >
              <span className="flatten-option-value">{option.value}h</span>
              <span className="flatten-option-label">{option.label}</span>
              <span className="flatten-option-gloss">{option.gloss}</span>
            </button>
          ))}
        </div>
      </div>

      {picked && (
        <section
          className="puzzle-reveal"
          aria-labelledby={`puzzle-reveal-${specimen.id}`}
          data-testid={`puzzle-reveal-${specimen.id}`}
        >
          <p className="puzzle-eyebrow">What the form keeps</p>
          <h3 id={`puzzle-reveal-${specimen.id}`}>
            Recorded: <span className="flatten-stamp">{picked.value}h</span>. The
            swing is gone.
          </h3>
          <p>
            The form records one value and drops the range — your weeks ran{" "}
            {flattenRange.min} to {flattenRange.max} hours, compressed into one
            usual-hours number.
          </p>
          <p className="puzzle-reveal-takeaway">
            And a coworker who works {picked.value}h every single week recorded
            the same {picked.value}h. In the data you two are now identical — the
            variation that defines your job never made it in. Whichever number you
            picked, the truth didn’t fit one box.
          </p>
          <p className="puzzle-reveal-sowhat">
            <span className="puzzle-reveal-sowhat-key">For a survey you build</span>
            If you ask for one number when people&rsquo;s lives vary week to week,
            the clean column may erase the very difference you needed to understand.
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
          The weeks and answer options are authored teaching content. The
          one-number usual-hours problem is adapted from{" "}
          <a href={source.directUrl} target="_blank" rel="noreferrer">
            {source.documentCode}, {source.sectionOrPage}
          </a>
          .
        </p>
      </details>
    </section>
  );
}
