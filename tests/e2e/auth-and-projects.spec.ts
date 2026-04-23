import { expect, test } from "@playwright/test";

test("guests are redirected from projects to sign in", async ({ page }) => {
  await page.goto("/projects");

  await expect(page).toHaveURL(/\/sign-in$/);
  await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
});

test("guests are redirected from a workspace route to sign in", async ({ page }) => {
  await page.goto("/projects/unknown-project");

  await expect(page).toHaveURL(/\/sign-in$/);
});

test("sign-in page explains the authentication baseline", async ({ page }) => {
  await page.goto("/sign-in");

  await expect(
    page.getByText(/authentication wiring lands in this task/i),
  ).toBeVisible();
});

test("user can sign in with email and reach projects", async ({ page }) => {
  await page.goto("/sign-in");

  await page.getByLabel(/email/i).fill("hero@example.com");
  await page.getByRole("button", { name: /sign in with email/i }).click();

  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.getByText(/signed in as/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /open/i }).first()).toBeVisible();
});
