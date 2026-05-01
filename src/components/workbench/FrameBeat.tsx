import type { WorkbenchSpecimen } from "../../types/workbench";

type Props = {
  specimen: WorkbenchSpecimen;
  titleId: string;
};

export function FrameBeat({ specimen, titleId }: Props) {
  return (
    <section className="workbench-beat workbench-beat--frame" aria-labelledby={titleId}>
      <header className="beat-head">
        <p className="beat-eyebrow">
          <span>Specimen {specimen.number}</span>
          <span aria-hidden="true">/</span>
          <span>{specimen.patternLabel}</span>
        </p>
        <h2 className="beat-title" id={titleId}>
          {specimen.title}
        </h2>
        <p className="beat-lede">{specimen.subtitle}</p>
      </header>

      <div className="frame-grid">
        <div className="tested-wording">
          <p className="tested-wording-eyebrow">Tested wording</p>
          <blockquote className="tested-wording-quote">
            <p>{specimen.testedWording}</p>
          </blockquote>
        </div>
        <dl className="frame-meta">
          <div>
            <dt>Intended construct</dt>
            <dd>{specimen.intendedConstruct}</dd>
          </div>
          <div>
            <dt>Respondent reality</dt>
            <dd>{specimen.sampleRespondent}</dd>
          </div>
          <div>
            <dt>Pre-vocabulary</dt>
            <dd>{specimen.prerequisiteVocab}</dd>
          </div>
          <div className="frame-source-receipt">
            <dt>Source receipt</dt>
            <dd>
              <span className="source-chip-row">
                <span className="source-chip">{specimen.source.agency}</span>
                <span className="source-chip">{specimen.source.documentCode}</span>
                <span className="source-chip">Verified {specimen.source.verifiedDate}</span>
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
