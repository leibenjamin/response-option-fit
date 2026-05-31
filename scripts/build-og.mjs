import { chromium } from "@playwright/test";
import { fileURLToPath } from "node:url";

const WIDTH = 1200;
const HEIGHT = 630;
const outputPath = fileURLToPath(new URL("../public/og-image.png", import.meta.url));

const paper = "#f5f1ea";
const ink = "#14161a";
const accent = "#b04a2f";
const accent2 = "#8a3a26";
const line = "#c9c2b1";
const muted = "#6a6a6a";
const serif = "'Iowan Old Style','Charter','Source Serif Pro',Georgia,serif";
const mono = "'JetBrains Mono','IBM Plex Mono',ui-monospace,Menlo,monospace";

function esc(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildOgSvg() {
  const eyebrow = "RESPONSE OPTION FIT LAB";
  const title = "The quiet ways a survey lies.";
  const descriptor =
    "Twelve hands-on exercises in how survey answer choices quietly fail before analysis begins.";
  const lenses = "SLOT · RULER · PUSH · BOUNDARY";
  const footer = "benlei.org/response-option-fit";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="${esc(title)}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${paper}"/>
  <rect x="24" y="24" width="1152" height="582" fill="none" stroke="${line}" stroke-width="2"/>
  <rect x="36" y="36" width="1128" height="558" fill="none" stroke="${accent}" stroke-width="1"/>

  <g font-family="${serif}" text-anchor="middle" fill="${ink}">
    <text x="600" y="118" font-family="${mono}" font-size="17" letter-spacing="6" fill="${accent}">${esc(eyebrow)}</text>
    <text x="600" y="234" font-size="70" font-weight="500">${esc(title)}</text>
    <line x1="404" y1="276" x2="796" y2="276" stroke="${line}" stroke-width="1.5"/>
    <text x="600" y="334" font-size="25" font-style="italic" fill="#3a3a3a">${esc(descriptor)}</text>
    <text x="600" y="426" font-family="${mono}" font-size="25" letter-spacing="2" fill="${ink}">${esc(lenses)}</text>
    <text x="600" y="548" font-family="${mono}" font-size="15" letter-spacing="1" fill="${muted}">${esc(footer)}</text>
  </g>

  <g transform="translate(91,462)">
    <rect x="0" y="0" width="86" height="86" rx="18" fill="${paper}" stroke="${line}" stroke-width="2"/>
    <rect x="21" y="22" width="44" height="10" rx="5" fill="${ink}"/>
    <rect x="21" y="39" width="44" height="10" rx="5" fill="${accent}"/>
    <rect x="21" y="56" width="28" height="10" rx="5" fill="${ink}"/>
  </g>

  <g transform="translate(1030,462)" opacity="0.92">
    <line x1="0" y1="0" x2="78" y2="0" stroke="${accent2}" stroke-width="2"/>
    <line x1="78" y1="0" x2="78" y2="78" stroke="${accent2}" stroke-width="2"/>
  </g>
</svg>`;
}

async function main() {
  const svg = buildOgSvg();
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1
  });

  await page.setContent(
    `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          html, body { margin: 0; width: ${WIDTH}px; height: ${HEIGHT}px; background: ${paper}; overflow: hidden; }
          svg { display: block; width: ${WIDTH}px; height: ${HEIGHT}px; }
        </style>
      </head>
      <body>${svg}</body>
    </html>`,
    { waitUntil: "load" }
  );
  await page.screenshot({ path: outputPath, clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
