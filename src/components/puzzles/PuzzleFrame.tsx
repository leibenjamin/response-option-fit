import type { ReactNode } from "react";
import type { WorkbenchSpecimen } from "../../types/workbench";
import { puzzleRole } from "../../lib/puzzle-roles";

/* Shared puzzle eyebrow: Puzzle N / pattern / "Your role: <Seat> · <verb>".
   The SEAT is one of the four macro roles the whole exhibit cycles (Respondent /
   Form / Analyst / Reviewer); it accumulates across the walk so the closing
   "you stood on all four sides" is earned rather than asserted. The VERB stays
   per-puzzle distinct for novelty/memorability. See src/lib/puzzle-roles.ts.
   Used by PuzzleFrame and by the puzzles that render their own hero, so the role
   reads identically everywhere. */
export function PuzzleEyebrow({ specimen }: { specimen: WorkbenchSpecimen }) {
  const role = puzzleRole(specimen.id);
  return (
    <p className="puzzle-eyebrow">
      <span>Puzzle {specimen.number}</span>
      <span aria-hidden="true">/</span>
      <span>{specimen.patternLabel}</span>
      <span aria-hidden="true">/</span>
      <span className="puzzle-role">
        Your role: <span className="puzzle-seat">{role.seat}</span>
        <span className="puzzle-role-verb"> · {role.verb}</span>
      </span>
    </p>
  );
}

type PuzzleFrameProps = {
  specimen: WorkbenchSpecimen;
  titleId: string;
  title: string;
  lede: string;
  className: string;
  progress?: ReactNode;
  children: ReactNode;
  /* Accepted but unused: lets puzzle files from the curated public branch
     (which pass a plain role string) compile against this persona-wave frame,
     whose eyebrow derives Seat + verb internally from puzzleRole(specimen.id). */
  role?: string;
};

export function PuzzleFrame({
  specimen,
  titleId,
  title,
  lede,
  className,
  progress,
  children
}: PuzzleFrameProps) {
  return (
    <section
      className={`puzzle ${className}`}
      data-testid={`puzzle-interactive-${specimen.id}`}
      data-interactive="true"
    >
      <header className="puzzle-hero">
        <PuzzleEyebrow specimen={specimen} />
        <h2 className="puzzle-title" id={titleId} tabIndex={-1}>
          {title}
        </h2>
        <p className="puzzle-lede">{lede}</p>
      </header>
      {progress}
      {children}
    </section>
  );
}

export function PuzzleProgress({
  completed,
  total,
  completeLabel = "map complete",
  pendingLabel = "moves made"
}: {
  completed: number;
  total: number;
  completeLabel?: string;
  pendingLabel?: string;
}) {
  return (
    <div className="puzzle-progress" aria-live="polite">
      <span className="puzzle-progress-count">
        {completed}/{total}
      </span>
      <span>{completed === total ? completeLabel : pendingLabel}</span>
    </div>
  );
}

export function PuzzleInstrument({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="puzzle-instrument">
      <p className="puzzle-instrument-label">{label}</p>
      {children}
    </div>
  );
}

export function PuzzleReveal({
  specimen,
  eyebrow,
  title,
  children
}: {
  specimen: WorkbenchSpecimen;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      className="puzzle-reveal"
      aria-labelledby={`puzzle-reveal-${specimen.id}`}
      data-testid={`puzzle-reveal-${specimen.id}`}
    >
      <p className="puzzle-eyebrow">{eyebrow}</p>
      <h3 id={`puzzle-reveal-${specimen.id}`}>{title}</h3>
      {children}
    </section>
  );
}

export function OptionalSource({
  specimen,
  children
}: {
  specimen: WorkbenchSpecimen;
  children?: ReactNode;
}) {
  return (
    <details
      className="puzzle-source puzzle-source--optional"
      data-testid={`puzzle-source-${specimen.id}`}
    >
      <summary>Optional real-world anchor</summary>
      {children ?? (
        <p className="puzzle-source-claim">
          This puzzle is authored for the interaction. It borrows its core
          answer-choice problem from{" "}
          <a href={specimen.source.directUrl} target="_blank" rel="noreferrer">
            {specimen.source.documentCode}
          </a>
          , but the small cases and feedback above are teaching material.
        </p>
      )}
    </details>
  );
}
