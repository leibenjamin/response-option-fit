import { workbenchSpecimens } from "../data/workbench-specimens";
import { ClaimBoundary } from "./ClaimBoundary";
import { MethodNotes } from "./MethodNotes";
import { PatternGlossary } from "./PatternGlossary";
import { SourceAppendix } from "./SourceAppendix";

/* Dedicated route for the four shelf sections. Moves the appendix-shaped
   material off the hub so the landing page no longer carries ~2,500 px of
   editorial reference matter that most casual visitors never read. */
export function Reference() {
  return (
    <main
      id="reference"
      className="reference-route"
      aria-labelledby="reference-title"
      data-testid="reference-route"
    >
      <header className="reference-route-head">
        <p className="reference-route-eyebrow">Reference shelf</p>
        <h1
          className="reference-route-title"
          id="reference-title"
          tabIndex={-1}
        >
          Reference material
        </h1>
        <p className="reference-route-lede">
          Four short reference sections behind the worked examples — a
          vocabulary for the failure types, a method note, an explicit
          boundary on what this exhibit does and does not claim, and the
          source provenance behind every quote and finding. If you only read
          one, read the glossary.
        </p>
      </header>

      <article className="shelf-section shelf-section--a">
        <p className="shelf-letter" aria-hidden="true">
          A
        </p>
        <div className="shelf-section-body">
          <PatternGlossary />
        </div>
      </article>

      <article className="shelf-section shelf-section--b">
        <p className="shelf-letter" aria-hidden="true">
          B
        </p>
        <div className="shelf-section-body">
          <MethodNotes />
        </div>
      </article>

      <article className="shelf-section shelf-section--c">
        <p className="shelf-letter" aria-hidden="true">
          C
        </p>
        <div className="shelf-section-body">
          <ClaimBoundary />
        </div>
      </article>

      <article className="shelf-section shelf-section--d">
        <p className="shelf-letter" aria-hidden="true">
          D
        </p>
        <div className="shelf-section-body">
          <SourceAppendix specimens={workbenchSpecimens} />
        </div>
      </article>
    </main>
  );
}
