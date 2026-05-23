import { useState } from "react";
import type { WorkbenchSpecimen } from "../../types/workbench";
import { VerbatimQuote } from "../workbench/VerbatimQuote";
import {
  OptionalSource,
  PuzzleFrame,
  PuzzleInstrument,
  PuzzleReveal
} from "./PuzzleFrame";

type TvRule = "built-in" | "plays-through" | "touchscreen";

type Device = {
  id: string;
  label: string;
  description: string;
  result: Record<TvRule, string>;
};

const rules: Array<{ id: TvRule; label: string; hint: string }> = [
  {
    id: "built-in",
    label: "Built into the TV",
    hint: "Only the television itself counts."
  },
  {
    id: "plays-through",
    label: "Plays through a TV",
    hint: "External boxes and game systems count too."
  },
  {
    id: "touchscreen",
    label: "Touch-screen idea",
    hint: "A wrong everyday image controls the answer."
  }
];

const devices: Device[] = [
  {
    id: "smart-tv",
    label: "Smart TV",
    description: "TV with built-in internet apps",
    result: {
      "built-in": "Yes",
      "plays-through": "Yes",
      touchscreen: "Maybe, if touch-screen is imagined"
    }
  },
  {
    id: "apple-tv",
    label: "Apple TV box",
    description: "External box connected to a regular TV",
    result: {
      "built-in": "No",
      "plays-through": "Yes",
      touchscreen: "No"
    }
  },
  {
    id: "game-console",
    label: "Game console",
    description: "Internet-connected console used for streaming",
    result: {
      "built-in": "No",
      "plays-through": "Yes",
      touchscreen: "No"
    }
  },
  {
    id: "hdmi-laptop",
    label: "HDMI laptop",
    description: "Laptop connected to a TV to play a downloaded movie",
    result: {
      "built-in": "No",
      "plays-through": "Borderline",
      touchscreen: "No"
    }
  }
];

export function TvDeviceBoundary({
  specimen,
  titleId
}: {
  specimen: WorkbenchSpecimen;
  titleId: string;
}) {
  const [rule, setRule] = useState<TvRule | null>(null);
  const selectedRule = rules.find((item) => item.id === rule);

  return (
    <PuzzleFrame
      specimen={specimen}
      titleId={titleId}
      role="Your role: boundary reviewer"
      title="Is Apple TV a TV?"
      lede="The respondent may know every device in the room. The missing piece is which boundary the answer choice is using: built-in smart TV, any device that plays through a TV, or a mistaken mental image."
      className="puzzle--tv-boundary"
    >
      <PuzzleInstrument label="The device item">
        <p className="puzzle-instrument-prompt">
          Smart TV, game or video system, or another device that connects to the
          Internet and plays through a TV
        </p>
      </PuzzleInstrument>

      <div className="tv-boundary-board">
        <div className="tv-rule-row" role="group" aria-label="Choose the TV device rule">
          {rules.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`rule-button ${rule === item.id ? "is-chosen" : ""}`}
              aria-pressed={rule === item.id}
              onClick={() => setRule(item.id)}
              data-testid={`tv-rule-${specimen.id}-${item.id}`}
            >
              <span>{item.label}</span>
              <small>{item.hint}</small>
            </button>
          ))}
        </div>

        <ol className="tv-device-grid" aria-label="Device cards">
          {devices.map((device) => (
            <li className="tv-device-card" key={device.id}>
              <p className="tv-device-label">{device.label}</p>
              <p className="tv-device-description">{device.description}</p>
              <p
                className={`tv-device-result ${rule ? "is-active" : ""}`}
                data-testid={`tv-result-${specimen.id}-${device.id}`}
              >
                {rule ? device.result[rule] : "Pick a boundary rule."}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {selectedRule && (
        <PuzzleReveal
          specimen={specimen}
          eyebrow="Boundary exposed"
          title="The device did not move. The rule did."
        >
          <p>
            Under <strong>{selectedRule.label.toLowerCase()}</strong>, the same
            Apple TV box can be out of scope or clearly in scope. That is not a
            knowledge failure; it is an unstated category boundary.
          </p>
          <p className="puzzle-reveal-takeaway">
            The useful answer choice names the function that controls the edge:
            connected device that plays through a TV.
          </p>
          {specimen.verbatim && <VerbatimQuote verbatim={specimen.verbatim} />}
        </PuzzleReveal>
      )}

      <OptionalSource specimen={specimen} />
    </PuzzleFrame>
  );
}
