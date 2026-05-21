import { workbenchSpecimens } from "../data/workbench-specimens";
import { routeToHash } from "../lib/routes";
import { FeaturedHook } from "./FeaturedHook";

type Props = {
  /* Last specimen the visitor opened in walk mode. When provided, a
     "Resume walk" affordance appears alongside the standard CTAs. */
  resumeSpecimenId?: string | null;
};

/* The hub Hero. A two-up identity column + live FeaturedHook so a cold
   visitor can touch the work above the fold. The identity column carries
   the eyebrow, project kicker, title, subtitle, audience caption, CTAs,
   and the scope/trust receipt; the hook sits beside it in a wider column
   (wide enough that its route buttons no longer wrap, which keeps the
   hook — and therefore the hero — short).

   The six-pattern taxonomy is NOT in the hero anymore: it lives in the
   hub's sticky knowledge-map rail (see PatternStrip + App.tsx), so it
   runs alongside the hero and featured example without pushing the
   featured example down. See docs/design-passes/2026-05-20-knowledge-rail.md.
   The resumeSpecimenId prop continues to flip the CTA hierarchy for
   returning visitors. */
export function Hero({ resumeSpecimenId = null }: Props = {}) {
  const firstSpecimenId = workbenchSpecimens[0]?.id ?? "";
  const resumeSpecimen = resumeSpecimenId
    ? workbenchSpecimens.find((s) => s.id === resumeSpecimenId) ?? null
    : null;
  return (
    <header className="hero" data-testid="hero">
      <div className="hero-main">
        <p className="hero-eyebrow eyebrow">
          <span className="hero-eyebrow-mark" aria-hidden="true" />
          Editorial exhibit
          <span className="hero-eyebrow-sep" aria-hidden="true">/</span>
          <span className="hero-eyebrow-kind">
            U.S. Census + UK ONS questionnaire-testing review
          </span>
        </p>
        <p className="hero-kicker">Response Option Fit Lab</p>
        <h1 className="hero-title" id="exhibit-title" tabIndex={-1}>
          When answer choices don't give the respondent's answer a clear place to go.
        </h1>
        <p className="hero-subtitle">
          A form's rule can look obvious until a real value tries to land
          in it. Place the four values and watch the recorded data lose
          the route.
        </p>
        <p className="hero-audience" data-testid="hero-audience">
          For survey writers, reviewers, analysts, and anyone who has
          watched a clean form turn into messy data.
        </p>

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
                className="cta-button cta-button--primary cta-button--stacked"
                href={routeToHash({
                  kind: "walk",
                  slot: resumeSpecimen.id
                })}
                data-testid="hero-cta-resume"
              >
                <span className="cta-button-stacked-body">
                  <span className="cta-button-stacked-primary">
                    Resume walk · example {resumeSpecimen.number}
                  </span>
                  <span className="cta-button-stacked-secondary">
                    {resumeSpecimen.patternLabel} · {resumeSpecimen.railLabel}
                  </span>
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
                <span>Check your own survey draft</span>
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
                <span>Check your own survey draft</span>
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

        {/* Scope receipt + trust line: the identity column's trust
           footer, below the CTAs. */}
        <ul
          className="hero-scope"
          aria-label="What this exhibit covers"
          data-testid="scope-receipt"
        >
            <li className="hero-scope-item">
              <p className="hero-scope-stat">
                <span className="hero-scope-val">12</span>
                <span className="hero-scope-unit"> worked examples</span>
              </p>
              <p className="hero-scope-note">each tied to a public report</p>
            </li>
            <li className="hero-scope-item">
              <p className="hero-scope-stat">
                <span className="hero-scope-val">6</span>
                <span className="hero-scope-unit"> response-option failure patterns</span>
              </p>
              <p className="hero-scope-note">named, defined, and contrasted</p>
            </li>
            <li className="hero-scope-item">
              <p className="hero-scope-stat">
                <span className="hero-scope-val">12</span>
                <span className="hero-scope-unit"> public source receipts</span>
              </p>
              <p className="hero-scope-note">Census Bureau and ONS, with PDF links</p>
            </li>
          </ul>
          <p className="hero-scope-trust" data-testid="scope-trust">
            No surveys graded. No in-page automation. No analytics, no third-party
            requests. Editorial study only.
          </p>
      </div>

      <FeaturedHook />
    </header>
  );
}
