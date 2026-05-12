import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode
} from "react";
import type { ConfidenceLevel, VignetteOutcome } from "../types/workbench";
import { readJSON, remove, writeJSON } from "./storage";
import { useSettings } from "./settings";

const PRACTICE_STATE_KEY = "practice-state";
const STORAGE_CHANGE_EVENT = "rofl-storage-change";

export type CaseLabPracticeRecord = {
  scenarioAnswers?: Record<string, VignetteOutcome>;
  selectedRepairId?: string;
  repairBenchSeen?: boolean;
  transferAnswer?: VignetteOutcome;
};

export type LegacyPracticeRecord = {
  predictions?: Record<string, VignetteOutcome>;
  confidence?: ConfidenceLevel;
  mechanismChoiceId?: string;
  predictionSubmitted?: boolean;
  revealedNeighborContrast?: boolean;
  microCaseAnswers?: Record<string, number>;
  microCaseSubmitted?: Record<string, boolean>;
};

export type SpecimenPracticeRecord = {
  caseLab?: CaseLabPracticeRecord;
  legacy?: LegacyPracticeRecord;
};

export type PracticeState = {
  specimens: Record<string, SpecimenPracticeRecord>;
};

type PracticeAction =
  | { type: "hydrate"; state: PracticeState }
  | { type: "reset" }
  | {
      type: "set_case_lab";
      specimenId: string;
      record: CaseLabPracticeRecord;
    }
  | {
      type: "set_legacy";
      specimenId: string;
      record: LegacyPracticeRecord;
    };

type PracticeContextValue = {
  state: PracticeState;
  setCaseLabRecord: (specimenId: string, record: CaseLabPracticeRecord) => void;
  setLegacyRecord: (specimenId: string, record: LegacyPracticeRecord) => void;
};

const EMPTY_STATE: PracticeState = { specimens: {} };
const outcomeValues = new Set<VignetteOutcome>([
  "covered",
  "ambiguous",
  "not_covered"
]);
const confidenceValues = new Set<ConfidenceLevel>([
  "guessing",
  "hunch",
  "fairly_sure"
]);

const PracticeContext = createContext<PracticeContextValue | null>(null);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isOutcome(value: unknown): value is VignetteOutcome {
  return typeof value === "string" && outcomeValues.has(value as VignetteOutcome);
}

function isOutcomeMap(value: unknown): value is Record<string, VignetteOutcome> {
  return (
    isPlainObject(value) &&
    Object.values(value).every((entry) => isOutcome(entry))
  );
}

function isNumberMap(value: unknown): value is Record<string, number> {
  return (
    isPlainObject(value) &&
    Object.values(value).every(
      (entry) => Number.isInteger(entry) && (entry as number) >= 0
    )
  );
}

function isBooleanMap(value: unknown): value is Record<string, boolean> {
  return (
    isPlainObject(value) &&
    Object.values(value).every((entry) => typeof entry === "boolean")
  );
}

function isCaseLabPracticeRecord(value: unknown): value is CaseLabPracticeRecord {
  if (!isPlainObject(value)) return false;
  const v = value as CaseLabPracticeRecord;
  return (
    (v.scenarioAnswers === undefined || isOutcomeMap(v.scenarioAnswers)) &&
    (v.selectedRepairId === undefined || typeof v.selectedRepairId === "string") &&
    (v.repairBenchSeen === undefined || typeof v.repairBenchSeen === "boolean") &&
    (v.transferAnswer === undefined || isOutcome(v.transferAnswer))
  );
}

function isLegacyPracticeRecord(value: unknown): value is LegacyPracticeRecord {
  if (!isPlainObject(value)) return false;
  const v = value as LegacyPracticeRecord;
  return (
    (v.predictions === undefined || isOutcomeMap(v.predictions)) &&
    (v.confidence === undefined ||
      (typeof v.confidence === "string" &&
        confidenceValues.has(v.confidence as ConfidenceLevel))) &&
    (v.mechanismChoiceId === undefined ||
      typeof v.mechanismChoiceId === "string") &&
    (v.predictionSubmitted === undefined ||
      typeof v.predictionSubmitted === "boolean") &&
    (v.revealedNeighborContrast === undefined ||
      typeof v.revealedNeighborContrast === "boolean") &&
    (v.microCaseAnswers === undefined || isNumberMap(v.microCaseAnswers)) &&
    (v.microCaseSubmitted === undefined ||
      isBooleanMap(v.microCaseSubmitted))
  );
}

