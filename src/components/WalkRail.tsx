import { workbenchSpecimens } from "../data/workbench-specimens";
import { routeToHash } from "../lib/routes";
import type { WorkbenchSpecimen } from "../types/workbench";
import { PatternCatalog } from "./PatternCatalog";

type Props = {
  specimen: WorkbenchSpecimen;
  visited: ReadonlySet<string>;
  prev: WorkbenchSpecimen | null;
  next: WorkbenchSpecimen | null;
};

/* Compact walk-mode aside. The knowledge map is open by default so a visitor
   can always see where they are in the six-pattern x twelve-puzzle sequence.
   The disclosure stays so visitors can collapse it on a small screen. */
export function WalkRail({ specimen, visited, prev, next }: Props) {
  return (
    <aside
      className="walk-rail"
      aria-label="Knowledge map and walk navigation"
      data-testid="walk-rail"
    >
      <details className="walk-rail-map" data-testid="walk-rail-map" open>
        <summary className="walk-rail-map-summary">
          <span>Knowledge map</span>
          <strong>{visited.size}/12 opened</strong>
        </summary>
        <PatternCatalog
          variant="rail"
          visited={visited}
          currentSpecimenId={specimen.id}
          showHeader={true}
        />
      </details>

      <nav className="walk-rail-nav" aria-label="Walk through puzzles">
        <a
          className="walk-rail-nav-btn walk-rail-nav-btn--prev"
          href={
            prev
              ? routeToHash({ kind: "walk", slot: prev.id })
              : routeToHash({ kind: "hub" })
          }
          data-testid="walk-prev"
        >
          <span className="walk-rail-nav-arrow" aria-hidden="true">
            ←
          </span>
          <span className="walk-rail-nav-body">
            <span className="walk-rail-nav-key">
              {prev ? "Previous" : "Back"}
            </span>
            <span className="walk-rail-nav-label">
              {prev ? `${prev.number} · ${prev.railLabel}` : "Overview"}
            </span>
          </span>
        </a>
        <a
          className="walk-rail-nav-btn walk-rail-nav-btn--next"
          href={
            next
              ? routeToHash({ kind: "walk", slot: next.id })
              : routeToHash({ kind: "walk", slot: "done" })
          }
          data-testid="walk-next"
        >
          <span className="walk-rail-nav-body">
            <span className="walk-rail-nav-key">Next puzzle</span>
            <span className="walk-rail-nav-label">
              {next ? `${next.number} · ${next.railLabel}` : "Wrap up"}
            </span>
          </span>
          <span className="walk-rail-nav-arrow" aria-hidden="true">
            →
          </span>
        </a>
      </nav>

      <div className="walk-rail-foot">
        <p className="walk-rail-foot-row">
          <a
            className="walk-rail-foot-link"
            href={routeToHash({ kind: "fieldGuide" })}
            data-testid="walk-rail-field-guide"
          >
            Check your own survey draft →
          </a>
        </p>
        <p className="walk-rail-foot-row">
          <a
            className="walk-rail-foot-link"
            href={routeToHash({ kind: "reference" })}
            data-testid="walk-rail-reference"
          >
            Open the reference shelf →
          </a>
        </p>
        <p className="walk-rail-foot-row">
          <a className="walk-rail-foot-link" href={routeToHash({ kind: "colophon" })}>
            Read the colophon →
          </a>
        </p>
      </div>
    </aside>
  );
}

/* Helper used by WalkLayout. Exported so the App can also pre-compute
   prev/next for ribbon labels if needed. */
export function neighborSpecimens(specimenId: string): {
  prev: WorkbenchSpecimen | null;
  next: WorkbenchSpecimen | null;
} {
  const idx = workbenchSpecimens.findIndex((s) => s.id === specimenId);
  if (idx < 0) return { prev: null, next: null };
  return {
    prev: idx > 0 ? workbenchSpecimens[idx - 1] : null,
    next: idx < workbenchSpecimens.length - 1 ? workbenchSpecimens[idx + 1] : null
  };
}
