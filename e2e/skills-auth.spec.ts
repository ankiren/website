import { test, expect } from "@playwright/test";

// Authenticated admin tests for Skills Management (US-6.1)
test.describe("Skills Management - Authenticated (US-6.1)", () => {
  test.describe("AC-6.1.1: View Skills List", () => {
    test("should display skills management page with header", async ({
      page,
    }) => {
      await page.goto("/dashboard/admin/skills");

      // Check page header
      await expect(
        page.locator("h1", { hasText: "Skill Management" })
      ).toBeVisible();
      await expect(
        page.locator("text=Manage skills and their hierarchy")
      ).toBeVisible();

      // Check main card header
      await expect(page.locator("h2", { hasText: "Skill Library" })).toBeVisible();
    });

    test("should show Tree view as default", async ({ page }) => {
      await page.goto("/dashboard/admin/skills");

      // Tree button should be active (has white background)
      const treeButton = page.locator("button", { hasText: "Tree" });
      await expect(treeButton).toBeVisible();
      await expect(treeButton).toHaveClass(/bg-white/);
    });

    test("should show Add Skill button", async ({ page }) => {
      await page.goto("/dashboard/admin/skills");

      const addButton = page.locator("button", { hasText: "Add Skill" });
      await expect(addButton).toBeVisible();
    });

    test("should show search input", async ({ page }) => {
      await page.goto("/dashboard/admin/skills");

      const searchInput = page.locator("input[placeholder='Search skills...']");
      await expect(searchInput).toBeVisible();
    });

    test("should switch between Tree and Grid views", async ({ page }) => {
      await page.goto("/dashboard/admin/skills");

      // Click Grid button
      await page.click("button:has-text('Grid')");

      // URL should update with view param
      await expect(page).toHaveURL(/view=grid/);

      // Grid button should now be active
      const gridButton = page.locator("button", { hasText: "Grid" });
      await expect(gridButton).toHaveClass(/bg-white/);

      // Click Tree button
      await page.click("button:has-text('Tree')");

      // URL should update
      await expect(page).toHaveURL(/view=tree/);
    });
  });

  test.describe("AC-6.1.3: Create New Skill", () => {
    test("should open Create Skill modal when clicking Add Skill", async ({
      page,
    }) => {
      await page.goto("/dashboard/admin/skills");

      await page.click("button:has-text('Add Skill')");

      // Modal should appear
      await expect(
        page.locator("h3", { hasText: "Create New Skill" })
      ).toBeVisible();

      // Form fields should be visible
      await expect(page.locator("label", { hasText: "Skill Name" })).toBeVisible();
      await expect(page.locator("label", { hasText: "Description" })).toBeVisible();
      await expect(page.locator("label", { hasText: "Parent Skill" })).toBeVisible();
      await expect(page.locator("label", { hasText: "Color" })).toBeVisible();
      await expect(page.locator("label", { hasText: "Icon" })).toBeVisible();
    });

    test("should have Create and Cancel buttons in modal", async ({ page }) => {
      await page.goto("/dashboard/admin/skills");

      // Wait for page to load
      await expect(page.locator("h2", { hasText: "Skill Library" })).toBeVisible();

      await page.click("button:has-text('Add Skill')");

      // Wait for modal to open
      await expect(page.locator("h3", { hasText: "Create New Skill" })).toBeVisible();

      // Get the modal and verify buttons exist within it
      const modal = page.locator('[role="dialog"], .fixed.inset-0.z-50');
      await expect(modal.locator("button:has-text('Create')")).toHaveCount(1);
      await expect(modal.locator("button:has-text('Cancel')")).toHaveCount(1);
    });

    test("should close modal when clicking X button", async ({ page }) => {
      await page.goto("/dashboard/admin/skills");

      // Wait for page to load
      await expect(page.locator("h2", { hasText: "Skill Library" })).toBeVisible();

      await page.click("button:has-text('Add Skill')");
      await expect(
        page.locator("h3", { hasText: "Create New Skill" })
      ).toBeVisible();

      // Click the X close button (always visible at top of modal)
      await page.locator(".fixed button").first().click();

      // Modal should close
      await expect(
        page.locator("h3", { hasText: "Create New Skill" })
      ).not.toBeVisible({ timeout: 5000 });
    });

    test("should create a new root skill", async ({ page }) => {
      await page.goto("/dashboard/admin/skills");

      // Wait for page to load
      await expect(page.locator("h2", { hasText: "Skill Library" })).toBeVisible();

      await page.click("button:has-text('Add Skill')");

      // Wait for modal to open
      await expect(page.locator("h3", { hasText: "Create New Skill" })).toBeVisible();

      // Fill in skill details
      const testSkillName = `Test Skill ${Date.now()}`;
      await page.fill("input[placeholder*='name']", testSkillName);
      await page.fill("textarea", "Test skill description for E2E");

      // Scroll modal and click Create
      await page.locator("button:has-text('Create')").scrollIntoViewIfNeeded();
      await page.click("button:has-text('Create')");

      // Wait for modal to close
      await expect(
        page.locator("h3", { hasText: "Create New Skill" })
      ).not.toBeVisible({ timeout: 10000 });

      // Skill should appear in the list
      await expect(page.locator(`text=${testSkillName}`)).toBeVisible({
        timeout: 10000,
      });
    });
  });

  test.describe("AC-6.1.7: Search Skills", () => {
    test("should filter skills when searching", async ({ page }) => {
      await page.goto("/dashboard/admin/skills");

      // Wait for page to load
      await expect(page.locator("h2", { hasText: "Skill Library" })).toBeVisible();

      const searchInput = page.locator("input[placeholder='Search skills...']");
      await searchInput.fill("zzz-nonexistent-skill-xyz-12345-zzz");

      // Wait for filter to apply
      await page.waitForTimeout(1000);

      // Should show 0 matching in the format "(0 matching 'query')"
      await expect(page.locator("text=0 matching")).toBeVisible({ timeout: 5000 });
    });

    test("should clear search and show all skills", async ({ page }) => {
      await page.goto("/dashboard/admin/skills");

      const searchInput = page.locator("input[placeholder='Search skills...']");

      // Search for something
      await searchInput.fill("test");
      await page.waitForTimeout(500);

      // Clear search
      await searchInput.fill("");

      // Should show total skills count
      await expect(page.locator("text=total skills")).toBeVisible();
    });
  });

  test.describe("API Endpoints", () => {
    test("GET /api/admin/skills should return skills tree", async ({
      page,
    }) => {
      const response = await page.request.get("/api/admin/skills");
      const body = await response.json();

      // Debug: log response if not 200
      if (response.status() !== 200) {
        console.log("API Response Status:", response.status());
        console.log("API Response Body:", JSON.stringify(body));
      }

      expect(response.status()).toBe(200);
      expect(body).toHaveProperty("skills");
      expect(Array.isArray(body.skills)).toBe(true);
    });

    test("POST /api/admin/skills should create a skill", async ({ page }) => {
      const testSkillName = `API Test Skill ${Date.now()}`;

      const response = await page.request.post("/api/admin/skills", {
        data: {
          name: testSkillName,
          description: "Created via API test",
          icon: "Star",
          color: 1,
          parentId: null,
        },
      });

      expect(response.status()).toBe(201);

      const body = await response.json();
      expect(body).toHaveProperty("id");
      expect(body.name).toBe(testSkillName);
    });

    test("POST /api/admin/skills should require name", async ({ page }) => {
      const response = await page.request.post("/api/admin/skills", {
        data: {
          description: "Missing name",
        },
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.error).toContain("name");
    });

    test("GET /api/admin/skills/:id should return skill details", async ({
      page,
    }) => {
      // First create a skill
      const createResponse = await page.request.post("/api/admin/skills", {
        data: {
          name: `Detail Test ${Date.now()}`,
          description: "For detail test",
        },
      });

      const skill = await createResponse.json();

      // Get skill details
      const response = await page.request.get(`/api/admin/skills/${skill.id}`);
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.id).toBe(skill.id);
      expect(body).toHaveProperty("stats");
      expect(body).toHaveProperty("ancestors");
      expect(body).toHaveProperty("children");
    });

    test("GET /api/admin/skills/:id should return 404 for non-existent skill", async ({
      page,
    }) => {
      const response = await page.request.get("/api/admin/skills/99999");
      expect(response.status()).toBe(404);

      const body = await response.json();
      expect(body.error).toBe("Skill not found");
    });

    test("PUT /api/admin/skills/:id should update skill", async ({ page }) => {
      // Create a skill first
      const createResponse = await page.request.post("/api/admin/skills", {
        data: {
          name: `Update Test ${Date.now()}`,
        },
      });

      const skill = await createResponse.json();

      // Update it
      const response = await page.request.put(`/api/admin/skills/${skill.id}`, {
        data: {
          name: "Updated Name",
          description: "Updated description",
          color: 5,
        },
      });

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.name).toBe("Updated Name");
      expect(body.description).toBe("Updated description");
      expect(body.color).toBe(5);
    });

    test("DELETE /api/admin/skills/:id should delete skill", async ({
      page,
    }) => {
      // Create a skill first
      const createResponse = await page.request.post("/api/admin/skills", {
        data: {
          name: `Delete Test ${Date.now()}`,
        },
      });

      const skill = await createResponse.json();

      // Delete it
      const response = await page.request.delete(
        `/api/admin/skills/${skill.id}`
      );
      expect(response.status()).toBe(200);

      // Verify it's gone
      const getResponse = await page.request.get(
        `/api/admin/skills/${skill.id}`
      );
      expect(getResponse.status()).toBe(404);
    });

    test("DELETE should cascade delete children", async ({ page }) => {
      // Create parent skill
      const parentResponse = await page.request.post("/api/admin/skills", {
        data: {
          name: `Parent ${Date.now()}`,
        },
      });
      const parent = await parentResponse.json();

      // Create child skill
      const childResponse = await page.request.post("/api/admin/skills", {
        data: {
          name: `Child ${Date.now()}`,
          parentId: parent.id,
        },
      });
      const child = await childResponse.json();

      // Delete parent
      await page.request.delete(`/api/admin/skills/${parent.id}`);

      // Child should also be deleted
      const getChildResponse = await page.request.get(
        `/api/admin/skills/${child.id}`
      );
      expect(getChildResponse.status()).toBe(404);
    });

    test("PUT should prevent circular reference", async ({ page }) => {
      // Create parent
      const parentResponse = await page.request.post("/api/admin/skills", {
        data: {
          name: `Circular Parent ${Date.now()}`,
        },
      });
      const parent = await parentResponse.json();

      // Create child
      const childResponse = await page.request.post("/api/admin/skills", {
        data: {
          name: `Circular Child ${Date.now()}`,
          parentId: parent.id,
        },
      });
      const child = await childResponse.json();

      // Try to set parent's parent to child (circular)
      const response = await page.request.put(`/api/admin/skills/${parent.id}`, {
        data: {
          name: parent.name,
          parentId: child.id,
        },
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.error).toContain("parent or descendant");
    });
  });

  test.describe("AC-6.1.2: View Skill Detail", () => {
    test("should navigate to skill detail page when clicking a skill", async ({
      page,
    }) => {
      // First create a skill to ensure there's at least one
      const response = await page.request.post("/api/admin/skills", {
        data: {
          name: `Detail Nav Test ${Date.now()}`,
          description: "Test skill for navigation",
        },
      });
      const skill = await response.json();

      await page.goto("/dashboard/admin/skills");

      // Wait for page to fully load
      await expect(page.locator("h2", { hasText: "Skill Library" })).toBeVisible();
      await page.waitForTimeout(1000);

      // Click on the specific skill we just created
      const skillButton = page.locator(`text=${skill.name}`).first();
      await skillButton.click();

      // Should navigate to detail page
      await expect(page).toHaveURL(/\/dashboard\/admin\/skills\/\d+/, { timeout: 10000 });
    });

    test("should display skill detail page with hero section", async ({
      page,
    }) => {
      // Create a skill
      const response = await page.request.post("/api/admin/skills", {
        data: {
          name: `Hero Test ${Date.now()}`,
          description: "Test description for hero section",
        },
      });
      const skill = await response.json();

      await page.goto(`/dashboard/admin/skills/${skill.id}`);

      // Check hero section
      await expect(page.locator("h2", { hasText: skill.name })).toBeVisible();
      await expect(
        page.locator("text=Test description for hero section")
      ).toBeVisible();
    });

    test("should display quick stats on detail page", async ({ page }) => {
      // Create a parent skill
      const parentResponse = await page.request.post("/api/admin/skills", {
        data: {
          name: `Stats Parent ${Date.now()}`,
        },
      });
      const parent = await parentResponse.json();

      // Create child skills
      await page.request.post("/api/admin/skills", {
        data: { name: `Stats Child 1 ${Date.now()}`, parentId: parent.id },
      });
      await page.request.post("/api/admin/skills", {
        data: { name: `Stats Child 2 ${Date.now()}`, parentId: parent.id },
      });

      await page.goto(`/dashboard/admin/skills/${parent.id}`);

      // Check stats are displayed
      await expect(page.locator("text=Direct sub-skills")).toBeVisible();
      await expect(page.locator("text=Total in tree")).toBeVisible();
      await expect(page.locator("text=Depth in hierarchy")).toBeVisible();
    });

    test("should display breadcrumb navigation", async ({ page }) => {
      await page.goto("/dashboard/admin/skills");

      // Check that Skills link exists in breadcrumb on any detail page
      const response = await page.request.post("/api/admin/skills", {
        data: {
          name: `Breadcrumb Test ${Date.now()}`,
        },
      });
      const skill = await response.json();

      await page.goto(`/dashboard/admin/skills/${skill.id}`);

      // Should show Skills link in breadcrumb
      await expect(
        page.locator("nav a", { hasText: "Skills" })
      ).toBeVisible();
    });

    test("should show 404 for non-existent skill", async ({ page }) => {
      await page.goto("/dashboard/admin/skills/99999");

      await expect(page.locator("text=Skill Not Found")).toBeVisible();
      await expect(
        page.locator("a", { hasText: "Back to Skills" })
      ).toBeVisible();
    });
  });

  test.describe("AC-6.1.4: Edit Skill", () => {
    test("should open Edit modal from detail page", async ({ page }) => {
      // Create a skill
      const response = await page.request.post("/api/admin/skills", {
        data: {
          name: `Edit Modal Test ${Date.now()}`,
          description: "Original description",
        },
      });
      const skill = await response.json();

      await page.goto(`/dashboard/admin/skills/${skill.id}`);

      // Click Edit button
      await page.click("button:has-text('Edit Skill')");

      // Modal should appear with current values
      await expect(
        page.locator("h3", { hasText: "Edit Skill" })
      ).toBeVisible();

      // Name input should have current value
      const nameInput = page.locator("input[placeholder*='skill name']");
      await expect(nameInput).toHaveValue(skill.name);
    });

    test("should update skill from Edit modal", async ({ page }) => {
      // Create a skill
      const response = await page.request.post("/api/admin/skills", {
        data: {
          name: `Edit Update Test ${Date.now()}`,
        },
      });
      const skill = await response.json();

      await page.goto(`/dashboard/admin/skills/${skill.id}`);

      // Click Edit button
      await page.click("button:has-text('Edit Skill')");

      // Update name
      const nameInput = page.locator("input[placeholder*='skill name']");
      await nameInput.clear();
      await nameInput.fill("Updated Skill Name");

      // Save
      await page.click("button:has-text('Save')");

      // Modal should close and name should update
      await expect(
        page.locator("h3", { hasText: "Edit Skill" })
      ).not.toBeVisible({ timeout: 5000 });

      await expect(page.locator("h2", { hasText: "Updated Skill Name" })).toBeVisible();
    });
  });

  test.describe("AC-6.1.5: Delete Skill", () => {
    test("should open Delete confirmation modal", async ({ page }) => {
      // Create a skill
      const response = await page.request.post("/api/admin/skills", {
        data: {
          name: `DelModal${Date.now()}`,
        },
      });
      const skill = await response.json();

      await page.goto(`/dashboard/admin/skills/${skill.id}`);

      // Wait for page to fully load with Actions section
      await expect(page.locator("h3", { hasText: "Actions" })).toBeVisible({ timeout: 10000 });

      // Click Delete button
      const deleteButton = page.locator("button:has-text('Delete Skill')");
      await deleteButton.scrollIntoViewIfNeeded();
      await deleteButton.click();

      // Confirmation modal should appear - check for Cancel button in modal
      await expect(page.locator(".fixed button:has-text('Cancel')")).toBeVisible({ timeout: 5000 });
    });

    test("should cancel deletion when clicking Cancel", async ({ page }) => {
      // Create a skill
      const response = await page.request.post("/api/admin/skills", {
        data: {
          name: `Delete Cancel Test ${Date.now()}`,
        },
      });
      const skill = await response.json();

      await page.goto(`/dashboard/admin/skills/${skill.id}`);

      await page.click("button:has-text('Delete Skill')");
      await page.click("button:has-text('Cancel')");

      // Should still be on detail page
      await expect(page).toHaveURL(
        `/dashboard/admin/skills/${skill.id}`
      );
    });

    test("should delete skill and redirect to list", async ({ page }) => {
      // Create a skill
      const response = await page.request.post("/api/admin/skills", {
        data: {
          name: `Delete Confirm Test ${Date.now()}`,
        },
      });
      const skill = await response.json();

      await page.goto(`/dashboard/admin/skills/${skill.id}`);

      await page.click("button:has-text('Delete Skill')");

      // Click Delete in confirmation modal
      await page.locator(".fixed button:has-text('Delete')").click();

      // Should redirect to skills list
      await expect(page).toHaveURL("/dashboard/admin/skills", {
        timeout: 5000,
      });
    });

    test("should show warning for skills with children", async ({ page }) => {
      const timestamp = Date.now();

      // Create parent skill
      const parentResponse = await page.request.post("/api/admin/skills", {
        data: {
          name: `WarnP${timestamp}`,
        },
      });
      const parent = await parentResponse.json();

      // Create child skill
      await page.request.post("/api/admin/skills", {
        data: {
          name: `WarnC${timestamp}`,
          parentId: parent.id,
        },
      });

      await page.goto(`/dashboard/admin/skills/${parent.id}`);

      // Wait for page to fully load with Actions section
      await expect(page.locator("h3", { hasText: "Actions" })).toBeVisible({ timeout: 10000 });

      // Click Delete button
      const deleteButton = page.locator("button:has-text('Delete Skill')");
      await deleteButton.scrollIntoViewIfNeeded();
      await deleteButton.click();

      // Check for warning text: "This will also delete X sub-skill" - use getByText for partial match
      await expect(page.getByText(/will also delete.*sub-skill/i)).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe("AC-6.1.6: Skill Hierarchy", () => {
    test("should display parent-child relationships in tree view", async ({
      page,
    }) => {
      // Create parent skill
      const parentResponse = await page.request.post("/api/admin/skills", {
        data: {
          name: `Hierarchy Parent ${Date.now()}`,
        },
      });
      const parent = await parentResponse.json();

      // Create child skill
      const childResponse = await page.request.post("/api/admin/skills", {
        data: {
          name: `Hierarchy Child ${Date.now()}`,
          parentId: parent.id,
        },
      });
      const child = await childResponse.json();

      await page.goto("/dashboard/admin/skills");

      // Parent should show child count badge
      await expect(page.locator(`text=${parent.name}`)).toBeVisible();

      // Expand parent to see child
      const expandButton = page
        .locator(`button:has-text("${parent.name}")`)
        .locator("xpath=ancestor::button")
        .first();

      // Child should be visible
      await expect(page.locator(`text=${child.name}`)).toBeVisible();
    });

    test("should show sub-skills on parent detail page", async ({ page }) => {
      // Create parent skill
      const parentResponse = await page.request.post("/api/admin/skills", {
        data: {
          name: `Sub-skills Parent ${Date.now()}`,
        },
      });
      const parent = await parentResponse.json();

      // Create child skills
      const child1Response = await page.request.post("/api/admin/skills", {
        data: {
          name: `Sub-skill 1 ${Date.now()}`,
          parentId: parent.id,
        },
      });
      const child1 = await child1Response.json();

      await page.goto(`/dashboard/admin/skills/${parent.id}`);

      // Sub-skills section should show children
      await expect(page.locator("h3", { hasText: "Sub-skills" })).toBeVisible();
      await expect(page.locator(`text=${child1.name}`)).toBeVisible();
    });

    test("should show Skill Path in sidebar", async ({ page }) => {
      const timestamp = Date.now();

      // Create grandparent
      const gpResponse = await page.request.post("/api/admin/skills", {
        data: { name: `GP${timestamp}` },
      });
      const grandparent = await gpResponse.json();

      // Create parent
      const pResponse = await page.request.post("/api/admin/skills", {
        data: { name: `P${timestamp}`, parentId: grandparent.id },
      });
      const parent = await pResponse.json();

      // Create child
      const cResponse = await page.request.post("/api/admin/skills", {
        data: { name: `C${timestamp}`, parentId: parent.id },
      });
      const child = await cResponse.json();

      await page.goto(`/dashboard/admin/skills/${child.id}`);

      // Wait for page to load
      await expect(page.locator("h1", { hasText: "Skill Details" })).toBeVisible();

      // Skill Path section should exist and show "Current" badge
      await expect(page.locator("h3", { hasText: "Skill Path" })).toBeVisible();
      await expect(page.locator("text=Current")).toBeVisible();

      // Verify depth is Level 3 (grandparent > parent > child)
      await expect(page.locator("text=Level 3")).toBeVisible();
    });
  });
});
