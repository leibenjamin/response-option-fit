import { useEffect, useId, useRef } from "react";
import type { SequenceReordererConfig, Vignette } from "../../../types/workbench";
import type { SequenceReordererState } from "../../../lib/diagnostics";
import { useAnnouncer } from "../../../lib/announcer";

type Props = {
  config: SequenceReordererConfig;
  state: SequenceReordererState;
  vignettes: Vignette[];
  onStateChange: (state: SequenceReordererState) => void;
};

export function SequenceReorderer({ config, state, vignettes, onStateChange }: Props) {
  const announce = useAnnouncer();
  const switchId = useId();
  const rowRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const pendingFocusId = useRef<string | null>(null);

  const labelFor = (id: string) => config.items.find((item) => item.id === id)?.label ?? id;

  useEffect(() => {
    const id = pendingFocusId.current;
    if (!id) return;
    rowRefs.current[id]?.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus();
    pendingFocusId.current = null;
  }, [state.order]);

  const updateOrder = (id: string, direction: "up" | "down") => {
    const index = state.order.indexOf(id);
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (index < 0 || targetIndex < 0 || targetIndex >= state.order.length) return;

    const nextOrder = [...state.order];
    const target = nextOrder[targetIndex];
    nextOrder[targetIndex] = id;
    nextOrder[index] = target;
    pendingFocusId.current = id;
    onStateChange({ ...state, order: nextOrder });
    const label = labelFor(id);
    if (direction === "up") {
      announce.movedUp(label, targetIndex + 1, state.order.length);
    } else {
      announce.movedDown(label, targetIndex + 1, state.order.length);
    }
  };

  const updateMulti = (allowMulti: boolean) => {
    onStateChange({ ...state, allowMulti });
    if (allowMulti) {
      announce.toggledOn("Multiple response selection");
    } else {
      announce.toggledOff("Multiple response selection");
    }
  };

  return (
    <div
      className="widget widget--sequence-reorderer"
      data-testid="widget-sequence-reorderer"
      aria-label={`${vignettes.length} scenario question-order controls`}
    >
      {announce.status}
      <pre hidden data-testid="widget-state">
        {JSON.stringify(state)}
      </pre>

      <div className="sequence-layout">
        <div>
          <p className="widget-subtitle" id="sequence-list-label">
            Current order
          </p>
          <ol className="sequence-list" aria-labelledby="sequence-list-label">
            {state.order.map((id, index) => (
              <li
                key={id}
                ref={(node) => {
                  rowRefs.current[id] = node;
                }}
                className="sequence-item"
              >
                <span className="sequence-item-position" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="sequence-item-label">{labelFor(id)}</span>
                <span className="sequence-actions">
                  <button
                    type="button"
                    className="icon-text-button"
                    aria-label={`Move '${labelFor(id)}' up`}
                    disabled={index === 0}
                    onClick={() => updateOrder(id, "up")}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    className="icon-text-button"
                    aria-label={`Move '${labelFor(id)}' down`}
                    disabled={index === state.order.length - 1}
                    onClick={() => updateOrder(id, "down")}
                  >
                    Down
                  </button>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <label className="switch-row sequence-switch" htmlFor={switchId}>
          <input
            id={switchId}
            type="checkbox"
            role="switch"
            checked={state.allowMulti}
            onChange={(event) => updateMulti(event.currentTarget.checked)}
          />
          <span className="switch-track" aria-hidden="true">
            <span className="switch-thumb" />
          </span>
          <span className="switch-body">
            <span className="switch-label">Allow respondents to pick all that apply</span>
          </span>
        </label>
      </div>
    </div>
  );
}
