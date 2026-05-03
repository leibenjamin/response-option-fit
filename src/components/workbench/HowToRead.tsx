const provenanceNotes = [
  {
    className: "provenance-badge--direct_quote",
    label: "Source-backed finding",
    body: "Finding, quotation, or close paraphrase from a cited public testing report."
  },
  {
    className: "provenance-badge--editorial",
    label: "Authored scenario",
    body: "Constructed by us from a cited report finding, with attribution note."
  }
];

const beatNotes = [
  "Frame: read the full item context and highlighted answer path.",
  "Predict: judge whether that path cleanly fits each scenario.",
  "Diagnose: see the source-bounded answer key beside your prediction.",
  "Probe: probe a small edit against the route break.",
  "Reveal: compare the tested change with what remains untested."
];

const outcomeNotes = [
  {
    label: "Clean fit",
    body: "the highlighted answer path fits this scenario without extra interpretation"
  },
  {
    label: "Unclear fit",
    body: "the same scenario could route more than one way"
  },
  {
    label: "Wrong path",
    body: "the highlighted path is not where this scenario belongs"
  }
];

export function HowToRead() {
  return (
    <section
      className="how-to-read"
      aria-labelledby="how-to-read-title"
      data-testid="how-to-read"
    >
      <header className="how-to-read-head">
        <p className="how-to-read-eyebrow">How to read</p>
        <h2 className="how-to-read-title" id="how-to-read-title">
          Before the first prediction
        </h2>
        <p className="how-to-read-lede">
          Each Workbench shows the surrounding item first, then asks whether
          the highlighted answer path fits a respondent scenario cleanly.
        </p>
      </header>

      <div className="how-to-read-grid">
        <section className="how-to-read-block" aria-labelledby="how-to-read-beats">
          <h3 className="how-to-read-subtitle" id="how-to-read-beats">
            What you'll do per Workbench
          </h3>
          <ol className="how-to-read-beats">
            {beatNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ol>
        </section>

        <section className="how-to-read-block" aria-labelledby="how-to-read-tags">
          <h3 className="how-to-read-subtitle" id="how-to-read-tags">
            How vignettes are tagged
          </h3>
          <div className="how-to-read-provenance">
            {provenanceNotes.map((note) => (
              <article className="how-to-read-provenance-card" key={note.label}>
                <span className={`provenance-badge ${note.className}`}>
                  {note.label}
                </span>
                <p>{note.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="how-to-read-block how-to-read-block--wide" aria-labelledby="how-to-read-outcomes">
          <h3 className="how-to-read-subtitle" id="how-to-read-outcomes">
            What clean / unclear / wrong mean
          </h3>
          <dl className="how-to-read-outcomes">
            {outcomeNotes.map((note) => (
              <div className="how-to-read-outcome" key={note.label}>
                <dt>{note.label}</dt>
                <dd>{note.body}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </section>
  );
}
