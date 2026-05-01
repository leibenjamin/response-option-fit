import { useId, useState } from "react";
import type { ClassifierRadioConfig, Vignette } from "../../../types/workbench";
import type { ClassifierRadioState } from "../../../lib/diagnostics";

type Props = {
  config: ClassifierRadioConfig;
  state: ClassifierRadioState;
  vignettes: Vignette[];
  onStateChange: (state: ClassifierRadioState) => void;
};

export function ClassifierRadio({ config, state, vignettes, onStateChange }: Props) {
  const [message, setMessage] = useState("Classification feature ready.");
  const groupName = useId();

  const updateFeature = (featureId: string, label: string) => {
    onStateChange({ kind: "classifier_radio", selectedFeatureId: featureId });
    setMessage(`Classifier selected: ${label}.`);
  };

  return (
    <fieldset
      className="widget widget--classifier-radio"
      data-testid="widget-classifier-radio"
      aria-label={`${vignettes.length} vignette classifier radio`}
    >
      <legend className="widget-subtitle">Classification feature</legend>
      <div className="widget-live sr-only" role="status" aria-live="polite" aria-atomic="true">
        {message}
      </div>
      <pre hidden data-testid="widget-state">
        {JSON.stringify(state)}
      </pre>

      <div className="radio-card-list">
        {config.features.map((feature) => (
          <label key={feature.id} className="radio-card">
            <input
              type="radio"
              name={groupName}
              value={feature.id}
              checked={state.selectedFeatureId === feature.id}
              onChange={() => updateFeature(feature.id, feature.label)}
            />
            <span className="radio-card-mark" aria-hidden="true" />
            <span className="radio-card-body">
              <span className="radio-card-label">{feature.label}</span>
              <span className="radio-card-description">{feature.description}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
