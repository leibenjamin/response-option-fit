import type { MicroCase } from "../../types/workbench";

type Props = {
  microCase: MicroCase;
  index: number;
  answer: number | null;
  submitted: boolean;
  onAnswer: (answer: number) => void;
  onSubmit: () => void;
};

export function MicroCaseBeat({
  microCase,
  index,
  answer,
  submitted,
  onAnswer,
  onSubmit
}: Props) {
  return (
    <section
      className="microcase"
      aria-labelledby={`${microCase.id}-title`}
      data-testid={`microcase-${microCase.id}`}
    >
      <header className="microcase-head">
        <p className="microcase-eyebrow">
          Micro-case {index + 1} / {microCase.kind === "near_transfer" ? "Near transfer" : "Distractor"}
        </p>
        <h4 className="microcase-title" id={`${microCase.id}-title`}>
          {microCase.wording}
        </h4>
      </header>

      <fieldset className="microcase-fieldset">
        <legend>Failing wording feature</legend>
        <div className="radio-card-list">
          {microCase.featureChoices.map((choice, choiceIndex) => (
            <label key={choice} className="radio-card">
              <input
                type="radio"
                name={`${microCase.id}-feature`}
                value={choiceIndex}
                checked={answer === choiceIndex}
                onChange={() => onAnswer(choiceIndex)}
              />
              <span className="radio-card-mark" aria-hidden="true" />
              <span className="radio-card-body">
                <span className="radio-card-label">{choice}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="button"
        className="microcase-submit"
        disabled={answer === null}
        onClick={onSubmit}
      >
        Submit
      </button>

      {submitted && (
        <div className="microcase-explanation" data-testid="microcase-explanation">
          <p className="microcase-explanation-label">Why this is the match</p>
          <p className="microcase-result">
            Correct feature: {microCase.featureChoices[microCase.correctFeatureIndex]}
          </p>
          <p>{microCase.explanation}</p>
        </div>
      )}
    </section>
  );
}
