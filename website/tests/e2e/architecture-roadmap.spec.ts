import { expect, test } from "./site-fixtures";

test("architecture states the canonical Profile and Skill relationship", async ({ page }) => {
  await page.goto("./architecture");

  await expect(page.getByText("One YAML Profile completely defines an Agent.", { exact: false })).toBeVisible();
  await expect(
    page.locator(".architecture-map__details article").first().getByText(/Skill that supplies behavioral instructions/)
  ).toBeVisible();
  await expect(page.getByAltText("Profile-defined Agent and referenced Skill relationship")).toBeVisible();
  await expect(page.getByAltText("Provisional ReAct loop visual model")).toBeVisible();
  await expect(page.getByText(/does not assert that every module is implemented or available/i)).toBeVisible();
});

test("roadmap separates sequence from promises and capability states", async ({ page }) => {
  await page.goto("./roadmap");

  await expect(page.getByText(/presentation sequence, not release dates/i)).toBeVisible();
  await expect(page.getByText(/Distributed agent collaboration is presented only as a long-term direction/i)).toBeVisible();
  await expect(page.locator(".roadmap-timeline [data-state]")).toHaveCount(0);
});
