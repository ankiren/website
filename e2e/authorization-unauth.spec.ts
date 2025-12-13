import { test, expect } from "@playwright/test";

// Unauthenticated authorization API tests - verify 401 responses
test.describe("Authorization API - Unauthenticated (CR-003)", () => {
  test.describe("Roles API - /api/admin/roles", () => {
    test("GET /api/admin/roles - should return 401 when not authenticated (CR-003)", async ({
      page,
    }) => {
      const response = await page.request.get("/api/admin/roles");
      expect(response.status()).toBe(401);

      const body = await response.json();
      expect(body.error).toBe("Unauthorized");
    });

    test("POST /api/admin/roles - should return 401 when not authenticated (CR-003)", async ({
      page,
    }) => {
      const response = await page.request.post("/api/admin/roles", {
        data: {
          name: "test-role",
          description: "Test role description",
        },
        headers: { "Content-Type": "application/json" },
      });
      expect(response.status()).toBe(401);
    });

    test("GET /api/admin/roles/:id - should return 401 when not authenticated (CR-003)", async ({
      page,
    }) => {
      const response = await page.request.get("/api/admin/roles/role_admin");
      expect(response.status()).toBe(401);
    });

    test("PUT /api/admin/roles/:id - should return 401 when not authenticated (CR-003)", async ({
      page,
    }) => {
      const response = await page.request.put("/api/admin/roles/role_admin", {
        data: { description: "Updated description" },
        headers: { "Content-Type": "application/json" },
      });
      expect(response.status()).toBe(401);
    });

    test("DELETE /api/admin/roles/:id - should return 401 when not authenticated (CR-003)", async ({
      page,
    }) => {
      const response = await page.request.delete("/api/admin/roles/role_admin");
      expect(response.status()).toBe(401);
    });
  });

  test.describe("Permissions API - /api/admin/permissions", () => {
    test("GET /api/admin/permissions - should return 401 when not authenticated (CR-003)", async ({
      page,
    }) => {
      const response = await page.request.get("/api/admin/permissions");
      expect(response.status()).toBe(401);

      const body = await response.json();
      expect(body.error).toBe("Unauthorized");
    });

    test("POST /api/admin/permissions - should return 401 when not authenticated (CR-003)", async ({
      page,
    }) => {
      const response = await page.request.post("/api/admin/permissions", {
        data: {
          name: "decks:export",
          resource: "decks",
          action: "export",
          description: "Export decks",
        },
        headers: { "Content-Type": "application/json" },
      });
      expect(response.status()).toBe(401);
    });

    test("GET /api/admin/permissions/:id - should return 401 when not authenticated (CR-003)", async ({
      page,
    }) => {
      const response = await page.request.get(
        "/api/admin/permissions/perm_users_manage"
      );
      expect(response.status()).toBe(401);
    });

    test("DELETE /api/admin/permissions/:id - should return 401 when not authenticated (CR-003)", async ({
      page,
    }) => {
      const response = await page.request.delete(
        "/api/admin/permissions/perm_users_manage"
      );
      expect(response.status()).toBe(401);
    });
  });

  test.describe("Users API - /api/admin/users", () => {
    test("GET /api/admin/users - should return 401 when not authenticated (CR-003)", async ({
      page,
    }) => {
      const response = await page.request.get("/api/admin/users");
      expect(response.status()).toBe(401);

      const body = await response.json();
      expect(body.error).toBe("Unauthorized");
    });

    test("GET /api/admin/users/:id - should return 401 when not authenticated (CR-003)", async ({
      page,
    }) => {
      const response = await page.request.get("/api/admin/users/test-user-id");
      expect(response.status()).toBe(401);
    });

    test("DELETE /api/admin/users/:id - should return 401 when not authenticated (CR-003)", async ({
      page,
    }) => {
      const response = await page.request.delete(
        "/api/admin/users/test-user-id"
      );
      expect(response.status()).toBe(401);
    });
  });

  test.describe("User Roles API - /api/admin/users/:id/roles", () => {
    test("POST /api/admin/users/:id/roles - should return 401 when not authenticated (CR-003)", async ({
      page,
    }) => {
      const response = await page.request.post(
        "/api/admin/users/test-user-id/roles",
        {
          data: { roleId: "role_admin" },
          headers: { "Content-Type": "application/json" },
        }
      );
      expect(response.status()).toBe(401);
    });

    test("DELETE /api/admin/users/:id/roles/:roleId - should return 401 when not authenticated (CR-003)", async ({
      page,
    }) => {
      const response = await page.request.delete(
        "/api/admin/users/test-user-id/roles/role_admin"
      );
      expect(response.status()).toBe(401);
    });
  });

  test.describe("Current User Permissions API - /api/me/permissions", () => {
    test("GET /api/me/permissions - should return 401 when not authenticated (CR-003)", async ({
      page,
    }) => {
      const response = await page.request.get("/api/me/permissions");
      expect(response.status()).toBe(401);

      const body = await response.json();
      expect(body.error).toBe("Unauthorized");
    });
  });

  test.describe("Data Validation", () => {
    test("POST /api/admin/roles - should return 401 before validation (CR-003)", async ({
      page,
    }) => {
      // Without auth, we get 401 before any validation
      const response = await page.request.post("/api/admin/roles", {
        data: { description: "No name provided" },
        headers: { "Content-Type": "application/json" },
      });
      expect(response.status()).toBe(401);
    });

    test("POST /api/admin/permissions - should return 401 before validation (CR-003)", async ({
      page,
    }) => {
      const response = await page.request.post("/api/admin/permissions", {
        data: { name: "incomplete" },
        headers: { "Content-Type": "application/json" },
      });
      expect(response.status()).toBe(401);
    });
  });
});
