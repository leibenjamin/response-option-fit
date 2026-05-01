import { workbenchSpecimens } from "../data/workbench-specimens";
import type { FailurePattern } from "../types/workbench";

const glossaryBodies = {
  label_ambiguity:
    "Respondents may understand the response label using different everyday categories.",
  broad_bucket:
    "One answer field combines items respondents store, remember, or pay for separately.",
  false_premise: "The question assumes a condition that may not apply.",
  category_boundary_blur:
    "The survey's technical distinction does not match everyday classification.",
  sequence_overlap: "A prior question changes how the next answer category is interpreted.",
  forced_precision:
    "One exact-looking answer is required from variable or unstable experience."
} satisfies Record<FailurePattern, string>;

const items = workbenchSpecimens
  .filter(
    (specimen, index, specimens) =>
      specimens.findIndex((candidate) => candidate.pattern === specimen.pattern) === index
  )
  .map((specimen) => ({
    specimen,
    body: glossaryBodies[specimen.pattern]
  }));

export function PatternGlossary() {
  return (
    <section className="glossary" aria-labelledby="glossary-title">
      <header className="section-head">
        <p className="section-eyebrow">Pattern glossary</p>
        <h2 className="section-title" id="glossary-title">
          Six ways a response route can break
        </h2>
        <p className="section-lede">
          Each Workbench demonstrates one of these patterns. The catalog above
          introduces them before the diagnostic loop.
        </p>
      </header>
      <ol className="glossary-grid">
        {items.map((it, i) => {
          const { specimen } = it;
          return (
            <li key={specimen.pattern} className="glossary-card">
              <p className="glossary-card-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="glossary-card-label">{specimen.patternLabel}</p>
              <p className="glossary-card-canonical">
                <em>{specimen.canonicalSubtitle}</em>
              </p>
              <p className="glossary-card-body">{it.body}</p>
              <div className="glossary-citation-row">
                {specimen.canonicalCitations.map((citation) => (
                  <details
                    className="citation-chip-details"
                    key={`${specimen.pattern}-${citation.author}-${citation.year}`}
                  >
                    <summary className="citation-chip-summary">
                      {citation.author} {citation.year}
                    </summary>
                    <p className="citation-chip-full">
                      {citation.author} ({citation.year}), {citation.locator}
                    </p>
                  </details>
                ))}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
