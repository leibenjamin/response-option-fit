import { useEffect, useMemo, useState } from "react";
import { AnimatedNumber } from "../lib/motion";
import {
  biasTells,
  cast,
  isSatisfied,
  landingFor,
  satisfiedCount,
  scaleBank,
  shippedDesign,
  stemText,
  tasks,
  trueSatisfiedCount,
  type Design
} from "../data/satisfaction-lab";
import {
  biasOptions,
  bucketFixes,
  bucketRespondents,
  doubleBarreledItems,
  hearAboutFixes,
  hearAboutOptions,
  hearAboutRespondents,
  originalBuckets,
  spotBiasDesign,
  spotBiasHeadline
} from "../data/lab-exercises";

/* The #lab page — SQLBolt-style multi-exercise practice on response-option
   design issues. ONE page with FIVE distinct compact exercises stacked
   vertically (reference format: the bottom interactive section of
   https://sqlbolt.com/lesson/select_queries_review). The audience standard
   (professional analysts, managers, working professionals dipping into
   survey design) applies to the LAB as a whole — its variety, depth, and
   cleverness — NOT to the scenarios inside individual exercises (which are
   concrete + non-loaded vehicles for the lessons). See
   project_survey_lab_redirect + feedback-lab-scenarios-for-analyst-user in
   memory for the full rationale; see docs/design-passes/2026-05-25-strategic-
   redirect-survey-labs.md for the design history. */

export function SatisfactionLab() {
  return (
    <main id="survey-lab" className="lab-route" aria-labelledby="survey-lab-title">
      <header className="lab-route-head">
        <p className="lab-route-eyebrow">Response options · practice · preview</p>
        <h1 className="lab-route-title" id="survey-lab-title" tabIndex={-1}>
          Five ways a survey quietly lies.
        </h1>
        <p className="lab-route-lede">
          Each exercise below is one real failure mode in how survey answer
          choices are written. Work them in any order — nothing is gated.
          Built for fellow analysts and survey-curious professionals; preview,
          rough edges expected.
        </p>
      </header>

      <ol className="lab-exercises">
        <li>
          <ScaleBuilderExercise />
        </li>
        <li>
          <DoubleBarreledExercise />
        </li>
        <li>
          <BucketBoundaryExercise />
        </li>
        <li>
          <MissingOptionExercise />
        </li>
        <li>
          <SpotBiasExercise />
        </li>
      </ol>

      <footer className="lab-route-foot">
        <p className="lab-route-foot-line">
          That's five trapdoors. Take them to your next survey draft — the one
          your team will actually field — and you'll start seeing the same
          tells before they ship.
        </p>
      </footer>
    </main>
  );
}

/* ───────────────────────────────────────────────────────────────────────
   Exercise 1 — Scale builder + hostile flip
   ─────────────────────────────────────────────────────────────────────── */

