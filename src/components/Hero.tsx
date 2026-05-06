export function Hero() {
  return (
    <header className="hero" data-testid="hero">
      <div className="hero-rail">
        <p className="hero-eyebrow eyebrow">
          <span className="hero-eyebrow-mark" aria-hidden="true" />
          Editorial exhibit
          <span className="hero-eyebrow-sep" aria-hidden="true">/</span>
          <span className="hero-eyebrow-kind">
            Census + ONS questionnaire-testing review
          </span>
        </p>
      </div>

      <div className="hero-main">
        <p className="hero-kicker">Response Option Fit Lab</p>
        <h1 className="hero-title" id="exhibit-title" tabIndex={-1}>
          When survey answer choices don't match real answers.
        </h1>
        <p className="hero-subtitle">
          A person can know their answer, but the available survey choices can
          still push that answer into the wrong place.
        </p>

        <div className="hero-body-wrap">
          <p className="hero-body">
            This page walks through public questionnaire-testing examples from
            the U.S. Census Bureau and the Office for National Statistics. In
            each worked example, you read the survey question, look at a few
            realistic respondent situations, and see where an answer choice
            records something different from what the person meant.
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
            <span className="hero-scope-val">12</span>
            <span className="hero-scope-unit"> examples</span>
          </p>
          <p className="hero-scope-note">from public reports</p>
        </li>
        <li className="hero-scope-item">
          <p className="hero-scope-stat">
            <span className="hero-scope-val">6</span>
            <span className="hero-scope-unit"> problem types</span>
          </p>
          <p className="hero-scope-note">defined before the examples</p>
        </li>
        <li className="hero-scope-item">
          <p className="hero-scope-stat">
            <span className="hero-scope-val">0</span>
            <span className="hero-scope-unit"> survey scores</span>
          </p>
          <p className="hero-scope-note">no question is graded</p>
        </li>
        <li className="hero-scope-item">
          <p className="hero-scope-stat">
            <span className="hero-scope-val">0</span>
            <span className="hero-scope-unit"> generated rewrites</span>
          </p>
          <p className="hero-scope-note">no AI output, no model behind the page</p>
        </li>
      </ul>
    </header>
  );
}
