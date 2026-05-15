import { workbenchSpecimens } from "../data/workbench-specimens";
import { routeToHash } from "../lib/routes";
import { Workbench } from "./Workbench";

const featured = workbenchSpecimens[0];
const second = workbenchSpecimens[1];
const third = workbenchSpecimens[2];

/* Embedded full workbench on the hub. The visitor sees one complete worked
   example end to end without leaving the landing page; the "more worked
   examples" chips below preview the next two examples and lead into walk
   mode. A compact source-receipt line above the workbench announces the
   evidence anchor (agency · document code · year) so a 60-second visitor
   can see the citation posture without expanding any details. */
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
          Above, one quick question gave you the feel of a label-ambiguity
          problem. This first worked example takes that same problem into a
          real survey item, fully working: read the synthetic survey question,
          work the teaching cases, try a wording change, and check the
          real-world source anchor. Examples 01–02 teach through case labs;
          examples 03–12 use a five-step worked-example format.
        </p>
        <p
          className="featured-example-source-receipt"
          data-testid="featured-example-source-receipt"
        >
          <span className="featured-example-source-receipt-label">
            Evidence anchor:
          </span>{" "}
          <span>
            {featured.source.agency} · {featured.source.documentCode} ·{" "}
            {featured.source.year}.
          </span>{" "}
          <span className="featured-example-source-receipt-note">
            Teaching cases below are synthetic.
          </span>
        </p>
      </header>

      <Workbench specimen={featured} />

      <footer className="featured-example-foot">
        <p className="featured-example-foot-eyebrow">More worked examples</p>
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
