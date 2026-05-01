export function Hero() {
  return (
    <header className="hero" data-testid="hero">
      <div className="hero-rail">
        <p className="hero-eyebrow eyebrow">
          <span className="hero-eyebrow-mark" aria-hidden="true" />
          Editorial exhibit
          <span className="hero-eyebrow-sep" aria-hidden="true">/</span>
          <span className="hero-eyebrow-kind">
            Census questionnaire-testing review
          </span>
        </p>
      </div>

      <div className="hero-main">
        <h1 className="hero-title">Response Option Fit Lab</h1>
        <p className="hero-subtitle">The answer is real. The route is wrong.</p>

        <div className="hero-body-wrap">
          <p className="hero-body">
            Survey response options are measurement infrastructure. When the
            offered categories do not match how respondents understand their
            situation, the later chart can look tidy while the data route is
            already bent — and the question is part of the data pipeline, so
            later analysis cannot recover distinctions the instrument never
            captured.
          </p>
        </div>
      </div>

      <ul
        className="hero-scope"
        aria-label="Exhibit scope receipt"
        data-testid="scope-receipt"
      >
        <li className="hero-scope-item">
          <p className="hero-scope-stat">
            <span className="hero-scope-val">6</span>
            <span className="hero-scope-unit"> official specimens</span>
          </p>
          <p className="hero-scope-note">from public Census reports</p>
        </li>
        <li className="hero-scope-item">
          <p className="hero-scope-stat">
            <span className="hero-scope-val">6</span>
            <span className="hero-scope-unit"> failure patterns</span>
          </p>
          <p className="hero-scope-note">cataloged below the exhibit</p>
        </li>
        <li className="hero-scope-item">
          <p className="hero-scope-stat">
            <span className="hero-scope-val">0</span>
            <span className="hero-scope-unit"> survey scores</span>
          </p>
          <p className="hero-scope-note">no quality grade is assigned</p>
        </li>
        <li className="hero-scope-item">
          <p className="hero-scope-stat">
            <span className="hero-scope-val">0</span>
            <span className="hero-scope-unit"> generated rewrites</span>
          </p>
          <p className="hero-scope-note">no AI output, no model in the loop</p>
        </li>
      </ul>
    </header>
  );
}
