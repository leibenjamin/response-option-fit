const allowed = [
  "This exhibit summarizes selected public questionnaire-testing findings.",
  "This exhibit shows how response-option fit problems can affect interpretation.",
  "This exhibit explains why categories, labels, and sequence context matter before analysis begins."
];

const notAllowed = [
  "This exhibit does not validate alternative wording.",
  "This exhibit does not evaluate full questionnaire quality.",
  "This exhibit does not estimate real response distributions.",
  "This exhibit does not imply U.S. Census Bureau endorsement.",
  "This exhibit does not replace cognitive testing, pilot testing, or expert survey review."
];

export function ClaimBoundary() {
  return (
    <section
      className="claims"
      aria-labelledby="claims-title"
      data-testid="claim-boundary"
    >
      <header className="section-head">
        <p className="section-eyebrow">Claim boundary</p>
        <h2 className="section-title" id="claims-title">
          What this exhibit claims, and what it does not
        </h2>
      </header>
      <div className="claims-grid">
        <div className="claims-col claims-col--allowed">
          <p className="claims-key">Allowed</p>
          <ul className="claims-list">
            {allowed.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
        <div className="claims-col claims-col--not">
          <p className="claims-key">Not allowed</p>
          <ul className="claims-list">
            {notAllowed.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
