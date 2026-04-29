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
        <p className="snapshot-top-eyebrow">Route at a glance</p>
        <h3 className="snapshot-top-title" id="snapshot-title">
          Response route snapshot
        </h3>
      </header>
      <ol className="snapshot-track" aria-label="Compact response route diagram">
        {stages.map((stage, i) => {
          const isLast = i === stages.length - 1;
          const stageNum = String(i + 1).padStart(2, "0");
          return (
            <li key={stage.id} className="snapshot-step">
              <div className={`snapshot-node snapshot-node--${stage.kind}`}>
                <div className="snapshot-node-head">
                  <span className="snapshot-dot" aria-hidden="true" />
                  <span className="snapshot-node-num" aria-hidden="true">
                    {stageNum}
                  </span>
                </div>
                <p className="snapshot-stage-eyebrow">{stage.eyebrow}</p>
                <p className="snapshot-stage-title">{stage.title}</p>
              </div>
              {!isLast && (
                <div
                  className={`snapshot-link snapshot-link--from-${stage.kind}`}
                  aria-hidden="true"
                >
                  {stage.kind === "tested_wording" && (
                    <span className="snapshot-kink" aria-hidden="true" />
                  )}
                </div>
              )}
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
