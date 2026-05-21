import type { ExampleExperienceKind } from "../../types/workbench";

/* A small inline SVG glyph that signals the engine kind visually. Twelve
   shapes, each tied to its engine's spatial idea (lens rings, ladder
   rungs, fork, grid, timeline, week bars, shelf cells, branching route,
   layered stack, header bar with caret, strength meter, month grid).
   Renders in `currentColor` so the surrounding CSS can tint the glyph
   with each pattern's accent. Decorative; carries `aria-hidden`. */

type Props = {
  kind: ExampleExperienceKind;
  size?: number;
};

const STROKE = 1.5;

export function EngineGlyph({ kind, size = 28 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={`engine-glyph engine-glyph--${kind}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {glyphPath(kind)}
    </svg>
  );
}

function glyphPath(kind: ExampleExperienceKind) {
  switch (kind) {
    case "meaning_lens":
      // Three concentric rings, like a meaning-lens target.
      return (
        <>
          <circle cx="16" cy="16" r="11" />
          <circle cx="16" cy="16" r="7" />
          <circle cx="16" cy="16" r="3" />
        </>
      );
    case "level_ladder":
      // Four horizontal rungs of decreasing length, like a ladder of
      // narrowing scope.
      return (
        <>
          <line x1="6" y1="8" x2="26" y2="8" />
          <line x1="9" y1="14" x2="23" y2="14" />
          <line x1="12" y1="20" x2="20" y2="20" />
          <line x1="14" y1="26" x2="18" y2="26" />
        </>
      );
    case "eligibility_fork":
      // A Y fork — eligibility branches before the yes/no leaves.
      return (
        <>
          <line x1="16" y1="6" x2="16" y2="15" />
          <line x1="16" y1="15" x2="8" y2="26" />
          <line x1="16" y1="15" x2="24" y2="26" />
          <circle cx="8" cy="26" r="1.6" fill="currentColor" stroke="none" />
          <circle cx="24" cy="26" r="1.6" fill="currentColor" stroke="none" />
        </>
      );
    case "feature_rule_board":
      // 2×2 grid with one cell tinted, like the feature rule board's
      // currently-selected rule.
      return (
        <>
          <rect x="5" y="5" width="22" height="22" rx="1" />
          <line x1="16" y1="5" x2="16" y2="27" />
          <line x1="5" y1="16" x2="27" y2="16" />
          <rect
            x="5"
            y="5"
            width="11"
            height="11"
            rx="1"
            fill="currentColor"
            opacity="0.18"
            stroke="none"
          />
        </>
      );
    case "source_timeline":
      // Horizontal arrow with dotted progress markers, like a timeline
      // of the source channels.
      return (
        <>
          <line x1="5" y1="16" x2="27" y2="16" />
          <polyline points="23,12 27,16 23,20" />
          <circle cx="9" cy="16" r="1.6" fill="currentColor" stroke="none" />
          <circle cx="14" cy="16" r="1.6" fill="currentColor" stroke="none" />
          <circle cx="19" cy="16" r="1.6" fill="currentColor" stroke="none" />
        </>
      );
    case "schedule_trace":
      // Five day-bars of varying heights — the week-trace skyline.
      return (
        <>
          <line x1="6" y1="26" x2="6" y2="18" />
          <line x1="11" y1="26" x2="11" y2="12" />
          <line x1="16" y1="26" x2="16" y2="8" />
          <line x1="21" y1="26" x2="21" y2="14" />
          <line x1="26" y1="26" x2="26" y2="20" />
          <line x1="4" y1="26" x2="28" y2="26" />
        </>
      );
    case "device_label_splitter":
      // Four-cell shelf — devices sorted into label boxes.
      return (
        <>
          <rect x="4" y="9" width="11" height="7" rx="1" />
          <rect x="17" y="9" width="11" height="7" rx="1" />
          <rect x="4" y="18" width="11" height="7" rx="1" />
          <rect x="17" y="18" width="11" height="7" rx="1" />
        </>
      );
    case "visibility_route":
      // Two diverging arrows from a single origin — two routes to one
      // recorded answer.
      return (
        <>
          <line x1="16" y1="6" x2="16" y2="15" />
          <line x1="16" y1="15" x2="6" y2="22" />
          <line x1="16" y1="15" x2="26" y2="22" />
          <polyline points="6,18 6,22 10,22" />
          <polyline points="26,18 26,22 22,22" />
        </>
      );
    case "premise_stack":
      // Three layered slabs — the premise stack sitting above the yes/no.
      return (
        <>
          <rect x="6" y="7" width="20" height="5" rx="1" />
          <rect x="6" y="14" width="20" height="5" rx="1" />
          <rect x="6" y="21" width="20" height="5" rx="1" />
        </>
      );
    case "heading_scanner":
      // A header bar with a caret beneath — scanning a section heading.
      return (
        <>
          <rect x="5" y="7" width="22" height="6" rx="1" />
          <polyline points="11,18 16,23 21,18" />
          <line x1="16" y1="13" x2="16" y2="23" />
        </>
      );
    case "reason_strength_board":
      // Four bars of growing strength — primary vs. contributing reason.
      return (
        <>
          <line x1="8" y1="26" x2="8" y2="22" />
          <line x1="14" y1="26" x2="14" y2="18" />
          <line x1="20" y1="26" x2="20" y2="13" />
          <line x1="26" y1="26" x2="26" y2="8" />
          <line x1="6" y1="26" x2="28" y2="26" />
        </>
      );
    case "counting_workbench":
      // 4×4 dot grid with some dots tinted — the calendar counting
      // surface.
      return (
        <>
          {[6, 13, 20, 27].map((cy) =>
            [6, 13, 20, 27].map((cx) => (
              <circle
                key={`${cx}-${cy}`}
                cx={cx}
                cy={cy}
                r={1.4}
                fill="currentColor"
                stroke="none"
                opacity={
                  // Highlight a diagonal stripe so the grid reads as
                  // counted-vs-uncounted weeks.
                  (cx + cy) % 14 === 0 ? 1 : 0.32
                }
              />
            ))
          )}
        </>
      );
  }
}
