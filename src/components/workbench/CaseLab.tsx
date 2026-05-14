import { useEffect, useState } from "react";
import type { CaseLabPracticeRecord } from "../../lib/practice-state";
import type {
  CaseLabProvenance,
  CaseLabRepairOutcomeKind,
  VignetteOutcome,
  WorkbenchSpecimen
} from "../../types/workbench";

type Props = {
  specimen: WorkbenchSpecimen;
  titleId: string;
  savedPractice?: CaseLabPracticeRecord;
  onPracticeChange?: (record: CaseLabPracticeRecord) => void;
};

type ScenarioAnswers = Record<string, VignetteOutcome | null>;

function provenanceLabel(provenance: CaseLabProvenance) {
  switch (provenance) {
    case "teaching_case":
      return "Teaching case";
    case "reported_quote":
      return "Reported quote";
    case "reported_finding":
      return "Reported finding";
    case "source_grounded_stress_case":
      return "Source-grounded stress case";
  }
}

function provenanceDescription(provenance: CaseLabProvenance) {
  switch (provenance) {
    case "teaching_case":
      return "Invented for this lesson; not reported by the source.";
    case "reported_quote":
      return "Direct or close quote from a cited public report.";
    case "reported_finding":
      return "Summarized finding from a cited public report.";
    case "source_grounded_stress_case":
      return "Constructed teaching case based on a cited source finding.";
  }
}

function repairOutcomeClass(kind: CaseLabRepairOutcomeKind) {
  return `case-lab-repair-result case-lab-repair-result--${kind}`;
}

function ProvenanceBadge({ provenance }: { provenance: CaseLabProvenance }) {
  const label = provenanceLabel(provenance);
  const description = provenanceDescription(provenance);

  return (
    <span
      className={`provenance-badge provenance-badge--${provenance}`}
      aria-label={`${label}: ${description}`}
      title={description}
    >
      {label}
    </span>
  );
}

