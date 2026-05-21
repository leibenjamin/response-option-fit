import { patternMeta, patternOrder } from "../lib/pattern-meta";

type Props = {
  /* Opens the six-pattern map modal. Each tile calls this. */
  onOpenMap?: () => void;
};

/* The six-pattern taxonomy preview. Lives in the hub's sticky right rail
   (the "knowledge map") so it runs alongside the hero and the featured
   example without pushing either down the page. Each tile shows the
   pattern number, label, and canonical subtitle, and opens the full
   six-pattern modal. See docs/design-passes/2026-05-20-knowledge-rail.md. */
export function PatternStrip({ onOpenMap }: Props) {
  return (
    <section
      className="pattern-strip"
      aria-labelledby="pattern-strip-title"
      data-testid="pattern-strip"
    >
      <header className="pattern-strip-head">
        <p className="pattern-strip-eyebrow">The six recurring problems</p>
        <h2 className="pattern-strip-title" id="pattern-strip-title">
          Every worked example is one of these six.
        </h2>
      </header>
      <ol className="pattern-strip-grid">
        {patternOrder.map((pattern, index) => {
          const meta = patternMeta[pattern];
          return (
            <li
              key={pattern}
              className="pattern-strip-tile"
              style={{
                ["--card-accent" as string]: `var(${meta.accentVar})`
              }}
              data-testid={`pattern-strip-tile-${pattern}`}
            >
              <button
                type="button"
                className="pattern-strip-tile-button"
                onClick={onOpenMap}
                data-testid={`pattern-strip-open-${pattern}`}
                aria-label={`Open the six-pattern map at ${meta.label}`}
              >
                <span className="pattern-strip-tile-num" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="pattern-strip-tile-body">
                  <span className="pattern-strip-tile-label">{meta.label}</span>
                  <span className="pattern-strip-tile-canonical">
                    {meta.canonicalSubtitle}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="pattern-strip-foot">
        Tap any pattern to open the full six-pattern map. Each shows up in
        two of the twelve worked examples.
      </p>
    </section>
  );
}
