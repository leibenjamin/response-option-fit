import { useState } from "react";
import type { ExampleSetEditorConfig, Vignette } from "../../../types/workbench";
import type { ExampleSetEditorState } from "../../../lib/diagnostics";

type Props = {
  config: ExampleSetEditorConfig;
  state: ExampleSetEditorState;
  vignettes: Vignette[];
  onStateChange: (state: ExampleSetEditorState) => void;
};

export function ExampleSetEditor({ config, state, vignettes, onStateChange }: Props) {
  const [message, setMessage] = useState("Examples ready.");

  const labelFor = (id: string) =>
    config.candidates.find((candidate) => candidate.id === id)?.label ?? id;

  const updateExamples = (id: string, active: boolean) => {
    const nextIds = active
      ? state.activeExampleIds.filter((exampleId) => exampleId !== id)
      : [...state.activeExampleIds, id];
    onStateChange({ kind: "example_set_editor", activeExampleIds: nextIds });
    setMessage(`${active ? "Removed" : "Added"} ${labelFor(id)}.`);
  };

  return (
    <div
      className="widget widget--example-set"
      data-testid="widget-example-set-editor"
      aria-label={`${vignettes.length} vignette example-set editor`}
    >
      <div className="widget-live sr-only" role="status" aria-live="polite" aria-atomic="true">
        {message}
      </div>
      <pre hidden data-testid="widget-state">
        {JSON.stringify(state)}
      </pre>

      <div className="example-active">
        <p className="widget-subtitle">Active examples</p>
        {state.activeExampleIds.length > 0 ? (
          <ul className="example-chip-list" aria-label="Active examples">
            {state.activeExampleIds.map((id) => (
              <li key={id} className="example-chip">
                <span>{labelFor(id)}</span>
                <button
                  type="button"
                  className="chip-remove"
                  aria-label={`Remove ${labelFor(id)}`}
                  onClick={() => updateExamples(id, true)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="widget-empty">No examples active.</p>
        )}
      </div>

      <div className="widget-listbox-wrap">
        <p className="widget-subtitle" id="example-candidates-label">
          Candidate examples
        </p>
        <ul className="widget-listbox" aria-labelledby="example-candidates-label">
          {config.candidates.map((candidate) => {
            const active = state.activeExampleIds.includes(candidate.id);
            return (
              <li
                key={candidate.id}
                className={`widget-option ${active ? "is-selected" : ""}`}
              >
                <span className="widget-option-label">{candidate.label}</span>
                <button
                  type="button"
                  className="widget-toggle-button"
                  aria-label={`${active ? "Remove" : "Add"} ${candidate.label}`}
                  aria-pressed={active}
                  onClick={() => updateExamples(candidate.id, active)}
                >
                  {active ? "Remove" : "Add"}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
