import { expect, test, type Locator, type Page } from "@playwright/test";
import {
  buildTopics,
  evaluateTopic,
  makeExportTable
} from "../src/data/build-and-break";
import { playFormVignettes, recordOutcome } from "../src/data/play-the-form";
import { workbenchSpecimens } from "../src/data/workbench-specimens";
import { interactivePuzzleBySpecimenId } from "../src/components/Workbench";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4173";

async function chooseBuildOption(page: Page, topicId: string, optionId: string) {
  await page.getByTestId(`build-option-${topicId}-${optionId}`).click();
}

type InteractionScenario = {
  id: string;
  act: (page: Page) => Promise<void>;
  consequence: (page: Page) => Locator;
};

const interactionScenarios: InteractionScenario[] = [
  {
    id: "ride-hailing",
    act: async (page) => {
      await page.getByTestId("mode-pick-ride-hailing-app-stored").click();
      await page.getByTestId("mode-pick-ride-hailing-taxi-stored").click();
      await page.getByTestId("mode-pick-ride-hailing-carpool-outside").click();
      await page.getByTestId("mode-pick-ride-hailing-bike-outside").click();
    },
    consequence: (page) => page.locator(".collision-export")
  },
  {
    id: "business-industry",
    act: async (page) => {
      await page.getByTestId("zoom-stop-business-industry-industry").click();
    },
    consequence: (page) => page.locator(".zoom-ledger")
  },
  {
    id: "refrigerated-medicine",
    act: async (page) => {
      await page.getByTestId("puzzle-record-sam-no").click();
    },
    consequence: (page) => page.getByTestId("puzzle-outcome-sam")
  },
  {
    id: "electric-vehicle-type",
    act: async (page) => {
      await page.getByTestId("ev-rule-electric-vehicle-type-plug").click();
    },
    consequence: (page) => page.getByTestId("ev-result-electric-vehicle-type-regular-hybrid")
  },
  {
    id: "owner-advertising",
    act: async (page) => {
      await page.getByTestId("leak-answer-owner-advertising-yes").click();
      await page.getByTestId("leak-fix-owner-advertising-scope").click();
    },
    consequence: (page) => page.getByTestId("leak-trace-owner-advertising")
  },
  {
    id: "usual-hours",
    act: async (page) => {
      await page.getByTestId("flatten-option-usual-hours-average").click();
    },
    consequence: (page) => page.locator(".flatten-stamp")
  },
  {
    id: "notebook-computer",
    act: async (page) => {
      for (const card of ["laptop", "chromebook", "tablet", "paper"]) {
        await page.getByTestId(`notebook-card-notebook-computer-${card}`).click();
      }
    },
    consequence: (page) => page.getByTestId("notebook-result-notebook-computer-paper")
  },
  {
    id: "move-reason-catchall",
    act: async (page) => {
      for (const bucket of ["other-housing", "other-job", "other-family"]) {
        await page.getByTestId(`move-open-move-reason-catchall-${bucket}`).click();
      }
      await page.getByTestId("move-recode-move-reason-catchall").click();
    },
    consequence: (page) => page.getByTestId("move-drawer-move-reason-catchall-other-housing")
  },
  {
    id: "sump-pump",
    act: async (page) => {
      await page.getByTestId("sump-gate-sump-pump-failed-eligible-yes").click();
      await page.getByTestId("sump-gate-sump-pump-worked-eligible-no").click();
      await page.getByTestId("sump-gate-sump-pump-no-pump-not-applicable").click();
      await page.getByTestId("sump-gate-sump-pump-other-water-eligible-no").click();
    },
    consequence: (page) => page.getByTestId("sump-feedback-sump-pump-no-pump")
  },
  {
    id: "tv-connected-devices",
    act: async (page) => {
      await page.getByTestId("tv-rule-tv-connected-devices-plays-through").click();
    },
    consequence: (page) => page.getByTestId("tv-result-tv-connected-devices-apple-tv")
  },
  {
    id: "avoid-natural-disasters",
    act: async (page) => {
      await page.getByTestId("disaster-threshold-avoid-natural-disasters-any").click();
    },
    consequence: (page) => page.getByTestId("disaster-result-avoid-natural-disasters-secondary")
  },
  {
    id: "acs-weeks-worked",
    act: async (page) => {
      await page.getByTestId("weeks-recipe-acs-weeks-worked-inclusive").click();
    },
    consequence: (page) => page.getByTestId("weeks-total-acs-weeks-worked")
  }
];

