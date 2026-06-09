import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatedNumber } from "../lib/motion";
import { useProgress } from "../lib/progress";
import { LabCertificate } from "./LabCertificate";
import { ReviewChecklist } from "./ReviewChecklist";
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
  acqCast,
  acqDesignLabel,
  acqDesignNote,
  acqDesignStem,
  acqFlagged,
  acqJudgmentFixed,
  acqJudgmentFlagged,
  acqJudgmentQuestion,
  acqJudgmentWrongNote,
  acqMatchesTrue,
  acqRecorded,
  acqTasks,
  acqTrackTrueLevel,
  ageEditMax,
  ageEditMin,
  ageRespondents,
  bucketsContainingAge,
  bucketTasks,
  channelAllClean,
  channelBank,
  channelLandingFor,
  channelLedger,
  channelRespondents,
  channelTallies,
  channelTasks,
  coverageGlyph,
  coverageLabel,
  credentialingFacts,
  doubleBarreledItems,
  evidenceStrengthMeta,
  exerciseReceipts,
  furtherReading,
  fpCast,
  fpFunnel,
  fpLandingFor,
  fpScreeners,
  fpStartActive,
  fpTasks,
  labelScaleAllMiddleVerbal,
  labelScaleBalanced,
  labelScaleCast,
  labelScaleLabels,
  labelScaleInventedCount,
  labelScaleLandingFor,
  labelScaleNote,
  labelScalePulledCount,
  labelScaleSlotOrder,
  labelScaleStartSlots,
  labelScaleTasks,
  labelScaleWordBank,
  labelScaleWordLabel,
  nominalOrderOptions,
  oatMilkCast,
  oatMilkConflation,
  oatMilkDesigns,
  oatMilkLandingFor,
  oatMilkPhantomOnScale,
  oatMilkTasks,
  orderCast,
  orderLandingFor,
  orderMeters,
  orderTasks,
  ordinalOrderedLabels,
  ordinalRandomizedLabels,
  quantifierCast,
  quantifierCollisionFor,
  quantifierHasCollision,
  quantifierLandingFor,
  quantifierMeters,
  quantifierNote,
  quantifierOptions,
  quantifierPeriods,
  quantifierQuestion,
  quantifierTasks,
  quantifierUnits,
  responseOptionKnowledgeMap,
  reviewDiagnosisAsk,
  reviewDiagnosisLabel,
  reviewElements,
  scaleCollapsedGroups,
  scaleLandingFor,
  scaleLengthCast,
  scaleLengthChoices,
  scaleLengthStart,
  scaleMeters,
  scalePointLabels,
  scaleTasks,
  sourceDrawers,
  startingAgeBuckets,
  startingChannels,
  termGlossary,
  termStatusLabel,
  tourangeauProcess,
  tripleSplitOptions,
  type AcqDesign,
  type AgeBucket,
  type ChannelLandingState,
  type CoverageStatus,
  type ExerciseReceipt,
  type FpScreenerId,
  type KnowledgeBranch,
  type LabelScaleSlots,
  type LabelScaleSlotId,
  type LabelScaleWordId,
  type LedgerLevel,
  type NominalOrderMode,
  type NominalReadMode,
  type OrderListKind,
  type OrdinalOrderMode,
  type QuantifierFormat,
  type ReviewDiagnosis,
  type SourceDrawer as SourceDrawerData
} from "../data/lab-exercises";

/* The `#lab` page — SQLBolt-style multi-exercise practice on response-
   option-design issues, plus a closing 4-branch knowledge map (SLOT /
   RULER / PUSH / BOUNDARY) per output-L. Each exercise uses a distinct
   primary verb (tinker / repair / gate / label / anchor / order / review)
   so the lab doesn't feel
   like the same puzzle reskinned; wrong moves are designed cul-de-sacs,
   recoverable and informative (output-M). A prominent task band sits at
   the top of each task-driven exercise (so the visitor's eye meets the
   task before the workspace), and a micro-receipt names which map branch
   each pass exercised. */

/* Contents rail: the page is long (~12 stacked exercises + a closing map),
   which the page-fatigue audits flagged as the main risk for mobile and
   screen-reader visitors. It gives a way to jump, a sense of place (scroll-spy
   highlight), and a quiet sense of progress (a check on each solved exercise +
   an "N of 12" count) — reflective, not a pressuring score. Labels are
   concept-led, verb-tagged shorthands; the anchors are the section ids on each
   ExerciseFrame and the closing map; `dataId` maps the display number to the
   internal exercise id so completion (keyed by data id) lights the right row. */
type LabNavItem = {
  num: number;
  label: string;
  verb: string;
  anchor: string;
  dataId: string;
};

const LAB_NAV: LabNavItem[] = [
  { num: 1, label: "Design the answer scale", verb: "tinker", anchor: "lab-exercise-1", dataId: "E1" },
  { num: 2, label: "Double-barreled items", verb: "repair", anchor: "lab-exercise-2", dataId: "E2" },
  { num: 3, label: "False premise / eligibility", verb: "gate", anchor: "lab-exercise-3", dataId: "E8" },
  { num: 4, label: "Age buckets", verb: "tinker", anchor: "lab-exercise-4", dataId: "E3" },
  { num: 5, label: "The option set", verb: "tinker", anchor: "lab-exercise-5", dataId: "E4" },
  { num: 6, label: "Acquiescence", verb: "compare", anchor: "lab-exercise-6", dataId: "E9" },
  { num: 7, label: "Scale length", verb: "tinker", anchor: "lab-exercise-7", dataId: "E6" },
  { num: 8, label: "Don't-know / N/A", verb: "compare", anchor: "lab-exercise-8", dataId: "E7" },
  { num: 9, label: "Verbal labels", verb: "label", anchor: "lab-exercise-9", dataId: "E10" },
  { num: 10, label: "Vague quantifiers", verb: "anchor", anchor: "lab-exercise-10", dataId: "E11" },
  { num: 11, label: "Option order", verb: "order", anchor: "lab-exercise-11", dataId: "E12" },
  { num: 12, label: "Ship-review capstone", verb: "review", anchor: "lab-exercise-12", dataId: "E5" }
];

const MAP_ANCHOR = "closing-map";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function LabContents() {
  const [activeAnchor, setActiveAnchor] = useState<string>(LAB_NAV[0].anchor);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const { completed, count, total } = useProgress();

  /* Scroll-spy: highlight whichever section currently owns the middle of the
     viewport. Pure orientation — it never blocks or scores anything, and if
     IntersectionObserver is unavailable the rail still works as plain links. */
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const anchors = [...LAB_NAV.map((n) => n.anchor), MAP_ANCHOR];
    const sections = anchors
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          );
        if (visible[0]) setActiveAnchor(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const jumpTo = (anchor: string) => {
    const el = document.getElementById(anchor);
    if (!el) return;
    el.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start"
    });
    /* Move focus to the heading so keyboard / screen-reader users land where
       the scroll did, without yanking the viewport a second time. */
    const heading = el.querySelector<HTMLElement>("h2");
    const target = heading ?? el;
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    setActiveAnchor(anchor);
    if (detailsRef.current) detailsRef.current.open = false;
  };

  const activeItem = LAB_NAV.find((n) => n.anchor === activeAnchor) ?? null;
  const here =
    activeAnchor === MAP_ANCHOR
      ? "Closing map"
      : activeItem
        ? `Exercise ${activeItem.num} · ${activeItem.label}`
        : `Exercise ${LAB_NAV[0].num} · ${LAB_NAV[0].label}`;

  const renderLink = (
    anchor: string,
    num: string,
    label: string,
    verb: string,
    testid: string,
    done: boolean,
    extraClass = ""
  ) => (
    <a
      className={`lab-contents-link ${extraClass} ${
        activeAnchor === anchor ? "is-here" : ""
      } ${done ? "is-done" : ""}`}
      href={`#${anchor}`}
      aria-current={activeAnchor === anchor ? "true" : undefined}
      data-testid={testid}
      onClick={(e) => {
        e.preventDefault();
        jumpTo(anchor);
      }}
    >
      <span className="lab-contents-num" aria-hidden="true">
        {done ? "✓" : num}
      </span>
      <span className="lab-contents-label">
        {label}
        {done && <span className="lab-contents-done-sr"> — complete</span>}
      </span>
      <span className="lab-contents-verb" aria-hidden="true">
        {verb}
      </span>
    </a>
  );

  return (
    <nav className="lab-contents" aria-label="Lab contents" data-testid="lab-contents">
      <details className="lab-contents-disc" ref={detailsRef}>
        <summary className="lab-contents-summary">
          <span className="lab-contents-toggle">Jump to exercise</span>
          {/* Visual scroll-spy only — not a live region: announcing the
              current section on every scroll change is noise for a screen
              reader, which already gets position from the headings and the
              aria-current link in the open list. */}
          <span className="lab-contents-here">{here}</span>
          <span
            className="lab-contents-progress"
            data-testid="lab-contents-progress"
          >
            <span className="lab-contents-progress-text">
              {count} / {total} complete
            </span>
            <span className="lab-contents-progress-track" aria-hidden="true">
              <span
                className="lab-contents-progress-fill"
                style={{ width: `${Math.round((count / total) * 100)}%` }}
              />
            </span>
          </span>
        </summary>
        <ol className="lab-contents-list">
          {LAB_NAV.map((n) => (
            <li key={n.anchor}>
              {renderLink(
                n.anchor,
                String(n.num),
                n.label,
                n.verb,
                `lab-contents-link-${n.num}`,
                completed.has(n.dataId)
              )}
            </li>
          ))}
          <li>
            {renderLink(
              MAP_ANCHOR,
              "★",
              "Closing map",
              "review",
              "lab-contents-link-map",
              false,
              "lab-contents-link--map"
            )}
          </li>
        </ol>
      </details>
    </nav>
  );
}

/* The opening hook — "the catchment".

   The first interactive beat on the page. The old version was a labeled
   plain/leading toggle, which named its own control ("Leading") and its own
   answer (the recorded count) — facile by our own taxonomy, and it implicated
   only fictional chips. This replaces it with a self-implicating placement:
   the visitor drops their own, honestly-felt day on a continuous strip and
   watches the form's coarse answer-boxes swallow a whole band of feelings onto
   one word. Adding options shrinks the catchment — the missing-middle lesson of
   Exercise 1, felt in one tap. It is non-presumptuous (the visitor authors
   their own feeling) and honest (the only datum is that single placement; the
   catchment statement is a property of the OPTIONS, not a respondent
   distribution). Design rationale: docs/design-passes/2026-06-05-opening-hook-redesign.md. */
const HOOK_BOX_STEPS = [2, 3, 5] as const;
const HOOK_BOX_LABELS: Record<number, string[]> = {
  2: ["Rough day", "Great day"],
  3: ["Rough", "Middling", "Great"],
  5: ["Rough", "Meh", "Okay", "Good", "Great"]
};

/* A plain-language word for a placement on the 0..100 feeling strip — used in
   the readout and, crucially, in the slider's aria-valuetext. */
function feelWord(feel: number): string {
  if (feel < 12) return "rough";
  if (feel < 30) return "pretty low";
  if (feel < 44) return "a little off";
  if (feel < 56) return "honestly mixed";
  if (feel < 72) return "decent";
  if (feel < 88) return "good";
  return "great";
}

/* Which of n even boxes a placement falls into, and that box's center. The
   recorded answer is the box's center; the gap to the true placement is what
   the instrument rounds away. */
function hookBoxIndex(feel: number, n: number): number {
  return Math.min(n - 1, Math.max(0, Math.floor((feel / 100) * n)));
}
function hookBoxCenter(i: number, n: number): number {
  return ((i + 0.5) / n) * 100;
}

function HeroProof() {
  const [feel, setFeel] = useState(55);
  const [stepIdx, setStepIdx] = useState(0);
  const [touched, setTouched] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const n = HOOK_BOX_STEPS[stepIdx];
  const labels = HOOK_BOX_LABELS[n];
  const idx = hookBoxIndex(feel, n);
  const center = hookBoxCenter(idx, n);
  const recordedLabel = labels[idx];
  const gap = Math.abs(feel - center);
  const direction =
    center > feel + 1.5 ? "up" : center < feel - 1.5 ? "down" : "level";

  const placeFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setFeel(Math.max(0, Math.min(100, pct)));
    setTouched(true);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      /* setPointerCapture can throw on stale pointer ids; placement still works. */
    }
    placeFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current) placeFromClientX(e.clientX);
  };
  const endDrag = () => {
    dragging.current = false;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 3;
    let next = feel;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = feel - step;
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") next = feel + step;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 100;
    else return;
    e.preventDefault();
    setFeel(Math.max(0, Math.min(100, next)));
    setTouched(true);
  };

  const stepBoxes = () => setStepIdx((i) => (i + 1) % HOOK_BOX_STEPS.length);
  const stepLabel =
    n === 2
      ? "Give people a middle →"
      : n === 3
        ? "Give them the full range →"
        : "Back to two boxes ↺";

  const goToExercise = () => {
    const el = document.getElementById("lab-exercise-1");
    if (!el) return;
    el.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start"
    });
    const heading = el.querySelector<HTMLElement>("h2") ?? el;
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  };

  const valueText = `Your day feels ${feelWord(
    feel
  )}. The form would record this as ${recordedLabel}.`;

  return (
    <div className="lab-hook" data-testid="lab-hero">
      <p className="lab-hook-eyebrow">One tap · the whole idea</p>
      <p className="lab-hook-stem lab-selectable">
        How&rsquo;s your day going — really?
      </p>

      <div className="lab-hook-figure">
        <div
          ref={trackRef}
          className={`lab-hook-track lab-hook-track--n${n}`}
          role="slider"
          tabIndex={0}
          aria-label="Set how your day is going; the readout shows what the form would record"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(feel)}
          aria-valuetext={valueText}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={onKeyDown}
          data-testid="lab-hook-track"
        >
          <div className="lab-hook-zones" aria-hidden="true">
            {labels.map((label, i) => (
              <div
                key={label}
                className={`lab-hook-zone ${i === idx ? "is-active" : ""}`}
              >
                <span className="lab-hook-zone-label">{label}</span>
              </div>
            ))}
          </div>
          <div
            className={`lab-hook-gap dir-${direction}`}
            aria-hidden="true"
            style={{ left: `${Math.min(feel, center)}%`, width: `${gap}%` }}
          />
          <div
            className="lab-hook-recorded"
            aria-hidden="true"
            style={{ left: `${center}%` }}
          />
          <div
            className={`lab-hook-handle ${touched ? "" : "is-hint"}`}
            aria-hidden="true"
            style={{ left: `${feel}%` }}
          />
        </div>
        <p className="lab-hook-axis" aria-hidden="true">
          <span>Rough</span>
          <span className="lab-hook-axis-hint">tap or drag to your honest spot</span>
          <span>Great</span>
        </p>
      </div>

      <p
        className="lab-hook-readout"
        aria-live="polite"
        data-testid="lab-hero-headline"
      >
        Your day feels <strong>{feelWord(feel)}</strong> — the form records it
        as{" "}
        <strong className="lab-hook-filed">&ldquo;{recordedLabel}.&rdquo;</strong>{" "}
        {n === 2 ? (
          <span className="lab-hook-twist">
            With only two boxes, a wide range of real feelings all land on the
            same answer.
          </span>
        ) : direction === "level" ? (
          <span className="lab-hook-twist">
            With more options, your answer barely gets rounded.
          </span>
        ) : (
          <span className="lab-hook-twist">
            More options, less rounding — the record creeps back toward the
            truth.
          </span>
        )}
      </p>

      <div className="lab-hook-actions">
        <button
          type="button"
          className="lab-hook-step"
          onClick={stepBoxes}
          data-testid="lab-hook-step"
        >
          {stepLabel}
        </button>
        <span className="lab-hook-count" aria-hidden="true">
          {n} answer options
        </span>
      </div>

      <span className="lab-hook-note lab-cast-note">
        Nothing here is saved or sent.
      </span>

      <button
        type="button"
        className="lab-hook-cta"
        data-testid="lab-hero-cta"
        onClick={goToExercise}
      >
        Start the lab &rarr;
      </button>
    </div>
  );
}

