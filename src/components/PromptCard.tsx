import { useState } from "react";
import type { PromptCard as PromptCardData } from "../data/field-guide-route";

type Props = {
  card: PromptCardData;
};

export function PromptCard({ card }: Props) {
  const [status, setStatus] = useState("");

  const handleCopy = () => {
    const clipboard = window.navigator.clipboard;
    if (!clipboard || card.prompt === "") {
      setStatus("Copy unavailable; select the prompt text.");
      return;
    }

    clipboard
      .writeText(card.prompt)
      .then(() => setStatus("Prompt copied."))
      .catch(() => setStatus("Copy unavailable; select the prompt text."));
  };

  return (
    <article className="prompt-card" data-testid={`prompt-card-${card.id}`}>
      <header className="prompt-card-head">
        <div>
          <p className="prompt-card-eyebrow">Prompt</p>
          <h3 className="prompt-card-title">{card.title}</h3>
          <p className="prompt-card-purpose">{card.purpose}</p>
        </div>
        <button
          type="button"
          className="prompt-copy-button"
          data-testid={`prompt-copy-${card.id}`}
          onClick={handleCopy}
        >
          Copy prompt
        </button>
      </header>
      <details className="prompt-details">
        <summary>Show prompt text</summary>
        <pre className="prompt-text">{card.prompt}</pre>
      </details>
      <p
        className="prompt-copy-status"
        role="status"
        aria-live="polite"
        data-testid={`prompt-status-${card.id}`}
      >
        {status}
      </p>
    </article>
  );
}