test.describe("Response Option Fit Lab - interaction contract", () => {
  test("every specimen has an interactive puzzle renderer and unique id", () => {
    expect(workbenchSpecimens).toHaveLength(12);
    expect(new Set(workbenchSpecimens.map((item) => item.id)).size).toBe(12);
    expect(workbenchSpecimens.map((item) => item.id)).toEqual(
      interactionScenarios.map((item) => item.id)
    );
    for (const specimen of workbenchSpecimens) {
      expect(
        interactivePuzzleBySpecimenId[specimen.id],
        `${specimen.id} has a registered interaction`
      ).toBeTruthy();
      expect(specimen.answerFrame.prompt.length).toBeGreaterThan(0);
    }
  });

  test("play-the-form: a no-medicine household is mis-recorded under No until the gate exists", () => {
    const sam = playFormVignettes.find((v) => v.isTrap);
    expect(sam).toBeTruthy();
    expect(recordOutcome(sam!, "no", false)).toMatchObject({
      honest: false,
      viaFollowUp: false
    });
    expect(recordOutcome(sam!, "no", true)).toMatchObject({
      honest: true,
      viaFollowUp: true
    });
  });

  test("build-and-break export still hides clean and forced records under one tidy label", () => {
    const topic = buildTopics.find((item) => item.id === "commute")!;
    const chosen = ["car-alone", "train", "bus", "bike"];
    const result = evaluateTopic(topic, chosen);
    const table = makeExportTable(result, chosen);
    const droveAlone = table.rows.find((row) => row.optionId === "car-alone");
    expect(droveAlone).toBeTruthy();
    expect(droveAlone!.results.map((item) => item.situation.id).sort()).toEqual([
      "marco",
      "owen"
    ]);
    expect(droveAlone!.results.some((item) => item.fate === "clean")).toBe(true);
    expect(droveAlone!.results.some((item) => item.fate === "forced")).toBe(true);
  });
});

