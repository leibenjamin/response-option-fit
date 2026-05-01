import { useReducer } from "react";
import { initialWidgetState, type WidgetState } from "../lib/diagnostics";
import type {
  ConfidenceLevel,
  VignetteOutcome,
  WorkbenchSpecimen
} from "../types/workbench";
import { DiagnoseBeat } from "./workbench/DiagnoseBeat";
import { FrameBeat } from "./workbench/FrameBeat";
import { MicroCaseBeat } from "./workbench/MicroCaseBeat";
import { PredictBeat } from "./workbench/PredictBeat";
import { ProbeBeat } from "./workbench/ProbeBeat";
import { RevealBeat } from "./workbench/RevealBeat";

type PredictionMap = Record<string, VignetteOutcome | null>;

type WorkbenchState = {
  predictionSubmitted: boolean;
  revealedNeighborContrast: boolean;
  predictions: PredictionMap;
  confidence: ConfidenceLevel | null;
  mechanismChoiceId: string | null;
  widgetState: WidgetState;
  microCaseAnswers: Record<string, number | null>;
  microCaseSubmitted: Record<string, boolean>;
};

type Action =
  | { type: "set_prediction"; vignetteId: string; outcome: VignetteOutcome }
  | { type: "set_confidence"; confidence: ConfidenceLevel }
  | { type: "set_mechanism"; choiceId: string }
  | { type: "reveal_diagnosis" }
  | { type: "reveal_neighbor_contrast" }
  | { type: "set_widget_state"; widgetState: WidgetState }
  | { type: "set_microcase_answer"; microCaseId: string; answer: number }
  | { type: "submit_microcase"; microCaseId: string };

function createInitialState(specimen: WorkbenchSpecimen): WorkbenchState {
  const predictions: PredictionMap = {};
  const microCaseAnswers: Record<string, number | null> = {};
  const microCaseSubmitted: Record<string, boolean> = {};

  for (const vignette of specimen.vignettes) {
    predictions[vignette.id] = null;
  }

  for (const microCase of specimen.microCases) {
    microCaseAnswers[microCase.id] = null;
    microCaseSubmitted[microCase.id] = false;
  }

  return {
    predictionSubmitted: false,
    revealedNeighborContrast: false,
    predictions,
    confidence: null,
    mechanismChoiceId: null,
    widgetState: initialWidgetState(specimen.widget),
    microCaseAnswers,
    microCaseSubmitted
  };
}

function reducer(state: WorkbenchState, action: Action): WorkbenchState {
  switch (action.type) {
    case "set_prediction":
      return {
        ...state,
        predictions: {
          ...state.predictions,
          [action.vignetteId]: action.outcome
        }
      };
    case "set_confidence":
      return { ...state, confidence: action.confidence };
    case "set_mechanism":
      return { ...state, mechanismChoiceId: action.choiceId };
    case "reveal_diagnosis":
      return { ...state, predictionSubmitted: true };
    case "reveal_neighbor_contrast":
      return { ...state, revealedNeighborContrast: true };
    case "set_widget_state":
      return { ...state, widgetState: action.widgetState };
    case "set_microcase_answer":
      return {
        ...state,
        microCaseAnswers: {
          ...state.microCaseAnswers,
          [action.microCaseId]: action.answer
        },
        microCaseSubmitted: {
          ...state.microCaseSubmitted,
          [action.microCaseId]: false
        }
      };
    case "submit_microcase":
      return {
        ...state,
        microCaseSubmitted: {
          ...state.microCaseSubmitted,
          [action.microCaseId]: true
        }
      };
  }
}

export function Workbench({ specimen }: { specimen: WorkbenchSpecimen }) {
  const [state, dispatch] = useReducer(
    reducer,
    specimen,
    createInitialState
  );
  const allPredicted = specimen.vignettes.every(
    (vignette) => state.predictions[vignette.id] !== null
  );
  const canReveal = allPredicted && state.mechanismChoiceId !== null;
  const titleId = `${specimen.id}-workbench-title`;

  return (
    <article
      className="workbench"
      id={`workbench-${specimen.number}-${specimen.id}`}
      data-testid={`workbench-${specimen.id}`}
      aria-labelledby={titleId}
    >
      <FrameBeat specimen={specimen} titleId={titleId} />
      <PredictBeat
        specimen={specimen}
        predictions={state.predictions}
        mechanismChoiceId={state.mechanismChoiceId}
        confidence={state.confidence}
        revealed={state.predictionSubmitted}
        canReveal={canReveal}
        onPredictionChange={(vignetteId, outcome) =>
          dispatch({ type: "set_prediction", vignetteId, outcome })
        }
        onMechanismChange={(choiceId) => dispatch({ type: "set_mechanism", choiceId })}
        onConfidenceChange={(confidence) => dispatch({ type: "set_confidence", confidence })}
        onReveal={() => dispatch({ type: "reveal_diagnosis" })}
      />

      {state.predictionSubmitted && (
        <>
          <DiagnoseBeat
            specimen={specimen}
            predictions={state.predictions}
            mechanismChoiceId={state.mechanismChoiceId}
            revealedNeighborContrast={state.revealedNeighborContrast}
            onRevealNeighborContrast={() => dispatch({ type: "reveal_neighbor_contrast" })}
          />
          <ProbeBeat
            specimen={specimen}
            widgetState={state.widgetState}
            onWidgetStateChange={(widgetState) =>
              dispatch({ type: "set_widget_state", widgetState })
            }
          />
          <RevealBeat specimen={specimen} />
          <section
            className="workbench-beat workbench-beat--microcases"
            aria-labelledby={`${specimen.id}-microcases-title`}
          >
            <header className="beat-head">
              <p className="beat-eyebrow">Micro-cases</p>
              <h3 className="beat-title" id={`${specimen.id}-microcases-title`}>
                Try the pattern on fresh wording
              </h3>
            </header>
            <div className="microcase-list">
              {specimen.microCases.map((microCase, index) => (
                <MicroCaseBeat
                  key={microCase.id}
                  microCase={microCase}
                  index={index}
                  answer={state.microCaseAnswers[microCase.id] ?? null}
                  submitted={state.microCaseSubmitted[microCase.id] ?? false}
                  onAnswer={(answer) =>
                    dispatch({
                      type: "set_microcase_answer",
                      microCaseId: microCase.id,
                      answer
                    })
                  }
                  onSubmit={() =>
                    dispatch({ type: "submit_microcase", microCaseId: microCase.id })
                  }
                />
              ))}
            </div>
          </section>
        </>
      )}
    </article>
  );
}