export function SatisfactionLab() {
  return (
    <main id="survey-lab" className="lab-route" aria-labelledby="survey-lab-title">
      <header className="lab-route-head">
        <div className="lab-route-lead">
          <p className="lab-route-eyebrow">An interactive survey-design lab</p>
          <h1 className="lab-route-title" id="survey-lab-title" tabIndex={-1}>
            The quiet ways a survey lies.
          </h1>
          <p className="lab-route-subtitle lab-selectable">
            See how a survey&rsquo;s answer choices quietly distort what gets
            recorded — then learn to catch it.
          </p>
          <details className="lab-route-more">
            <summary className="lab-route-more-summary">How this works</summary>
            <div className="lab-route-more-body lab-selectable">
              <p>
                Twelve short exercises, each a different way answer choices bend
                what a survey records. Every one is a survey from the same
                fictional coffee shop, so only the answer design changes — never
                the topic. Move the controls, watch a small fixed cast answer,
                and read the consequence. A closing map tracks what you covered.
              </p>
              <p>
                About 35 minutes, in any order. The people in each exercise are
                authored, illustrative cases — a fixed cast to reason about, not
                real respondents or survey statistics. Nothing you do is
                uploaded or analyzed.
              </p>
            </div>
          </details>
        </div>

        <HeroProof />
      </header>

      <LabContents />

      <ol className="lab-exercises">
        <li>
          <ScaleBuilderExercise num={1} />
        </li>
        <li>
          <DoubleBarreledExercise num={2} />
        </li>
        <li>
          <FalsePremiseExercise num={3} />
        </li>
        <li>
          <BucketTinkerExercise num={4} />
        </li>
        <li>
          <ChannelTinkerExercise num={5} />
        </li>
        <li>
          <AcquiescenceExercise num={6} />
        </li>
        <li>
          <ScaleLengthExercise num={7} />
        </li>
        <li>
          <OatMilkExercise num={8} />
        </li>
        <li>
          <VerbalLabelsExercise num={9} />
        </li>
        <li>
          <QuantifierExercise num={10} />
        </li>
        <li>
          <OrderExercise num={11} />
        </li>
        <li>
          <ShipReviewExercise num={12} />
        </li>
      </ol>

      <KnowledgeMap />
    </main>
  );
}

/* ───────────────────────────────────────────────────────────────────────
   Shared: a prominent task band (hoisted to the top of task-driven
   exercises so the task is the first thing the eye lands on, not a
   footnote in the corner).
   ─────────────────────────────────────────────────────────────────────── */

type LadderActive = {
  index: number;
  total: number;
  title: string;
  brief: string;
  hint: string;
};

