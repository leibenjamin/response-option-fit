import {
  useCallback,
  useEffect,
  useRef,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent
} from "react";
import { PatternCatalog } from "./PatternCatalog";

/* The six-pattern map, presented as an off-scroll modal so it no longer
   occupies the hub's vertical space as a wall of taxonomy. Mechanics mirror
   SettingsDrawer: a native <dialog> with showModal(), a focus trap, Escape
   via the cancel event, and previous-focus restore on close. The panel is a
   centered modal rather than a right-edge drawer. */

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])"
].join(",");

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  ).filter((element) => element.getClientRects().length > 0);
}

function supportsNativeDialog(): boolean {
  return (
    typeof HTMLDialogElement !== "undefined" &&
    typeof HTMLDialogElement.prototype.showModal === "function"
  );
}

type Props = {
  open: boolean;
  onClose: () => void;
  visited: ReadonlySet<string>;
};

export function PatternMapDialog({ open, onClose, visited }: Props) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const canUseNativeDialog = supportsNativeDialog();

  useEffect(() => {
    if (!canUseNativeDialog) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      try {
        dialog.showModal();
      } catch {
        /* showModal throws if already open; the open check guards it. */
      }
    }
    if (!open && dialog.open) {
      try {
        dialog.close();
      } catch {
        /* close is a no-op on an already-closed dialog. */
      }
    }
  }, [canUseNativeDialog, open]);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    window.setTimeout(() => {
      const panel = panelRef.current;
      if (!panel) return;
      getFocusable(panel)[0]?.focus();
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

  /* A click whose target is the dialog element itself (not the panel or
     anything inside it) is a backdrop click — dismiss. */
  const handleClick = useCallback(
    (event: ReactMouseEvent<HTMLDialogElement>) => {
      if (event.target === dialogRef.current) onClose();
    },
    [onClose]
  );

  if (!canUseNativeDialog && !open) return null;

  return (
    <dialog
      ref={dialogRef}
      className="pattern-map-dialog"
      data-testid="pattern-map-dialog"
      aria-labelledby="pattern-map-dialog-title"
      aria-modal="true"
      open={canUseNativeDialog ? undefined : true}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
    >
      <div className="pattern-map-dialog-panel" ref={panelRef}>
        <header className="pattern-map-dialog-head">
          <p className="pattern-map-dialog-eyebrow">The map</p>
          <h2
            className="pattern-map-dialog-title"
            id="pattern-map-dialog-title"
          >
            Six recurring answer-choice problems
          </h2>
          <p className="pattern-map-dialog-lede">
            Every one of the twelve worked examples is a turn on one of these
            six. Open an example from any card.
          </p>
          <button
            type="button"
            className="pattern-map-dialog-close"
            aria-label="Close the six-pattern map"
            data-testid="pattern-map-close"
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className="pattern-map-dialog-body">
          <PatternCatalog variant="full" visited={visited} showHeader={false} />
        </div>
      </div>
    </dialog>
  );
}
