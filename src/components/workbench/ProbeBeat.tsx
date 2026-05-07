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
      return "Examples to add to the wording";
    case "bucket_splitter":
      return "Where to split one answer space";
    case "filter_path_toggle":
      return "Who should answer this question";
    case "classifier_radio":
      return "Which feature classifies the answer";
    case "sequence_reorderer":
      return "Question order";
    case "time_window_slider":
      return "Time period to ask about";
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
        <p className="beat-eyebrow">Step 3 / Try one wording change</p>
        <h3 className="beat-title" id={`${specimen.id}-probe-title`}>
          See how a small wording change affects each scenario
        </h3>
        <p className="beat-lede">
          {specimen.probePrompt} This is a sketch, not a tested fix: the page
          shows how the change might clarify each scenario, but it does not
          validate replacement wording.
        </p>
      </header>

      <div className="probe-grid">
        <div className="probe-widget-panel">
          <p className="probe-widget-label">{widgetLabel(specimen.widget.kind)}</p>
          {renderWidget()}
        </div>

        <ol className="probe-outcome-list" aria-label="Live exploratory outcomes">
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
                  {outcome === "covered"
                    ? "clearer for this scenario"
                    : "still unclear for this scenario"}
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
