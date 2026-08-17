import { expect, test } from "./site-fixtures";

test("documentation landing presents all six topic groups", async ({ page }) => {
  await page.goto("./docs/");

  for (const topic of ["Concepts", "Project", "Getting started", "Runtime", "Interfaces", "Contributing"]) {
    await expect(
      page.locator(".documentation-landing").getByRole("heading", { name: topic, exact: true })
    ).toBeVisible();
  }
});

test("every documentation page uses the five-section prototype form", async ({ page, pageRecords }) => {
  test.setTimeout(120_000);

  const documentationPages = pageRecords.filter(
    (pageRecord) => pageRecord.required && pageRecord.sourcePath.includes("docs/") && !pageRecord.sourcePath.endsWith("docs/index.md")
  );

  for (const pageRecord of documentationPages) {
    await page.goto(`.${pageRecord.route}`);
    for (const sectionName of [
      /Overview|概述/,
      /Intended design|预期设计/,
      /Status placeholder|状态占位/,
      /Limitations placeholder|限制占位/,
      /Related navigation|相关导航/
    ]) {
      await expect(
        page.getByRole("heading", { level: 2, name: sectionName }).first(),
        `${pageRecord.locale}:${pageRecord.pageId}`
      ).toBeVisible();
    }
  }
});

test("community exposes a safe external repository path", async ({ page }) => {
  await page.goto("./community");

  const repositoryLink = page.getByRole("link", { name: /Inspect the GitHub repository/ });
  await expect(repositoryLink).toHaveAttribute("href", "https://github.com/KI9I9/oryxos");
  await expect(repositoryLink).toHaveAttribute("target", "_blank");
  await expect(repositoryLink).toHaveAttribute("rel", /noopener/);
  await expect(page.getByText(/no login, form submission, analytics/i)).toBeVisible();
});
