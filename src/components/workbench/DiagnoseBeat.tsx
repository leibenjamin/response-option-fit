import { workbenchSpecimens } from "../../data/workbench-specimens";
import { outcomeLabel } from "../../lib/outcomes";
import type { VignetteOutcome, WorkbenchSpecimen } from "../../types/workbench";
import { RouteSnapshot } from "../RouteSnapshot";

type PredictionMap = Record<string, VignetteOutcome | null>;

type Props = {
  specimen: WorkbenchSpecimen;
  predictions: PredictionMap;
  mechanismChoiceId: string | null;
  revealedNeighborContrast: boolean;
  onRevealNeighborContrast: () => void;
};

function patternLabel(pattern: WorkbenchSpecimen["pattern"]) {
  return (
    workbenchSpecimens.find((specimen) => specimen.pattern === pattern)?.patternLabel ?? pattern
  );
}

function specimenNumber(specimenId: string) {
  const neighbor = workbenchSpecimens.find((specimen) => specimen.id === specimenId);
  return neighbor ? `Specimen ${neighbor.number}` : "Related specimen";
}

export function DiagnoseBeat({
  specimen,
  predictions,
  mechanismChoiceId,
  revealedNeighborContrast,
  onRevealNeighborContrast
}: Props) {
  const selectedMechanism = specimen.mechanismQuestion.choices.find(
    (choice) => choice.id === mechanismChoiceId
  );
  const correctMechanism = specimen.mechanismQuestion.choices.find((choice) => choice.isCorrect);

  return (
    <section
      className="workbench-beat workbench-beat--diagnose"
      aria-labelledby={`${specimen.id}-diagnose-title`}
      data-testid={`diagnose-${specimen.id}`}
    >
      <header className="beat-head">
        <p className="beat-eyebrow">Diagnose</p>
        <h3 className="beat-title" id={`${specimen.id}-diagnose-title`}>
          Compare your prediction with the documented route
        </h3>
      </header>

      <ol className="diagnosis-list" aria-label="Answer-key diagnosis">
        {specimen.vignettes.map((vignette) => (
          <li key={vignette.id} className="diagnosis-card">
            <p className="diagnosis-text">{vignette.text}</p>
            <div className="diagnosis-badges">
              <span
                className={`outcome-badge outcome-badge--${vignette.expectedOutcome}`}
                data-testid="published-outcome-badge"
              >
                Answer key: {outcomeLabel(vignette.expectedOutcome, specimen.predictionCopy)}
              </span>
              <span className="outcome-badge outcome-badge--user">
                You said: {outcomeLabel(predictions[vignette.id], specimen.predictionCopy)}
              </span>
            </div>
            <p className="diagnosis-rationale" data-testid="diagnosis-rationale">
              {vignette.outcomeRationale}
            </p>
          </li>
        ))}
      </ol>

      {selectedMechanism && correctMechanism && (
        <div className="mechanism-result">
          <p className="mechanism-result-eyebrow">Mechanism check</p>
          <p className="mechanism-result-body">
            You chose: {selectedMechanism.text}
          </p>
          <p className="mechanism-result-body">
            Authored key: {correctMechanism.text}
          </p>
          <p className="mechanism-result-note">{selectedMechanism.explanation}</p>
        </div>
      )}

      <RouteSnapshot routeStages={specimen.routeStages} />

      <div className="neighbor-contrast">
        {revealedNeighborContrast ? (
          <div className="neighbor-contrast-card">
            <p className="neighbor-contrast-eyebrow">Nearest neighbor</p>
            <p className="neighbor-contrast-title">
              {patternLabel(specimen.neighborContrast.pattern)} in{" "}
              {specimenNumber(specimen.neighborContrast.neighborSpecimenId)}
            </p>
            <p className="neighbor-contrast-body">
              {specimen.neighborContrast.contrastText}
            </p>
          </div>
        ) : (
          <button
            type="button"
            className="neighbor-contrast-button"
            onClick={onRevealNeighborContrast}
          >
            Reveal neighbor contrast
          </button>
        )}
      </div>
    </section>
  );
}
