import { workbenchSpecimens } from "../data/workbench-specimens";
import { routeToHash } from "../lib/routes";
import { Workbench } from "./Workbench";

const featured = workbenchSpecimens[0];
const second = workbenchSpecimens[1];
const third = workbenchSpecimens[2];

/* Embedded full puzzle on the hub. The visitor sees one complete interaction
   without leaving the landing page; the "more puzzles" chips below preview the
   next two examples and lead into walk mode. */
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
        <p className="featured-example-eyebrow">One puzzle, end to end</p>
        <h2 className="featured-example-title" id="featured-example-title">
          One answer place, four reasonable commute stories.
        </h2>
        <p className="featured-example-lede">
          The hook used the smallest version of the problem: a truthful answer
          met a storage rule that did not say enough. The first full puzzle uses
          an answer choice instead of a one-word field:{" "}
          <code className="featured-example-specimen">
            Taxi or ride-hailing services
          </code>
          . Route four commute stories around that one place and watch the tidy
          column absorb several meanings.
        </p>
      </header>

      <Workbench specimen={featured} />

      <footer className="featured-example-foot">
        <p className="featured-example-foot-eyebrow">More puzzles</p>
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
          <span>Walk all twelve puzzles</span>
          <span aria-hidden="true" className="cta-button-arrow">
            →
          </span>
        </a>
      </footer>
    </section>
  );
}
