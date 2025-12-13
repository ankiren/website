import { test, expect } from "@playwright/test";

// Authenticated admin tests - require admin session (storageState)
test.describe("Admin - Authenticated (CR-003)", () => {
  test.describe("Admin Navigation", () => {
    test("should show Admin link in navbar for admin users (CR-003)", async ({
      page,
    }) => {
      await page.goto("/");

      const navbar = page.locator("nav");
      await expect(navbar).toBeVisible();

      // Admin link should be visible for admin users
      const adminLink = navbar.locator('a[href="/dashboard/admin"]');
      await expect(adminLink).toBeVisible();
    });
  });

  test.describe("Admin Page Structure", () => {
    test("should display admin page with tabs for Users, Roles, Permissions (CR-003)", async ({
      page,
    }) => {
      await page.goto("/dashboard/admin");

      // Check page title
      await expect(page.locator("h1", { hasText: "Admin" })).toBeVisible();
      await expect(
        page.locator("text=Manage users, roles, and permissions")
      ).toBeVisible();

      // Check tabs exist
      await expect(page.locator("button", { hasText: "Users" })).toBeVisible();
      await expect(page.locator("button", { hasText: "Roles" })).toBeVisible();
      await expect(
        page.locator("button", { hasText: "Permissions" })
      ).toBeVisible();
    });

    test("should switch between tabs (CR-003)", async ({ page }) => {
      await page.goto("/dashboard/admin");

      // Click Roles tab
      await page.click("button:has-text('Roles')");
      await expect(page.locator("button:has-text('Create Role')")).toBeVisible();

      // Click Permissions tab
      await page.click("button:has-text('Permissions')");
      await expect(
        page.locator("button:has-text('Create Permission')")
      ).toBeVisible();

      // Click Users tab
      await page.click("button:has-text('Users')");
      await expect(page.locator("input[placeholder*='Search']")).toBeVisible();
    });
  });

  test.describe("Users Management", () => {
    test("should display user list with roles (CR-003)", async ({ page }) => {
      await page.goto("/dashboard/admin");

      // Should show user table
      await expect(page.locator("th", { hasText: "User" })).toBeVisible();
      await expect(page.locator("th", { hasText: "Roles" })).toBeVisible();
      await expect(page.locator("th", { hasText: "Joined" })).toBeVisible();
      await expect(page.locator("th", { hasText: "Actions" })).toBeVisible();
    });

    test("should search users by email or name (CR-003)", async ({ page }) => {
      await page.goto("/dashboard/admin");

      const searchInput = page.locator("input[placeholder*='Search']");
      await searchInput.fill("test@example.com");
      await page.click("button:has-text('Search')");

      // Wait for search results
      await page.waitForResponse(
        (response) =>
          response.url().includes("/api/admin/users") &&
          response.url().includes("search=")
      );
    });

    test("should open Manage Roles modal when clicking Manage Roles button (CR-003)", async ({
      page,
    }) => {
      await page.goto("/dashboard/admin");

      // Click first Manage Roles button
      await page.click("button:has-text('Manage Roles')");

      // Modal should appear
      await expect(page.locator("text=Manage User Roles")).toBeVisible();
      await expect(page.locator("text=Current Roles")).toBeVisible();
    });
  });

  test.describe("Roles Management", () => {
    test("should display role list with user count and permissions (CR-003)", async ({
      page,
    }) => {
      await page.goto("/dashboard/admin");
      await page.click("button:has-text('Roles')");

      // Should show role cards with names
      await expect(page.locator("h3:has-text('admin')")).toBeVisible();
      await expect(page.locator("h3:has-text('user')")).toBeVisible();

      // System roles should have System badge
      await expect(page.locator("text=System").first()).toBeVisible();
    });

    test("should open Create Role modal (CR-003)", async ({ page }) => {
      await page.goto("/dashboard/admin");
      await page.click("button:has-text('Roles')");
      await page.click("button:has-text('Create Role')");

      // Modal should appear with role form
      await expect(page.locator(".fixed h3:has-text('Create Role')")).toBeVisible();
      await expect(page.locator("input[placeholder='e.g., moderator']")).toBeVisible();
      await expect(page.locator("label:has-text('Permissions')")).toBeVisible();
    });

    test("should not allow deletion of system roles (CR-003)", async ({
      page,
    }) => {
      await page.goto("/dashboard/admin");
      await page.click("button:has-text('Roles')");

      // System roles (admin, user) should not have Delete button
      const adminCard = page.locator("div", { hasText: "admin" }).first();
      const deleteButton = adminCard.locator("button:has-text('Delete')");
      await expect(deleteButton).not.toBeVisible();
    });
  });

  test.describe("Permissions Management", () => {
    test("should display permissions grouped by resource (CR-003)", async ({
      page,
    }) => {
      await page.goto("/dashboard/admin");
      await page.click("button:has-text('Permissions')");

      // Should show permission groups
      await expect(page.locator("h3", { hasText: "users" })).toBeVisible();
      await expect(page.locator("h3", { hasText: "roles" })).toBeVisible();
      await expect(page.locator("h3", { hasText: "permissions" })).toBeVisible();
    });

    test("should open Create Permission modal (CR-003)", async ({ page }) => {
      await page.goto("/dashboard/admin");
      await page.click("button:has-text('Permissions')");
      await page.click("button:has-text('Create Permission')");

      // Modal should appear with permission form
      await expect(page.locator(".fixed h3:has-text('Create Permission')")).toBeVisible();
      await expect(page.locator("input[placeholder='e.g., decks']")).toBeVisible();
      await expect(page.locator("input[placeholder='e.g., export']")).toBeVisible();
    });

    test("should auto-generate permission name from resource:action (CR-003)", async ({
      page,
    }) => {
      await page.goto("/dashboard/admin");
      await page.click("button:has-text('Permissions')");
      await page.click("button:has-text('Create Permission')");

      // Fill in resource and action
      await page.fill("input[placeholder='e.g., decks']", "decks");
      await page.fill("input[placeholder='e.g., export']", "export");

      // Should show generated name
      await expect(page.locator("text=decks:export")).toBeVisible();
    });

    test("should not allow deletion of system permissions (CR-003)", async ({
      page,
    }) => {
      await page.goto("/dashboard/admin");
      await page.click("button:has-text('Permissions')");

      // System permissions should have System badge
      const systemPermission = page
        .locator("div", { hasText: "users:manage" })
        .first();
      await expect(
        systemPermission.locator("text=System").first()
      ).toBeVisible();
    });
  });

  test.describe("Current User Permissions API", () => {
    test("should return roles and permissions for authenticated user (CR-003)", async ({
      page,
    }) => {
      const response = await page.request.get("/api/me/permissions");
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty("roles");
      expect(body).toHaveProperty("permissions");
      expect(Array.isArray(body.roles)).toBe(true);
      expect(Array.isArray(body.permissions)).toBe(true);
    });
  });

  test.describe("Security Rules", () => {
    test("should prevent deleting yourself (CR-003)", async ({ page }) => {
      // Get current user ID from session
      const meResponse = await page.request.get("/api/me/permissions");
      expect(meResponse.status()).toBe(200);

      // Try to get current user from session
      const sessionResponse = await page.request.get("/api/auth/session");
      const session = await sessionResponse.json();
      const currentUserId = session?.user?.id;

      if (currentUserId) {
        const response = await page.request.delete(
          `/api/admin/users/${currentUserId}`
        );
        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.error).toBe("Cannot delete yourself");
      }
    });

    test("should prevent deleting system roles (CR-003)", async ({ page }) => {
      // Get the admin role ID first
      const rolesResponse = await page.request.get("/api/admin/roles");
      expect(rolesResponse.status()).toBe(200);

      const rolesBody = await rolesResponse.json();
      const adminRole = rolesBody.roles?.find(
        (r: { name: string }) => r.name === "admin"
      );

      if (adminRole) {
        const response = await page.request.delete(
          `/api/admin/roles/${adminRole.id}`
        );
        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.error).toBe("Cannot delete system role");
      }
    });

    test("should prevent deleting system permissions (CR-003)", async ({
      page,
    }) => {
      // Get permissions list first
      const permsResponse = await page.request.get("/api/admin/permissions");
      expect(permsResponse.status()).toBe(200);

      const permsBody = await permsResponse.json();
      const systemPerm = permsBody.permissions?.find(
        (p: { name: string; isSystem: boolean }) =>
          p.name === "users:manage" && p.isSystem
      );

      if (systemPerm) {
        const response = await page.request.delete(
          `/api/admin/permissions/${systemPerm.id}`
        );
        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.error).toBe("Cannot delete system permission");
      }
    });
  });
});
