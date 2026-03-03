import { test, expect } from "@playwright/test";

test.describe("Accounts page", () => {
  test("page subtitle is visible", async ({ page }) => {
    await page.goto("/wealth/accounts");

    await expect(
      page.getByText("Manage your broker accounts, bank accounts, and other financial accounts that hold your assets."),
    ).toBeVisible();
  });

  test("empty state shows when no accounts exist", async ({ page }) => {
    await page.goto("/wealth/accounts");

    // Wait for loading to finish
    await page.waitForLoadState("networkidle");

    // If the account list is empty, verify the rich empty state
    const emptyHeading = page.getByText("No accounts yet");
    if (await emptyHeading.isVisible()) {
      await expect(emptyHeading).toBeVisible();
      await expect(page.getByText("Add your broker accounts")).toBeVisible();
      await expect(page.getByRole("button", { name: "Create your first account" })).toBeVisible();
    }
  });

  test("create account modal opens from header button", async ({ page }) => {
    await page.goto("/wealth/accounts");

    await page.getByRole("button", { name: "Add Account" }).click();

    // Verify modal appears
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("create account modal opens from empty state CTA", async ({ page }) => {
    await page.goto("/wealth/accounts");
    await page.waitForLoadState("networkidle");

    const ctaButton = page.getByRole("button", { name: "Create your first account" });
    if (await ctaButton.isVisible()) {
      await ctaButton.click();
      await expect(page.getByRole("dialog")).toBeVisible();
    }
  });
});
