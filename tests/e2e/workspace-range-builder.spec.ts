import { expect, test } from "@playwright/test";

test("workspace shows saved ranges and action controls", async ({ page }) => {
  await page.goto("/projects/project-1");

  await expect(
    page.getByRole("heading", { name: /workspace/i }),
  ).toBeVisible();
  await expect(page.getByText(/saved ranges/i)).toBeVisible();
  await expect(
    page.getByRole("button", { name: /calculate equity/i }),
  ).toBeVisible();
});