export function CaseLab({
  specimen,
  titleId,
  savedPractice,
  onPracticeChange
}: Props) {
  const lab = specimen.caseLab;
  if (!lab) return null;

  const [scenarioAnswers, setScenarioAnswers] = useState<ScenarioAnswers>(() =>
    Object.fromEntries(
      lab.scenarios.map((scenario) => [
        scenario.id,
        savedPractice?.scenarioAnswers?.[scenario.id] ?? null
      ])
    )
  );
  /* Feedback gating: the first three scenarios show feedback immediately on
     judgment (scaffolded acquisition). The last three scenarios hide the
     feedback behind a "Show explanation" button so the learner has to
     commit to a judgment before reading the route explanation
     (retrieval-practice support, per Karpicke & Blunt 2011 and Roediger &
     Karpicke 2006). Ephemeral state: not persisted across reload. */
  const [revealedFeedback, setRevealedFeedback] = useState<Record<string, boolean>>(
    {}
  );
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const firstRepairId = lab.repairBench.options[0].id;
  const [selectedRepairId, setSelectedRepairId] = useState(() =>
    savedPractice?.selectedRepairId &&
    lab.repairBench.options.some((option) => option.id === savedPractice.selectedRepairId)
      ? savedPractice.selectedRepairId
      : firstRepairId
  );
  const [repairBenchSeen, setRepairBenchSeen] = useState(
    () => savedPractice?.repairBenchSeen ?? false
  );
  const [transferAnswer, setTransferAnswer] = useState<VignetteOutcome | null>(
    () => savedPractice?.transferAnswer ?? null
  );

  const answeredCount = lab.scenarios.filter(
    (scenario) => scenarioAnswers[scenario.id] !== null
  ).length;
  const matchedCount = lab.scenarios.filter(
    (scenario) => scenarioAnswers[scenario.id] === scenario.expectedOutcome
  ).length;
  const allScenariosAnswered = lab.scenarios.every(
    (scenario) => scenarioAnswers[scenario.id] !== null
  );
  const activeScenario = lab.scenarios[activeScenarioIndex];
  const activeScenarioOutcome = scenarioAnswers[activeScenario.id];
  const activeScenarioAnswered = activeScenarioOutcome !== null;
  const activeScenarioCorrect =
    activeScenarioOutcome === activeScenario.expectedOutcome;
  /* Cases at indices 0–2 show feedback immediately; cases 3+ gate it
     behind an explicit reveal. See `revealedFeedback` comment above. */
  const activeScenarioGated = activeScenarioIndex >= 3;
  const activeScenarioFeedbackRevealed = activeScenarioGated
    ? Boolean(revealedFeedback[activeScenario.id])
    : true;
  const showActiveScenarioFeedback =
    activeScenarioAnswered && activeScenarioFeedbackRevealed;
  const showActiveScenarioGate =
    activeScenarioAnswered && activeScenarioGated && !activeScenarioFeedbackRevealed;
  const selectedRepair =
    lab.repairBench.options.find((option) => option.id === selectedRepairId) ??
    lab.repairBench.options[0];
  const transferUnlocked = allScenariosAnswered && repairBenchSeen;
  const transferAnswered = transferAnswer !== null;
  const transferCorrect =
    transferAnswer === lab.transferChallenge.expectedOutcome;

  useEffect(() => {
    const answered = Object.fromEntries(
      Object.entries(scenarioAnswers).filter(
        (entry): entry is [string, VignetteOutcome] => entry[1] !== null
      )
    );
    const record: CaseLabPracticeRecord = {};
    if (Object.keys(answered).length > 0) record.scenarioAnswers = answered;
    if (selectedRepairId !== firstRepairId || repairBenchSeen) {
      record.selectedRepairId = selectedRepairId;
    }
    if (repairBenchSeen) record.repairBenchSeen = true;
    if (transferAnswer !== null) record.transferAnswer = transferAnswer;
    onPracticeChange?.(record);
  }, [
    firstRepairId,
    onPracticeChange,
    repairBenchSeen,
    scenarioAnswers,
    selectedRepairId,
    transferAnswer
  ]);

  const choiceLabel = (outcome: VignetteOutcome) =>
    lab.judgmentChoices.find((choice) => choice.outcome === outcome)?.label ??
    outcome;

  const setScenarioOutcome = (
    scenarioId: string,
    outcome: VignetteOutcome
  ) => {
    setScenarioAnswers((current) => ({
      ...current,
      [scenarioId]: outcome
    }));
  };

  return (
    <>
      <section
        className="workbench-beat workbench-beat--case-lab"
        aria-labelledby={titleId}
        data-testid={`case-lab-${specimen.id}`}
      >
        <header className="beat-head case-lab-head">
          <p className="beat-eyebrow">
            <span>{lab.eyebrow}</span>
            <span aria-hidden="true">/</span>
            <span>{specimen.patternLabel}</span>
          </p>
          <h2 className="beat-title" id={titleId}>
            {lab.title}
          </h2>
          <p className="beat-lede">{lab.lede}</p>
          <p className="case-lab-setup">{lab.setup}</p>
        </header>

        <div className="case-lab-grid">
          <div className="case-lab-frame" data-testid="case-lab-answer-frame">
            <p className="case-lab-kicker">{lab.answerFrame.eyebrow}</p>
            <h3>Survey question and answer choices</h3>
            <p className="case-lab-prompt">{lab.answerFrame.prompt}</p>
            <div className="case-lab-target">
              <p>{lab.answerFrame.targetLabel}</p>
              <mark>{lab.answerFrame.targetText}</mark>
            </div>
            <div className="case-lab-intended">
              <p className="case-lab-kicker">Intended meaning</p>
              <p>{lab.answerFrame.intendedMeaning}</p>
            </div>
            <div
              className="case-lab-options-panel"
              aria-label="Full answer list and setup notes"
            >
              <p className="case-lab-kicker">Full answer list</p>
              <ol className="case-lab-options" aria-label="Answer choices">
                {lab.answerFrame.responseOptions.map((option) => (
                  <li
                    className={`case-lab-option ${option.isTarget ? "is-target" : ""}`}
                    key={option.id}
                  >
                    <span className="case-lab-option-text">{option.text}</span>
                    {option.note && (
                      <span className="case-lab-option-note">{option.note}</span>
                    )}
                  </li>
                ))}
              </ol>
              <ul className="case-lab-context">
                {lab.answerFrame.context.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <details className="case-lab-options-details">
              <summary>Show full answer list and setup notes</summary>
              <ol className="case-lab-options" aria-label="Answer choices">
                {lab.answerFrame.responseOptions.map((option) => (
                  <li
                    className={`case-lab-option ${option.isTarget ? "is-target" : ""}`}
                    key={option.id}
                  >
                    <span className="case-lab-option-text">{option.text}</span>
                    {option.note && (
                      <span className="case-lab-option-note">{option.note}</span>
                    )}
                  </li>
                ))}
              </ol>
              <ul className="case-lab-context">
                {lab.answerFrame.context.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </details>
          </div>

          <div className="case-lab-task">
            <div className="case-lab-mobile-frame-summary">
              <p className="case-lab-kicker">{lab.answerFrame.eyebrow}</p>
              <p>{lab.answerFrame.prompt}</p>
              <p>
                <span>{lab.answerFrame.targetLabel}:</span>{" "}
                <mark>{lab.answerFrame.targetText}</mark>
              </p>
              <p>
                <span>Intended meaning:</span> {lab.answerFrame.intendedMeaning}
              </p>
            </div>
            <div className="case-lab-task-head">
              <p className="case-lab-kicker">Sort the scenarios</p>
              <h3>Does the highlighted choice fit?</h3>
              <p>
                Decide what the answer choice would make this respondent do.
              </p>
            </div>

            <div
              className="case-lab-judgment-legend"
              aria-label="Judgment labels"
            >
              {lab.judgmentChoices.map((choice) => (
                <span className="case-lab-judgment-chip" key={choice.outcome}>
                  <strong>{choice.label}</strong>
                  <span>{choice.description}</span>
                </span>
              ))}
            </div>

            <div className="case-lab-scenario-deck">
              <div className="case-lab-deck-status" aria-live="polite">
                {answeredCount} of {lab.scenarios.length} teaching cases sorted
              </div>

              <article
                className="case-lab-scenario"
                aria-labelledby={`${activeScenario.id}-title`}
              >
                <div className="case-lab-scenario-topline">
                  <p className="case-lab-kicker">
                    Case {activeScenarioIndex + 1} of {lab.scenarios.length}
                  </p>
                  <ProvenanceBadge provenance={activeScenario.provenance} />
                </div>
                <h4 id={`${activeScenario.id}-title`}>{activeScenario.title}</h4>
                <p className="case-lab-situation">
                  {activeScenario.situation}
                </p>
                <p className="case-lab-reading">
                  <span>Respondent reading before choosing:</span>{" "}
                  {activeScenario.respondentReading}
                </p>
                <div
                  className="case-lab-choice-row"
                  role="group"
                  aria-label={`Judgment for ${activeScenario.title}`}
                >
                  {lab.judgmentChoices.map((choice) => {
                    const active = activeScenarioOutcome === choice.outcome;
                    return (
                      <button
                        key={choice.outcome}
                        type="button"
                        className={`prediction-button ${active ? "is-active" : ""}`}
                        aria-pressed={active}
                        onClick={() =>
                          setScenarioOutcome(activeScenario.id, choice.outcome)
                        }
                      >
                        {choice.label}
                      </button>
                    );
                  })}
                </div>
                {showActiveScenarioGate && (
                  <div className="case-lab-explanation-gate">
                    <button
                      type="button"
                      className="case-lab-explanation-gate-button"
                      onClick={() =>
                        setRevealedFeedback((current) => ({
                          ...current,
                          [activeScenario.id]: true
                        }))
                      }
                      data-testid={`case-lab-show-explanation-${activeScenario.id}`}
                    >
                      Reveal the teaching route
                    </button>
                    <p className="case-lab-explanation-gate-note">
                      Make your call first, then reveal. The first three
                      cases unlock as soon as you choose; this one waits so
                      you commit to a judgment before reading the route.
                    </p>
                  </div>
                )}
                {showActiveScenarioFeedback && (
                  <div className="case-lab-feedback" aria-live="polite">
                    <p className="case-lab-feedback-title">
                      {activeScenarioCorrect ? "Yes." : "Not quite."}{" "}
                      {activeScenario.feedbackTitle}
                    </p>
                    <p>
                      <strong>Teaching route:</strong>{" "}
                      {choiceLabel(activeScenario.expectedOutcome)}
                    </p>
                    <p>{activeScenario.routeExplanation}</p>
                    <p className="case-lab-takeaway">
                      {activeScenario.takeaway}
                    </p>
                  </div>
                )}
                <div className="case-lab-deck-controls">
                  <button
                    type="button"
                    className="case-lab-secondary-button"
                    disabled={activeScenarioIndex === 0}
                    onClick={() =>
                      setActiveScenarioIndex((index) => Math.max(0, index - 1))
                    }
                  >
                    <span aria-hidden="true" className="case-lab-secondary-button-arrow">
                      ←
                    </span>
                    Previous case
                  </button>
                  <button
                    type="button"
                    className="case-lab-secondary-button"
                    disabled={activeScenarioIndex === lab.scenarios.length - 1}
                    onClick={() =>
                      setActiveScenarioIndex((index) =>
                        Math.min(lab.scenarios.length - 1, index + 1)
                      )
                    }
                  >
                    Next case
                    <span aria-hidden="true" className="case-lab-secondary-button-arrow">
                      →
                    </span>
                  </button>
                </div>
              </article>
              <div
                className="case-lab-deck-nav"
                role="group"
                aria-label="Choose a teaching case"
              >
                {lab.scenarios.map((scenario, index) => {
                  const active = index === activeScenarioIndex;
                  const answered = scenarioAnswers[scenario.id] !== null;
                  return (
                    <button
                      key={scenario.id}
                      type="button"
                      className={[
                        "case-lab-deck-button",
                        active ? "is-active" : "",
                        answered ? "is-answered" : ""
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      aria-current={active ? "step" : undefined}
                      aria-label={`Show case ${index + 1}: ${scenario.title}${
                        answered ? ", sorted" : ", not sorted"
                      }`}
                      onClick={() => setActiveScenarioIndex(index)}
                    >
                      <span aria-hidden="true">{index + 1}</span>
                    </button>
                  );
                })}
              </div>
              <div className="practice-note" aria-live="polite">
                <p className="practice-note-kicker">Practice notes</p>
                <p>
                  {answeredCount === 0
                    ? "No teaching cases sorted yet."
                    : `${matchedCount} teaching route${
                        matchedCount === 1 ? "" : "s"
                      } matched after ${answeredCount} sorted.`}
                </p>
                <p>
                  {repairBenchSeen
                    ? "Repair bench checked."
                    : allScenariosAnswered
                    ? "Repair bench ready."
                    : "Repair bench unlocks after every teaching case."}
                </p>
                <p>
                  {transferAnswered
                    ? transferCorrect
                      ? "Transfer route matched."
                      : "Transfer route compared."
                    : transferUnlocked
                    ? "Transfer check ready."
                    : "Transfer check unlocks after the repair bench."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="workbench-beat workbench-beat--case-lab-repair"
        aria-labelledby={`${specimen.id}-repair-title`}
        data-testid={`case-lab-repair-${specimen.id}`}
      >
        <header className="beat-head">
          <p className="beat-eyebrow">Repair bench</p>
          <h3 className="beat-title" id={`${specimen.id}-repair-title`}>
            {lab.repairBench.title}
          </h3>
          <p className="beat-lede">{lab.repairBench.lede}</p>
        </header>

        {!allScenariosAnswered && (
          <div className="case-lab-gate" role="note">
            <p className="case-lab-gate-label">Locked for now</p>
            <p>
              Sort every teaching case to see how wording changes affect the
              same trips.
            </p>
          </div>
        )}

        {allScenariosAnswered && (
          <div className="case-lab-repair-grid">
            <div
              className="case-lab-repair-options"
              role="group"
              aria-label="Wording repair options"
            >
              {lab.repairBench.options.map((option) => {
                const active = option.id === selectedRepairId;
                return (
                  <button
                    type="button"
                    key={option.id}
                    className={`case-lab-repair-button ${active ? "is-active" : ""}`}
                    aria-pressed={active}
                    onClick={() => setSelectedRepairId(option.id)}
                  >
                    <span>{option.label}</span>
                    <strong>{option.revisedChoice}</strong>
                  </button>
                );
              })}
            </div>

            <div className="case-lab-repair-panel" aria-live="polite">
              <p className="case-lab-kicker">Selected wording</p>
              <blockquote>
                <p>{selectedRepair.revisedChoice}</p>
              </blockquote>
              <p>{selectedRepair.explanation}</p>
              <ol className="case-lab-repair-results">
                {lab.scenarios.map((scenario) => {
                  const outcome = selectedRepair.scenarioOutcomes[scenario.id];
                  return (
                    <li key={scenario.id}>
                      <span className={repairOutcomeClass(outcome.kind)}>
                        {outcome.label}
                      </span>
                      <p>
                        <strong>{scenario.title}:</strong> {outcome.rationale}
                      </p>
                    </li>
                  );
                })}
              </ol>
              <button
                type="button"
                className="case-lab-continue-button"
                onClick={() => setRepairBenchSeen(true)}
              >
                Continue to transfer check
              </button>
            </div>
          </div>
        )}
      </section>

      <section
        className="workbench-beat workbench-beat--case-lab-transfer"
        aria-labelledby={`${specimen.id}-transfer-title`}
        data-testid={`case-lab-transfer-${specimen.id}`}
      >
        <header className="beat-head">
          <p className="beat-eyebrow">Transfer check</p>
          <h3 className="beat-title" id={`${specimen.id}-transfer-title`}>
            {lab.transferChallenge.title}
          </h3>
          <p className="beat-lede">{lab.transferChallenge.prompt}</p>
        </header>
        {!allScenariosAnswered && (
          <div className="case-lab-gate" role="note">
            <p className="case-lab-gate-label">Locked for now</p>
            <p>Sort every teaching case before trying the transfer check.</p>
          </div>
        )}
        {allScenariosAnswered && !repairBenchSeen && (
          <div className="case-lab-gate" role="note">
            <p className="case-lab-gate-label">Up next</p>
            <p>Review the repair bench, then continue here for one fresh case.</p>
          </div>
        )}
        {transferUnlocked && (
          <article
            className="case-lab-transfer-card"
            aria-labelledby={`${specimen.id}-transfer-card-title`}
          >
            <div className="case-lab-target case-lab-target--transfer">
              <p>{lab.transferChallenge.targetLabel}</p>
              <mark>{lab.transferChallenge.targetText}</mark>
            </div>
            <h4 id={`${specimen.id}-transfer-card-title`}>
              {lab.transferChallenge.scenarioTitle}
            </h4>
            <p className="case-lab-transfer-scenario">
              {lab.transferChallenge.situation}
            </p>
            <p className="case-lab-reading">
              <span>Respondent reading before choosing:</span>{" "}
              {lab.transferChallenge.respondentReading}
            </p>
            <div
              className="case-lab-choice-row"
              role="group"
              aria-label={`Transfer judgment for ${lab.transferChallenge.scenarioTitle}`}
            >
              {lab.judgmentChoices.map((choice) => {
                const active = transferAnswer === choice.outcome;
                return (
                  <button
                    key={choice.outcome}
                    type="button"
                    className={`prediction-button ${active ? "is-active" : ""}`}
                    aria-pressed={active}
                    onClick={() => setTransferAnswer(choice.outcome)}
                  >
                    {choice.label}
                  </button>
                );
              })}
            </div>
            {transferAnswered && (
              <div className="case-lab-transfer-feedback" aria-live="polite">
                <p>
                  {transferCorrect ? "Correct." : "Close, but not this time."}{" "}
                  {lab.transferChallenge.feedbackTitle}
                </p>
                <p>
                  <strong>Teaching route:</strong>{" "}
                  {choiceLabel(lab.transferChallenge.expectedOutcome)}
                </p>
                <p>{lab.transferChallenge.routeExplanation}</p>
                <p>{lab.transferChallenge.takeaway}</p>
              </div>
            )}
          </article>
        )}
      </section>

      <section
        className="workbench-beat workbench-beat--case-lab-source"
        aria-labelledby={`${specimen.id}-source-anchor-title`}
        data-testid={`case-lab-source-${specimen.id}`}
      >
        <details className="case-lab-source-details">
          <summary>
            <span>Real-world anchor</span>
            <span>
              {specimen.source.agency} ·{" "}
              {specimen.source.documentCode} · {specimen.source.year}
            </span>
          </summary>
          <div className="case-lab-source-body">
            <h3 id={`${specimen.id}-source-anchor-title`}>
              {lab.sourceAnchor.title}
            </h3>
            <p>{lab.sourceAnchor.lede}</p>
            <ol className="case-lab-source-evidence">
              {lab.sourceAnchor.evidence.map((item) => (
                <li key={item.label}>
                  <ProvenanceBadge provenance={item.provenance} />
                  <h4>{item.label}</h4>
                  <p>{item.body}</p>
                  {item.citation && (
                    <p className="case-lab-citation">
                      {item.citation.reportTitle}, {item.citation.page}
                    </p>
                  )}
                </li>
              ))}
            </ol>
            <div className="case-lab-source-limitations">
              <p className="case-lab-kicker">Claim boundary</p>
              <ul>
                {lab.sourceAnchor.limitations.map((limitation) => (
                  <li key={limitation}>{limitation}</li>
                ))}
              </ul>
            </div>
            <dl className="source-manifest-list case-lab-source-receipt">
              <dt>Report title</dt>
              <dd>{specimen.source.reportTitle}</dd>
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
            </dl>
          </div>
        </details>
      </section>
    </>
  );
}
