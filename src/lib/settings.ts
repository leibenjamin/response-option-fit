import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { clearAll, readJSON, writeJSON } from "./storage";

export type Settings = {
  remember: boolean;
};

const DEFAULT_SETTINGS: Settings = { remember: false };
const SETTINGS_KEY = "settings";
const STORAGE_CHANGE_EVENT = "rofl-storage-change";

type SettingsContextValue = {
  settings: Settings;
  setRemember: (value: boolean) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

function readSettings(): Settings {
  const stored = readJSON<unknown>(SETTINGS_KEY, DEFAULT_SETTINGS);
  if (
    typeof stored === "object" &&
    stored !== null &&
    !Array.isArray(stored) &&
    typeof (stored as { remember?: unknown }).remember === "boolean"
  ) {
    return { remember: (stored as { remember: boolean }).remember };
  }
  return DEFAULT_SETTINGS;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(readSettings);

  const syncSettings = useCallback(() => {
    setSettings(readSettings());
  }, []);

  const setRemember = useCallback((value: boolean) => {
    if (value) {
      const next = { remember: true };
      if (writeJSON<Settings>(SETTINGS_KEY, next)) {
        setSettings(next);
      }
      return;
    }

    // "Stop remembering me" should leave no rofl:v1:* keys behind.
    clearAll();
    setSettings(DEFAULT_SETTINGS);
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== null && !event.key.startsWith("rofl:v1:")) return;
      syncSettings();
    };
    const onLocalChange = () => syncSettings();

    window.addEventListener("storage", onStorage);
    window.addEventListener(STORAGE_CHANGE_EVENT, onLocalChange);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(STORAGE_CHANGE_EVENT, onLocalChange);
    };
  }, [syncSettings]);

  const value = useMemo<SettingsContextValue>(
    () => ({ settings, setRemember }),
    [settings, setRemember]
  );

  return createElement(SettingsContext.Provider, { value }, children);
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
}
