import type { CSSProperties } from "react";
import { workbenchSpecimens } from "../data/workbench-specimens";
import { patternMeta, patternOrder } from "../lib/pattern-meta";
import { routeToHash } from "../lib/routes";
import type { FailurePattern, WorkbenchSpecimen } from "../types/workbench";

type Variant = "full" | "rail";

type Props = {
  variant?: Variant;
  visited?: ReadonlySet<string>;
  currentSpecimenId?: string | null;
  /* Headline visibility. The hub uses the full eyebrow + title + lede;
     the rail variant collapses to a single eyebrow line. */
  showHeader?: boolean;
};

type SpecimensByPattern = Record<FailurePattern, WorkbenchSpecimen[]>;

function groupSpecimens(): SpecimensByPattern {
  const empty = patternOrder.reduce((acc, pattern) => {
    acc[pattern] = [];
    return acc;
  }, {} as SpecimensByPattern);

  for (const specimen of workbenchSpecimens) {
    empty[specimen.pattern].push(specimen);
  }
  return empty;
}

const specimensByPattern = groupSpecimens();

const railEyebrowText = "Knowledge map";
const fullEyebrowText = "Before the examples";

export function PatternCatalog({
  variant = "full",
  visited,
  currentSpecimenId = null,
  showHeader = true
}: Props) {
  const isRail = variant === "rail";
  const titleId = isRail ? "pattern-map-title" : "pattern-catalog-title";

  const visitedCount = visited ? visited.size : 0;
  const patternCompletedCount = patternOrder.filter((pattern) =>
    specimensByPattern[pattern].every((specimen) =>
      visited?.has(specimen.id) ?? false
    )
  ).length;

  return (
    <section
      className={`pattern-catalog pattern-catalog--${variant}`}
      aria-labelledby={titleId}
      data-testid={isRail ? "pattern-map" : "pattern-catalog"}
    >
      {showHeader && (
        <header className="pattern-catalog-head">
          <p className="pattern-catalog-eyebrow">
            {isRail ? railEyebrowText : fullEyebrowText}
          </p>
          <h2 className="pattern-catalog-title" id={titleId}>
            {isRail
              ? "Six patterns × twelve examples"
              : "Six recurring answer-choice problems"}
          </h2>
          {isRail ? (
            <p className="pattern-catalog-lede">
              <span data-testid="pattern-map-counter">
                <strong>{visitedCount}</strong> / 12 examples
                <span className="pattern-catalog-sep" aria-hidden="true">
                  {" · "}
                </span>
                <strong>{patternCompletedCount}</strong> / 6 patterns
              </span>
            </p>
          ) : (
            <p className="pattern-catalog-lede">
              A pattern here means a recurring kind of mismatch: the person
              has an answer, but the survey choices do not give that answer
              a clear place to go.
            </p>
          )}
        </header>
      )}
      <ol className={`pattern-catalog-grid pattern-catalog-grid--${variant}`}>
        {patternOrder.map((pattern) => {
          const meta = patternMeta[pattern];
          const groupSpecimensList = specimensByPattern[pattern];
          const allVisited =
            visited &&
            groupSpecimensList.every((specimen) => visited.has(specimen.id));
          const anyVisited =
            visited &&
            groupSpecimensList.some((specimen) => visited.has(specimen.id));
          const hasCurrent =
            currentSpecimenId !== null &&
            groupSpecimensList.some(
              (specimen) => specimen.id === currentSpecimenId
            );
          const cardClassName = [
            "pattern-catalog-card",
            allVisited ? "is-completed" : "",
            anyVisited && !allVisited ? "is-partial" : "",
            hasCurrent ? "is-current" : ""
          ]
            .filter(Boolean)
            .join(" ");
          const style = {
            "--card-accent": `var(${meta.accentVar})`
          } as CSSProperties;

          return (
            <li
              key={pattern}
              className={cardClassName}
              style={style}
              data-testid={`pattern-card-${pattern}`}
            >
              <p className="pattern-catalog-card-mark" aria-hidden="true">
                {allVisited
                  ? "✓"
                  : hasCurrent
                  ? "▸"
                  : isRail
                  ? "·"
                  : groupSpecimensList[0]?.number ?? ""}
              </p>
              <h3 className="pattern-catalog-label">{meta.label}</h3>
              <p className="pattern-catalog-canonical">
                {meta.canonicalSubtitle}
              </p>
              {!isRail && (
                <p className="pattern-catalog-body">
                  {groupSpecimensList[0]?.prerequisiteVocab}
                </p>
              )}
              <ul
                className="pattern-catalog-chip-row"
                aria-label={`${meta.label} examples`}
              >
                {groupSpecimensList.map((specimen) => {
                  const isCurrent = specimen.id === currentSpecimenId;
                  const isVisited = visited?.has(specimen.id) ?? false;
                  const chipClass = [
                    "pattern-catalog-chip",
                    isVisited ? "is-visited" : "",
                    isCurrent ? "is-current" : ""
                  ]
                    .filter(Boolean)
                    .join(" ");
                  return (
                    <li key={specimen.id}>
                      <a
                        className={chipClass}
                        href={routeToHash({
                          kind: "walk",
                          slot: specimen.id
                        })}
                        aria-current={isCurrent ? "page" : undefined}
                        data-testid={`pattern-chip-${specimen.id}`}
                      >
                        <span className="pattern-catalog-chip-num">
                          {specimen.number}
                        </span>
                        <span className="pattern-catalog-chip-label">
                          {specimen.railLabel}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
