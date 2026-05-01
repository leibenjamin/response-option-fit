import { useId, useState } from "react";
import type { TimeWindowSliderConfig, Vignette } from "../../../types/workbench";
import type { TimeWindowSliderState } from "../../../lib/diagnostics";

type Props = {
  config: TimeWindowSliderConfig;
  state: TimeWindowSliderState;
  vignettes: Vignette[];
  onStateChange: (state: TimeWindowSliderState) => void;
};

export function TimeWindowSlider({ config, state, vignettes, onStateChange }: Props) {
  const [message, setMessage] = useState("Recall window ready.");
  const sliderId = useId();
  const currentIndex = Math.max(
    0,
    config.windows.findIndex((window) => window.id === state.windowId)
  );
  const currentWindow = config.windows[currentIndex] ?? config.windows[0];

  const updateWindow = (index: number) => {
    const nextWindow = config.windows[index] ?? config.windows[0];
    onStateChange({ kind: "time_window_slider", windowId: nextWindow.id });
    setMessage(`Time window set to ${nextWindow.label}.`);
  };

  return (
    <div
      className="widget widget--time-window"
      data-testid="widget-time-window-slider"
      aria-label={`${vignettes.length} vignette time-window slider`}
    >
      <div className="widget-live sr-only" role="status" aria-live="polite" aria-atomic="true">
        {message}
      </div>
      <pre hidden data-testid="widget-state">
        {JSON.stringify(state)}
      </pre>

      <label className="range-label" htmlFor={sliderId}>
        Recall window
      </label>
      <input
        id={sliderId}
        className="time-range"
        type="range"
        min={0}
        max={config.windows.length - 1}
        step={1}
        value={currentIndex}
        aria-valuetext={currentWindow.label}
        onChange={(event) => updateWindow(Number(event.currentTarget.value))}
      />
      <p className="time-window-current">{currentWindow.label}</p>
      <ol className="time-window-ticks" aria-hidden="true">
        {config.windows.map((window) => (
          <li key={window.id}>{window.label}</li>
        ))}
      </ol>
    </div>
  );
}
