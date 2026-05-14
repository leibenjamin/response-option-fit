import { workbenchSpecimens } from "../data/workbench-specimens";
import { routeToHash } from "../lib/routes";

type Props = {
  /* Last specimen the visitor opened in walk mode. When provided, a
     "Resume walk" affordance appears alongside the standard CTAs. */
  resumeSpecimenId?: string | null;
};

/* The hub Hero. Top-of-page identity carrier: editorial-exhibit eyebrow,
   project kicker, plain-language title, mechanism subtitle, body that
   names the source posture and the field-guide value, two CTA-shaped
   actions whose hierarchy flips for returning visitors, a quiet text-link
   row for the lower-priority entry points, and a four-stat scope receipt
   that doubles as a trust receipt. The lastVisited prop drives the
   CTA-hierarchy flip: returning visitors lead with Resume walk and demote
   the first-time entry points to text links. */
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
          When answer choices don't give the respondent's answer a clear place to go.
        </h1>
        <p className="hero-subtitle">
          A person can know their answer, but the available choices can still
          push it into the wrong place.
        </p>

        <div className="hero-body-wrap">
          <p className="hero-body">
            This page teaches answer-choice problems with synthetic teaching
            cases and public questionnaire-testing reports from the U.S.
            Census Bureau and the Office for National Statistics. You read a
            survey question, work through several respondent situations, and
            see where an answer choice captures something different from what
            the person meant. If you write surveys, the field guide turns the
            patterns into seven portable checks for your own drafts.
          </p>
        </div>

        {/* CTA hierarchy depends on whether the visitor has walked before.
           First-time visitors get a strong "Try the first example" as
           primary; returning visitors get "Resume walk" as primary and the
           first-time entry points demoted to text links. Mobile keeps the
           two main CTA-shaped buttons stacked but the secondary text links
           stay quiet. */}
        <div className="hero-cta-row" data-testid="hero-cta-row">
          {resumeSpecimen ? (
            <>
              <a
                className="cta-button cta-button--primary"
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
              <a
                className="cta-button cta-button--secondary"
                href={routeToHash({ kind: "fieldGuide" })}
                data-testid="hero-cta-field-guide"
              >
                <span>Open the field guide</span>
                <span aria-hidden="true" className="cta-button-arrow">
                  →
                </span>
              </a>
              <p
                className="hero-cta-quiet"
                data-testid="hero-cta-quiet-links"
              >
                Or restart from the top:{" "}
                <a
                  className="hero-cta-text-link"
                  href="#featured-example"
                  data-testid="hero-cta-featured"
                >
                  Try the first example
                </a>
                <span aria-hidden="true"> · </span>
                <a
                  className="hero-cta-text-link"
                  href={routeToHash({ kind: "walk", slot: firstSpecimenId })}
                  data-testid="hero-cta-walk"
                >
                  Walk through all twelve
                </a>
              </p>
            </>
          ) : (
            <>
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
                href={routeToHash({ kind: "fieldGuide" })}
                data-testid="hero-cta-field-guide"
              >
                <span>Open the field guide</span>
                <span aria-hidden="true" className="cta-button-arrow">
                  →
                </span>
              </a>
              <p
                className="hero-cta-quiet"
                data-testid="hero-cta-quiet-links"
              >
                Or jump to the paginated walk:{" "}
                <a
                  className="hero-cta-text-link"
                  href={routeToHash({ kind: "walk", slot: firstSpecimenId })}
                  data-testid="hero-cta-walk"
                >
                  Walk through all twelve
                </a>
              </p>
            </>
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
          <p className="hero-scope-note">with public source anchors</p>
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
            <span className="hero-scope-unit"> generated survey rewrites</span>
          </p>
          <p className="hero-scope-note">no in-page AI or model calls</p>
        </li>
      </ul>
    </header>
  );
}
