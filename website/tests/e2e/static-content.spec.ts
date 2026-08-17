import { expect, test } from "./site-fixtures";

test.use({ javaScriptEnabled: false });

test("home positioning and ordinary links exist without JavaScript", async ({ page }) => {
  await page.goto("./");

  await expect(page.getByTestId("draft-notice")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("runtime kernel");
  await expect(page.getByText("Java-native", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /Inspect the system shape/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore documentation" })).toBeVisible();
});

test("bilingual 404 recovery is server rendered", async ({ page }) => {
  await page.goto("./route-that-does-not-exist");

  await expect(page.getByRole("heading", { name: "English recovery" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "中文恢复入口" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Documentation" })).toBeVisible();
  await expect(page.getByRole("link", { name: "文档" })).toBeVisible();
});
