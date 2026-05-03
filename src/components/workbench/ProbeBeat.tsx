import { evaluateDiagnostic, type WidgetState } from "../../lib/diagnostics";
import type { WorkbenchSpecimen } from "../../types/workbench";
import { BucketSplitter } from "./widgets/BucketSplitter";
import { ClassifierRadio } from "./widgets/ClassifierRadio";
import { ExampleSetEditor } from "./widgets/ExampleSetEditor";
import { FilterPathToggle } from "./widgets/FilterPathToggle";
import { SequenceReorderer } from "./widgets/SequenceReorderer";
import { TimeWindowSlider } from "./widgets/TimeWindowSlider";

type Props = {
  specimen: WorkbenchSpecimen;
  widgetState: WidgetState;
  onWidgetStateChange: (state: WidgetState) => void;
};

function widgetLabel(kind: WorkbenchSpecimen["widget"]["kind"]) {
  switch (kind) {
    case "example_set_editor":
      return "Example set editor";
    case "bucket_splitter":
      return "Bucket splitter";
    case "filter_path_toggle":
      return "Filter path toggle";
    case "classifier_radio":
      return "Classifier radio";
    case "sequence_reorderer":
      return "Sequence reorderer";
    case "time_window_slider":
      return "Time window slider";
  }
}

export function ProbeBeat({ specimen, widgetState, onWidgetStateChange }: Props) {
  const renderWidget = () => {
    switch (specimen.widget.kind) {
      case "example_set_editor":
        return widgetState.kind === "example_set_editor" ? (
          <ExampleSetEditor
            config={specimen.widget}
            state={widgetState}
            vignettes={specimen.vignettes}
            onStateChange={onWidgetStateChange}
          />
        ) : null;
      case "bucket_splitter":
        return widgetState.kind === "bucket_splitter" ? (
          <BucketSplitter
            config={specimen.widget}
            state={widgetState}
            vignettes={specimen.vignettes}
            onStateChange={onWidgetStateChange}
          />
        ) : null;
      case "filter_path_toggle":
        return widgetState.kind === "filter_path_toggle" ? (
          <FilterPathToggle
            config={specimen.widget}
            state={widgetState}
            vignettes={specimen.vignettes}
            onStateChange={onWidgetStateChange}
          />
        ) : null;
      case "classifier_radio":
        return widgetState.kind === "classifier_radio" ? (
          <ClassifierRadio
            config={specimen.widget}
            state={widgetState}
            vignettes={specimen.vignettes}
            onStateChange={onWidgetStateChange}
          />
        ) : null;
      case "sequence_reorderer":
        return widgetState.kind === "sequence_reorderer" ? (
          <SequenceReorderer
            config={specimen.widget}
            state={widgetState}
            vignettes={specimen.vignettes}
            onStateChange={onWidgetStateChange}
          />
        ) : null;
      case "time_window_slider":
        return widgetState.kind === "time_window_slider" ? (
          <TimeWindowSlider
            config={specimen.widget}
            state={widgetState}
            vignettes={specimen.vignettes}
            onStateChange={onWidgetStateChange}
          />
        ) : null;
    }
  };

  return (
    <section
      className="workbench-beat workbench-beat--probe"
      aria-labelledby={`${specimen.id}-probe-title`}
      data-testid={`probe-${specimen.id}`}
    >
      <header className="beat-head">
        <p className="beat-eyebrow">Probe</p>
        <h3 className="beat-title" id={`${specimen.id}-probe-title`}>
          Test the wording feature
        </h3>
        <p className="beat-lede">{specimen.probePrompt}</p>
      </header>

      <div className="probe-grid">
        <div className="probe-widget-panel">
          <p className="probe-widget-label">{widgetLabel(specimen.widget.kind)}</p>
          {renderWidget()}
        </div>

        <ol className="probe-outcome-list" aria-label="Live diagnostic outcomes">
          {specimen.vignettes.map((vignette) => {
            const outcome = evaluateDiagnostic(widgetState, vignette.id, specimen.widget);
            return (
              <li key={vignette.id} className="probe-outcome-card">
                <p className="probe-outcome-text">{vignette.text}</p>
                <span
                  className={`edit-outcome-badge edit-outcome-badge--${outcome}`}
                  data-testid="edit-outcome-badge"
                >
                  Under your edit:{" "}
                  {outcome === "covered" ? "likely resolved" : "still unresolved"}
                </span>
                <p className="probe-rationale" data-testid="probe-rationale">
                  {outcome === "covered"
                    ? vignette.probeRationale.covered
                    : vignette.probeRationale.notCovered}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
