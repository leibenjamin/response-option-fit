import { useEffect, useState } from "react";
import {
  buildTopics,
  evaluateTopic,
  makeExportTable,
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
  if (result.ruleCopy) return result.ruleCopy;

  if (result.fate === "clean") {
    return `Recorded as ${formatLabels(topic, result.cleanHomes)}. One stable home in the form you built.`;
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

function makeInitialRecord() {
  return Object.fromEntries(buildTopics.map((topic) => [topic.id, [] as string[]]));
}

function makeInitialRuleRecord() {
  return Object.fromEntries(
    buildTopics.map((topic) => [topic.id, null as string | null])
  );
}

function runStatus(selectedCount: number, canRun: boolean, hasRun: boolean) {
  const count = `${selectedCount} selected`;
  if (canRun) return count;
  if (hasRun) {
    return `${count}; below the four-choice start gate, but results still update live`;
  }
  return `${count}; choose ${MIN_CHOICES - selectedCount} more to run`;
}

function resultSignature(result: BuildSituationResult) {
  return `${result.fate}:${result.cleanHomes.join("|")}:${result.forcedHomes.join("|")}`;
}

/* One record inside the export — a single authored situation, shown with its
   fate. The same testids (`build-result-*`, `build-fate-*`) ride here so the
   route's behavior contract is unchanged even though the layout moved from a
   flat "break" list into the export the analyst would actually receive. */
function ExportRecord({
  topic,
  result
}: {
  topic: BuildTopic;
  result: BuildSituationResult;
}) {
  return (
    <li
      className={`build-record build-record--${result.fate}`}
      data-testid={`build-result-${topic.id}-${result.situation.id}`}
    >
      <p
        className={`build-fate build-fate--${result.fate}`}
        data-testid={`build-fate-${topic.id}-${result.situation.id}`}
      >
        {fateLabels[result.fate]}
      </p>
      <div className="build-record-body">
        <p className="build-record-person">{result.situation.who}</p>
        <p className="build-record-copy">{resultCopy(topic, result)}</p>
        <p className="build-record-status">Status: {topic.situationStatus}</p>
      </div>
    </li>
  );
}

export function BuildAndBreakRoute() {
  const [activeTopicId, setActiveTopicId] = useState(buildTopics[0].id);
  const [chosenByTopic, setChosenByTopic] = useState<Record<string, string[]>>(
    makeInitialRecord
  );
  const [ruleByTopic, setRuleByTopic] = useState<Record<string, string | null>>(
    makeInitialRuleRecord
  );
  const [runTopics, setRunTopics] = useState<Record<string, boolean>>({});
  const [openTopics, setOpenTopics] = useState<Record<string, boolean>>({});

  const topic =
    buildTopics.find((candidate) => candidate.id === activeTopicId) ??
    buildTopics[0];
  const chosenIds = chosenByTopic[topic.id] ?? [];
  const selectedCount = chosenIds.length;
  const canRun = selectedCount >= MIN_CHOICES;
  const hasRun = runTopics[topic.id] === true;
  const isOpen = openTopics[topic.id] === true;
  const activeRuleId = ruleByTopic[topic.id] ?? null;
  const baseResult = evaluateTopic(topic, chosenIds);
  const result = evaluateTopic(topic, chosenIds, activeRuleId);
  const activeRule = result.rule;
  const exportTable = makeExportTable(result, chosenIds);
  const baseBrokenCount =
    baseResult.counts.split + baseResult.counts.forced + baseResult.counts.lost;
  const brokenCount =
    result.counts.split + result.counts.forced + result.counts.lost;
  const changedByRule = result.results.filter(
    (item, index) => resultSignature(item) !== resultSignature(baseResult.results[index])
  ).length;
  const unplaced = exportTable.ambiguous.length + exportTable.lost.length;

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
    setRuleByTopic((previous) => ({ ...previous, [topic.id]: null }));
    setRunTopics((previous) => ({ ...previous, [topic.id]: false }));
    setOpenTopics((previous) => ({ ...previous, [topic.id]: false }));
  };

  const runCurrentTopic = () => {
    if (!canRun) return;
    setRunTopics((previous) => ({ ...previous, [topic.id]: true }));
  };

  const toggleOpen = () => {
    setOpenTopics((previous) => ({ ...previous, [topic.id]: !previous[topic.id] }));
  };

  const selectRule = (ruleId: string | null) => {
    setRuleByTopic((previous) => ({ ...previous, [topic.id]: ruleId }));
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
          Build the answer choices. Then read the data they would have left you.
        </h1>
        <p className="build-route-lede">
          Not a quiz about the correct list. You assemble a reasonable answer
          set, then see the tidy export it produces — and what that clean-looking
          column quietly threw away before any analysis started.
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
              Every chip is plausible. Add more if you think the form needs more
              places for reality to land — more is not automatically safer.
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
              <span>Export the responses</span>
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
            <p className="build-section-eyebrow">2. The export</p>
            <h2 id={`build-results-${topic.id}`}>Your form would hand you this</h2>
            <p>
              {topic.situations.length} people answered the question. This is the
              column an analyst would open next. It looks ready to chart.
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
                {activeRule ? ` · rule: ${activeRule.shortLabel}` : ""}
                {!canRun
                  ? " · below the start gate, still recomputing from your current chips"
                  : ""}
              </p>
            ) : (
              <p>Export the responses after choosing at least four answers.</p>
            )}
          </div>

          {hasRun ? (
            <>
              <div
                className={`build-export ${isOpen ? "is-open" : ""}`}
                data-testid={`build-export-${topic.id}`}
              >
                <div className="build-export-frame">
                  <p className="build-export-caption">
                    Export · {topic.stem} · n&nbsp;=&nbsp;{topic.situations.length}
                  </p>
                  <ol className="build-export-rows">
                    {exportTable.rows.map((row) => (
                      <li
                        className="build-export-row"
                        key={row.optionId}
                        data-testid={`build-export-row-${topic.id}-${row.optionId}`}
                      >
                        <div className="build-export-cell">
                          <span className="build-export-cell-label">{row.label}</span>
                          <span className="build-export-cell-count">{row.count}</span>
                        </div>
                        {isOpen && (
                          <ul className="build-records">
                            {row.results.map((item) => (
                              <ExportRecord
                                key={item.situation.id}
                                topic={topic}
                                result={item}
                              />
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ol>

                  <p className="build-export-total">
                    <span>Rows the export can file</span>
                    <strong data-testid={`build-export-placed-${topic.id}`}>
                      {exportTable.placedCount}
                    </strong>
                  </p>
                </div>

                <div className="build-export-controls">
                  <button
                    type="button"
                    className="build-export-toggle"
                    aria-pressed={isOpen}
                    onClick={toggleOpen}
                    data-testid={`build-export-decompose-${topic.id}`}
                  >
                    {isOpen ? "Hide what each cell contains" : "Open the cells →"}
                  </button>
                  {!isOpen && unplaced > 0 && (
                    <p className="build-export-hint">
                      {topic.situations.length} people answered, but the export
                      could file only {exportTable.placedCount}. Open the cells to
                      see who it merged and who it dropped.
                    </p>
                  )}
                </div>

                {isOpen && (
                  <div
                    className="build-export-reconcile"
                    data-testid={`build-export-reconcile-${topic.id}`}
                  >
                    <p className="build-export-reconcile-lead">
                      {exportTable.placedCount} of {topic.situations.length} people
                      became a tidy cell.
                      {exportTable.rows.some((row) =>
                        row.results.some((item) => item.fate === "forced")
                      )
                        ? " Inside the cells, clean answers and forced answers carry the same number — the export cannot tell them apart, and neither could the chart."
                        : " Each filed answer had one honest home this time."}
                    </p>

                    {exportTable.ambiguous.length > 0 && (
                      <div
                        className="build-tray build-tray--ambiguous"
                        data-testid={`build-tray-ambiguous-${topic.id}`}
                      >
                        <p className="build-tray-label">
                          Counted in more than one place ({exportTable.ambiguous.length})
                        </p>
                        <p className="build-tray-note">
                          The same trip honestly fits two selected answers, so the
                          respondent's pick is a toss-up. Whichever cell they chose
                          is now polluted, and your total double-counts them.
                        </p>
                        <ul className="build-records">
                          {exportTable.ambiguous.map((item) => (
                            <ExportRecord
                              key={item.situation.id}
                              topic={topic}
                              result={item}
                            />
                          ))}
                        </ul>
                      </div>
                    )}

                    {exportTable.lost.length > 0 && (
                      <div
                        className="build-tray build-tray--lost"
                        data-testid={`build-tray-lost-${topic.id}`}
                      >
                        <p className="build-tray-label">
                          Never reached the export ({exportTable.lost.length})
                        </p>
                        <p className="build-tray-note">
                          These people answered. No selected box could hold them, so
                          they are absent from the column you would have analyzed —
                          and absence does not show up in a chart.
                        </p>
                        <ul className="build-records">
                          {exportTable.lost.map((item) => (
                            <ExportRecord
                              key={item.situation.id}
                              topic={topic}
                              result={item}
                            />
                          ))}
                        </ul>
                      </div>
                    )}

                    {exportTable.emptySelectedLabels.length > 0 && (
                      <p className="build-export-empty">
                        Answer choices that caught no one:{" "}
                        {exportTable.emptySelectedLabels.join(", ")}.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <section
                className="build-rule-lab"
                aria-labelledby={`build-rule-${topic.id}`}
                data-testid={`build-rule-panel-${topic.id}`}
              >
                <header className="build-section-head">
                  <p className="build-section-eyebrow">3. Add a rule</p>
                  <h2 id={`build-rule-${topic.id}`}>Try an instruction, not another box</h2>
                  <p>
                    More labels are not the only repair. A rule makes a private
                    classification decision public — or exposes that the answer set
                    is still missing the right place.
                  </p>
                </header>

                <div
                  className="build-rule-grid"
                  role="group"
                  aria-label={`Choose a ${topic.label.toLowerCase()} rule`}
                >
                  <button
                    type="button"
                    className={`build-rule-chip ${!activeRule ? "is-selected" : ""}`}
                    aria-pressed={!activeRule}
                    onClick={() => selectRule(null)}
                    data-testid={`build-rule-${topic.id}-none`}
                  >
                    <span>No added rule</span>
                    <small>Palette only</small>
                  </button>
                  {topic.rules.map((rule) => (
                    <button
                      type="button"
                      className={`build-rule-chip ${
                        activeRule?.id === rule.id ? "is-selected" : ""
                      }`}
                      aria-pressed={activeRule?.id === rule.id}
                      onClick={() => selectRule(rule.id)}
                      key={rule.id}
                      data-testid={`build-rule-${topic.id}-${rule.id}`}
                    >
                      <span>{rule.label}</span>
                      <small>{rule.shortLabel}</small>
                    </button>
                  ))}
                </div>

                <article
                  className={`build-rule-note ${
                    activeRule?.sourcePosture === "source_supported"
                      ? "build-rule-note--source"
                      : ""
                  }`}
                  data-testid={`build-rule-note-${topic.id}`}
                >
                  {activeRule ? (
                    <>
                      <p className="build-rule-note-label">
                        {activeRule.sourceLabel}
                      </p>
                      <h3>{activeRule.label}</h3>
                      <p>{activeRule.body}</p>
                      <p>{activeRule.sourceNote}</p>
                      <p className="build-rule-impact">
                        This rule changed {changedByRule} of{" "}
                        {topic.situations.length} situations and moved the broken
                        count from {baseBrokenCount} to {brokenCount}.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="build-rule-note-label">Palette only</p>
                      <h3>The export is still using only your answer choices.</h3>
                      <p>
                        Select a rule to see whether the problem was missing labels,
                        a missing instruction, or a tidy export hiding a forced
                        decision.
                      </p>
                    </>
                  )}
                </article>
              </section>

              <section
                className="build-reveal"
                aria-labelledby={`build-reveal-${topic.id}`}
                data-testid={`build-reveal-${topic.id}`}
              >
                <p className="build-section-eyebrow">4. Reveal</p>
                <h2 id={`build-reveal-${topic.id}`}>{topic.reveal.lead}</h2>
                <p
                  className="build-reveal-stat"
                  data-testid={`build-reveal-stat-${topic.id}`}
                >
                  <strong>{result.counts.clean}</strong> of{" "}
                  {topic.situations.length} people got a clean, honest cell
                  {result.counts.clean === topic.situations.length
                    ? "."
                    : " — the rest were forced, split, or dropped, and the export still looked complete."}
                </p>
                <p>{topic.reveal.body}</p>
                <p className="build-reveal-foot">
                  {activeRule
                    ? `With ${activeRule.label}, your build left ${brokenCount} of ${topic.situations.length} situations split, forced, or lost.`
                    : `Your build left ${brokenCount} of ${topic.situations.length} situations split, forced, or lost.`}
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
                The important part happens after you commit. Until then, the form
                is only an intention.
              </p>
            </div>
          )}
        </section>
      </article>
    </main>
  );
}
