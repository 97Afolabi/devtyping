import { expect, test } from "@playwright/test";

test("home page renders header and brand link", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("banner").getByRole("link", { name: "DevTyp.i.ng" }),
  ).toBeVisible();
});

test("home page shows github sign-in action for unauthenticated user", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("button", { name: "Sign in with GitHub" }),
  ).toBeVisible();
});
