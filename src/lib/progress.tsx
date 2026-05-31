import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { readJSON, remove, writeJSON } from "./storage";
import { useSettings } from "./settings";

/* Per-exercise completion progress for the lab.

   Completion is signalled by the shared PostReceipt component (every exercise
   reveals its receipt when solved), so all twelve exercises feed this one store.
   Progress is always tracked in memory; it is persisted to localStorage only
   when the visitor has opted in via the Settings "Remember" toggle, matching the
   same consent model as settings.ts (turning Remember off clears every
   rofl:v1:* key). It drives the contents-rail ticks and the completion
   certificate at the closing map. */

const PROGRESS_KEY = "progress"; // stored as rofl:v1:progress

/* The internal data ids, in display order. Completion is keyed by data id
   (what PostReceipt passes), which intentionally differs from display number. */
export const LAB_EXERCISE_IDS = [
  "E1",
  "E2",
  "E8",
  "E3",
  "E4",
  "E9",
  "E6",
  "E7",
  "E10",
  "E11",
  "E12",
  "E5"
] as const;

export const TOTAL_EXERCISES = LAB_EXERCISE_IDS.length;

const KNOWN_IDS: ReadonlySet<string> = new Set(LAB_EXERCISE_IDS);

type StoredProgress = { completed: string[] };

function readStoredCompleted(): string[] {
  const stored = readJSON<StoredProgress>(PROGRESS_KEY, { completed: [] });
  if (
    stored &&
    typeof stored === "object" &&
    Array.isArray((stored as StoredProgress).completed)
  ) {
    return (stored as StoredProgress).completed.filter((id) => KNOWN_IDS.has(id));
  }
  return [];
}

type ProgressContextValue = {
  completed: ReadonlySet<string>;
  count: number;
  total: number;
  allComplete: boolean;
  markComplete: (id: string) => void;
  reset: () => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings();
  const remember = settings.remember;

  const [completed, setCompleted] = useState<Set<string>>(() =>
    remember ? new Set(readStoredCompleted()) : new Set()
  );

  const markComplete = useCallback((id: string) => {
    if (!KNOWN_IDS.has(id)) return;
    setCompleted((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const reset = useCallback(() => setCompleted(new Set()), []);

  /* Persist whenever progress changes and Remember is on; otherwise make sure
     no progress key lingers (turning Remember off in settings already clears
     everything; this is a defensive mirror). */
  useEffect(() => {
    if (remember) {
      writeJSON<StoredProgress>(PROGRESS_KEY, { completed: [...completed] });
    } else {
      remove(PROGRESS_KEY);
    }
  }, [remember, completed]);

  const value = useMemo<ProgressContextValue>(() => {
    const count = LAB_EXERCISE_IDS.filter((id) => completed.has(id)).length;
    return {
      completed,
      count,
      total: TOTAL_EXERCISES,
      allComplete: count >= TOTAL_EXERCISES,
      markComplete,
      reset
    };
  }, [completed, markComplete, reset]);

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within ProgressProvider");
  }
  return context;
}
