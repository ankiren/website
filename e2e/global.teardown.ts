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

  // Clean up test-created skills
  console.log("Cleaning up test-created skills...");
  const skillsResponse = await page.request.get("/api/admin/skills");
  if (skillsResponse.ok()) {
    const skillsData = await skillsResponse.json();
    // Only delete skills that match test patterns (contain timestamps or test prefixes)
    // Test skill names contain timestamps like "Test Skill 1765849790800"
    const testSkillPattern = /\d{13}|^Test |^API Test|^Detail |^Hero |^Stats |^Breadcrumb |^Edit |^Del|^Warn|^Hierarchy |^Sub-skill|^Circular |^Updated |^GP\d|^P\d|^C\d/;
    const allSkills = skillsData.skills || [];
    const testSkills = allSkills.filter((s: { name: string }) =>
      testSkillPattern.test(s.name)
    );
    // Sort by id descending to delete children before parents
    const sortedSkills = [...testSkills].sort(
      (a: { id: number }, b: { id: number }) => b.id - a.id
    );

    for (const skill of sortedSkills) {
      console.log(`  Deleting test skill: ${skill.name}`);
      await page.request.delete(`/api/admin/skills/${skill.id}`);
    }
    console.log(`  Deleted ${sortedSkills.length} test skills`);
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

  // Clean up test-created courses
  console.log("Cleaning up test-created courses...");
  const coursesResponse = await page.request.get("/api/admin/courses");
  if (coursesResponse.ok()) {
    const coursesData = await coursesResponse.json();
    // Test courses have patterns with timestamps or test prefixes
    const testCoursePattern = /\d{13}|^Test Course|^Published Course|^API Test Course|^Menu Test|^DelMenu Test|^Enroll Test|^Double Enroll|^Unenroll Test|^Draft Only|^Published Only|^Draft Course|^Draft Enroll|^Detail Test|^Update Test/;
    const testCourses = coursesData.courses?.filter((c: { name: string }) =>
      testCoursePattern.test(c.name)
    );

    for (const course of testCourses || []) {
      console.log(`  Deleting test course: ${course.name}`);
      await page.request.delete(`/api/admin/courses/${course.id}`);
    }
    console.log(`  Deleted ${testCourses?.length || 0} test courses`);
  }

  console.log("Global teardown complete - test data cleaned up");
});
