import { useState } from "react";
import type { WorkbenchSpecimen } from "../../types/workbench";
import { VerbatimQuote } from "../workbench/VerbatimQuote";
import {
  OptionalSource,
  PuzzleFrame,
  PuzzleInstrument,
  PuzzleReveal
} from "./PuzzleFrame";

type RuleId = "plug" | "battery" | "marketing" | "hybrid";

type Vehicle = {
  id: string;
  label: string;
  description: string;
  features: string[];
  result: Record<RuleId, string>;
};

const rules: Array<{ id: RuleId; label: string; hint: string }> = [
  {
    id: "plug",
    label: "Plug controls",
    hint: "Only vehicles charged from an outlet count in the EV path."
  },
  {
    id: "battery",
    label: "Battery controls",
    hint: "Any vehicle with a battery-assist system feels electric."
  },
  {
    id: "marketing",
    label: "Name controls",
    hint: "The household follows the badge or everyday name."
  },
  {
    id: "hybrid",
    label: "Hybrid controls",
    hint: "Gas-plus-electric identity pulls vehicles into a separate neighbor."
  }
];

const vehicles: Vehicle[] = [
  {
    id: "battery-only",
    label: "Battery-only car",
    description: "No gas engine; charges from an outlet.",
    features: ["plug", "battery", "marketed EV"],
    result: {
      plug: "Plug-in EV",
      battery: "Electric",
      marketing: "Electric",
      hybrid: "Not hybrid"
    }
  },
  {
    id: "regular-hybrid",
    label: "Regular hybrid",
    description: "Gas engine plus battery assist; no charging port.",
    features: ["battery", "gas", "hybrid badge"],
    result: {
      plug: "Out of EV path",
      battery: "Electric",
      marketing: "Hybrid, not EV",
      hybrid: "Hybrid"
    }
  },
  {
    id: "plug-hybrid",
    label: "Plug-in hybrid",
    description: "Gas engine, battery, and charging port.",
    features: ["plug", "battery", "gas", "hybrid badge"],
    result: {
      plug: "Plug-in EV",
      battery: "Electric",
      marketing: "Hybrid and EV",
      hybrid: "Hybrid"
    }
  },
  {
    id: "mild-hybrid",
    label: "Mild hybrid",
    description: "Small battery assist; never driven on battery alone.",
    features: ["battery assist", "gas", "hybrid-ish"],
    result: {
      plug: "Out of EV path",
      battery: "Electric",
      marketing: "Depends on badge",
      hybrid: "Hybrid neighbor"
    }
  }
];

export function ElectricVehicleRuleBoard({
  specimen,
  titleId
}: {
  specimen: WorkbenchSpecimen;
  titleId: string;
}) {
  const [rule, setRule] = useState<RuleId | null>(null);
  const activeRule = rules.find((item) => item.id === rule);

  return (
    <PuzzleFrame
      specimen={specimen}
      titleId={titleId}
      title="Pick the feature that decides the vehicle."
      lede="The household knows the car. The form failed to say which feature should control the edge case: plug, battery, marketing name, or hybrid identity."
      className="puzzle--ev-rule"
    >
      <PuzzleInstrument label="The follow-up label">
        <p className="puzzle-instrument-prompt">Another type of electric vehicle?</p>
      </PuzzleInstrument>

      <div className="rule-board">
        <div className="rule-buttons" role="group" aria-label="Pick the vehicle rule">
          {rules.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`rule-button ${rule === item.id ? "is-chosen" : ""}`}
              aria-pressed={rule === item.id}
              onClick={() => setRule(item.id)}
              data-testid={`ev-rule-${specimen.id}-${item.id}`}
            >
              <span>{item.label}</span>
              <small>{item.hint}</small>
            </button>
          ))}
        </div>

        <ol className="vehicle-grid" aria-label="Vehicle cards">
          {vehicles.map((vehicle) => (
            <li className="vehicle-card" key={vehicle.id}>
              <div className="vehicle-left">
                <p className="vehicle-label">{vehicle.label}</p>
                <p className="vehicle-description">{vehicle.description}</p>
                <ul className="vehicle-features">
                  {vehicle.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
              <p
                className={`vehicle-result ${rule ? "is-active" : ""}`}
                data-testid={`ev-result-${specimen.id}-${vehicle.id}`}
              >
                {rule ? vehicle.result[rule] : "Pick a rule to move this card."}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {activeRule && (
        <PuzzleReveal
          specimen={specimen}
          eyebrow="Rule exposed"
          title="The hard part was not the car. It was the unstated rule."
        >
          <p>
            Under <strong>{activeRule.label.toLowerCase()}</strong>, the same
            vehicle cards move to different bins. The respondent can know the
            facts and still not know which feature the form meant to use.
          </p>
          <p className="puzzle-reveal-takeaway">
            A cleaner form names the controlling feature instead of asking
            respondents to infer it from “another type.”
          </p>
          <p className="puzzle-reveal-sowhat">
            <span className="puzzle-reveal-sowhat-key">For a survey you build</span>
            If the edge case depends on a hidden rule, knowledgeable respondents
            can still choose different answers.
          </p>
          {specimen.verbatim && <VerbatimQuote verbatim={specimen.verbatim} />}
        </PuzzleReveal>
      )}

      <OptionalSource specimen={specimen} />
    </PuzzleFrame>
  );
}
