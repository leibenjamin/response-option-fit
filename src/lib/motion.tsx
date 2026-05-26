import {
  type CSSProperties,
  useEffect,
  useRef,
  useState
} from "react";

/* Motion helpers (2026-05-25). Currently exposes the count-up used on the
   "consequence" numbers (the build-and-break export tally, the clean-cell stat).
   `prefers-reduced-motion` users get the final number immediately — the helper
   skips requestAnimationFrame entirely, because the global CSS reduced-motion
   rule cannot stop RAF on its own.

   The FLIP (board re-sort) and one-shot in-view cue helpers from the
   2026-05-24 local research motion spec (docs/research/2026-05-24-persona-wave-followups/
   output-C-micro-motion-spec.md) are intentionally NOT added yet: FLIP needs the
   collision/gate boards restructured so cases physically move into lanes, and the
   hub cue needs the hook re-pointed; both are staged for a later wave. */

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function readPrefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    readPrefersReducedMotion
  );

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const update = () => setPrefersReducedMotion(mediaQuery.matches);
    update();
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", update);
      return () => mediaQuery.removeEventListener("change", update);
    }
    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, []);

  return prefersReducedMotion;
}

/* Cubic-bezier evaluator matching the CSS --mo-ease (0.22, 0.61, 0.36, 1).
   Used only to ease the numeric interpolation; CSS still owns the visible settle. */
function cubicBezier(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): (x: number) => number {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  const sampleCurveX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleCurveY = (t: number) => ((ay * t + by) * t + cy) * t;
  const sampleCurveDerivativeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 5; i += 1) {
      const xEstimate = sampleCurveX(t) - x;
      const derivative = sampleCurveDerivativeX(t);
      if (Math.abs(xEstimate) < 0.0001) return sampleCurveY(t);
      if (Math.abs(derivative) < 0.0001) break;
      t -= xEstimate / derivative;
    }
    let lower = 0;
    let upper = 1;
    t = x;
    for (let i = 0; i < 10; i += 1) {
      const xEstimate = sampleCurveX(t);
      if (Math.abs(xEstimate - x) < 0.0001) return sampleCurveY(t);
      if (xEstimate < x) lower = t;
      else upper = t;
      t = (lower + upper) / 2;
    }
    return sampleCurveY(t);
  };
}

const moEase = cubicBezier(0.22, 0.61, 0.36, 1);

export type AnimatedNumberProps = {
  value: number;
  duration?: number;
  className?: string;
  ariaLabel?: string;
  style?: CSSProperties;
};

/* A brief quantitative settle for a meaningful counter — not a score or point
   pop. Digits live in an aria-hidden span; the wrapper exposes only the final
   number via aria-label and aria-live="off" so frames are never announced. */
export function AnimatedNumber({
  value,
  duration = 720,
  className,
  ariaLabel,
  style
}: AnimatedNumberProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [displayValue, setDisplayValue] = useState(() =>
    readPrefersReducedMotion() ? value : 0
  );
  const [motionState, setMotionState] = useState<"counting" | "settled">(() =>
    readPrefersReducedMotion() ? "settled" : "counting"
  );
  const previousValueRef = useRef(displayValue);

  useEffect(() => {
    let frameId = 0;
    let isActive = true;
    const from = previousValueRef.current;
    const to = value;

    if (prefersReducedMotion || duration <= 0 || from === to) {
      previousValueRef.current = to;
      setDisplayValue(to);
      setMotionState("settled");
      return;
    }

    setMotionState("counting");
    const startedAt = performance.now();
    const tick = (now: number) => {
      if (!isActive) return;
      const progress = Math.min(1, (now - startedAt) / duration);
      const next = from + (to - from) * moEase(progress);
      setDisplayValue(next);
      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
        return;
      }
      previousValueRef.current = to;
      setDisplayValue(to);
      setMotionState("settled");
    };
    frameId = window.requestAnimationFrame(tick);

    return () => {
      isActive = false;
      window.cancelAnimationFrame(frameId);
    };
  }, [duration, prefersReducedMotion, value]);

  const rounded = Math.round(displayValue);
  const finalText = `${Math.round(value)}`;
  const countStyle = {
    ...style,
    "--motion-count-width": `${finalText.length}ch`
  } as CSSProperties;

  return (
    <span
      className={["motion-count", className].filter(Boolean).join(" ")}
      data-motion-state={motionState}
      aria-label={ariaLabel ?? finalText}
      aria-live="off"
      style={countStyle}
    >
      <span className="motion-count-value" aria-hidden="true">
        {rounded}
      </span>
    </span>
  );
}
