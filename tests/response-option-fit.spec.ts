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
    expect(workbenchSpecimens.map((item) => item.id)).not.toContain("ons-kashmiri");
    expect(workbenchSpecimens.map((item) => item.id)).not.toContain(
      "ons-ethnic-group-heading"
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

  test("hub frames the app as interactive and embeds an interactive first puzzle", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page.getByTestId("hero")).toContainText("Interactive problem lab");
    await expect(page.getByTestId("scope-receipt")).toContainText("interactive puzzles");
    await expect(page.getByTestId("featured-example")).toContainText("One puzzle");
    await expect(page.getByTestId("workbench-ride-hailing").locator('[data-interactive="true"]')).toBeVisible();
    await expect(page.getByTestId("exposition-ride-hailing")).toHaveCount(0);
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

  test("kept bespoke mechanics expose their second-wave additions", async ({ page }) => {
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

  test("replacement examples render the new active slate and retire old identity routes", async ({ page }) => {
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

    await page.goto(`${BASE_URL}/#walk/ons-kashmiri`);
    await expect(page.getByTestId("hub")).toBeVisible();
    await expect(page.getByText(/Kashmiri/i)).toHaveCount(0);

    await page.goto(`${BASE_URL}/#walk/ons-ethnic-group-heading`);
    await expect(page.getByTestId("hub")).toBeVisible();
    await expect(page.getByText(/ethnic-group/i)).toHaveCount(0);
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
    page.on("request", (request) => {
      const raw = request.url();
      if (raw.startsWith("blob:") || raw.startsWith("data:")) return;
      const url = new URL(raw);
      if (url.host && url.host !== "localhost:4173" && url.host !== "127.0.0.1:4173") {
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
      await expect(page.locator('[data-interactive="true"], [data-testid="build-and-break-route"]').first()).toBeVisible();
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      }));
      expect(overflow.scrollWidth, route).toBeLessThanOrEqual(overflow.clientWidth + 1);
    }
  });
});
