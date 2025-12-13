import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: process.env.BASE_URL || "https://uat.ankiren.com",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    // Setup project - authenticates and saves state
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
      teardown: "teardown",
    },
    // Teardown project - cleans up test data
    {
      name: "teardown",
      testMatch: /.*\.teardown\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    // Unauthenticated tests - run without auth
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /.*-unauth\.spec\.ts/,
    },
    // Authenticated tests - require admin session
    {
      name: "chromium-admin",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.auth/admin.json",
      },
      dependencies: ["setup"],
      testMatch: /.*-auth\.spec\.ts/,
    },
  ],
});
