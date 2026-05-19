import { useCallback, useEffect, useReducer, type CSSProperties } from "react";
import { initialWidgetState, type WidgetState } from "../lib/diagnostics";
import { patternMeta } from "../lib/pattern-meta";
import {
  usePracticeState,
  type LegacyPracticeRecord
} from "../lib/practice-state";
import type {
  VignetteOutcome,
  WorkbenchSpecimen
} from "../types/workbench";
import { CaseLab } from "./workbench/CaseLab";
import { DiagnoseBeat } from "./workbench/DiagnoseBeat";
import { ExampleExperienceRouter } from "./workbench/ExampleExperience";
import { FrameBeat } from "./workbench/FrameBeat";
import { MicroCaseBeat } from "./workbench/MicroCaseBeat";
import { PredictBeat } from "./workbench/PredictBeat";
import { ProbeBeat } from "./workbench/ProbeBeat";
import { RevealBeat } from "./workbench/RevealBeat";
import { PatternApplicationDetails } from "./PatternApplicationDetails";

type PredictionMap = Record<string, VignetteOutcome | null>;

type WorkbenchState = {
  predictionSubmitted: boolean;
  revealedNeighborContrast: boolean;
  predictions: PredictionMap;
  mechanismChoiceId: string | null;
  widgetState: WidgetState;
  microCaseAnswers: Record<string, number | null>;
  microCaseSubmitted: Record<string, boolean>;
};

type Action =
  | { type: "set_prediction"; vignetteId: string; outcome: VignetteOutcome }
  | { type: "set_mechanism"; choiceId: string }
  | { type: "reveal_diagnosis" }
  | { type: "reveal_neighbor_contrast" }
  | { type: "set_widget_state"; widgetState: WidgetState }
  | { type: "set_microcase_answer"; microCaseId: string; answer: number }
  | { type: "submit_microcase"; microCaseId: string };

