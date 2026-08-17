import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";

export async function scanPageForAccessibilityViolations(page: Page) {
  return new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .exclude(".VPDocOutlineItem")
    .analyze();
}