function TaskBand({
  items,
  active,
  passText,
  allDoneText,
  testidPrefix
}: {
  items: { id: string; title: string; done: boolean; active: boolean }[];
  active: LadderActive | null;
  passText: string | null;
  allDoneText: string | null;
  testidPrefix: string;
}) {
  /* The dormant next step, previewed under the active one so the stepper reads
     forward like an app flow rather than a flat checklist. */
  const activeIdx = items.findIndex((t) => t.active);
  const nextItem =
    activeIdx >= 0
      ? items.slice(activeIdx + 1).find((t) => !t.done) ?? null
      : null;

  return (
    <div className="lab-taskband" aria-live="polite">
      <p className="lab-taskband-key">What to settle</p>
      <ol className="lab-task-list">
        {items.map((t, i) => (
          <li
            key={t.id}
            className={`lab-task ${t.done ? "is-done" : ""} ${t.active ? "is-active" : ""}`}
            data-testid={`${testidPrefix}-${t.id}`}
          >
            <span className="lab-task-mark" aria-hidden="true">
              {t.done ? "✓" : i + 1}
            </span>
            <span className="lab-task-title">{t.title}</span>
          </li>
        ))}
      </ol>

      {passText && (
        <p className="lab-task-pass" aria-live="polite">
          <span aria-hidden="true">✓ </span>
          {passText}
        </p>
      )}

      {active ? (
        <div className="lab-task-active" aria-live="polite">
          <p className="lab-task-brief">
            <span className="lab-task-brief-key">
              Check {active.index} of {active.total}: {active.title}
            </span>
            {active.brief}
          </p>
          <p className="lab-task-hint">{active.hint}</p>
          {nextItem && (
            <p className="lab-task-next">
              <span className="lab-task-next-key" aria-hidden="true">
                Then
              </span>
              {nextItem.title}
            </p>
          )}
        </div>
      ) : allDoneText ? (
        <p className="lab-task-pass">{allDoneText}</p>
      ) : null}
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────
   Exercise 1 — Scale builder + hostile flip  (verb: TINKER)
   ─────────────────────────────────────────────────────────────────────── */

function ScaleBuilderExercise({ num }: { num: number }) {
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
      num={num}
      title="Design the scale; see the lie; learn the tells."
      issue="Leading stems · missing strong-negatives · no neutral midpoint · primacy"
      decision="whether leadership reads the shop as loved or merely tolerated."
      modifier="scale-builder"
      verb="tinker"
      nextTeaser="Next: a clean-looking item can still ask two things at once. Don’t use “and” as your detector."
    >
      <div className="lab-console">
        <div className="lab-console-task">
          <p className="lab-console-scenario">
            You design the answer scale for one question; five visitors answer
            and their true feelings never change — only your options and wording
            do. It ships today as a bare Satisfied / Dissatisfied choice with a
            leading question, already reading <strong>4 of 5 satisfied</strong>{" "}
            when only two truly are.
          </p>

      <TaskBand
        testidPrefix="lab-task"
        items={tasks.map((t) => ({
          id: t.id,
          title: t.title,
          done: completed.includes(t.id),
          active: t.id === activeTask?.id
        }))}
        active={
          activeTask
            ? {
                index: activeIndex + 1,
                total: tasks.length,
                title: activeTask.title,
                brief: activeTask.brief,
                hint: activeTask.hint(design)
              }
            : null
        }
        passText={
          lastDoneTask && lastDoneTask.id !== "hostile"
            ? lastDoneTask.passText
            : null
        }
        allDoneText={null}
      />
        </div>

        <div className="lab-console-work">
      <section className="lab-builder" aria-label="Design the answer scale">
          <div className="lab-question">
            <p className="lab-question-key">The survey asks</p>
            <p className="lab-question-stem lab-selectable">{stemText[design.stem]}</p>
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
            <p className="lab-control-key">Answer order — a source of pressure, not bias in the stem</p>
            <div className="lab-segmented" role="group" aria-label="Answer order">
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
              The available answer options — tap to add or remove
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

        <section className="lab-readout" aria-label="Results">
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
            <CastCountNote className="lab-cast-note--readout" />
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
                      <span className="lab-cast-feeling lab-selectable">
                        {c.feeling}
                      </span>
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
        </section>
        </div>
      </div>

      {hostileDone && (
        <section className="lab-flip" aria-labelledby="lab-flip-title">
          <p className="lab-flip-eyebrow">The flip</p>
          <h3 id="lab-flip-title">Look at what you just did.</h3>
          <p className="lab-selectable">
            You didn&rsquo;t change a single visitor&rsquo;s feeling — you
            changed the options and the wording, and the report now reads{" "}
            <strong>{satCount} of 5 satisfied</strong>. That&rsquo;s the kind of
            number an owner may act on: read it as &ldquo;people are happy&rdquo;
            and the problem the unhappy ones saw can stay hidden, because they
            never surface to say otherwise. Every move you made is a tell
            you can now read in someone else&rsquo;s survey:
          </p>
          <ul className="lab-tells lab-selectable">
            {biasTells(design)
              .filter((t) => t.present)
              .map((t) => (
                <li key={t.id}>{t.tell}</li>
              ))}
          </ul>
          {eveLanding && isSatisfied(eveLanding) ? (
            <p className="lab-flip-eve lab-selectable">
              Eve left without coffee — and your data files her as &ldquo;
              {eveLanding.label}.&rdquo;
            </p>
          ) : eveLanding ? (
            <p className="lab-flip-eve lab-selectable">
              Even now, Eve (who left without coffee) reads as &ldquo;
              {eveLanding.label}&rdquo; — soften the scale one notch more
              and watch her vanish into the positive side.
            </p>
          ) : null}
          <p className="lab-flip-takeaway lab-selectable">
            Next time you&rsquo;re handed a &ldquo;92% satisfied,&rdquo; ask
            to see the stem, the scale, and the order before you believe it.
          </p>
          <p className="lab-claim-caveat lab-selectable">
            This cast is illustrative. The <em>direction</em> of each effect —
            a leading stem pulling answers up, missing strong-negatives,
            primacy on a long list — is well documented; the exact{" "}
            <em>size</em> in any real survey depends on the topic, the mode,
            and the wording.
          </p>
        </section>
      )}

      <PostReceipt exerciseId="E1" visible={hostileDone} />
      <SourceDrawer exerciseId="E1" visible={hostileDone} />
    </ExerciseFrame>
  );
}

/* ───────────────────────────────────────────────────────────────────────
   Exercise 2 — Double-barreled flag + repair  (verb: REPAIR)
   ─────────────────────────────────────────────────────────────────────── */

function DoubleBarreledExercise({ num }: { num: number }) {
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
  const falseFlags = Array.from(flagged).filter((id) => !bundledIds.includes(id));

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
      num={num}
      title="Flag the bundled items; then fix the worst one."
      issue="Double-barreled · triple-barreled · why “and” isn't the test"
      decision="which part of the service to fix when one score hides two judgments."
      modifier="double-barreled"
      verb="repair"
      nextTeaser="Next: the question wording isn’t the problem. The wrong people are answering it."
    >
      <p className="lab-exercise-setup">
        A draft of the coffee-shop survey came back for review. Flag every item
        that bundles two (or more) separable judgments into one answer slot.
        Careful: two bundled items use no &ldquo;and&rdquo; at all, and two
        items that <em>do</em> say &ldquo;and&rdquo; aren&rsquo;t bundled —
        the test is whether a visitor could feel oppositely about two parts,
        not the word. Flag, then check.
      </p>

      <ul className="lab-bundled-list" aria-label="Draft survey items">
        {doubleBarreledItems.map((item, i) => {
          const isFlagged = flagged.has(item.id);
          const shouldFlag =
            item.kind === "bundled-2" || item.kind === "bundled-3";
          const verdict = !revealed
            ? null
            : shouldFlag
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
                    ? shouldFlag
                      ? "✓"
                      : "·"
                    : verdict === "missed"
                      ? "·"
                      : verdict === "false-positive"
                        ? "✗"
                        : isFlagged
                          ? "⚑"
                          : ""}
                </span>
                <span className="lab-bundled-body">
                  <span className="lab-bundled-text lab-selectable">
                    {item.text}
                  </span>
                  {revealed && (
                    <span className="lab-bundled-note">{item.note}</span>
                  )}
                  {revealed && shouldFlag && item.ideas && (
                    <span className="lab-bundled-split" aria-hidden="true">
                      <span className="lab-bundled-split-key">
                        one slot, {item.ideas.length} judgments
                      </span>
                      <span className="lab-bundled-split-pills">
                        {item.ideas.map((idea) => (
                          <span key={idea} className="lab-bundled-split-pill">
                            {idea}
                          </span>
                        ))}
                      </span>
                    </span>
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
              <strong>Still missed:</strong> {missedBundled.length} bundled
              item{missedBundled.length === 1 ? "" : "s"} unflagged. Two of the
              bundled ones have no &ldquo;and&rdquo; — look for a comma or a
              verb-plus-adverb that smuggles in a second judgment.
            </p>
          )}
          {falseFlags.length > 0 && (
            <p>
              <strong>False flag:</strong> {falseFlags.length} item
              {falseFlags.length === 1 ? "" : "s"} flagged that aren&rsquo;t
              bundled. An &ldquo;and&rdquo; inside a program&rsquo;s name, or in
              who you&rsquo;d recommend us to, isn&rsquo;t two measurements.
            </p>
          )}
        </div>
      )}

      {flagPassed && (
        <p className="lab-exercise-pass lab-selectable" data-testid="lab-bundled-pass">
          ✓ Six flagged: five two-part bundles — two of them with no
          &ldquo;and&rdquo; at all (the comma in &ldquo;hot, fresh&rdquo; and
          the verb-plus-adverb in &ldquo;fix… quickly&rdquo;) — and one triple.
          The two you left alone do say &ldquo;and,&rdquo; but it sits in a
          program&rsquo;s name and in the people you&rsquo;d recommend us to,
          not in two things being rated. The word is never the test; two
          separable judgments is. Miss one and it ships as a single number — a
          low score with no way to tell which half to fix.
        </p>
      )}

      {flagPassed && (
        <section className="lab-repair" aria-labelledby="lab-repair-title">
          <header className="lab-repair-head">
            <p className="lab-repair-key">Sub-task 2 · Repair the triple-barreled</p>
            <h3 id="lab-repair-title" className="lab-repair-title lab-selectable">
              &ldquo;Was your barista friendly, attentive, and quick?&rdquo;
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
            role="group"
            aria-label="Repair candidates"
          >
            {tripleSplitOptions.map((s) => {
              const picked = splitPick === s.id;
              const verdictClass = picked ? `is-${s.verdict}` : "";
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={picked}
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
                  <span className="lab-repair-label lab-selectable">{s.label}</span>
                </button>
              );
            })}
          </div>

          {splitPicked && (
            <div
              className={`lab-repair-ledger lab-repair-ledger--${splitPicked.verdict} lab-selectable`}
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
      <SourceDrawer exerciseId="E2" visible={exercisePassed} />
    </ExerciseFrame>
  );
}

/* ───────────────────────────────────────────────────────────────────────
   Exercise 3 — MECE bucket tinker  (verb: TINKER)
   ─────────────────────────────────────────────────────────────────────── */

/* The age ruler that turns the bucket edit into a picture. Age is a real number
   line, so the buckets are bands you can drag along it and the ten respondents
   are dots that fall into a GAP (no band over them) or under an OVERLAP (two
   bands) — the two failures you otherwise read off a list. Inclusive integer
   buckets cover [start, end], so a band visually spans [start, end+1) and the
   …24 / 25… pair sits flush with no false gap; an overlap appears exactly where
   two buckets share a boundary number. This layer is a pointer-driven
   enhancement and is aria-hidden: the number inputs and the respondent list
   below stay the keyboard/assistive-tech path and the tested source of truth. */
const AXIS_MIN = 0;
const AXIS_MAX = 100;
function axisPct(age: number): number {
  return ((age - AXIS_MIN) / (AXIS_MAX - AXIS_MIN)) * 100;
}
function bandRightAge(b: AgeBucket): number {
  return b.end == null ? AXIS_MAX : Math.min(AXIS_MAX, b.end + 1);
}
type AxisInterval = { lo: number; hi: number };
function mergeIntervals(ivs: AxisInterval[]): AxisInterval[] {
  const sorted = ivs.filter((i) => i.hi > i.lo).sort((a, b) => a.lo - b.lo);
  const out: AxisInterval[] = [];
  for (const iv of sorted) {
    const last = out[out.length - 1];
    if (last && iv.lo <= last.hi) last.hi = Math.max(last.hi, iv.hi);
    else out.push({ ...iv });
  }
  return out;
}
function coverageGaps(buckets: AgeBucket[]): AxisInterval[] {
  const covered = mergeIntervals(
    buckets.map((b) => ({ lo: b.start, hi: bandRightAge(b) }))
  );
  const gaps: AxisInterval[] = [];
  let cursor = AXIS_MIN;
  for (const iv of covered) {
    if (iv.lo > cursor) gaps.push({ lo: cursor, hi: iv.lo });
    cursor = Math.max(cursor, iv.hi);
  }
  if (cursor < AXIS_MAX) gaps.push({ lo: cursor, hi: AXIS_MAX });
  return gaps;
}
function bucketOverlaps(buckets: AgeBucket[]): AxisInterval[] {
  const out: AxisInterval[] = [];
  for (let i = 0; i < buckets.length; i++) {
    for (let j = i + 1; j < buckets.length; j++) {
      const lo = Math.max(buckets[i].start, buckets[j].start);
      const hi = Math.min(bandRightAge(buckets[i]), bandRightAge(buckets[j]));
      if (hi > lo) out.push({ lo, hi });
    }
  }
  return out;
}

const AXIS_TICKS = [0, 18, 25, 35, 45, 65, 100];

function BucketAxis({
  buckets,
  onEdit
}: {
  buckets: AgeBucket[];
  onEdit: (id: string, patch: Partial<AgeBucket>) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragTarget, setDragTarget] = useState<{
    id: string;
    edge: "start" | "end";
  } | null>(null);
  /* Read the latest props inside the window-level drag listeners without
     re-subscribing on every keystroke/edit. */
  const bucketsRef = useRef(buckets);
  bucketsRef.current = buckets;
  const onEditRef = useRef(onEdit);
  onEditRef.current = onEdit;

  const ageFromClientX = (clientX: number): number => {
    const el = trackRef.current;
    if (!el) return AXIS_MIN;
    const rect = el.getBoundingClientRect();
    const pct = (clientX - rect.left) / rect.width;
    return clampInt(AXIS_MIN + pct * (AXIS_MAX - AXIS_MIN), AXIS_MIN, AXIS_MAX);
  };

  /* Drag is tracked on window (not via pointer capture on the handle) because
     the handle re-renders mid-gesture, which can drop capture. */
  useEffect(() => {
    if (!dragTarget) return;
    const move = (e: PointerEvent) => {
      const b = bucketsRef.current.find((x) => x.id === dragTarget.id);
      if (!b) return;
      const age = ageFromClientX(e.clientX);
      if (dragTarget.edge === "start") {
        const cap = b.end == null ? AXIS_MAX : b.end;
        onEditRef.current(dragTarget.id, { start: Math.min(age, cap) });
      } else {
        /* The right edge sits one past the inclusive end, so end = age − 1. */
        onEditRef.current(dragTarget.id, {
          end: clampInt(age - 1, b.start, AXIS_MAX)
        });
      }
    };
    const up = () => setDragTarget(null);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [dragTarget]);

  const onHandleDown = (
    e: React.PointerEvent,
    id: string,
    edge: "start" | "end"
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDragTarget({ id, edge });
  };

  const gaps = coverageGaps(buckets);
  const overlaps = bucketOverlaps(buckets);

  return (
    <div className="lab-bucket-axis" aria-hidden="true">
      <div className="lab-bucket-axis-track" ref={trackRef}>
        {/* uncovered stretches */}
        {gaps.map((g, i) => (
          <span
            key={`gap-${i}`}
            className="lab-bucket-axis-gap"
            style={{ left: `${axisPct(g.lo)}%`, width: `${axisPct(g.hi) - axisPct(g.lo)}%` }}
          />
        ))}
        {/* the bucket bands (visual) */}
        {buckets.map((b, i) => {
          const left = axisPct(b.start);
          const width = axisPct(bandRightAge(b)) - left;
          return (
            <div
              key={b.id}
              className="lab-bucket-axis-band"
              style={{ left: `${left}%`, width: `${width}%` }}
              data-band-index={i}
            >
              <span className="lab-bucket-axis-band-label">
                {i + 1}&nbsp;·&nbsp;{formatBucket(b)}
              </span>
            </div>
          );
        })}
        {/* double-covered stretches, drawn on top of the bands */}
        {overlaps.map((o, i) => (
          <span
            key={`ov-${i}`}
            className="lab-bucket-axis-overlap"
            style={{ left: `${axisPct(o.lo)}%`, width: `${axisPct(o.hi) - axisPct(o.lo)}%` }}
          />
        ))}
        {/* drag handles in their own top layer, so a band's edge handle is never
            buried under an adjacent (overlapping) band */}
        {buckets.map((b) => {
          const open = b.end == null;
          return (
            <span key={`h-${b.id}`}>
              <span
                className={`lab-bucket-axis-handle lab-bucket-axis-handle--start ${dragTarget?.id === b.id && dragTarget.edge === "start" ? "is-dragging" : ""}`}
                style={{ left: `${axisPct(b.start)}%` }}
                onPointerDown={(e) => onHandleDown(e, b.id, "start")}
              />
              <span
                className={`lab-bucket-axis-handle lab-bucket-axis-handle--end ${open ? "is-open" : ""} ${dragTarget?.id === b.id && dragTarget.edge === "end" ? "is-dragging" : ""}`}
                style={{ left: `${axisPct(bandRightAge(b))}%` }}
                onPointerDown={(e) => onHandleDown(e, b.id, "end")}
              />
            </span>
          );
        })}
      </div>

      {/* the ten respondents as dots that fall into gaps / overlaps */}
      <div className="lab-bucket-axis-dots">
        {ageRespondents.map((r, i) => {
          const fits = bucketsContainingAge(r.age, buckets);
          const state =
            fits.length === 0 ? "uncovered" : fits.length === 1 ? "clean" : "double";
          return (
            <span
              key={r.id}
              className={`lab-bucket-axis-dot is-${state} ${i % 2 === 0 ? "row-a" : "row-b"}`}
              style={{ left: `${axisPct(r.age + 0.5)}%` }}
              title={`${r.name}, ${r.age}`}
            >
              <span className="lab-bucket-axis-dot-mark" />
              <span className="lab-bucket-axis-dot-name">
                {r.name} {r.age}
              </span>
            </span>
          );
        })}
      </div>

      <div className="lab-bucket-axis-ticks">
        {AXIS_TICKS.map((t) => (
          <span key={t} className="lab-bucket-axis-tick" style={{ left: `${axisPct(t)}%` }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function BucketTinkerExercise({ num }: { num: number }) {
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
  const activeIndex = activeTask ? bucketTasks.indexOf(activeTask) : bucketTasks.length;
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
  const reset = () => setBuckets(startingAgeBuckets.map((b) => ({ ...b })));

  return (
    <ExerciseFrame
      num={num}
      title="Edit the age buckets until everyone fits."
      issue="Mutually-exclusive boundaries · covering the whole range"
      decision="whether the loyalty offer reaches young adults, mid-career visitors, or older regulars."
      modifier="bucket"
      verb="tinker"
      nextTeaser="Next: completeness changes with the decision. The same audience needs a different option set."
    >
      <BucketAxis buckets={buckets} onEdit={updateBucket} />

      <div className="lab-console">
        <div className="lab-console-task">
          <p className="lab-console-scenario">
            Age is asked in buckets. The starter set overlaps, skips under-18,
            and lumps everyone 45+. Edit the bands (drag on the timeline or type
            ages) until all ten visitors land in exactly one — no{" "}
            <strong>gap</strong> nobody covers, no <strong>overlap</strong> two
            buckets share.
          </p>

      <TaskBand
        testidPrefix="lab-bucket-task"
        items={bucketTasks.map((t) => ({
          id: t.id,
          title: t.title,
          done: completed.includes(t.id),
          active: t.id === activeTask?.id
        }))}
        active={
          activeTask
            ? {
                index: activeIndex + 1,
                total: bucketTasks.length,
                title: activeTask.title,
                brief: activeTask.brief,
                hint: activeTask.hint(buckets)
              }
            : null
        }
        passText={
          lastDoneTask && !allDone ? lastDoneTask.passText : null
        }
        allDoneText={
          allDone
            ? "✓ All three done. The buckets now cover the whole range, every age lands in exactly one, and the 45-and-up lump is split."
            : null
        }
      />
        </div>

        <div className="lab-console-work">
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
            Leave &ldquo;End&rdquo; blank for an open-ended bucket
            (&ldquo;65+&rdquo;). The starter set&rsquo;s overlaps live where two
            buckets share a number — fix those first.
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
      </div>

      <PostReceipt exerciseId="E3" visible={allDone} />
      <SourceDrawer exerciseId="E3" visible={allDone} />
    </ExerciseFrame>
  );
}

/* ───────────────────────────────────────────────────────────────────────
   Exercise 4 — Pilot-iterate option set with consequence ledger (verb: TINKER)
   ─────────────────────────────────────────────────────────────────────── */

const channelStateText: Record<ChannelLandingState, string> = {
  clean: "on their true channel",
  lumped: "lumped into a broad bucket",
  other: "wrote it into “Other”",
  satisficed: "mis-filed here",
  abandoned: "left it blank"
};

function ChannelTinkerExercise({ num }: { num: number }) {
  const [offered, setOffered] = useState<string[]>([...startingChannels]);
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    setCompleted((prev) => {
      const active = channelTasks.find((t) => !prev.includes(t.id));
      if (active && active.pass(offered)) return [...prev, active.id];
      return prev;
    });
  }, [offered]);

  const tallies = channelTallies(offered);
  const ledger = channelLedger(offered);
  const allClean = channelAllClean(offered);
  const activeTask = channelTasks.find((t) => !completed.includes(t.id)) ?? null;
  const activeIndex = activeTask ? channelTasks.indexOf(activeTask) : channelTasks.length;
  const lastDoneId = completed[completed.length - 1];
  const lastDoneTask = lastDoneId
    ? channelTasks.find((t) => t.id === lastDoneId) ?? null
    : null;
  const allDone = completed.length === channelTasks.length;

  const toggle = (id: string) =>
    setOffered((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  const reset = () => setOffered([...startingChannels]);

  /* Compact tally chips: Clean always, plus any nonzero problem states. */
  const problemChips: { key: string; n: number; label: string; cls: string }[] = [
    { key: "satisficed", n: tallies.satisficed, label: "Mis-filed", cls: "is-satisficed" },
    { key: "abandoned", n: tallies.abandoned, label: "Left blank", cls: "is-abandoned" },
    { key: "lumped", n: tallies.lumped, label: "Lumped", cls: "is-lumped" },
    { key: "other", n: tallies.other, label: "In “Other”", cls: "is-other" }
  ].filter((c) => c.n > 0);

  return (
    <ExerciseFrame
      num={num}
      title="Build the option set the whole audience can answer honestly."
      issue="Incomplete option sets · the “Other” trap · satisficing · fitting the list to the decision"
      decision="where to spend the ad budget — and which channels look bigger or smaller than they really are."
      modifier="channel"
      verb="tinker"
      nextTeaser="Next: try the standard fix, then catch why it still fails."
    >
      <div className="lab-console">
        <div className="lab-console-task">
          <p className="lab-console-scenario">
            Toggle the options for &ldquo;How did you hear about us?&rdquo; Seven
            visitors flow through — each lands on their true channel if it&rsquo;s
            offered, else the closest wrong option, &ldquo;Other,&rdquo; or
            nothing. The obvious keyword often points the wrong way.
          </p>
          <p className="lab-console-aside lab-selectable">
            First decide what the question <em>means</em> — first touch, most
            influential, or every channel. A &ldquo;complete&rdquo; list is
            downstream of that.
          </p>

      <TaskBand
        testidPrefix="lab-channel-task"
        items={channelTasks.map((t) => ({
          id: t.id,
          title: t.title,
          done: completed.includes(t.id),
          active: t.id === activeTask?.id
        }))}
        active={
          activeTask
            ? {
                index: activeIndex + 1,
                total: channelTasks.length,
                title: activeTask.title,
                brief: activeTask.brief,
                hint: activeTask.hint(offered)
              }
            : null
        }
        passText={lastDoneTask && !allDone ? lastDoneTask.passText : null}
        allDoneText={null}
      />
        </div>

        <div className="lab-console-work">
        <div className="lab-console-controls">
        <section className="lab-channel-shelf" aria-label="Toggle options">
          <p className="lab-channel-shelf-key">The option shelf — tap to offer or remove</p>
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
                    <span className="lab-channel-chip-label lab-selectable">
                      {c.label}
                    </span>
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

          <div className="lab-channel-ledger" aria-label="Consequence ledger">
            <LedgerMeter
              label="Answer-space coverage"
              hint="Does everyone have an option to pick? Visitors who give up hurt this. (Distinct from “coverage error” in sampling.)"
              level={ledger.coverage}
            />
            <LedgerMeter
              label="Analyst detail"
              hint="How many answers keep the TRUE channel. Only Clean counts."
              level={ledger.analystDetail}
            />
            <LedgerMeter
              label="Mutual exclusivity"
              hint="Could a visitor have two valid homes? A broad bucket overlapping a specific channel it covers kills it — two non-overlapping buckets don't."
              level={ledger.exclusivity}
            />
            <LedgerMeter
              label="Respondent burden"
              hint="How long the list is to read. More options costs attention."
              level={ledger.respondentBurden}
            />
          </div>
          <p className="lab-channel-ledger-note">
            A teaching readout, not a validated survey-quality score.
          </p>
        </div>

        <div className="lab-console-results">
        <section className="lab-channel-readout" aria-label="Live readout">
          <div className="lab-channel-tallies" aria-live="polite">
            <p className="lab-channel-tally-line">
              <span className="lab-channel-tally is-clean">
                <strong>{tallies.clean}</strong> Clean
              </span>
              {problemChips.map((c) => (
                <span key={c.key} className={`lab-channel-tally ${c.cls}`}>
                  <strong>{c.n}</strong> {c.label}
                </span>
              ))}
            </p>
            <p className="lab-channel-tally-note">
              Only &ldquo;Clean&rdquo; preserves the true channel. Lumped,
              Other, and mis-filed all lose it; &ldquo;left blank&rdquo;
              vanishes from the data entirely.
            </p>
            <CastCountNote className="lab-cast-note--readout" />
          </div>

          <ul className="lab-channel-cast">
            {channelRespondents.map((r) => {
              const landing = channelLandingFor(r, offered);
              const pickedLabel =
                landing.pickedId === ""
                  ? "— left blank —"
                  : channelBank.find((c) => c.id === landing.pickedId)?.label ??
                    "—";
              return (
                <li
                  key={r.id}
                  className={`lab-channel-cast-row is-${landing.state}`}
                  data-testid={`lab-channel-landing-${r.id}`}
                >
                  <span className="lab-channel-cast-who">
                    <strong>{r.name}</strong>
                    <span className="lab-channel-cast-story lab-selectable">
                      {" "}
                      {r.story}
                    </span>
                  </span>
                  <span className="lab-channel-cast-arrow" aria-hidden="true">
                    →
                  </span>
                  <span className="lab-channel-cast-landing">
                    <span className="lab-channel-cast-pick">{pickedLabel}</span>
                    <span className="lab-channel-cast-state">
                      {channelStateText[landing.state]}
                    </span>
                    {landing.state !== "clean" && (
                      <span className="lab-channel-cast-why lab-selectable">
                        {r.satisficeNote}
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
        </div>
        </div>
      </div>

      {allClean && !allDone && (
        <p className="lab-exercise-pass" aria-live="polite">
          ✓ Everyone&rsquo;s on their true channel. Now the owner asks a
          different question — see the task above.
        </p>
      )}

      {allDone && (
        <p className="lab-exercise-pass lab-selectable" data-testid="lab-channel-pass">
          ✓ You built the list two different right ways. For &ldquo;invest per
          channel,&rdquo; every channel needed its own option and a broad bucket
          would have destroyed the detail. For &ldquo;online vs offline,&rdquo;
          that same detail is wasted respondent effort and the broad split is
          exactly right. The lesson isn&rsquo;t &ldquo;buckets bad&rdquo; or
          &ldquo;buckets good&rdquo; — it&rsquo;s that the right grain, and even
          what counts as a &ldquo;complete&rdquo; list, depends on the decision
          the answers have to serve. (And &ldquo;Other&rdquo; stays an imperfect
          escape hatch the low-effort visitors won&rsquo;t use either way.)
        </p>
      )}

      <PostReceipt exerciseId="E4" visible={allDone} />
      <SourceDrawer exerciseId="E4" visible={allDone} />
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
   Display Exercise 12 / data id E5 — Review the draft before it ships
   (verb: REVIEW)
   ─────────────────────────────────────────────────────────────────────── */

const reviewDiagnoses: ReviewDiagnosis[] = [
  "slot",
  "ruler",
  "push",
  "boundary",
  "fine"
];

function ShipReviewExercise({ num }: { num: number }) {
  const [answers, setAnswers] = useState<Record<string, ReviewDiagnosis | null>>(
    () => {
      const init: Record<string, ReviewDiagnosis | null> = {};
      for (const el of reviewElements) init[el.id] = null;
      return init;
    }
  );
  const [revealed, setRevealed] = useState(false);

  const allDiagnosed = reviewElements.every((el) => answers[el.id] !== null);
  const perPassed: Record<string, boolean> = {};
  for (const el of reviewElements) perPassed[el.id] = answers[el.id] === el.correct;
  const allPassed = reviewElements.every((el) => perPassed[el.id]);
  const exercisePassed = revealed && allPassed;
  const hasError = revealed && !allPassed;

  const setDiagnosis = (id: string, d: ReviewDiagnosis) =>
    setAnswers((prev) => ({ ...prev, [id]: d }));

  /* A live review tray: how the reviewer has currently triaged the draft. It
     fills as you classify and makes restraint visible — a real review ends with
     a clean item and an out-of-scope one, not everything flagged. */
  const tray = { problem: 0, clean: 0, scope: 0, pending: 0 };
  for (const el of reviewElements) {
    const a = answers[el.id];
    if (a === null) tray.pending += 1;
    else if (a === "fine") tray.clean += 1;
    else if (a === "boundary") tray.scope += 1;
    else tray.problem += 1;
  }

  return (
    <ExerciseFrame
      num={num}
      title="Review the draft before it ships."
      issue="Putting the four lenses on a real survey · knowing where to stop"
      decision="what’s safe to ship — and what to leave alone."
      modifier="ship-review"
      verb="review"
    >
      <div className="lab-console lab-console--review">
        <div className="lab-console-task">
          <p className="lab-console-scenario">
            You&rsquo;re the last reviewer before this &ldquo;improved&rdquo;
            survey ships. Diagnose each draft part with one of the four lenses —
            or wave it through if it&rsquo;s fine. One part is a real problem
            that isn&rsquo;t about answer choices at all.
          </p>
          <p className="lab-console-rubric-key">The four lenses</p>

      <ul className="lab-review-lenses" aria-label="The four lenses">
        {(["slot", "ruler", "push", "boundary"] as const).map((d) => (
          <li key={d} className={`lab-review-lens lab-review-lens--${d}`}>
            <span className="lab-review-lens-name">{reviewDiagnosisLabel[d]}</span>
            <span className="lab-review-lens-ask lab-selectable">
              {reviewDiagnosisAsk[d]}
            </span>
          </li>
        ))}
      </ul>
        </div>

        <div className="lab-console-work lab-console-work--stack">
      <ol className="lab-review-draft" aria-label="The draft survey">
        {reviewElements.map((el) => {
          const picked = answers[el.id];
          const pass = perPassed[el.id];
          const cardClass = !revealed
            ? ""
            : pass
              ? "is-correct"
              : "is-wrong";
          return (
            <li
              key={el.id}
              className={`lab-review-item lab-review-item--${el.kind} ${cardClass}`}
              data-testid={`lab-review-${el.id}`}
            >
              <p className="lab-review-item-label">{el.label}</p>
              <p className="lab-review-item-text lab-selectable">{el.text}</p>
              {el.options && (
                <ol className="lab-review-item-options lab-selectable">
                  {el.options.map((o, i) => (
                    <li key={i}>{o}</li>
                  ))}
                </ol>
              )}

              <div
                className="lab-review-diagnose"
                role="group"
                aria-label={`Diagnose ${el.label}`}
              >
                {reviewDiagnoses.map((d) => {
                  const isPicked = picked === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      aria-pressed={isPicked}
                      className={`lab-review-choice lab-review-choice--${d} ${isPicked ? "is-picked" : ""}`}
                      data-testid={`lab-review-choice-${el.id}-${d}`}
                      onClick={() => {
                        if (!exercisePassed) setDiagnosis(el.id, d);
                      }}
                      disabled={exercisePassed}
                    >
                      {reviewDiagnosisLabel[d]}
                    </button>
                  );
                })}
              </div>

              {revealed && (
                <p
                  className={`lab-review-feedback is-${pass ? "correct" : "wrong"} lab-selectable`}
                  aria-live="polite"
                  data-testid={`lab-review-feedback-${el.id}`}
                >
                  {pass ? (
                    el.whenRight
                  ) : (
                    <>
                      <strong>Not quite.</strong> {el.hint}
                    </>
                  )}
                </p>
              )}
            </li>
          );
        })}
      </ol>

        </div>
      </div>

      <div className="lab-review-tray" aria-live="polite" data-testid="lab-review-tray">
        <span className="lab-review-tray-key">Review tray</span>
        <span className="lab-review-tray-chip lab-review-tray-chip--problem">
          <strong>{tray.problem}</strong> answer-choice problem
          {tray.problem === 1 ? "" : "s"}
        </span>
        <span className="lab-review-tray-chip lab-review-tray-chip--clean">
          <strong>{tray.clean}</strong> clean
        </span>
        <span className="lab-review-tray-chip lab-review-tray-chip--scope">
          <strong>{tray.scope}</strong> out of scope
        </span>
        {tray.pending > 0 && (
          <span className="lab-review-tray-chip lab-review-tray-chip--pending">
            <strong>{tray.pending}</strong> still to read
          </span>
        )}
      </div>

      <div className="lab-exercise-actions">
        <button
          type="button"
          className="lab-action-button"
          data-testid="lab-review-check"
          onClick={() => setRevealed(true)}
          disabled={!allDiagnosed || exercisePassed}
        >
          {exercisePassed
            ? "Review signed off"
            : allDiagnosed
              ? "Submit the review"
              : "Diagnose every part first"}
        </button>
        {revealed && !exercisePassed && (
          <button
            type="button"
            className="lab-action-button lab-action-button--ghost"
            data-testid="lab-review-try-again"
            onClick={() => setRevealed(false)}
          >
            Take another pass
          </button>
        )}
      </div>

      {hasError && (
        <p
          className="lab-exercise-error"
          aria-live="polite"
          data-testid="lab-review-error"
        >
          Some calls are off — read the note under each one marked wrong, then
          take another pass. (Remember the clean question that should just
          ship, and that the send-list problem isn&rsquo;t about answer
          choices at all.)
        </p>
      )}

      {exercisePassed && (
        <p className="lab-exercise-pass lab-selectable" data-testid="lab-review-pass">
          ✓ Signed off. You put all four lenses on a real draft, left the clean
          question alone, and caught that the send-list problem — real as it is
          — lives outside what fixing answer choices can do. That last call is
          the whole point of the closing map below: know which inspection
          you&rsquo;re running, and where it stops.
        </p>
      )}

      <PostReceipt exerciseId="E5" visible={exercisePassed} />
      <SourceDrawer exerciseId="E5" visible={exercisePassed} />
    </ExerciseFrame>
  );
}

/* ───────────────────────────────────────────────────────────────────────
   Exercise 6 — Scale length / granularity  (verb: TINKER)
   ─────────────────────────────────────────────────────────────────────── */

function ScaleLengthExercise({ num }: { num: number }) {
  const [points, setPoints] = useState<number>(scaleLengthStart);
  /* Predict-then-reveal: the visitor commits a guess before the meters appear,
     so the exercise is "commit, then check," not "click all five til both go
     green." `predicted` = their first pick; null = haven't guessed yet. */
  const [predicted, setPredicted] = useState<number | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const hasPredicted = predicted !== null;

  useEffect(() => {
    if (!hasPredicted) return;
    setCompleted((prev) => {
      const active = scaleTasks.find((t) => !prev.includes(t.id));
      if (active && active.pass(points)) return [...prev, active.id];
      return prev;
    });
  }, [points, hasPredicted]);

  const pick = (n: number) => {
    if (predicted === null) setPredicted(n);
    setPoints(n);
  };

  const activeTask = scaleTasks.find((t) => !completed.includes(t.id)) ?? null;
  const activeIndex = activeTask ? scaleTasks.indexOf(activeTask) : scaleTasks.length;
  const lastDoneId = completed[completed.length - 1];
  const lastDoneTask = lastDoneId
    ? scaleTasks.find((t) => t.id === lastDoneId) ?? null
    : null;
  const allDone = completed.length === scaleTasks.length;
  const meters = scaleMeters(points);
  const groups = scaleCollapsedGroups(points);

  return (
    <ExerciseFrame
      num={num}
      title="Pick how many points the scale offers."
      issue="Scale length / granularity · the 5–7 default · false precision"
      decision="how finely you can rank satisfaction before the numbers stop being real."
      modifier="scale-length"
      verb="tinker"
      nextTeaser="Next: Neutral is not a junk drawer. Give the non-answers their own homes."
    >
      <div className="lab-console">
        <div className="lab-console-task">
          <p className="lab-console-scenario">
            Length is the <em>last</em> scale decision — what you&rsquo;re
            measuring, the endpoints, and whether there&rsquo;s a midpoint are
            already settled, so the only knob left is how many points. Six
            visitors with real in-between feelings. More points <em>feels</em>{" "}
            more precise — commit a guess before the meters reveal, then tinker.
          </p>

      <TaskBand
        testidPrefix="lab-scale-task"
        items={scaleTasks.map((t) => ({
          id: t.id,
          title: t.title,
          done: completed.includes(t.id),
          active: t.id === activeTask?.id
        }))}
        active={
          activeTask
            ? {
                index: activeIndex + 1,
                total: scaleTasks.length,
                title: activeTask.title,
                brief: activeTask.brief,
                hint: activeTask.hint(points)
              }
            : null
        }
        passText={lastDoneTask && !allDone ? lastDoneTask.passText : null}
        allDoneText={
          allDone
            ? "✓ Both meters high — the 5-to-7 range is the usual professional default."
            : null
        }
      />
        </div>

        <div className="lab-console-work lab-console-work--stack">
      <div className="lab-control">
        <p className="lab-control-key">
          {hasPredicted
            ? "Number of scale points"
            : "Predict first — which length reads well on BOTH meters?"}
        </p>
        <div
          className="lab-segmented lab-segmented--wide"
          role="group"
          aria-label="Number of scale points"
        >
          {scaleLengthChoices.map((n) => (
            <button
              key={n}
              type="button"
              className={`lab-seg ${points === n && hasPredicted ? "is-on" : ""} ${predicted === n ? "is-predicted" : ""}`}
              aria-pressed={points === n}
              data-testid={`lab-scale-points-${n}`}
              onClick={() => pick(n)}
            >
              {n} points
            </button>
          ))}
        </div>
      </div>

      {!hasPredicted && (
        <p className="lab-scalelen-predict lab-selectable">
          Pick one to commit your guess. No peeking — the cast and the meters
          appear after you choose.
        </p>
      )}

      {hasPredicted && (
        <>
          <p className="lab-scalelen-reveal lab-selectable" aria-live="polite">
            You predicted <strong>{predicted} points</strong>. Here&rsquo;s how
            every length actually does — tinker and compare.
          </p>

      <div className="lab-scalelen-grid">
        <section className="lab-scalelen-scale" aria-label="The scale as offered">
          <p className="lab-scalelen-key">The scale, as the respondent sees it</p>
          <ol className="lab-scalelen-points lab-selectable">
            {scalePointLabels(points).map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ol>
        </section>

        <section className="lab-scalelen-castbox" aria-label="Where each visitor lands">
          <p className="lab-scalelen-key">Where the six visitors land</p>
          <ul className="lab-scalelen-rows">
            {scaleLengthCast.map((v) => {
              const land = scaleLandingFor(v, points);
              return (
                <li
                  key={v.id}
                  className={`lab-scalelen-row ${land.ambiguous ? "is-ambiguous" : ""}`}
                  data-testid={`lab-scale-landing-${v.id}`}
                >
                  <span className="lab-scalelen-who">
                    <strong>{v.name}</strong>
                    <span className="lab-scalelen-feeling lab-selectable">
                      {" "}
                      {v.feeling} ({v.trueval})
                    </span>
                  </span>
                  <span className="lab-scalelen-arrow" aria-hidden="true">→</span>
                  <span className="lab-scalelen-pick">
                    {land.label}
                    {land.ambiguous && land.altLabel && (
                      <span className="lab-scalelen-flag">
                        could just as easily pick “{land.altLabel}”
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {groups.length > 0 && (
        <p className="lab-scalelen-collapse lab-selectable" aria-live="polite">
          At {points} points,{" "}
          {groups.map((g) => g.names.join(" & ")).join("; ")} are forced to
          give the same answer though they feel quite differently.
        </p>
      )}

      <div className="lab-channel-ledger" aria-label="Readouts">
        <LedgerMeter
          label="Distinctions kept"
          hint="Do genuinely-different visitors avoid being forced onto the same answer?"
          level={meters.distinctions}
        />
        <LedgerMeter
          label="Each answer trustworthy"
          hint="Are points farther apart than people can reliably tell — so no wobble between neighbours?"
          level={meters.trustworthy}
        />
      </div>
        </>
      )}
        </div>
      </div>

      {allDone && (
        <p className="lab-exercise-pass lab-selectable" data-testid="lab-scale-pass">
          ✓ More points is not more truth. Too few crushed real differences;
          too many (the 11-point scale) asked for distinctions finer than
          people can actually feel, so the same person would land on different
          neighbouring points on a different day. 5 to 7 points is the usual
          default — match it to the distinction you genuinely need to make.
        </p>
      )}

      <PostReceipt exerciseId="E6" visible={allDone} />
      <SourceDrawer exerciseId="E6" visible={allDone} />
    </ExerciseFrame>
  );
}

/* ───────────────────────────────────────────────────────────────────────
   Exercise 7 — Don't know / Not applicable / Neutral  (verb: COMPARE)
   ─────────────────────────────────────────────────────────────────────── */

function OatMilkExercise({ num }: { num: number }) {
  /* Two independent opt-out toggles instead of four preset tabs: the visitor
     BUILDS the opt-out set ("which does this question need?") and discovers that
     a "Don't know" alone looks done but secretly lumps the never-tried in. */
  const [dk, setDk] = useState(false);
  const [na, setNa] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const design = oatMilkDesigns.find((d) => d.hasDK === dk && d.hasNA === na)!;

  useEffect(() => {
    setCompleted((prev) => {
      const active = oatMilkTasks.find((t) => !prev.includes(t.id));
      if (active && active.pass(design)) return [...prev, active.id];
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dk, na]);

  const activeTask = oatMilkTasks.find((t) => !completed.includes(t.id)) ?? null;
  const activeIndex = activeTask ? oatMilkTasks.indexOf(activeTask) : oatMilkTasks.length;
  const lastDoneId = completed[completed.length - 1];
  const lastDoneTask = lastDoneId
    ? oatMilkTasks.find((t) => t.id === lastDoneId) ?? null
    : null;
  const allDone = completed.length === oatMilkTasks.length;
  const phantom = oatMilkPhantomOnScale(design);
  const conflation = oatMilkConflation(design);

  return (
    <ExerciseFrame
      num={num}
      title="Give the “no answer” somewhere honest to go."
      issue="Don't-know · not-applicable · why a neutral is none of these"
      decision="whether oat milk is disliked, unknown, or simply never tried."
      modifier="oat-milk"
      verb="compare"
      nextTeaser="Next: the numbers look tidy in the export. The middle still has no shared meaning."
    >
      <div className="lab-console">
        <div className="lab-console-task">
          <p className="lab-console-scenario">
            Satisfaction with the new oat-milk drinks, on a five-point scale.
            Seven answer — but three have no real view (one no opinion, two
            never tried it). Add the opt-outs that give them somewhere honest to
            go. The obvious first fix isn&rsquo;t the whole fix.
          </p>

      <TaskBand
        testidPrefix="lab-oat-task"
        items={oatMilkTasks.map((t) => ({
          id: t.id,
          title: t.title,
          done: completed.includes(t.id),
          active: t.id === activeTask?.id
        }))}
        active={
          activeTask
            ? {
                index: activeIndex + 1,
                total: oatMilkTasks.length,
                title: activeTask.title,
                brief: activeTask.brief,
                hint: activeTask.hint(design)
              }
            : null
        }
        passText={lastDoneTask && !allDone ? lastDoneTask.passText : null}
        allDoneText={null}
      />
        </div>

        <div className="lab-console-work">
      <div className="lab-control">
        <p className="lab-control-key">
          The five-point scale is always there. Add opt-outs:
        </p>
        <div
          className="lab-oat-designs"
          role="group"
          aria-label="Opt-out options to add"
        >
          <button
            type="button"
            aria-pressed={dk}
            className={`lab-oat-design ${dk ? "is-on" : ""}`}
            data-testid="lab-oat-toggle-dk"
            onClick={() => setDk((v) => !v)}
          >
            <span className="lab-oat-toggle-mark" aria-hidden="true">
              {dk ? "✓" : "+"}
            </span>
            Add &ldquo;Don&rsquo;t know / no opinion&rdquo;
          </button>
          <button
            type="button"
            aria-pressed={na}
            className={`lab-oat-design ${na ? "is-on" : ""}`}
            data-testid="lab-oat-toggle-na"
            onClick={() => setNa((v) => !v)}
          >
            <span className="lab-oat-toggle-mark" aria-hidden="true">
              {na ? "✓" : "+"}
            </span>
            Add &ldquo;Not applicable / haven&rsquo;t tried it&rdquo;
          </button>
        </div>
      </div>

        <div className="lab-console-results">
      <p className="lab-oat-note lab-selectable" aria-live="polite">
        {design.note}
      </p>

      <ul className="lab-oat-cast" aria-label="Where each visitor lands">
        {oatMilkCast.map((v) => {
          const land = oatMilkLandingFor(v, design);
          return (
            <li
              key={v.id}
              className={`lab-oat-row is-${land.quality}`}
              data-testid={`lab-oat-landing-${v.id}`}
            >
              <span className="lab-oat-who">
                <strong>{v.name}</strong>
                <span className="lab-oat-story lab-selectable"> {v.story}</span>
              </span>
              <span className="lab-oat-arrow" aria-hidden="true">→</span>
              <span className="lab-oat-pick">
                {land.label}
                <span className="lab-oat-tag">
                  {land.quality === "clean"
                    ? "honest"
                    : land.quality === "forced"
                      ? "forced onto Neutral"
                      : "lumped into Don't-know"}
                </span>
              </span>
            </li>
          );
        })}
      </ul>

      <p className="lab-oat-summary lab-selectable" aria-live="polite">
        {phantom} forced onto the satisfaction scale who shouldn&rsquo;t be
        there · {conflation} never-tried visitor
        {conflation === 1 ? "" : "s"} hidden inside &ldquo;Don&rsquo;t
        know.&rdquo;
      </p>
      <CastCountNote className="lab-cast-note--readout" />
        </div>
        </div>
      </div>

      {allDone && (
        <div className="lab-oat-done">
          <p className="lab-exercise-pass lab-selectable" data-testid="lab-oat-pass">
            ✓ An opt-out didn&rsquo;t weaken the survey — it&rsquo;s what makes
            the rest of the numbers trustworthy, by keeping people with no view
            out of the average. And a true Neutral, a &ldquo;Don&rsquo;t
            know,&rdquo; and a &ldquo;Not applicable&rdquo; are three different
            states; don&rsquo;t let one quietly stand in for another.
          </p>
          <dl className="lab-oat-rule lab-selectable" aria-label="Routing rule for non-answers">
            <div className="lab-oat-rule-row">
              <dt>Neutral</dt>
              <dd>has an evaluation, centered on the scale — keep it on the scale.</dd>
            </div>
            <div className="lab-oat-rule-row">
              <dt>Don&rsquo;t know</dt>
              <dd>has no basis to judge — use only when knowledge is the issue.</dd>
            </div>
            <div className="lab-oat-rule-row">
              <dt>Not applicable</dt>
              <dd>the item doesn&rsquo;t apply to them at all.</dd>
            </div>
            <div className="lab-oat-rule-row">
              <dt>No experience</dt>
              <dd>never tried it — route or screen before asking for a rating.</dd>
            </div>
          </dl>
        </div>
      )}

      <PostReceipt exerciseId="E7" visible={allDone} />
      <SourceDrawer exerciseId="E7" visible={allDone} />
    </ExerciseFrame>
  );
}

/* ───────────────────────────────────────────────────────────────────────
   Exercise 3 (data id E8) — False premise / eligibility  (verb: GATE)
   ─────────────────────────────────────────────────────────────────────── */

const fpScreenedWhere: Record<FpScreenerId, string> = {
  app: "Screened out — never installed the app",
  feature: "Screened out — has the app, never used order-ahead",
  smartphone: "Screened out — no smartphone",
  weekly: "Screened out — not a weekly user"
};

function FalsePremiseExercise({ num }: { num: number }) {
  const [active, setActive] = useState<FpScreenerId[]>([...fpStartActive]);
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    setCompleted((prev) => {
      const next = fpTasks.find((t) => !prev.includes(t.id));
      if (next && next.pass(active)) return [...prev, next.id];
      return prev;
    });
  }, [active]);

  const activeTask = fpTasks.find((t) => !completed.includes(t.id)) ?? null;
  const activeIndex = activeTask ? fpTasks.indexOf(activeTask) : fpTasks.length;
  const lastDoneId = completed[completed.length - 1];
  const lastDoneTask = lastDoneId
    ? fpTasks.find((t) => t.id === lastDoneId) ?? null
    : null;
  const allDone = completed.length === fpTasks.length;
  const f = fpFunnel(active);

  const toggle = (id: FpScreenerId) =>
    setActive((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  return (
    <ExerciseFrame
      num={num}
      title="Don't ask people who were never there."
      issue="False-premise items · eligibility screening · the denominator"
      decision="whether order-ahead actually saves time for the people who use it."
      modifier="false-premise"
      verb="gate"
      nextTeaser="Next: make the export safe before analysis starts. One boundary value can put a person in two places."
    >
      <div className="lab-console">
        <div className="lab-console-task">
          <p className="lab-console-scenario">
            The app asks{" "}
            <strong>&ldquo;Did order-ahead save you time?&rdquo;</strong> (Yes /
            No). Six answer; only three have ever used it. Add the screener that
            keeps everyone with a real basis and drops everyone without one —
            two of the four are traps.
          </p>

      <TaskBand
        testidPrefix="lab-fp-task"
        items={fpTasks.map((t) => ({
          id: t.id,
          title: t.title,
          done: completed.includes(t.id),
          active: t.id === activeTask?.id
        }))}
        active={
          activeTask
            ? {
                index: activeIndex + 1,
                total: fpTasks.length,
                title: activeTask.title,
                brief: activeTask.brief,
                hint: activeTask.hint(active)
              }
            : null
        }
        passText={lastDoneTask && !allDone ? lastDoneTask.passText : null}
        allDoneText={null}
      />
        </div>

        <div className="lab-console-work">
      <div className="lab-control">
        <p className="lab-control-key">
          Candidate screeners — add one before the outcome question
        </p>
        <ul className="lab-fp-screeners" aria-label="Candidate screeners">
          {fpScreeners.map((s) => {
            const on = active.includes(s.id);
            return (
              <li key={s.id}>
                <button
                  type="button"
                  aria-pressed={on}
                  className={`lab-fp-screener ${on ? "is-on" : ""}`}
                  data-testid={`lab-fp-screener-${s.id}`}
                  onClick={() => toggle(s.id)}
                >
                  <span className="lab-fp-screener-mark" aria-hidden="true">
                    {on ? "✓" : "+"}
                  </span>
                  <span className="lab-fp-screener-q lab-selectable">
                    {s.label}
                  </span>
                </button>
                {on && (
                  <p className="lab-fp-screener-note lab-selectable">
                    {s.activeNote}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </div>

        <div className="lab-console-results">
      <p className="lab-fp-headline lab-selectable" aria-live="polite">
        Reads: <strong>{f.outcomeNo} of {f.outcomeTotal}</strong> who reached
        the question say order-ahead didn&rsquo;t save them time
        {f.merged > 0 ? (
          <>
            {" "}
            — but <strong>{f.merged}</strong> of them never used order-ahead.
            That&rsquo;s a contaminated denominator.
          </>
        ) : (
          <> — and every one actually used it.</>
        )}
        {f.wronglyScreened > 0 && (
          <span className="lab-fp-headline-warn">
            {" "}
            You also dropped <strong>{f.wronglyScreened}</strong> real user with
            a valid answer — a false negative.
          </span>
        )}
      </p>

      <ul className="lab-fp-cast" aria-label="Where each customer lands">
        {fpCast.map((c) => {
          const l = fpLandingFor(c, active);
          const where =
            l.stage === "outcome"
              ? `Answers “${l.answer === "yes" ? "Yes" : "No"}”`
              : fpScreenedWhere[l.byId];
          const cls =
            l.stage === "outcome"
              ? l.basis
                ? "is-basis"
                : "is-merged"
              : l.wrong
                ? "is-wrong"
                : "is-out";
          return (
            <li
              key={c.id}
              className={`lab-fp-row ${cls}`}
              data-testid={`lab-fp-landing-${c.id}`}
            >
              <span className="lab-fp-who">
                <strong>{c.name}</strong>
                <span className="lab-fp-story lab-selectable"> {c.story}</span>
              </span>
              <span className="lab-fp-arrow" aria-hidden="true">→</span>
              <span className="lab-fp-where">
                {where}
                {l.stage === "outcome" && !l.basis && (
                  <span className="lab-fp-tag">no basis — merged in</span>
                )}
                {l.stage === "screened" && l.wrong && (
                  <span className="lab-fp-tag lab-fp-tag--warn">
                    valid user — wrongly dropped
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
        </div>
        </div>
      </div>

      {allDone && (
        <p className="lab-exercise-pass lab-selectable" data-testid="lab-fp-pass">
          ✓ A clean-looking Yes/No can sit on a wrong denominator: leave the
          non-users in and &ldquo;Did order-ahead save you time?&rdquo; blends in
          people who never opened the feature, so the team reads a muddy adoption
          number and risks tuning against the wrong denominator. The screen that
          fits keeps everyone
          with a real basis and drops everyone without one — &ldquo;owns a
          phone&rdquo; was too loose, &ldquo;weekly&rdquo; too tight. And asking
          about the app first turns one undifferentiated &ldquo;didn&rsquo;t use
          it&rdquo; pile into a discovery-vs-adoption diagnosis.
        </p>
      )}

      <PostReceipt exerciseId="E8" visible={allDone} />
      <SourceDrawer exerciseId="E8" visible={allDone} />
    </ExerciseFrame>
  );
}

/* ───────────────────────────────────────────────────────────────────────
   Exercise 6 (data id E9) — Acquiescence / yea-saying  (verb: COMPARE)
   ─────────────────────────────────────────────────────────────────────── */

type AcqJudgment = "none" | "fixed" | "flagged";

function AcquiescenceExercise({ num }: { num: number }) {
  const [designId, setDesignId] = useState<AcqDesign>("agree");
  const [judgment, setJudgment] = useState<AcqJudgment>("none");
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    setCompleted((prev) => {
      const active = acqTasks.find((t) => !prev.includes(t.id));
      if (active && active.pass(designId, judgment === "flagged"))
        return [...prev, active.id];
      return prev;
    });
  }, [designId, judgment]);

  const activeTask = acqTasks.find((t) => !completed.includes(t.id)) ?? null;
  const activeIndex = activeTask ? acqTasks.indexOf(activeTask) : acqTasks.length;
  const lastDoneId = completed[completed.length - 1];
  const lastDoneTask = lastDoneId
    ? acqTasks.find((t) => t.id === lastDoneId) ?? null
    : null;
  const allDone = completed.length === acqTasks.length;
  const level = acqTrackTrueLevel(designId);
  const designs: AcqDesign[] = ["agree", "reverse", "item"];
  const task1Done = completed.includes("detect");
  const flaggedCount = acqCast.filter((c) => acqFlagged(c, designId)).length;
  const showJudgment = designId === "reverse" && !task1Done;

  return (
    <ExerciseFrame
      num={num}
      title="When the format does the agreeing for them."
      issue="Acquiescence / yea-saying · agree-disagree vs item-specific wording"
      decision="whether customers truly agree, or the format agreed for them."
      modifier="acquiescence"
      verb="compare"
      nextTeaser="Next: commit before you peek. How many scale points are enough?"
    >
      <div className="lab-console">
        <div className="lab-console-task">
          <p className="lab-console-scenario">
            &ldquo;The barista was friendly&rdquo; — agree or disagree? Six
            answer. A recorded &ldquo;Agree&rdquo; next to someone who felt
            brushed off is the tell. Make the survey measure friendliness, not
            agreeableness.
          </p>

      <TaskBand
        testidPrefix="lab-acq-task"
        items={acqTasks.map((t) => ({
          id: t.id,
          title: t.title,
          done: completed.includes(t.id),
          active: t.id === activeTask?.id
        }))}
        active={
          activeTask
            ? {
                index: activeIndex + 1,
                total: acqTasks.length,
                title: activeTask.title,
                brief: activeTask.brief,
                hint: activeTask.hint(designId, judgment === "flagged")
              }
            : null
        }
        passText={lastDoneTask && !allDone ? lastDoneTask.passText : null}
        allDoneText={null}
      />
        </div>

        <div className="lab-console-work">
      <div className="lab-control">
        <p className="lab-control-key">How to ask it — tap to compare</p>
        <div className="lab-acq-designs" role="group" aria-label="Question formats">
          {designs.map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={designId === d}
              className={`lab-acq-design ${designId === d ? "is-on" : ""}`}
              data-testid={`lab-acq-design-${d}`}
              onClick={() => setDesignId(d)}
            >
              {acqDesignLabel[d]}
            </button>
          ))}
        </div>
      </div>

        <div className="lab-console-results">
      <p className="lab-acq-stem lab-selectable">{acqDesignStem[designId]}</p>
      <p className="lab-acq-note lab-selectable" aria-live="polite">
        {acqDesignNote[designId]}
      </p>

      <ul className="lab-acq-cast" aria-label="Where each respondent lands">
        {acqCast.map((c) => {
          const recorded = acqRecorded(c, designId);
          const matches = acqMatchesTrue(c, designId);
          const flagged = acqFlagged(c, designId);
          return (
            <li
              key={c.id}
              className={`lab-acq-row ${matches ? "is-match" : "is-mismatch"}`}
              data-testid={`lab-acq-landing-${c.id}`}
            >
              <span className="lab-acq-who">
                <strong>{c.name}</strong>
                <span className="lab-acq-story lab-selectable"> {c.story}</span>
              </span>
              <span className="lab-acq-arrow" aria-hidden="true">→</span>
              <span className="lab-acq-rec">
                {recorded}
                {flagged && <span className="lab-acq-tag">flagged inconsistent</span>}
                {!matches && !flagged && (
                  <span className="lab-acq-tag">doesn&rsquo;t match their view</span>
                )}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="lab-channel-ledger" aria-label="Readout">
        <LedgerMeter
          label="Answers track true views"
          hint="How many recorded answers match what the person actually felt."
          level={level}
        />
      </div>
        </div>
        </div>
      </div>

      {showJudgment && (
        <div className="lab-acq-judge" data-testid="lab-acq-judge">
          <p className="lab-acq-judge-q lab-selectable">
            {flaggedCount > 0
              ? `It flagged ${flaggedCount} answers as inconsistent. `
              : ""}
            {acqJudgmentQuestion}
          </p>
          <div
            className="lab-acq-judge-choices"
            role="group"
            aria-label="Your judgment"
          >
            <button
              type="button"
              className={`lab-acq-judge-btn ${judgment === "fixed" ? "is-wrong" : ""}`}
              aria-pressed={judgment === "fixed"}
              data-testid="lab-acq-judge-fixed"
              onClick={() => setJudgment("fixed")}
            >
              {acqJudgmentFixed}
            </button>
            <button
              type="button"
              className="lab-acq-judge-btn"
              aria-pressed={judgment === "flagged"}
              data-testid="lab-acq-judge-flagged"
              onClick={() => setJudgment("flagged")}
            >
              {acqJudgmentFlagged}
            </button>
          </div>
          {judgment === "fixed" && (
            <p
              className="lab-acq-judge-wrong lab-selectable"
              aria-live="polite"
              data-testid="lab-acq-judge-wrong"
            >
              {acqJudgmentWrongNote}
            </p>
          )}
        </div>
      )}

      {allDone && (
        <p className="lab-exercise-pass lab-selectable" data-testid="lab-acq-pass">
          ✓ Under agree/disagree, the customers who felt brushed off still
          &ldquo;agree the barista was friendly&rdquo; — the report reads
          all-friendly and the service problem never surfaces. Where you
          can, swap agree/disagree for item-specific wording: with nothing to nod
          along to, the acquiescence pull disappears and answers track real
          views. The real fix isn&rsquo;t catching fakers — it&rsquo;s measuring
          the intended dimension directly. A reverse-worded check is only a
          detection patch — useful to flag the easy agreers, but it doesn&rsquo;t
          measure them, and it taxes everyone else.
        </p>
      )}

      <PostReceipt exerciseId="E9" visible={allDone} />
      <SourceDrawer exerciseId="E9" visible={allDone} />
    </ExerciseFrame>
  );
}

/* ───────────────────────────────────────────────────────────────────────
   Exercise 10 — Full verbal labels / anchors  (verb: LABEL)
   ─────────────────────────────────────────────────────────────────────── */

function VerbalLabelsExercise({ num }: { num: number }) {
  const [slots, setSlots] = useState<LabelScaleSlots>(() => ({
    ...labelScaleStartSlots
  }));
  const [selectedWord, setSelectedWord] =
    useState<LabelScaleWordId>("dissatisfied");
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    setCompleted((prev) => {
      let next = prev;
      for (const task of labelScaleTasks) {
        if (next.includes(task.id)) continue;
        if (!task.pass(slots)) break;
        next = [...next, task.id];
      }
      return next === prev ? prev : next;
    });
  }, [slots]);

  const activeTask =
    labelScaleTasks.find((t) => !completed.includes(t.id)) ?? null;
  const activeIndex = activeTask
    ? labelScaleTasks.indexOf(activeTask)
    : labelScaleTasks.length;
  const lastDoneId = completed[completed.length - 1];
  const lastDoneTask = lastDoneId
    ? labelScaleTasks.find((t) => t.id === lastDoneId) ?? null
    : null;
  const allDone = completed.length === labelScaleTasks.length;
  const labels = labelScaleLabels(slots);
  const invented = labelScaleInventedCount(slots);
  const pulled = labelScalePulledCount(slots);
  const allMiddleVerbal = labelScaleAllMiddleVerbal(slots);
  const balanced = labelScaleBalanced(slots);

  const assignSlot = (slot: LabelScaleSlotId) => {
    setSlots((prev) => ({ ...prev, [slot]: selectedWord }));
  };

  return (
    <ExerciseFrame
      num={num}
      title="Build the ruler the numbers were hiding."
      issue="Verbal anchors · fully labeled scales · semantic balance"
      decision="how many customers count as satisfied once the middle label does the nudging."
      modifier="labels"
      verb="label"
      nextTeaser="Next: two people visit four times. The words still disagree."
    >
      <div className="lab-console">
        <div className="lab-console-task">
          <p className="lab-console-scenario">
            A five-point visit rating. A bare numeric scale looks tidy, but with
            blank middle points each visitor invents their own ruler. Fill the
            middle, then check whether the words form a fair scale.
          </p>

      <TaskBand
        testidPrefix="lab-label-task"
        items={labelScaleTasks.map((t) => ({
          id: t.id,
          title: t.title,
          done: completed.includes(t.id),
          active: t.id === activeTask?.id
        }))}
        active={
          activeTask
            ? {
                index: activeIndex + 1,
                total: labelScaleTasks.length,
                title: activeTask.title,
                brief: activeTask.brief,
                hint: activeTask.hint(slots)
              }
            : null
        }
        passText={lastDoneTask && !allDone ? lastDoneTask.passText : null}
        allDoneText={null}
      />
        </div>

        <div className="lab-console-work">
      <div className="lab-label-builder">
        <section className="lab-label-bank" aria-label="Label word bank">
          <p className="lab-control-key">Word bank</p>
          <div className="lab-label-words" role="group" aria-label="Choose a label word">
            {labelScaleWordBank.map((word) => (
              <button
                key={word.id}
                type="button"
                aria-pressed={selectedWord === word.id}
                className={`lab-label-word lab-label-word--${word.kind} ${selectedWord === word.id ? "is-on" : ""}`}
                data-testid={`lab-label-word-${word.id}`}
                onClick={() => setSelectedWord(word.id)}
              >
                {word.label}
              </button>
            ))}
          </div>
        </section>

        <section className="lab-label-slots" aria-label="Middle scale slots">
          <p className="lab-control-key">Middle slots</p>
          <ol className="lab-label-slot-list">
            {labelScaleSlotOrder.map((slot, i) => (
              <li key={slot}>
                <button
                  type="button"
                  className={`lab-label-slot ${slots[slot].startsWith("number") ? "is-number" : ""}`}
                  data-testid={`lab-label-slot-${slot}`}
                  onClick={() => assignSlot(slot)}
                >
                  <span className="lab-label-slot-num">{i + 2}</span>
                  <span className="lab-label-slot-word">
                    {labelScaleWordLabel(slots[slot])}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <p className="lab-label-builder-note lab-selectable" aria-live="polite">
            Selected word: <strong>{labelScaleWordLabel(selectedWord)}</strong>.
            Press a middle slot to place it there.
          </p>
        </section>
      </div>

        <div className="lab-console-results">
      <section className="lab-label-scale" aria-label="Candidate scale">
        <p className="lab-label-stem lab-selectable">
          How satisfied were you with your visit?
        </p>
        <ol className="lab-label-points">
          {labels.map((label, i) => (
            <li key={`${i}-${label}`} className="lab-label-point">
              <span className="lab-label-point-num">{i + 1}</span>
              <span className="lab-label-point-text lab-selectable">{label}</span>
            </li>
          ))}
        </ol>
        <p className="lab-label-note lab-selectable" aria-live="polite">
          {labelScaleNote(slots)}
        </p>
      </section>

      <ul className="lab-label-cast" aria-label="Where each visitor lands">
        {labelScaleCast.map((v) => {
          const land = labelScaleLandingFor(v, slots);
          return (
            <li
              key={v.id}
              className={`lab-label-row is-${land.quality}`}
              data-testid={`lab-label-landing-${v.id}`}
            >
              <span className="lab-label-who">
                <strong>{v.name}</strong>
                <span className="lab-label-story lab-selectable"> {v.story}</span>
              </span>
              <span className="lab-label-arrow" aria-hidden="true">→</span>
              <span className="lab-label-pick">
                {land.label}
                <span className="lab-label-tag">{land.note}</span>
              </span>
            </li>
          );
        })}
      </ul>

      <div className="lab-channel-ledger" aria-label="Readouts">
        <LedgerMeter
          label="Middle defined"
          hint={`${invented} visitor(s) still have to invent an unlabeled point.`}
          level={invented === 0 ? "high" : "low"}
        />
        <LedgerMeter
          label="Words balanced"
          hint={
            allMiddleVerbal
              ? `${pulled} visitor(s) are being nudged by positive label wording.`
              : "Balance cannot be judged until every point has words."
          }
          level={pulled === 0 && balanced ? "high" : "low"}
        />
      </div>
        </div>
        </div>
      </div>

      {allDone && (
        <p className="lab-exercise-pass lab-selectable" data-testid="lab-label-pass">
          ✓ The numbers now carry shared meanings, and the words no longer lean
          positive. What did the work was <strong>semantic balance</strong> —
          labels spaced evenly enough that respondents recover the same ruler.
          Full verbal labels are one tool for that, not a law: a scale can anchor
          only its ends and still be fair, as long as the middle isn’t quietly
          tilted upward.
        </p>
      )}

      <PostReceipt exerciseId="E10" visible={allDone} />
      <SourceDrawer exerciseId="E10" visible={allDone} />
    </ExerciseFrame>
  );
}

/* ───────────────────────────────────────────────────────────────────────
   Exercise 11 — Vague quantifiers / fake precision  (verb: ANCHOR)
   ─────────────────────────────────────────────────────────────────────── */

function QuantifierExercise({ num }: { num: number }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [format, setFormat] = useState<QuantifierFormat>({
    period: "none",
    unit: "vague"
  });
  const [completed, setCompleted] = useState<string[]>([]);
  const meters = quantifierMeters(format);
  const collision = quantifierCollisionFor(selectedIds);
  const collisionDone = quantifierHasCollision(selectedIds);
  /* When the two selected rows actually collide, a bracket connects them and
     names what the vague scale CAN'T tell apart — the thing they share (same
     count, or same word). Measured so it spans whichever two rows are picked. */
  const castRef = useRef<HTMLDivElement>(null);
  const [bracket, setBracket] = useState<{ top: number; height: number } | null>(
    null
  );
  useLayoutEffect(() => {
    const container = castRef.current;
    if (!container || !collision) {
      setBracket(null);
      return;
    }
    const sel = container.querySelectorAll<HTMLElement>(
      ".lab-quant-row.is-selected"
    );
    if (sel.length !== 2) {
      setBracket(null);
      return;
    }
    const cTop = container.getBoundingClientRect().top;
    const centers = Array.from(sel)
      .map((el) => {
        const r = el.getBoundingClientRect();
        return r.top - cTop + r.height / 2;
      })
      .sort((a, b) => a - b);
    setBracket({ top: centers[0], height: centers[1] - centers[0] });
  }, [collision, selectedIds, format]);

  useEffect(() => {
    setCompleted((prev) => {
      let next = prev;
      for (const task of quantifierTasks) {
        if (next.includes(task.id)) continue;
        if (!task.pass(selectedIds, format)) break;
        next = [...next, task.id];
      }
      return next === prev ? prev : next;
    });
  }, [selectedIds, format]);

  const activeTask =
    quantifierTasks.find((t) => !completed.includes(t.id)) ?? null;
  const activeIndex = activeTask
    ? quantifierTasks.indexOf(activeTask)
    : quantifierTasks.length;
  const lastDoneId = completed[completed.length - 1];
  const lastDoneTask = lastDoneId
    ? quantifierTasks.find((t) => t.id === lastDoneId) ?? null
    : null;
  const allDone = completed.length === quantifierTasks.length;

  const toggleVisitor = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((v) => v !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  return (
    <ExerciseFrame
      num={num}
      title="Find the collision, then fix the unit."
      issue="Vague quantifiers · reference periods · fake precision"
      decision="who counts as an occasional visitor versus a regular."
      modifier="quantifier"
      verb="anchor"
      nextTeaser="Next: keep the same list and change the mode. The favored answer moves."
    >
      <div className="lab-console">
        <div className="lab-console-task">
          <p className="lab-console-scenario">
            Segment occasional vs. regular visitors. The draft uses &ldquo;Rarely
            / Sometimes / Often&rdquo; — natural-sounding, but those words
            aren&rsquo;t units. First find two visitors whose vague answers
            don&rsquo;t match their real visit counts, then anchor the answer
            without swapping vagueness for fake precision.
          </p>

      <TaskBand
        testidPrefix="lab-quant-task"
        items={quantifierTasks.map((t) => ({
          id: t.id,
          title: t.title,
          done: completed.includes(t.id),
          active: t.id === activeTask?.id
        }))}
        active={
          activeTask
            ? {
                index: activeIndex + 1,
                total: quantifierTasks.length,
                title: activeTask.title,
                brief: activeTask.brief,
                hint: activeTask.hint(selectedIds, format)
              }
            : null
        }
        passText={lastDoneTask && !allDone ? lastDoneTask.passText : null}
        allDoneText={null}
      />
        </div>

        <div className="lab-console-work lab-console-work--stack">
      <div className="lab-quant-workbench">
        <section className="lab-quant-collision-panel" aria-label="Collision finder">
          <p className="lab-control-key">Tap two visitors</p>
          <div
            className="lab-quant-cast"
            role="group"
            aria-label="Visitor frequency answers"
            ref={castRef}
          >
            {collision && bracket && (
              <span
                className="lab-quant-bracket"
                data-kind={collision.kind}
                style={{ top: `${bracket.top}px`, height: `${bracket.height}px` }}
                aria-hidden="true"
              >
                <span className="lab-quant-bracket-label">
                  {collision.kind === "same-count" ? "same count" : "same word"}
                </span>
              </span>
            )}
            {quantifierCast.map((v) => {
              const land = quantifierLandingFor(v, format);
              const selected = selectedIds.includes(v.id);
              return (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={selected}
                  className={`lab-quant-row is-${land.quality} ${selected ? "is-selected" : ""}`}
                  data-testid={`lab-quant-visitor-${v.id}`}
                  onClick={() => toggleVisitor(v.id)}
                >
                  <span className="lab-quant-who">
                    <strong>{v.name}</strong>
                    <span className="lab-quant-story lab-selectable"> {v.story}</span>
                  </span>
                  <span className="lab-quant-arrow" aria-hidden="true">→</span>
                  <span className="lab-quant-pick">
                    {land.label}
                    <span className="lab-quant-tag">{land.note}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <p
            className={`lab-quant-collision-note ${selectedIds.length === 2 && !collision ? "is-wrong" : ""}`}
            data-testid="lab-quant-collision-note"
            aria-live="polite"
          >
            {selectedIds.length < 2
              ? "Choose two rows and compare count to word."
              : collision
                ? collision.explanation
                : "That pair does not expose the unit problem. Try same count with different words, or same word with different counts."}
          </p>
          <CastCountNote className="lab-cast-note--readout" />
        </section>

        <section className="lab-quant-format" aria-label="Frequency format controls">
          <div>
            <p className="lab-control-key">Reference period</p>
            <div className="lab-quant-designs" role="group" aria-label="Reference period">
              {quantifierPeriods.map((period) => (
                <button
                  key={period.id}
                  type="button"
                  aria-pressed={format.period === period.id}
                  className={`lab-quant-design ${format.period === period.id ? "is-on" : ""}`}
                  data-testid={`lab-quant-period-${period.id}`}
                  onClick={() =>
                    setFormat((prev) => ({ ...prev, period: period.id }))
                  }
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="lab-control-key">Answer unit</p>
            <div className="lab-quant-designs" role="group" aria-label="Answer unit">
              {quantifierUnits.map((unit) => (
                <button
                  key={unit.id}
                  type="button"
                  aria-pressed={format.unit === unit.id}
                  className={`lab-quant-design ${format.unit === unit.id ? "is-on" : ""}`}
                  data-testid={`lab-quant-unit-${unit.id}`}
                  onClick={() =>
                    setFormat((prev) => ({ ...prev, unit: unit.id }))
                  }
                >
                  {unit.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="lab-quant-card" aria-label="Candidate question">
        <p className="lab-quant-question lab-selectable">{quantifierQuestion(format)}</p>
        <ul className="lab-quant-options">
          {quantifierOptions(format).map((o) => (
            <li key={`${format.period}-${format.unit}-${o}`} className="lab-selectable">{o}</li>
          ))}
        </ul>
        <p className="lab-quant-note lab-selectable" aria-live="polite">
          {quantifierNote(format)}
        </p>
      </section>

      <div className="lab-quant-format-readout" aria-live="polite">
        <p className={`lab-quant-check ${collisionDone ? "is-good" : ""}`}>
          Collision: {collisionDone ? "found" : "not yet proven"}
        </p>
        <p className={`lab-quant-check ${format.period === "past30" ? "is-good" : ""}`}>
          Time frame: {format.period === "past30" ? "named" : "missing"}
        </p>
        <p className={`lab-quant-check ${format.unit === "ranges" ? "is-good" : format.unit === "score" ? "is-bad" : ""}`}>
          Unit: {format.unit === "ranges" ? "countable ranges" : format.unit === "score" ? "fake precision" : "vague words"}
        </p>
      </div>

      <div className="lab-channel-ledger" aria-label="Readouts">
        <LedgerMeter
          label="Reference period"
          hint="Does the count have a named time frame?"
          level={meters.distinctions}
        />
        <LedgerMeter
          label="Unit honest"
          hint="Does the format ask only for distinctions people can supply and analysts can use?"
          level={meters.trustworthy}
        />
      </div>
        </div>
      </div>

      {allDone && (
        <p className="lab-exercise-pass lab-selectable" data-testid="lab-quant-pass">
          ✓ With &ldquo;Rarely / Sometimes / Often,&rdquo; the owner can&rsquo;t
          tell an occasional visitor from a regular — the same count can become
          different words, and the same word can hide different counts. You did
          not just swap soft words for hard-looking numbers. The repaired item
          names the reference period, asks for countable ranges, and keeps the
          precision matched to the decision.
        </p>
      )}

      <PostReceipt exerciseId="E11" visible={allDone} />
      <SourceDrawer exerciseId="E11" visible={allDone} />
    </ExerciseFrame>
  );
}

/* ───────────────────────────────────────────────────────────────────────
   Exercise 12 — Standalone option order / randomization  (verb: ORDER)
   ─────────────────────────────────────────────────────────────────────── */

function OrderExercise({ num }: { num: number }) {
  const [nominal, setNominal] = useState<NominalOrderMode>("fixed");
  const [ordinal, setOrdinal] = useState<OrdinalOrderMode>("randomized");
  const [nominalKind, setNominalKind] =
    useState<OrderListKind>("unclassified");
  const [ordinalKind, setOrdinalKind] =
    useState<OrderListKind>("unclassified");
  const [readMode, setReadMode] = useState<NominalReadMode>("screen");
  const [completed, setCompleted] = useState<string[]>([]);
  /* The edge-advantage marker on List A travels to whichever END the mode
     favors — first option on screen (primacy), last when read aloud (recency).
     We measure the favored item's center so the marker lands on it even with
     variable item heights; CSS eases the `top` change (no-preference only). */
  const nominalListRef = useRef<HTMLOListElement>(null);
  const [edgeTop, setEdgeTop] = useState<number | null>(null);
  const meters = orderMeters(nominal, ordinal);
  const nominalList =
    nominal === "fixed"
      ? nominalOrderOptions
      : [
          "Preview: first position changes by respondent",
          "Example A: Search appears first",
          "Example B: Walked by appears first",
          "Example C: Podcast ad appears first"
        ];
  const ordinalList =
    ordinal === "ordered" ? ordinalOrderedLabels : ordinalRandomizedLabels;

  useEffect(() => {
    setCompleted((prev) => {
      let next = prev;
      for (const task of orderTasks) {
        if (next.includes(task.id)) continue;
        if (!task.pass(nominal, ordinal, nominalKind, ordinalKind)) break;
        next = [...next, task.id];
      }
      return next === prev ? prev : next;
    });
  }, [nominal, ordinal, nominalKind, ordinalKind]);

  /* Place the marker on the favored item whenever List A is a fixed order
     (rotation neutralizes the edge, so the marker is hidden then). */
  useLayoutEffect(() => {
    if (nominal !== "fixed") return;
    const ol = nominalListRef.current;
    if (!ol) return;
    const items = ol.querySelectorAll<HTMLLIElement>("li");
    if (items.length === 0) return;
    const favored = readMode === "screen" ? items[0] : items[items.length - 1];
    const olTop = ol.getBoundingClientRect().top;
    const fRect = favored.getBoundingClientRect();
    setEdgeTop(fRect.top - olTop + fRect.height / 2);
  }, [nominal, readMode, nominalList]);

  const activeTask = orderTasks.find((t) => !completed.includes(t.id)) ?? null;
  const activeIndex = activeTask ? orderTasks.indexOf(activeTask) : orderTasks.length;
  const lastDoneId = completed[completed.length - 1];
  const lastDoneTask = lastDoneId
    ? orderTasks.find((t) => t.id === lastDoneId) ?? null
    : null;
  const allDone = completed.length === orderTasks.length;

  const renderKindButtons = (
    value: OrderListKind,
    setValue: (value: OrderListKind) => void,
    prefix: "nominal" | "ordinal"
  ) => (
    <div className="lab-order-kind-buttons" role="group" aria-label={`${prefix} list kind`}>
      <button
        type="button"
        aria-pressed={value === "unordered"}
        className={`lab-order-kind ${value === "unordered" ? "is-on" : ""}`}
        data-testid={`lab-order-kind-${prefix}-unordered`}
        onClick={() => setValue("unordered")}
      >
        Unordered categories
      </button>
      <button
        type="button"
        aria-pressed={value === "continuum"}
        className={`lab-order-kind ${value === "continuum" ? "is-on" : ""}`}
        data-testid={`lab-order-kind-${prefix}-continuum`}
        onClick={() => setValue("continuum")}
      >
        Meaningful continuum
      </button>
    </div>
  );

  return (
    <ExerciseFrame
      num={num}
      title="Randomize the right list, not every list."
      issue="Response-order effects · primacy / recency · nominal vs ordinal"
      decision="which answer looks most popular when the list order does the choosing."
      modifier="order"
      verb="order"
      nextTeaser="Final review: five draft questions, one clean item, and one real problem you must not over-flag."
    >
      <div className="lab-console">
        <div className="lab-console-task">
          <p className="lab-console-scenario">
            The repair depends on the kind of list — and the survey mode. Two
            broken lists: a channel list where one answer gets an unfair edge
            just from its position (and which end wins depends on the mode), and
            scrambled satisfaction labels. Classify them, watch the mode shift
            that edge, then decide what to rotate.
          </p>

      <TaskBand
        testidPrefix="lab-order-task"
        items={orderTasks.map((t) => ({
          id: t.id,
          title: t.title,
          done: completed.includes(t.id),
          active: t.id === activeTask?.id
        }))}
        active={
          activeTask
            ? {
                index: activeIndex + 1,
                total: orderTasks.length,
                title: activeTask.title,
                brief: activeTask.brief,
                hint: activeTask.hint(nominal, ordinal, nominalKind, ordinalKind)
              }
            : null
        }
        passText={lastDoneTask && !allDone ? lastDoneTask.passText : null}
        allDoneText={null}
      />
        </div>

        <div className="lab-console-work lab-console-work--stack">
      <div className="lab-order-grid">
        <section className="lab-order-panel">
          <p className="lab-order-key">List A</p>
          <p className="lab-order-question lab-selectable">
            How did you hear about us?
          </p>
          {renderKindButtons(nominalKind, setNominalKind, "nominal")}
          <div className="lab-order-buttons" role="group" aria-label="Nominal list order">
            <button
              type="button"
              aria-pressed={nominal === "fixed"}
              className={`lab-order-btn ${nominal === "fixed" ? "is-on" : ""}`}
              data-testid="lab-order-nominal-fixed"
              onClick={() => setNominal("fixed")}
            >
              Fixed order
            </button>
            <button
              type="button"
              aria-pressed={nominal === "rotated"}
              className={`lab-order-btn ${nominal === "rotated" ? "is-on" : ""}`}
              data-testid="lab-order-nominal-rotated"
              onClick={() => setNominal("rotated")}
            >
              Rotate / randomize
            </button>
          </div>
          <div className="lab-order-listwrap">
            {nominal === "fixed" && edgeTop != null && (
              <span
                className="lab-order-edge"
                data-mode={readMode}
                style={{ top: `${edgeTop}px` }}
                aria-hidden="true"
              >
                <span className="lab-order-edge-label">
                  {readMode === "screen" ? "primacy pull" : "recency pull"}
                </span>
                <span className="lab-order-edge-arrow">▸</span>
              </span>
            )}
            <ol className="lab-order-list" ref={nominalListRef}>
              {nominalList.map((o, i) => {
                const favored =
                  nominal === "fixed" &&
                  ((readMode === "screen" && i === 0) ||
                    (readMode === "phone" && i === nominalList.length - 1));
                return (
                  <li
                    key={o}
                    className={`lab-selectable ${favored ? "is-edge" : ""}`}
                  >
                    {o}
                  </li>
                );
              })}
            </ol>
          </div>
          {nominal === "rotated" && (
            <p className="lab-order-preview-note lab-selectable">
              Rotation preview, not a respondent-facing answer list. With no
              fixed first or last slot, neither end keeps an edge.
            </p>
          )}
        </section>

        <section className="lab-order-panel">
          <p className="lab-order-key">List B</p>
          <p className="lab-order-question lab-selectable">
            How satisfied were you?
          </p>
          {renderKindButtons(ordinalKind, setOrdinalKind, "ordinal")}
          <div className="lab-order-buttons" role="group" aria-label="Ordinal scale order">
            <button
              type="button"
              aria-pressed={ordinal === "randomized"}
              className={`lab-order-btn ${ordinal === "randomized" ? "is-on" : ""}`}
              data-testid="lab-order-ordinal-randomized"
              onClick={() => setOrdinal("randomized")}
            >
              Randomize labels
            </button>
            <button
              type="button"
              aria-pressed={ordinal === "ordered"}
              className={`lab-order-btn ${ordinal === "ordered" ? "is-on" : ""}`}
              data-testid="lab-order-ordinal-ordered"
              onClick={() => setOrdinal("ordered")}
            >
              Keep continuum
            </button>
          </div>
          <ol className="lab-order-list">
            {ordinalList.map((o) => (
              <li key={o} className="lab-selectable">{o}</li>
            ))}
          </ol>
        </section>
      </div>

      <ul className="lab-order-cast" aria-label="Where each visitor lands">
        {orderCast.map((r) => {
          const land = orderLandingFor(r, nominal, ordinal, readMode);
          return (
            <li
              key={r.id}
              className={`lab-order-row is-${land.nominalQuality} is-${land.ordinalQuality}`}
              data-testid={`lab-order-landing-${r.id}`}
            >
              <span className="lab-order-who">
                <strong>{r.name}</strong>
                <span className="lab-order-story lab-selectable"> {r.story}</span>
              </span>
              <span className="lab-order-arrow" aria-hidden="true">→</span>
              <span className="lab-order-pick">
                {land.nominalPick}
                <span className="lab-order-tag">
                  {land.nominalQuality === "primacy"
                    ? "first-option drift (on screen)"
                    : land.nominalQuality === "recency"
                      ? "last-option drift (read aloud)"
                      : "reason preserved"}
                  {" · "}
                  {land.ordinalQuality === "scrambled"
                    ? "scale order broken"
                    : "scale order meaningful"}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
      <CastCountNote className="lab-cast-note--readout" />

      <div className="lab-order-mode">
        <span className="lab-order-mode-key">Survey mode for List A</span>
        <div className="lab-order-mode-buttons" role="group" aria-label="Survey mode">
          <button
            type="button"
            aria-pressed={readMode === "screen"}
            className={`lab-order-btn ${readMode === "screen" ? "is-on" : ""}`}
            data-testid="lab-order-mode-screen"
            onClick={() => setReadMode("screen")}
          >
            On screen
          </button>
          <button
            type="button"
            aria-pressed={readMode === "phone"}
            className={`lab-order-btn ${readMode === "phone" ? "is-on" : ""}`}
            data-testid="lab-order-mode-phone"
            onClick={() => setReadMode("phone")}
          >
            Read aloud (phone)
          </button>
        </div>
        <p className="lab-order-mode-note lab-selectable" aria-live="polite">
          {nominal === "fixed"
            ? readMode === "screen"
              ? "On a screen, a fixed list favors the option read first — the uncertain visitors drift to the top. Switch the mode, or rotate, and watch where they go."
              : "Read aloud, the last option heard gets the edge — the same uncertain visitors now drift to the bottom of the list instead. Which end wins is not fixed; the mode decides."
            : "Rotated: no single position owns the read, so neither primacy (on screen) nor recency (read aloud) can park the uncertain visitors on one option."}
        </p>
      </div>

      <div className="lab-channel-ledger" aria-label="Readouts">
        <LedgerMeter
          label="Nominal order fair"
          hint="Does any single channel always get the first-read advantage?"
          level={meters.nominalFairness}
        />
        <LedgerMeter
          label="Ordinal meaning intact"
          hint="Does the satisfaction scale still read as a continuum?"
          level={meters.ordinalMeaning}
        />
      </div>
        </div>
      </div>

      {allDone && (
        <p className="lab-exercise-pass lab-selectable" data-testid="lab-order-pass">
          ✓ The fix is list-specific. Rotate unordered answer choices when order
          would otherwise steer attention; keep ordinal response scales in a
          meaningful sequence. Randomization is a tool, not a virtue by itself.
        </p>
      )}

      <PostReceipt exerciseId="E12" visible={allDone} />
      <SourceDrawer exerciseId="E12" visible={allDone} />
    </ExerciseFrame>
  );
}

/* ───────────────────────────────────────────────────────────────────────
   Shared frame + receipt
   ─────────────────────────────────────────────────────────────────────── */

function ExerciseFrame({
  num,
  title,
  issue,
  decision,
  modifier,
  verb,
  nextTeaser,
  children
}: {
  num: number;
  title: string;
  issue: string;
  /* One line naming the real decision a botched answer choice here would
     distort — manager/analyst relevance, not a new claim (output-04). */
  decision?: string;
  modifier: string;
  verb: string;
  /* Quiet editorial bridge into the next exercise's mystery — the
     between-exercise forward pull (output-04 teaser table). Omitted on the
     capstone, which flows into the closing map. */
  nextTeaser?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={`lab-exercise-${num}`}
      className={`lab-exercise lab-exercise--${modifier}`}
      aria-labelledby={`lab-exercise-${num}-title`}
    >
      <header className="lab-exercise-head">
        <p className="lab-exercise-num">
          Exercise {num} <span className="lab-exercise-verb">· {verb}</span>
        </p>
        <h2 className="lab-exercise-title lab-selectable" id={`lab-exercise-${num}-title`}>
          {title}
        </h2>
        <p className="lab-exercise-issue">{issue}</p>
        {decision && (
          <p className="lab-exercise-decision lab-selectable">
            <span className="lab-exercise-decision-key">Decision this would distort</span>{" "}
            {decision}
          </p>
        )}
      </header>
      {children}
      {nextTeaser && (
        <p className="lab-exercise-teaser lab-selectable" data-testid={`lab-teaser-${num}`}>
          <span className="lab-exercise-teaser-arrow" aria-hidden="true">
            ↓
          </span>
          {nextTeaser}
        </p>
      )}
    </section>
  );
}

/* A persistent, small claim-safety label that sits beside any headline counting
   the fixed fictional cast — so a fast reader never reads "4 of 5" as a survey
   estimate (output-04: the tiny-n inoculation). */
function CastCountNote({ className }: { className?: string }) {
  return (
    <span className={["lab-cast-note", className].filter(Boolean).join(" ")}>
      Illustrative cast count · not a survey estimate
    </span>
  );
}

function PostReceipt({
  exerciseId,
  visible
}: {
  exerciseId: string;
  visible: boolean;
}) {
  /* PostReceipt is the one surface every exercise reveals on completion, so
     this is the single place that records progress for all twelve. Hooks run
     before the early return to respect the rules of hooks. */
  const { markComplete } = useProgress();
  useEffect(() => {
    if (visible) markComplete(exerciseId);
  }, [visible, exerciseId, markComplete]);

  const receipt: ExerciseReceipt | undefined = exerciseReceipts[exerciseId];
  if (!visible || !receipt) return null;
  /* A plain region rather than <aside>: an aside is a complementary landmark,
     and twelve of them (one per solved exercise) nested in <main> with the same
     name just clutter a screen reader's landmark list. The visible "You
     practiced" heading labels it, and it reads in flow right after its exercise. */
  return (
    <div
      className="lab-receipt"
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
            <span className="lab-receipt-concepts lab-selectable">
              {m.concepts.join(" · ")}
            </span>
          </li>
        ))}
      </ul>
      {receipt.caveat && (
        <p className="lab-receipt-caveat lab-selectable">
          <strong>Professional caveat:</strong> {receipt.caveat}
        </p>
      )}
    </div>
  );
}

/* The credibility layer: the real field vocabulary for what was just
   practiced, an honest evidence-strength badge, the boundary of what not to
   overclaim, and named sources. Collapsed by default; appears with the
   receipt once the exercise is solved. */
function SourceDrawer({
  exerciseId,
  visible
}: {
  exerciseId: string;
  visible: boolean;
}) {
  const drawer: SourceDrawerData | undefined = sourceDrawers[exerciseId];
  if (!visible || !drawer) return null;
  const ev = evidenceStrengthMeta[drawer.evidence];
  return (
    <details
      className="lab-source-drawer"
      data-testid={`lab-source-${exerciseId}`}
    >
      <summary className="lab-source-summary">
        <span className="lab-source-summary-text">Sources &amp; field terms</span>
        <span
          className={`lab-evidence-badge lab-evidence-badge--${drawer.evidence}`}
          title={ev.gloss}
        >
          {ev.label}
        </span>
      </summary>
      <div className="lab-source-body lab-selectable">
        <p className="lab-source-teaches">{drawer.teaches}</p>

        <p className="lab-source-section-key">The real terms for this</p>
        <dl className="lab-source-terms">
          {drawer.fieldTerms.map((t) => (
            <div key={t.term} className="lab-source-term">
              <dt className="lab-source-term-name">{t.term}</dt>
              <dd className="lab-source-term-gloss">{t.gloss}</dd>
            </div>
          ))}
        </dl>

        {drawer.labShorthand && (
          <p className="lab-source-line">
            <span className="lab-source-label">Lab shorthand</span>{" "}
            {drawer.labShorthand}
          </p>
        )}

        <p className="lab-source-line">
          <span className="lab-source-label">Evidence</span> {ev.label} —{" "}
          {ev.gloss}
        </p>

        <p className="lab-source-line">
          <span className="lab-source-label">What the evidence supports</span>{" "}
          {drawer.supports}
        </p>

        <p className="lab-source-line lab-source-line--boundary">
          <span className="lab-source-label">Don&rsquo;t overclaim</span>{" "}
          {drawer.boundary}
        </p>

        {drawer.modeCaveat && (
          <p className="lab-source-line">
            <span className="lab-source-label">Mode caveat</span>{" "}
            {drawer.modeCaveat}
          </p>
        )}

        <div className="lab-source-cites">
          <span className="lab-source-label">Sources</span>
          <ul className="lab-source-cite-list">
            {drawer.sources.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </details>
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

/* Reveal-on-scroll: adds `is-in` once the element enters the viewport, so the
   closing map animates in as you reach it. Reduced-motion users get the final
   state instantly (the global prefers-reduced-motion rule zeroes durations);
   environments without IntersectionObserver just render revealed. */
function useInView<T extends HTMLElement>(): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [inView]);
  return [ref, inView];
}

const coverageGaugeOrder: CoverageStatus[] = [
  "practiced",
  "planned",
  "didactic",
  "outOfScope"
];

/* Count map nodes by coverage status, across all branches and per branch. */
function countCoverage(branches: KnowledgeBranch[]): Record<CoverageStatus, number> {
  const c: Record<CoverageStatus, number> = {
    practiced: 0,
    planned: 0,
    didactic: 0,
    outOfScope: 0
  };
  for (const b of branches) for (const n of b.nodes) c[n.status] += 1;
  return c;
}

/* The visual coverage gauge: a count-up of practiced points + a single stacked
   bar of the four statuses, so the honesty (not everything was practiced) is
   something you SEE, not just read. */
function CoverageGauge({ branches }: { branches: KnowledgeBranch[] }) {
  const counts = countCoverage(branches);
  const total = coverageGaugeOrder.reduce((s, k) => s + counts[k], 0);
  return (
    <div className="lab-km-gauge" data-testid="lab-km-gauge">
      <div className="lab-km-gauge-stat">
        <span className="lab-km-gauge-num">
          <AnimatedNumber value={counts.practiced} />
        </span>
        <span className="lab-km-gauge-stat-label">
          inspection points
          <br />
          practiced hands-on
        </span>
      </div>
      <div className="lab-km-gauge-body">
        <div
          className="lab-km-gauge-bar"
          role="img"
          aria-label={`${counts.practiced} practiced, ${counts.planned} still ahead, ${counts.didactic} shown not practiced, ${counts.outOfScope} out of scope, of ${total} named`}
        >
          {coverageGaugeOrder.map((s) =>
            counts[s] > 0 ? (
              <span
                key={s}
                className={`lab-km-gauge-seg lab-km-gauge-seg--${s}`}
                style={{ flexGrow: counts[s] }}
              />
            ) : null
          )}
        </div>
        <ul className="lab-km-gauge-legend" aria-hidden="true">
          {coverageGaugeOrder.map((s) => (
            <li key={s} className="lab-km-gauge-legend-item">
              <span className={`lab-km-gauge-dot lab-km-gauge-seg--${s}`} />
              <span className="lab-km-gauge-legend-n">{counts[s]}</span>
              <span className="lab-km-gauge-legend-label">
                {coverageGaugeShort[s]}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const coverageGaugeShort: Record<CoverageStatus, string> = {
  practiced: "practiced (✓)",
  planned: "still ahead (◇)",
  didactic: "shown, not practiced (◌)",
  outOfScope: "out of scope (⊘)"
};

function KnowledgeMap() {
  const [openTerms, setOpenTerms] = useState(false);
  const [openCredentialing, setOpenCredentialing] = useState(false);
  const [openTourangeau, setOpenTourangeau] = useState(false);
  const [openReading, setOpenReading] = useState(false);
  const [mapRef, mapInView] = useInView<HTMLElement>();

  return (
    <section
      ref={mapRef}
      id="closing-map"
      className={`lab-km ${mapInView ? "is-in" : ""}`}
      aria-labelledby="lab-km-title"
      data-testid="lab-km"
    >
      <header className="lab-km-head">
        <p className="lab-km-eyebrow">Closing map</p>
        <h2 id="lab-km-title" className="lab-km-title lab-selectable">
          You can now inspect a response option four ways.
        </h2>
        <p className="lab-km-lede lab-selectable">
          Does every real answer have a SLOT? Does the scale work as a RULER?
          Does the format PUSH the answer? And what would this inspection NOT
          prove (BOUNDARY)?
        </p>
      </header>

      <CoverageGauge branches={responseOptionKnowledgeMap} />
      <p className="lab-km-earned lab-selectable" data-testid="lab-km-earned">
        You practiced{" "}
        <strong>
          {countCoverage(responseOptionKnowledgeMap).practiced} inspection moves
        </strong>{" "}
        across twelve answer-choice failures. Run the four passes in order:{" "}
        <em>find a slot, check the ruler, remove the push, name the boundary.</em>
      </p>
      <p className="lab-km-gauge-caption lab-selectable">
        SLOT / RULER / PUSH / BOUNDARY are <strong>this lab&rsquo;s own
        shorthand</strong> — not field terms; the concepts inside
        (double-barreled, primacy, satisficing…) are the real ones. The ◇ and ⊘
        marks are named on purpose, so the map never pretends to be the whole
        field.
      </p>

      <div className="lab-km-grid">
        {responseOptionKnowledgeMap.map((b, i) => (
          <KnowledgeBranchCard key={b.id} branch={b} index={i} />
        ))}
      </div>

      <details
        className="lab-km-panel"
        open={openTerms}
        onToggle={(e) => setOpenTerms((e.target as HTMLDetailsElement).open)}
      >
        <summary>
          Which of these are real terms of art? ({termGlossary.length} terms)
        </summary>
        <ul className="lab-km-terms">
          {termGlossary.map((t) => (
            <li key={t.term} className={`lab-km-term lab-km-term--${t.status}`}>
              <p className="lab-km-term-head">
                <span className="lab-km-term-name lab-selectable">{t.term}</span>
                <span className={`lab-km-term-badge lab-km-term-badge--${t.status}`}>
                  {termStatusLabel[t.status]}
                </span>
              </p>
              <p className="lab-km-term-note lab-selectable">{t.note}</p>
            </li>
          ))}
        </ul>
      </details>

      <details
        className="lab-km-panel"
        open={openCredentialing}
        onToggle={(e) =>
          setOpenCredentialing((e.target as HTMLDetailsElement).open)
        }
      >
        <summary>
          Things you can now say without bluffing ({credentialingFacts.length}{" "}
          lines)
        </summary>
        <ol className="lab-km-facts">
          {credentialingFacts.map((f) => (
            <li key={f.id} className="lab-km-fact">
              <p className="lab-km-fact-text lab-selectable">{f.text}</p>
              {f.sourceCue && (
                <p className="lab-km-fact-source lab-selectable">{f.sourceCue}</p>
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
        <p className="lab-km-tourangeau-source lab-selectable">
          {tourangeauProcess.source}
        </p>
        <p className="lab-km-tourangeau-blurb lab-selectable">
          {tourangeauProcess.blurb}
        </p>
        <ol className="lab-km-tourangeau-steps">
          {tourangeauProcess.steps.map((s) => (
            <li key={s.id} className="lab-km-tourangeau-step">
              <p className="lab-km-tourangeau-step-label">{s.label}</p>
              <ul className="lab-km-tourangeau-step-examples lab-selectable">
                {s.examples.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </details>

      <details
        className="lab-km-panel"
        open={openReading}
        onToggle={(e) => setOpenReading((e.target as HTMLDetailsElement).open)}
      >
        <summary>Where this comes from · further reading</summary>
        <p className="lab-km-reading-intro lab-selectable">
          The lab leans on a small set of standard works. These are real and
          worth your time — the public resources are free to open today.
        </p>
        <ul className="lab-km-reading">
          {furtherReading.map((r) => (
            <li
              key={r.name}
              className={`lab-km-reading-item lab-km-reading-item--${r.kind}`}
            >
              <span className="lab-km-reading-kind">
                {r.kind === "core-text" ? "Core text" : "Free / public"}
              </span>
              <span className="lab-km-reading-name lab-selectable">{r.name}</span>
              <span className="lab-km-reading-what lab-selectable">{r.what}</span>
            </li>
          ))}
        </ul>
      </details>

      <ReviewChecklist />

      <LabCertificate />

      <p className="lab-km-boundary-note lab-selectable">
        <strong>One honest boundary.</strong> This lab is about response-option
        design — one kind of measurement problem. A misleading survey number
        can also come from coverage, sampling variability, nonresponse, recall,
        mode, weighting, or processing. Clean answer choices don&rsquo;t fix a
        bad sample.
      </p>

      <p className="lab-km-close lab-selectable">
        A professional knows which inspection pass they&rsquo;re running.
        Response-option fit is one of them — not the whole survey machine.
      </p>
    </section>
  );
}

function KnowledgeBranchCard({
  branch,
  index
}: {
  branch: KnowledgeBranch;
  index: number;
}) {
  const counts = countCoverage([branch]);
  const branchTotal = coverageGaugeOrder.reduce((s, k) => s + counts[k], 0);
  return (
    <section
      className={`lab-km-branch lab-km-branch--${branch.id}`}
      style={{ "--km-stagger": `${index * 70}ms` } as React.CSSProperties}
      aria-labelledby={`lab-km-branch-${branch.id}-title`}
    >
      <header className="lab-km-branch-head">
        <span className="lab-km-branch-mark" aria-hidden="true">
          {branch.label.charAt(0).toUpperCase()}
        </span>
        <div className="lab-km-branch-headtext">
          <p className="lab-km-branch-eyebrow">
            {branch.label.toUpperCase()}
            <span className="lab-km-branch-gloss lab-selectable"> · {branch.gloss}</span>
          </p>
          <h3
            id={`lab-km-branch-${branch.id}-title`}
            className="lab-km-branch-question lab-selectable"
          >
            {branch.question}
          </h3>
        </div>
      </header>
      <p className="lab-km-branch-memory lab-selectable">{branch.memorySentence}</p>
      <div
        className="lab-km-branch-strip"
        role="img"
        aria-label={`${counts.practiced} of ${branchTotal} practiced in this pass`}
      >
        {coverageGaugeOrder.map((s) =>
          counts[s] > 0 ? (
            <span
              key={s}
              className={`lab-km-branch-strip-seg lab-km-gauge-seg--${s}`}
              style={{ flexGrow: counts[s] }}
            />
          ) : null
        )}
      </div>
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
              <div className="lab-km-node-body lab-selectable">
                <p>
                  <strong>Ask:</strong> {n.ask}
                </p>
                <p>
                  <strong>Remember:</strong> {n.remember}
                </p>
                <p className="lab-km-node-meta">
                  <em>{coverageLabel[n.status]}</em>
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
