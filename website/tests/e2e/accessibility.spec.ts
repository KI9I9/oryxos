import type { Page } from "@playwright/test";

import { expect, test } from "./site-fixtures";
import { scanPageForAccessibilityViolations } from "./accessibility";

const representativeRoutes = [
  "./",
  "./architecture",
  "./docs/runtime/skill-profile",
  "./community",
  "./zh/",
  "./zh/docs/runtime/skill-profile"
];

async function expectNoBlockingAccessibilityViolations(page: Page): Promise<void> {
  const scanResult = await scanPageForAccessibilityViolations(page);
  const blockingViolations = scanResult.violations.filter(
    (violation) => violation.impact === "critical" || violation.impact === "serious"
  );
  const blockingViolationSummary = blockingViolations.map((violation) => ({
    id: violation.id,
    nodes: violation.nodes.map((node) => ({
      target: node.target,
      failureSummary: node.failureSummary
    }))
  }));

  expect(blockingViolationSummary).toEqual([]);
}

for (const route of representativeRoutes) {
  test(`${route} has accessible structure and no blocking axe violations`, async ({ page }) => {
    await page.goto(route);

    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

    const informativeImagesWithoutAlt = await page.locator("img").evaluateAll((images) =>
      images.filter((image) => image.getAttribute("alt") === null).length
    );
    expect(informativeImagesWithoutAlt).toBe(0);

    await expectNoBlockingAccessibilityViolations(page);
  });
}

test("primary navigation and locale switching remain keyboard reachable", async ({ page }) => {
  await page.goto("./architecture");
  await page.keyboard.press("Tab");

  let localeSwitcherReached = false;
  for (let tabIndex = 0; tabIndex < 20; tabIndex += 1) {
    const focusedTestId = await page.locator(":focus").getAttribute("data-testid");
    if (focusedTestId === "locale-switcher") {
      localeSwitcherReached = true;
      break;
    }

    await expect(page.locator(":focus-visible")).toBeVisible();
    await page.keyboard.press("Tab");
  }

  expect(localeSwitcherReached).toBe(true);
});
