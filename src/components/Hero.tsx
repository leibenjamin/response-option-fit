import { workbenchSpecimens } from "../data/workbench-specimens";
import { routeToHash } from "../lib/routes";

type Props = {
  /* Last specimen the visitor opened in walk mode. When provided, a
     "Resume walk" affordance appears alongside the standard CTAs. */
  resumeSpecimenId?: string | null;
};

/* The hub Hero. Tightened from the prior 4-stat scope receipt to a single
   inline meta line, and pairs with two CTAs that lead the visitor either
   into the embedded featured example below or directly into the paginated
   walk. */
export function Hero({ resumeSpecimenId = null }: Props = {}) {
  const firstSpecimenId = workbenchSpecimens[0]?.id ?? "";
  const resumeSpecimen = resumeSpecimenId
    ? workbenchSpecimens.find((s) => s.id === resumeSpecimenId) ?? null
    : null;
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

        <div className="hero-cta-row" data-testid="hero-cta-row">
          <a
            className="cta-button cta-button--primary"
            href="#featured-example"
            data-testid="hero-cta-featured"
          >
            <span>Try the first example</span>
            <span aria-hidden="true" className="cta-button-arrow">
              ↓
            </span>
          </a>
          <a
            className="cta-button cta-button--secondary"
            href={routeToHash({ kind: "walk", slot: firstSpecimenId })}
            data-testid="hero-cta-walk"
          >
            <span>Walk through all twelve</span>
            <span aria-hidden="true" className="cta-button-arrow">
              →
            </span>
          </a>
          {resumeSpecimen && (
            <a
              className="cta-button cta-button--ghost"
              href={routeToHash({
                kind: "walk",
                slot: resumeSpecimen.id
              })}
              data-testid="hero-cta-resume"
            >
              <span>
                Resume walk · example {resumeSpecimen.number}
              </span>
              <span aria-hidden="true" className="cta-button-arrow">
                ↻
              </span>
            </a>
          )}
        </div>
      </div>

      <ul
        className="hero-scope"
        aria-label="What this exhibit does and does not do"
        data-testid="scope-receipt"
      >
        <li className="hero-scope-item">
          <p className="hero-scope-stat">
            <span className="hero-scope-val">12</span>
            <span className="hero-scope-unit"> examples</span>
          </p>
          <p className="hero-scope-note">from public testing reports</p>
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
