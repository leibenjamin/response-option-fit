import { useEffect, useState } from "react";
import {
  buildTopics,
  evaluateTopic,
  optionLabel,
  type BuildSituationResult,
  type BuildTopic,
  type SituationFate
} from "../data/build-and-break";

const MIN_CHOICES = 4;

const fateLabels: Record<SituationFate, string> = {
  clean: "Clean",
  split: "Split",
  forced: "Forced",
  lost: "Lost"
};

function toggleId(ids: readonly string[], id: string) {
  return ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];
}

function formatLabels(topic: BuildTopic, ids: readonly string[]) {
  return ids.map((id) => optionLabel(topic, id)).join(" + ");
}

function resultCopy(topic: BuildTopic, result: BuildSituationResult) {
  if (result.fate === "clean") {
    return `Recorded as ${formatLabels(topic, result.cleanHomes)}. This situation has one stable home in the form you built.`;
  }

  const authoredCopy = result.situation.fateCopy?.[result.fate];
  if (authoredCopy) return authoredCopy;

  if (result.fate === "split") {
    return "More than one selected answer can honestly hold this situation. The list needs a rule, not just another label.";
  }
  if (result.fate === "forced") {
    return "The situation can be filed somewhere nearby, but the recorded answer hides the distinction that mattered.";
  }
  return "No selected answer can hold this situation, so the form loses it before analysis starts.";
}

function resultHomes(topic: BuildTopic, result: BuildSituationResult) {
  if (result.fate === "lost") return "No offered answer";
  if (result.fate === "forced") return formatLabels(topic, result.forcedHomes);
  return formatLabels(topic, result.cleanHomes);
}

function makeInitialRecord() {
  return Object.fromEntries(buildTopics.map((topic) => [topic.id, [] as string[]]));
}

function runStatus(selectedCount: number, canRun: boolean, hasRun: boolean) {
  const count = `${selectedCount} selected`;
  if (canRun) return count;
  if (hasRun) {
    return `${count}; below the four-choice start gate, but results still update live`;
  }
  return `${count}; choose ${MIN_CHOICES - selectedCount} more to run`;
}

