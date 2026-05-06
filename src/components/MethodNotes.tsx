export function MethodNotes() {
  return (
    <section className="method" aria-labelledby="method-title">
      <header className="section-head">
        <p className="section-eyebrow">Method note</p>
        <h2 className="section-title" id="method-title">
          What this exhibit is doing
        </h2>
        <p className="section-lede">
          How and why the exhibit was built the way it was, and what it is not
          trying to be.
        </p>
      </header>
      <div className="method-grid">
        <p className="method-body">
          These examples are intentionally narrow. The lab uses short
          substantive wording excerpts from public testing materials to show
          one kind of measurement failure: the respondent has an answer, but
          the survey choices do not give that answer a clear place to go.
        </p>
        <p className="method-body method-body--quiet">
          The exhibit does not reproduce full instruments, validate revised
          wording, or claim the selected examples generalize to every survey
          mode.
        </p>
      </div>
    </section>
  );
}
