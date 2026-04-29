import type { Specimen } from "../types/specimen";

type Props = { specimen: Specimen };

export function RouteSnapshot({ specimen }: Props) {
  const stages = specimen.routeStages;

  return (
    <section
      className="snapshot"
      aria-labelledby="snapshot-title"
      data-testid="route-snapshot"
    >
      <header className="snapshot-head">
        <p className="snapshot-eyebrow">Route at a glance</p>
        <h3 className="snapshot-title" id="snapshot-title">
          From respondent reality to data consequence
        </h3>
      </header>

      <ol className="snapshot-track" aria-label="Compact response route diagram">
        {stages.map((stage, i) => {
          const stageNum = String(i + 1).padStart(2, "0");
          return (
            <li
              key={stage.id}
              className={`snapshot-step snapshot-step--${stage.kind}`}
              aria-current={stage.kind === "route_break" ? "step" : undefined}
            >
              <div className="snapshot-rail" aria-hidden="true">
                <span className="snapshot-dot" />
                <span className="snapshot-line" />
              </div>
              <div className="snapshot-card">
                <p className="snapshot-card-num" aria-hidden="true">
                  {stageNum}
                </p>
                <p className="snapshot-card-eyebrow">{stage.eyebrow}</p>
                <p className="snapshot-card-title">{stage.title}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="snapshot-howto">
        Read each specimen as a route: what the respondent knows, what the
        survey asks them to choose, where the mapping breaks, and what
        interpretation becomes less safe.
      </p>
    </section>
  );
}
