import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { credentials } from "../resources/credentials";

test.describe("Login Tests", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });

  test("valid login", { tag: ["@smoke", "@TC_17", "@positive"] }, async ({ page }) => {
    await loginPage.login(credentials.username, credentials.password);
  });
});