function createInitialState(
  specimen: WorkbenchSpecimen,
  savedPractice?: LegacyPracticeRecord
): WorkbenchState {
  const predictions: PredictionMap = {};
  const microCaseAnswers: Record<string, number | null> = {};
  const microCaseSubmitted: Record<string, boolean> = {};

  for (const vignette of specimen.vignettes) {
    predictions[vignette.id] = savedPractice?.predictions?.[vignette.id] ?? null;
  }

  for (const microCase of specimen.microCases) {
    const savedAnswer = savedPractice?.microCaseAnswers?.[microCase.id];
    const answer =
      typeof savedAnswer === "number" &&
      savedAnswer >= 0 &&
      savedAnswer < microCase.featureChoices.length
        ? savedAnswer
        : null;
    microCaseAnswers[microCase.id] = answer;
    microCaseSubmitted[microCase.id] =
      answer !== null && savedPractice?.microCaseSubmitted?.[microCase.id] === true;
  }

  const mechanismChoiceId =
    savedPractice?.mechanismChoiceId &&
    specimen.mechanismQuestion.choices.some(
      (choice) => choice.id === savedPractice.mechanismChoiceId
    )
      ? savedPractice.mechanismChoiceId
      : null;
  const allPredicted = specimen.vignettes.every(
    (vignette) => predictions[vignette.id] !== null
  );
  const canRestoreReveal = allPredicted && mechanismChoiceId !== null;

  return {
    predictionSubmitted:
      canRestoreReveal && savedPractice?.predictionSubmitted === true,
    revealedNeighborContrast: savedPractice?.revealedNeighborContrast === true,
    predictions,
    mechanismChoiceId,
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

function compactLegacyPractice(
  specimen: WorkbenchSpecimen,
  state: WorkbenchState
): LegacyPracticeRecord {
  const record: LegacyPracticeRecord = {};
  const predictions: Record<string, VignetteOutcome> = {};
  const microCaseAnswers: Record<string, number> = {};
  const microCaseSubmitted: Record<string, boolean> = {};

  for (const vignette of specimen.vignettes) {
    const prediction = state.predictions[vignette.id];
    if (prediction !== null) predictions[vignette.id] = prediction;
  }

  for (const microCase of specimen.microCases) {
    const answer = state.microCaseAnswers[microCase.id];
    if (answer !== null) microCaseAnswers[microCase.id] = answer;
    if (state.microCaseSubmitted[microCase.id]) {
      microCaseSubmitted[microCase.id] = true;
    }
  }

  if (Object.keys(predictions).length > 0) record.predictions = predictions;
  if (state.mechanismChoiceId !== null) {
    record.mechanismChoiceId = state.mechanismChoiceId;
  }
  if (state.predictionSubmitted) record.predictionSubmitted = true;
  if (state.revealedNeighborContrast) record.revealedNeighborContrast = true;
  if (Object.keys(microCaseAnswers).length > 0) {
    record.microCaseAnswers = microCaseAnswers;
  }
  if (Object.keys(microCaseSubmitted).length > 0) {
    record.microCaseSubmitted = microCaseSubmitted;
  }

  return record;
}

function LockedBeatPreview({ canReveal }: { canReveal: boolean }) {
  return (
    <section
      className="workbench-beat workbench-beat--locked-preview"
      aria-label="Sections that unlock after the first judgment"
      data-testid="locked-preview"
    >
      <p className="locked-preview-kicker">Up next</p>
      <p className="locked-preview-note">
        {canReveal
          ? "Use Show explanation to open the route comparison and practice sections."
          : "Mark every scenario and choose the wording feature to unlock the route comparison and practice sections."}
      </p>
      <div className="locked-preview-list">
        {[
          "Compare routes",
          "Try one wording change",
          "What the source supports",
          "Quick practice"
        ].map((label) => (
          <span className="locked-preview-item" key={label}>
            <span aria-hidden="true">+</span>
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}

function LegacyPracticeNotes({
  specimen,
  state,
  canReveal
}: {
  specimen: WorkbenchSpecimen;
  state: WorkbenchState;
  canReveal: boolean;
}) {
  const predictedCount = specimen.vignettes.filter(
    (vignette) => state.predictions[vignette.id] !== null
  ).length;
  const matchedCount = specimen.vignettes.filter(
    (vignette) => state.predictions[vignette.id] === vignette.expectedOutcome
  ).length;
  const correctMechanism = specimen.mechanismQuestion.choices.find(
    (choice) => choice.isCorrect
  );
  const mechanismMatched =
    state.mechanismChoiceId !== null &&
    state.mechanismChoiceId === correctMechanism?.id;
  const submittedPractice = specimen.microCases.filter(
    (microCase) => state.microCaseSubmitted[microCase.id]
  );
  const matchedPractice = submittedPractice.filter(
    (microCase) =>
      state.microCaseAnswers[microCase.id] === microCase.correctFeatureIndex
  );

  return (
    <section
      className="workbench-beat workbench-beat--practice-notes"
      aria-label={`Practice notes for ${specimen.title}`}
      data-testid={`practice-notes-${specimen.id}`}
    >
      <div className="practice-note" aria-live="polite">
        <p className="practice-note-kicker">Practice notes</p>
        <p>
          {predictedCount} of {specimen.vignettes.length} scenario routes marked.
          {predictedCount > 0
            ? ` ${matchedCount} matched the teaching route.`
            : ""}
        </p>
        <p>
          {state.mechanismChoiceId === null
            ? "Wording-feature choice not marked yet."
            : mechanismMatched
            ? "Wording feature matched the teaching diagnosis."
            : "Wording feature compared with the teaching diagnosis."}
        </p>
        <p>
          {state.predictionSubmitted
            ? submittedPractice.length > 0
              ? `${matchedPractice.length} of ${submittedPractice.length} quick-practice routes matched.`
              : "Quick practice is ready."
            : canReveal
            ? "Explanation is ready."
            : "Explanation unlocks after the first two decisions."}
        </p>
      </div>
    </section>
  );
}

function LegacyWorkbenchContent({
  specimen,
  titleId,
  savedPractice,
  onPracticeChange
}: {
  specimen: WorkbenchSpecimen;
  titleId: string;
  savedPractice?: LegacyPracticeRecord;
  onPracticeChange: (record: LegacyPracticeRecord) => void;
}) {
  const [state, dispatch] = useReducer(
    reducer,
    { specimen, savedPractice },
    ({ specimen: initialSpecimen, savedPractice: initialPractice }) =>
      createInitialState(initialSpecimen, initialPractice)
  );
  const allPredicted = specimen.vignettes.every(
    (vignette) => state.predictions[vignette.id] !== null
  );
  const canReveal = allPredicted && state.mechanismChoiceId !== null;

  useEffect(() => {
    onPracticeChange(compactLegacyPractice(specimen, state));
  }, [onPracticeChange, specimen, state]);

  return (
    <>
      <FrameBeat specimen={specimen} titleId={titleId} />
      <PredictBeat
        specimen={specimen}
        predictions={state.predictions}
        mechanismChoiceId={state.mechanismChoiceId}
        revealed={state.predictionSubmitted}
        canReveal={canReveal}
        onPredictionChange={(vignetteId, outcome) =>
          dispatch({ type: "set_prediction", vignetteId, outcome })
        }
        onMechanismChange={(choiceId) => dispatch({ type: "set_mechanism", choiceId })}
        onReveal={() => dispatch({ type: "reveal_diagnosis" })}
      />
      <LegacyPracticeNotes specimen={specimen} state={state} canReveal={canReveal} />

      {!state.predictionSubmitted && <LockedBeatPreview canReveal={canReveal} />}

      {state.predictionSubmitted && (
        <>
          <DiagnoseBeat
            specimen={specimen}
            predictions={state.predictions}
            mechanismChoiceId={state.mechanismChoiceId}
            revealedNeighborContrast={state.revealedNeighborContrast}
            onRevealNeighborContrast={() => dispatch({ type: "reveal_neighbor_contrast" })}
          />
          {specimen.methodNote && (
            <section
              className="workbench-beat workbench-beat--method-note"
              aria-label={`Method note for ${specimen.title}`}
              data-testid={`method-note-${specimen.id}`}
            >
              <details className="method-note-details">
                <summary className="method-note-summary">
                  Why this example is here
                </summary>
                <div className="method-note-body">
                  <p>{specimen.methodNote.whyHere}</p>
                  <p>{specimen.methodNote.whatOmitted}</p>
                </div>
              </details>
            </section>
          )}
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
              <p className="beat-eyebrow">Quick practice</p>
              <h3 className="beat-title" id={`${specimen.id}-microcases-title`}>
                Try the same idea on two short examples
              </h3>
              <p className="beat-lede">
                One practice item uses the same problem type. The other is a
                nearby problem that can look similar at first.
              </p>
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
          <PatternApplicationDetails pattern={specimen.pattern} />
        </>
      )}
    </>
  );
}

export function Workbench({ specimen }: { specimen: WorkbenchSpecimen }) {
  const {
    state: practiceState,
    setCaseLabRecord,
    setLegacyRecord
  } = usePracticeState();
  const titleId = `${specimen.id}-workbench-title`;
  const accentVar = patternMeta[specimen.pattern].accentVar;
  const style = {
    "--workbench-accent": `var(${accentVar})`
  } as CSSProperties;
  const specimenPractice = practiceState.specimens[specimen.id];
  const saveCaseLabPractice = useCallback(
    (record: NonNullable<typeof specimenPractice>["caseLab"]) => {
      setCaseLabRecord(specimen.id, record ?? {});
    },
    [setCaseLabRecord, specimen.id]
  );
  const saveLegacyPractice = useCallback(
    (record: LegacyPracticeRecord) => {
      setLegacyRecord(specimen.id, record);
    },
    [setLegacyRecord, specimen.id]
  );

  return (
    <article
      className="workbench"
      id={`workbench-${specimen.number}-${specimen.id}`}
      data-testid={`workbench-${specimen.id}`}
      aria-labelledby={titleId}
      style={style}
    >
      {specimen.experience ? (
        <ExampleExperienceRouter
          specimen={specimen as WorkbenchSpecimen & { experience: NonNullable<WorkbenchSpecimen["experience"]> }}
          titleId={titleId}
        />
      ) : specimen.caseLab ? (
        <CaseLab
          specimen={specimen}
          titleId={titleId}
          savedPractice={specimenPractice?.caseLab}
          onPracticeChange={saveCaseLabPractice}
        />
      ) : (
        <LegacyWorkbenchContent
          specimen={specimen}
          titleId={titleId}
          savedPractice={specimenPractice?.legacy}
          onPracticeChange={saveLegacyPractice}
        />
      )}
    </article>
  );
}
