import { expect, getRequiredPages, test } from "./site-fixtures";

test("all required routes load with valid metadata, resources, and fragments", async ({
  page,
  pageRecords,
  request
}) => {
  test.setTimeout(120_000);

  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const failedRequests: string[] = [];
  const failedResponses: string[] = [];
  const pageTitles = new Set<string>();
  const pageDescriptions = new Set<string>();
  const socialImagePaths = new Set<string>();

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("requestfailed", (failedRequest) => {
    failedRequests.push(`${failedRequest.method()} ${failedRequest.url()}`);
  });
  page.on("response", (response) => {
    if (response.status() >= 400) {
      failedResponses.push(`${response.status()} ${response.url()}`);
    }
  });

  for (const pageRecord of getRequiredPages(pageRecords)) {
    const response = await page.goto(`.${pageRecord.route}`);

    expect(response?.ok(), `${pageRecord.locale}:${pageRecord.pageId}`).toBe(true);
    await expect(page.getByTestId("draft-notice")).toBeVisible();

    const expectedLanguage = pageRecord.locale === "zh" ? "zh-Hans" : "en";
    const expectedSocialLocale = pageRecord.locale === "zh" ? "zh_CN" : "en_US";
    await expect(page.locator("html")).toHaveAttribute("lang", expectedLanguage);
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
      "content",
      expectedSocialLocale
    );

    const title = await page.title();
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    const socialImagePath = await page.locator('meta[property="og:image"]').getAttribute("content");
    const socialImageAlt = await page.locator('meta[property="og:image:alt"]').getAttribute("content");
    const twitterImageAlt = await page.locator('meta[name="twitter:image:alt"]').getAttribute("content");

    expect(title, `${pageRecord.locale}:${pageRecord.pageId} title`).not.toBe("");
    expect(description, `${pageRecord.locale}:${pageRecord.pageId} description`).toBeTruthy();
    expect(socialImagePath, `${pageRecord.locale}:${pageRecord.pageId} social image`).toMatch(
      /^\/oryxos\//
    );
    expect(socialImageAlt, `${pageRecord.locale}:${pageRecord.pageId} social alt`).toBeTruthy();
    expect(twitterImageAlt).toBe(socialImageAlt);
    expect(pageTitles.has(title), `duplicate title: ${title}`).toBe(false);
    expect(pageDescriptions.has(description!), `duplicate description: ${description}`).toBe(false);

    pageTitles.add(title);
    pageDescriptions.add(description!);
    socialImagePaths.add(socialImagePath!);

    await expect(page.locator('link[rel="alternate"]')).toHaveCount(3);

    const missingLocalFragments = await page.locator("a[href*='#']").evaluateAll((links) => {
      const currentUrl = new URL(window.location.href);

      return links.flatMap((link) => {
        const href = link.getAttribute("href");
        if (!href) {
          return [];
        }

        const targetUrl = new URL(href, currentUrl);
        if (targetUrl.origin !== currentUrl.origin || targetUrl.pathname !== currentUrl.pathname) {
          return [];
        }

        const fragmentId = decodeURIComponent(targetUrl.hash.slice(1));
        if (!fragmentId || document.getElementById(fragmentId)) {
          return [];
        }

        return [href];
      });
    });

    expect(
      missingLocalFragments,
      `${pageRecord.locale}:${pageRecord.pageId} missing local fragments`
    ).toEqual([]);
    expect(consoleErrors, `${pageRecord.locale}:${pageRecord.pageId} console errors`).toEqual([]);
    expect(pageErrors, `${pageRecord.locale}:${pageRecord.pageId} page errors`).toEqual([]);
    expect(failedRequests, `${pageRecord.locale}:${pageRecord.pageId} failed requests`).toEqual([]);
    expect(failedResponses, `${pageRecord.locale}:${pageRecord.pageId} failed responses`).toEqual([]);
  }

  for (const socialImagePath of socialImagePaths) {
    const assetResponse = await request.get(socialImagePath);
    expect(assetResponse.ok(), socialImagePath).toBe(true);
  }
});
