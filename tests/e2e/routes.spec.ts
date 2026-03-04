import { expect, test } from "@playwright/test";

test("review index route is accessible", async ({ page }) => {
  await page.goto("/review");

  await expect(page).toHaveURL(/\/review$/);
});

test("dynamic typing route loads page shell", async ({ page }) => {
  await page.goto("/javascript-basics");

  await expect(
    page.getByRole("banner").getByRole("link", { name: "DevTyp.i.ng" }),
  ).toBeVisible();
});
