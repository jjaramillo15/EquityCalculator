import { expect, test } from "@playwright/test";

test("homepage shows the Task 1 bootstrap heading", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /hold'em equity calculator/i }),
  ).toBeVisible();
});
