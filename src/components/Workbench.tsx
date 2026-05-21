import type { CSSProperties } from "react";
import { patternMeta } from "../lib/pattern-meta";
import type { WorkbenchSpecimen } from "../types/workbench";
import { ExampleExperienceRouter } from "./workbench/ExampleExperience";

/* The walk-mode workbench shell. Every current specimen renders through the
   ExampleExperienceRouter; earlier waves carried CaseLab and a five-step
   legacy renderer as fallback paths, but the 2026-05-19 second-engine wave
   moved all twelve specimens to engines and the 2026-05-20 legacy cleanup
   wave removed those fallbacks entirely. See
   docs/design-passes/2026-05-20-held-legacy-fallback-cleanup.md for the
   sequencing notes. */
export function Workbench({ specimen }: { specimen: WorkbenchSpecimen }) {
  const titleId = `${specimen.id}-workbench-title`;
  const accentVar = patternMeta[specimen.pattern].accentVar;
  const style = {
    "--workbench-accent": `var(${accentVar})`
  } as CSSProperties;

  return (
    <article
      className="workbench"
      id={`workbench-${specimen.number}-${specimen.id}`}
      data-testid={`workbench-${specimen.id}`}
      aria-labelledby={titleId}
      style={style}
    >
      <ExampleExperienceRouter
        specimen={specimen as WorkbenchSpecimen & {
          experience: NonNullable<WorkbenchSpecimen["experience"]>;
        }}
        titleId={titleId}
      />
    </article>
  );
}
