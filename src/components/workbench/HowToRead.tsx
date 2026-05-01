const provenanceNotes = [
  {
    className: "provenance-badge--direct_quote",
    label: "Direct quote",
    body: "Verbatim or close paraphrase from a public cognitive-testing transcript, with citation."
  },
  {
    className: "provenance-badge--editorial",
    label: "Editorial illustration",
    body: "Constructed by us, anchored to a specific report finding, with attribution note."
  }
];

const beatNotes = [
  "Frame: read the tested wording and respondent context.",
  "Predict: predict how the published wording routes each respondent.",
  "Diagnose: see the published diagnosis beside your prediction.",
  "Probe: probe a small edit against the route break.",
  "Reveal: compare the tested change with what remains untested."
];

const outcomeNotes = [
  {
    label: "Covered",
    body: "the published wording captures this respondent cleanly"
  },
  {
    label: "Ambiguous",
    body: "this respondent's reality could route to more than one option"
  },
  {
    label: "Not covered",
    body: "no response option fits this respondent's reality cleanly"
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
          Each Workbench asks whether published wording fits a respondent's
          reality cleanly.
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
            What covered / ambiguous / not covered mean
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
