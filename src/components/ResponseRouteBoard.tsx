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
          Specimen {specimen.number} · {specimen.patternLabel}
        </p>
        <h2 className="board-title" id="board-title" data-testid="board-title">
          {specimen.title}
        </h2>
        <p className="board-subtitle">{specimen.subtitle}</p>
      </header>

      <RouteSnapshot specimen={specimen} />

      <div className="board-meta">
        <div className="meta-row">
          <span className="meta-key">Tested wording</span>
          <span className="meta-val meta-val--quote">
            “{specimen.testedWording}”
          </span>
        </div>
        <div className="meta-row">
          <span className="meta-key">Intended construct</span>
          <span className="meta-val">{specimen.intendedConstruct}</span>
        </div>
      </div>

      <p className="data-loss-callout">
        <span className="data-loss-key">What the data loses</span>
        <span className="data-loss-val" data-testid="data-loss">
          {specimen.dataLoss}
        </span>
      </p>

      <div className="route-detail-head">
        <p className="route-detail-eyebrow">Stage commentary</p>
      </div>
      <ol className="route" aria-label="Response route stage commentary">
        {specimen.routeStages.map((stage, i) => (
          <li key={stage.id} className={`route-stage route-stage--${stage.kind}`}>
            <div className="route-stage-index" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="route-stage-body">
              <p className="route-stage-eyebrow">{stage.eyebrow}</p>
              <p className="route-stage-detail">{stage.detail}</p>
            </div>
            {i < specimen.routeStages.length - 1 && (
              <div className="route-line" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>

      <div className="board-foot">
        <div className="foot-block">
          <p className="foot-key">Repair direction</p>
          <p className="foot-val">{specimen.repairDirection}</p>
        </div>
        <div className="foot-block foot-block--accent">
          <p className="foot-key">Safe takeaway</p>
          <p className="foot-val">{specimen.safeTakeaway}</p>
        </div>
      </div>
    </section>
  );
}
