import type { CSSProperties, ReactNode } from "react";
import { patternMeta } from "../lib/pattern-meta";
import type { WorkbenchSpecimen } from "../types/workbench";
import { FlattenTheWeek } from "./puzzles/FlattenTheWeek";
import { PlayTheForm } from "./puzzles/PlayTheForm";
import { StopTheLeak } from "./puzzles/StopTheLeak";
import { ZoomToAltitude } from "./puzzles/ZoomToAltitude";
import { ExampleExposition } from "./workbench/ExampleExposition";

/* The walk-mode workbench shell. Two render paths only:
   - a BESPOKE puzzle for the few examples that earn a purpose-built
     interaction (the override map below), or
   - the lightweight ExampleExposition for the rest (the real instrument + a
     one-line finding + an opt-in reveal).
   The twelve "set a control, read the result" engines — one interaction
   primitive reskinned twelve times — were retired on 2026-05-21 (they made the
   walk a textbook and were ~3,000 lines of dead-weight machinery). See
   docs/design-passes/2026-05-21-engine-retirement.md. Adding a bespoke puzzle
   is one map entry; removing it falls back to exposition. */
const bespokePuzzleBySpecimenId: Record<
  string,
  (props: { specimen: WorkbenchSpecimen; titleId: string }) => ReactNode
> = {
  "business-industry": ZoomToAltitude,
  "refrigerated-medicine": PlayTheForm,
  "owner-advertising": StopTheLeak,
  "usual-hours": FlattenTheWeek
};

export function Workbench({ specimen }: { specimen: WorkbenchSpecimen }) {
  const titleId = `${specimen.id}-workbench-title`;
  const accentVar = patternMeta[specimen.pattern].accentVar;
  const style = {
    "--workbench-accent": `var(${accentVar})`
  } as CSSProperties;

  const BespokePuzzle = bespokePuzzleBySpecimenId[specimen.id];

  return (
    <article
      className="workbench"
      id={`workbench-${specimen.number}-${specimen.id}`}
      data-testid={`workbench-${specimen.id}`}
      aria-labelledby={titleId}
      style={style}
    >
      {BespokePuzzle ? (
        <BespokePuzzle specimen={specimen} titleId={titleId} />
      ) : (
        <ExampleExposition specimen={specimen} titleId={titleId} />
      )}
    </article>
  );
}
