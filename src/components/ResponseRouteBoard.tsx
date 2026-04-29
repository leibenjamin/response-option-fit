import type { Specimen } from "../types/specimen";
import { RouteSnapshot } from "./RouteSnapshot";

type Props = { specimen: Specimen };

export function ResponseRouteBoard({ specimen }: Props) {
  return (
    <section
      className="board"
      aria-labelledby="board-title"
      data-testid="route-board"
    >
      <header className="board-head">
        <p className="board-eyebrow">
          <span className="board-eyebrow-num">Specimen {specimen.number}</span>
          <span className="board-eyebrow-sep" aria-hidden="true">
            /
          </span>
          <span className="board-eyebrow-pattern">{specimen.patternLabel}</span>
        </p>
        <h2 className="board-title" id="board-title" data-testid="board-title">
          {specimen.title}
        </h2>
        <p className="board-subtitle">{specimen.subtitle}</p>
      </header>

      <div className="board-wording">
        <p className="board-wording-eyebrow">Tested wording</p>
        <blockquote className="board-wording-quote">
          <p>“{specimen.testedWording}”</p>
        </blockquote>
        <dl className="board-wording-meta">
          <div className="wording-meta-row">
            <dt>Intended construct</dt>
            <dd>{specimen.intendedConstruct}</dd>
          </div>
          <div className="wording-meta-row">
            <dt>What the data loses</dt>
            <dd>
              <span className="wording-meta-loss" data-testid="data-loss">
                {specimen.dataLoss}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      <RouteSnapshot specimen={specimen} />

      <section className="route-detail" aria-labelledby="route-detail-title">
        <header className="route-detail-head">
          <p className="route-detail-eyebrow">Stage commentary</p>
          <h3 className="route-detail-title" id="route-detail-title">
            How the route bends, stage by stage
          </h3>
        </header>
        <ol className="route" aria-label="Response route stage commentary">
          {specimen.routeStages.map((stage, i) => (
            <li key={stage.id} className={`route-stage route-stage--${stage.kind}`}>
              <div className="route-stage-rail" aria-hidden="true">
                <span className="route-stage-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="route-stage-dot" />
                {i < specimen.routeStages.length - 1 && (
                  <span className="route-stage-line" />
                )}
              </div>
              <div className="route-stage-body">
                <p className="route-stage-eyebrow">{stage.eyebrow}</p>
                <p className="route-stage-detail">{stage.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="board-foot">
        <div className="foot-block foot-block--repair">
          <p className="foot-key">Repair direction</p>
          <p className="foot-val">{specimen.repairDirection}</p>
        </div>
        <div className="foot-block foot-block--takeaway">
          <p className="foot-key">Safe takeaway</p>
          <p className="foot-val">{specimen.safeTakeaway}</p>
        </div>
      </div>
    </section>
  );
}
