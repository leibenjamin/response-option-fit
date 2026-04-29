import type { Specimen } from "../types/specimen";

export function SourceAppendix({ specimens }: { specimens: Specimen[] }) {
  return (
    <section
      className="appendix"
      aria-labelledby="appendix-title"
      data-testid="source-appendix"
    >
      <details className="appendix-details">
        <summary className="appendix-summary">
          <span className="section-eyebrow">Source appendix</span>
          <span className="section-title" id="appendix-title">
            Direct links to the public testing materials
          </span>
          <span className="appendix-summary-hint" aria-hidden="true">
            expand
          </span>
        </summary>
        <ol className="appendix-list">
          {specimens.map((s) => (
            <li key={s.id} className="appendix-item">
              <p className="appendix-num">{s.number}</p>
              <div className="appendix-body">
                <p className="appendix-title">{s.source.reportTitle}</p>
                <p className="appendix-meta">
                  {s.source.year} · {s.source.sectionOrPage}
                </p>
                <a
                  className="appendix-link"
                  href={s.source.directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.source.directUrl}
                </a>
                <p
                  className="appendix-attr"
                  data-testid={`appendix-attribution-${s.id}`}
                >
                  {s.source.attribution}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <p className="appendix-note">
          No Census logos, screenshots, or PDF imagery are reproduced. Excerpts
          are short substantive wording for editorial study. Mention of these
          reports does not imply U.S. Census Bureau endorsement of this
          exhibit.
        </p>
      </details>
    </section>
  );
}
