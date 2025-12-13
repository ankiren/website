import { test as teardown } from "@playwright/test";

const ADMIN_EMAIL = "anhv.ict91@gmail.com";

// Global teardown to clean up test-created data
// This ensures the database is restored to its original state after tests
teardown("cleanup test data", async ({ page }) => {
  console.log("Starting global teardown - cleaning up test data...");

  // First authenticate as admin
  await page.goto("/login");

  const authResponse = await page.request.post("/api/test-auth", {
    data: { email: ADMIN_EMAIL },
  });

  if (!authResponse.ok()) {
    console.log("Failed to authenticate for teardown, skipping cleanup");
    return;
  }

  // Clean up test-created roles (non-system roles)
  console.log("Cleaning up test-created roles...");
  const rolesResponse = await page.request.get("/api/admin/roles");
  if (rolesResponse.ok()) {
    const rolesData = await rolesResponse.json();
    const testRoles = rolesData.roles?.filter(
      (r: { isSystem: boolean; name: string }) =>
        !r.isSystem && r.name.startsWith("test-role-")
    );

    for (const role of testRoles || []) {
      console.log(`  Deleting test role: ${role.name}`);
      await page.request.delete(`/api/admin/roles/${role.id}`);
    }
    console.log(`  Deleted ${testRoles?.length || 0} test roles`);
  }

  // Clean up test-created permissions (non-system permissions)
  console.log("Cleaning up test-created permissions...");
  const permsResponse = await page.request.get("/api/admin/permissions");
  if (permsResponse.ok()) {
    const permsData = await permsResponse.json();
    // Test permissions have patterns like "decks:test-{timestamp}" or unique action names
    const testPermissions = permsData.permissions?.filter(
      (p: { isSystem: boolean; action: string }) =>
        !p.isSystem && p.action.startsWith("test-")
    );

    for (const perm of testPermissions || []) {
      console.log(`  Deleting test permission: ${perm.name}`);
      await page.request.delete(`/api/admin/permissions/${perm.id}`);
    }
    console.log(`  Deleted ${testPermissions?.length || 0} test permissions`);
  }

  console.log("Global teardown complete - test data cleaned up");
});
