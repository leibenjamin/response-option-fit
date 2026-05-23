import { useMemo, useState } from "react";
import type { WorkbenchSpecimen } from "../../types/workbench";
import {
  OptionalSource,
  PuzzleFrame,
  PuzzleInstrument,
  PuzzleProgress,
  PuzzleReveal
} from "./PuzzleFrame";

type GateChoice = "eligible-yes" | "eligible-no" | "not-applicable";

type Household = {
  id: string;
  label: string;
  facts: string;
  correct: GateChoice;
  consequence: Record<GateChoice, string>;
};

const gateChoices: Array<{ id: GateChoice; label: string; lane: string }> = [
  { id: "eligible-yes", label: "Eligible: Yes", lane: "Pump failed" },
  { id: "eligible-no", label: "Eligible: No", lane: "No failure / no flooding" },
  { id: "not-applicable", label: "Not applicable", lane: "No pump denominator" }
];

const households: Household[] = [
  {
    id: "failed",
    label: "Pump failed",
    facts: "Has sump pump. Outage stopped it. Water collected.",
    correct: "eligible-yes",
    consequence: {
      "eligible-yes": "The premise holds and the event happened.",
      "eligible-no": "The failure disappears into No.",
      "not-applicable": "The household had the equipment; the gate is wrong."
    }
  },
  {
    id: "worked",
    label: "Pump worked",
    facts: "Has sump pump. Outage happened. No water collected.",
    correct: "eligible-no",
    consequence: {
      "eligible-yes": "The data invents flooding.",
      "eligible-no": "This is the in-scope No.",
      "not-applicable": "The household had the equipment; the gate is wrong."
    }
  },
  {
    id: "no-pump",
    label: "No pump",
    facts: "Basement, no sump pump installed.",
    correct: "not-applicable",
    consequence: {
      "eligible-yes": "The data invents equipment and failure.",
      "eligible-no": "The household impersonates a working-pump No.",
      "not-applicable": "The denominator is explicit."
    }
  },
  {
    id: "other-water",
    label: "Different water",
    facts: "Has pump. Water came through a window, not pump failure.",
    correct: "eligible-no",
    consequence: {
      "eligible-yes": "The wrong cause enters the pump-failure count.",
      "eligible-no": "No means no pump-failure event.",
      "not-applicable": "The equipment exists; the cause is the issue."
    }
  }
];

type Picks = Record<string, GateChoice | undefined>;

export function SumpPumpGate({
  specimen,
  titleId
}: {
  specimen: WorkbenchSpecimen;
  titleId: string;
}) {
  const [picks, setPicks] = useState<Picks>({});
  const completed = households.filter((item) => picks[item.id]).length;
  const allComplete = completed === households.length;
  const lanes = useMemo(
    () =>
      gateChoices.map((choice) => ({
        ...choice,
        households: households.filter((item) => picks[item.id] === choice.id)
      })),
    [picks]
  );

  return (
    <PuzzleFrame
      specimen={specimen}
      titleId={titleId}
      role="Your role: denominator checker"
      title="Open the gate before you read Yes or No."
      lede="The answer No looks tidy only after you know who was eligible for the question. First decide whether the pump-failure premise applies."
      className="puzzle--sump-gate"
      progress={<PuzzleProgress completed={completed} total={households.length} />}
    >
      <PuzzleInstrument label="The yes/no item">
        <p className="puzzle-instrument-prompt">
          Did water collect because your sump pump stopped working properly
          during a power outage?
        </p>
      </PuzzleInstrument>

      <div className="gate-board">
        <ol className="gate-households" aria-label="Gate each household">
          {households.map((household) => {
            const selected = picks[household.id];
            return (
              <li className="gate-household" key={household.id}>
                <p className="gate-label">{household.label}</p>
                <p className="gate-facts">{household.facts}</p>
                <div className="gate-actions" role="group" aria-label={`Gate ${household.label}`}>
                  {gateChoices.map((choice) => (
                    <button
                      type="button"
                      key={choice.id}
                      className={`puzzle-button ${
                        selected === choice.id ? "is-chosen" : ""
                      }`}
                      aria-pressed={selected === choice.id}
                      onClick={() =>
                        setPicks((previous) => ({
                          ...previous,
                          [household.id]: choice.id
                        }))
                      }
                      data-testid={`sump-gate-${specimen.id}-${household.id}-${choice.id}`}
                    >
                      {choice.label}
                    </button>
                  ))}
                </div>
                {selected && (
                  <p className="gate-feedback" data-testid={`sump-feedback-${specimen.id}-${household.id}`}>
                    {household.consequence[selected]}
                  </p>
                )}
              </li>
            );
          })}
        </ol>

        <aside className="gate-ledger" aria-label="Gate ledger">
          <p className="gate-ledger-title">What the export can now separate</p>
          {lanes.map((lane) => (
            <div className="gate-lane" key={lane.id}>
              <p>{lane.lane}</p>
              {lane.households.length > 0 ? (
                <ul>
                  {lane.households.map((household) => (
                    <li key={household.id}>{household.label}</li>
                  ))}
                </ul>
              ) : (
                <span>empty</span>
              )}
            </div>
          ))}
        </aside>
      </div>

      {allComplete && (
        <PuzzleReveal
          specimen={specimen}
          eyebrow="Denominator unlocked"
          title="“No” split into three different states."
        >
          <p>
            No flooding, no pump failure, and no pump are not the same answer.
            A gate or follow-up keeps the absent-equipment household from
            impersonating an in-scope No.
          </p>
          <p className="puzzle-reveal-takeaway">
            False-premise puzzles get easier once you ask who actually belongs
            in the yes/no question.
          </p>
        </PuzzleReveal>
      )}

      <OptionalSource specimen={specimen} />
    </PuzzleFrame>
  );
}
