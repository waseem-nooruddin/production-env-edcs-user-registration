import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { credentials } from "../resources/credentials";

test.describe("Login Tests", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });

  test("Verify successful login with correct User ID, Password, and Location", { tag: ["@regression", "@TC_1", "@positive"] }, async ({ page }) => {
    await loginPage.login(credentials.username, credentials.password);
    await page.waitForLoadState("networkidle");
    await expect(
      page.locator("main").getByText("Dashboard", { exact: true })
    ).toBeVisible();
  });

  test("Verify login with invalid User ID", { tag: ["@regression", "@TC_7", "@negative"] }, async ({ page }) => {
    await loginPage.login("invalid", credentials.password);
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole('alert')
    ).toContainText('USER NOT FOUND');
  });

  test("Verify login with invalid Password", { tag: ["@regression", "@TC_8", "@negative"] }, async ({ page }) => {
    await loginPage.login(credentials.username, "invalid");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole('alert')
    ).toContainText('AUTHENTICATION_FAILEDEntered credentials are invalid ');
  });

  test("Verify login with blank credentials", { tag: ["@regression", "@TC_9", "@negative"] }, async ({ page }) => {
    await loginPage.login("", "");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole('alert')
    ).toContainText('USER NOT FOUNDNo user found for the provided username. ');
  });

  test("Verify lockout after multiple failed attempts",
    { tag: ["@regression", "@TC_15", "@negative"] },
    async ({ page }) => {

      const maxAttempts = 3;

      for (let i = 0; i < maxAttempts; i++) {
        await loginPage.login(credentials.username, "invalid");

        const alert = page.getByRole('alert');
        await expect(alert).toBeVisible();
        await expect(alert).toContainText('AUTHENTICATION_FAILEDEntered credentials are invalid ');
      }

      // Final attempt should show lockout message
      await loginPage.login(credentials.username, "invalid");

      await expect(page.getByRole('alert'))
        .toContainText('AUTHENTICATION_FAILEDEntered credentials are invalid ');
    });

  test("Verify login with expired password", { tag: ["@regression", "@TC_15", "@negative"] }, async ({ page }) => {
    await loginPage.login(credentials.expiredusername, credentials.expiredpassword);
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole('alert')
    ).toContainText('PASSWORD_EXPIREDYour password has expired. Please reset your password to continue. ');
  });
});
