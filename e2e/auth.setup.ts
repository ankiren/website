import { test as setup, expect } from "@playwright/test";

const ADMIN_EMAIL = "anhv.ict91@gmail.com";
const USER_EMAIL = "user@example.com";

const adminAuthFile = "e2e/.auth/admin.json";
const userAuthFile = "e2e/.auth/user.json";

// Setup admin authentication
setup("authenticate as admin", async ({ page }) => {
  // First visit a page to establish the context
  await page.goto("/login");

  // Call test auth endpoint to set session cookie
  // Using page.request ensures cookies are captured in the browser context
  const response = await page.request.post("/api/test-auth", {
    data: { email: ADMIN_EMAIL },
  });

  if (!response.ok()) {
    const error = await response.text();
    throw new Error(`Failed to authenticate as admin: ${error}`);
  }

  const body = await response.json();
  expect(body.success).toBe(true);
  expect(body.user.roles).toContain("admin");

  // Navigate to dashboard to verify authentication works
  await page.goto("/dashboard");

  // Verify we're logged in by checking the page content
  await expect(page.locator("nav")).toBeVisible({ timeout: 10000 });

  // Save storage state (cookies, localStorage, etc.)
  await page.context().storageState({ path: adminAuthFile });
});

// Setup regular user authentication (if needed)
setup("authenticate as user", async ({ page }) => {
  // First visit a page to establish the context
  await page.goto("/login");

  // Try to authenticate as regular user
  // Note: This user needs to exist in the database
  const response = await page.request.post("/api/test-auth", {
    data: { email: USER_EMAIL },
  });

  // If user doesn't exist, create a minimal auth state
  if (!response.ok()) {
    console.log("User not found, creating empty auth state for user tests");
    // Save empty state - tests using userPage will handle this gracefully
    await page.context().storageState({ path: userAuthFile });
    return;
  }

  const body = await response.json();
  expect(body.success).toBe(true);

  // Navigate to dashboard to verify authentication works
  await page.goto("/dashboard");

  await page.context().storageState({ path: userAuthFile });
});
