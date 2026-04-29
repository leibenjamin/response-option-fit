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
  const active = specimens.find((s) => s.id === activeId) ?? specimens[0];

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
        <SourceMargin specimen={active} />
      </main>
      <section className="lower">
        <PatternGlossary activePattern={active.pattern} />
        <MethodNotes />
        <ClaimBoundary />
        <SourceAppendix specimens={specimens} />
      </section>
      <footer className="foot">
        <p>
          Static exhibit. No backend, no runtime AI, no upload, no survey
          analyzer. Built for editorial study of response-option fit.
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