export function BuildAndBreakRoute() {
  const [activeTopicId, setActiveTopicId] = useState(buildTopics[0].id);
  const [chosenByTopic, setChosenByTopic] = useState<Record<string, string[]>>(
    makeInitialRecord
  );
  const [runTopics, setRunTopics] = useState<Record<string, boolean>>({});

  const topic =
    buildTopics.find((candidate) => candidate.id === activeTopicId) ??
    buildTopics[0];
  const chosenIds = chosenByTopic[topic.id] ?? [];
  const selectedCount = chosenIds.length;
  const canRun = selectedCount >= MIN_CHOICES;
  const hasRun = runTopics[topic.id] === true;
  const result = evaluateTopic(topic, chosenIds);
  const brokenCount =
    result.counts.split + result.counts.forced + result.counts.lost;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const normalized = window.location.hash.replace(/^#\/?/, "").toLowerCase();
    if (normalized !== "build") return;
    document.getElementById("build-and-break-title")?.focus({
      preventScroll: false
    });
  }, []);

  const toggleChoice = (id: string) => {
    setChosenByTopic((previous) => ({
      ...previous,
      [topic.id]: toggleId(previous[topic.id] ?? [], id)
    }));
  };

  const resetTopic = () => {
    setChosenByTopic((previous) => ({ ...previous, [topic.id]: [] }));
    setRunTopics((previous) => ({ ...previous, [topic.id]: false }));
  };

  const runCurrentTopic = () => {
    if (!canRun) return;
    setRunTopics((previous) => ({ ...previous, [topic.id]: true }));
  };

  return (
    <main
      id="build-and-break"
      className="build-route"
      aria-labelledby="build-and-break-title"
      data-testid="build-and-break-route"
    >
      <header className="build-route-head">
        <p className="build-route-eyebrow">Build-and-break</p>
        <h1
          className="build-route-title"
          id="build-and-break-title"
          tabIndex={-1}
        >
          Build the answer choices. Then watch the edge cases use them.
        </h1>
        <p className="build-route-lede">
          This is not a quiz about picking the correct list. It is a small
          deterministic test of what happens after a reasonable answer set
          meets people who do not fit one box cleanly.
        </p>
      </header>

      <section className="build-topic-tabs" aria-label="Build-and-break topics">
        {buildTopics.map((candidate) => (
          <button
            type="button"
            className={`build-topic-tab ${candidate.id === topic.id ? "is-active" : ""}`}
            aria-pressed={candidate.id === topic.id}
            onClick={() => setActiveTopicId(candidate.id)}
            key={candidate.id}
            data-testid={`build-topic-${candidate.id}`}
          >
            <span>{candidate.label}</span>
            <small>{candidate.shortLabel}</small>
          </button>
        ))}
      </section>

      <article
        className={`build-topic build-topic--${topic.id}`}
        data-testid={`build-topic-panel-${topic.id}`}
      >
        <section className="build-instrument" aria-labelledby="build-stem">
          <div className="build-instrument-copy">
            <p className="build-section-eyebrow">
              {topic.isTeachingCase ? "Teaching case" : "Source-anchored topic"}
            </p>
            <h2 id="build-stem">{topic.stem}</h2>
            <p>{topic.framing}</p>
          </div>
          {topic.sourceNote && (
            <p className="build-source-note" data-testid={`build-source-${topic.id}`}>
              {topic.sourceNote}
            </p>
          )}
        </section>

        <section
          className="build-palette"
          aria-labelledby={`build-palette-${topic.id}`}
        >
          <header className="build-section-head">
            <p className="build-section-eyebrow">1. Build</p>
            <h2 id={`build-palette-${topic.id}`}>Choose at least four answer choices</h2>
            <p>
              Every chip is plausible. Add more if you think the form needs
              more places for reality to land.
            </p>
          </header>

          <div className="build-option-grid">
            {topic.palette.map((option) => {
              const selected = chosenIds.includes(option.id);
              return (
                <button
                  type="button"
                  className={`build-option ${selected ? "is-selected" : ""}`}
                  aria-pressed={selected}
                  onClick={() => toggleChoice(option.id)}
                  key={option.id}
                  data-testid={`build-option-${topic.id}-${option.id}`}
                >
                  <span className="build-option-label">{option.label}</span>
                  {option.blurb && (
                    <span className="build-option-blurb">{option.blurb}</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="build-run-row">
            <button
              type="button"
              className="cta-button cta-button--primary build-run-button"
              disabled={!canRun}
              onClick={runCurrentTopic}
              data-testid={`build-run-${topic.id}`}
            >
              <span>Run the situations</span>
              <span aria-hidden="true" className="cta-button-arrow">↓</span>
            </button>
            <button
              type="button"
              className="build-reset"
              onClick={resetTopic}
              data-testid={`build-reset-${topic.id}`}
            >
              Reset this build
            </button>
            <p className="build-run-status" data-testid={`build-count-${topic.id}`}>
              {runStatus(selectedCount, canRun, hasRun)}
            </p>
          </div>
        </section>

        <section
          className={`build-results ${hasRun ? "is-running" : ""}`}
          aria-labelledby={`build-results-${topic.id}`}
        >
          <header className="build-section-head">
            <p className="build-section-eyebrow">2. Break</p>
            <h2 id={`build-results-${topic.id}`}>Drop the situations through your form</h2>
            <p>
              The fates below are computed from the answer choices you selected.
              Change a chip after running and the same situations move.
            </p>
          </header>

          <div
            className="build-live-summary"
            aria-live="polite"
            aria-atomic="true"
            data-testid={`build-live-${topic.id}`}
          >
            {hasRun ? (
              <p>
                {result.counts.clean} clean · {result.counts.split} split ·{" "}
                {result.counts.forced} forced · {result.counts.lost} lost
                {!canRun
                  ? " · below the start gate, still recomputing from your current chips"
                  : ""}
              </p>
            ) : (
              <p>Run the situations after choosing at least four answers.</p>
            )}
          </div>

          {hasRun ? (
            <>
              <dl className="build-scoreboard" aria-label="Computed outcome counts">
                {(["clean", "split", "forced", "lost"] as const).map((fate) => (
                  <div
                    className={`build-score build-score--${fate}`}
                    key={fate}
                    data-testid={`build-score-${topic.id}-${fate}`}
                  >
                    <dt>{fateLabels[fate]}</dt>
                    <dd>{result.counts[fate]}</dd>
                  </div>
                ))}
              </dl>

              <ol className="build-situations">
                {result.results.map((item, index) => (
                  <li
                    className={`build-situation build-situation--${item.fate}`}
                    key={item.situation.id}
                    data-testid={`build-result-${topic.id}-${item.situation.id}`}
                  >
                    <article>
                      <header className="build-situation-head">
                        <p className="build-situation-num" aria-hidden="true">
                          {String(index + 1).padStart(2, "0")}
                        </p>
                        <div>
                          <p className="build-situation-person">
                            {item.situation.who}
                          </p>
                          <p className="build-situation-reading">
                            {item.situation.reading}
                          </p>
                        </div>
                        <p
                          className={`build-fate build-fate--${item.fate}`}
                          data-testid={`build-fate-${topic.id}-${item.situation.id}`}
                        >
                          {fateLabels[item.fate]}
                        </p>
                      </header>
                      <dl className="build-situation-detail">
                        <div>
                          <dt>Where it lands</dt>
                          <dd>{resultHomes(topic, item)}</dd>
                        </div>
                        <div>
                          <dt>Status</dt>
                          <dd>{topic.situationStatus}</dd>
                        </div>
                      </dl>
                      <p className="build-situation-copy">
                        {resultCopy(topic, item)}
                      </p>
                    </article>
                  </li>
                ))}
              </ol>

              <section
                className="build-reveal"
                aria-labelledby={`build-reveal-${topic.id}`}
                data-testid={`build-reveal-${topic.id}`}
              >
                <p className="build-section-eyebrow">3. Reveal</p>
                <h2 id={`build-reveal-${topic.id}`}>{topic.reveal.lead}</h2>
                <p>{topic.reveal.body}</p>
                <p className="build-reveal-foot">
                  Your build left {brokenCount} of {topic.situations.length} situations split,
                  forced, or lost.
                </p>
                <a
                  className="cta-button cta-button--secondary"
                  href={topic.reveal.bridgeHref}
                  data-testid={`build-bridge-${topic.id}`}
                >
                  <span>{topic.reveal.bridgeLabel}</span>
                  <span aria-hidden="true" className="cta-button-arrow">→</span>
                </a>
              </section>
            </>
          ) : (
            <div className="build-results-placeholder">
              <p>
                The important part happens after you commit. Until then, the
                form is only an intention.
              </p>
            </div>
          )}
        </section>
      </article>
    </main>
  );
}
