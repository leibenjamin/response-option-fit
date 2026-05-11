import type {
  BucketSplitterConfig,
  ClassifierRadioConfig,
  ExampleSetEditorConfig,
  FilterPathToggleConfig,
  ProbeOutcomeKind,
  ProbeOutcomeRule,
  SequenceReordererConfig,
  TimeWindowSliderConfig,
  Vignette,
  WidgetConfig
} from "../types/workbench";

export type DiagnosticOutcome = "covered" | "not_covered";

export type ProbeDisplayOutcome = {
  diagnosticOutcome: DiagnosticOutcome;
  kind: ProbeOutcomeKind;
  rationale: string;
};

export const probeOutcomeLabels = {
  route_clearer: "Route clearer",
  still_ambiguous: "Still ambiguous",
  still_outside_target: "Still outside target",
  tradeoff_remains: "Tradeoff remains",
  method_still_hidden: "Method still hidden",
  scope_widened: "Scope widened"
} satisfies Record<ProbeOutcomeKind, string>;

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

function arrayFieldMatches(left: string[] | undefined, right: string[] | undefined): boolean {
  if (!right) return true;
  if (!left) return false;
  return sameSet(left, right);
}

function arrayIncludesAny(left: string[] | undefined, right: string[] | undefined): boolean {
  if (!right) return true;
  if (!left) return false;
  return right.some((id) => left.includes(id));
}

function orderFieldMatches(left: string[] | undefined, right: string[] | undefined): boolean {
  if (!right) return true;
  if (!left) return false;
  return sameOrder(left, right);
}

function ruleMatches(rule: ProbeOutcomeRule, widgetState: WidgetState): boolean {
  const when = rule.when;
  if (!when) return true;

  const activeExamples =
    widgetState.kind === "example_set_editor" ? widgetState.activeExampleIds : undefined;
  if (!arrayFieldMatches(activeExamples, when.activeExampleIds)) {
    return false;
  }
  if (!arrayIncludesAny(activeExamples, when.activeExampleIdsAny)) {
    return false;
  }
  if (!orderFieldMatches(
    widgetState.kind === "sequence_reorderer" ? widgetState.order : undefined,
    when.order
  )) {
    return false;
  }

  if (
    when.splitIndex !== undefined &&
    (widgetState.kind !== "bucket_splitter" || widgetState.splitIndex !== when.splitIndex)
  ) {
    return false;
  }
  if (
    when.hasScreener !== undefined &&
    (widgetState.kind !== "filter_path_toggle" ||
      widgetState.hasScreener !== when.hasScreener)
  ) {
    return false;
  }
  if (
    when.hasNotApplicable !== undefined &&
    (widgetState.kind !== "filter_path_toggle" ||
      widgetState.hasNotApplicable !== when.hasNotApplicable)
  ) {
    return false;
  }
  if (
    when.selectedFeatureId !== undefined &&
    (widgetState.kind !== "classifier_radio" ||
      widgetState.selectedFeatureId !== when.selectedFeatureId)
  ) {
    return false;
  }
  if (
    when.allowMulti !== undefined &&
    (widgetState.kind !== "sequence_reorderer" || widgetState.allowMulti !== when.allowMulti)
  ) {
    return false;
  }
  if (
    when.windowId !== undefined &&
    (widgetState.kind !== "time_window_slider" || widgetState.windowId !== when.windowId)
  ) {
    return false;
  }

  return true;
}

export function resolveProbeOutcome(
  widgetState: WidgetState,
  vignette: Vignette,
  config: WidgetConfig
): ProbeDisplayOutcome {
  const diagnosticOutcome = evaluateDiagnostic(widgetState, vignette.id, config);
  const fallback: ProbeDisplayOutcome = {
    diagnosticOutcome,
    kind: diagnosticOutcome === "covered" ? "route_clearer" : "still_ambiguous",
    rationale:
      diagnosticOutcome === "covered"
        ? vignette.probeRationale.covered
        : vignette.probeRationale.notCovered
  };
  const matchingRule = config.probeOutcomeRules?.find(
    (rule) => rule.vignetteId === vignette.id && ruleMatches(rule, widgetState)
  );

  if (!matchingRule) return fallback;
  return {
    diagnosticOutcome,
    kind: matchingRule.kind,
    rationale: matchingRule.rationale ?? fallback.rationale
  };
}