export function isPracticeState(value: unknown): value is PracticeState {
  if (!isPlainObject(value)) return false;
  const specimens = (value as { specimens?: unknown }).specimens;
  if (!isPlainObject(specimens)) return false;
  return Object.values(specimens).every((record) => {
    if (!isPlainObject(record)) return false;
    const r = record as SpecimenPracticeRecord;
    return (
      (r.caseLab === undefined || isCaseLabPracticeRecord(r.caseLab)) &&
      (r.legacy === undefined || isLegacyPracticeRecord(r.legacy))
    );
  });
}

function readStoredPracticeState(): PracticeState | null {
  const stored = readJSON<unknown>(PRACTICE_STATE_KEY, null);
  return isPracticeState(stored) ? stored : null;
}

function compactRecord(record: SpecimenPracticeRecord): SpecimenPracticeRecord | null {
  const next: SpecimenPracticeRecord = {};
  if (record.caseLab && Object.keys(record.caseLab).length > 0) {
    next.caseLab = record.caseLab;
  }
  if (record.legacy && Object.keys(record.legacy).length > 0) {
    next.legacy = record.legacy;
  }
  return Object.keys(next).length > 0 ? next : null;
}

function compactState(state: PracticeState): PracticeState {
  const specimens: Record<string, SpecimenPracticeRecord> = {};
  for (const [specimenId, record] of Object.entries(state.specimens)) {
    const compacted = compactRecord(record);
    if (compacted) specimens[specimenId] = compacted;
  }
  return { specimens };
}

function reducer(state: PracticeState, action: PracticeAction): PracticeState {
  switch (action.type) {
    case "hydrate":
      return compactState(action.state);
    case "reset":
      return EMPTY_STATE;
    case "set_case_lab": {
      const current = state.specimens[action.specimenId] ?? {};
      return compactState({
        specimens: {
          ...state.specimens,
          [action.specimenId]: {
            ...current,
            caseLab: action.record
          }
        }
      });
    }
    case "set_legacy": {
      const current = state.specimens[action.specimenId] ?? {};
      return compactState({
        specimens: {
          ...state.specimens,
          [action.specimenId]: {
            ...current,
            legacy: action.record
          }
        }
      });
    }
  }
}

function createInitialState(remember: boolean): PracticeState {
  if (!remember) return EMPTY_STATE;
  return readStoredPracticeState() ?? EMPTY_STATE;
}

function isEmptyState(state: PracticeState): boolean {
  return Object.keys(state.specimens).length === 0;
}

export function PracticeProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings();
  const [state, dispatch] = useReducer(
    reducer,
    settings.remember,
    createInitialState
  );
  const previousRememberRef = useRef(settings.remember);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const wasRemembering = previousRememberRef.current;
    previousRememberRef.current = settings.remember;

    if (!settings.remember) {
      if (wasRemembering) dispatch({ type: "reset" });
      return;
    }

    const stored = readStoredPracticeState();
    if (stored) dispatch({ type: "hydrate", state: stored });
  }, [settings.remember]);

  useEffect(() => {
    if (!settings.remember) return;
    if (isEmptyState(state)) {
      remove(PRACTICE_STATE_KEY);
      return;
    }
    writeJSON<PracticeState>(PRACTICE_STATE_KEY, state);
  }, [settings.remember, state]);

  useEffect(() => {
    if (!settings.remember) return;
    const sync = () => {
      const stored = readStoredPracticeState();
      const next = stored ?? EMPTY_STATE;
      if (JSON.stringify(compactState(next)) === JSON.stringify(stateRef.current)) {
        return;
      }
      if (stored) {
        dispatch({ type: "hydrate", state: stored });
      } else {
        dispatch({ type: "reset" });
      }
    };
    window.addEventListener("storage", sync);
    window.addEventListener(STORAGE_CHANGE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(STORAGE_CHANGE_EVENT, sync);
    };
  }, [settings.remember]);

  const setCaseLabRecord = useCallback(
    (specimenId: string, record: CaseLabPracticeRecord) => {
      dispatch({ type: "set_case_lab", specimenId, record });
    },
    []
  );

  const setLegacyRecord = useCallback(
    (specimenId: string, record: LegacyPracticeRecord) => {
      dispatch({ type: "set_legacy", specimenId, record });
    },
    []
  );

  const value = useMemo<PracticeContextValue>(
    () => ({ state, setCaseLabRecord, setLegacyRecord }),
    [state, setCaseLabRecord, setLegacyRecord]
  );

  return createElement(PracticeContext.Provider, { value }, children);
}

export function usePracticeState(): PracticeContextValue {
  const context = useContext(PracticeContext);
  if (!context) {
    throw new Error("usePracticeState must be used within PracticeProvider");
  }
  return context;
}
