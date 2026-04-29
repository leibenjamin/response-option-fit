export function Hero() {
  return (
    <header className="hero" data-testid="hero">
      <div className="hero-grid">
        <div className="hero-mark" aria-hidden="true">
          <span className="hero-mark-dot" />
          <span className="hero-mark-line" />
          <span className="hero-mark-dot hero-mark-dot--alt" />
        </div>
        <div className="hero-copy">
          <p className="eyebrow">Response Option Fit Lab · editorial exhibit</p>
          <h1 className="hero-title">Response Option Fit Lab</h1>
          <p className="hero-subtitle">The answer is real. The route is wrong.</p>
          <p className="hero-body">
            Survey response options are measurement infrastructure. When the
            offered categories do not match how respondents understand their
            situation, the later chart may look tidy while the data route is
            already bent.
          </p>
          <p className="hero-body hero-body--pipeline">
            The question is part of the data pipeline: if the response route
            fails at collection time, later analysis cannot recover
            distinctions the instrument never captured.
          </p>
          <p className="hero-spine">
            Five neutral specimens from official Census questionnaire-testing
            reports and one Census research presentation.
          </p>
          <p
            className="hero-scope"
            aria-label="Exhibit scope receipt"
            data-testid="scope-receipt"
          >
            <span>5 official specimens</span>
            <span aria-hidden="true" className="hero-scope-sep">·</span>
            <span>5 failure patterns</span>
            <span aria-hidden="true" className="hero-scope-sep">·</span>
            <span>0 survey scores</span>
            <span aria-hidden="true" className="hero-scope-sep">·</span>
            <span>0 generated rewrites</span>
          </p>
        </div>
      </div>
    </header>
  );
}
