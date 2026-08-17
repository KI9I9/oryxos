import { expect, test } from "./site-fixtures";

test("English home communicates the prototype positioning and boundaries", async ({ page, previewErrors }) => {
  await page.goto("./");

  await expect(page.getByTestId("draft-notice")).toContainText("Draft visual prototype");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("runtime kernel");
  await expect(page.getByText("Java-native", { exact: true })).toBeVisible();
  await expect(page.getByText("Self-hosted", { exact: true })).toBeVisible();
  await expect(page.getByText("Single-node focus", { exact: true })).toBeVisible();
  await expect(page.getByText("Pre-alpha", { exact: true })).toBeVisible();
  await expect(page.getByText("Open source", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "An Agent OS, not a chatbot wrapper." })).toBeVisible();

  for (const legendLabel of ["Available", "In development", "Planned", "Vision"]) {
    await expect(page.getByRole("heading", { name: legendLabel, exact: true })).toBeVisible();
  }

  await expect(page.getByText(/no real capability receives a state/i)).toBeVisible();
  await expect(page.getByText(/Distributed agent collaboration remains a long-term direction/i)).toBeVisible();
  await expect(page.locator(".home-direction [data-state]")).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Inspect the system shape/ })).toHaveAttribute(
    "href",
    "/oryxos/architecture"
  );
  await expect(page.getByRole("link", { name: "Explore documentation" })).toHaveAttribute(
    "href",
    "/oryxos/docs/"
  );

  await page.keyboard.press("Tab");
  await expect(page.locator(":focus-visible")).toBeVisible();
  expect(previewErrors).toEqual([]);
});

test("Chinese home presents equivalent positioning", async ({ page }) => {
  await page.goto("./zh/");

  await expect(page.getByTestId("draft-notice")).toContainText("视觉原型草案");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("运行时内核");
  await expect(page.getByText("Java 原生", { exact: true })).toBeVisible();
  await expect(page.getByText("自托管", { exact: true })).toBeVisible();
  await expect(page.getByText("单节点重点", { exact: true })).toBeVisible();
  await expect(page.getByText("分布式 Agent 协作仍是长期方向", { exact: false })).toBeVisible();
});
