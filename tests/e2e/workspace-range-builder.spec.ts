import { expect, test } from "@playwright/test";

test("workspace shows saved ranges and action controls", async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByLabel(/email/i).fill("hero@example.com");
  await page.getByRole("button", { name: /sign in with email/i }).click();
  await page.getByRole("link", { name: /open/i }).first().click();

  await expect(
    page.getByRole("heading", { name: /workspace/i }),
  ).toBeVisible();
  await expect(page.getByText(/saved ranges/i)).toBeVisible();
  await expect(
    page.getByRole("button", { name: /calculate equity/i }),
  ).toBeVisible();
});
