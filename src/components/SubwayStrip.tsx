import type { CSSProperties } from "react";
import { workbenchSpecimens } from "../data/workbench-specimens";
import { patternMeta } from "../lib/pattern-meta";
import { routeToHash } from "../lib/routes";

type Props = {
  currentSpecimenId: string | null;
  visited: ReadonlySet<string>;
};

/* The 12-dot subway strip across the top of the walk-mode ribbon.
   Layered with the right-rail Pattern Catalog map (K4) and the inline
   "Example N of 12" counter (K6); together they give three levels of
   wayfinding density: glance, taxonomy, and verbal. */
export function SubwayStrip({ currentSpecimenId, visited }: Props) {
  return (
    <nav
      className="subway"
      aria-label="Worked examples"
      data-testid="subway-strip"
    >
      <ol className="subway-list">
        {workbenchSpecimens.map((specimen) => {
          const isCurrent = specimen.id === currentSpecimenId;
          const isVisited = visited.has(specimen.id);
          const className = [
            "subway-dot",
            isVisited ? "is-visited" : "",
            isCurrent ? "is-current" : ""
          ]
            .filter(Boolean)
            .join(" ");
          const styleVar = patternMeta[specimen.pattern].accentVar;
          const style = { "--dot-accent": `var(${styleVar})` } as CSSProperties;
          return (
            <li key={specimen.id} className="subway-item">
              <a
                className={className}
                href={routeToHash({ kind: "walk", slot: specimen.id })}
                aria-label={`Example ${specimen.number} of 12: ${specimen.title}. Pattern: ${specimen.patternLabel}.${
                  isCurrent ? " Current example." : isVisited ? " Visited." : ""
                }`}
                aria-current={isCurrent ? "step" : undefined}
                style={style}
                data-testid={`subway-dot-${specimen.id}`}
              >
                <span className="subway-dot-num" aria-hidden="true">
                  {specimen.number}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
