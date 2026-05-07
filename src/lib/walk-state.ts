/* Walk-through progress state.

   Tracks which specimens the visitor has opened during walk mode and which
   recap interstitials they have already dismissed. By default the state
   lives in memory and is lost on refresh; if the user has opted into
   `settings.remember`, the visited set and dismissed-recap set are
   persisted to localStorage under a single namespaced key.

   The recap thresholds are the positions in the canonical specimen order
   at which a between-examples recap should run. With twelve specimens
   the natural cadence is 4 / 8; the 12th completion is handled by the
   `walk/done` route and a dedicated screen rather than a recap. */

import { useCallback, useEffect, useReducer, useRef } from "react";
import { readJSON, writeJSON, remove } from "./storage";
import { useSettings } from "./settings";

const WALK_STATE_KEY = "walk-state";

export const recapThresholds: readonly number[] = [4, 8];

export type WalkState = {
  visited: string[];
  recapsDismissed: number[];
  /* The specimen id from the most recent visit() call, including revisits.
     Used by the Resume CTA on the hub to point at where the visitor was
     last active rather than where they last saw something new. Null means
     they have never opened a walk-mode specimen. */
  lastSpecimenId: string | null;
};

type WalkAction =
  | { type: "visit"; specimenId: string }
  | { type: "dismiss_recap"; threshold: number }
  | { type: "hydrate"; state: WalkState }
  | { type: "reset" };

const EMPTY_STATE: WalkState = {
  visited: [],
  recapsDismissed: [],
  lastSpecimenId: null
};

function reducer(state: WalkState, action: WalkAction): WalkState {
  switch (action.type) {
    case "visit": {
      const next: WalkState = { ...state, lastSpecimenId: action.specimenId };
      if (state.visited.includes(action.specimenId)) return next;
      return { ...next, visited: [...state.visited, action.specimenId] };
    }
    case "dismiss_recap": {
      if (state.recapsDismissed.includes(action.threshold)) return state;
      return {
        ...state,
        recapsDismissed: [...state.recapsDismissed, action.threshold]
      };
    }
    case "hydrate":
      return action.state;
    case "reset":
      return EMPTY_STATE;
  }
}

function isWalkState(value: unknown): value is WalkState {
  if (typeof value !== "object" || value === null) return false;
  const v = value as {
    visited?: unknown;
    recapsDismissed?: unknown;
    lastSpecimenId?: unknown;
  };
  const visitedOk =
    Array.isArray(v.visited) && v.visited.every((s) => typeof s === "string");
  const recapsOk =
    Array.isArray(v.recapsDismissed) &&
    v.recapsDismissed.every((n) => typeof n === "number" && Number.isFinite(n));
  /* lastSpecimenId is optional in older snapshots: tolerate missing or
     null, otherwise require a string. */
  const lastOk =
    v.lastSpecimenId === undefined ||
    v.lastSpecimenId === null ||
    typeof v.lastSpecimenId === "string";
  return visitedOk && recapsOk && lastOk;
}

export type WalkController = {
  state: WalkState;
  visit: (specimenId: string) => void;
  dismissRecap: (threshold: number) => void;
  reset: () => void;
};

/* Hook that wires the reducer to optional localStorage persistence. The
   visited set hydrates from storage only when settings.remember is true.
   When the user toggles remember off, the storage layer's clearAll() runs
   from settings.ts; this hook reacts by resetting in-memory state. */
export function useWalkController(): WalkController {
  const { settings } = useSettings();
  const [state, dispatch] = useReducer(reducer, EMPTY_STATE);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (!settings.remember) {
      if (hydratedRef.current) {
        dispatch({ type: "reset" });
        hydratedRef.current = false;
      }
      return;
    }
    const stored = readJSON<unknown>(WALK_STATE_KEY, EMPTY_STATE);
    if (isWalkState(stored)) {
      dispatch({ type: "hydrate", state: stored });
    }
    hydratedRef.current = true;
  }, [settings.remember]);

  useEffect(() => {
    if (!settings.remember) return;
    if (state === EMPTY_STATE) {
      remove(WALK_STATE_KEY);
      return;
    }
    writeJSON<WalkState>(WALK_STATE_KEY, state);
  }, [settings.remember, state]);

  const visit = useCallback((specimenId: string) => {
    dispatch({ type: "visit", specimenId });
  }, []);

  const dismissRecap = useCallback((threshold: number) => {
    dispatch({ type: "dismiss_recap", threshold });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "reset" });
  }, []);

  return { state, visit, dismissRecap, reset };
}

/* Helpers used by the rail map and recap interstitials. */

export function visitedPatterns(
  state: WalkState,
  specimensById: Record<string, { pattern: string }>
): Set<string> {
  const set = new Set<string>();
  for (const id of state.visited) {
    const pattern = specimensById[id]?.pattern;
    if (pattern) set.add(pattern);
  }
  return set;
}

/* A pattern is "completed" when both of its examples have been visited.
   Used by the rail map to mark fully-explored pattern rows. */
export function completedPatterns(
  state: WalkState,
  specimensByPattern: Record<string, ReadonlyArray<string>>
): Set<string> {
  const set = new Set<string>();
  for (const [pattern, ids] of Object.entries(specimensByPattern)) {
    if (ids.every((id) => state.visited.includes(id))) {
      set.add(pattern);
    }
  }
  return set;
}

/* Returns the next threshold the visitor has just crossed and not yet
   dismissed, or null if no recap should appear. The threshold is "crossed"
   when the visited count is >= threshold and the most recently visited
   specimen sits at exactly that position in the canonical order. */
export function pendingRecap(
  state: WalkState,
  currentSpecimenIndex: number
): number | null {
  for (const threshold of recapThresholds) {
    if (state.recapsDismissed.includes(threshold)) continue;
    if (state.visited.length < threshold) continue;
    /* Recap fires when the visitor lands on the example just after the
       threshold position. Position is 1-indexed externally; index is
       0-indexed here, so position N is index N - 1, and "the example
       after position N" is index N (i.e., currentSpecimenIndex === N). */
    if (currentSpecimenIndex === threshold) {
      return threshold;
    }
  }
  return null;
}
