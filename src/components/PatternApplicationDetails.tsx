import { patternApplicationGuides } from "../data/field-guide";
import { patternMeta } from "../lib/pattern-meta";
import type { FailurePattern } from "../types/workbench";

type Props = {
  pattern: FailurePattern;
};

export function PatternApplicationDetails({ pattern }: Props) {
  const guide = patternApplicationGuides[pattern];
  const meta = patternMeta[pattern];

  return (
    <section
      className="workbench-beat workbench-beat--apply-pattern"
      aria-labelledby={`apply-${pattern}-title`}
      data-testid={`apply-pattern-${pattern}`}
    >
      <details className="apply-pattern-details">
        <summary className="apply-pattern-summary">
          Apply this pattern to your own survey
        </summary>
        <div className="apply-pattern-body">
          <p className="apply-pattern-eyebrow">{meta.label}</p>
          <h3 className="apply-pattern-title" id={`apply-${pattern}-title`}>
            Three checks to carry forward
          </h3>
          <p className="apply-pattern-warning">{guide.warning}</p>
          <ol className="apply-pattern-list">
            {guide.checks.map((check) => (
              <li key={check}>{check}</li>
            ))}
          </ol>
          <p className="apply-pattern-link-row">
            <a href={`#${guide.fieldGuideId}`}>
              Open this checklist in the field guide →
            </a>
          </p>
        </div>
      </details>
    </section>
  );
}
