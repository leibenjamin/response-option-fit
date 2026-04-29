import { useState } from "react";
import { specimens } from "./data/specimens";
import { Hero } from "./components/Hero";
import { SpecimenRail } from "./components/SpecimenRail";
import { ResponseRouteBoard } from "./components/ResponseRouteBoard";
import { SourceMargin } from "./components/SourceMargin";
import { PatternGlossary } from "./components/PatternGlossary";
import { MethodNotes } from "./components/MethodNotes";
import { ClaimBoundary } from "./components/ClaimBoundary";
import { SourceAppendix } from "./components/SourceAppendix";

export default function App() {
  const [activeId, setActiveId] = useState(specimens[0].id);
  const activeIndex = Math.max(
    0,
    specimens.findIndex((s) => s.id === activeId)
  );
  const active = specimens[activeIndex] ?? specimens[0];
  const prev = activeIndex > 0 ? specimens[activeIndex - 1] : undefined;
  const next =
    activeIndex < specimens.length - 1 ? specimens[activeIndex + 1] : undefined;

  return (
    <div className="lab">
      <a href="#main-exhibit" className="skip-link" data-testid="skip-link">
        Skip to main exhibit
      </a>
      <Hero />
      <main
        id="main-exhibit"
        className="exhibit"
        aria-label="Response route exhibit"
      >
        <SpecimenRail
          specimens={specimens}
          activeId={active.id}
          onSelect={setActiveId}
        />
        <ResponseRouteBoard specimen={active} />
        <SourceMargin
          specimen={active}
          prev={prev}
          next={next}
          onSelect={setActiveId}
        />
      </main>

      <section className="lower" aria-label="Reference and method">
        <PatternGlossary activePattern={active.pattern} />
        <div className="lower-pair">
          <MethodNotes />
          <ClaimBoundary />
        </div>
        <SourceAppendix specimens={specimens} />
      </section>

      <footer className="foot">
        <p className="foot-line">
          Static exhibit. No backend, no runtime AI, no upload, no survey
          analyzer.
        </p>
        <p className="foot-line foot-line--quiet">
          Built for editorial study of response-option fit.
        </p>
      </footer>

      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-testid="specimen-announcer"
      >
        {`Specimen ${active.number}: ${active.title}. ${active.patternLabel}.`}
      </div>
    </div>
  );
}
