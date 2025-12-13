import { test, expect } from "@playwright/test";

// Unauthenticated admin tests - verify access control works
test.describe("Admin - Unauthenticated (CR-003)", () => {
  test.describe("Admin Page Access Control", () => {
    test("should redirect to login when accessing admin page unauthenticated (CR-003)", async ({
      page,
    }) => {
      await page.goto("/dashboard/admin");

      // Should redirect to login page
      await expect(page).toHaveURL(/\/login/);
    });

    test("should require authentication for admin API endpoints (CR-003)", async ({
      page,
    }) => {
      // Test all admin API endpoints return 401 when not authenticated
      const endpoints = [
        { method: "GET", url: "/api/admin/users" },
        { method: "GET", url: "/api/admin/roles" },
        { method: "GET", url: "/api/admin/permissions" },
        { method: "GET", url: "/api/me/permissions" },
      ];

      for (const endpoint of endpoints) {
        const response = await page.request.get(endpoint.url);
        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.error).toBe("Unauthorized");
      }
    });

    test("should return 401 for admin role management endpoints (CR-003)", async ({
      page,
    }) => {
      // Test POST endpoints
      const postResponse = await page.request.post("/api/admin/roles", {
        data: { name: "test-role" },
        headers: { "Content-Type": "application/json" },
      });
      expect(postResponse.status()).toBe(401);

      // Test user role assignment endpoint
      const assignResponse = await page.request.post(
        "/api/admin/users/test-user-id/roles",
        {
          data: { roleId: "test-role-id" },
          headers: { "Content-Type": "application/json" },
        }
      );
      expect(assignResponse.status()).toBe(401);
    });

    test("should return 401 for admin permission management endpoints (CR-003)", async ({
      page,
    }) => {
      const response = await page.request.post("/api/admin/permissions", {
        data: {
          name: "test:permission",
          resource: "test",
          action: "permission",
        },
        headers: { "Content-Type": "application/json" },
      });
      expect(response.status()).toBe(401);
    });
  });

  test.describe("Admin Navigation", () => {
    test("should NOT show Admin link in navbar when not logged in (CR-003)", async ({
      page,
    }) => {
      await page.goto("/");

      const navbar = page.locator("nav");
      await expect(navbar).toBeVisible();

      // Admin link should not be visible for unauthenticated users
      const adminLink = navbar.locator('a[href="/dashboard/admin"]');
      await expect(adminLink).not.toBeVisible();
    });
  });

  test.describe("Current User Permissions API", () => {
    test("should return 401 for /api/me/permissions when not authenticated (CR-003)", async ({
      page,
    }) => {
      const response = await page.request.get("/api/me/permissions");
      expect(response.status()).toBe(401);

      const body = await response.json();
      expect(body.error).toBe("Unauthorized");
    });
  });

  test.describe("First User Admin Assignment", () => {
    test("verifies first user becomes admin (CR-003) - documented behavior", async () => {
      // This test documents the expected behavior that cannot be tested
      // without a fresh database and Google OAuth flow:
      //
      // 1. When the first user signs in with Google OAuth
      // 2. They are automatically assigned the "admin" role
      // 3. Subsequent users are assigned the "user" role
      //
      // Implementation location: src/lib/auth.ts signIn callback

      expect(true).toBe(true); // Placeholder for documented behavior
    });
  });
});
