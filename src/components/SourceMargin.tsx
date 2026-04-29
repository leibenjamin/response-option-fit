import type { Specimen } from "../types/specimen";

type Props = { specimen: Specimen };

export function SourceMargin({ specimen }: Props) {
  return (
    <aside
      className="margin"
      aria-label="Source and findings"
      data-testid="source-margin"
    >
      <div className="margin-block">
        <p className="margin-eyebrow">Respondent reality</p>
        <p className="margin-text">{specimen.respondentReality}</p>
      </div>
      <div className="margin-block">
        <p className="margin-eyebrow">Testing finding</p>
        <p className="margin-text">{specimen.testingFindingSummary}</p>
      </div>
      <div className="margin-block">
        <p className="margin-eyebrow">Data consequence</p>
        <p className="margin-text">{specimen.dataConsequence}</p>
      </div>
      <div className="margin-source">
        <p className="margin-eyebrow">Source receipt</p>
        <p className="source-title">{specimen.source.reportTitle}</p>
        <p className="source-meta">
          {specimen.source.year} · {specimen.source.sectionOrPage}
        </p>
        <a
          className="source-link"
          href={specimen.source.directUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="source-link"
        >
          Open source PDF →
        </a>
        <p className="source-appendix-pointer">
          Full attribution appears in the source appendix.
        </p>
      </div>
    </aside>
  );
}
