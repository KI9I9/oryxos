import { expect, test } from "./site-fixtures";

const englishNavigation = [
  ["Architecture", "/oryxos/architecture"],
  ["Roadmap", "/oryxos/roadmap"],
  ["Documentation", "/oryxos/docs/"],
  ["Community", "/oryxos/community"]
] as const;

test("primary navigation stays inside the English locale", async ({ page }) => {
  await page.goto("./");

  for (const [label, href] of englishNavigation) {
    await expect(page.getByRole("link", { name: label, exact: true }).first()).toHaveAttribute("href", href);
  }
});

test("navigation and locale switch are keyboard reachable", async ({ page }) => {
  await page.goto("./architecture");
  await page.keyboard.press("Tab");

  let foundLocaleSwitcher = false;
  for (let tabIndex = 0; tabIndex < 20; tabIndex += 1) {
    const focusedTestId = await page.locator(":focus").getAttribute("data-testid");
    if (focusedTestId === "locale-switcher") {
      foundLocaleSwitcher = true;
      break;
    }
    await page.keyboard.press("Tab");
  }

  expect(foundLocaleSwitcher).toBe(true);
});
