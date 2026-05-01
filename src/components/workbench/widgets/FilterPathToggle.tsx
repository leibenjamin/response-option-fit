import { useId, useState } from "react";
import type { FilterPathToggleConfig, Vignette } from "../../../types/workbench";
import type { FilterPathToggleState } from "../../../lib/diagnostics";

type Props = {
  config: FilterPathToggleConfig;
  state: FilterPathToggleState;
  vignettes: Vignette[];
  onStateChange: (state: FilterPathToggleState) => void;
};

export function FilterPathToggle({ state, vignettes, onStateChange }: Props) {
  const [message, setMessage] = useState("Filter path ready.");
  const baseId = useId();

  const update = (key: "hasScreener" | "hasNotApplicable", value: boolean) => {
    const next = { ...state, [key]: value };
    onStateChange(next);
    if (key === "hasScreener") {
      setMessage(`Eligibility screener ${value ? "added" : "removed"}.`);
    } else {
      setMessage(`Not-applicable option ${value ? "added" : "removed"}.`);
    }
  };

  return (
    <fieldset
      className="widget widget--filter-path"
      data-testid="widget-filter-path-toggle"
      aria-label={`${vignettes.length} vignette filter path toggle`}
    >
      <legend className="widget-subtitle">Applicability path</legend>
      <div className="widget-live sr-only" role="status" aria-live="polite" aria-atomic="true">
        {message}
      </div>
      <pre hidden data-testid="widget-state">
        {JSON.stringify(state)}
      </pre>

      <label className="switch-row" htmlFor={`${baseId}-screener`}>
        <input
          id={`${baseId}-screener`}
          type="checkbox"
          role="switch"
          checked={state.hasScreener}
          onChange={(event) => update("hasScreener", event.currentTarget.checked)}
        />
        <span className="switch-track" aria-hidden="true">
          <span className="switch-thumb" />
        </span>
        <span className="switch-body">
          <span className="switch-label">Add eligibility screener</span>
        </span>
      </label>

      <label className="switch-row" htmlFor={`${baseId}-not-applicable`}>
        <input
          id={`${baseId}-not-applicable`}
          type="checkbox"
          role="switch"
          checked={state.hasNotApplicable}
          onChange={(event) => update("hasNotApplicable", event.currentTarget.checked)}
        />
        <span className="switch-track" aria-hidden="true">
          <span className="switch-thumb" />
        </span>
        <span className="switch-body">
          <span className="switch-label">Add 'not applicable' option to response</span>
        </span>
      </label>
    </fieldset>
  );
}
