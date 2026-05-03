import type { WorkbenchSpecimen } from "../../types/workbench";

type Props = {
  specimen: WorkbenchSpecimen;
  titleId: string;
};

function verificationMethodLabel(
  method: NonNullable<WorkbenchSpecimen["verifiedAgainstSource"]>["method"]
) {
  return method === "manual_pdf_check" ? "manual PDF check" : "automated";
}

export function FrameBeat({ specimen, titleId }: Props) {
  const verification = specimen.verifiedAgainstSource;
  const { answerFrame } = specimen;

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
          <div
            className="answer-frame"
            aria-labelledby={`${specimen.id}-answer-frame-title`}
            data-testid={`answer-frame-${specimen.id}`}
          >
            <p className="answer-frame-eyebrow">{answerFrame.eyebrow}</p>
            <h3 className="answer-frame-title" id={`${specimen.id}-answer-frame-title`}>
              Full item context
            </h3>
            <p className="answer-frame-prompt">{answerFrame.prompt}</p>
            <ul className="answer-frame-context">
              {answerFrame.context.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            {answerFrame.responseOptions && (
              <ol className="answer-frame-options" aria-label="Relevant answer choices">
                {answerFrame.responseOptions.map((option) => (
                  <li
                    key={option.id}
                    className={`answer-frame-option ${option.isTarget ? "is-target" : ""}`}
                  >
                    <span>{option.text}</span>
                    {option.note && <span className="answer-frame-option-note">{option.note}</span>}
                  </li>
                ))}
              </ol>
            )}
            <p className="answer-frame-target" data-testid={`answer-frame-target-${specimen.id}`}>
              <span>{answerFrame.targetLabel}</span>
              <mark>{answerFrame.targetText}</mark>
            </p>
            <p className="answer-frame-task">{answerFrame.taskPrompt}</p>
            {answerFrame.methodNote && (
              <details className="answer-frame-details">
                <summary>Advanced note</summary>
                <p>{answerFrame.methodNote}</p>
              </details>
            )}
          </div>
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
              <details
                className="source-manifest"
                data-testid={`source-manifest-${specimen.id}`}
              >
                <summary className="source-manifest-summary">
                  <span className="source-manifest-summary-label">
                    Full source manifest
                  </span>
                  <span className="source-chip-row" aria-label="Source receipt markers">
                    <span className="source-chip">{specimen.source.agency}</span>
                    <span className="source-chip">{specimen.source.documentCode}</span>
                    <span className="source-chip">{specimen.source.year}</span>
                  </span>
                </summary>
                <dl className="source-manifest-list">
                  <dt>Report title</dt>
                  <dd>{specimen.source.reportTitle}</dd>
                  <dt>Agency</dt>
                  <dd>{specimen.source.agency}</dd>
                  <dt>Year</dt>
                  <dd>{specimen.source.year}</dd>
                  <dt>Section/page reference</dt>
                  <dd>{specimen.source.sectionOrPage}</dd>
                  <dt>Retrieval URL</dt>
                  <dd>
                    <a
                      className="source-manifest-link"
                      href={specimen.source.directUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {specimen.source.directUrl}
                    </a>
                  </dd>
                  <dt>Retrieval date</dt>
                  <dd>{specimen.source.retrievalDate}</dd>
                  {verification && (
                    <>
                      <dt>Verification stamp</dt>
                      <dd>checked against cited PDF on {verification.date}</dd>
                      <dt>Method</dt>
                      <dd>{verificationMethodLabel(verification.method)}</dd>
                    </>
                  )}
                </dl>
              </details>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
