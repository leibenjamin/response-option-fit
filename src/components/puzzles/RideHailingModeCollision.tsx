import { useMemo, useState } from "react";
import type { WorkbenchSpecimen } from "../../types/workbench";
import { VerbatimQuote } from "../workbench/VerbatimQuote";
import {
  OptionalSource,
  PuzzleFrame,
  PuzzleInstrument,
  PuzzleProgress,
  PuzzleReveal
} from "./PuzzleFrame";

type CollisionChoice = "stored" | "outside" | "split";

type CollisionCase = {
  id: string;
  label: string;
  trip: string;
  cue: string;
  best: CollisionChoice;
  consequence: Record<CollisionChoice, string>;
};

const choices: Array<{ id: CollisionChoice; label: string; lane: string }> = [
  {
    id: "stored",
    label: "Store in taxi / ride-hailing",
    lane: "Exported option absorbs it"
  },
  { id: "outside", label: "Route elsewhere", lane: "Escapes the option" },
  { id: "split", label: "Needs a split", lane: "Missing rule becomes visible" }
];

const cases: CollisionCase[] = [
  {
    id: "app",
    label: "Lyft ride",
    trip: "Paid app ride to work",
    cue: "The service is named by the everyday label.",
    best: "stored",
    consequence: {
      stored: "Clean center case, but the export still cannot say app ride versus taxi.",
      outside: "The app ride drops into residual even though the option named it.",
      split: "The split helps analysis, but the current form has no place to put it."
    }
  },
  {
    id: "taxi",
    label: "Street taxi",
    trip: "Hailed cab, no app",
    cue: "The same option also explicitly says taxi.",
    best: "stored",
    consequence: {
      stored: "Reasonable, and now the same exported cell holds app platforms and traditional taxi.",
      outside: "The taxi leaves the option even though the option literally says taxi.",
      split: "The split is analytically cleaner than the one exported cell."
    }
  },
  {
    id: "carpool",
    label: "Coworker carpool",
    trip: "Shared ride, no payment",
    cue: "The word shared pulls toward the label, but no ride was hired.",
    best: "outside",
    consequence: {
      stored: "The paid-service count just swallowed an unpaid informal commute.",
      outside: "Good boundary: sharing a car is not the same as hiring a ride.",
      split: "A split would need to say paid service versus informal sharing."
    }
  },
  {
    id: "bike",
    label: "Bike share",
    trip: "Rented shared bicycle",
    cue: "It shares a word with ride-sharing, not the commute mode.",
    best: "outside",
    consequence: {
      stored: "The option starts absorbing nearby mobility products.",
      outside: "Good boundary: the transportation mode stays visible.",
      split: "A split helps only if the form names the mode boundary."
    }
  }
];

type Picks = Record<string, CollisionChoice | undefined>;

export function RideHailingModeCollision({
  specimen,
  titleId
}: {
  specimen: WorkbenchSpecimen;
  titleId: string;
}) {
  const [picks, setPicks] = useState<Picks>({});
  const completed = cases.filter((item) => picks[item.id]).length;
  const allComplete = completed === cases.length;
  const laneCases = useMemo(
    () =>
      choices.map((choice) => ({
        ...choice,
        cases: cases.filter((item) => picks[item.id] === choice.id)
      })),
    [picks]
  );

  return (
    <PuzzleFrame
      specimen={specimen}
      titleId={titleId}
      role="You are the mode mapper"
      title="One commute option. Four trips collide inside it."
      lede="Route the trips the way a form would store them. The small win is watching one tidy exported option absorb several different transportation stories."
      className="puzzle--mode-collision"
      progress={<PuzzleProgress completed={completed} total={cases.length} />}
    >
      <PuzzleInstrument label="The answer choice under stress">
        <p className="puzzle-instrument-prompt">Taxi or ride-hailing services</p>
      </PuzzleInstrument>

      <div className="collision-board">
        <ol className="collision-cases" aria-label="Route each commute">
          {cases.map((item) => {
            const selected = picks[item.id];
            return (
              <li className="collision-case" key={item.id}>
                <p className="collision-label">{item.label}</p>
                <p className="collision-trip">{item.trip}</p>
                <p className="collision-cue">{item.cue}</p>
                <div className="collision-actions" role="group" aria-label={`Route ${item.label}`}>
                  {choices.map((choice) => (
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
                          [item.id]: choice.id
                        }))
                      }
                      data-testid={`mode-pick-${specimen.id}-${item.id}-${choice.id}`}
                    >
                      {choice.label}
                    </button>
                  ))}
                </div>
                {selected && (
                  <p className="collision-feedback" data-testid={`mode-feedback-${specimen.id}-${item.id}`}>
                    {item.consequence[selected]}
                  </p>
                )}
              </li>
            );
          })}
        </ol>

        <aside className="collision-export" aria-label="Exported commute board">
          <p className="collision-export-title">Exported board</p>
          {laneCases.map((lane) => (
            <div className="collision-lane" key={lane.id}>
              <p className="collision-lane-label">{lane.lane}</p>
              {lane.cases.length > 0 ? (
                <ul>
                  {lane.cases.map((item) => (
                    <li key={item.id}>{item.label}</li>
                  ))}
                </ul>
              ) : (
                <p className="collision-empty">empty</p>
              )}
            </div>
          ))}
        </aside>
      </div>

      {allComplete && (
        <PuzzleReveal
          specimen={specimen}
          eyebrow="Mode collision"
          title="The exported option did not store a definition."
        >
          <p>
            The label can catch app rides and taxis, but it also invites nearby
            meanings like shared rides and shared mobility. The data keeps the
            option selected, not the route logic you used.
          </p>
          <p className="puzzle-reveal-takeaway">
            The reviewer move is to state whether the construct is paid service,
            vehicle mode, platform use, or something else before the list ships.
          </p>
          {specimen.verbatim && <VerbatimQuote verbatim={specimen.verbatim} />}
        </PuzzleReveal>
      )}

      <OptionalSource specimen={specimen} />
    </PuzzleFrame>
  );
}
