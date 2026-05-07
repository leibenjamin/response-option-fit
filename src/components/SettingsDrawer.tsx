import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent
} from "react";
import {
  clearAll,
  exportSnapshot,
  importSnapshot,
  listAll
} from "../lib/storage";
import { useSettings } from "../lib/settings";

type Props = {
  open: boolean;
  onClose: () => void;
};

type Status = {
  kind: "success" | "error" | "neutral";
  message: string;
};

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])"
].join(",");

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    .filter((element) => element.getClientRects().length > 0);
}

function supportsNativeDialog(): boolean {
  return (
    typeof HTMLDialogElement !== "undefined" &&
    typeof HTMLDialogElement.prototype.showModal === "function"
  );
}

export function SettingsDrawer({ open, onClose }: Props) {
  const { settings, setRemember } = useSettings();
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const canUseNativeDialog = supportsNativeDialog();
  const [storageRevision, setStorageRevision] = useState(0);
  const [status, setStatus] = useState<Status | null>(null);
  const [confirmingClear, setConfirmingClear] = useState(false);

  const refreshStorageView = useCallback(() => {
    setStorageRevision((revision) => revision + 1);
  }, []);

  useEffect(() => {
    if (!canUseNativeDialog) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      try {
        dialog.showModal();
      } catch {
      }
    }

    if (!open && dialog.open) {
      try {
        dialog.close();
      } catch {
      }
    }
  }, [canUseNativeDialog, open]);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    window.setTimeout(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const first = getFocusable(panel)[0];
      first?.focus();
    }, 0);

    return () => {
      previousFocusRef.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };

    dialog.addEventListener("cancel", onCancel);
    return () => dialog.removeEventListener("cancel", onCancel);
  }, [onClose]);

  useEffect(() => {
    const onStorageChange = () => refreshStorageView();
    window.addEventListener("rofl-storage-change", onStorageChange);
    return () => window.removeEventListener("rofl-storage-change", onStorageChange);
  }, [refreshStorageView]);

  const stored = useMemo(
    () => listAll(),
    [open, settings.remember, storageRevision]
  );
  const storedJSON = useMemo(() => JSON.stringify(stored, null, 2), [stored]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDialogElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !open) return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = getFocusable(panel);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose, open]
  );

  const handleRememberChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConfirmingClear(false);
    setStatus(null);
    setRemember(event.currentTarget.checked);
    refreshStorageView();
  };

  const handleExport = () => {
    setConfirmingClear(false);
    try {
      const snapshot = exportSnapshot();
      const json = JSON.stringify(snapshot, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `rofl-local-data-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
      setStatus({ kind: "success", message: "Stored data export prepared locally." });
    } catch {
      setStatus({ kind: "error", message: "Could not export stored data from this browser." });
    }
  };

  const handleImportButton = () => {
    setConfirmingClear(false);
    fileInputRef.current?.click();
  };

  const handleImportFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = typeof reader.result === "string" ? reader.result : "";
        const parsed: unknown = JSON.parse(text);
        const result = importSnapshot(parsed);
        if (result.ok) {
          setStatus({ kind: "success", message: "Stored data imported locally." });
          refreshStorageView();
        } else {
          setStatus({ kind: "error", message: result.reason });
        }
      } catch {
        setStatus({ kind: "error", message: "Could not parse this JSON file." });
      } finally {
        event.currentTarget.value = "";
      }
    };
    reader.onerror = () => {
      setStatus({ kind: "error", message: "Could not read this file." });
      event.currentTarget.value = "";
    };
    reader.readAsText(file);
  };

  const handleClearRequest = () => {
    setStatus(null);
    setConfirmingClear(true);
  };

  const handleClearConfirm = () => {
    clearAll();
    setConfirmingClear(false);
    setStatus({ kind: "success", message: "Stored local data cleared." });
    refreshStorageView();
  };

  if (!canUseNativeDialog && !open) return null;

  return (
    <dialog
      ref={dialogRef}
      className="settings-drawer"
      data-testid="settings-drawer"
      aria-labelledby="settings-drawer-title"
      aria-modal="true"
      open={canUseNativeDialog ? undefined : true}
      onKeyDown={handleKeyDown}
    >
      <div className="settings-drawer-panel" ref={panelRef}>
        <header className="settings-drawer-head">
          <p className="settings-drawer-eyebrow">Local device</p>
          <h2 className="settings-drawer-title" id="settings-drawer-title">
            Settings
          </h2>
          <button
            type="button"
            className="settings-drawer-close"
            aria-label="Close settings"
            data-testid="settings-close"
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <section className="settings-section">
          <p className="settings-section-eyebrow">Persistence</p>
          <label className="settings-toggle">
            <input
              type="checkbox"
              checked={settings.remember}
              onChange={handleRememberChange}
              data-testid="settings-remember"
            />
            <span className="settings-toggle-track" aria-hidden="true">
              <span className="settings-toggle-thumb" />
            </span>
            <span className="settings-toggle-body">
              <span className="settings-toggle-label">
                Remember local settings on this device
              </span>
              <span className="settings-toggle-sub">
                Stores this settings choice and the names of examples you've
                opened in walk mode, so the knowledge map fills in across
                visits. Removed when you turn this off or clear stored data.
              </span>
            </span>
          </label>
        </section>

        <section className="settings-section">
          <p className="settings-section-eyebrow">Manage</p>
          <div className="settings-actions">
            <button
              type="button"
              className="settings-action"
              data-testid="settings-export"
              onClick={handleExport}
            >
              Export stored data (.json)
            </button>
            <button
              type="button"
              className="settings-action"
              data-testid="settings-import"
              onClick={handleImportButton}
            >
              Import stored data (.json)
            </button>
            <button
              type="button"
              className="settings-action"
              data-testid="settings-clear"
              onClick={handleClearRequest}
            >
              Clear stored local data
            </button>
          </div>
          <input
            ref={fileInputRef}
            className="settings-file-input"
            type="file"
            accept="application/json"
            aria-label="Import stored data JSON file"
            data-testid="settings-import-input"
            onChange={handleImportFile}
          />
          {confirmingClear ? (
            <div className="settings-confirm" data-testid="settings-clear-confirm">
              <p className="settings-confirm-text">Clear all stored local data from this browser?</p>
              <div className="settings-confirm-actions">
                <button
                  type="button"
                  className="settings-action"
                  onClick={handleClearConfirm}
                >
                  Confirm clear
                </button>
                <button
                  type="button"
                  className="settings-action"
                  onClick={() => setConfirmingClear(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}
          {status ? (
            <p
              className={`settings-status settings-status--${status.kind}`}
              role={status.kind === "error" ? "alert" : "status"}
              data-testid="settings-status"
            >
              {status.message}
            </p>
          ) : null}
        </section>

        <section className="settings-section">
          <p className="settings-section-eyebrow">
            Stored on this device — read-only view
          </p>
          <pre
            className="settings-storage"
            data-testid="settings-storage"
            aria-live="polite"
          >
            {storedJSON}
          </pre>
        </section>
      </div>
    </dialog>
  );
}
