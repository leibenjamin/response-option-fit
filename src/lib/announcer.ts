import { createElement, useEffect, useRef, useState, type ReactElement } from "react";

export const LEXICON = {
  added: "{thing} added.",
  removed: "{thing} removed.",
  movedUp: "{thing} moved up to position {n} of {N}.",
  movedDown: "{thing} moved down to position {n} of {N}.",
  toggledOn: "{setting} turned on.",
  toggledOff: "{setting} turned off.",
  split: "Split inserted between {A} and {B}.",
  unsplit: "Split removed between {A} and {B}.",
  window: "Time window set to: {label}.",
  selected: "Classifier selected: {feature}."
} as const;

type AnnouncerMessageParts = Record<string, string | number>;

export type Announcer = {
  status: ReactElement;
  added: (thing: string) => void;
  removed: (thing: string) => void;
  movedUp: (thing: string, n: number, total: number) => void;
  movedDown: (thing: string, n: number, total: number) => void;
  toggledOn: (setting: string) => void;
  toggledOff: (setting: string) => void;
  split: (a: string, b: string) => void;
  unsplit: (a: string, b: string) => void;
  window: (label: string) => void;
  selected: (feature: string) => void;
};

function format(template: string, parts: AnnouncerMessageParts): string {
  return Object.entries(parts).reduce(
    (message, [key, value]) => message.replace(`{${key}}`, String(value)),
    template
  );
}

export function useAnnouncer(): Announcer {
  const [message, setMessage] = useState("");
  const pendingTimer = useRef<number | null>(null);

  // ARIA polite live regions only announce when textContent visibly changes.
  // Identical successive messages would otherwise be silently dropped by the
  // screen reader, so each announcement clears the region synchronously and
  // re-sets the new text on the next macrotask. Any in-flight announcement
  // is cancelled to avoid stale text overwriting a newer one.
  const announce = (text: string) => {
    if (pendingTimer.current !== null) {
      clearTimeout(pendingTimer.current);
    }
    setMessage("");
    pendingTimer.current = window.setTimeout(() => {
      setMessage(text);
      pendingTimer.current = null;
    }, 0);
  };

  useEffect(() => {
    return () => {
      if (pendingTimer.current !== null) {
        clearTimeout(pendingTimer.current);
      }
    };
  }, []);

  return {
    status: createElement(
      "div",
      {
        className: "widget-live sr-only",
        role: "status",
        "aria-live": "polite",
        "aria-atomic": "true"
      },
      message
    ),
    added: (thing) => announce(format(LEXICON.added, { thing })),
    removed: (thing) => announce(format(LEXICON.removed, { thing })),
    movedUp: (thing, n, total) =>
      announce(format(LEXICON.movedUp, { thing, n, N: total })),
    movedDown: (thing, n, total) =>
      announce(format(LEXICON.movedDown, { thing, n, N: total })),
    toggledOn: (setting) => announce(format(LEXICON.toggledOn, { setting })),
    toggledOff: (setting) => announce(format(LEXICON.toggledOff, { setting })),
    split: (A, B) => announce(format(LEXICON.split, { A, B })),
    unsplit: (A, B) => announce(format(LEXICON.unsplit, { A, B })),
    window: (label) => announce(format(LEXICON.window, { label })),
    selected: (feature) => announce(format(LEXICON.selected, { feature }))
  };
}