test.describe("Response Option Fit Lab - desktop", () => {
  test.beforeEach(({}, testInfo) => {
    testInfo.skip(testInfo.project.name !== "desktop", "desktop only");
  });

  test("the lab home (/) loads the SQLBolt-style multi-exercise practice page", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page.locator("#survey-lab-title")).toContainText(
      "The quiet ways a survey lies"
    );
    /* Nine exercise cards present. */
    await expect(page.locator(".lab-exercise")).toHaveCount(9);
    /* Each named with its primary verb. */
    const verbs = await page.locator(".lab-exercise-verb").allInnerTexts();
    expect(verbs.length).toBe(9);
    /* The closing knowledge map carries the four SLOT/RULER/PUSH/BOUNDARY
       branches with the marker legend. */
    await expect(page.getByTestId("lab-km")).toBeVisible();
    await expect(page.locator(".lab-km-branch")).toHaveCount(4);
    await expect(page.locator(".lab-km-legend")).toBeVisible();
  });

  test("the lab's #lab and / hashes are equivalent", async ({ page }) => {
    await page.goto(`${BASE_URL}/#lab`);
    await expect(page.locator("#survey-lab-title")).toContainText(
      "The quiet ways a survey lies"
    );
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

  test("E7 don't-know/NA: only the design with both opt-outs keeps neutral, DK, and NA distinct", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    /* Adding only DK clears the scale (Task 1) but lumps never-tried into
       Don't-know, so Task 2 stays open until NA is added too. */
    await page.getByTestId("lab-oat-design-dk").click();
    await expect(page.getByTestId("lab-oat-pass")).toHaveCount(0);
    await page.getByTestId("lab-oat-design-both").click();
    await expect(page.getByTestId("lab-oat-pass")).toBeVisible();
    await expect(page.getByTestId("lab-receipt-E7")).toBeVisible();
  });

  test("E8 false premise: the feature screener cleans the denominator, the app screener splits the drop-outs", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    /* Bare Yes/No: people who never used order-ahead are merged into the
       answers (no basis). The feature screener clears them; the app
       screener (added on top) makes the funnel informative. */
    await page.getByTestId("lab-fp-gate-feature").click();
    await expect(page.getByTestId("lab-fp-pass")).toHaveCount(0);
    await page.getByTestId("lab-fp-gate-app").click();
    await expect(page.getByTestId("lab-fp-pass")).toBeVisible();
    await expect(page.getByTestId("lab-receipt-E8")).toBeVisible();
    /* A never-installed customer is screened out, not answering. */
    await expect(page.getByTestId("lab-fp-landing-eve")).toContainText(
      "Screened out"
    );
  });

  test("E9 acquiescence: a reverse-worded check only detects yea-sayers; item-specific wording is the real fix", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    /* Task 1 wants the reverse-worded check (detection); Task 2 wants the
       item-specific wording (measurement). */
    await page.getByTestId("lab-acq-design-reverse").click();
    await expect(page.getByTestId("lab-acq-pass")).toHaveCount(0);
    await page.getByTestId("lab-acq-design-item").click();
    await expect(page.getByTestId("lab-acq-pass")).toBeVisible();
    await expect(page.getByTestId("lab-receipt-E9")).toBeVisible();
  });

  test("E1 scale builder runs honest → round-up → order-flip → hostile and reveals the flip", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    /* Ships as a 2-point leading scale reading 4 of 5. */
    await expect(page.locator(".lab-tally").first()).toContainText("4 of 5");
    /* Make it honest: plain stem + a balanced 5-point scale. */
    await page.getByTestId("lab-stem-plain").click();
    await page.getByTestId("lab-point-vsat").click();
    await page.getByTestId("lab-point-neutral").click();
    await page.getByTestId("lab-point-vdis").click();
    /* Round the fence-sitter up: drop the neutral. */
    await page.getByTestId("lab-point-neutral").click();
    /* Flip her back with nothing but order. */
    await page.getByTestId("lab-order-negative-first").click();
    await expect(page.locator('[data-testid="lab-task-order"].is-done')).toHaveCount(1);
    /* Now play the shop: leading + drop strong negatives + add a soft positive. */
    await page.getByTestId("lab-stem-leading").click();
    await page.getByTestId("lab-point-dis").click();
    await page.getByTestId("lab-point-vdis").click();
    await page.getByTestId("lab-point-ssat").click();
    await expect(page.locator(".lab-flip")).toBeVisible();
    await expect(page.getByTestId("lab-receipt-E1")).toBeVisible();
  });

  test("E4 channel set: 'Other' alone can't rescue low-effort visitors; the trim task needs the broad/Other padding gone", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    const clean = page.locator(".lab-channel-tally.is-clean strong");
    await expect(clean).toHaveText("3");
    /* Adding only "Other" does NOT raise the clean count — the missing-channel
       visitors are low-effort and won't write one in. */
    await page.getByTestId("lab-channel-other").click();
    await expect(clean).toHaveText("3");
    /* Add the four missing specific channels → everyone lands clean. */
    for (const id of ["wordofmouth", "podcast", "walkby", "event"]) {
      await page.getByTestId(`lab-channel-${id}`).click();
    }
    await expect(clean).toHaveText("7");
    /* Task 2 (trim) is still pending while the unused "Other" pads the list. */
    await expect(page.getByTestId("lab-channel-pass")).toHaveCount(0);
    /* Drop the padding → both tasks complete. */
    await page.getByTestId("lab-channel-other").click();
    await expect(page.getByTestId("lab-channel-pass")).toBeVisible();
    await expect(page.getByTestId("lab-receipt-E4")).toBeVisible();
    /* Cleo (an acquaintance referral) lands on a true word-of-mouth option. */
    await expect(page.getByTestId("lab-channel-landing-cleo")).toContainText(
      "Someone else mentioned us"
    );
  });

  test("E5 ship-review passes only when each draft part gets the right lens", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
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

  test("archived hub (now at #hub) frames the app as interactive and embeds an interactive first puzzle", async ({ page }) => {
    await page.goto(`${BASE_URL}/#hub`);
    await expect(page.getByTestId("hero")).toContainText("Interactive problem lab");
    await expect(page.getByTestId("scope-receipt")).toContainText("interactive puzzles");
    await expect(page.getByTestId("featured-example")).toContainText("One puzzle");
    await expect(page.getByTestId("workbench-ride-hailing").locator('[data-interactive="true"]')).toBeVisible();
    await expect(page.getByTestId("exposition-ride-hailing")).toHaveCount(0);
  });

  test("archived hub's opening hook is a plausible survey intake, not a detached word puzzle", async ({ page }) => {
    await page.goto(`${BASE_URL}/#hub`);
    const hook = page.getByTestId("featured-hook");
    await expect(hook).not.toContainText("A field says “one word only.” Would this count?");
    await expect(hook).toContainText("A survey asks for one word. Four honest answers arrive.");
    await expect(hook).toContainText("In one word, what was your usual way to get to work last week?");
    await expect(hook).toContainText("one word only");

    for (const [id, value] of [
      ["bus", "bus"],
      ["ride-hailing", "ride-hailing"],
      ["car-pool", "car pool"],
      ["bike-share", "bike share"]
    ] as const) {
      await expect(page.getByTestId(`featured-hook-case-${id}`)).toContainText(value);
    }

    await expect(page.locator(".featured-hook-reveal-inner")).toHaveCount(0);
    await expect(hook).toContainText("Accept it");
    await expect(hook).toContainText("Reject it");
    await expect(hook).toContainText("Needs a rule");
    await page.getByTestId("featured-hook-route-bus-accept").click();
    await expect(page.getByTestId("featured-hook-ledger")).toContainText(/1\s*Accepted/);
    await expect(page.getByTestId("featured-hook-ledger")).toContainText("Rejected");
    await expect(page.getByTestId("featured-hook-ledger")).toContainText("Needs rule");
    await page.getByTestId("featured-hook-route-ride-hailing-rule").click();
    await page.getByTestId("featured-hook-route-car-pool-reject").click();
    await expect(page.getByTestId("featured-hook-ledger")).toContainText("Not decided");
    await expect(page.locator(".featured-hook-reveal-inner")).toHaveCount(0);
    await expect(page.getByTestId("featured-hook-ledger")).toContainText(
      "Decide all four responses"
    );
    await page.getByTestId("featured-hook-route-bike-share-rule").click();
    await expect(page.getByTestId("featured-hook-reveal")).toContainText(
      "truthful answer meets an underspecified answer place"
    );
    await expect(page.locator(".featured-hook-reveal-inner")).toBeInViewport();
  });

  test("archived hub main journey copy uses the current puzzle-first CTA labels", async ({ page }) => {
    await page.goto(`${BASE_URL}/#hub`);
    const hub = page.getByTestId("hub");
    await expect(hub).not.toContainText("sourced example");
    await expect(hub).not.toContainText("storage rule");
    await expect(hub).not.toContainText("Store it");
    await expect(hub).not.toContainText("Stored");
    await expect(hub).not.toContainText("You are the form");
    await expect(page.getByTestId("hero-cta-row")).toContainText("Try the first puzzle");
    await expect(page.getByTestId("hero-cta-row")).toContainText(
      "Check your own survey draft"
    );
    await expect(page.getByTestId("hero-cta-row")).toContainText(
      "Build an answer set"
    );
    await expect(page.getByTestId("hero-cta-row")).toContainText(
      "Walk all twelve puzzles"
    );
    await expect(page.locator("body")).toContainText("Open the reference shelf");

    await page.goto(`${BASE_URL}/#build`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Build an answer set"
    );

    await page.goto(`${BASE_URL}/#reference`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Reference shelf"
    );
  });

  test("all twelve walk routes render an interaction and never fall back to exposition", async ({ page }) => {
    for (const specimen of workbenchSpecimens) {
      await page.goto(`${BASE_URL}/#walk/${specimen.id}`);
      const workbench = page.getByTestId(`workbench-${specimen.id}`);
      await expect(workbench.locator('[data-interactive="true"]')).toBeVisible();
      await expect(page.getByTestId(`exposition-${specimen.id}`)).toHaveCount(0);
      await expect(page.locator(`#${specimen.id}-workbench-title`)).toBeVisible();
    }
  });

  test("all twelve puzzles require action, show a visible consequence, and then reveal", async ({ page }) => {
    for (const scenario of interactionScenarios) {
      await page.goto(`${BASE_URL}/#walk/${scenario.id}`);
      await expect(page.getByTestId(`puzzle-reveal-${scenario.id}`)).toHaveCount(0);
      await scenario.act(page);
      await expect(scenario.consequence(page), scenario.id).toBeVisible();
      await expect(page.getByTestId(`puzzle-reveal-${scenario.id}`), scenario.id).toBeVisible();
    }
  });

  test("selected puzzles expose current interaction details", async ({ page }) => {
    await page.goto(`${BASE_URL}/#walk/business-industry`);
    await page.getByTestId("zoom-stop-business-industry-industry").click();
    await expect(page.locator(".zoom-ledger")).toContainText("Mixed-level ledger");
    await expect(page.getByTestId("puzzle-reveal-business-industry")).toContainText(
      "The next coder"
    );

    await page.goto(`${BASE_URL}/#walk/refrigerated-medicine`);
    await page.getByTestId("puzzle-record-sam-no").click();
    await expect(page.getByTestId("puzzle-outcome-sam")).toContainText("invented");
    await page.getByTestId("puzzle-add-followup-refrigerated-medicine").click();
    await expect(page.getByTestId("puzzle-repair-done-refrigerated-medicine")).toContainText(
      "sump-pump"
    );
    await page.getByTestId("puzzle-record-sam-no").click();
    await expect(page.getByTestId("puzzle-outcome-sam")).toContainText("honest now");

    await page.goto(`${BASE_URL}/#walk/owner-advertising`);
    await page.getByTestId("leak-answer-owner-advertising-yes").click();
    await expect(page.getByTestId("leak-trace-owner-advertising")).toContainText(
      "double-counted"
    );
    await page.getByTestId("leak-fix-owner-advertising-scope").click();
    await expect(page.getByTestId("leak-fix-outcome-owner-advertising")).toContainText(
      "Leak closed"
    );

    await page.goto(`${BASE_URL}/#walk/usual-hours`);
    await expect(page.locator(".flatten-ghost")).toContainText("Steady coworker");
    await page.getByTestId("flatten-option-usual-hours-average").click();
    await expect(page.getByTestId("puzzle-reveal-usual-hours")).toContainText(
      "The swing is gone"
    );
  });

  test("active slate examples render and unknown walk routes return to the hub", async ({ page }) => {
    await page.goto(`${BASE_URL}/#walk/move-reason-catchall`);
    await expect(page.locator("#move-reason-catchall-workbench-title")).toContainText(
      "Other housing reason"
    );
    await expect(page.getByTestId("puzzle-interactive-move-reason-catchall")).toContainText(
      "write-in recoding"
    );

    await page.goto(`${BASE_URL}/#walk/tv-connected-devices`);
    await expect(page.locator("#tv-connected-devices-workbench-title")).toContainText(
      "Is Apple TV a TV"
    );
    await expect(page.getByTestId("puzzle-interactive-tv-connected-devices")).toContainText(
      "Apple TV"
    );

    await page.goto(`${BASE_URL}/#walk/not-a-current-specimen`);
    /* Unknown walk specimens now fall back to the lab home (not the archived hub). */
    await expect(page.locator("#survey-lab-title")).toBeVisible();
    await expect(page.getByTestId("workbench-not-a-current-specimen")).toHaveCount(0);
  });

  test("replacement source anchors stay in optional source surfaces until opened", async ({ page }) => {
    await page.goto(`${BASE_URL}/#walk/move-reason-catchall`);
    const moveSource = page.getByTestId("puzzle-source-move-reason-catchall");
    await expect(moveSource).toContainText("Optional real-world anchor");
    await expect(page.getByText("CPS ASEC User Note")).toBeHidden();
    await moveSource.locator("summary").click();
    await expect(page.getByText("CPS ASEC User Note")).toBeVisible();

    await page.goto(`${BASE_URL}/#walk/tv-connected-devices`);
    const tvSource = page.getByTestId("puzzle-source-tv-connected-devices");
    await expect(tvSource).toContainText("Optional real-world anchor");
    await expect(page.getByText("RSM2024-10")).toBeHidden();
    await tvSource.locator("summary").click();
    await expect(page.getByText("RSM2024-10")).toBeVisible();
  });

  test("build route source context is optional and the export interaction still works", async ({ page }) => {
    await page.goto(`${BASE_URL}/#build`);
    await expect(page.getByTestId("build-source-commute")).toContainText(
      "Optional source note"
    );
    for (const optionId of ["car-alone", "train", "bus", "bike"]) {
      await chooseBuildOption(page, "commute", optionId);
    }
    await page.getByTestId("build-run-commute").click();
    await page.getByTestId("build-export-decompose-commute").click();
    await expect(page.getByTestId("build-fate-commute-dana")).toHaveText("Split");
    await expect(page.getByTestId("build-fate-commute-marco")).toHaveText("Forced");
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

    for (const route of [
      "/",
      "/#walk/ride-hailing",
      "/#walk/move-reason-catchall",
      "/#walk/tv-connected-devices",
      "/#build",
      "/#field-guide"
    ]) {
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
    await page.goto(`${BASE_URL}/#walk/ride-hailing`);
    await expect(page.getByTestId("workbench-ride-hailing").locator('[data-interactive="true"]')).toBeVisible();

    await page.emulateMedia({ forcedColors: "none", reducedMotion: "reduce" });
    await page.goto(`${BASE_URL}/#walk/notebook-computer`);
    await expect(page.getByTestId("puzzle-interactive-notebook-computer")).toBeVisible();
  });
});

test.describe("Response Option Fit Lab - mobile", () => {
  test("mobile routes stay interactive and avoid horizontal overflow", async ({ page }, testInfo) => {
    testInfo.skip(testInfo.project.name !== "mobile", "mobile only");
    for (const route of [
      "/",
      ...workbenchSpecimens.map((specimen) => `/#walk/${specimen.id}`),
      "/#build"
    ]) {
      await page.goto(`${BASE_URL}${route}`);
      await expect(page.locator('[data-interactive="true"], [data-testid="build-and-break-route"], #survey-lab').first()).toBeVisible();
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      }));
      expect(overflow.scrollWidth, route).toBeLessThanOrEqual(overflow.clientWidth + 1);
    }
  });
});
