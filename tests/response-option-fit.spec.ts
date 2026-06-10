import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  exerciseReceipts,
  responseOptionKnowledgeMap,
  sourceDrawers
} from "../src/data/lab-exercises";
import {
  buildCertificateMarkdown,
  buildReviewChecklistMarkdown,
  certificateCode
} from "../src/lib/certificate";
import { LAB_EXERCISE_IDS, TOTAL_EXERCISES } from "../src/lib/progress";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4173";
const toolInitialism = String.fromCharCode(65, 73);

const publicDisclosureTerms = [
  ["Clau", "de Code"],
  ["Co", "dex"],
  ["Anth", "ropic"],
  ["Open", toolInitialism],
  ["Chat", "GPT"],
  [toolInitialism, " helped"],
  ["Initial scaffold", "ing"],
  [toolInitialism, "-assistance"],
  ["generated", "-by"],
  ["co", "-author"],
  ["vibe", "-coding"],
  ["coding ", "agent"],
  [toolInitialism, "-agent"],
  ["L", "LM"],
  ["runtime ", toolInitialism],
  [".cl", "aude"],
  [".co", "dex"],
  ["AG", "ENTS", ".md"],
  ["no", toolInitialism.toLowerCase()],
  ["no", "image", toolInitialism.toLowerCase()]
].map((parts) => parts.join(""));

const binaryPublicExtensions = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico"]);

function isBinaryPublicFile(file: string): boolean {
  return Array.from(binaryPublicExtensions).some((extension) => file.endsWith(extension));
}

test("tracked public files avoid local tooling disclosures", () => {
  const trackedFiles = execFileSync("git", ["ls-files"], {
    encoding: "utf8"
  })
    .split("\n")
    .filter(Boolean)
    .filter((file) => !isBinaryPublicFile(file));

  const matches: string[] = [];
  for (const file of trackedFiles) {
    const text = readFileSync(file, "utf8");
    for (const term of publicDisclosureTerms) {
      if (text.includes(term)) {
        matches.push(`${file}: ${term}`);
      }
    }
  }

  expect(matches).toEqual([]);
});

/* Solve all twelve exercises on a freshly-loaded lab page, using the same
   sequences the per-exercise tests verify. Used to drive the completion
   certificate to its unlocked state. */
async function solveAll12(page: Page) {
  // E1 — scale builder
  await page.getByTestId("lab-stem-plain").click();
  await page.getByTestId("lab-point-vsat").click();
  await page.getByTestId("lab-point-neutral").click();
  await page.getByTestId("lab-point-vdis").click();
  await page.getByTestId("lab-point-neutral").click();
  await page.getByTestId("lab-order-negative-first").click();
  await page.getByTestId("lab-stem-leading").click();
  await page.getByTestId("lab-point-dis").click();
  await page.getByTestId("lab-point-vdis").click();
  await page.getByTestId("lab-point-ssat").click();
  await expect(page.getByTestId("lab-receipt-E1")).toBeVisible();

  // E2 — double-barreled
  for (const id of [
    "barista-friendly",
    "hot-fresh",
    "coffee-quality",
    "barista-triple",
    "fix-quickly",
    "atmosphere"
  ]) {
    await page.getByTestId(`lab-bundled-${id}`).click();
  }
  await page.getByTestId("lab-bundled-check").click();
  await clickRepairThree(page);
  await expect(page.getByTestId("lab-receipt-E2")).toBeVisible();

  // E8 — false premise
  await page.getByTestId("lab-fp-screener-smartphone").click();
  await page.getByTestId("lab-fp-screener-smartphone").click();
  await page.getByTestId("lab-fp-screener-weekly").click();
  await page.getByTestId("lab-fp-screener-weekly").click();
  await page.getByTestId("lab-fp-screener-feature").click();
  await page.getByTestId("lab-fp-screener-app").click();
  await expect(page.getByTestId("lab-receipt-E8")).toBeVisible();

  // E3 — bucket tinker
  await page.getByTestId("lab-bucket-end-b1").fill("24");
  await page.getByTestId("lab-bucket-end-b2").fill("34");
  await page.getByTestId("lab-bucket-end-b3").fill("44");
  await page.getByTestId("lab-bucket-start-b1").fill("0");
  await page.getByTestId("lab-bucket-end-b4").fill("64");
  await page.getByTestId("lab-bucket-add").click();
  await page.locator(".lab-bucket-row").last().locator("input").nth(1).fill("");
  await expect(page.getByTestId("lab-receipt-E3")).toBeVisible();

  // E4 — channel set
  await page.getByTestId("lab-channel-other").click();
  await page.getByTestId("lab-channel-other").click();
  for (const id of ["wordofmouth", "podcast", "walkby", "event"]) {
    await page.getByTestId(`lab-channel-${id}`).click();
  }
  for (const id of [
    "social",
    "search",
    "friend",
    "print",
    "wordofmouth",
    "podcast",
    "walkby",
    "event"
  ]) {
    await page.getByTestId(`lab-channel-${id}`).click();
  }
  await page.getByTestId("lab-channel-online_broad").click();
  await page.getByTestId("lab-channel-offline_broad").click();
  await expect(page.getByTestId("lab-receipt-E4")).toBeVisible();

  // E9 — acquiescence
  await page.getByTestId("lab-acq-design-reverse").click();
  await page.getByTestId("lab-acq-judge-flagged").click();
  await page.getByTestId("lab-acq-design-item").click();
  await expect(page.getByTestId("lab-receipt-E9")).toBeVisible();

  // E6 — scale length
  await page.getByTestId("lab-scale-points-11").click();
  await page.getByTestId("lab-scale-points-7").click();
  await expect(page.getByTestId("lab-receipt-E6")).toBeVisible();

  // E7 — don't-know / NA
  await page.getByTestId("lab-oat-toggle-dk").click();
  await page.getByTestId("lab-oat-toggle-na").click();
  await expect(page.getByTestId("lab-receipt-E7")).toBeVisible();

  // E10 — verbal labels
  await page.getByTestId("lab-label-slot-slot2").click();
  await page.getByTestId("lab-label-word-neither").click();
  await page.getByTestId("lab-label-slot-slot3").click();
  await page.getByTestId("lab-label-word-satisfied").click();
  await page.getByTestId("lab-label-slot-slot4").click();
  await expect(page.getByTestId("lab-receipt-E10")).toBeVisible();

  // E11 — quantifiers
  await page.getByTestId("lab-quant-visitor-ben").click();
  await page.getByTestId("lab-quant-visitor-cleo").click();
  await page.getByTestId("lab-quant-period-past30").click();
  await page.getByTestId("lab-quant-unit-ranges").click();
  await expect(page.getByTestId("lab-receipt-E11")).toBeVisible();

  // E12 — order
  await page.getByTestId("lab-order-kind-nominal-unordered").click();
  await page.getByTestId("lab-order-kind-ordinal-continuum").click();
  await page.getByTestId("lab-order-nominal-rotated").click();
  await page.getByTestId("lab-order-ordinal-ordered").click();
  await expect(page.getByTestId("lab-receipt-E12")).toBeVisible();

  // E5 — ship-review capstone
  const calls: [string, string][] = [
    ["q-delightful", "push"],
    ["q-barista", "slot"],
    ["q-often", "ruler"],
    ["q-age", "slot"],
    ["q-visits", "fine"],
    ["footnote-sample", "boundary"]
  ];
  for (const [el, d] of calls) {
    await page.getByTestId(`lab-review-choice-${el}-${d}`).click();
  }
  await page.getByTestId("lab-review-check").click();
  await expect(page.getByTestId("lab-receipt-E5")).toBeVisible();
}

async function openContentsRail(page: Page) {
  const contents = page.getByTestId("lab-contents");
  const isOpen = await contents.evaluate(
    (el) => (el as HTMLDetailsElement).open
  );
  if (!isOpen) {
    await contents.getByText("Jump to exercise").click();
  }
}

async function jumpToExerciseFromRail(page: Page, num: number) {
  await openContentsRail(page);
  await page.getByTestId(`lab-contents-link-${num}`).click();
  await expect(page.getByTestId(`lab-live-loop-${num}`)).toBeFocused();
}

