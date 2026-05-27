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
  ageEditMax,
  ageEditMin,
  ageRespondents,
  bucketsContainingAge,
  bucketTasks,
  channelBank,
  channelLandingFor,
  channelLedger,
  channelPassed,
  channelRespondents,
  channelTallies,
  cardIsPassed,
  coverageGlyph,
  coverageLabel,
  credentialingFacts,
  doubleBarreledItems,
  exerciseReceipts,
  findingBucketHint,
  findingBucketLabel,
  findingCards,
  responseOptionKnowledgeMap,
  responseOptionSubtypeLabel,
  startingAgeBuckets,
  startingChannels,
  tourangeauProcess,
  tripleSplitOptions,
  type AgeBucket,
  type CardAnswer,
  type CoverageStatus,
  type ExerciseReceipt,
  type FindingBucket,
  type KnowledgeBranch,
  type LedgerLevel,
  type ResponseOptionSubtype
} from "../data/lab-exercises";

/* The `#lab` page — SQLBolt-style multi-exercise practice on response-
   option-design issues, plus a closing 4-branch knowledge map (SLOT /
   RULER / PUSH / BOUNDARY-AND-PROOF) per output-L's recommendation. Each
   exercise uses a distinct primary verb (predict/repair/route/tinker/
   sort) so the lab doesn't feel like the same puzzle reskinned. Wrong
   moves are designed cul-de-sacs — branch-specific, recoverable, and
   teach something prose alone wouldn't (output-M's pedagogy). After each
   exercise passes, a micro-receipt names which branch(es) of the closing
   map the exercise practiced. The closing map carries explicit coverage
   markers (✓ practiced · ◇ planned · ◌ didactic · ⊘ out of scope) and an
   optional credentialing panel + Tourangeau expert lens. */

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
          choices are written. Tinker, predict, repair, sort. Wrong moves are
          part of the practice — they show what would have shipped. The
          closing card maps what you covered (and what's still out there).
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
          <BucketTinkerExercise />
        </li>
        <li>
          <ChannelTinkerExercise />
        </li>
        <li>
          <ColdReviewExercise />
        </li>
      </ol>

      <KnowledgeMap />
    </main>
  );
}

/* ───────────────────────────────────────────────────────────────────────
   Exercise 1 — Scale builder + hostile flip  (primary verb: TINKER)
   The existing engine. After the hostile task lands, the flip section
   appears and a post-receipt below it names which branches were
   practiced (RULER + PUSH).
   ─────────────────────────────────────────────────────────────────────── */

function ScaleBuilderExercise() {
  const [design, setDesign] = useState<Design>(shippedDesign);
  const [completed, setCompleted] = useState<string[]>([]);

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
      verb="tinker"
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
                  {s === "plain"
                    ? "Plain — “how was…”"
                    : "Leading — “how great…”"}
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
            <ol className="lab-scale" aria-label="The scale">
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
                    <span className="lab-cast-arrow" aria-hidden="true">→</span>
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
              !hostileDone && <p className="lab-task-active">All tasks complete.</p>
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
              {eveLanding.label}&rdquo; — soften the scale one notch more
              and watch her vanish into the positive side.
            </p>
          ) : null}
          <p className="lab-flip-takeaway">
            Next time you&rsquo;re handed a &ldquo;92% satisfied,&rdquo; ask
            to see the stem, the scale, and the order before you believe it.
          </p>
        </section>
      )}

      <PostReceipt exerciseId="E1" visible={hostileDone} />
    </ExerciseFrame>
  );
}

/* ───────────────────────────────────────────────────────────────────────
   Exercise 2 — Double-barreled detector + repair selection
   (primary verb: REPAIR; pedagogy: variation theory + cul-de-sacs)
   ─────────────────────────────────────────────────────────────────────── */

