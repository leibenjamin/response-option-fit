import type { CSSProperties, ReactNode } from "react";
import { patternMeta } from "../lib/pattern-meta";
import type { WorkbenchSpecimen } from "../types/workbench";
import { ElectricVehicleRuleBoard } from "./puzzles/ElectricVehicleRuleBoard";
import { FlattenTheWeek } from "./puzzles/FlattenTheWeek";
import { MoveReasonCatchall } from "./puzzles/MoveReasonCatchall";
import { NaturalDisasterThreshold } from "./puzzles/NaturalDisasterThreshold";
import { NotebookLabelDeck } from "./puzzles/NotebookLabelDeck";
import { PlayTheForm } from "./puzzles/PlayTheForm";
import { RideHailingModeCollision } from "./puzzles/RideHailingModeCollision";
import { StopTheLeak } from "./puzzles/StopTheLeak";
import { SumpPumpGate } from "./puzzles/SumpPumpGate";
import { TvDeviceBoundary } from "./puzzles/TvDeviceBoundary";
import { WeeksWorkedCalculator } from "./puzzles/WeeksWorkedCalculator";
import { ZoomToAltitude } from "./puzzles/ZoomToAltitude";

/* Delight-first registry: every walk specimen must render an interactive
   puzzle. Source-backed exposition is now optional backmatter, never the
   default walk experience. */
export const interactivePuzzleBySpecimenId: Record<
  string,
  (props: { specimen: WorkbenchSpecimen; titleId: string }) => ReactNode
> = {
  "ride-hailing": RideHailingModeCollision,
  "business-industry": ZoomToAltitude,
  "refrigerated-medicine": PlayTheForm,
  "electric-vehicle-type": ElectricVehicleRuleBoard,
  "owner-advertising": StopTheLeak,
  "usual-hours": FlattenTheWeek,
  "notebook-computer": NotebookLabelDeck,
  "move-reason-catchall": MoveReasonCatchall,
  "sump-pump": SumpPumpGate,
  "tv-connected-devices": TvDeviceBoundary,
  "avoid-natural-disasters": NaturalDisasterThreshold,
  "acs-weeks-worked": WeeksWorkedCalculator
};

export function Workbench({ specimen }: { specimen: WorkbenchSpecimen }) {
  const titleId = `${specimen.id}-workbench-title`;
  const accentVar = patternMeta[specimen.pattern].accentVar;
  const style = {
    "--workbench-accent": `var(${accentVar})`
  } as CSSProperties;

  const Puzzle = interactivePuzzleBySpecimenId[specimen.id];

  return (
    <article
      className="workbench"
      id={`workbench-${specimen.number}-${specimen.id}`}
      data-testid={`workbench-${specimen.id}`}
      aria-labelledby={titleId}
      style={style}
    >
      <Puzzle specimen={specimen} titleId={titleId} />
    </article>
  );
}
