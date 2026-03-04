import { expect, test } from "@playwright/test";

test("unauthenticated user is redirected from contribute", async ({ page }) => {
  await page.goto("/contribute");

  await expect(page).toHaveURL(/\/$/);
});

test("unauthenticated user is redirected from topics", async ({ page }) => {
  await page.goto("/topics");

  await expect(page).toHaveURL(/\/$/);
});

test("unauthenticated user is redirected from review routes", async ({
  page,
}) => {
  await page.goto("/review/sample-topic");

  await expect(page).toHaveURL(/\/$/);
});

test("invalid review slug path redirects to home", async ({ page }) => {
  await page.goto("/review/a/b/c");

  await expect(page).toHaveURL(/\/$/);
});