function DoubleBarreledExercise() {
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [revealed, setRevealed] = useState(false);
  const [splitPick, setSplitPick] = useState<string | null>(null);

  const bundledIds = useMemo(
    () =>
      doubleBarreledItems
        .filter((i) => i.kind === "bundled-2" || i.kind === "bundled-3")
        .map((i) => i.id),
    []
  );
  const cleanOrDecoyIds = useMemo(
    () =>
      doubleBarreledItems
        .filter((i) => i.kind === "clean" || i.kind === "decoy")
        .map((i) => i.id),
    []
  );

  const allBundledFlagged = bundledIds.every((id) => flagged.has(id));
  const noFalsePositives = cleanOrDecoyIds.every((id) => !flagged.has(id));
  const flagPassed = revealed && allBundledFlagged && noFalsePositives;
  const hasError = revealed && !(allBundledFlagged && noFalsePositives);

  const missedBundled = bundledIds.filter((id) => !flagged.has(id));
  const falseFlags = Array.from(flagged).filter(
    (id) => !bundledIds.includes(id)
  );

  const splitPicked = splitPick
    ? tripleSplitOptions.find((s) => s.id === splitPick) ?? null
    : null;
  const splitCorrect = splitPicked?.verdict === "right";
  const exercisePassed = flagPassed && splitCorrect;

  const toggle = (id: string) =>
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <ExerciseFrame
      num={2}
      title="Flag the bundled items; then fix the worst one."
      issue="Double-barreled · triple-barreled · the “and”-decoy trap"
      modifier="double-barreled"
      verb="repair"
    >
      <p className="lab-exercise-setup">
        A draft of the coffee-shop survey came back for review. Some items
        bundle two ideas into one answer slot. Two contain the word &ldquo;and&rdquo;
        but actually ask one thing — flag those by mistake and you'll see why
        &ldquo;and&rdquo; isn't the test. One item is triple-barreled.
        Flag the items you'd reject, then check.
      </p>

      <ul className="lab-bundled-list" aria-label="Draft survey items">
        {doubleBarreledItems.map((item, i) => {
          const isFlagged = flagged.has(item.id);
          const verdict =
            !revealed
              ? null
              : item.kind === "bundled-2" || item.kind === "bundled-3"
                ? isFlagged
                  ? "correct"
                  : "missed"
                : isFlagged
                  ? "false-positive"
                  : "correct";
          return (
            <li key={item.id}>
              <button
                type="button"
                className={`lab-bundled-item ${isFlagged ? "is-flagged" : ""} ${verdict ? `is-${verdict}` : ""}`}
                aria-pressed={isFlagged}
                data-testid={`lab-bundled-${item.id}`}
                onClick={() => {
                  if (!flagPassed) toggle(item.id);
                }}
                disabled={flagPassed}
              >
                <span className="lab-bundled-num" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="lab-bundled-mark" aria-hidden="true">
                  {verdict === "correct"
                    ? item.kind === "clean" || item.kind === "decoy"
                      ? "·"
                      : "✓"
                    : verdict === "missed"
                      ? "·"
                      : verdict === "false-positive"
                        ? "✗"
                        : isFlagged
                          ? "⚑"
                          : ""}
                </span>
                <span className="lab-bundled-body">
                  <span className="lab-bundled-text">{item.text}</span>
                  {revealed && item.note && (
                    <span className="lab-bundled-note">{item.note}</span>
                  )}
                </span>
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
          disabled={flagPassed}
        >
          {flagPassed ? "Sub-task 1 done" : "Check my flags"}
        </button>
        {revealed && !flagPassed && (
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

      {hasError && (
        <div
          className="lab-exercise-error"
          aria-live="polite"
          data-testid="lab-bundled-error"
        >
          {missedBundled.length > 0 && (
            <p>
              <strong>Still missed:</strong>{" "}
              {missedBundled.length} bundled item
              {missedBundled.length === 1 ? "" : "s"} unflagged. Look for
              items asking about two judgments at once.
            </p>
          )}
          {falseFlags.length > 0 && (
            <p>
              <strong>False flag:</strong>{" "}
              {falseFlags.length} item{falseFlags.length === 1 ? "" : "s"}{" "}
              flagged that aren't bundled. Re-read each one — “and” inside a
              named entity isn't bundling.
            </p>
          )}
        </div>
      )}

      {flagPassed && (
        <p className="lab-exercise-pass" data-testid="lab-bundled-pass">
          ✓ Five flagged: four ordinary bundles and one triple-barreled. The
          two &ldquo;and&rdquo;-decoys (rewards-and-loyalty, news-and-
          promotions) are named programs the respondent rates as a single
          thing — “and” inside a noun phrase isn't a bundle, no matter what
          it looks like at a glance.
        </p>
      )}

      {flagPassed && (
        <section className="lab-repair" aria-labelledby="lab-repair-title">
          <header className="lab-repair-head">
            <p className="lab-repair-key">Sub-task 2 · Repair the triple-barreled</p>
            <h3 id="lab-repair-title" className="lab-repair-title">
              &ldquo;Was your server friendly, attentive, and quick?&rdquo;
            </h3>
            <p className="lab-repair-brief">
              Three signals bundled into one rating slot. Pick the repair
              you&rsquo;d ship. (At least one option is tempting because it
              looks simpler; the consequence shows what each move actually
              gets you and what it costs.)
            </p>
          </header>

          <div
            className="lab-repair-options"
            role="radiogroup"
            aria-label="Repair candidates"
          >
            {tripleSplitOptions.map((s) => {
              const picked = splitPick === s.id;
              const verdictClass = picked ? `is-${s.verdict}` : "";
              return (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={picked}
                  className={`lab-repair-option ${picked ? "is-picked" : ""} ${verdictClass}`}
                  data-testid={`lab-repair-${s.id}`}
                  onClick={() => {
                    if (!exercisePassed) setSplitPick(s.id);
                  }}
                  disabled={exercisePassed}
                >
                  <span className="lab-repair-mark" aria-hidden="true">
                    {picked && s.verdict === "right"
                      ? "✓"
                      : picked && s.verdict === "partial"
                        ? "≈"
                        : picked
                          ? "↯"
                          : ""}
                  </span>
                  <span className="lab-repair-label">{s.label}</span>
                </button>
              );
            })}
          </div>

          {splitPicked && (
            <div
              className={`lab-repair-ledger lab-repair-ledger--${splitPicked.verdict}`}
              aria-live="polite"
              data-testid="lab-repair-ledger"
            >
              <p>
                <strong>What happened:</strong> {splitPicked.whatHappened}
              </p>
              <p>
                <strong>Why it matters:</strong> {splitPicked.whyItMatters}
              </p>
              <p>
                <strong>Repair move:</strong> {splitPicked.repairMove}
              </p>
              <p>
                <strong>Watch for:</strong> {splitPicked.watchFor}
              </p>
            </div>
          )}
        </section>
      )}

      <PostReceipt exerciseId="E2" visible={exercisePassed} />
    </ExerciseFrame>
  );
}

/* ───────────────────────────────────────────────────────────────────────
   Exercise 3 — MECE bucket tinker  (primary verb: TINKER + ROUTE)
   Editable bucket boundaries; live respondent landings; 3 gated tasks.
   ─────────────────────────────────────────────────────────────────────── */

function BucketTinkerExercise() {
  const [buckets, setBuckets] = useState<AgeBucket[]>(() =>
    startingAgeBuckets.map((b) => ({ ...b }))
  );
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    setCompleted((prev) => {
      const active = bucketTasks.find((t) => !prev.includes(t.id));
      if (active && active.pass(buckets)) return [...prev, active.id];
      return prev;
    });
  }, [buckets]);

  const activeTask = bucketTasks.find((t) => !completed.includes(t.id)) ?? null;
  const lastDoneId = completed[completed.length - 1];
  const lastDoneTask = lastDoneId
    ? bucketTasks.find((t) => t.id === lastDoneId) ?? null
    : null;
  const allDone = completed.length === bucketTasks.length;

  const updateBucket = (id: string, patch: Partial<AgeBucket>) =>
    setBuckets((bs) => bs.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  const removeBucket = (id: string) =>
    setBuckets((bs) => bs.filter((b) => b.id !== id));
  const addBucket = () => {
    /* Append a new bucket; default range fills a sensible gap. */
    setBuckets((bs) => {
      const id = `b${Date.now()}`;
      const lastEnd = bs.reduce(
        (max, b) => (b.end != null && b.end > max ? b.end : max),
        ageEditMin
      );
      const start = Math.min(ageEditMax, lastEnd + 1);
      const end = Math.min(ageEditMax, start + 4);
      return [...bs, { id, start, end }];
    });
  };
  const reset = () =>
    setBuckets(startingAgeBuckets.map((b) => ({ ...b })));

  return (
    <ExerciseFrame
      num={3}
      title="Edit the age buckets until everyone fits."
      issue="Mutually-exclusive boundaries · coverage of the whole range"
      modifier="bucket"
      verb="tinker"
    >
      <p className="lab-exercise-setup">
        A workshop registration form asks for age in buckets. The starter
        set has overlapping boundaries, no under-18 coverage, and lumps
        everyone over 45 together. Edit the buckets &mdash; change the
        endpoints, add or remove buckets &mdash; until every respondent
        lands in exactly one. (Try a wrong fix; the dashboard tells you
        who's stuck.)
      </p>

      <div className="lab-bucket-grid">
        <section className="lab-bucket-editor" aria-label="Edit the buckets">
          <p className="lab-bucket-editor-key">Buckets (start–end, inclusive)</p>
          <ul className="lab-bucket-rows">
            {buckets.map((b, i) => (
              <li key={b.id} className="lab-bucket-row">
                <span className="lab-bucket-row-num" aria-hidden="true">
                  {i + 1}
                </span>
                <label className="lab-bucket-stepper">
                  <span className="lab-bucket-stepper-key">Start</span>
                  <input
                    type="number"
                    min={ageEditMin}
                    max={ageEditMax}
                    value={b.start}
                    data-testid={`lab-bucket-start-${b.id}`}
                    onChange={(e) =>
                      updateBucket(b.id, {
                        start: clampInt(
                          parseInt(e.target.value, 10),
                          ageEditMin,
                          ageEditMax
                        )
                      })
                    }
                  />
                </label>
                <span className="lab-bucket-row-sep" aria-hidden="true">
                  to
                </span>
                <label className="lab-bucket-stepper">
                  <span className="lab-bucket-stepper-key">End</span>
                  <input
                    type="number"
                    min={ageEditMin}
                    max={ageEditMax}
                    value={b.end ?? ""}
                    placeholder="(open)"
                    data-testid={`lab-bucket-end-${b.id}`}
                    onChange={(e) => {
                      const v = e.target.value;
                      updateBucket(b.id, {
                        end:
                          v === ""
                            ? null
                            : clampInt(parseInt(v, 10), ageEditMin, ageEditMax)
                      });
                    }}
                  />
                </label>
                <button
                  type="button"
                  className="lab-bucket-row-remove"
                  data-testid={`lab-bucket-remove-${b.id}`}
                  onClick={() => removeBucket(b.id)}
                  aria-label={`Remove bucket ${i + 1}`}
                  disabled={buckets.length <= 1}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
          <div className="lab-bucket-editor-actions">
            <button
              type="button"
              className="lab-action-button lab-action-button--ghost"
              data-testid="lab-bucket-add"
              onClick={addBucket}
            >
              + Add bucket
            </button>
            <button
              type="button"
              className="lab-action-button lab-action-button--ghost"
              data-testid="lab-bucket-reset"
              onClick={reset}
            >
              Reset
            </button>
          </div>
          <p className="lab-bucket-editor-hint">
            Leave “End” blank for an open-ended bucket (“45+”). The starter
            set's overlaps live where two buckets share a number — fix those
            first.
          </p>
        </section>

        <section className="lab-bucket-respondents" aria-label="Respondent landings">
          <p className="lab-bucket-respondents-key">
            Where the ten respondents land
          </p>
          <ul className="lab-bucket-fits">
            {ageRespondents.map((r) => {
              const fits = bucketsContainingAge(r.age, buckets);
              const state =
                fits.length === 0
                  ? "uncovered"
                  : fits.length === 1
                    ? "clean"
                    : "double";
              return (
                <li
                  key={r.id}
                  className={`lab-bucket-fit-row is-${state}`}
                  data-testid={`lab-bucket-fit-${r.id}`}
                >
                  <span className="lab-bucket-fit-who">
                    <strong>{r.name}</strong>
                    <span className="lab-bucket-fit-age"> ({r.age})</span>
                  </span>
                  <span className="lab-bucket-fit-mark" aria-hidden="true">
                    {state === "uncovered"
                      ? "0"
                      : state === "clean"
                        ? "✓"
                        : `${fits.length}`}
                  </span>
                  <span className="lab-bucket-fit-state">
                    {state === "uncovered"
                      ? "fits no bucket"
                      : state === "clean"
                        ? `→ ${formatBucket(fits[0])}`
                        : `${fits.length} buckets`}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <div className="lab-tasks">
        <ol className="lab-task-list">
          {bucketTasks.map((t, i) => {
            const done = completed.includes(t.id);
            const active = t.id === activeTask?.id;
            return (
              <li
                key={t.id}
                className={`lab-task ${done ? "is-done" : ""} ${active ? "is-active" : ""}`}
                data-testid={`lab-bucket-task-${t.id}`}
              >
                <span className="lab-task-mark" aria-hidden="true">
                  {done ? "✓" : i + 1}
                </span>
                <span className="lab-task-title">{t.title}</span>
              </li>
            );
          })}
        </ol>

        {lastDoneTask && (
          <p className="lab-task-pass" aria-live="polite">
            <span aria-hidden="true">✓ </span>
            {lastDoneTask.passText}
          </p>
        )}

        {activeTask ? (
          <div className="lab-task-active" aria-live="polite">
            <p className="lab-task-brief">
              <span className="lab-task-brief-key">
                Task {bucketTasks.indexOf(activeTask) + 1} of{" "}
                {bucketTasks.length}: {activeTask.title}
              </span>
              {activeTask.brief}
            </p>
            <p className="lab-task-hint">{activeTask.hint(buckets)}</p>
          </div>
        ) : (
          allDone && (
            <p className="lab-task-pass">
              ✓ All three sub-tasks complete. The bucket set now MECE-covers
              the full range, with a dedicated older bucket.
            </p>
          )
        )}
      </div>

      <PostReceipt exerciseId="E3" visible={allDone} />
    </ExerciseFrame>
  );
}

/* ───────────────────────────────────────────────────────────────────────
   Exercise 4 — Pilot-iterate option-set tinker with consequence ledger
   (primary verb: TINKER; pedagogy: costly affordances + quality readout)
   ─────────────────────────────────────────────────────────────────────── */

function ChannelTinkerExercise() {
  const [offered, setOffered] = useState<string[]>([...startingChannels]);

  const tallies = channelTallies(offered);
  const ledger = channelLedger(offered);
  const passed = channelPassed(offered);

  const toggle = (id: string) =>
    setOffered((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  const reset = () => setOffered([...startingChannels]);

  return (
    <ExerciseFrame
      num={4}
      title="Iterate the option set until every visitor lands honestly."
      issue="Incomplete option sets · the “Other” tradeoff · satisficing"
      modifier="channel"
      verb="tinker"
    >
      <p className="lab-exercise-setup">
        A coffee-shop onboarding form asks &ldquo;How did you hear about us?&rdquo;
        Toggle options on or off from the shelf. The ledger shows the four
        consequences of every move &mdash; coverage, exclusivity, analyst
        detail, and respondent burden. Try the obvious shortcut first
        (&ldquo;just add Other&rdquo;) and see why it isn&rsquo;t the
        complete answer.
      </p>

      <div className="lab-channel-grid">
        <section className="lab-channel-shelf" aria-label="Toggle options">
          <p className="lab-channel-shelf-key">The option shelf</p>
          <ul className="lab-channel-shelf-list">
            {channelBank.map((c) => {
              const on = offered.includes(c.id);
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    className={`lab-channel-chip lab-channel-chip--${c.kind} ${on ? "is-on" : ""}`}
                    aria-pressed={on}
                    data-testid={`lab-channel-${c.id}`}
                    onClick={() => toggle(c.id)}
                  >
                    <span className="lab-channel-chip-mark" aria-hidden="true">
                      {on ? "✓" : "+"}
                    </span>
                    <span className="lab-channel-chip-label">{c.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            className="lab-action-button lab-action-button--ghost"
            data-testid="lab-channel-reset"
            onClick={reset}
          >
            Reset to the starter set
          </button>
        </section>

        <section className="lab-channel-readout" aria-label="Live readout">
          <div className="lab-channel-question">
            <p className="lab-channel-question-key">The form, as offered</p>
            <p className="lab-channel-question-stem">
              How did you hear about us?
            </p>
            <ul className="lab-channel-shown">
              {offered.length === 0 && (
                <li className="lab-channel-shown-empty">(no options)</li>
              )}
              {offered.map((id) => {
                const c = channelBank.find((x) => x.id === id);
                return c ? <li key={id}>{c.label}</li> : null;
              })}
            </ul>
          </div>

          <div className="lab-channel-tallies" aria-live="polite">
            <p className="lab-channel-tally-line">
              <span className="lab-channel-tally is-clean">
                <strong>{tallies.clean}</strong> Clean
              </span>
              <span className="lab-channel-tally is-other">
                <strong>{tallies.other}</strong> Other
              </span>
              <span className="lab-channel-tally is-satisficed">
                <strong>{tallies.satisficed}</strong> Satisficed (wrong)
              </span>
            </p>
            <p className="lab-channel-tally-note">
              Pass = every respondent lands Clean. &ldquo;Other&rdquo;
              captures but doesn&rsquo;t preserve analyst detail; satisficed
              respondents quietly attribute themselves to a wrong channel.
            </p>
          </div>

          <ul className="lab-channel-cast">
            {channelRespondents.map((r) => {
              const landing = channelLandingFor(r, offered);
              const pickedLabel =
                channelBank.find((c) => c.id === landing.pickedId)?.label ??
                "—";
              return (
                <li
                  key={r.id}
                  className={`lab-channel-cast-row is-${landing.state}`}
                  data-testid={`lab-channel-landing-${r.id}`}
                >
                  <span className="lab-channel-cast-who">
                    <strong>{r.name}</strong>
                    <span className="lab-channel-cast-story"> {r.story}</span>
                  </span>
                  <span className="lab-channel-cast-arrow" aria-hidden="true">
                    →
                  </span>
                  <span className="lab-channel-cast-landing">
                    {pickedLabel}
                    <span className="lab-channel-cast-state">
                      {" "}
                      {landing.state === "clean"
                        ? "(clean)"
                        : landing.state === "other"
                          ? "(via Other)"
                          : "(satisficed — wrong)"}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="lab-channel-ledger" aria-label="Consequence ledger">
            <LedgerMeter
              label="Coverage"
              hint="Everyone has a place to answer (Clean or Other)."
              level={ledger.coverage}
            />
            <LedgerMeter
              label="Exclusivity"
              hint="Options are distinct; no broad lumps."
              level={ledger.exclusivity}
            />
            <LedgerMeter
              label="Analyst detail"
              hint="The export preserves the channel — Other and satisficed lose it."
              level={ledger.analystDetail}
            />
            <LedgerMeter
              label="Respondent burden"
              hint="Reading load. Long lists + write-ins cost respondent attention."
              level={ledger.respondentBurden}
            />
          </div>
        </section>
      </div>

      {passed && (
        <p className="lab-exercise-pass" data-testid="lab-channel-pass">
          ✓ All seven respondents land Clean. The professional move you just
          worked through: don&rsquo;t reach for &ldquo;Other&rdquo; first.
          Pilot the question with real respondents, watch what the
          low-effort ones satisfice onto, and PROMOTE those common
          write-ins into specific options before the form ships.
        </p>
      )}

      <PostReceipt exerciseId="E4" visible={passed} />
    </ExerciseFrame>
  );
}

function LedgerMeter({
  label,
  hint,
  level
}: {
  label: string;
  hint: string;
  level: LedgerLevel;
}) {
  return (
    <div className={`lab-ledger-meter is-${level}`}>
      <span className="lab-ledger-meter-label">{label}</span>
      <span className="lab-ledger-meter-bar" aria-hidden="true">
        <span className={`lab-ledger-meter-fill is-${level}`} />
      </span>
      <span className="lab-ledger-meter-value">{level}</span>
      <span className="lab-ledger-meter-hint">{hint}</span>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────
   Exercise 5 — Cold review queue (interleaved synthesis)
   (primary verb: SORT; pedagogy: interleaving + retrieval + discrimination)
   ─────────────────────────────────────────────────────────────────────── */

function ColdReviewExercise() {
  const [answers, setAnswers] = useState<Record<string, CardAnswer>>(() => {
    const init: Record<string, CardAnswer> = {};
    for (const c of findingCards) {
      init[c.id] = { bucket: null, subtypes: new Set() };
    }
    return init;
  });
  const [revealed, setRevealed] = useState(false);

  const setBucket = (cardId: string, bucket: FindingBucket) =>
    setAnswers((prev) => ({
      ...prev,
      [cardId]: { ...prev[cardId], bucket }
    }));
  const toggleSubtype = (cardId: string, subtype: ResponseOptionSubtype) =>
    setAnswers((prev) => {
      const next = new Set(prev[cardId].subtypes);
      if (next.has(subtype)) next.delete(subtype);
      else next.add(subtype);
      return { ...prev, [cardId]: { ...prev[cardId], subtypes: next } };
    });

  const allBucketed = findingCards.every(
    (c) => answers[c.id].bucket !== null
  );

  const perCardPassed: Record<string, boolean> = {};
  for (const c of findingCards) {
    perCardPassed[c.id] = cardIsPassed(c, answers[c.id]);
  }
  const allPassed = findingCards.every((c) => perCardPassed[c.id]);
  const exercisePassed = revealed && allPassed;
  const hasError = revealed && !allPassed;

  const buckets: FindingBucket[] = [
    "responseOption",
    "sampling",
    "sampleSize",
    "notEnoughInfo"
  ];

  return (
    <ExerciseFrame
      num={5}
      title="Sort the review queue; not every misleading number is a response-option problem."
      issue="Synthesis · retrieval · discriminating response-option from sampling / sample-size / methodology"
      modifier="cold-review"
      verb="sort"
    >
      <p className="lab-exercise-setup">
        Six finding cards. For each one, decide what KIND of problem (if
        any) it has, and for the response-option cards, which specific
        failures. Some have no response-option problem at all &mdash; the
        trick is knowing what you&rsquo;re looking at.
      </p>

      <ul className="lab-queue" aria-label="Finding cards">
        {findingCards.map((card) => {
          const ans = answers[card.id];
          const bucketCorrect = ans.bucket === card.correctBucket;
          const cardPass = perCardPassed[card.id];
          const cardVerdictClass = revealed
            ? cardPass
              ? "is-correct"
              : "is-wrong"
            : "";
          return (
            <li
              key={card.id}
              className={`lab-queue-card ${cardVerdictClass}`}
              data-testid={`lab-queue-card-${card.id}`}
            >
              <header className="lab-queue-card-head">
                <p className="lab-queue-headline">{card.headline}</p>
                {card.stem && (
                  <p className="lab-queue-stem">
                    <strong>Q:</strong> {card.stem}
                  </p>
                )}
                {card.options && card.options.length > 0 && (
                  <ol className="lab-queue-options">
                    {card.options.map((o, i) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ol>
                )}
                {card.methodologyNotes && card.methodologyNotes.length > 0 && (
                  <ul className="lab-queue-meta">
                    {card.methodologyNotes.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                )}
              </header>

              <div className="lab-queue-bucket-row">
                <p className="lab-queue-prompt">Sort this finding:</p>
                <div
                  className="lab-queue-bucket-options"
                  role="radiogroup"
                  aria-label={`Bucket for ${card.headline}`}
                >
                  {buckets.map((b) => {
                    const picked = ans.bucket === b;
                    return (
                      <button
                        key={b}
                        type="button"
                        role="radio"
                        aria-checked={picked}
                        className={`lab-queue-bucket-button ${picked ? "is-picked" : ""}`}
                        data-testid={`lab-queue-bucket-${card.id}-${b}`}
                        onClick={() => {
                          if (!exercisePassed) setBucket(card.id, b);
                        }}
                        disabled={exercisePassed}
                      >
                        {findingBucketLabel[b]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {ans.bucket === "responseOption" && card.correctBucket === "responseOption" && (
                <div className="lab-queue-subtypes">
                  <p className="lab-queue-subtypes-key">
                    Which response-option failures are present?
                  </p>
                  <ul className="lab-queue-subtypes-list">
                    {(
                      Object.keys(responseOptionSubtypeLabel) as ResponseOptionSubtype[]
                    ).map((s) => {
                      const on = ans.subtypes.has(s);
                      return (
                        <li key={s}>
                          <button
                            type="button"
                            className={`lab-queue-subtype ${on ? "is-on" : ""}`}
                            aria-pressed={on}
                            data-testid={`lab-queue-subtype-${card.id}-${s}`}
                            onClick={() => {
                              if (!exercisePassed) toggleSubtype(card.id, s);
                            }}
                            disabled={exercisePassed}
                          >
                            <span aria-hidden="true">{on ? "☑" : "☐"}</span>{" "}
                            {responseOptionSubtypeLabel[s]}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {revealed && (
                <div
                  className={`lab-queue-feedback is-${cardPass ? "correct" : "wrong"}`}
                  aria-live="polite"
                  data-testid={`lab-queue-feedback-${card.id}`}
                >
                  <p>
                    <strong>
                      {cardPass
                        ? "✓ "
                        : bucketCorrect
                          ? "≈ "
                          : "✗ "}
                      {findingBucketLabel[card.correctBucket]}.
                    </strong>{" "}
                    {card.bucketNote}
                  </p>
                  {card.correctBucket === "responseOption" &&
                    card.subtypes && (
                      <p className="lab-queue-feedback-subtypes">
                        Failures present:{" "}
                        {card.subtypes
                          .map((s) => responseOptionSubtypeLabel[s])
                          .join(" · ")}
                      </p>
                    )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="lab-queue-bucket-hints">
        <p className="lab-queue-bucket-hints-key">Bucket reminders</p>
        <ul>
          {buckets.map((b) => (
            <li key={b}>
              <strong>{findingBucketLabel[b]}:</strong>{" "}
              {findingBucketHint[b]}
            </li>
          ))}
        </ul>
      </div>

      <div className="lab-exercise-actions">
        <button
          type="button"
          className="lab-action-button"
          data-testid="lab-queue-check"
          onClick={() => setRevealed(true)}
          disabled={!allBucketed || exercisePassed}
        >
          {exercisePassed
            ? "All sorted"
            : allBucketed
              ? "Check my sort"
              : "Bucket every card first"}
        </button>
        {revealed && !exercisePassed && (
          <button
            type="button"
            className="lab-action-button lab-action-button--ghost"
            data-testid="lab-queue-try-again"
            onClick={() => setRevealed(false)}
          >
            Try again
          </button>
        )}
      </div>

      {hasError && (
        <p
          className="lab-exercise-error"
          aria-live="polite"
          data-testid="lab-queue-error"
        >
          One or more cards are mis-sorted (or have the wrong subtype set).
          Read the per-card feedback above each ✗ for the specific
          diagnosis, then re-sort.
        </p>
      )}

      {exercisePassed && (
        <p className="lab-exercise-pass" data-testid="lab-queue-pass">
          ✓ All six sorted. The discriminator you just practiced is the
          single most important professional move on this page: not every
          misleading headline is a response-option problem. Knowing whether
          a number is bad because of HOW it was asked, WHO was asked, or
          HOW MANY were asked tells you which fix to push for.
        </p>
      )}

      <PostReceipt exerciseId="E5" visible={exercisePassed} />
    </ExerciseFrame>
  );
}

/* ───────────────────────────────────────────────────────────────────────
   Shared components
   ─────────────────────────────────────────────────────────────────────── */

function ExerciseFrame({
  num,
  title,
  issue,
  modifier,
  verb,
  children
}: {
  num: number;
  title: string;
  issue: string;
  modifier: string;
  verb: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`lab-exercise lab-exercise--${modifier}`}
      aria-labelledby={`lab-exercise-${num}-title`}
    >
      <header className="lab-exercise-head">
        <p className="lab-exercise-num">
          Exercise {num} <span className="lab-exercise-verb">· {verb}</span>
        </p>
        <h2 className="lab-exercise-title" id={`lab-exercise-${num}-title`}>
          {title}
        </h2>
        <p className="lab-exercise-issue">{issue}</p>
      </header>
      {children}
    </section>
  );
}

function PostReceipt({
  exerciseId,
  visible
}: {
  exerciseId: string;
  visible: boolean;
}) {
  const receipt: ExerciseReceipt | undefined = exerciseReceipts[exerciseId];
  if (!visible || !receipt) return null;
  return (
    <aside
      className="lab-receipt"
      aria-label="What you practiced in this exercise"
      data-testid={`lab-receipt-${exerciseId}`}
    >
      <p className="lab-receipt-key">You practiced</p>
      <ul className="lab-receipt-marks">
        {receipt.marks.map((m) => (
          <li key={m.branchId} className="lab-receipt-mark">
            <span
              className={`lab-receipt-branch lab-receipt-branch--${m.branchId}`}
            >
              {branchLabel(m.branchId)}
            </span>{" "}
            <span className="lab-receipt-concepts">{m.concepts.join(" · ")}</span>
          </li>
        ))}
      </ul>
      {receipt.caveat && (
        <p className="lab-receipt-caveat">
          <strong>Professional caveat:</strong> {receipt.caveat}
        </p>
      )}
    </aside>
  );
}

function branchLabel(id: KnowledgeBranch["id"]): string {
  switch (id) {
    case "slot":
      return "SLOT";
    case "ruler":
      return "RULER";
    case "push":
      return "PUSH";
    case "boundary":
      return "BOUNDARY";
  }
}

/* ───────────────────────────────────────────────────────────────────────
   Closing knowledge map
   ─────────────────────────────────────────────────────────────────────── */

function KnowledgeMap() {
  const [openCredentialing, setOpenCredentialing] = useState(false);
  const [openTourangeau, setOpenTourangeau] = useState(false);

  return (
    <section
      className="lab-km"
      aria-labelledby="lab-km-title"
      data-testid="lab-km"
    >
      <header className="lab-km-head">
        <p className="lab-km-eyebrow">Closing map</p>
        <h2 id="lab-km-title" className="lab-km-title">
          You can now inspect a response option four ways.
        </h2>
        <p className="lab-km-lede">
          Does every real answer have a SLOT? Does the scale work as a
          RULER? Does the format PUSH the answer? And what would this
          inspection NOT prove?
        </p>
        <CoverageLegend />
      </header>

      <div className="lab-km-grid">
        {responseOptionKnowledgeMap.map((b) => (
          <KnowledgeBranchCard key={b.id} branch={b} />
        ))}
      </div>

      <details
        className="lab-km-panel"
        open={openCredentialing}
        onToggle={(e) => setOpenCredentialing((e.target as HTMLDetailsElement).open)}
      >
        <summary>
          Things you can now say without bluffing (
          {credentialingFacts.length} expandable lines)
        </summary>
        <ol className="lab-km-facts">
          {credentialingFacts.map((f) => (
            <li key={f.id} className="lab-km-fact">
              <p className="lab-km-fact-text">{f.text}</p>
              {f.sourceCue && (
                <p className="lab-km-fact-source">{f.sourceCue}</p>
              )}
            </li>
          ))}
        </ol>
      </details>

      <details
        className="lab-km-panel"
        open={openTourangeau}
        onToggle={(e) => setOpenTourangeau((e.target as HTMLDetailsElement).open)}
      >
        <summary>Expert lens · the Tourangeau response process</summary>
        <p className="lab-km-tourangeau-source">{tourangeauProcess.source}</p>
        <p className="lab-km-tourangeau-blurb">{tourangeauProcess.blurb}</p>
        <ol className="lab-km-tourangeau-steps">
          {tourangeauProcess.steps.map((s) => (
            <li key={s.id} className="lab-km-tourangeau-step">
              <p className="lab-km-tourangeau-step-label">{s.label}</p>
              <ul className="lab-km-tourangeau-step-examples">
                {s.examples.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </details>

      <p className="lab-km-close">
        A professional knows which inspection pass they&rsquo;re running.
        Response-option fit is one of them &mdash; not the whole survey
        machine.
      </p>
    </section>
  );
}

function CoverageLegend() {
  const statuses: CoverageStatus[] = [
    "practiced",
    "planned",
    "didactic",
    "outOfScope"
  ];
  return (
    <ul className="lab-km-legend" aria-label="Coverage marker legend">
      {statuses.map((s) => (
        <li key={s} className="lab-km-legend-item">
          <span
            className={`lab-km-marker lab-km-marker--${s}`}
            aria-hidden="true"
          >
            {coverageGlyph[s]}
          </span>
          <span className="lab-km-legend-label">{coverageLabel[s]}</span>
        </li>
      ))}
    </ul>
  );
}

function KnowledgeBranchCard({ branch }: { branch: KnowledgeBranch }) {
  return (
    <section
      className={`lab-km-branch lab-km-branch--${branch.id}`}
      aria-labelledby={`lab-km-branch-${branch.id}-title`}
    >
      <header className="lab-km-branch-head">
        <p className="lab-km-branch-eyebrow">{branch.label.toUpperCase()}</p>
        <h3
          id={`lab-km-branch-${branch.id}-title`}
          className="lab-km-branch-question"
        >
          {branch.question}
        </h3>
        <p className="lab-km-branch-memory">{branch.memorySentence}</p>
      </header>
      <ul className="lab-km-branch-nodes">
        {branch.nodes.map((n) => (
          <li
            key={n.id}
            className={`lab-km-node lab-km-node--${n.status}`}
            data-testid={`lab-km-node-${n.id}`}
          >
            <details className="lab-km-node-details">
              <summary className="lab-km-node-summary">
                <span
                  className={`lab-km-marker lab-km-marker--${n.status}`}
                  aria-hidden="true"
                >
                  {coverageGlyph[n.status]}
                </span>
                <span className="lab-km-node-label">{n.label}</span>
              </summary>
              <div className="lab-km-node-body">
                <p>
                  <strong>Ask:</strong> {n.ask}
                </p>
                <p>
                  <strong>Remember:</strong> {n.remember}
                </p>
                <p className="lab-km-node-meta">
                  <em>{coverageLabel[n.status]}</em>
                  {n.exerciseIds.length > 0 &&
                    !n.exerciseIds.every((id) => id === "none") && (
                      <>
                        {" "}
                        ·{" "}
                        {n.exerciseIds
                          .filter((id) => id !== "none")
                          .map((id) => (id === "future" ? "future" : id))
                          .join(", ")}
                      </>
                    )}
                </p>
                {n.sourceCue && (
                  <p className="lab-km-node-source">{n.sourceCue}</p>
                )}
                {n.boundaryNote && (
                  <p className="lab-km-node-boundary">{n.boundaryNote}</p>
                )}
              </div>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ─── small helpers ────────────────────────────────────────────────────── */

function clampInt(n: number, lo: number, hi: number): number {
  if (Number.isNaN(n)) return lo;
  return Math.max(lo, Math.min(hi, Math.round(n)));
}

function formatBucket(b: AgeBucket): string {
  if (b.end == null) return `${b.start}+`;
  if (b.start === b.end) return `${b.start}`;
  return `${b.start}–${b.end}`;
}
