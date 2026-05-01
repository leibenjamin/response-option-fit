import type {
  ConfidenceLevel,
  VignetteOutcome,
  WorkbenchSpecimen
} from "../../types/workbench";

type PredictionMap = Record<string, VignetteOutcome | null>;

type Props = {
  specimen: WorkbenchSpecimen;
  predictions: PredictionMap;
  mechanismChoiceId: string | null;
  confidence: ConfidenceLevel | null;
  revealed: boolean;
  canReveal: boolean;
  onPredictionChange: (vignetteId: string, outcome: VignetteOutcome) => void;
  onMechanismChange: (choiceId: string) => void;
  onConfidenceChange: (confidence: ConfidenceLevel) => void;
  onReveal: () => void;
};

const predictionChoices: Array<{ value: VignetteOutcome; label: string }> = [
  { value: "covered", label: "Covered" },
  { value: "ambiguous", label: "Ambiguous" },
  { value: "not_covered", label: "Not covered" }
];

const predictionLegend = [
  {
    label: "Covered",
    body: "the wording captures this cleanly"
  },
  {
    label: "Ambiguous",
    body: "could route more than one way"
  },
  {
    label: "Not covered",
    body: "no option fits cleanly"
  }
];

const confidenceChoices: Array<{ value: ConfidenceLevel; label: string }> = [
  { value: "guessing", label: "Guessing" },
  { value: "hunch", label: "Hunch" },
  { value: "fairly_sure", label: "Fairly sure" }
];

function provenanceLabel(provenance: WorkbenchSpecimen["vignettes"][number]["provenance"]) {
  return provenance === "direct_quote" ? "Direct quote" : "Editorial illustration";
}

function provenanceDescription(provenance: WorkbenchSpecimen["vignettes"][number]["provenance"]) {
  return provenance === "direct_quote"
    ? "Verbatim or close paraphrase from a public cognitive-testing transcript."
    : "Constructed by us, anchored to a specific report finding (see attribution note below the vignette text).";
}

export function PredictBeat({
  specimen,
  predictions,
  mechanismChoiceId,
  confidence,
  revealed,
  canReveal,
  onPredictionChange,
  onMechanismChange,
  onConfidenceChange,
  onReveal
}: Props) {
  const selectedMechanism = specimen.mechanismQuestion.choices.find(
    (choice) => choice.id === mechanismChoiceId
  );

  return (
    <section className="workbench-beat workbench-beat--predict" aria-labelledby={`${specimen.id}-predict-title`}>
      <header className="beat-head">
        <p className="beat-eyebrow">Predict</p>
        <h3 className="beat-title" id={`${specimen.id}-predict-title`}>
          Mark how the published wording would route each respondent below.
          Reveal the diagnosis after you commit.
        </h3>
      </header>

      <div className="prediction-mini-legend" aria-label="Prediction terms">
        {predictionLegend.map((item) => (
          <span className="prediction-mini-chip" key={item.label}>
            <strong>{item.label}</strong>
            <span>{item.body}</span>
          </span>
        ))}
      </div>

      <ol className="vignette-list" aria-label="Prediction vignettes">
        {specimen.vignettes.map((vignette) => (
          <li key={vignette.id} className="vignette-card">
            <div className="vignette-card-head">
              <abbr
                className={`provenance-badge provenance-badge--${vignette.provenance}`}
                tabIndex={0}
                title={provenanceDescription(vignette.provenance)}
              >
                {provenanceLabel(vignette.provenance)}
              </abbr>
            </div>
            <p className="vignette-text">{vignette.text}</p>
            {vignette.attributionNote && (
              <p className="vignette-note">{vignette.attributionNote}</p>
            )}
            <div className="prediction-controls" role="group" aria-label={`Prediction for ${vignette.id}`}>
              {predictionChoices.map((choice) => {
                const active = predictions[vignette.id] === choice.value;
                return (
                  <button
                    key={choice.value}
                    type="button"
                    className={`prediction-button ${active ? "is-active" : ""}`}
                    aria-pressed={active}
                    onClick={() => onPredictionChange(vignette.id, choice.value)}
                  >
                    {choice.label}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ol>

      <fieldset className="mechanism-fieldset">
        <legend>{specimen.mechanismQuestion.prompt}</legend>
        <div className="radio-card-list">
          {specimen.mechanismQuestion.choices.map((choice) => (
            <label key={choice.id} className="radio-card">
              <input
                type="radio"
                name={`${specimen.id}-mechanism`}
                value={choice.id}
                checked={mechanismChoiceId === choice.id}
                onChange={() => onMechanismChange(choice.id)}
              />
              <span className="radio-card-mark" aria-hidden="true" />
              <span className="radio-card-body">
                <span className="radio-card-label">{choice.text}</span>
              </span>
            </label>
          ))}
        </div>
        {revealed && selectedMechanism && (
          <p className="mechanism-explanation">{selectedMechanism.explanation}</p>
        )}
      </fieldset>

      <fieldset className="confidence-fieldset">
        <legend>Confidence</legend>
        <div className="segmented-radios">
          {confidenceChoices.map((choice) => (
            <label key={choice.value} className="segmented-radio">
              <input
                type="radio"
                name={`${specimen.id}-confidence`}
                value={choice.value}
                checked={confidence === choice.value}
                onChange={() => onConfidenceChange(choice.value)}
              />
              <span>{choice.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="reveal-gate">
        <button
          type="button"
          className="reveal-gate-button"
          data-testid={`reveal-gate-${specimen.id}`}
          disabled={!canReveal || revealed}
          onClick={onReveal}
        >
          {revealed ? "Diagnosis revealed" : "Reveal diagnosis"}
        </button>
        {!canReveal && (
          <p className="reveal-gate-note">
            Mark every vignette and choose a mechanism to reveal the diagnosis.
          </p>
        )}
      </div>
    </section>
  );
}
