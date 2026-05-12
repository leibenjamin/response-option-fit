const PREFIX = "rofl:v1:";
const SCHEMA_VERSION = 1 as const;
const STORAGE_CHANGE_EVENT = "rofl-storage-change";
const SETTINGS_STORAGE_KEY = `${PREFIX}settings`;
const WALK_STATE_STORAGE_KEY = `${PREFIX}walk-state`;
const PRACTICE_STATE_STORAGE_KEY = `${PREFIX}practice-state`;

export type Snapshot = {
  schemaVersion: typeof SCHEMA_VERSION;
  capturedAt: string;
  data: Record<string, unknown>;
};

export type ImportResult = { ok: true } | { ok: false; reason: string };

function storage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

function prefixedKey(key: string): string {
  return key.startsWith(PREFIX) ? key : `${PREFIX}${key}`;
}

function notifyStorageChange(): void {
  try {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new Event(STORAGE_CHANGE_EVENT));
  } catch {
  }
}

function prefixedKeys(store: Storage): string[] {
  const keys: string[] = [];
  for (let i = 0; i < store.length; i++) {
    const key = store.key(i);
    if (key?.startsWith(PREFIX)) keys.push(key);
  }
  return keys;
}

function clearAllFrom(store: Storage): void {
  for (const key of prefixedKeys(store)) {
    store.removeItem(key);
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function isJSONValue(value: unknown, seen = new Set<object>()): boolean {
  if (value === null) return true;

  const kind = typeof value;
  if (kind === "string" || kind === "boolean") return true;
  if (kind === "number") return Number.isFinite(value);
  if (kind !== "object") return false;

  const objectValue = value as object;
  if (seen.has(objectValue)) return false;
  seen.add(objectValue);

  if (Array.isArray(value)) {
    return value.every((item) => isJSONValue(item, seen));
  }

  if (!isPlainObject(value)) return false;
  return Object.values(value).every((item) => isJSONValue(item, seen));
}

function serializeJSON(value: unknown): string | null {
  if (!isJSONValue(value)) return null;
  try {
    const serialized = JSON.stringify(value);
    return serialized === undefined ? null : serialized;
  } catch {
    return null;
  }
}

function validateSnapshotEntry(key: string, value: unknown): string | null {
  if (key === SETTINGS_STORAGE_KEY) {
    if (
      !isPlainObject(value) ||
      typeof (value as { remember?: unknown }).remember !== "boolean"
    ) {
      return `Snapshot value for "${SETTINGS_STORAGE_KEY}" must be an object with a boolean remember field.`;
    }
    return null;
  }

  if (key === WALK_STATE_STORAGE_KEY) {
    if (!isPlainObject(value)) {
      return `Snapshot value for "${WALK_STATE_STORAGE_KEY}" must be an object.`;
    }
    const v = value as {
      visited?: unknown;
      recapsDismissed?: unknown;
      lastSpecimenId?: unknown;
    };
    const visitedOk =
      Array.isArray(v.visited) &&
      v.visited.every((s) => typeof s === "string");
    const recapsOk =
      Array.isArray(v.recapsDismissed) &&
      v.recapsDismissed.every(
        (n) => typeof n === "number" && Number.isFinite(n)
      );
    /* lastSpecimenId is optional and tolerates missing/null for snapshots
       written by a build that pre-dates this field. */
    const lastOk =
      v.lastSpecimenId === undefined ||
      v.lastSpecimenId === null ||
      typeof v.lastSpecimenId === "string";
    if (!visitedOk || !recapsOk || !lastOk) {
      return `Snapshot value for "${WALK_STATE_STORAGE_KEY}" must have string-array "visited", number-array "recapsDismissed", and optional string "lastSpecimenId".`;
    }
    return null;
  }

  if (key === PRACTICE_STATE_STORAGE_KEY) {
    if (!isPlainObject(value)) {
      return `Snapshot value for "${PRACTICE_STATE_STORAGE_KEY}" must be an object.`;
    }
    const specimens = (value as { specimens?: unknown }).specimens;
    if (!isPlainObject(specimens)) {
      return `Snapshot value for "${PRACTICE_STATE_STORAGE_KEY}" must have an object "specimens" field.`;
    }

    const outcomes = new Set(["covered", "ambiguous", "not_covered"]);
    const confidences = new Set(["guessing", "hunch", "fairly_sure"]);
    const outcomeMapOk = (map: unknown) =>
      isPlainObject(map) &&
      Object.values(map).every(
        (entry) => typeof entry === "string" && outcomes.has(entry)
      );
    const numberMapOk = (map: unknown) =>
      isPlainObject(map) &&
      Object.values(map).every(
        (entry) => Number.isInteger(entry) && (entry as number) >= 0
      );
    const booleanMapOk = (map: unknown) =>
      isPlainObject(map) &&
      Object.values(map).every((entry) => typeof entry === "boolean");

    for (const record of Object.values(specimens)) {
      if (!isPlainObject(record)) {
        return `Snapshot value for "${PRACTICE_STATE_STORAGE_KEY}" must contain specimen objects.`;
      }
      const r = record as { caseLab?: unknown; legacy?: unknown };
      if (r.caseLab !== undefined) {
        if (!isPlainObject(r.caseLab)) {
          return `Snapshot value for "${PRACTICE_STATE_STORAGE_KEY}" has an invalid caseLab record.`;
        }
        const c = r.caseLab as {
          scenarioAnswers?: unknown;
          selectedRepairId?: unknown;
          repairBenchSeen?: unknown;
          transferAnswer?: unknown;
        };
        const caseLabOk =
          (c.scenarioAnswers === undefined || outcomeMapOk(c.scenarioAnswers)) &&
          (c.selectedRepairId === undefined ||
            typeof c.selectedRepairId === "string") &&
          (c.repairBenchSeen === undefined ||
            typeof c.repairBenchSeen === "boolean") &&
          (c.transferAnswer === undefined ||
            (typeof c.transferAnswer === "string" &&
              outcomes.has(c.transferAnswer)));
        if (!caseLabOk) {
          return `Snapshot value for "${PRACTICE_STATE_STORAGE_KEY}" has an invalid caseLab record.`;
        }
      }
      if (r.legacy !== undefined) {
        if (!isPlainObject(r.legacy)) {
          return `Snapshot value for "${PRACTICE_STATE_STORAGE_KEY}" has an invalid legacy record.`;
        }
        const l = r.legacy as {
          predictions?: unknown;
          confidence?: unknown;
          mechanismChoiceId?: unknown;
          predictionSubmitted?: unknown;
          revealedNeighborContrast?: unknown;
          microCaseAnswers?: unknown;
          microCaseSubmitted?: unknown;
        };
        const legacyOk =
          (l.predictions === undefined || outcomeMapOk(l.predictions)) &&
          (l.confidence === undefined ||
            (typeof l.confidence === "string" && confidences.has(l.confidence))) &&
          (l.mechanismChoiceId === undefined ||
            typeof l.mechanismChoiceId === "string") &&
          (l.predictionSubmitted === undefined ||
            typeof l.predictionSubmitted === "boolean") &&
          (l.revealedNeighborContrast === undefined ||
            typeof l.revealedNeighborContrast === "boolean") &&
          (l.microCaseAnswers === undefined ||
            numberMapOk(l.microCaseAnswers)) &&
          (l.microCaseSubmitted === undefined ||
            booleanMapOk(l.microCaseSubmitted));
        if (!legacyOk) {
          return `Snapshot value for "${PRACTICE_STATE_STORAGE_KEY}" has an invalid legacy record.`;
        }
      }
    }

    return null;
  }

  return `Snapshot key "${key}" is not recognized by this release.`;
}

export function isAvailable(): boolean {
  const store = storage();
  if (!store) return false;

  try {
    const probe = `${PREFIX}__probe__`;
    store.setItem(probe, "1");
    store.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

export function readJSON<T>(key: string, fallback: T): T {
  const store = storage();
  if (!store) return fallback;

  try {
    const raw = store.getItem(prefixedKey(key));
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): boolean {
  const store = storage();
  if (!store) return false;

  try {
    const serialized = serializeJSON(value);
    if (serialized === null) return false;
    store.setItem(prefixedKey(key), serialized);
    notifyStorageChange();
    return true;
  } catch {
    return false;
  }
}

export function remove(key: string): void {
  const store = storage();
  if (!store) return;

  try {
    store.removeItem(prefixedKey(key));
    notifyStorageChange();
  } catch {
  }
}

export function listAll(): Array<{ key: string; value: unknown }> {
  const store = storage();
  if (!store) return [];

  try {
    return prefixedKeys(store)
      .map((key) => {
        const raw = store.getItem(key);
        if (raw === null) return { key, value: null };
        try {
          return { key, value: JSON.parse(raw) as unknown };
        } catch {
          return { key, value: raw };
        }
      })
      .sort((a, b) => a.key.localeCompare(b.key));
  } catch {
    return [];
  }
}

export function clearAll(): void {
  const store = storage();
  if (!store) return;

  try {
    clearAllFrom(store);
    notifyStorageChange();
  } catch {
  }
}

export function exportSnapshot(): Snapshot {
  const data: Record<string, unknown> = {};
  for (const { key, value } of listAll()) {
    data[key] = value;
  }

  return {
    schemaVersion: SCHEMA_VERSION,
    capturedAt: new Date().toISOString(),
    data
  };
}

export function importSnapshot(snapshot: unknown): ImportResult {
  if (!isPlainObject(snapshot)) {
    return { ok: false, reason: "File is not a JSON object." };
  }

  if (snapshot.schemaVersion !== SCHEMA_VERSION) {
    return { ok: false, reason: "Unsupported snapshot version. Expected schemaVersion 1." };
  }

  if (!isPlainObject(snapshot.data)) {
    return { ok: false, reason: "Snapshot data must be a plain object." };
  }

  const serialized: Array<{ key: string; value: string }> = [];
  for (const [key, value] of Object.entries(snapshot.data)) {
    if (!key.startsWith(PREFIX)) {
      return { ok: false, reason: `Snapshot key "${key}" is outside the rofl:v1: namespace.` };
    }

    const schemaError = validateSnapshotEntry(key, value);
    if (schemaError) {
      return { ok: false, reason: schemaError };
    }

    const encoded = serializeJSON(value);
    if (encoded === null) {
      return { ok: false, reason: `Snapshot value for "${key}" is not JSON-serializable.` };
    }
    serialized.push({ key, value: encoded });
  }

  const store = storage();
  if (!store) {
    return { ok: false, reason: "Local storage is not available in this browser." };
  }

  try {
    const backup = prefixedKeys(store).map((key) => ({
      key,
      value: store.getItem(key)
    }));

    const restore = () => {
      try {
        clearAllFrom(store);
        for (const item of backup) {
          if (item.value !== null) store.setItem(item.key, item.value);
        }
      } catch {
      }
    };

    clearAllFrom(store);
    for (const item of serialized) {
      try {
        store.setItem(item.key, item.value);
      } catch {
        restore();
        return { ok: false, reason: "Could not import stored data. Your browser may be out of storage space." };
      }
    }

    notifyStorageChange();
    return { ok: true };
  } catch {
    return { ok: false, reason: "Could not import stored data from this file." };
  }
}
