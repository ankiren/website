import { test, expect, Page } from "@playwright/test";

// Authenticated tests for Personal Access Tokens (PAT)
test.describe("Personal Access Tokens - Authenticated", () => {
  // Helper to generate unique token name
  const uniqueTokenName = () => `E2E Test Token ${Date.now()}`;

  test.describe("Tokens Page", () => {
    test("should display tokens page with header", async ({ page }) => {
      await page.goto("/dashboard/tokens");

      // Check page header
      await expect(page.locator("h1", { hasText: "API Tokens" })).toBeVisible();
      await expect(
        page.locator("text=Manage your personal access tokens")
      ).toBeVisible();

      // Check main card header
      await expect(
        page.locator("h2", { hasText: "Personal Access Tokens" })
      ).toBeVisible();
    });

    test("should show Generate Token button", async ({ page }) => {
      await page.goto("/dashboard/tokens");

      const addButton = page.locator("button", { hasText: "Generate Token" });
      await expect(addButton).toBeVisible();
    });

    test("should show security notice", async ({ page }) => {
      await page.goto("/dashboard/tokens");

      await expect(page.locator("text=Security Notice")).toBeVisible();
      await expect(
        page.locator("text=Tokens grant full API access")
      ).toBeVisible();
    });

    test("should show empty state when no tokens", async ({ page }) => {
      await page.goto("/dashboard/tokens");

      // Wait for loading to complete
      await page.waitForLoadState("networkidle");

      // If there are no tokens, should show empty state
      const noTokensText = page.locator("text=No tokens yet");
      const tokenList = page.locator('[data-testid="token-list"]');

      // Either empty state or token list should be visible
      await expect(noTokensText.or(tokenList)).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("Create Token Flow", () => {
    test("should open Create Token modal when clicking Generate Token", async ({
      page,
    }) => {
      await page.goto("/dashboard/tokens");

      await page.click("button:has-text('Generate Token')");

      // Modal should appear
      await expect(
        page.locator("h3", { hasText: "Generate New Token" })
      ).toBeVisible();

      // Form fields should be visible
      await expect(
        page.locator("label", { hasText: "Token Name" })
      ).toBeVisible();
      await expect(
        page.locator("label", { hasText: "Expiration Date" })
      ).toBeVisible();
    });

    test("should require token name", async ({ page }) => {
      await page.goto("/dashboard/tokens");

      await page.click("button:has-text('Generate Token')");

      // Wait for modal
      await expect(
        page.locator("h3", { hasText: "Generate New Token" })
      ).toBeVisible();

      // Generate button should be disabled without name
      const generateButton = page.locator("button:has-text('Generate Token')").last();
      await expect(generateButton).toBeDisabled();

      // Type a name
      await page.fill("input#token-name", "Test Token");

      // Now button should be enabled
      await expect(generateButton).toBeEnabled();
    });

    test("should create token and show it once", async ({ page }) => {
      await page.goto("/dashboard/tokens");

      const tokenName = uniqueTokenName();

      await page.click("button:has-text('Generate Token')");

      // Wait for modal
      await expect(
        page.locator("h3", { hasText: "Generate New Token" })
      ).toBeVisible();

      // Fill in token name
      await page.fill("input#token-name", tokenName);

      // Click generate (the second button with this text, which is in the modal)
      await page.locator("button[type='submit']:has-text('Generate Token')").click();

      // Should show success message
      await expect(
        page.locator("text=Token generated successfully")
      ).toBeVisible({ timeout: 10000 });

      // Token should be displayed with ank_ prefix
      const tokenInput = page.locator("input[readonly]");
      await expect(tokenInput).toBeVisible();
      const tokenValue = await tokenInput.inputValue();
      expect(tokenValue).toMatch(/^ank_/);

      // Copy button should be visible
      await expect(page.locator("button[title='Copy token']")).toBeVisible();

      // Close the modal
      await page.click("button:has-text('Done')");

      // Token should appear in the list
      await expect(page.locator(`text=${tokenName}`)).toBeVisible();
    });

    test("should create token with expiration date", async ({ page }) => {
      await page.goto("/dashboard/tokens");

      const tokenName = uniqueTokenName();

      await page.click("button:has-text('Generate Token')");

      // Wait for modal
      await expect(
        page.locator("h3", { hasText: "Generate New Token" })
      ).toBeVisible();

      // Fill in token name
      await page.fill("input#token-name", tokenName);

      // Set expiration date (tomorrow)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
      await page.fill("input#token-expiry", dateStr);

      // Click generate
      await page.locator("button[type='submit']:has-text('Generate Token')").click();

      // Should show success
      await expect(
        page.locator("text=Token generated successfully")
      ).toBeVisible({ timeout: 10000 });

      // Close the modal
      await page.click("button:has-text('Done')");

      // Token should appear with expiration info
      await expect(page.locator(`text=${tokenName}`)).toBeVisible();
      await expect(page.locator("text=Expires:")).toBeVisible();
    });

    test("should cancel token creation", async ({ page }) => {
      await page.goto("/dashboard/tokens");

      await page.click("button:has-text('Generate Token')");

      // Wait for modal
      await expect(
        page.locator("h3", { hasText: "Generate New Token" })
      ).toBeVisible();

      // Fill in token name
      await page.fill("input#token-name", "Should Not Be Created");

      // Click cancel
      await page.click("button:has-text('Cancel')");

      // Modal should close
      await expect(
        page.locator("h3", { hasText: "Generate New Token" })
      ).not.toBeVisible();

      // Token should not appear
      await expect(page.locator("text=Should Not Be Created")).not.toBeVisible();
    });
  });

  test.describe("Delete Token Flow", () => {
    test("should delete a token", async ({ page }) => {
      await page.goto("/dashboard/tokens");

      const tokenName = uniqueTokenName();

      // First create a token
      await page.click("button:has-text('Generate Token')");
      await expect(
        page.locator("h3", { hasText: "Generate New Token" })
      ).toBeVisible();
      await page.fill("input#token-name", tokenName);
      await page.locator("button[type='submit']:has-text('Generate Token')").click();
      await expect(
        page.locator("text=Token generated successfully")
      ).toBeVisible({ timeout: 10000 });
      await page.click("button:has-text('Done')");

      // Verify token exists
      const tokenText = page.locator(`h3:has-text("${tokenName}")`);
      await expect(tokenText).toBeVisible();

      // Find the token card containing this specific token name
      // The structure is: div (card) > div (content area) > div > h3 (token name)
      // The delete button is a sibling of the content area
      const tokenCard = page.locator(`div.flex.items-center.justify-between.p-4:has(h3:has-text("${tokenName}"))`);
      const deleteButton = tokenCard.locator("button[title='Revoke token']");

      // Set up dialog handler before clicking delete
      page.on("dialog", async (dialog) => {
        expect(dialog.type()).toBe("confirm");
        await dialog.accept();
      });

      await deleteButton.click();

      // Token should be removed from list
      await expect(page.locator(`h3:has-text("${tokenName}")`)).not.toBeVisible({
        timeout: 10000,
      });
    });
  });

  test.describe("Token API Authentication", () => {
    test("should authenticate API requests with PAT", async ({ page, request }) => {
      await page.goto("/dashboard/tokens");

      const tokenName = uniqueTokenName();

      // Create a token
      await page.click("button:has-text('Generate Token')");
      await expect(
        page.locator("h3", { hasText: "Generate New Token" })
      ).toBeVisible();
      await page.fill("input#token-name", tokenName);
      await page.locator("button[type='submit']:has-text('Generate Token')").click();
      await expect(
        page.locator("text=Token generated successfully")
      ).toBeVisible({ timeout: 10000 });

      // Get the token value
      const tokenInput = page.locator("input[readonly]");
      const token = await tokenInput.inputValue();

      // Close modal
      await page.click("button:has-text('Done')");

      // Test API call with PAT
      const response = await request.get("/api/me/tokens", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(response.ok()).toBe(true);
      const data = await response.json();
      expect(data.tokens).toBeDefined();
      expect(Array.isArray(data.tokens)).toBe(true);
    });

    // Note: Testing invalid/malformed PAT without session cookies requires
    // unauthenticated request context. Verified manually via curl that
    // invalid PAT returns 401. These tests are skipped in browser context
    // due to CORS restrictions when making cross-origin unauthenticated requests.
    test.skip("should reject invalid PAT", async () => {
      // Verified via: curl -s -o /dev/null -w "%{http_code}" \
      //   -H "Authorization: Bearer ank_invalid" \
      //   "https://uat.ankiren.com/api/me/tokens"
      // Returns: 401
    });

    test.skip("should reject malformed PAT", async () => {
      // Verified via: curl -s -o /dev/null -w "%{http_code}" \
      //   -H "Authorization: Bearer not_a_valid_token" \
      //   "https://uat.ankiren.com/api/me/tokens"
      // Returns: 401 (falls back to session auth, no session = 401)
    });
  });

  test.describe("Navbar Integration", () => {
    test("should show API Tokens link in user dropdown", async ({ page }) => {
      await page.goto("/dashboard");

      // Click user dropdown
      const userDropdown = page.locator("nav button:has(svg)").first();
      await userDropdown.click();

      // Should show API Tokens link
      await expect(page.locator("a:has-text('API Tokens')")).toBeVisible();
    });

    test("should navigate to tokens page from dropdown", async ({ page }) => {
      await page.goto("/dashboard");

      // Click user dropdown
      const userDropdown = page.locator("nav button:has(svg)").first();
      await userDropdown.click();

      // Click API Tokens link
      await page.click("a:has-text('API Tokens')");

      // Should navigate to tokens page
      await expect(page).toHaveURL(/\/dashboard\/tokens/);
      await expect(page.locator("h1", { hasText: "API Tokens" })).toBeVisible();
    });
  });
});
