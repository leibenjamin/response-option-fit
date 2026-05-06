import { useId } from "react";
import type { FilterPathToggleConfig, Vignette } from "../../../types/workbench";
import type { FilterPathToggleState } from "../../../lib/diagnostics";
import { useAnnouncer } from "../../../lib/announcer";

type Props = {
  config: FilterPathToggleConfig;
  state: FilterPathToggleState;
  vignettes: Vignette[];
  onStateChange: (state: FilterPathToggleState) => void;
};

export function FilterPathToggle({ state, vignettes, onStateChange }: Props) {
  const announce = useAnnouncer();
  const baseId = useId();

  const update = (key: "hasScreener" | "hasNotApplicable", value: boolean) => {
    const next = { ...state, [key]: value };
    onStateChange(next);
    const setting = key === "hasScreener" ? "Eligibility screener" : "Not-applicable option";
    if (value) {
      announce.toggledOn(setting);
    } else {
      announce.toggledOff(setting);
    }
  };

  return (
    <fieldset
      className="widget widget--filter-path"
      data-testid="widget-filter-path-toggle"
      aria-label={`${vignettes.length} scenario applicability controls`}
    >
      <legend className="widget-subtitle">Applicability choices</legend>
      {announce.status}
      <pre hidden data-testid="widget-state">
        {JSON.stringify(state)}
      </pre>

      <label className="checkbox-row" htmlFor={`${baseId}-screener`}>
        <input
          id={`${baseId}-screener`}
          type="checkbox"
          checked={state.hasScreener}
          onChange={(event) => update("hasScreener", event.currentTarget.checked)}
        />
        <span className="checkbox-mark" aria-hidden="true" />
        <span className="checkbox-body">
          <span className="checkbox-label">Add eligibility screener</span>
        </span>
      </label>

      <label className="checkbox-row" htmlFor={`${baseId}-not-applicable`}>
        <input
          id={`${baseId}-not-applicable`}
          type="checkbox"
          checked={state.hasNotApplicable}
          onChange={(event) => update("hasNotApplicable", event.currentTarget.checked)}
        />
        <span className="checkbox-mark" aria-hidden="true" />
        <span className="checkbox-body">
          <span className="checkbox-label">Add 'not applicable' option to response</span>
        </span>
      </label>
    </fieldset>
  );
}
