import type { CSSProperties } from "react";
import { workbenchSpecimens } from "../data/workbench-specimens";
import { patternMeta } from "../lib/pattern-meta";
import { routeToHash } from "../lib/routes";
import type { WorkbenchSpecimen } from "../types/workbench";
import { SettingsButton } from "./SettingsButton";
import { SubwayStrip } from "./SubwayStrip";

type Props = {
  specimen: WorkbenchSpecimen;
  visited: ReadonlySet<string>;
  onSettingsOpen: () => void;
};

/* Sticky top ribbon for walk mode. Layered with the right-rail map (K4)
   and the inline "N of 12" counter (K6); together they give the visitor
   three densities of wayfinding without crowding the editorial column. */
export function WalkRibbon({ specimen, visited, onSettingsOpen }: Props) {
  const meta = patternMeta[specimen.pattern];
  const positionIndex = workbenchSpecimens.findIndex((s) => s.id === specimen.id);
  const position = positionIndex >= 0 ? positionIndex + 1 : 1;
  const styleVar = { "--ribbon-accent": `var(${meta.accentVar})` } as CSSProperties;

  return (
    <div
      className="walk-ribbon"
      data-testid="walk-ribbon"
      style={styleVar}
    >
      <div className="walk-ribbon-row">
        <p className="walk-ribbon-counter" data-testid="walk-counter">
          <span className="walk-ribbon-counter-eyebrow">Puzzle</span>
          <span className="walk-ribbon-counter-now">{specimen.number}</span>
          <span className="walk-ribbon-counter-sep" aria-hidden="true">
            of
          </span>
          <span className="walk-ribbon-counter-total">12</span>
          <span className="walk-ribbon-counter-sep" aria-hidden="true">
            ·
          </span>
          <span className="walk-ribbon-counter-pattern">{meta.label}</span>
        </p>
        {/* Back-to-overview and the settings gear share the ribbon's
           top-right cluster. Keeping the gear here (rather than as a page-level
           absolute button) stops it from covering the back link at the top and
           keeps settings reachable as the sticky ribbon follows the scroll. */}
        <div className="walk-ribbon-actions">
          <a
            className="walk-ribbon-back"
            href={routeToHash({ kind: "hub" })}
            data-testid="walk-back"
          >
            <span aria-hidden="true">←</span>
            <span>Back to overview</span>
          </a>
          <SettingsButton onClick={onSettingsOpen} />
        </div>
      </div>
      <SubwayStrip currentSpecimenId={specimen.id} visited={visited} />
      <p className="sr-only" data-testid="walk-position">
        Puzzle {position} of {workbenchSpecimens.length}.
      </p>
    </div>
  );
}
