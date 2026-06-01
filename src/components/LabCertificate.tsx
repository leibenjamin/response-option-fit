import { useMemo, useState } from "react";
import { useProgress } from "../lib/progress";
import {
  buildCertificateMarkdown,
  buildCertificateSvg,
  certificateCode
} from "../lib/certificate";

/* The closing payoff: a self-issued certificate the visitor can keep once they
   have worked through all twelve exercises. It is gated on real completion
   (every exercise reveals its receipt -> progress), and it is deliberately
   framed as a keepsake, not an accredited credential — the same honesty posture
   the rest of the lab keeps. Two takeaways: a copy-paste Markdown version (the
   portable, zero-risk format) and a downloadable PNG (rendered client-side from
   a self-contained SVG, no dependency and no third-party request). A
   content-derived verification code ties the certificate to its date and
   coverage; it is a checksum, not a signature, and says so. The pure builders
   live in lib/certificate.ts so they can be unit-tested without React.

   Voice mined from the retired exit artifact: lead with what the holder can now
   DO and one durable habit, not flattery or "you are the X" tags. */

function triggerDownload(href: string, filename: string): void {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
}

function downloadPng(svg: string, filename: string, onError: () => void): void {
  try {
    /* A data-URL source (rather than a blob: URL) keeps the canvas origin-clean
       so toBlob() can read it back; a blob-URL SVG taints the canvas in some
       browsers and the export silently fails. The SVG is self-contained (pure
       shapes + text, system fonts, no external refs), so no taint either way. */
    const dataUrl =
      "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    const image = new Image();
    image.onload = () => {
      try {
        const scale = 2;
        const canvas = document.createElement("canvas");
        canvas.width = 1200 * scale;
        canvas.height = 848 * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          onError();
          return;
        }
        ctx.scale(scale, scale);
        ctx.drawImage(image, 0, 0);
        canvas.toBlob((png) => {
          if (!png) {
            onError();
            return;
          }
          const pngUrl = URL.createObjectURL(png);
          triggerDownload(pngUrl, filename);
          window.setTimeout(() => URL.revokeObjectURL(pngUrl), 0);
        }, "image/png");
      } catch {
        onError();
      }
    };
    image.onerror = () => onError();
    image.src = dataUrl;
  } catch {
    onError();
  }
}

export function LabCertificate() {
  const { count, total, allComplete } = useProgress();
  const [status, setStatus] = useState<string | null>(null);

  const today = useMemo(() => new Date(), []);
  const dateLabel = useMemo(
    () =>
      today.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
      }),
    [today]
  );
  const code = useMemo(() => {
    const iso = today.toISOString().slice(0, 10);
    return certificateCode(iso, count, total);
  }, [today, count, total]);

  const pct = Math.round((count / total) * 100);

  const handleCopy = async () => {
    const md = buildCertificateMarkdown(count, total, dateLabel, code);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(md);
        setStatus("Markdown certificate copied to your clipboard.");
        return;
      }
      throw new Error("no clipboard");
    } catch {
      /* Fallback: hand the visitor a file they can keep, since copy failed. */
      const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      triggerDownload(url, `response-option-fit-certificate-${code}.md`);
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
      setStatus("Clipboard was unavailable, so the Markdown was downloaded instead.");
    }
  };

  const handlePng = () => {
    const svg = buildCertificateSvg(count, total, dateLabel, code);
    downloadPng(svg, `response-option-fit-certificate-${code}.png`, () =>
      setStatus("Could not render the PNG in this browser; try Copy as Markdown.")
    );
    setStatus("Certificate PNG downloaded.");
  };

  return (
    <section
      className="lab-cert"
      aria-labelledby="lab-cert-title"
      data-testid="lab-cert"
    >
      <p className="lab-cert-eyebrow">The takeaway</p>
      <h3 className="lab-cert-title" id="lab-cert-title">
        {allComplete
          ? "You worked through all twelve. Take your certificate."
          : "Finish the set to claim your certificate."}
      </h3>

      <div className="lab-cert-progress" data-testid="lab-cert-progress">
        <div
          className="lab-cert-bar"
          role="progressbar"
          aria-label="Exercises practiced"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={count}
          aria-valuetext={`${count} of ${total} exercises practiced`}
        >
          <span className="lab-cert-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        {/* aria-hidden: the progressbar above already conveys this to a screen
            reader, so the visible count would otherwise be read twice. */}
        <p className="lab-cert-count" aria-hidden="true">
          <strong data-testid="lab-cert-count">{count}</strong> of {total}{" "}
          exercises practiced
        </p>
      </div>

      {allComplete ? (
        <>
          <p className="lab-cert-blurb lab-selectable">
            A keepsake for finishing the lab — your coverage, the things you can
            now say without bluffing, the sources, and the date. It is
            self-issued, not an accredited credential; the verification code is a
            checksum of the contents, not a signature.
          </p>
          <div className="lab-cert-actions">
            <button
              type="button"
              className="lab-cert-button"
              data-testid="lab-cert-copy"
              onClick={handleCopy}
            >
              Copy as Markdown
            </button>
            <button
              type="button"
              className="lab-cert-button"
              data-testid="lab-cert-png"
              onClick={handlePng}
            >
              Download PNG
            </button>
          </div>
        </>
      ) : (
        <p className="lab-cert-blurb lab-cert-blurb--locked lab-selectable">
          Solve each exercise above — every one you finish reveals its receipt
          and counts here. Once all {total} are done, your certificate unlocks
          with your coverage, takeaways, and sources.
        </p>
      )}

      {status && (
        <p
          className="lab-cert-status"
          role="status"
          aria-live="polite"
          data-testid="lab-cert-status"
        >
          {status}
        </p>
      )}
    </section>
  );
}