async function clickRepairThree(page: Page) {
  const repair = page.getByTestId("lab-repair-three");
  await expect(repair).toBeVisible();
  await expect(repair).toBeEnabled();
  /* WebKit can intermittently wait forever for this newly inserted button to
     become "stable" after the pass panel expands. The element is already
     visible and enabled; force only bypasses that false actionability wait. */
  await repair.click({ force: true });
}

async function expectLiveLoopEntryFramed(page: Page, num: number) {
  const frame = await page.getByTestId(`lab-live-loop-${num}`).evaluate((el) => {
    const rect = el.getBoundingClientRect();
    const rail = document.querySelector<HTMLElement>(".lab-contents");
    const railBottom = rail?.getBoundingClientRect().bottom ?? 0;
    return {
      bottom: rect.bottom,
      height: rect.height,
      railBottom,
      top: rect.top,
      viewportHeight: window.innerHeight
    };
  });
  expect(frame.top, `Exercise ${num} loop starts below the contents rail`).toBeGreaterThanOrEqual(
    frame.railBottom - 2
  );
  expect(frame.bottom, `Exercise ${num} loop fits after a contents jump`).toBeLessThanOrEqual(
    frame.viewportHeight + 2
  );
}

async function expectExerciseRowsEntryFramed(
  page: Page,
  num: number,
  rowSelector: string
) {
  const offenders = await page.evaluate(
    ({ rowSelector, num }) => {
      const root = document.getElementById(`lab-exercise-${num}`);
      const rail = document.querySelector<HTMLElement>(".lab-contents");
      const railBottom = rail?.getBoundingClientRect().bottom ?? 0;
      if (!root) return [`Exercise ${num} missing`];
      return Array.from(root.querySelectorAll<HTMLElement>(rowSelector))
        .map((row) => {
          const rect = row.getBoundingClientRect();
          return {
            bottom: rect.bottom,
            text: (row.textContent ?? "").trim().slice(0, 80),
            top: rect.top
          };
        })
        .filter((row) => row.top < railBottom - 1 || row.bottom > window.innerHeight + 1)
        .map(
          (row) =>
            `${row.text} [${Math.round(row.top)}, ${Math.round(row.bottom)}]`
        );
    },
    { rowSelector, num }
  );
  expect(offenders, `Exercise ${num} visible consequence rows`).toEqual([]);
}

test.describe("Response Option Fit Lab - data contract", () => {
  test("lab receipt, source-drawer, and knowledge-map exercise links stay internally consistent", () => {
    const exerciseIds = Object.keys(exerciseReceipts).sort();
    expect(exerciseIds).toEqual([
      "E1",
      "E10",
      "E11",
      "E12",
      "E2",
      "E3",
      "E4",
      "E5",
      "E6",
      "E7",
      "E8",
      "E9"
    ]);
    expect(Object.keys(sourceDrawers).sort()).toEqual(exerciseIds);

    const known = new Set(exerciseIds);
    for (const branch of responseOptionKnowledgeMap) {
      for (const node of branch.nodes) {
        for (const id of node.exerciseIds) {
          if (id === "future" || id === "none") continue;
          expect(known.has(id), `${node.id} references known exercise ${id}`).toBe(true);
        }
      }
    }
  });

  test("progress ids cover exactly the twelve receipts", () => {
    expect(TOTAL_EXERCISES).toBe(12);
    expect([...LAB_EXERCISE_IDS].sort()).toEqual(Object.keys(exerciseReceipts).sort());
  });

  test("certificate code is deterministic and bound to date, coverage, and contents; markdown carries the payload", () => {
    /* Same inputs -> same code; different coverage or date -> different code. */
    expect(certificateCode("2026-05-31", 12, 12)).toBe(
      certificateCode("2026-05-31", 12, 12)
    );
    expect(certificateCode("2026-05-31", 12, 12)).not.toBe(
      certificateCode("2026-05-31", 11, 12)
    );
    expect(certificateCode("2026-05-31", 12, 12)).not.toBe(
      certificateCode("2026-06-01", 12, 12)
    );
    expect(certificateCode("2026-05-31", 12, 12)).toMatch(
      /^ROF-[0-9A-Z]{4}-[0-9A-Z]{4}$/
    );

    const complete = buildCertificateMarkdown(12, 12, "May 31, 2026", "ROF-AAAA-BBBB");
    expect(complete).toContain("Completion keepsake");
    expect(complete).toContain("**SLOT**");
    expect(complete).toContain("Things I can now say without bluffing");
    expect(complete).toContain("Further reading");
    expect(complete).toContain("not a cryptographic signature");
    expect(complete).toContain("ROF-AAAA-BBBB");
    /* Partial coverage is honest: "Practice", not "Completion". */
    expect(buildCertificateMarkdown(8, 12, "May 31, 2026", "X")).toContain(
      "Practice keepsake"
    );
  });

  test("the review checklist markdown is ungated and carries the four passes, facts, and reading", () => {
    const md = buildReviewChecklistMarkdown();
    expect(md).toContain("Response-option review checklist");
    expect(md).toContain("**SLOT**");
    expect(md).toContain("**BOUNDARY**");
    expect(md).toContain("Things you can say without bluffing");
    expect(md).toContain("Further reading");
    /* It is a reference, not a personal keepsake: no name line, date, or code. */
    expect(md).not.toContain("Completed by");
    expect(md).not.toContain("ROF-");
  });
});

