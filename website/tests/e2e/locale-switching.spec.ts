import { expect, getCounterpart, getRequiredPages, test } from "./site-fixtures";

test("every required route exposes its exact locale counterpart", async ({ page, pageRecords }) => {
  test.setTimeout(120_000);

  for (const pageRecord of getRequiredPages(pageRecords)) {
    const counterpart = getCounterpart(pageRecords, pageRecord);
    await page.goto(`.${pageRecord.route}`);

    const localeSwitcher = page.getByTestId("locale-switcher");
    const expectedAccessibleLabel =
      pageRecord.locale === "root" ? "切换到简体中文" : "Switch to English";

    await expect(localeSwitcher, `${pageRecord.locale}:${pageRecord.pageId}`).toHaveAttribute(
      "href",
      `/oryxos${counterpart.route}`
    );
    await expect(localeSwitcher).toHaveAttribute("aria-label", expectedAccessibleLabel);
  }
});

test("hidden fallback fixture resolves to the explicit Chinese fallback", async ({ page }) => {
  await page.goto("./test-fixtures/locale-fallback");
  await expect(page.getByTestId("locale-switcher")).toHaveAttribute(
    "href",
    "/oryxos/zh/translation-unavailable"
  );
});

test("locale switch activates from the keyboard and preserves page identity", async ({ page }) => {
  await page.goto("./architecture");
  const localeSwitcher = page.getByTestId("locale-switcher");

  await localeSwitcher.focus();
  await expect(localeSwitcher).toBeFocused();
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/\/oryxos\/zh\/architecture$/);
  await expect(page.getByTestId("locale-switcher")).toHaveAttribute(
    "aria-label",
    "Switch to English"
  );
});

test("primary navigation remains isolated to the active locale", async ({ page }) => {
  await page.goto("./zh/");

  for (const expectedHref of [
    "/oryxos/zh/architecture",
    "/oryxos/zh/roadmap",
    "/oryxos/zh/docs/",
    "/oryxos/zh/community"
  ]) {
    await expect(page.locator(`.VPNavBarMenu a[href="${expectedHref}"]`)).toHaveCount(1);
  }
});
