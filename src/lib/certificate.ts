import { credentialingFacts, furtherReading } from "../data/lab-exercises";

/* Pure builders for the completion certificate (no React, no DOM), so they can
   be unit-tested directly. The React component (LabCertificate) wires these to
   the UI and handles the clipboard / canvas / download side effects. */

export const LENSES: { key: string; gloss: string }[] = [
  { key: "SLOT", gloss: "does every real answer have a truthful place to go?" },
  { key: "RULER", gloss: "does the scale measure the intended distinction?" },
  { key: "PUSH", gloss: "does the format steer the answer?" },
  { key: "BOUNDARY", gloss: "what does inspecting the options not prove?" }
];

export const HABIT =
  "Before a question ships, check that the answer options can hold every real " +
  "answer — and that the scale, wording, and order are not quietly doing the choosing.";

/* A small, deterministic, NON-cryptographic content hash (cyrb53). It ties the
   code to the date + coverage so a randomly invented code will not match and a
   tampered date breaks it. It is not a signature — a static site has no secret
   key — and the certificate says exactly that. */
export function contentCode(input: string): string {
  let h1 = 0xdeadbeef ^ input.length;
  let h2 = 0x41c6ce57 ^ input.length;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const n = 4294967296 * (2097151 & h2) + (h1 >>> 0);
  const s = n.toString(36).toUpperCase().padStart(8, "0").slice(-8);
  return `ROF-${s.slice(0, 4)}-${s.slice(4, 8)}`;
}

export function certificateCode(
  dateISO: string,
  count: number,
  total: number
): string {
  return contentCode(`response-option-fit|v1|${dateISO}|${count}/${total}`);
}

export function buildCertificateMarkdown(
  count: number,
  total: number,
  dateLabel: string,
  code: string
): string {
  const complete = count >= total;
  const facts = credentialingFacts.map((f) => `- ${f.text}`).join("\n");
  const reading = furtherReading
    .map((r) => `- ${r.name} — ${r.what}`)
    .join("\n");
  const lenses = LENSES.map((l) => `- **${l.key}** — ${l.gloss}`).join("\n");
  return `# Response Option Fit Lab — Certificate of ${
    complete ? "Completion" : "Practice"
  }

Completed by: ______________________
Date: ${dateLabel}
Coverage: ${count} of ${total} exercises practiced

## The four inspection lenses I can now apply
${lenses}

## Things I can now say without bluffing
${facts}

## The habit to carry
${HABIT}

## Further reading
${reading}

---
Verification: ${code} — a checksum of this certificate's date and contents, not a cryptographic signature.
A self-issued keepsake from the Response Option Fit Lab (benlei.org/response-option-fit/), not an accredited credential.
`;
}

/* The ungated sibling of the certificate: the same four passes, credentialing
   facts, and reading, framed as a reusable review checklist (no name, date,
   coverage, or verification code — it is a reference to take, not a personal
   keepsake). Surfaced on the closing map to anyone, including visitors who have
   not finished all twelve. */
export function buildReviewChecklistMarkdown(): string {
  const facts = credentialingFacts.map((f) => `- ${f.text}`).join("\n");
  const reading = furtherReading
    .map((r) => `- ${r.name} — ${r.what}`)
    .join("\n");
  const lenses = LENSES.map((l) => `- **${l.key}** — ${l.gloss}`).join("\n");
  return `# Response-option review checklist

Four passes to run on a survey question before it ships — a take-home from the
Response Option Fit Lab.

## The four inspection passes
${lenses}

## The habit
${HABIT}

## Things you can say without bluffing
${facts}

## Further reading
${reading}

---
From the Response Option Fit Lab · benlei.org/response-option-fit/
`;
}

function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function buildCertificateSvg(
  count: number,
  total: number,
  dateLabel: string,
  code: string
): string {
  const complete = count >= total;
  const kind = complete ? "Certificate of Completion" : "Certificate of Practice";
  const coverage = complete
    ? "practicing all twelve exercises in how survey answer choices"
    : `practicing ${count} of ${total} exercises in how survey answer choices`;
  const lensRow = LENSES.map((l) => l.key).join("    ·    ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="848" viewBox="0 0 1200 848">
  <rect width="1200" height="848" fill="#f5f1ea"/>
  <rect x="24" y="24" width="1152" height="800" fill="none" stroke="#c9c2b1" stroke-width="2"/>
  <rect x="36" y="36" width="1128" height="776" fill="none" stroke="#b04a2f" stroke-width="1"/>
  <g font-family="'Iowan Old Style','Charter','Source Serif Pro',Georgia,serif" text-anchor="middle" fill="#14161a">
    <text x="600" y="132" font-family="'JetBrains Mono','IBM Plex Mono',monospace" font-size="17" letter-spacing="6" fill="#b04a2f">RESPONSE OPTION FIT LAB</text>
    <text x="600" y="208" font-size="54" font-weight="500">${esc(kind)}</text>
    <line x1="430" y1="244" x2="770" y2="244" stroke="#c9c2b1" stroke-width="1"/>
    <text x="600" y="306" font-size="23" font-style="italic" fill="#3a3a3a">This certifies that the holder worked through the lab,</text>
    <text x="600" y="342" font-size="23" font-style="italic" fill="#3a3a3a">${esc(coverage)}</text>
    <text x="600" y="378" font-size="23" font-style="italic" fill="#3a3a3a">can quietly fail before analysis begins.</text>
    <text x="600" y="470" font-family="'JetBrains Mono','IBM Plex Mono',monospace" font-size="26" letter-spacing="2" fill="#14161a">${esc(lensRow)}</text>
    <text x="600" y="502" font-size="16" fill="#6a6a6a">the four inspection lenses you can now apply</text>
    <text x="600" y="582" font-size="19" fill="#14161a">Before a question ships, check that the answer options can hold every real answer —</text>
    <text x="600" y="610" font-size="19" fill="#14161a">and that the scale, wording, and order are not quietly doing the choosing.</text>
    <text x="600" y="690" font-family="'JetBrains Mono','IBM Plex Mono',monospace" font-size="16" fill="#14161a">${esc(dateLabel)}      ·      ${esc(code)}</text>
    <text x="600" y="724" font-family="'JetBrains Mono','IBM Plex Mono',monospace" font-size="12" fill="#6a6a6a">a checksum of this certificate's date and contents, not a cryptographic signature</text>
    <text x="600" y="780" font-family="'JetBrains Mono','IBM Plex Mono',monospace" font-size="12" letter-spacing="1" fill="#6a6a6a">benlei.org/response-option-fit  ·  a self-issued keepsake, not an accredited credential</text>
  </g>
  <g transform="translate(96,690)">
    <rect x="-2" y="-2" width="64" height="64" rx="12" fill="#f5f1ea" stroke="#c9c2b1" stroke-width="1.5"/>
    <rect x="12" y="12" width="36" height="8" rx="4" fill="#14161a"/>
    <rect x="12" y="26" width="36" height="8" rx="4" fill="#b04a2f"/>
    <rect x="12" y="40" width="22" height="8" rx="4" fill="#14161a"/>
  </g>
</svg>`;
}
