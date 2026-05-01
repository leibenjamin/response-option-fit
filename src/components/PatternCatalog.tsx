import { workbenchSpecimens } from "../data/workbench-specimens";

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
        {workbenchSpecimens.map((specimen) => (
          <li key={specimen.id} className="pattern-catalog-card">
            <p className="pattern-catalog-num" aria-hidden="true">
              {specimen.number}
            </p>
            <h3 className="pattern-catalog-label">{specimen.patternLabel}</h3>
            {specimen.canonicalLabel && (
              <p className="pattern-catalog-canonical">{specimen.canonicalLabel}</p>
            )}
            <p className="pattern-catalog-body">{specimen.prerequisiteVocab}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
