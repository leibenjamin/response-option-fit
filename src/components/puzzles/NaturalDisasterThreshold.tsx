import { useState } from "react";
import type { WorkbenchSpecimen } from "../../types/workbench";
import { VerbatimQuote } from "../workbench/VerbatimQuote";
import {
  OptionalSource,
  PuzzleFrame,
  PuzzleInstrument,
  PuzzleReveal
} from "./PuzzleFrame";

type Threshold = "any" | "contributing" | "main";

type ReasonCase = {
  id: string;
  label: string;
  story: string;
  strength: number;
  result: Record<Threshold, string>;
};

const thresholds: Array<{ id: Threshold; label: string; hint: string; cut: number }> = [
  {
    id: "any",
    label: "Any influence",
    hint: "Even weak background influence counts.",
    cut: 1
  },
  {
    id: "contributing",
    label: "Contributing reason",
    hint: "It had to shape the decision in a noticeable way.",
    cut: 2
  },
  {
    id: "main",
    label: "Main reason",
    hint: "Only the dominant reason counts as Yes.",
    cut: 3
  }
];

const reasonCases: ReasonCase[] = [
  {
    id: "primary",
    label: "Primary reason",
    story: "Repeated flooding made the household move.",
    strength: 3,
    result: {
      any: "Yes",
      contributing: "Yes",
      main: "Yes"
    }
  },
  {
    id: "secondary",
    label: "Secondary reason",
    story: "The job move came first; flood risk tipped the neighborhood choice.",
    strength: 2,
    result: {
      any: "Yes",
      contributing: "Yes",
      main: "No"
    }
  },
  {
    id: "background",
    label: "Background worry",
    story: "Wildfire risk was discussed, but rent drove the move.",
    strength: 1,
    result: {
      any: "Yes",
      contributing: "No",
      main: "No"
    }
  }
];

export function NaturalDisasterThreshold({
  specimen,
  titleId
}: {
  specimen: WorkbenchSpecimen;
  titleId: string;
}) {
  const [threshold, setThreshold] = useState<Threshold | null>(null);
  const selected = thresholds.find((item) => item.id === threshold);

  return (
    <PuzzleFrame
      specimen={specimen}
      titleId={titleId}
      role="Your role: threshold setter"
      title="How strong does a reason need to be?"
      lede="A yes/no reason series can quietly teach respondents that Yes means main reason. Set the threshold and watch secondary motives appear or vanish."
      className="puzzle--reason-threshold"
    >
      <PuzzleInstrument label="The reason item">
        <p className="puzzle-instrument-prompt">
          Did you move to avoid natural disasters?
        </p>
      </PuzzleInstrument>

      <div className="threshold-board">
        <div className="threshold-controls" role="group" aria-label="Set the Yes threshold">
          {thresholds.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`threshold-button ${
                threshold === item.id ? "is-chosen" : ""
              }`}
              aria-pressed={threshold === item.id}
              onClick={() => setThreshold(item.id)}
              data-testid={`disaster-threshold-${specimen.id}-${item.id}`}
            >
              <span>{item.label}</span>
              <small>{item.hint}</small>
            </button>
          ))}
        </div>

        <ol className="reason-strength-list" aria-label="Reason strengths">
          {reasonCases.map((item) => (
            <li className="reason-strength-card" key={item.id}>
              <p className="reason-strength-label">{item.label}</p>
              <p className="reason-strength-story">{item.story}</p>
              <div className="reason-meter" aria-hidden="true">
                {Array.from({ length: 3 }, (_, index) => (
                  <span
                    key={index}
                    className={index < item.strength ? "is-filled" : ""}
                  />
                ))}
              </div>
              <p
                className={`reason-result ${threshold ? "is-active" : ""}`}
                data-testid={`disaster-result-${specimen.id}-${item.id}`}
              >
                {threshold ? item.result[threshold] : "Set the threshold."}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {selected && (
        <PuzzleReveal
          specimen={specimen}
          eyebrow="Threshold found"
          title="The word Yes needed a job description."
        >
          <p>
            With <strong>{selected.label.toLowerCase()}</strong>, the same
            secondary motive can be captured or dropped. The series needs to
            tell respondents whether every influence counts or only the main
            reason does.
          </p>
          <p className="puzzle-reveal-takeaway">
            Sequence overlap can be a threshold problem: the list teaches the
            respondent how strong Yes is supposed to be.
          </p>
          {specimen.verbatim && <VerbatimQuote verbatim={specimen.verbatim} />}
        </PuzzleReveal>
      )}

      <OptionalSource specimen={specimen} />
    </PuzzleFrame>
  );
}
