import { useId } from "react";
import type { ClassifierRadioConfig, Vignette } from "../../../types/workbench";
import type { ClassifierRadioState } from "../../../lib/diagnostics";
import { useAnnouncer } from "../../../lib/announcer";

type Props = {
  config: ClassifierRadioConfig;
  state: ClassifierRadioState;
  vignettes: Vignette[];
  onStateChange: (state: ClassifierRadioState) => void;
};

export function ClassifierRadio({ config, state, vignettes, onStateChange }: Props) {
  const announce = useAnnouncer();
  const groupName = useId();

  const updateFeature = (featureId: string, label: string) => {
    onStateChange({ kind: "classifier_radio", selectedFeatureId: featureId });
    announce.selected(label);
  };

  return (
    <fieldset
      className="widget widget--classifier-radio"
      data-testid="widget-classifier-radio"
      aria-label={`${vignettes.length} scenario classification choices`}
    >
      <legend className="widget-subtitle">Classification feature</legend>
      {announce.status}
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
