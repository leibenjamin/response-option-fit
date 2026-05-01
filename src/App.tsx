import { useState } from "react";
import { workbenchSpecimens } from "./data/workbench-specimens";
import { Hero } from "./components/Hero";
import { PatternCatalog } from "./components/PatternCatalog";
import { Workbench } from "./components/Workbench";
import { HowToRead } from "./components/workbench/HowToRead";
import { PatternGlossary } from "./components/PatternGlossary";
import { MethodNotes } from "./components/MethodNotes";
import { ClaimBoundary } from "./components/ClaimBoundary";
import { SourceAppendix } from "./components/SourceAppendix";
import { SettingsButton } from "./components/SettingsButton";
import { SettingsDrawer } from "./components/SettingsDrawer";
import { SettingsProvider } from "./lib/settings";

function AppInner() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="lab">
      <a href="#main-exhibit" className="skip-link" data-testid="skip-link">
        Skip to main exhibit
      </a>
      <SettingsButton onClick={() => setSettingsOpen(true)} />
      <Hero />
      <main
        id="main-exhibit"
        className="exhibit workbench-exhibit"
        aria-label="Specimen Workbench exhibit"
      >
        <PatternCatalog />
        <HowToRead />
        <div className="workbench-list" aria-label="Specimen Workbenches">
          {workbenchSpecimens.map((specimen) => (
            <Workbench key={specimen.id} specimen={specimen} />
          ))}
        </div>
      </main>

      <section
        className="shelf"
        aria-labelledby="shelf-title"
        data-testid="reference-shelf"
      >
        <header className="shelf-head">
          <p className="shelf-eyebrow">Reference shelf</p>
          <h2 className="shelf-title" id="shelf-title">
            How to read the rest of this page
          </h2>
          <p className="shelf-lede">
            The Workbenches above are the heart of the page. Below are four short
            reference sections — a vocabulary for the failure types, a method
            note, an explicit boundary on what this exhibit does and does not
            claim, and the source provenance behind every quote and finding.
            If you only read one, read the glossary.
          </p>
        </header>

        <article className="shelf-section shelf-section--a">
          <p className="shelf-letter" aria-hidden="true">A</p>
          <div className="shelf-section-body">
            <PatternGlossary />
          </div>
        </article>

        <article className="shelf-section shelf-section--b">
          <p className="shelf-letter" aria-hidden="true">B</p>
          <div className="shelf-section-body">
            <MethodNotes />
          </div>
        </article>

        <article className="shelf-section shelf-section--c">
          <p className="shelf-letter" aria-hidden="true">C</p>
          <div className="shelf-section-body">
            <ClaimBoundary />
          </div>
        </article>

        <article className="shelf-section shelf-section--d">
          <p className="shelf-letter" aria-hidden="true">D</p>
          <div className="shelf-section-body">
            <SourceAppendix specimens={workbenchSpecimens} />
          </div>
        </article>
      </section>

      <footer className="foot">
        <p className="foot-line">
          Static exhibit. No backend, no runtime AI, no network upload, no survey
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
        Six Workbenches are available in the main exhibit.
      </div>

      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AppInner />
    </SettingsProvider>
  );
}
