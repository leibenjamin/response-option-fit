import type { WorkbenchSpecimen } from "../types/workbench";

export function SourceAppendix({ specimens }: { specimens: WorkbenchSpecimen[] }) {
  return (
    <section
      className="appendix"
      aria-labelledby="appendix-title"
      data-testid="source-appendix"
    >
      <details className="appendix-details">
        <summary className="appendix-summary">
          <span className="appendix-summary-text">
            <span className="section-eyebrow">Source appendix</span>
            <span className="section-title" id="appendix-title">
              Direct links to the public testing materials
            </span>
            <span className="section-lede">
              Each specimen cites a specific passage in a public testing report.
              Use these links to read the original context.
            </span>
          </span>
          <span className="appendix-summary-toggle" aria-hidden="true">
            <span className="appendix-summary-toggle-label">Show all sources</span>
            <span className="appendix-summary-toggle-icon">+</span>
          </span>
        </summary>
        <ol className="appendix-list">
          {specimens.map((s) => (
            <li key={s.id} className="appendix-item">
              <p className="appendix-num" aria-hidden="true">
                {s.number}
              </p>
              <div className="appendix-body">
                <p className="appendix-title">{s.source.reportTitle}</p>
                <p className="source-chip-row" aria-label="Source receipt markers">
                  <span className="source-chip">{s.source.agency}</span>
                  <span className="source-chip">{s.source.documentCode}</span>
                  <span className="source-chip">Verified {s.source.verifiedDate}</span>
                </p>
                <p className="appendix-meta">
                  <span>{s.source.year}</span>
                  <span className="appendix-meta-sep" aria-hidden="true">
                    ·
                  </span>
                  <span>{s.source.sectionOrPage}</span>
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
