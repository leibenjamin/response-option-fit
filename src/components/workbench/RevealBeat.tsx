import type { WorkbenchSpecimen } from "../../types/workbench";

type Props = {
  specimen: WorkbenchSpecimen;
};

export function RevealBeat({ specimen }: Props) {
  return (
    <section
      className="workbench-beat workbench-beat--reveal"
      aria-labelledby={`${specimen.id}-reveal-title`}
      data-testid={`reveal-${specimen.id}`}
    >
      <header className="beat-head">
        <p className="beat-eyebrow">Reveal</p>
        <h3 className="beat-title" id={`${specimen.id}-reveal-title`}>
          Source-bounded revision evidence
        </h3>
      </header>

      <p className="reveal-orientation">
        Read both cards: one names what the revision addresses; one names what still needs evidence.
      </p>

      <div className="reveal-card-grid">
        <article className="reveal-card" data-testid="reveal-addresses-card">
          <p className="reveal-card-eyebrow">What this revision addresses</p>
          <p className="reveal-card-body">
            {specimen.reveal.addresses.revisionDescription}
          </p>
          {specimen.reveal.addresses.sourceQuote && (
            <blockquote className="reveal-source-quote">
              <p>{specimen.reveal.addresses.sourceQuote}</p>
            </blockquote>
          )}
          <p className="reveal-source-ref">
            {specimen.reveal.addresses.sourcePageRef}
          </p>
        </article>

        <article className="reveal-card" data-testid="reveal-untested-card">
          <p className="reveal-card-eyebrow">What remains untested</p>
          <ul className="reveal-risk-list">
            {specimen.reveal.remainsUntested.residualRisks.map((risk) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
          <p className="reveal-boundary-note">
            {specimen.reveal.remainsUntested.claimBoundaryNote}
          </p>
        </article>
      </div>

      {specimen.counterexample && (
        <article className="counterexample-card">
          <p className="counterexample-eyebrow">{specimen.counterexample.eyebrow}</p>
          <div className="counterexample-grid">
            <div>
              <p className="counterexample-label">Before</p>
              <p className="counterexample-wording">{specimen.counterexample.beforeWording}</p>
            </div>
            <div>
              <p className="counterexample-label">After</p>
              <p className="counterexample-wording">{specimen.counterexample.afterWording}</p>
            </div>
          </div>
          <p className="counterexample-body">
            {specimen.counterexample.evidenceOfImprovement}
          </p>
          <p className="reveal-source-ref">{specimen.counterexample.sourcePageRef}</p>
        </article>
      )}
    </section>
  );
}
