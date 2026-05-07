import { workbenchSpecimens } from "../data/workbench-specimens";
import type { FailurePattern } from "../types/workbench";

const glossaryBodies = {
  label_ambiguity:
    "The wording of a single answer choice can be read in more than one everyday way.",
  broad_bucket:
    "A single answer space — a write-in box or one tick-box — accepts answers at very different scopes.",
  false_premise:
    "The question assumes a condition holds before checking whether it does for this respondent.",
  category_boundary_blur:
    "Two or more nearby answer choices share enough features that the line between them is unclear.",
  sequence_overlap:
    "An earlier question changes how the next question or answer choice is read.",
  forced_precision:
    "A single survey question asks for one exact-looking answer about a situation that varies."
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
          Six ways answer choices can miss real situations
        </h2>
        <p className="section-lede">
          Each worked example demonstrates one of these problem types. The
          plain-language description comes first; the method label is secondary.
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
