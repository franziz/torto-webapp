import { clerk, clerkSetup } from "@clerk/testing/playwright";
import { test as setup } from "@playwright/test";

setup.describe.configure({ mode: "serial" });

setup("global setup", async ({}) => {
  await clerkSetup();
});

setup("authenticate", async ({ page }) => {
  await page.goto("/");
  await clerk.signIn({
    page,
    signInParams: {
      strategy: "password",
      identifier: process.env.E2E_CLERK_USER_USERNAME!,
      password: process.env.E2E_CLERK_USER_PASSWORD!,
    },
  });
  await page.context().storageState({ path: "playwright/.clerk/user.json" });
});
