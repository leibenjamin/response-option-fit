import type {
  BucketSplitterConfig,
  ClassifierRadioConfig,
  ExampleSetEditorConfig,
  FilterPathToggleConfig,
  SequenceReordererConfig,
  TimeWindowSliderConfig,
  WidgetConfig
} from "../types/workbench";

export type DiagnosticOutcome = "covered" | "not_covered";

export type ExampleSetEditorState = {
  kind: "example_set_editor";
  activeExampleIds: string[];
};

export type BucketSplitterState = {
  kind: "bucket_splitter";
  splitIndex: number | null;
};

export type FilterPathToggleState = {
  kind: "filter_path_toggle";
  hasScreener: boolean;
  hasNotApplicable: boolean;
};

export type ClassifierRadioState = {
  kind: "classifier_radio";
  selectedFeatureId: string;
};

export type SequenceReordererState = {
  kind: "sequence_reorderer";
  order: string[];
  allowMulti: boolean;
};

export type TimeWindowSliderState = {
  kind: "time_window_slider";
  windowId: string;
};

export type WidgetState =
  | ExampleSetEditorState
  | BucketSplitterState
  | FilterPathToggleState
  | ClassifierRadioState
  | SequenceReordererState
  | TimeWindowSliderState;

function sameSet(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((id) => right.includes(id));
}

function sameOrder(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((id, i) => id === right[i]);
}

export function initialWidgetState(config: WidgetConfig): WidgetState {
  switch (config.kind) {
    case "example_set_editor":
      return {
        kind: config.kind,
        activeExampleIds: [...config.initialExampleIds]
      };
    case "bucket_splitter":
      return {
        kind: config.kind,
        splitIndex: config.initialSplitIndex
      };
    case "filter_path_toggle":
      return {
        kind: config.kind,
        hasScreener: config.initialState.hasScreener,
        hasNotApplicable: config.initialState.hasNotApplicable
      };
    case "classifier_radio":
      return {
        kind: config.kind,
        selectedFeatureId: config.initialFeatureId
      };
    case "sequence_reorderer":
      return {
        kind: config.kind,
        order: [...config.initialOrder],
        allowMulti: config.initialAllowMulti
      };
    case "time_window_slider":
      return {
        kind: config.kind,
        windowId: config.initialWindowId
      };
  }
}

function evaluateExampleSet(
  state: ExampleSetEditorState,
  vignetteId: string,
  config: ExampleSetEditorConfig
): DiagnosticOutcome {
  const diagnostic = config.diagnostic[vignetteId];
  if (!diagnostic) return "not_covered";
  return diagnostic.coveredBy.some((set) => sameSet(state.activeExampleIds, set))
    ? "covered"
    : "not_covered";
}

function evaluateBucketSplit(
  state: BucketSplitterState,
  vignetteId: string,
  config: BucketSplitterConfig
): DiagnosticOutcome {
  const diagnostic = config.diagnostic[vignetteId];
  if (!diagnostic || state.splitIndex === null) return "not_covered";
  return diagnostic.cleanAt.includes(state.splitIndex) ? "covered" : "not_covered";
}

function evaluateFilterPath(
  state: FilterPathToggleState,
  vignetteId: string,
  config: FilterPathToggleConfig
): DiagnosticOutcome {
  const diagnostic = config.diagnostic[vignetteId];
  if (!diagnostic) return "not_covered";
  return diagnostic.cleanStates.some(
    (clean) =>
      clean.hasScreener === state.hasScreener &&
      clean.hasNotApplicable === state.hasNotApplicable
  )
    ? "covered"
    : "not_covered";
}

function evaluateClassifier(
  state: ClassifierRadioState,
  vignetteId: string,
  config: ClassifierRadioConfig
): DiagnosticOutcome {
  const diagnostic = config.diagnostic[vignetteId];
  if (!diagnostic) return "not_covered";
  return diagnostic.cleanFeatureIds.includes(state.selectedFeatureId)
    ? "covered"
    : "not_covered";
}

function evaluateSequence(
  state: SequenceReordererState,
  vignetteId: string,
  config: SequenceReordererConfig
): DiagnosticOutcome {
  const diagnostic = config.diagnostic[vignetteId];
  if (!diagnostic) return "not_covered";
  const orderMatches = diagnostic.cleanOrders.some((order) => sameOrder(state.order, order));
  const multiMatches = !diagnostic.requiresMulti || state.allowMulti;
  return orderMatches && multiMatches ? "covered" : "not_covered";
}

function evaluateTimeWindow(
  state: TimeWindowSliderState,
  vignetteId: string,
  config: TimeWindowSliderConfig
): DiagnosticOutcome {
  const diagnostic = config.diagnostic[vignetteId];
  if (!diagnostic) return "not_covered";
  return diagnostic.stableWindowIds.includes(state.windowId) ? "covered" : "not_covered";
}

export function evaluateDiagnostic(
  widgetState: WidgetState,
  vignetteId: string,
  config: WidgetConfig
): DiagnosticOutcome {
  switch (config.kind) {
    case "example_set_editor":
      return widgetState.kind === config.kind
        ? evaluateExampleSet(widgetState, vignetteId, config)
        : "not_covered";
    case "bucket_splitter":
      return widgetState.kind === config.kind
        ? evaluateBucketSplit(widgetState, vignetteId, config)
        : "not_covered";
    case "filter_path_toggle":
      return widgetState.kind === config.kind
        ? evaluateFilterPath(widgetState, vignetteId, config)
        : "not_covered";
    case "classifier_radio":
      return widgetState.kind === config.kind
        ? evaluateClassifier(widgetState, vignetteId, config)
        : "not_covered";
    case "sequence_reorderer":
      return widgetState.kind === config.kind
        ? evaluateSequence(widgetState, vignetteId, config)
        : "not_covered";
    case "time_window_slider":
      return widgetState.kind === config.kind
        ? evaluateTimeWindow(widgetState, vignetteId, config)
        : "not_covered";
  }
}