function ScaleBuilderExercise() {
  const [design, setDesign] = useState<Design>(shippedDesign);
  const [completed, setCompleted] = useState<string[]>([]);

  /* Tasks complete in order and stay completed (sticky). Only the active task
     is checked, so the ladder can't be skipped. */
  useEffect(() => {
    setCompleted((prev) => {
      const active = tasks.find((t) => !prev.includes(t.id));
      if (active && active.pass(design)) return [...prev, active.id];
      return prev;
    });
  }, [design]);

  const activeTask = tasks.find((t) => !completed.includes(t.id)) ?? null;
  const activeIndex = activeTask ? tasks.indexOf(activeTask) : tasks.length;
  const lastDoneId = completed[completed.length - 1];
  const lastDoneTask = lastDoneId
    ? tasks.find((t) => t.id === lastDoneId) ?? null
    : null;
  const satCount = satisfiedCount(design);
  const hostileDone = completed.includes("hostile");
  const eve = cast.find((c) => c.id === "eve")!;
  const eveLanding = landingFor(eve, design);
  const displayBank =
    design.order === "positive-first" ? scaleBank : [...scaleBank].reverse();

  const togglePoint = (id: string) =>
    setDesign((d) => ({
      ...d,
      selected: d.selected.includes(id)
        ? d.selected.filter((x) => x !== id)
        : [...d.selected, id]
    }));

  return (
    <ExerciseFrame
      num={1}
      title="Design the scale; see the lie; learn the tells."
      issue="Leading stems · missing strong-negatives · no neutral midpoint · primacy"
      modifier="scale-builder"
    >
      <p className="lab-exercise-setup">
        Roast &amp; Brew, a coffee shop, runs a post-visit feedback survey.
        You're designing the answer scale for one question. Five visitors
        answer — and their true feelings never change. Only your options and
        wording do. Work the three tasks and watch the &ldquo;satisfied&rdquo;
        number move.
      </p>

      <div className="lab-grid">
        <section className="lab-builder" aria-label="Design the answer scale">
          <div className="lab-question">
            <p className="lab-question-key">The survey asks</p>
            <p className="lab-question-stem">{stemText[design.stem]}</p>
          </div>

          <div className="lab-control">
            <p className="lab-control-key">The question wording</p>
            <div
              className="lab-segmented"
              role="group"
              aria-label="Question wording"
            >
              {(["plain", "leading"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`lab-seg ${design.stem === s ? "is-on" : ""}`}
                  aria-pressed={design.stem === s}
                  data-testid={`lab-stem-${s}`}
                  onClick={() => setDesign((d) => ({ ...d, stem: s }))}
                >
                  {s === "plain"
                    ? "Plain — “how was…”"
                    : "Leading — “how great…”"}
                </button>
              ))}
            </div>
          </div>

          <div className="lab-control">
            <p className="lab-control-key">Option order</p>
            <div
              className="lab-segmented"
              role="group"
              aria-label="Option order"
            >
              {(["positive-first", "negative-first"] as const).map((o) => (
                <button
                  key={o}
                  type="button"
                  className={`lab-seg ${design.order === o ? "is-on" : ""}`}
                  aria-pressed={design.order === o}
                  data-testid={`lab-order-${o}`}
                  onClick={() => setDesign((d) => ({ ...d, order: o }))}
                >
                  {o === "positive-first" ? "Positive first" : "Negative first"}
                </button>
              ))}
            </div>
          </div>

          <div className="lab-control">
            <p className="lab-control-key">
              The answer options — tap to add or remove
            </p>
            <ol
              className="lab-scale"
              aria-label="The scale, in the order the respondent reads it"
            >
              {displayBank.map((p) => {
                const on = design.selected.includes(p.id);
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      className={`lab-point lab-point--${p.tone} ${on ? "is-on" : ""}`}
                      aria-pressed={on}
                      data-testid={`lab-point-${p.id}`}
                      onClick={() => togglePoint(p.id)}
                    >
                      <span className="lab-point-dot" aria-hidden="true" />
                      <span>{p.label}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <button
            type="button"
            className="lab-reset"
            data-testid="lab-reset"
            onClick={() => setDesign(shippedDesign)}
          >
            Reset to the shipped scale
          </button>
        </section>

        <section className="lab-readout" aria-label="Results and tasks">
          <div className="lab-autopsy">
            <p className="lab-autopsy-key">Field it to your five visitors</p>
            <p className="lab-tally" aria-live="polite">
              <AnimatedNumber
                value={satCount}
                className="lab-tally-num"
                ariaLabel={`${satCount}`}
              />
              <span className="lab-tally-unit">
                {" "}of 5 read as &ldquo;satisfied&rdquo;
              </span>
            </p>
            <p className="lab-tally-truth">
              only {trueSatisfiedCount} of them actually are
            </p>
            <ul className="lab-cast">
              {cast.map((c) => {
                const p = landingFor(c, design);
                const sat = isSatisfied(p);
                return (
                  <li
                    key={c.id}
                    className={`lab-cast-row ${sat ? "is-sat" : ""}`}
                    data-testid={`lab-landing-${c.id}`}
                  >
                    <span className="lab-cast-who">
                      <strong>{c.name}</strong>
                      <span className="lab-cast-feeling">{c.feeling}</span>
                    </span>
                    <span className="lab-cast-arrow" aria-hidden="true">
                      →
                    </span>
                    <span className="lab-cast-landing">
                      {p ? p.label : "— no options —"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="lab-tasks">
            <ol className="lab-task-list">
              {tasks.map((t, i) => {
                const done = completed.includes(t.id);
                const active = t.id === activeTask?.id;
                return (
                  <li
                    key={t.id}
                    className={`lab-task ${done ? "is-done" : ""} ${active ? "is-active" : ""}`}
                    data-testid={`lab-task-${t.id}`}
                  >
                    <span className="lab-task-mark" aria-hidden="true">
                      {done ? "✓" : i + 1}
                    </span>
                    <span className="lab-task-title">{t.title}</span>
                  </li>
                );
              })}
            </ol>

            {lastDoneTask && lastDoneTask.id !== "hostile" && (
              <p className="lab-task-pass" aria-live="polite">
                <span aria-hidden="true">✓ </span>
                {lastDoneTask.passText}
              </p>
            )}

            {activeTask ? (
              <div className="lab-task-active" aria-live="polite">
                <p className="lab-task-brief">
                  <span className="lab-task-brief-key">
                    Task {activeIndex + 1} of {tasks.length}: {activeTask.title}
                  </span>
                  {activeTask.brief}
                </p>
                <p className="lab-task-hint">{activeTask.hint(design)}</p>
              </div>
            ) : (
              !hostileDone && (
                <p className="lab-task-active">All tasks complete.</p>
              )
            )}
          </div>
        </section>
      </div>

      {hostileDone && (
        <section className="lab-flip" aria-labelledby="lab-flip-title">
          <p className="lab-flip-eyebrow">The flip</p>
          <h3 id="lab-flip-title">Look at what you just did.</h3>
          <p>
            You didn&rsquo;t change a single visitor&rsquo;s feeling — you
            changed the options and the wording, and the report now reads{" "}
            <strong>{satCount} of 5 satisfied</strong>. Every move you made
            is a tell you can now read in someone else&rsquo;s survey:
          </p>
          <ul className="lab-tells">
            {biasTells(design)
              .filter((t) => t.present)
              .map((t) => (
                <li key={t.id}>{t.tell}</li>
              ))}
          </ul>
          {eveLanding && isSatisfied(eveLanding) ? (
            <p className="lab-flip-eve">
              Eve left without coffee — and your data files her as &ldquo;
              {eveLanding.label}.&rdquo;
            </p>
          ) : eveLanding ? (
            <p className="lab-flip-eve">
              Even now, Eve (who left without coffee) reads as &ldquo;
              {eveLanding.label}&rdquo; — soften the scale one notch more and
              watch her vanish into the positive side.
            </p>
          ) : null}
          <p className="lab-flip-takeaway">
            Next time you&rsquo;re handed a &ldquo;92% satisfied,&rdquo; ask
            to see the stem, the scale, and the order before you believe it.
          </p>
        </section>
      )}
    </ExerciseFrame>
  );
}

/* ───────────────────────────────────────────────────────────────────────
   Exercise 2 — Double-barreled detector
   ─────────────────────────────────────────────────────────────────────── */

function DoubleBarreledExercise() {
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [revealed, setRevealed] = useState(false);

  const truePositiveIds = useMemo(
    () => doubleBarreledItems.filter((i) => i.isBundled).map((i) => i.id),
    []
  );

  const allFlaggedCorrect =
    flagged.size === truePositiveIds.length &&
    truePositiveIds.every((id) => flagged.has(id));

  const isPass = revealed && allFlaggedCorrect;
  const hasError = revealed && !allFlaggedCorrect;

  const toggle = (id: string) =>
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const wrongFlags = Array.from(flagged).filter(
    (id) => !truePositiveIds.includes(id)
  );
  const missedFlags = truePositiveIds.filter((id) => !flagged.has(id));

  return (
    <ExerciseFrame
      num={2}
      title="Flag the items that bundle two ideas."
      issue="Double-barreled options"
      modifier="double-barreled"
    >
      <p className="lab-exercise-setup">
        A draft of the coffee-shop survey came back for review. Some items
        bundle two ideas into one question, so a respondent can't honestly
        answer either. Tap each item to flag it; tap again to unflag. When you
        think you have them all, check your work.
      </p>

      <ul className="lab-bundled-list" aria-label="Draft survey items">
        {doubleBarreledItems.map((item) => {
          const isFlagged = flagged.has(item.id);
          const showVerdict = revealed;
          const verdict =
            !showVerdict
              ? null
              : isFlagged && item.isBundled
                ? "correct"
                : isFlagged && !item.isBundled
                  ? "false-positive"
                  : !isFlagged && item.isBundled
                    ? "missed"
                    : null;
          return (
            <li key={item.id}>
              <button
                type="button"
                className={`lab-bundled-item ${isFlagged ? "is-flagged" : ""} ${verdict ? `is-${verdict}` : ""}`}
                aria-pressed={isFlagged}
                data-testid={`lab-bundled-${item.id}`}
                onClick={() => {
                  if (!revealed) toggle(item.id);
                }}
                disabled={revealed && isPass}
              >
                <span className="lab-bundled-mark" aria-hidden="true">
                  {verdict === "correct"
                    ? "✓"
                    : verdict === "false-positive"
                      ? "✗"
                      : verdict === "missed"
                        ? "·"
                        : isFlagged
                          ? "⚑"
                          : ""}
                </span>
                <span className="lab-bundled-text">{item.text}</span>
                {revealed && item.isBundled && item.ideas && (
                  <span className="lab-bundled-ideas">
                    bundles &ldquo;{item.ideas[0]}&rdquo; +{" "}
                    &ldquo;{item.ideas[1]}&rdquo;
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="lab-exercise-actions">
        <button
          type="button"
          className="lab-action-button"
          data-testid="lab-bundled-check"
          onClick={() => setRevealed(true)}
          disabled={revealed && isPass}
        >
          {revealed && isPass ? "Done" : "Check my flags"}
        </button>
        {revealed && !isPass && (
          <button
            type="button"
            className="lab-action-button lab-action-button--ghost"
            data-testid="lab-bundled-try-again"
            onClick={() => setRevealed(false)}
          >
            Try again
          </button>
        )}
      </div>

      {isPass && (
        <p className="lab-exercise-pass" data-testid="lab-bundled-pass">
          ✓ All four. A bundled item is two questions wearing one answer
          slot — your respondent has to round, satisfy half, or pick the
          stronger feeling. The repair is always the same: split it into two
          questions.
        </p>
      )}
      {hasError && (
        <div className="lab-exercise-error" aria-live="polite">
          {missedFlags.length > 0 && (
            <p>
              {missedFlags.length === 1
                ? "One bundled item is unflagged — look again for an item that asks about two qualities at once."
                : `${missedFlags.length} bundled items are unflagged — look again for items that ask about two qualities at once.`}
            </p>
          )}
          {wrongFlags.length > 0 && (
            <p>
              {wrongFlags.length === 1
                ? "One of your flags is a clean single-idea item — unflag it."
                : `${wrongFlags.length} of your flags are clean single-idea items — unflag them.`}
            </p>
          )}
        </div>
      )}
    </ExerciseFrame>
  );
}

/* ───────────────────────────────────────────────────────────────────────
   Exercise 3 — MECE bucket fixer
   ─────────────────────────────────────────────────────────────────────── */

function BucketBoundaryExercise() {
  const [picked, setPicked] = useState<string | null>(null);
  const fix = picked ? bucketFixes.find((f) => f.id === picked) ?? null : null;
  const isPass = fix?.isCorrect === true;

  return (
    <ExerciseFrame
      num={3}
      title="Fix the overlapping age buckets."
      issue="Mutually-exclusive option boundaries (MECE)"
      modifier="bucket"
    >
      <p className="lab-exercise-setup">
        A workshop registration form asks for age in buckets. Three
        attendees can&rsquo;t tell which bucket to pick — their age sits
        on a shared boundary. Pick the repair you&rsquo;d ship.
      </p>

      <div className="lab-bucket-question">
        <p className="lab-bucket-question-key">What is your age?</p>
        <ul className="lab-bucket-row">
          {originalBuckets.map((b) => (
            <li key={b}>
              <span className="lab-bucket-chip">{b}</span>
            </li>
          ))}
        </ul>
      </div>

      <ul className="lab-bucket-conflicts" aria-label="Boundary conflicts">
        {bucketRespondents.map((r) => (
          <li key={r.id} className="lab-bucket-conflict">
            <strong>{r.name}</strong> ({r.age}) —{" "}
            <span className="lab-bucket-conflict-q">
              &ldquo;{r.conflict[0]}&rdquo; or &ldquo;{r.conflict[1]}&rdquo;?
            </span>
          </li>
        ))}
      </ul>

      <div className="lab-bucket-fix-list" role="radiogroup" aria-label="Pick the repair">
        {bucketFixes.map((f) => {
          const isPicked = picked === f.id;
          const verdict = isPicked
            ? f.isCorrect
              ? "correct"
              : "wrong"
            : "";
          return (
            <button
              key={f.id}
              type="button"
              role="radio"
              aria-checked={isPicked}
              className={`lab-bucket-fix is-${verdict} ${isPicked ? "is-picked" : ""}`}
              data-testid={`lab-bucket-fix-${f.id}`}
              onClick={() => {
                if (!isPass) setPicked(f.id);
              }}
              disabled={isPass}
            >
              <span className="lab-bucket-fix-mark" aria-hidden="true">
                {isPicked && f.isCorrect ? "✓" : isPicked ? "✗" : ""}
              </span>
              <span className="lab-bucket-fix-label">{f.label}</span>
            </button>
          );
        })}
      </div>

      {fix && (
        <p
          className={`lab-exercise-${isPass ? "pass" : "error"}`}
          aria-live="polite"
          data-testid="lab-bucket-feedback"
        >
          {isPass && <span aria-hidden="true">✓ </span>}
          {fix.note}
        </p>
      )}
    </ExerciseFrame>
  );
}

/* ───────────────────────────────────────────────────────────────────────
   Exercise 4 — Missing-option finder
   ─────────────────────────────────────────────────────────────────────── */

function MissingOptionExercise() {
  const [picked, setPicked] = useState<string | null>(null);
  const fix = picked ? hearAboutFixes.find((f) => f.id === picked) ?? null : null;
  const isPass = fix?.verdict === "right" || fix?.verdict === "specific";

  return (
    <ExerciseFrame
      num={4}
      title="Find the missing option."
      issue="Incomplete option sets (no catch-all)"
      modifier="missing-option"
    >
      <p className="lab-exercise-setup">
        A coffee-shop onboarding form asks &ldquo;How did you hear about us?&rdquo;
        with these four options. Three new customers try to answer. One
        can&rsquo;t. Pick the option you&rsquo;d add.
      </p>

      <div className="lab-hear-shown">
        <p className="lab-hear-shown-key">How did you hear about us?</p>
        <ul className="lab-hear-options">
          {hearAboutOptions.map((o) => (
            <li key={o.id} className="lab-hear-option">
              {o.label}
            </li>
          ))}
        </ul>
      </div>

      <ul className="lab-hear-cast" aria-label="Three respondents">
        {hearAboutRespondents.map((r) => {
          const fit =
            r.fits == null
              ? null
              : hearAboutOptions.find((o) => o.id === r.fits) ?? null;
          return (
            <li
              key={r.id}
              className={`lab-hear-cast-row ${r.fits == null ? "is-stuck" : ""}`}
            >
              <span className="lab-hear-cast-who">
                <strong>{r.name}</strong>
                <span className="lab-hear-cast-story"> {r.story}</span>
              </span>
              <span className="lab-hear-cast-arrow" aria-hidden="true">
                →
              </span>
              <span className="lab-hear-cast-landing">
                {fit ? fit.label : "— no option fits —"}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="lab-hear-prompt">Which option would you add?</p>
      <div className="lab-hear-fix-list" role="radiogroup" aria-label="Pick the option to add">
        {hearAboutFixes.map((f) => {
          const isPicked = picked === f.id;
          const verdict = isPicked
            ? f.verdict === "right"
              ? "correct"
              : f.verdict === "specific"
                ? "partial"
                : "wrong"
            : "";
          return (
            <button
              key={f.id}
              type="button"
              role="radio"
              aria-checked={isPicked}
              className={`lab-hear-fix is-${verdict} ${isPicked ? "is-picked" : ""}`}
              data-testid={`lab-hear-fix-${f.id}`}
              onClick={() => {
                if (!isPass) setPicked(f.id);
              }}
              disabled={isPass}
            >
              <span className="lab-hear-fix-mark" aria-hidden="true">
                {isPicked && f.verdict === "right"
                  ? "✓"
                  : isPicked && f.verdict === "specific"
                    ? "≈"
                    : isPicked
                      ? "✗"
                      : ""}
              </span>
              <span className="lab-hear-fix-label">{f.label}</span>
            </button>
          );
        })}
      </div>

      {fix && (
        <p
          className={`lab-exercise-${
            fix.verdict === "wrong" ? "error" : "pass"
          }`}
          aria-live="polite"
          data-testid="lab-hear-feedback"
        >
          {fix.verdict !== "wrong" && <span aria-hidden="true">✓ </span>}
          {fix.note}
        </p>
      )}
    </ExerciseFrame>
  );
}

/* ───────────────────────────────────────────────────────────────────────
   Exercise 5 — Spot the bias (synthesis)
   ─────────────────────────────────────────────────────────────────────── */

function SpotBiasExercise() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [revealed, setRevealed] = useState(false);

  const trueIds = useMemo(
    () => biasOptions.filter((b) => b.isPresent).map((b) => b.id),
    []
  );

  const allRight =
    checked.size === trueIds.length &&
    trueIds.every((id) => checked.has(id));

  const isPass = revealed && allRight;
  const hasError = revealed && !allRight;

  const toggle = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <ExerciseFrame
      num={5}
      title="Spot the response-option biases in a press-release stat."
      issue="Synthesis — recognize the moves from Exercise 1 in someone else's survey"
      modifier="spot-bias"
    >
      <p className="lab-exercise-setup">
        A product team's press release leads with the line below. Their
        survey design follows. Check every response-option bias that&rsquo;s
        actually present — and uncheck the ones that aren&rsquo;t.
      </p>

      <blockquote className="lab-spot-headline">
        &ldquo;{spotBiasHeadline}&rdquo;
      </blockquote>

      <div className="lab-spot-design">
        <p className="lab-spot-design-key">The underlying survey</p>
        <p className="lab-spot-design-stem">
          <strong>Q:</strong> {spotBiasDesign.stem}
        </p>
        <ol className="lab-spot-design-options">
          {spotBiasDesign.options.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ol>
        <p className="lab-spot-design-note">{spotBiasDesign.orderNote}</p>
      </div>

      <div className="lab-spot-list" role="group" aria-label="Check every bias actually present">
        {biasOptions.map((b) => {
          const isChecked = checked.has(b.id);
          const showVerdict = revealed;
          const verdict =
            !showVerdict
              ? null
              : isChecked && b.isPresent
                ? "correct"
                : isChecked && !b.isPresent
                  ? "false-positive"
                  : !isChecked && b.isPresent
                    ? "missed"
                    : null;
          return (
            <button
              key={b.id}
              type="button"
              role="checkbox"
              aria-checked={isChecked}
              className={`lab-spot-row ${isChecked ? "is-checked" : ""} ${verdict ? `is-${verdict}` : ""}`}
              data-testid={`lab-spot-${b.id}`}
              onClick={() => {
                if (!revealed) toggle(b.id);
              }}
              disabled={revealed && isPass}
            >
              <span className="lab-spot-mark" aria-hidden="true">
                {verdict === "correct"
                  ? "✓"
                  : verdict === "false-positive"
                    ? "✗"
                    : verdict === "missed"
                      ? "·"
                      : isChecked
                        ? "☑"
                        : "☐"}
              </span>
              <span className="lab-spot-label">{b.label}</span>
              {revealed && <span className="lab-spot-note">{b.note}</span>}
            </button>
          );
        })}
      </div>

      <div className="lab-exercise-actions">
        <button
          type="button"
          className="lab-action-button"
          data-testid="lab-spot-check"
          onClick={() => setRevealed(true)}
          disabled={revealed && isPass}
        >
          {revealed && isPass ? "Done" : "Check my picks"}
        </button>
        {revealed && !isPass && (
          <button
            type="button"
            className="lab-action-button lab-action-button--ghost"
            data-testid="lab-spot-try-again"
            onClick={() => setRevealed(false)}
          >
            Try again
          </button>
        )}
      </div>

      {isPass && (
        <p className="lab-exercise-pass" data-testid="lab-spot-pass">
          ✓ Three response-option biases stacked together — exactly the moves
          you made in Exercise 1. Sample size, sampling bias, and stem length
          aren&rsquo;t response-option problems; they're separate
          methodology questions. Knowing which is which is how you read a
          number critically.
        </p>
      )}
      {hasError && (
        <p
          className="lab-exercise-error"
          aria-live="polite"
          data-testid="lab-spot-error"
        >
          Not quite — uncheck the moves that aren&rsquo;t visible in the
          shown design, and look once more at the stem, the option set, and
          the order.
        </p>
      )}
    </ExerciseFrame>
  );
}

/* ───────────────────────────────────────────────────────────────────────
   Shared exercise wrapper
   ─────────────────────────────────────────────────────────────────────── */

function ExerciseFrame({
  num,
  title,
  issue,
  modifier,
  children
}: {
  num: number;
  title: string;
  issue: string;
  modifier: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`lab-exercise lab-exercise--${modifier}`}
      aria-labelledby={`lab-exercise-${num}-title`}
    >
      <header className="lab-exercise-head">
        <p className="lab-exercise-num">Exercise {num}</p>
        <h2 className="lab-exercise-title" id={`lab-exercise-${num}-title`}>
          {title}
        </h2>
        <p className="lab-exercise-issue">{issue}</p>
      </header>
      {children}
    </section>
  );
}
