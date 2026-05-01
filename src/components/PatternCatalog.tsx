import { workbenchSpecimens } from "../data/workbench-specimens";

const catalogSpecimens = workbenchSpecimens.filter(
  (specimen, index, specimens) =>
    specimens.findIndex((candidate) => candidate.pattern === specimen.pattern) === index
);

export function PatternCatalog() {
  return (
    <section
      className="pattern-catalog"
      aria-labelledby="pattern-catalog-title"
      data-testid="pattern-catalog"
    >
      <header className="pattern-catalog-head">
        <p className="pattern-catalog-eyebrow">Pattern catalog</p>
        <h2 className="pattern-catalog-title" id="pattern-catalog-title">
          Six response-fit patterns
        </h2>
        <p className="pattern-catalog-lede">
          Read these labels first. Each Workbench uses the same vocabulary.
        </p>
      </header>
      <ol className="pattern-catalog-grid">
        {catalogSpecimens.map((specimen) => (
          <li key={specimen.id} className="pattern-catalog-card">
            <p className="pattern-catalog-num" aria-hidden="true">
              {specimen.number}
            </p>
            <h3 className="pattern-catalog-label">{specimen.patternLabel}</h3>
            <p className="pattern-catalog-canonical">{specimen.canonicalSubtitle}</p>
            <p className="pattern-catalog-body">{specimen.prerequisiteVocab}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
