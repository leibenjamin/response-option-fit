import { useMemo, useState } from "react";
import type { WorkbenchSpecimen } from "../../types/workbench";
import { VerbatimQuote } from "../workbench/VerbatimQuote";
import {
  OptionalSource,
  PuzzleFrame,
  PuzzleInstrument,
  PuzzleReveal
} from "./PuzzleFrame";

type RecipeId = "strict" | "inclusive" | "memory";

type WeekSegment = {
  id: string;
  label: string;
  weeks: number;
  include: Record<RecipeId, number>;
};

const recipes: Array<{ id: RecipeId; label: string; hint: string }> = [
  {
    id: "strict",
    label: "Only full work weeks",
    hint: "Exclude tiny weeks and leave."
  },
  {
    id: "inclusive",
    label: "Use the instruction",
    hint: "Include few-hour weeks and paid time off."
  },
  {
    id: "memory",
    label: "Rounded memory",
    hint: "Use the plausible number that comes to mind."
  }
];

const segments: WeekSegment[] = [
  {
    id: "full",
    label: "Full work weeks",
    weeks: 36,
    include: { strict: 36, inclusive: 36, memory: 36 }
  },
  {
    id: "few-hours",
    label: "Few-hour weeks",
    weeks: 4,
    include: { strict: 0, inclusive: 4, memory: 2 }
  },
  {
    id: "pto",
    label: "Paid leave",
    weeks: 2,
    include: { strict: 0, inclusive: 2, memory: 0 }
  },
  {
    id: "gigs",
    label: "Irregular gig weeks",
    weeks: 6,
    include: { strict: 0, inclusive: 6, memory: 4 }
  }
];

export function WeeksWorkedCalculator({
  specimen,
  titleId
}: {
  specimen: WorkbenchSpecimen;
  titleId: string;
}) {
  const [recipe, setRecipe] = useState<RecipeId | null>(null);
  const selectedRecipe = recipes.find((item) => item.id === recipe);
  const total = useMemo(
    () =>
      recipe
        ? segments.reduce((sum, segment) => sum + segment.include[recipe], 0)
        : null,
    [recipe]
  );

  return (
    <PuzzleFrame
      specimen={specimen}
      titleId={titleId}
      role="You are the counting recipe"
      title="One year. Three exact-looking totals."
      lede="The field asks for a number, but the number depends on a private recipe. Pick the recipe and watch the same work history export a different total."
      className="puzzle--weeks-calculator"
    >
      <PuzzleInstrument label="The numeric field">
        <p className="puzzle-instrument-prompt">
          Over the past 52 weeks, how many weeks did this person work, even for
          a few hours, including any paid time off?
        </p>
      </PuzzleInstrument>

      <div className="weeks-calculator">
        <div className="recipe-controls" role="group" aria-label="Choose the counting recipe">
          {recipes.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`recipe-button ${recipe === item.id ? "is-chosen" : ""}`}
              aria-pressed={recipe === item.id}
              onClick={() => setRecipe(item.id)}
              data-testid={`weeks-recipe-${specimen.id}-${item.id}`}
            >
              <span>{item.label}</span>
              <small>{item.hint}</small>
            </button>
          ))}
        </div>

        <div className="weeks-ledger">
          <p className="weeks-total" data-testid={`weeks-total-${specimen.id}`}>
            {total == null ? "Pick a recipe" : `${total} weeks`}
          </p>
          <ol className="week-segments" aria-label="Counting segments">
            {segments.map((segment) => {
              const counted = recipe ? segment.include[recipe] : null;
              return (
                <li className="week-segment" key={segment.id}>
                  <span className="week-segment-label">{segment.label}</span>
                  <span className="week-segment-raw">{segment.weeks} possible</span>
                  <span
                    className={`week-segment-count ${
                      counted != null && counted > 0 ? "is-counted" : ""
                    }`}
                  >
                    {counted == null ? "--" : `+${counted}`}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {selectedRecipe && total != null && (
        <PuzzleReveal
          specimen={specimen}
          eyebrow="Recipe revealed"
          title="The number is exact-looking; the recipe is not."
        >
          <p>
            With <strong>{selectedRecipe.label.toLowerCase()}</strong>, this
            year exports as <strong>{total} weeks</strong>. Another reasonable
            recipe produces another precise-looking number from the same work
            history.
          </p>
          <p className="puzzle-reveal-takeaway">
            Forced precision is not just guessing. It is the absence of a shared
            counting recipe behind the field.
          </p>
          {specimen.verbatim && <VerbatimQuote verbatim={specimen.verbatim} />}
        </PuzzleReveal>
      )}

      <OptionalSource specimen={specimen} />
    </PuzzleFrame>
  );
}
