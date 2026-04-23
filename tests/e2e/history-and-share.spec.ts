import { expect, test } from "@playwright/test";

test("user can open a shared scenario in read-only mode", async ({ page }) => {
  await page.goto("/share/demo-token");

  await expect(page.getByText(/read-only share/i)).toBeVisible();
  await expect(page.getByText(/equity results/i)).toBeVisible();
});
