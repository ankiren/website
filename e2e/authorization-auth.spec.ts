import { test, expect } from "@playwright/test";

// Authenticated authorization API tests - require admin session
test.describe("Authorization API - Authenticated (CR-003)", () => {
  test.describe("Roles API - Admin User", () => {
    test("GET /api/admin/roles - should return roles list for admin user (CR-003)", async ({
      page,
    }) => {
      const response = await page.request.get("/api/admin/roles");
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty("roles");
      expect(Array.isArray(body.roles)).toBe(true);

      // Should have at least admin and user roles
      const roleNames = body.roles.map((r: { name: string }) => r.name);
      expect(roleNames).toContain("admin");
      expect(roleNames).toContain("user");

      // Each role should have expected properties
      const adminRole = body.roles.find(
        (r: { name: string }) => r.name === "admin"
      );
      expect(adminRole).toHaveProperty("id");
      expect(adminRole).toHaveProperty("name");
      expect(adminRole).toHaveProperty("description");
      expect(adminRole).toHaveProperty("isSystem");
      expect(adminRole).toHaveProperty("userCount");
      expect(adminRole).toHaveProperty("permissions");
      expect(adminRole.isSystem).toBe(true);
    });

    test("POST /api/admin/roles - should create new role (CR-003)", async ({
      page,
    }) => {
      const uniqueName = `test-role-${Date.now()}`;
      const response = await page.request.post("/api/admin/roles", {
        data: {
          name: uniqueName,
          description: "Test role created by E2E test",
          permissions: [],
        },
        headers: { "Content-Type": "application/json" },
      });
      expect(response.status()).toBe(201);

      const body = await response.json();
      expect(body.name).toBe(uniqueName);
      expect(body.isSystem).toBe(false);
    });

    test("POST /api/admin/roles - should reject empty name (CR-003)", async ({
      page,
    }) => {
      const response = await page.request.post("/api/admin/roles", {
        data: { name: "", description: "Empty name" },
        headers: { "Content-Type": "application/json" },
      });
      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.error).toBe("Name is required");
    });

    test("DELETE /api/admin/roles/:id - should reject deletion of system role (CR-003)", async ({
      page,
    }) => {
      // Get the admin role ID
      const rolesResponse = await page.request.get("/api/admin/roles");
      const rolesBody = await rolesResponse.json();
      const adminRole = rolesBody.roles?.find(
        (r: { name: string }) => r.name === "admin"
      );

      expect(adminRole).toBeTruthy();

      const response = await page.request.delete(
        `/api/admin/roles/${adminRole.id}`
      );
      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.error).toBe("Cannot delete system role");
    });
  });

  test.describe("Permissions API - Admin User", () => {
    test("GET /api/admin/permissions - should return permissions list (CR-003)", async ({
      page,
    }) => {
      const response = await page.request.get("/api/admin/permissions");
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty("permissions");
      expect(Array.isArray(body.permissions)).toBe(true);

      // Should have system permissions
      const permNames = body.permissions.map((p: { name: string }) => p.name);
      expect(permNames).toContain("users:manage");
      expect(permNames).toContain("roles:manage");
      expect(permNames).toContain("roles:assign");
      expect(permNames).toContain("permissions:manage");

      // Each permission should have expected properties
      const usersPerm = body.permissions.find(
        (p: { name: string }) => p.name === "users:manage"
      );
      expect(usersPerm).toHaveProperty("id");
      expect(usersPerm).toHaveProperty("name");
      expect(usersPerm).toHaveProperty("description");
      expect(usersPerm).toHaveProperty("resource");
      expect(usersPerm).toHaveProperty("action");
      expect(usersPerm).toHaveProperty("isSystem");
      expect(usersPerm.resource).toBe("users");
      expect(usersPerm.action).toBe("manage");
      expect(usersPerm.isSystem).toBe(true);
    });

    test("POST /api/admin/permissions - should create new permission (CR-003)", async ({
      page,
    }) => {
      const uniqueAction = `test-${Date.now()}`;
      const response = await page.request.post("/api/admin/permissions", {
        data: {
          name: `decks:${uniqueAction}`,
          resource: "decks",
          action: uniqueAction,
          description: "Test permission created by E2E test",
        },
        headers: { "Content-Type": "application/json" },
      });
      expect(response.status()).toBe(201);

      const body = await response.json();
      expect(body.name).toBe(`decks:${uniqueAction}`);
      expect(body.resource).toBe("decks");
      expect(body.action).toBe(uniqueAction);
      expect(body.isSystem).toBe(false);
    });

    test("POST /api/admin/permissions - should reject missing resource (CR-003)", async ({
      page,
    }) => {
      const response = await page.request.post("/api/admin/permissions", {
        data: { name: "test:action", action: "action" },
        headers: { "Content-Type": "application/json" },
      });
      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.error).toBe("Resource is required");
    });

    test("POST /api/admin/permissions - should reject missing action (CR-003)", async ({
      page,
    }) => {
      const response = await page.request.post("/api/admin/permissions", {
        data: { name: "resource:test", resource: "resource" },
        headers: { "Content-Type": "application/json" },
      });
      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.error).toBe("Action is required");
    });

    test("DELETE /api/admin/permissions/:id - should reject deletion of system permission (CR-003)", async ({
      page,
    }) => {
      // Get permissions list
      const permsResponse = await page.request.get("/api/admin/permissions");
      const permsBody = await permsResponse.json();
      const systemPerm = permsBody.permissions?.find(
        (p: { name: string; isSystem: boolean }) =>
          p.name === "users:manage" && p.isSystem
      );

      expect(systemPerm).toBeTruthy();

      const response = await page.request.delete(
        `/api/admin/permissions/${systemPerm.id}`
      );
      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.error).toBe("Cannot delete system permission");
    });
  });

  test.describe("Users API - Admin User", () => {
    test("GET /api/admin/users - should return paginated users list (CR-003)", async ({
      page,
    }) => {
      const response = await page.request.get("/api/admin/users?page=1&limit=20");
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty("users");
      expect(body).toHaveProperty("pagination");
      expect(Array.isArray(body.users)).toBe(true);

      // Check pagination structure
      expect(body.pagination).toHaveProperty("page");
      expect(body.pagination).toHaveProperty("limit");
      expect(body.pagination).toHaveProperty("total");
      expect(body.pagination).toHaveProperty("totalPages");

      // Each user should have expected properties
      if (body.users.length > 0) {
        const user = body.users[0];
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("email");
        expect(user).toHaveProperty("roles");
        expect(Array.isArray(user.roles)).toBe(true);
      }
    });

    test("GET /api/admin/users - should support search parameter (CR-003)", async ({
      page,
    }) => {
      const response = await page.request.get(
        "/api/admin/users?search=@"
      );
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty("users");
    });

    test("GET /api/admin/users/:id - should return user with roles (CR-003)", async ({
      page,
    }) => {
      // First get user list to find a valid user ID
      const usersResponse = await page.request.get("/api/admin/users");
      expect(usersResponse.status()).toBe(200);

      const usersBody = await usersResponse.json();
      expect(usersBody.users.length).toBeGreaterThan(0);

      const userId = usersBody.users[0].id;

      const response = await page.request.get(`/api/admin/users/${userId}`);
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty("id");
      expect(body).toHaveProperty("email");
      expect(body).toHaveProperty("roles");
      expect(Array.isArray(body.roles)).toBe(true);
    });
  });

  test.describe("Current User Permissions API - Admin User", () => {
    test("GET /api/me/permissions - should return current user roles and permissions (CR-003)", async ({
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

    test("GET /api/me/permissions - admin should have all system permissions (CR-003)", async ({
      page,
    }) => {
      const response = await page.request.get("/api/me/permissions");
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.roles).toContain("admin");
      expect(body.permissions).toContain("users:manage");
      expect(body.permissions).toContain("roles:manage");
      expect(body.permissions).toContain("roles:assign");
      expect(body.permissions).toContain("permissions:manage");
    });
  });

  test.describe("Permission-Based Access Control", () => {
    test("should allow admin access to all admin endpoints (CR-003)", async ({
      page,
    }) => {
      // Test that admin can access all endpoints
      const endpoints = [
        "/api/admin/users",
        "/api/admin/roles",
        "/api/admin/permissions",
        "/api/me/permissions",
      ];

      for (const endpoint of endpoints) {
        const response = await page.request.get(endpoint);
        expect(response.status()).toBe(200);
      }
    });
  });
});