test.describe("Response Option Fit Lab - desktop", () => {
  test.beforeEach(({}, testInfo) => {
    testInfo.skip(
      !["desktop", "firefox", "webkit"].includes(testInfo.project.name),
      "desktop browsers only"
    );
  });

  test("the lab home (/) loads the SQLBolt-style multi-exercise practice page", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page.locator("#survey-lab-title")).toContainText(
      "The quiet ways a survey lies"
    );
    /* Twelve exercise cards present; the capstone stays last. */
    await expect(page.locator(".lab-exercise")).toHaveCount(12);
    await expect(page.locator(".lab-exercise").last()).toContainText(
      "Review the draft before it ships"
    );
    /* Each named with its primary verb. */
    const verbs = await page.locator(".lab-exercise-verb").allInnerTexts();
    expect(verbs.length).toBe(12);
    /* The closing knowledge map carries the four SLOT/RULER/PUSH/BOUNDARY
       branches and the visual coverage gauge. */
    await expect(page.getByTestId("lab-km")).toBeVisible();
    await expect(page.locator(".lab-km-branch")).toHaveCount(4);
    await expect(page.getByTestId("lab-km-gauge")).toBeVisible();
    /* The gauge's stacked bar shows every coverage status as a segment. */
    await expect(
      page.locator(".lab-km-gauge-bar .lab-km-gauge-seg")
    ).toHaveCount(4);
    await expect(page.locator(".lab-km-node--practiced")).toHaveCount(16);
    await expect(page.locator(".lab-km-node--planned")).toHaveCount(3);
    await expect(page.locator(".lab-km-node--didactic")).toHaveCount(3);
    await expect(page.locator(".lab-km-node--outOfScope")).toHaveCount(4);
  });

  test("the opening hook rounds the visitor's placement and adding options narrows the catchment", async ({
    page
  }) => {
    await page.goto(`${BASE_URL}/`);
    const hook = page.getByTestId("lab-hero");
    await expect(hook).toBeVisible();
    /* Reads correctly at zero clicks: the default mixed placement is filed onto
       the upper of the two coarse boxes. */
    const readout = page.getByTestId("lab-hero-headline");
    await expect(hook).toContainText("Watch a form round your answer");
    await expect(hook).toContainText("Tap or drag to your exact spot");
    await expect(hook).toContainText("your exact spot");
    await expect(hook).toContainText("recorded answer");
    await expect(hook).toContainText("rounded away");
    await expect(hook.locator(".lab-hook-axis")).toContainText(
      "truly rough day"
    );
    await expect(hook.locator(".lab-hook-axis")).toContainText(
      "truly great day"
    );
    await expect(readout).toContainText("Your day feels");
    await expect(readout).not.toContainText("Your exact spot feels");
    await expect(readout).toContainText("honestly mixed");
    await expect(readout).toContainText("Great day");
    await expect(hook).toContainText("2 answer boxes");

    /* The placement strip is a real slider with a spoken value, so it works for
       keyboard and assistive tech. */
    const track = page.getByTestId("lab-hook-track");
    await expect(track).toHaveAttribute("role", "slider");
    await expect(track).toHaveAttribute(
      "aria-valuetext",
      /^Your day feels honestly mixed\. The form would record this as Great day\.$/
    );
    await expect(page.getByTestId("lab-hook-tap-cue")).toBeVisible();
    await track.focus();
    await track.press("Home");
    await expect(track).toHaveAttribute("aria-valuenow", "0");
    await expect(readout).toContainText("truly rough");
    await expect(readout).toContainText("Rough day");
    await expect(readout).toContainText("records it as “Rough day.”");

    /* Giving people a middle turns the same placement from a coarse box into a
       finer one — the catchment shrinks. */
    await track.press("End");
    await page.getByTestId("lab-hook-step").click();
    await expect(hook).toContainText("3 answer boxes");
    await expect(readout).toContainText("truly great");
    await expect(readout).toContainText("records it as “Great.”");

    /* The privacy reassurance is present, and the CTA sends focus into Exercise 1. */
    await expect(page.getByTestId("lab-hook-privacy")).toContainText(
      "In-browser only"
    );
    await expect(page.getByTestId("lab-hook-privacy")).toContainText(
      "nothing here is saved or sent"
    );
    await page.getByTestId("lab-hero-cta").click();
    await expect(page.locator("#lab-exercise-1-title")).toBeFocused();
  });

  test("active solving loops fit a reduced 1280x720 desktop viewport", async ({
    page
  }, testInfo) => {
    testInfo.skip(
      testInfo.project.name !== "desktop",
      "pixel viewport guard runs once in Chromium"
    );
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(`${BASE_URL}/`);
    await expect(page.locator(".lab-exercise")).toHaveCount(12);

    const loops = await page.evaluate(() => {
      const viewportHeight = window.innerHeight;
      return Array.from(document.querySelectorAll<HTMLElement>(".lab-exercise"))
        .map((exercise) => {
          let selector = ".lab-console";
          let first = exercise.querySelector<HTMLElement>(".lab-console");
          let last = first;

          if (!first && exercise.classList.contains("lab-exercise--double-barreled")) {
            selector = ".lab-exercise-setup to .lab-exercise-actions";
            first = exercise.querySelector<HTMLElement>(".lab-exercise-setup");
            last = exercise.querySelector<HTMLElement>(".lab-exercise-actions");
          }

          if (!first || !last) return null;
          const firstRect = first.getBoundingClientRect();
          const lastRect = last.getBoundingClientRect();
          return {
            id: exercise.id,
            selector,
            height: Math.round((lastRect.bottom - firstRect.top) * 10) / 10,
            viewportHeight
          };
        })
        .filter(Boolean);
    });

    expect(loops.length).toBe(12);
    expect(
      loops.filter((loop) => loop.height > loop.viewportHeight + 1)
    ).toEqual([]);
  });

  test("what-to-settle guidance does not clip visible task text", async ({
    page
  }, testInfo) => {
    testInfo.skip(
      testInfo.project.name !== "desktop",
      "responsive clipping guard sets its own viewport sizes"
    );

    for (const viewport of [
      { width: 1280, height: 720 },
      { width: 1440, height: 900 },
      { width: 390, height: 851 },
      { width: 320, height: 720 }
    ]) {
      await page.setViewportSize(viewport);
      await page.goto(`${BASE_URL}/`);
      await expect(page.locator(".lab-taskband")).toHaveCount(10);

      const clipped = await page.evaluate(() => {
        const selector = [
          ".lab-taskband .lab-task-title",
          ".lab-taskband .lab-task-active-title",
          ".lab-taskband .lab-task-brief",
          ".lab-taskband .lab-task-hint"
        ].join(",");

        return Array.from(document.querySelectorAll<HTMLElement>(selector))
          .filter((el) => {
            const style = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            if (
              style.display === "none" ||
              style.visibility === "hidden" ||
              rect.width === 0 ||
              rect.height === 0
            ) {
              return false;
            }
            return (
              el.scrollHeight > el.clientHeight + 1 ||
              el.scrollWidth > el.clientWidth + 1
            );
          })
          .map((el) => {
            const root = el.closest<HTMLElement>(".lab-exercise");
            return {
              exercise: root?.id ?? "unknown",
              className: el.className.toString(),
              clientHeight: el.clientHeight,
              scrollHeight: el.scrollHeight,
              clientWidth: el.clientWidth,
              scrollWidth: el.scrollWidth,
              text: (el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 100)
            };
          });
      });

      expect(clipped, `${viewport.width}x${viewport.height}`).toEqual([]);
    }
  });

  test("zoomed desktop exercises do not create page or viewport overflow", async ({
    page
  }, testInfo) => {
    testInfo.skip(
      testInfo.project.name !== "desktop",
      "zoom containment guard runs once in Chromium"
    );
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(`${BASE_URL}/`);
    await expect(page.locator(".lab-exercise")).toHaveCount(12);
    await page.evaluate(() => {
      document.body.style.zoom = "1.1";
    });

    const pageOverflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    }));
    expect(pageOverflow.scrollWidth).toBeLessThanOrEqual(pageOverflow.clientWidth + 1);
    expect(pageOverflow.bodyScrollWidth).toBeLessThanOrEqual(
      pageOverflow.clientWidth + 1
    );

    const exerciseIds = await page.locator(".lab-exercise").evaluateAll((els) =>
      els.map((el) => el.id)
    );
    const crossers: string[] = [];
    for (const id of exerciseIds) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await page.waitForTimeout(20);
      const found = await page.evaluate((exerciseId) => {
        const root = document.getElementById(exerciseId);
        if (!root) return [];
        const viewportWidth = document.documentElement.clientWidth;
        return Array.from(root.querySelectorAll<HTMLElement>("*"))
          .map((el) => {
            const style = getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            return {
              testid: el.getAttribute("data-testid") ?? "",
              className: el.className.toString(),
              text: (el.textContent ?? "").trim().slice(0, 60),
              left: rect.left,
              right: rect.right,
              width: rect.width,
              height: rect.height,
              visible:
                style.display !== "none" &&
                style.visibility !== "hidden" &&
                rect.width > 0 &&
                rect.height > 0 &&
                rect.bottom > 0 &&
                rect.top < window.innerHeight
            };
          })
          .filter((item) => item.visible)
          .filter((item) => item.left < -1 || item.right > viewportWidth + 1)
          .slice(0, 8)
          .map(
            (item) =>
              `${exerciseId} ${item.testid || item.className || item.text} ` +
              `[${Math.round(item.left)}, ${Math.round(item.right)}]`
          );
      }, id);
      crossers.push(...found);
    }

    expect(crossers).toEqual([]);
  });

  test("the lab's #lab and / hashes are equivalent", async ({ page }) => {
    await page.goto(`${BASE_URL}/#lab`);
    await expect(page.locator("#survey-lab-title")).toContainText(
      "The quiet ways a survey lies"
    );
  });

  test("the contents rail jumps to an exercise and to the closing map", async ({
    page
  }) => {
    await page.goto(`${BASE_URL}/`);
    const contents = page.getByTestId("lab-contents");
    await expect(contents).toBeVisible();
    /* The disclosure is collapsed by default; open it to reach the links. */
    await contents.getByText("Jump to exercise").click();
    /* Twelve exercise links plus the closing-map link. */
    await expect(
      page.locator('[data-testid^="lab-contents-link-"]')
    ).toHaveCount(13);
    const railGeometry = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll<HTMLElement>('[data-testid^="lab-contents-link-"]')
      ).map((link) => {
        const title = link.querySelector<HTMLElement>(".lab-contents-title");
        const verb = link.querySelector<HTMLElement>(".lab-contents-verb");
        const num = link.querySelector<HTMLElement>(".lab-contents-num");
        const linkRect = link.getBoundingClientRect();
        const titleRect = title?.getBoundingClientRect();
        const verbRect = verb?.getBoundingClientRect();
        const numRect = num?.getBoundingClientRect();
        return {
          display: getComputedStyle(link).display,
          height: linkRect.height,
          sameLineGap:
            titleRect && verbRect && Math.abs(titleRect.top - verbRect.top) < 4
              ? verbRect.left - titleRect.right
              : null,
          text: link.textContent?.trim() ?? "",
          titleHeight: titleRect?.height ?? 0,
          titleTop: titleRect?.top ?? 0,
          numTop: numRect?.top ?? 0
        };
      })
    );
    expect(railGeometry.every((item) => item.display === "grid")).toBe(true);
    expect(railGeometry.every((item) => item.height >= 32)).toBe(true);
    for (const item of railGeometry) {
      expect(
        Math.abs(item.numTop - item.titleTop),
        `${item.text} number aligns with title start`
      ).toBeLessThanOrEqual(4);
    }
    const sameLineGaps = railGeometry
      .map((item) => item.sameLineGap)
      .filter((gap): gap is number => gap !== null);
    expect(sameLineGaps.length).toBeGreaterThan(0);
    expect(Math.max(...sameLineGaps)).toBeLessThanOrEqual(18);
    /* Jumping moves keyboard focus to the live loop, which is labelled by the
       exercise title, so it is not just a silent scroll. */
    await page.getByTestId("lab-contents-link-10").click();
    await expect(page.getByTestId("lab-live-loop-10")).toBeFocused();
    /* Re-open (jumping auto-closes the rail) and jump to the closing map. */
    await contents.getByText("Jump to exercise").click();
    await page.getByTestId("lab-contents-link-map").click();
    await expect(page.locator("#lab-km-title")).toBeFocused();
  });

  test("contents jumps frame the active solving loop at 1280x720", async ({
    page
  }, testInfo) => {
    testInfo.skip(
      testInfo.project.name !== "desktop",
      "pixel viewport guard runs once in Chromium"
    );
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${BASE_URL}/`);
    await expect(page.locator(".lab-exercise")).toHaveCount(12);

    for (const num of [1, 5, 6, 9, 10, 11, 12]) {
      await jumpToExerciseFromRail(page, num);
      await expectLiveLoopEntryFramed(page, num);
    }

    await jumpToExerciseFromRail(page, 5);
    await expectExerciseRowsEntryFramed(page, 5, ".lab-channel-cast-row");
    await jumpToExerciseFromRail(page, 6);
    await expectExerciseRowsEntryFramed(page, 6, ".lab-acq-row");
    await jumpToExerciseFromRail(page, 9);
    await expectExerciseRowsEntryFramed(page, 9, ".lab-label-row");
  });

  test("E2 double-barreled: flag the six bundles (incl. the two with no \"and\"), skip the two \"and\" decoys, then repair the triple", async ({ page }, testInfo) => {
    if (testInfo.project.name === "webkit") testInfo.setTimeout(45_000);
    await page.goto(`${BASE_URL}/`);
    /* No pre-reveal spoiler tag should point at the no-"and" items. */
    await expect(page.locator(".lab-bundled-tag")).toHaveCount(0);
    /* The six bundled items: two with no "and" (hot-fresh, fix-quickly), three
       with "and", one triple. Leave the two clean + two "and"-decoys alone. */
    for (const id of [
      "barista-friendly",
      "hot-fresh",
      "coffee-quality",
      "barista-triple",
      "fix-quickly",
      "atmosphere"
    ]) {
      await page.getByTestId(`lab-bundled-${id}`).click();
    }
    await page.getByTestId("lab-bundled-check").click();
    await expect(page.getByTestId("lab-bundled-pass")).toBeVisible();
    /* Repair sub-task: the clean three-question split is the right move. */
    await clickRepairThree(page);
    await expect(page.getByTestId("lab-receipt-E2")).toBeVisible();
  });

  test("E6 scale length: too few crushes distinctions, 11 points is false precision, 5–7 passes both", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    /* Start at 3 points — distinctions meter is low (genuinely-different
       visitors collapse). Cranking to 11 satisfies Task 1 but the second
       meter (trustworthy) goes low; 7 points passes both. */
    await page.getByTestId("lab-scale-points-11").click();
    await expect(page.getByTestId("lab-scale-pass")).toHaveCount(0);
    await page.getByTestId("lab-scale-points-7").click();
    await expect(page.getByTestId("lab-scale-pass")).toBeVisible();
    await expect(page.getByTestId("lab-receipt-E6")).toBeVisible();
  });

  test("E7 don't-know/NA: adding 'Don't know' looks done (nobody forced onto Neutral) but lumps the never-tried in — you must add 'Not applicable' too", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    /* Toggling DK on clears Task 1 (no one forced onto Neutral) but lumps the
       never-tried into Don't-know, so the full pass stays closed. */
    await page.getByTestId("lab-oat-toggle-dk").click();
    await expect(page.getByTestId("lab-oat-pass")).toHaveCount(0);
    /* Adding NA gives the never-tried their own home → both tasks done. */
    await page.getByTestId("lab-oat-toggle-na").click();
    await expect(page.getByTestId("lab-oat-pass")).toBeVisible();
    await expect(page.getByTestId("lab-receipt-E7")).toBeVisible();
  });

  test("E3 bucket tinker: fixes overlaps, covers under-18, and splits the 45+ lump", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    /* The age ruler mirrors the edit: four bands, ten dots, and — on the broken
       starter set — at least one uncovered (under-18) gap and the boundary
       overlaps. It is decorative (the inputs/list are the AT path), so it is
       aria-hidden. */
    await expect(page.locator(".lab-bucket-axis-band")).toHaveCount(4);
    await expect(page.locator(".lab-bucket-axis-dot")).toHaveCount(10);
    await expect(page.locator(".lab-bucket-axis-gap").first()).toBeVisible();
    await expect(page.locator(".lab-bucket-axis-overlap").first()).toBeVisible();
    await expect(page.locator(".lab-bucket-axis")).toHaveAttribute("aria-hidden", "true");

    await page.getByTestId("lab-bucket-end-b1").fill("24");
    await page.getByTestId("lab-bucket-end-b2").fill("34");
    await page.getByTestId("lab-bucket-end-b3").fill("44");
    await expect(page.locator('[data-testid="lab-bucket-task-fix-overlap"].is-done')).toHaveCount(1);
    /* With the overlaps gone, no double-covered stretch remains on the ruler. */
    await expect(page.locator(".lab-bucket-axis-overlap")).toHaveCount(0);

    await page.getByTestId("lab-bucket-start-b1").fill("0");
    await expect(page.locator('[data-testid="lab-bucket-task-extend-low"].is-done')).toHaveCount(1);
    /* And once the under-18s are covered, the ruler shows no gap. */
    await expect(page.locator(".lab-bucket-axis-gap")).toHaveCount(0);

    await page.getByTestId("lab-bucket-end-b4").fill("64");
    await page.getByTestId("lab-bucket-add").click();
    const lastBucket = page.locator(".lab-bucket-row").last();
    await lastBucket.locator("input").nth(1).fill("");
    await expect(page.getByTestId("lab-receipt-E3")).toBeVisible();
    await expect(page.getByTestId("lab-bucket-fit-sam")).toContainText("45–64");
    await expect(page.getByTestId("lab-bucket-fit-pat")).toContainText("65+");
  });

  test("E3 bucket tinker: bucket identities stay ordered and capped while tinkering", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page.locator(".lab-bucket-axis-band")).toHaveCount(4);
    await expect(page.locator(".lab-bucket-axis-handle")).toHaveCount(8);

    const bucketLabels = async () =>
      (await page.locator(".lab-bucket-axis-band-label").allTextContents()).map(
        (text) => text.replace(/\s+/g, " ").trim()
      );

    const tooSmallHandles = await page
      .locator(".lab-bucket-axis-handle")
      .evaluateAll((els) =>
        els
          .map((el) => {
            const rect = el.getBoundingClientRect();
            return {
              height: Math.round(rect.height * 10) / 10,
              width: Math.round(rect.width * 10) / 10
            };
          })
          .filter((rect) => Math.min(rect.width, rect.height) < 24)
      );
    expect(tooSmallHandles).toEqual([]);

    expect(await bucketLabels()).toEqual([
      "B1 · 18–25",
      "B2 · 25–35",
      "B3 · 35–45",
      "B4 · 45+"
    ]);

    for (let i = 0; i < 4; i++) {
      await page.getByTestId("lab-bucket-add").click();
    }
    await expect(page.locator(".lab-bucket-row")).toHaveCount(8);
    await expect(page.locator(".lab-bucket-axis-band")).toHaveCount(8);
    await expect(page.getByTestId("lab-bucket-add")).toBeDisabled();
    await expect(page.getByTestId("lab-bucket-limit")).toContainText(
      "Eight buckets"
    );
    expect(await bucketLabels()).toEqual([
      "B1 · 18–25",
      "B2 · 25–35",
      "B3 · 35–45",
      "B4 · 45+",
      "B5 · 46–50",
      "B6 · 51–55",
      "B7 · 56–60",
      "B8 · 61–65"
    ]);
    expect((await bucketLabels()).filter((label) => /· 100$/.test(label))).toEqual([]);

    await page.getByTestId("lab-bucket-remove-b2").click();
    await expect(page.locator(".lab-bucket-row")).toHaveCount(7);
    await expect(page.getByTestId("lab-bucket-add")).toBeEnabled();
    await page.getByTestId("lab-bucket-add").click();
    await page.getByTestId("lab-bucket-start-b9").fill("10");
    await page.getByTestId("lab-bucket-end-b9").fill("12");

    await expect(page.locator(".lab-bucket-row").first()).toHaveAttribute(
      "data-bucket-id",
      "b9"
    );
    expect((await bucketLabels()).slice(0, 2)).toEqual([
      "B1 · 10–12",
      "B2 · 18–25"
    ]);
    expect(
      (await page.locator(".lab-bucket-row-id").allTextContents()).slice(0, 2)
    ).toEqual(["B1", "B2"]);
  });

  test("E10 verbal labels: numeric slots and positive-skew words fail; the balanced built ruler passes", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page.locator(".lab-label-builder")).toBeVisible();
    await expect(page.getByTestId("lab-label-note-shelf")).toBeVisible();
    /* Leaving any middle point as a number keeps Check 1 open. */
    await page.getByTestId("lab-label-word-fair").click();
    await page.getByTestId("lab-label-slot-slot2").click();
    await page.getByTestId("lab-label-word-good").click();
    await page.getByTestId("lab-label-slot-slot3").click();
    await expect(page.getByTestId("lab-label-pass")).toHaveCount(0);
    await expect(page.locator('[data-testid="lab-label-task-label-points"].is-done')).toHaveCount(0);
    /* Filling all three slots clears Check 1, but the positive-skew middle
       still pulls the cast and blocks the final receipt. */
    await page.getByTestId("lab-label-word-great").click();
    await page.getByTestId("lab-label-slot-slot4").click();
    await expect(page.getByTestId("lab-label-pass")).toHaveCount(0);
    await expect(page.locator('[data-testid="lab-label-task-label-points"].is-done')).toHaveCount(1);
    await expect(page.getByTestId("lab-label-landing-cleo")).toContainText(
      "middle lands on"
    );
    /* The one balanced final solution: dissatisfied / neither / satisfied. */
    await page.getByTestId("lab-label-word-dissatisfied").click();
    await page.getByTestId("lab-label-slot-slot2").click();
    await page.getByTestId("lab-label-word-neither").click();
    await page.getByTestId("lab-label-slot-slot3").click();
    await page.getByTestId("lab-label-word-satisfied").click();
    await page.getByTestId("lab-label-slot-slot4").click();
    await expect(page.getByTestId("lab-label-pass")).toBeVisible();
    await expect(page.getByTestId("lab-receipt-E10")).toBeVisible();
  });

  test("E11 quantifiers: invalid pair, no-period ranges, and fake precision fail; Ben/Cleo collision plus anchored ranges passes", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page.locator(".lab-quant-workbench")).toBeVisible();
    await expect(page.locator(".lab-quant-sidecar")).toBeVisible();
    await expect(page.locator(".lab-quant-meter-shelf summary")).toContainText(
      "Show meter readout"
    );
    /* Ada/Cleo collides on neither axis (different count and different word). */
    await page.getByTestId("lab-quant-visitor-ada").click();
    await page.getByTestId("lab-quant-visitor-cleo").click();
    await expect(page.getByTestId("lab-quant-collision-note")).toContainText(
      "does not expose"
    );
    await page.getByTestId("lab-quant-unit-ranges").click();
    await expect(page.getByTestId("lab-quant-pass")).toHaveCount(0);
    /* Ben/Cleo is valid: same count, different words. Count ranges still fail
       until the reference period is named. */
    await page.getByTestId("lab-quant-visitor-ben").click();
    await expect(page.getByTestId("lab-quant-collision-note")).toContainText(
      "both came 4 times"
    );
    await expect(page.locator('[data-testid="lab-quant-task-spot-collision"].is-done')).toHaveCount(1);
    await expect(page.getByTestId("lab-quant-pass")).toHaveCount(0);
    /* Naming the period but choosing a 0-100 score is still fake precision. */
    await page.getByTestId("lab-quant-unit-score").click();
    await page.getByTestId("lab-quant-period-past30").click();
    await expect(page.getByTestId("lab-quant-pass")).toHaveCount(0);
    await expect(page.getByTestId("lab-quant-visitor-ben")).toContainText(
      "/100"
    );
    await page.getByTestId("lab-quant-unit-ranges").click();
    await expect(page.getByTestId("lab-quant-pass")).toBeVisible();
    await expect(page.getByTestId("lab-receipt-E11")).toBeVisible();
  });

  test("E11 quantifiers: the Ada/Ben same-word collision is also a valid path to anchored ranges", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.getByTestId("lab-quant-visitor-ada").click();
    await page.getByTestId("lab-quant-visitor-ben").click();
    await expect(page.getByTestId("lab-quant-collision-note")).toContainText(
      "both report Often"
    );
    await page.getByTestId("lab-quant-period-past30").click();
    await page.getByTestId("lab-quant-unit-ranges").click();
    await expect(page.getByTestId("lab-quant-pass")).toBeVisible();
    await expect(page.getByTestId("lab-receipt-E11")).toBeVisible();
  });

  test("E11 quantifiers: the Cleo/Eve same-word collision is accepted (the copy invites same word, different counts)", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    /* Cleo came 4 times and Eve once, but both say "Sometimes" — a real
       same-word/different-count collision the rejection note explicitly invites,
       so it must pass rather than be turned away. */
    await page.getByTestId("lab-quant-visitor-cleo").click();
    await page.getByTestId("lab-quant-visitor-eve").click();
    await expect(page.getByTestId("lab-quant-collision-note")).toContainText(
      "both report Sometimes"
    );
    await page.getByTestId("lab-quant-period-past30").click();
    await page.getByTestId("lab-quant-unit-ranges").click();
    await expect(page.getByTestId("lab-quant-pass")).toBeVisible();
    await expect(page.getByTestId("lab-receipt-E11")).toBeVisible();
  });

  test("E12 order: wrong classifications fail before rotating unordered options and keeping the ordinal ruler ordered", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page.locator(".lab-order-workbench")).toBeVisible();
    await expect(page.locator(".lab-order-sidecar")).toBeVisible();
    await expect(page.locator(".lab-order-meter-shelf summary")).toContainText(
      "Show meter readout"
    );
    await page.getByTestId("lab-order-kind-nominal-continuum").click();
    await page.getByTestId("lab-order-kind-ordinal-unordered").click();
    await page.getByTestId("lab-order-nominal-rotated").click();
    await expect(page.getByTestId("lab-order-pass")).toHaveCount(0);
    await expect(page.locator('[data-testid="lab-order-task-classify-lists"].is-done')).toHaveCount(0);
    await page.getByTestId("lab-order-kind-nominal-unordered").click();
    await page.getByTestId("lab-order-kind-ordinal-continuum").click();
    await expect(page.locator('[data-testid="lab-order-task-classify-lists"].is-done')).toHaveCount(1);
    await expect(page.getByTestId("lab-order-pass")).toHaveCount(0);
    await expect(page.getByTestId("lab-order-landing-eve")).toContainText(
      "scale order broken"
    );
    await page.getByTestId("lab-order-ordinal-ordered").click();
    await expect(page.getByTestId("lab-order-pass")).toBeVisible();
    await expect(page.getByTestId("lab-receipt-E12")).toBeVisible();
  });

  test("E12 order: which option a fixed list favors flips with survey mode (primacy on screen, recency read aloud)", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    /* Fin is uncertain, so under a fixed order Fin drifts to whichever end the
       mode favors. Default (on screen) → the first option; read aloud → the last. */
    const fin = page.getByTestId("lab-order-landing-fin");
    await expect(fin).toContainText("Social media");
    await expect(fin).toContainText("first-option drift");
    await page.getByTestId("lab-order-mode-phone").click();
    await expect(fin).toContainText("Walked by");
    await expect(fin).toContainText("last-option drift");
    /* Rotating neutralizes the drift regardless of mode. */
    await page.getByTestId("lab-order-nominal-rotated").click();
    await expect(fin).toContainText("reason preserved");
  });

  test("E10-E12 source drawers expose conservative terms and evidence badges", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    await page.getByTestId("lab-label-slot-slot2").click();
    await page.getByTestId("lab-label-word-neither").click();
    await page.getByTestId("lab-label-slot-slot3").click();
    await page.getByTestId("lab-label-word-satisfied").click();
    await page.getByTestId("lab-label-slot-slot4").click();
    const labelDrawer = page.getByTestId("lab-source-E10");
    await expect(labelDrawer).toBeVisible();
    await expect(labelDrawer.locator(".lab-evidence-badge")).toHaveText(
      "Directionally supported"
    );
    await labelDrawer.locator("summary").click();
    await expect(labelDrawer).toContainText("verbal labels");
    await expect(labelDrawer).toContainText("semantic balance");
    await expect(labelDrawer).toContainText("Do not claim every scale");

    await page.getByTestId("lab-quant-visitor-ben").click();
    await page.getByTestId("lab-quant-visitor-cleo").click();
    await page.getByTestId("lab-quant-period-past30").click();
    await page.getByTestId("lab-quant-unit-ranges").click();
    const quantDrawer = page.getByTestId("lab-source-E11");
    await expect(quantDrawer).toBeVisible();
    await expect(quantDrawer.locator(".lab-evidence-badge")).toHaveText(
      "Directionally supported"
    );
    await quantDrawer.locator("summary").click();
    await expect(quantDrawer).toContainText("vague quantifiers");
    await expect(quantDrawer).toContainText("false precision");
    await expect(quantDrawer).toContainText("teaching contrast");

    await page.getByTestId("lab-order-kind-nominal-unordered").click();
    await page.getByTestId("lab-order-kind-ordinal-continuum").click();
    await page.getByTestId("lab-order-nominal-rotated").click();
    await page.getByTestId("lab-order-ordinal-ordered").click();
    const orderDrawer = page.getByTestId("lab-source-E12");
    await expect(orderDrawer).toBeVisible();
    await expect(orderDrawer.locator(".lab-evidence-badge")).toHaveText(
      "Directionally supported"
    );
    await orderDrawer.locator("summary").click();
    await expect(orderDrawer).toContainText("response-order effects");
    await expect(orderDrawer).toContainText("ordinal scale");
    await expect(orderDrawer).toContainText("mode");
  });

  test("E8 false premise: the loose and over-tight screeners are traps; only the basis screener cleans the denominator; the app screener then splits the drop-outs", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    /* With no screeners there is no screened-out pen — all six reach. */
    await expect(page.locator(".lab-fp-stage--screened")).toHaveCount(0);
    /* Decoy 1 — "owns a smartphone" screens out no one, denominator stays
       dirty (Dev, a non-user, still answers) and the pen still never appears. */
    await page.getByTestId("lab-fp-screener-smartphone").click();
    await expect(page.getByTestId("lab-fp-pass")).toHaveCount(0);
    await expect(page.getByTestId("lab-fp-landing-dev")).toContainText("Answers");
    await expect(page.locator(".lab-fp-stage--screened")).toHaveCount(0);
    await page.getByTestId("lab-fp-screener-smartphone").click();
    /* Decoy 2 — "weekly" over-screens, dropping Cleo, a valid occasional user. */
    await page.getByTestId("lab-fp-screener-weekly").click();
    await expect(page.getByTestId("lab-fp-pass")).toHaveCount(0);
    await expect(page.getByTestId("lab-fp-landing-cleo")).toContainText(
      "wrongly dropped"
    );
    await page.getByTestId("lab-fp-screener-weekly").click();
    /* Correct feature screener cleans the denominator (Task 1) — the three
       no-basis customers drop into the screened-out pen — but Task 2 (split
       the drop-outs) is still pending, so no full pass yet. */
    await page.getByTestId("lab-fp-screener-feature").click();
    await expect(page.locator(".lab-fp-stage--screened")).toBeVisible();
    await expect(page.getByTestId("lab-fp-pass")).toHaveCount(0);
    /* Adding the app screener splits never-installed from has-app-never-used. */
    await page.getByTestId("lab-fp-screener-app").click();
    await expect(page.getByTestId("lab-fp-pass")).toBeVisible();
    await expect(page.getByTestId("lab-receipt-E8")).toBeVisible();
    await expect(page.getByTestId("lab-fp-landing-eve")).toContainText(
      "never installed the app"
    );
  });

  test("E9 acquiescence: switching to the reverse-worded check isn't enough — you must judge that it detects without measuring; then item-specific wording is the fix", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    /* Task 1: switch to the reverse-worded check — the judgment gate appears,
       and switching alone does NOT pass. */
    await page.getByTestId("lab-acq-design-reverse").click();
    await expect(page.getByTestId("lab-acq-judge")).toBeVisible();
    await expect(page.getByTestId("lab-acq-pass")).toHaveCount(0);
    /* The tempting wrong judgment ("it fixed it") shows a correction and does
       not advance the task. */
    await page.getByTestId("lab-acq-judge-fixed").click();
    await expect(page.getByTestId("lab-acq-judge-wrong")).toBeVisible();
    await expect(page.getByTestId("lab-acq-pass")).toHaveCount(0);
    /* The right judgment (detection ≠ measurement) clears Task 1. */
    await page.getByTestId("lab-acq-judge-flagged").click();
    /* Task 2 still pending until item-specific wording. */
    await expect(page.getByTestId("lab-acq-pass")).toHaveCount(0);
    await page.getByTestId("lab-acq-design-item").click();
    await expect(page.getByTestId("lab-acq-pass")).toBeVisible();
    await expect(page.getByTestId("lab-receipt-E9")).toBeVisible();
  });

  test("E1 scale builder runs honest → round-up → order-flip → hostile and reveals the flip", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    /* Ships as a 2-point forced-choice scale reading 4 of 5. The biased
       frame is a trust warning, not a cast-routing shortcut. */
    await expect(page.locator(".lab-tally").first()).toContainText("4 of 5");
    await expect(page.getByTestId("lab-stem-risk")).toContainText("Stem risk");
    await page.getByTestId("lab-stem-plain").click();
    await expect(page.locator(".lab-tally").first()).toContainText("4 of 5");
    await expect(page.getByTestId("lab-stem-risk")).toContainText("Stem: balanced");
    await page.getByTestId("lab-stem-leading").click();
    await expect(page.locator(".lab-tally").first()).toContainText("4 of 5");
    /* Make it honest: balanced stem + a balanced 5-point scale. */
    await page.getByTestId("lab-stem-plain").click();
    await page.getByTestId("lab-point-vsat").click();
    await page.getByTestId("lab-point-neutral").click();
    await page.getByTestId("lab-point-vdis").click();
    /* Round the fence-sitter up: drop the neutral. */
    await page.getByTestId("lab-point-neutral").click();
    /* Flip her back with nothing but order. */
    await page.getByTestId("lab-order-negative-first").click();
    await expect(page.locator('[data-testid="lab-task-order"].is-done')).toHaveCount(1);
    /* Now play the shop: biased frame + drop strong negatives + add a soft positive. */
    await page.getByTestId("lab-stem-leading").click();
    await page.getByTestId("lab-point-dis").click();
    await page.getByTestId("lab-point-vdis").click();
    await page.getByTestId("lab-point-ssat").click();
    await expect(page.locator(".lab-flip")).toBeVisible();
    await expect(page.getByTestId("lab-receipt-E1")).toBeVisible();
  });

  test("E4 channel set: read past the keyword-wrong stories to get everyone clean; then refit the SAME cast to an online-vs-offline decision", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    const clean = page.locator(".lab-channel-tally.is-clean strong");
    await expect(clean).toHaveText("3");
    /* "Other" alone does NOT raise the clean count — the missing-channel
       visitors are low-effort and won't write one in. */
    await page.getByTestId("lab-channel-other").click();
    await expect(clean).toHaveText("3");
    await page.getByTestId("lab-channel-other").click();
    /* Task 1: add the four missing channels. The stories point the wrong way —
       Pat's "podcast host" is Podcast (not word-of-mouth); Cleo's "receptionist"
       is word-of-mouth (not a friend) — so you reason it out, not skim it. */
    for (const id of ["wordofmouth", "podcast", "walkby", "event"]) {
      await page.getByTestId(`lab-channel-${id}`).click();
    }
    await expect(clean).toHaveText("7");
    await expect(page.getByTestId("lab-channel-landing-cleo")).toContainText(
      "Someone else mentioned us"
    );
    /* Task 2 (fit) still pending — the all-clean per-channel list isn't it. */
    await expect(page.getByTestId("lab-channel-pass")).toHaveCount(0);
    /* Refit for "online vs offline": drop all eight specifics, add the two
       broad buckets. The bucket that was WRONG in Task 1 is now RIGHT. */
    for (const id of [
      "social",
      "search",
      "friend",
      "print",
      "wordofmouth",
      "podcast",
      "walkby",
      "event"
    ]) {
      await page.getByTestId(`lab-channel-${id}`).click();
    }
    await page.getByTestId("lab-channel-online_broad").click();
    await page.getByTestId("lab-channel-offline_broad").click();
    /* Everyone lumped into a broad bucket → both tasks done. */
    await expect(page.getByTestId("lab-channel-pass")).toBeVisible();
    await expect(page.getByTestId("lab-receipt-E4")).toBeVisible();
    await expect(page.locator(".lab-channel-tally.is-lumped strong")).toHaveText(
      "7"
    );
  });

  test("E5 ship-review passes only when each draft part gets the right lens", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page.getByTestId("lab-review-queue")).toBeVisible();
    await expect(page.locator(".lab-review-index-item")).toHaveCount(6);
    await expect(page.getByTestId("lab-review-index-q-delightful")).toHaveAttribute(
      "aria-current",
      "step"
    );
    const calls: [string, string][] = [
      ["q-delightful", "push"],
      ["q-barista", "slot"],
      ["q-often", "ruler"],
      ["q-age", "slot"],
      ["q-visits", "fine"],
      ["footnote-sample", "boundary"]
    ];
    const [[firstEl, firstDiagnosis], ...remainingCalls] = calls;
    await page.getByTestId(`lab-review-choice-${firstEl}-${firstDiagnosis}`).click();
    await expect(page.getByTestId("lab-review-index-q-barista")).toHaveAttribute(
      "aria-current",
      "step"
    );
    for (const [el, d] of remainingCalls) {
      await page.getByTestId(`lab-review-choice-${el}-${d}`).click();
    }
    /* The live review tray triages the draft as it is classified: four
       answer-choice problems, one clean, one out of scope — restraint made
       visible (a good review does not flag everything). */
    const tray = page.getByTestId("lab-review-tray");
    await expect(tray).toContainText("4 answer-choice problems");
    await expect(tray).toContainText("1 clean");
    await expect(tray).toContainText("1 out of scope");
    await page.getByTestId("lab-review-check").click();
    await expect(page.getByTestId("lab-review-pass")).toBeVisible();
    await expect(page.getByTestId("lab-receipt-E5")).toBeVisible();
  });

  test("a solved exercise reveals a source drawer with an evidence badge, real field terms, and named sources", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    /* Drawer is gated to completion (appears with the receipt). */
    await expect(page.getByTestId("lab-source-E6")).toHaveCount(0);
    /* Same sequence that solves E6: 11 clears Task 1, 7 clears Task 2. */
    await page.getByTestId("lab-scale-points-11").click();
    await page.getByTestId("lab-scale-points-7").click();
    const drawer = page.getByTestId("lab-source-E6");
    await expect(drawer).toBeVisible();
    /* Honest evidence-strength badge in the summary. */
    await expect(drawer.locator(".lab-evidence-badge")).toBeVisible();
    /* Expand it and confirm the credibility payload. */
    await drawer.locator("summary").click();
    await expect(drawer).toContainText("scale length");
    await expect(drawer).toContainText("overclaim");
    await expect(drawer).toContainText("Krosnick");
  });

  test("the review checklist is an ungated take-home on the closing map", async ({
    page,
    context
  }) => {
    /* Clipboard permissions are a Chromium-only grant — Firefox throws on it and
       WebKit poisons the context (its later newPage rejects the unknown
       permission, which breaks the axe scan). Grant only in Chromium; the app's
       copy path falls back to a download in the others, so the status assertions
       still hold. */
    if (context.browser()?.browserType().name() === "chromium") {
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    }
    await page.goto(`${BASE_URL}/`);
    await page.getByTestId("lab-checklist").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("lab-checklist-copy")).toBeVisible();
    await page.getByTestId("lab-checklist-copy").click();
    await expect(page.getByTestId("lab-checklist-status")).toBeVisible();
  });

  test("print media keeps the closing-map gauge and branch cards visible before any scroll", async ({
    page
  }) => {
    await page.goto(`${BASE_URL}/`);
    await page.emulateMedia({ media: "print" });
    await expect(page.getByTestId("lab-km-gauge")).toBeVisible();
    await expect(page.locator(".lab-km-branch")).toHaveCount(4);
    /* The real assertion: none of the load-bearing map content is left at
       opacity 0 by the reveal-on-scroll rule when captured before scrolling. */
    const anyHidden = await page
      .locator(".lab-km-gauge, .lab-km-branch")
      .evaluateAll((els) => els.some((el) => getComputedStyle(el).opacity === "0"));
    expect(anyHidden).toBe(false);
  });

  test("the completion certificate is gated until all twelve are solved, then offers Markdown + PNG", async ({
    page,
    context
  }) => {
    /* By far the heaviest test: it solves all twelve exercises, scrolls the whole
       page, runs two full axe scans, and exercises the PNG/Markdown export. On
       WebKit under load that lands ~27–30s against the 30s default and flakes on
       a timeout. Mark it slow (triples the budget) — coverage is unchanged. */
    test.slow();
    /* Clipboard permissions are a Chromium-only grant — Firefox throws on it and
       WebKit poisons the context (its later newPage rejects the unknown
       permission, which breaks the axe scan). Grant only in Chromium; the app's
       copy path falls back to a download in the others, so the status assertions
       still hold. */
    if (context.browser()?.browserType().name() === "chromium") {
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    }
    await page.goto(`${BASE_URL}/`);
    /* Locked on a fresh visit: 0 of 12, no take-buttons. */
    await expect(page.getByTestId("lab-cert-count")).toHaveText("0");
    await expect(page.getByTestId("lab-cert-copy")).toHaveCount(0);
    await expect(page.getByTestId("lab-contents-progress")).toContainText(
      "0 / 12"
    );

    await solveAll12(page);

    /* Unlocked: 12 of 12, completion wording, both take-buttons, rail ticks. */
    await expect(page.getByTestId("lab-cert-count")).toHaveText("12");
    await expect(page.getByTestId("lab-cert")).toContainText("All twelve");
    await expect(page.getByTestId("lab-cert-copy")).toBeVisible();
    await expect(page.getByTestId("lab-cert-png")).toBeVisible();
    await expect(page.getByTestId("lab-contents-progress")).toContainText(
      "12 / 12"
    );
    await expect(page.locator(".lab-contents-link.is-done")).toHaveCount(12);

    /* PNG renders client-side and downloads (no third-party request). */
    const downloadPromise = page.waitForEvent("download");
    await page.getByTestId("lab-cert-png").click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(
      /^response-option-fit-keepsake-ROF-[0-9A-Z]{4}-[0-9A-Z]{4}\.png$/
    );

    /* Markdown copy reports success. */
    await page.getByTestId("lab-cert-copy").click();
    await expect(page.getByTestId("lab-cert-status")).toBeVisible();

    /* The fully-solved state — twelve receipts, the unlocked certificate, the
       progress bar — has no axe WCAG or landmark (best-practice) violations
       either. Receipts are plain regions (not stacked complementary landmarks)
       and the progress bar is a real progressbar. */
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.evaluate(async () => {
      for (let y = 0; y <= document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 15));
      }
      window.scrollTo(0, 0);
    });
    const solvedAxe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
      .analyze();
    expect(solvedAxe.violations.map((v) => `${v.id} (${v.nodes.length})`)).toEqual(
      []
    );
  });

  test("Remember turns off, stays off, and the off choice persists across reload", async ({
    page
  }) => {
    await page.goto(`${BASE_URL}/`);
    await page.getByTestId("settings-button").click();
    await page.getByTestId("settings-drawer").waitFor();
    const toggle = page.getByTestId("settings-remember");
    await expect(toggle).toBeChecked();
    /* The checkbox is visually hidden behind a custom track/thumb (the
       accessible toggle pattern), so drive it the way a user would: click the
       visible label rather than the 1px input. */
    await page.getByTestId("settings-drawer").locator(".settings-toggle").click();
    /* Regression: the off path used to reset state to the default (on), so the
       toggle snapped right back to checked and could not be turned off. */
    await expect(toggle).not.toBeChecked();

    await page.reload();
    await page.getByTestId("settings-button").click();
    await page.getByTestId("settings-drawer").waitFor();
    await expect(page.getByTestId("settings-remember")).not.toBeChecked();
  });

  test("keyboard: skip link, dialog focus trap, rail jump, and widget operation", async ({
    page
  }) => {
    await page.goto(`${BASE_URL}/`);
    await page.waitForSelector("#survey-lab-title");

    /* The skip link is the first focusable element and lands on the heading. */
    await page.keyboard.press("Tab");
    await expect(page.getByTestId("skip-link")).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#survey-lab-title")).toBeFocused();

    /* The Settings dialog traps focus and returns it to the opener on Escape. */
    await page.getByTestId("settings-button").focus();
    await page.getByTestId("settings-button").press("Enter");
    await page.getByTestId("settings-drawer").waitFor();
    for (let i = 0; i < 8; i++) await page.keyboard.press("Tab");
    expect(
      await page.evaluate(
        () => !!document.activeElement?.closest("[data-testid=settings-drawer]")
      )
    ).toBe(true);
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("settings-button")).toBeFocused();

    /* Activating a contents-rail link by keyboard moves focus to the labelled
       live loop, not just a silent scroll. */
    await page.getByText("Jump to exercise").click();
    await page.getByTestId("lab-contents-link-7").press("Enter");
    await expect(page.getByTestId("lab-live-loop-7")).toBeFocused();

    /* An exercise is fully operable from the keyboard. */
    await page.getByTestId("lab-scale-points-11").press("Enter");
    await page.getByTestId("lab-scale-points-7").press("Enter");
    await expect(page.getByTestId("lab-receipt-E6")).toBeVisible();
  });

  test("no WCAG 2 AA accessibility violations (axe-core) on the lab or the colophon", async ({
    page
  }) => {
    for (const [path, sel] of [
      ["/", "#survey-lab-title"],
      ["/#colophon", "#colophon-title"]
    ] as const) {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`${BASE_URL}${path}`);
      await page.waitForSelector(sel);
      /* Settle every reveal-on-scroll section to full opacity before scanning,
         so the scan reflects the contrast a reader actually sees, not a frame
         caught mid-reveal. */
      await page.evaluate(async () => {
        for (let y = 0; y <= document.body.scrollHeight; y += 500) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 20));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(200);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(
        results.violations.map((v) => `${v.id} (${v.nodes.length} nodes)`),
        path
      ).toEqual([]);
    }
  });

  test("no freeform input, third-party runtime requests, or desktop overflow", async ({ page }) => {
    const offsite: string[] = [];
    const allowedHost = new URL(BASE_URL).host;
    page.on("request", (request) => {
      const raw = request.url();
      if (raw.startsWith("blob:") || raw.startsWith("data:")) return;
      const url = new URL(raw);
      if (url.host && url.host !== allowedHost) {
        offsite.push(raw);
      }
    });

    for (const route of ["/", "/#colophon"]) {
      await page.goto(`${BASE_URL}${route}`);
      await expect(page.locator("textarea")).toHaveCount(0);
      await expect(page.locator('input[type="text"], input:not([type])')).toHaveCount(0);
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        bodyScrollWidth: document.body.scrollWidth
      }));
      expect(overflow.scrollWidth, route).toBeLessThanOrEqual(overflow.clientWidth + 1);
      expect(overflow.bodyScrollWidth, route).toBeLessThanOrEqual(
        overflow.clientWidth + 1
      );
    }
    expect(offsite, `unexpected offsite requests: ${offsite.join(", ")}`).toEqual([]);
  });

  test("forced colors and reduced motion keep interactions readable", async ({ page }) => {
    await page.emulateMedia({ forcedColors: "active" });
    await page.goto(`${BASE_URL}/`);
    await expect(page.locator("#survey-lab-title")).toBeVisible();
    await expect(page.getByTestId("lab-contents")).toBeVisible();

    await page.emulateMedia({ forcedColors: "none", reducedMotion: "reduce" });
    await page.goto(`${BASE_URL}/`);
    await expect(page.getByTestId("lab-contents")).toBeVisible();

    /* The global reduced-motion rule must collapse every animation to an
       instant final state. It was once silently lost in a CSS prune while the
       colophon still claimed it, so lock the actual computed duration in. */
    const animMs = await page
      .locator(".lab-exercises > li")
      .first()
      .evaluate((el) => {
        const d = getComputedStyle(el).animationDuration;
        const v = parseFloat(d);
        return d.trim().endsWith("ms") ? v : v * 1000;
      });
    expect(animMs).toBeLessThanOrEqual(1);
  });
});

test.describe("Response Option Fit Lab - mobile", () => {
  test("mobile routes stay interactive and avoid horizontal overflow", async ({ page }, testInfo) => {
    testInfo.skip(testInfo.project.name !== "mobile", "mobile only");
    for (const route of ["/", "/#colophon"]) {
      await page.goto(`${BASE_URL}${route}`);
      await expect(page.locator(".lab").first()).toBeVisible();
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      }));
      expect(overflow.scrollWidth, route).toBeLessThanOrEqual(overflow.clientWidth + 1);
    }
  });

  test("visible tap targets meet the WCAG 2.5.8 AA minimum", async ({
    page
  }, testInfo) => {
    testInfo.skip(testInfo.project.name !== "mobile", "mobile only");
    await page.goto(`${BASE_URL}/`);

    const tooSmallTargets = await page.evaluate(() => {
      const selectors = [
        "button",
        "a[href]",
        "input:not([type='hidden'])",
        "select",
        "textarea",
        "summary",
        "[role='button']",
        "[role='checkbox']",
        "[role='radio']",
        "[role='switch']",
        "[role='tab']",
        "[tabindex]:not([tabindex='-1'])"
      ].join(",");

      return Array.from(document.querySelectorAll<HTMLElement>(selectors))
        .filter((el) => {
          if (el.matches("[disabled],[aria-disabled='true']")) return false;
          const style = window.getComputedStyle(el);
          if (style.display === "none" || style.visibility === "hidden") return false;
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        })
        .map((el) => {
          const rect = el.getBoundingClientRect();
          return {
            label:
              el.getAttribute("data-testid") ||
              el.getAttribute("aria-label") ||
              el.textContent?.trim().replace(/\s+/g, " ").slice(0, 80) ||
              el.tagName.toLowerCase(),
            tag: el.tagName.toLowerCase(),
            width: Math.round(rect.width * 10) / 10,
            height: Math.round(rect.height * 10) / 10
          };
        })
        .filter((target) => Math.min(target.width, target.height) < 24);
    });

    expect(tooSmallTargets).toEqual([]);
  });
});
