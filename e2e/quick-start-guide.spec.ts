import { test, expect } from "@playwright/test";

test.describe("Quick Start Guide", () => {
  test.beforeEach(async ({ page }) => {
    // Clear the dismissal flag so the guide shows
    await page.goto("/home");
    await page.evaluate(() => localStorage.removeItem("torto:quickstart:dismissed"));
    await page.reload();
  });

  test("guide shows on first visit", async ({ page }) => {
    await expect(page.getByText("Welcome to Torto")).toBeVisible();
  });

  test("step navigation works through all 4 steps", async ({ page }) => {
    const steps = ["Create an Account", "Add Your Assets", "Record Transactions", "View Your Dashboard"];

    for (let i = 0; i < steps.length; i++) {
      await expect(page.getByRole("heading", { name: steps[i] })).toBeVisible();
      await expect(page.getByText(`Step ${i + 1} of 4`)).toBeVisible();

      if (i < steps.length - 1) {
        await page.getByRole("button", { name: "Next" }).click();
      }
    }
  });

  test("progress bar advances with each step", async ({ page }) => {
    // On step 1, only first segment should be filled
    const progressBars = page.locator('[class*="bg-primary-300"][class*="rounded-full"][class*="h-full"]');

    // Step 1: 1 filled
    await expect(progressBars.nth(0)).toHaveCSS("width", /.+/);

    // Step 2: 2 filled
    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByText("Step 2 of 4")).toBeVisible();

    // Step 3: 3 filled
    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByText("Step 3 of 4")).toBeVisible();

    // Step 4: all filled
    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByText("Step 4 of 4")).toBeVisible();
  });

  test("back button works", async ({ page }) => {
    // Go to step 2
    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByText("Step 2 of 4")).toBeVisible();

    // Go back to step 1
    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByText("Step 1 of 4")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Create an Account" })).toBeVisible();
  });

  test("skip dismisses the guide", async ({ page }) => {
    await page.getByText("Skip guide").click();

    // Modal should close
    await expect(page.getByText("Welcome to Torto")).toBeHidden();
  });

  test("guide does not reappear after dismissal", async ({ page }) => {
    // Dismiss via skip
    await page.getByText("Skip guide").click();
    await expect(page.getByText("Welcome to Torto")).toBeHidden();

    // Reload the page
    await page.reload();

    // Guide should not appear
    await expect(page.getByText("Welcome to Torto")).toBeHidden();
  });

  test("last step shows 'Get started' button instead of 'Next'", async ({ page }) => {
    // Navigate to the last step
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("button", { name: "Next" }).click();

    // Verify on step 4
    await expect(page.getByText("Step 4 of 4")).toBeVisible();

    // Should show "Get started" not "Next"
    await expect(page.getByRole("button", { name: "Get started" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Next" })).toBeHidden();
  });

  test("'Get started' closes the guide", async ({ page }) => {
    // Navigate to the last step
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("button", { name: "Next" }).click();

    // Click "Get started"
    await page.getByRole("button", { name: "Get started" }).click();

    // Modal should close
    await expect(page.getByText("Welcome to Torto")).toBeHidden();
  });
});
