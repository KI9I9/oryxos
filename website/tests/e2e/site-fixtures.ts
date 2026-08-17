import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { expect, test as baseTest } from "@playwright/test";

interface PageRecord {
  pageId: string;
  locale: "root" | "zh";
  route: string;
  required: boolean;
  sourcePath: string;
}

interface SiteFixtures {
  pageRecords: PageRecord[];
  previewErrors: string[];
}

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const websiteDirectory = path.resolve(currentDirectory, "../..");

export const test = baseTest.extend<SiteFixtures>({
  pageRecords: async ({}, use) => {
    const manifestContent = await readFile(path.join(websiteDirectory, "data/pages.json"), "utf8");
    const manifest = JSON.parse(manifestContent) as { pages: PageRecord[] };
    await use(manifest.pages);
  },
  previewErrors: async ({ page }, use) => {
    const previewErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error" || message.type() === "warning") {
        previewErrors.push(`console ${message.type()}: ${message.text()}`);
      }
    });
    page.on("pageerror", (error) => previewErrors.push(`pageerror: ${error.message}`));
    await use(previewErrors);
  }
});

export { expect };

export function getRequiredPages(pageRecords: PageRecord[]): PageRecord[] {
  return pageRecords.filter((pageRecord) => pageRecord.required);
}

export function getCounterpart(pageRecords: PageRecord[], currentPage: PageRecord): PageRecord {
  const targetLocale = currentPage.locale === "root" ? "zh" : "root";
  const counterpart = pageRecords.find(
    (pageRecord) => pageRecord.pageId === currentPage.pageId && pageRecord.locale === targetLocale
  );

  if (!counterpart) {
    throw new Error(`Missing counterpart for ${currentPage.locale}:${currentPage.pageId}`);
  }

  return counterpart;
}
