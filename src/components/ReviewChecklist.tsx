import { useState } from "react";
import { buildReviewChecklistMarkdown } from "../lib/certificate";

/* The ungated sibling of the completion certificate: the four inspection passes,
   the credentialing facts, and the further reading, as a Markdown checklist the
   visitor can paste into their own survey-review notes. The certificate is the
   gated personal keepsake; this is the reusable reference, available to anyone
   who reaches the closing map. Copy-to-clipboard with a download fallback,
   mirroring the certificate's side-effect handling. It is a plain div (not a
   landmark region) so it adds a heading without multiplying landmarks. */

function triggerDownload(href: string, filename: string): void {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
}

export function ReviewChecklist() {
  const [status, setStatus] = useState<string | null>(null);

  const handleCopy = async () => {
    const md = buildReviewChecklistMarkdown();
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(md);
        setStatus("Review checklist copied to your clipboard.");
        return;
      }
      throw new Error("no clipboard");
    } catch {
      /* Fallback: hand the visitor a file, since copy was unavailable. */
      const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      triggerDownload(url, "response-option-review-checklist.md");
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
      setStatus("Clipboard was unavailable, so the checklist was downloaded instead.");
    }
  };

  return (
    <div className="lab-cert lab-km-takeaway" data-testid="lab-checklist">
      <p className="lab-cert-eyebrow">Take it with you</p>
      <h3 className="lab-cert-title" id="lab-checklist-title">
        A review checklist for your own surveys
      </h3>
      <p className="lab-cert-blurb lab-selectable">
        The four passes, the things you can say without bluffing, and the further
        reading — as a Markdown checklist to paste into your notes or a review
        doc. It is built in your browser; nothing is sent anywhere.
      </p>
      <div className="lab-cert-actions">
        <button
          type="button"
          className="lab-cert-button"
          data-testid="lab-checklist-copy"
          onClick={handleCopy}
        >
          Copy review checklist
        </button>
      </div>
      {status && (
        <p
          className="lab-cert-status"
          role="status"
          aria-live="polite"
          data-testid="lab-checklist-status"
        >
          {status}
        </p>
      )}
    </div>
  );
}
