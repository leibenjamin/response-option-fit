import { useEffect, useState } from "react";
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

/* Prototype of the new "survey-question goal-lab" model (see docs/design-passes/
   2026-05-25-strategic-redirect-survey-labs.md). The visitor designs a
   satisfaction scale; a fixed, authored cast of 5 customers answers
   deterministically (their feelings never change — only the options and wording
   do); a live autopsy + a SQLBolt-style task ladder drive an honest → edge →
   hostile arc, and finishing the hostile task flips every biasing move into a
   tell the visitor can now read. Authored teaching scenario, no source; the only
   counts are over the 5 named people (never a population prevalence). */
export function SatisfactionLab() {
  const [design, setDesign] = useState<Design>(shippedDesign);
  const [completed, setCompleted] = useState<string[]>([]);

  /* Tasks complete in order and stay completed (sticky). Only the current active
     task is checked, so the ladder can't be skipped. */
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
    <main id="survey-lab" className="lab-route" aria-labelledby="survey-lab-title">
      <header className="lab-route-head">
        <p className="lab-route-eyebrow">Survey-design lab · preview</p>
        <h1 className="lab-route-title" id="survey-lab-title" tabIndex={-1}>
          Make the data say what you want.
        </h1>
        <p className="lab-route-lede">
          You design the answer scale for one satisfaction question. Five customers
          answer — and their true feelings never change. Only your options and your
          wording do. Work down the tasks and watch the &ldquo;satisfied&rdquo;
          number move.
        </p>
      </header>

      <div className="lab-grid">
        <section className="lab-builder" aria-label="Design the answer scale">
          <div className="lab-question">
            <p className="lab-question-key">The survey asks</p>
            <p className="lab-question-stem">{stemText[design.stem]}</p>
          </div>

          <div className="lab-control">
            <p className="lab-control-key">The question wording</p>
            <div className="lab-segmented" role="group" aria-label="Question wording">
              {(["plain", "leading"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`lab-seg ${design.stem === s ? "is-on" : ""}`}
                  aria-pressed={design.stem === s}
                  data-testid={`lab-stem-${s}`}
                  onClick={() => setDesign((d) => ({ ...d, stem: s }))}
                >
                  {s === "plain" ? "Plain — “How was…”" : "Leading — “How great…”"}
                </button>
              ))}
            </div>
          </div>

          <div className="lab-control">
            <p className="lab-control-key">Option order</p>
            <div className="lab-segmented" role="group" aria-label="Option order">
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
            <p className="lab-autopsy-key">Field it to your five customers</p>
            <p className="lab-tally" aria-live="polite">
              <AnimatedNumber
                value={satCount}
                className="lab-tally-num"
                ariaLabel={`${satCount}`}
              />
              <span className="lab-tally-unit"> of 5 read as “satisfied”</span>
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
          <h2 id="lab-flip-title">Look at what you just did.</h2>
          <p>
            You didn&rsquo;t change a single customer&rsquo;s feeling — you changed
            the options and the wording, and the report now reads{" "}
            <strong>{satCount} of 5 satisfied</strong>. Every move you made is a
            tell you can now read in someone else&rsquo;s survey:
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
              Eve is furious — and your data files her as &ldquo;{eveLanding.label}
              .&rdquo;
            </p>
          ) : eveLanding ? (
            <p className="lab-flip-eve">
              Even now, Eve (furious) reads as &ldquo;{eveLanding.label}&rdquo; —
              soften the scale one notch more and watch her vanish into the
              positive side.
            </p>
          ) : null}
          <p className="lab-flip-takeaway">
            Next time you&rsquo;re handed a &ldquo;92% satisfied,&rdquo; ask to see
            the stem, the scale, and the order before you believe it.
          </p>
          <p className="lab-flip-sowhat">
            <span className="lab-flip-sowhat-key">For a survey you build</span>
            A fair satisfaction question needs a plain stem, a balanced scale with
            real room to complain, and a true middle — or your own data will
            flatter you.
          </p>
        </section>
      )}
    </main>
  );
}
