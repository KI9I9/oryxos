import { expect, test } from "./site-fixtures";
import { requiredViewports } from "./viewports";

async function getBodyOverflow(page: import("@playwright/test").Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
}

for (const viewport of requiredViewports) {
  test(`home has no body overflow at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("./");

    expect(await getBodyOverflow(page)).toBeLessThanOrEqual(1);
  });
}

for (const route of [
  "./architecture",
  "./docs/interfaces/rest-api",
  "./community",
  "./zh/docs/runtime/skill-profile"
]) {
  test(`${route} contains long-form content without mobile overflow`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(route);

    expect(await getBodyOverflow(page)).toBeLessThanOrEqual(1);
  });
}

for (const viewportWidth of [767, 768, 959]) {
  test(`mobile navigation remains usable at ${viewportWidth}px`, async ({ page }) => {
    await page.setViewportSize({ width: viewportWidth, height: 900 });
    await page.goto("./");

    const mobileNavigationButton = page.getByRole("button", { name: "mobile navigation" });
    await expect(mobileNavigationButton).toBeVisible();
    await expect(mobileNavigationButton).toHaveAttribute("aria-expanded", "false");

    await mobileNavigationButton.click();
    await expect(mobileNavigationButton).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#VPNavScreen")).toBeVisible();
    await expect(page.locator("#VPNavScreen").getByRole("link", { name: "Architecture" })).toBeVisible();
  });
}

test("desktop navigation replaces the mobile menu at 960px", async ({ page }) => {
  await page.setViewportSize({ width: 960, height: 900 });
  await page.goto("./");

  await expect(page.getByRole("navigation", { name: "Main Navigation" })).toBeVisible();
  await expect(page.getByRole("button", { name: "mobile navigation" })).toBeHidden();
});

test("representative documentation route remains usable at 200 percent zoom", async ({ page }) => {
  // A 1280px display at 200% browser zoom has a 640 CSS-pixel layout viewport.
  await page.setViewportSize({ width: 640, height: 450 });
  await page.goto("./docs/runtime/skill-profile");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await getBodyOverflow(page)).toBeLessThanOrEqual(1);
});

test("reduced-motion preference disables smooth scrolling and long transitions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");

  const reducedMotionStyles = await page.evaluate(() => ({
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    transitionDuration: getComputedStyle(
      document.querySelector<HTMLElement>(".button--primary")!
    ).transitionDuration
  }));

  expect(reducedMotionStyles.scrollBehavior).toBe("auto");
  expect(reducedMotionStyles.transitionDuration).not.toBe("0.25s");
});
