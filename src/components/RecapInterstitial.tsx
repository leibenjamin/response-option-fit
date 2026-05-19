import { useEffect, useRef, useState } from "react";
import { recapRetrievalPrompts } from "../data/field-guide";
import { workbenchSpecimens } from "../data/workbench-specimens";
import { patternMeta, patternOrder } from "../lib/pattern-meta";
import type { FailurePattern } from "../types/workbench";
import { PatternCatalog } from "./PatternCatalog";

type Props = {
  threshold: number;
  visited: ReadonlySet<string>;
  currentSpecimenId: string;
  onContinue: () => void;
  onSkip: () => void;
};

function patternsCoveredSoFar(visited: ReadonlySet<string>): FailurePattern[] {
  const set = new Set<FailurePattern>();
  for (const specimen of workbenchSpecimens) {
    if (visited.has(specimen.id)) set.add(specimen.pattern);
  }
  return patternOrder.filter((p) => set.has(p));
}

function nextPatternUp(currentSpecimenId: string): FailurePattern | null {
  const idx = workbenchSpecimens.findIndex((s) => s.id === currentSpecimenId);
  if (idx < 0) return null;
  return workbenchSpecimens[idx]?.pattern ?? null;
}

/* Mid-walk recap interstitial. Appears inline below the active engine when the
   visitor has just crossed a recap threshold (4 or 8) and has not dismissed
   that threshold yet. The visitor can scroll past or hit the explicit Skip
   link. */
export function RecapInterstitial({
  threshold,
  visited,
  currentSpecimenId,
  onContinue,
  onSkip
}: Props) {
  const covered = patternsCoveredSoFar(visited);
  const upNext = nextPatternUp(currentSpecimenId);
  const titleId = `recap-${threshold}-title`;
  const isFirstRecap = threshold === 4;
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const retrievalPrompt = recapRetrievalPrompts[threshold] ?? null;
  const [selectedPattern, setSelectedPattern] = useState<FailurePattern | null>(null);

  useEffect(() => {
    /* Move focus to the recap title so screen-reader users land on the
       interstitial instead of the workbench heading below it. */
    titleRef.current?.focus({ preventScroll: false });
  }, [threshold]);

  return (
    <section
      className="recap"
      aria-labelledby={titleId}
      data-testid="recap-interstitial"
    >
      <header className="recap-head">
        <p className="recap-eyebrow">
          Knowledge map · checkpoint at {threshold} of 12
        </p>
        <h2
          className="recap-title"
          id={titleId}
          tabIndex={-1}
          ref={titleRef}
        >
          {isFirstRecap
            ? "A third of the way through."
            : "Two-thirds of the way through."}
        </h2>
        <p className="recap-lede">
          You've worked through <strong>{threshold}</strong> of 12 examples
          and seen <strong>{covered.length}</strong> of 6 patterns:{" "}
          <em>
            {covered.map((p) => patternMeta[p].label.toLowerCase()).join(", ")}
          </em>
          .{" "}
          {upNext ? (
            <>
              Up next: <strong>{patternMeta[upNext].label}</strong>.
            </>
          ) : null}
        </p>
      </header>

      <PatternCatalog
        variant="full"
        visited={visited}
        currentSpecimenId={currentSpecimenId}
        showHeader={false}
      />

      {retrievalPrompt && (
        <section
          className="recap-retrieval"
          aria-labelledby={`recap-retrieval-${threshold}-title`}
          data-testid="recap-retrieval"
        >
          <p className="recap-retrieval-eyebrow">Think first, then reveal</p>
          <h3 id={`recap-retrieval-${threshold}-title`}>
            Quick pattern check
          </h3>
          <p>{retrievalPrompt.prompt}</p>
          <div className="recap-retrieval-options" role="group" aria-label="Pattern choices">
            {retrievalPrompt.options.map((pattern) => {
              const active = selectedPattern === pattern;
              return (
                <button
                  key={pattern}
                  type="button"
                  className={`recap-retrieval-option ${active ? "is-active" : ""}`}
                  aria-pressed={active}
                  onClick={() => setSelectedPattern(pattern)}
                >
                  {patternMeta[pattern].label}
                </button>
              );
            })}
          </div>
          {selectedPattern && (
            <p className="recap-retrieval-answer" data-testid="recap-retrieval-answer">
              How they're different: {retrievalPrompt.explanation}
            </p>
          )}
        </section>
      )}

      <div className="recap-actions">
        <button
          type="button"
          className="cta-button cta-button--primary"
          data-testid="recap-continue"
          onClick={onContinue}
        >
          <span>
            Continue with example{" "}
            {workbenchSpecimens.find((s) => s.id === currentSpecimenId)
              ?.number ?? ""}
          </span>
          <span aria-hidden="true" className="cta-button-arrow">
            ↓
          </span>
        </button>
        <button
          type="button"
          className="recap-skip"
          data-testid="recap-skip"
          onClick={onSkip}
        >
          Skip recap
        </button>
      </div>
    </section>
  );
}
