import { expect, test } from "./site-fixtures";

test("404 presents bilingual recovery routes", async ({ page }) => {
  const response = await page.goto("./not-a-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByTestId("draft-notice")).toBeVisible();
  await expect(page.getByRole("heading", { name: "English recovery" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "中文恢复入口" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/oryxos/");
  await expect(page.getByRole("link", { name: "首页" })).toHaveAttribute("href", "/oryxos/zh/");
});

test("brand and metadata assets load below the project base", async ({ page, request }) => {
  await page.goto("./");

  const faviconHref = await page
    .locator('link[rel="icon"][type="image/svg+xml"]')
    .getAttribute("href");
  const touchIconHref = await page.locator('link[rel="apple-touch-icon"]').getAttribute("href");
  const socialImage = await page.locator('meta[property="og:image"]').getAttribute("content");

  for (const assetPath of [faviconHref, touchIconHref, socialImage]) {
    expect(assetPath).toBeTruthy();
    expect(assetPath).toMatch(/^\/oryxos\//);
    const response = await request.get(assetPath!);
    expect(response.ok(), assetPath ?? "missing asset path").toBe(true);
  }
});
