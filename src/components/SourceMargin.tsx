import type { Specimen } from "../types/specimen";

type Props = {
  specimen: Specimen;
  prev?: Specimen;
  next?: Specimen;
  onSelect?: (id: string) => void;
};

export function SourceMargin({ specimen, prev, next, onSelect }: Props) {
  return (
    <aside
      className="margin"
      aria-label="Source and findings"
      data-testid="source-margin"
    >
      <div className="margin-counter" aria-hidden="true">
        <span className="margin-counter-now">{specimen.number}</span>
        <span className="margin-counter-sep">/</span>
        <span className="margin-counter-total">05</span>
      </div>

      <div className="margin-block margin-block--finding">
        <p className="margin-eyebrow">What testing found</p>
        <p className="margin-text">{specimen.testingFindingSummary}</p>
      </div>

      <div className="margin-block margin-source">
        <p className="margin-eyebrow">Source receipt</p>
        <p className="source-title">{specimen.source.reportTitle}</p>
        <p className="source-meta">
          <span>{specimen.source.year}</span>
          <span className="source-meta-sep" aria-hidden="true">·</span>
          <span>{specimen.source.sectionOrPage}</span>
        </p>
        <a
          className="source-link"
          href={specimen.source.directUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="source-link"
        >
          Open source PDF
          <span aria-hidden="true" className="source-link-arrow">
            ↗
          </span>
        </a>
        <p className="source-appendix-pointer">
          Full attribution appears in the source appendix below.
        </p>
      </div>

      {(prev || next) && onSelect && (
        <nav className="margin-nav" aria-label="Specimen navigation">
          <p className="margin-eyebrow">Browse specimens</p>
          <div className="margin-nav-row">
            <button
              type="button"
              className="margin-nav-btn"
              data-testid="margin-nav-prev"
              disabled={!prev}
              onClick={() => prev && onSelect(prev.id)}
            >
              <span className="margin-nav-arrow" aria-hidden="true">
                ←
              </span>
              <span className="margin-nav-body">
                <span className="margin-nav-key">
                  {prev ? `Previous · ${prev.number}` : "Previous"}
                </span>
                <span className="margin-nav-label">
                  {prev ? prev.railLabel : "—"}
                </span>
              </span>
            </button>
            <button
              type="button"
              className="margin-nav-btn margin-nav-btn--next"
              data-testid="margin-nav-next"
              disabled={!next}
              onClick={() => next && onSelect(next.id)}
            >
              <span className="margin-nav-body">
                <span className="margin-nav-key">
                  {next ? `Next · ${next.number}` : "Next"}
                </span>
                <span className="margin-nav-label">
                  {next ? next.railLabel : "—"}
                </span>
              </span>
              <span className="margin-nav-arrow" aria-hidden="true">
                →
              </span>
            </button>
          </div>
        </nav>
      )}
    </aside>
  );
}
