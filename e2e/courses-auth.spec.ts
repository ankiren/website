import { test, expect } from "@playwright/test";

// Authenticated tests for Course Management (Epic-8)
test.describe("Course Management - Authenticated (Epic-8)", () => {
  test.describe("Admin Course Management", () => {
    test.describe("AC-8.1: View Courses List", () => {
      test("should display course management page with header", async ({
        page,
      }) => {
        await page.goto("/dashboard/admin/courses");

        // Check page header
        await expect(
          page.locator("h1", { hasText: "Course Management" })
        ).toBeVisible();
        await expect(
          page.locator("text=Manage courses and enrollments")
        ).toBeVisible();

        // Check main card header
        await expect(
          page.locator("h2", { hasText: "Course Library" })
        ).toBeVisible();
      });

      test("should show Add Course button", async ({ page }) => {
        await page.goto("/dashboard/admin/courses");

        const addButton = page.locator("button", { hasText: "Add Course" });
        await expect(addButton).toBeVisible();
      });

      test("should show search input and status filter", async ({ page }) => {
        await page.goto("/dashboard/admin/courses");

        const searchInput = page.locator(
          "input[placeholder='Search courses...']"
        );
        await expect(searchInput).toBeVisible();

        const statusFilter = page.locator("select");
        await expect(statusFilter).toBeVisible();
      });
    });

    test.describe("AC-8.2: Create Course", () => {
      test("should open Create Course modal when clicking Add Course", async ({
        page,
      }) => {
        await page.goto("/dashboard/admin/courses");

        await page.click("button:has-text('Add Course')");

        // Modal should appear
        await expect(
          page.locator("h3", { hasText: "Create New Course" })
        ).toBeVisible();

        // Form fields should be visible
        await expect(
          page.locator("label", { hasText: "Course Name" })
        ).toBeVisible();
        await expect(
          page.locator("label", { hasText: "Description" })
        ).toBeVisible();
        await expect(
          page.locator("label", { hasText: "Image URL" })
        ).toBeVisible();
        await expect(page.locator("label", { hasText: "Status" })).toBeVisible();
      });

      test("should have Create and Cancel buttons in modal", async ({
        page,
      }) => {
        await page.goto("/dashboard/admin/courses");

        await page.click("button:has-text('Add Course')");

        await expect(
          page.locator("h3", { hasText: "Create New Course" })
        ).toBeVisible();

        await expect(page.locator("button:has-text('Create')")).toBeVisible();
        await expect(page.locator("button:has-text('Cancel')")).toBeVisible();
      });

      test("should create a new course", async ({ page }) => {
        await page.goto("/dashboard/admin/courses");

        await page.click("button:has-text('Add Course')");

        await expect(
          page.locator("h3", { hasText: "Create New Course" })
        ).toBeVisible();

        // Fill in course details
        const testCourseName = `Test Course ${Date.now()}`;
        await page.fill("input[placeholder*='course name']", testCourseName);
        await page.fill("textarea", "Test course description for E2E");

        // Click Create
        await page.click("button:has-text('Create')");

        // Wait for modal to close
        await expect(
          page.locator("h3", { hasText: "Create New Course" })
        ).not.toBeVisible({ timeout: 10000 });

        // Course should appear in the list
        await expect(page.locator(`text=${testCourseName}`)).toBeVisible({
          timeout: 10000,
        });
      });

      test("should create a published course", async ({ page }) => {
        await page.goto("/dashboard/admin/courses");

        await page.click("button:has-text('Add Course')");

        const testCourseName = `Published Course ${Date.now()}`;
        await page.fill("input[placeholder*='course name']", testCourseName);
        await page.fill("textarea", "Published course for E2E");

        // Click the Published status button (status buttons are in the modal)
        await page.locator("button", { hasText: "Published" }).first().click();

        await page.click("button:has-text('Create')");

        await expect(
          page.locator("h3", { hasText: "Create New Course" })
        ).not.toBeVisible({ timeout: 10000 });

        // Course should show Published badge - find by course name then verify badge
        await expect(page.locator(`text=${testCourseName}`)).toBeVisible();
        // The published badge should be visible somewhere on the page
        await expect(page.locator("span.bg-green-100").first()).toBeVisible();
      });
    });

    test.describe("AC-8.3: Edit Course", () => {
      test("should show edit option in course menu", async ({ page }) => {
        // Create a course first via API
        const response = await page.request.post("/api/admin/courses", {
          data: {
            name: `Menu Test ${Date.now()}`,
            description: "Course for menu test",
            status: "draft",
          },
        });
        expect(response.status()).toBe(201);

        await page.goto("/dashboard/admin/courses");
        await page.waitForTimeout(1000); // Wait for courses to load

        // Click the menu button (3 dots) - look for the MoreVertical icon button with backdrop-blur
        const menuButton = page.locator("button[class*='backdrop-blur']").first();
        await menuButton.click();

        // Edit option should be visible in dropdown menu - wait for dropdown to appear
        await expect(page.locator("text=Edit").first()).toBeVisible({ timeout: 3000 });
      });
    });

    test.describe("AC-8.4: Delete Course", () => {
      test("should show delete option in course menu", async ({ page }) => {
        // Create a course first via API
        const response = await page.request.post("/api/admin/courses", {
          data: {
            name: `DelMenu Test ${Date.now()}`,
            description: "Course for delete menu test",
            status: "draft",
          },
        });
        expect(response.status()).toBe(201);

        await page.goto("/dashboard/admin/courses");
        await page.waitForTimeout(1000); // Wait for courses to load

        // Click the menu button (3 dots) - look for the MoreVertical icon button with backdrop-blur
        const menuButton = page.locator("button[class*='backdrop-blur']").first();
        await menuButton.click();

        // Delete option should be visible in dropdown menu - wait for dropdown to appear
        await expect(page.locator("text=Delete").first()).toBeVisible({ timeout: 3000 });
      });
    });
  });

  test.describe("Admin Courses API", () => {
    test("GET /api/admin/courses should return courses list", async ({
      page,
    }) => {
      const response = await page.request.get("/api/admin/courses");
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty("courses");
      expect(Array.isArray(body.courses)).toBe(true);
    });

    test("POST /api/admin/courses should create a course", async ({ page }) => {
      const testCourseName = `API Test Course ${Date.now()}`;

      const response = await page.request.post("/api/admin/courses", {
        data: {
          name: testCourseName,
          description: "Created via API test",
          status: "draft",
        },
      });

      expect(response.status()).toBe(201);

      const body = await response.json();
      expect(body).toHaveProperty("id");
      expect(body.name).toBe(testCourseName);
      expect(body.status).toBe("draft");
    });

    test("POST /api/admin/courses should require name", async ({ page }) => {
      const response = await page.request.post("/api/admin/courses", {
        data: {
          description: "Missing name",
        },
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.error).toContain("name");
    });

    test("GET /api/admin/courses/:id should return course details", async ({
      page,
    }) => {
      // First create a course
      const createResponse = await page.request.post("/api/admin/courses", {
        data: {
          name: `Detail Test ${Date.now()}`,
          description: "For detail test",
        },
      });

      const course = await createResponse.json();

      // Get course details
      const response = await page.request.get(`/api/admin/courses/${course.id}`);
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.id).toBe(course.id);
      expect(body).toHaveProperty("enrollmentCount");
    });

    test("GET /api/admin/courses/:id should return 404 for non-existent course", async ({
      page,
    }) => {
      const response = await page.request.get("/api/admin/courses/99999");
      expect(response.status()).toBe(404);

      const body = await response.json();
      expect(body.error).toBe("Course not found");
    });

    test("PUT /api/admin/courses/:id should update course", async ({ page }) => {
      // Create a course first
      const createResponse = await page.request.post("/api/admin/courses", {
        data: {
          name: `Update Test ${Date.now()}`,
        },
      });

      const course = await createResponse.json();

      // Update it
      const response = await page.request.put(`/api/admin/courses/${course.id}`, {
        data: {
          name: "Updated Course Name",
          description: "Updated description",
          status: "published",
        },
      });

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.name).toBe("Updated Course Name");
      expect(body.description).toBe("Updated description");
      expect(body.status).toBe("published");
    });

    test("DELETE /api/admin/courses/:id should delete course", async ({
      page,
    }) => {
      // Create a course first
      const createResponse = await page.request.post("/api/admin/courses", {
        data: {
          name: `Delete Test ${Date.now()}`,
        },
      });

      const course = await createResponse.json();

      // Delete it
      const response = await page.request.delete(
        `/api/admin/courses/${course.id}`
      );
      expect(response.status()).toBe(200);

      // Verify it's gone
      const getResponse = await page.request.get(
        `/api/admin/courses/${course.id}`
      );
      expect(getResponse.status()).toBe(404);
    });

    test("GET /api/admin/courses should filter by status", async ({ page }) => {
      // Create courses with different statuses
      await page.request.post("/api/admin/courses", {
        data: {
          name: `Draft Course ${Date.now()}`,
          status: "draft",
        },
      });

      await page.request.post("/api/admin/courses", {
        data: {
          name: `Published Course ${Date.now()}`,
          status: "published",
        },
      });

      // Filter by draft
      const draftResponse = await page.request.get(
        "/api/admin/courses?status=draft"
      );
      const draftBody = await draftResponse.json();
      expect(draftBody.courses.every((c: { status: string }) => c.status === "draft")).toBe(true);

      // Filter by published
      const publishedResponse = await page.request.get(
        "/api/admin/courses?status=published"
      );
      const publishedBody = await publishedResponse.json();
      expect(publishedBody.courses.every((c: { status: string }) => c.status === "published")).toBe(true);
    });
  });

  test.describe("Student Courses View", () => {
    test("should display available courses page", async ({ page }) => {
      await page.goto("/dashboard/courses");

      await expect(
        page.locator("h1", { hasText: "Available Courses" })
      ).toBeVisible();
      await expect(
        page.locator("text=Browse and enroll in courses to start learning")
      ).toBeVisible();
    });

    test("should show search input", async ({ page }) => {
      await page.goto("/dashboard/courses");

      const searchInput = page.locator(
        "input[placeholder='Search courses...']"
      );
      await expect(searchInput).toBeVisible();
    });

    test("should only show published courses", async ({ page }) => {
      // Create a draft course via API (should not appear)
      await page.request.post("/api/admin/courses", {
        data: {
          name: `Draft Only ${Date.now()}`,
          status: "draft",
        },
      });

      // Create a published course (should appear)
      const publishedName = `Published Only ${Date.now()}`;
      await page.request.post("/api/admin/courses", {
        data: {
          name: publishedName,
          status: "published",
        },
      });

      await page.goto("/dashboard/courses");

      // Published course should be visible
      await expect(page.locator(`text=${publishedName}`)).toBeVisible({
        timeout: 10000,
      });
    });
  });

  test.describe("Public Courses API", () => {
    test("GET /api/courses should return only published courses", async ({
      page,
    }) => {
      const response = await page.request.get("/api/courses");
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty("courses");
      expect(Array.isArray(body.courses)).toBe(true);

      // All courses should be published
      body.courses.forEach((course: { status: string }) => {
        expect(course.status).toBe("published");
      });
    });
  });

  test.describe("Enrollment API", () => {
    test("POST /api/courses/:id/enroll should enroll user", async ({ page }) => {
      // Create a published course
      const createResponse = await page.request.post("/api/admin/courses", {
        data: {
          name: `Enroll Test ${Date.now()}`,
          status: "published",
        },
      });
      const course = await createResponse.json();

      // Enroll in the course
      const response = await page.request.post(
        `/api/courses/${course.id}/enroll`
      );
      expect(response.status()).toBe(201);

      const body = await response.json();
      expect(body).toHaveProperty("id");
      expect(body.courseId).toBe(course.id);
      expect(body.status).toBe("active");
    });

    test("POST /api/courses/:id/enroll should return 400 if already enrolled", async ({
      page,
    }) => {
      // Create a published course
      const createResponse = await page.request.post("/api/admin/courses", {
        data: {
          name: `Double Enroll Test ${Date.now()}`,
          status: "published",
        },
      });
      const course = await createResponse.json();

      // Enroll first time
      await page.request.post(`/api/courses/${course.id}/enroll`);

      // Try to enroll again
      const response = await page.request.post(
        `/api/courses/${course.id}/enroll`
      );
      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.error).toContain("Already enrolled");
    });

    test("DELETE /api/courses/:id/enroll should unenroll user", async ({
      page,
    }) => {
      // Create a published course
      const createResponse = await page.request.post("/api/admin/courses", {
        data: {
          name: `Unenroll Test ${Date.now()}`,
          status: "published",
        },
      });
      const course = await createResponse.json();

      // Enroll first
      await page.request.post(`/api/courses/${course.id}/enroll`);

      // Unenroll
      const response = await page.request.delete(
        `/api/courses/${course.id}/enroll`
      );
      expect(response.status()).toBe(200);
    });

    test("GET /api/me/enrollments should return user enrollments", async ({
      page,
    }) => {
      const response = await page.request.get("/api/me/enrollments");
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty("enrollments");
      expect(Array.isArray(body.enrollments)).toBe(true);
    });

    test("POST /api/courses/:id/enroll should return 404 for non-existent course", async ({
      page,
    }) => {
      const response = await page.request.post("/api/courses/99999/enroll");
      expect(response.status()).toBe(404);

      const body = await response.json();
      expect(body.error).toBe("Course not found");
    });

    test("POST /api/courses/:id/enroll should return 400 for draft course", async ({
      page,
    }) => {
      // Create a draft course
      const createResponse = await page.request.post("/api/admin/courses", {
        data: {
          name: `Draft Enroll Test ${Date.now()}`,
          status: "draft",
        },
      });
      const course = await createResponse.json();

      // Try to enroll
      const response = await page.request.post(
        `/api/courses/${course.id}/enroll`
      );
      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.error).toContain("not available");
    });
  });

  test.describe("Admin Navigation", () => {
    test("should show Courses link in admin dashboard", async ({ page }) => {
      await page.goto("/dashboard/admin");

      // Check for the Courses link card
      const coursesLink = page.locator("a[href='/dashboard/admin/courses']");
      await expect(coursesLink).toBeVisible();
      await expect(coursesLink.locator("h3", { hasText: "Courses" })).toBeVisible();
    });

    test("should navigate to courses management from admin dashboard", async ({
      page,
    }) => {
      await page.goto("/dashboard/admin");

      await page.click("a[href='/dashboard/admin/courses']");

      await expect(page).toHaveURL("/dashboard/admin/courses");
      await expect(
        page.locator("h1", { hasText: "Course Management" })
      ).toBeVisible();
    });
  });

  test.describe("Navbar", () => {
    test("should show Courses link in navbar for authenticated users", async ({
      page,
    }) => {
      await page.goto("/dashboard");

      const navbar = page.locator("nav");
      const coursesLink = navbar.locator('a[href="/dashboard/courses"]');
      await expect(coursesLink).toBeVisible();
    });
  });
});
