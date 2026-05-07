import { workbenchSpecimens } from "../data/workbench-specimens";
import { routeToHash } from "../lib/routes";
import { Workbench } from "./Workbench";

const featured = workbenchSpecimens[0];
const second = workbenchSpecimens[1];
const third = workbenchSpecimens[2];

/* Embedded full workbench on the hub. The visitor sees one complete worked
   example end to end without leaving the landing page; the "more like this"
   chips below preview the next two examples and lead into walk mode. */
export function FeaturedExample() {
  if (!featured) return null;

  return (
    <section
      id="featured-example"
      className="featured-example"
      aria-labelledby="featured-example-title"
      data-testid="featured-example"
    >
      <header className="featured-example-head">
        <p className="featured-example-eyebrow">A worked example, end to end</p>
        <h2 className="featured-example-title" id="featured-example-title">
          Try one example before walking through the rest
        </h2>
        <p className="featured-example-lede">
          Below is the first of twelve worked examples, fully working: read
          the survey question, mark each scenario as covered, ambiguous, or
          not covered, then reveal the report-based explanation. The other
          eleven examples follow the same five-beat shell.
        </p>
      </header>

      <Workbench specimen={featured} />

      <footer className="featured-example-foot">
        <p className="featured-example-foot-eyebrow">More like this</p>
        <ul className="featured-example-next">
          {[second, third].filter(Boolean).map((specimen) => (
            <li key={specimen.id} className="featured-example-next-item">
              <a
                className="featured-example-next-link"
                href={routeToHash({ kind: "walk", slot: specimen.id })}
                data-testid={`featured-next-${specimen.id}`}
              >
                <span className="featured-example-next-num">
                  {specimen.number}
                </span>
                <span className="featured-example-next-body">
                  <span className="featured-example-next-pattern">
                    {specimen.patternLabel}
                  </span>
                  <span className="featured-example-next-title">
                    {specimen.title}
                  </span>
                </span>
                <span aria-hidden="true" className="featured-example-next-arrow">
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
        <a
          className="cta-button cta-button--primary featured-example-walk"
          href={routeToHash({ kind: "walk", slot: featured.id })}
          data-testid="featured-walk-cta"
        >
          <span>Walk through all twelve</span>
          <span aria-hidden="true" className="cta-button-arrow">
            →
          </span>
        </a>
      </footer>
    </section>
  );
}
