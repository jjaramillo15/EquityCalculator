import { expect, test } from "@playwright/test";

test("guests are redirected from projects to sign in", async ({ page }) => {
  await page.goto("/projects");

  await expect(page).toHaveURL(/\/sign-in$/);
  await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
});

test("sign-in page explains the authentication baseline", async ({ page }) => {
  await page.goto("/sign-in");

  await expect(
    page.getByText(/authentication wiring lands in this task/i),
  ).toBeVisible();
});
