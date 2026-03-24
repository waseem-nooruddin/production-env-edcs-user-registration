import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { ProductPage } from "../../pages/product.page";
import { UserManagementPage } from "../../pages/user.management.page";
import { UserAuthorization } from "../../pages/user.authorization.page";
import { credentials } from "../resources/credentials";
import { NavBarPage } from "../../pages/navbar.page";
import { testdata } from "../resources/testdata";

test.describe("User Authorization", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });

  test(
    "Verify newly created user is displayed in User Authorization page",
    { tag: ["@smoke", "@TC_11", "@positive"] },
    async ({ page }) => {
        await loginPage.login(credentials.admin2.username, credentials.admin2.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      const userAuthorization = new UserAuthorization(page);
      await navBarpage.clickUserAuthorization();
      await userAuthorization.verifyUserAuthorizationPage();
      await userAuthorization.searchingUser(testdata.loginCredentials.loginId_Authorization);
    },
  );

  test(
    "Verify authorize button is available for pending users",
    { tag: ["@smoke", "@TC_12", "@positive"] },
    async ({ page }) => {
        await loginPage.login(credentials.admin2.username, credentials.admin2.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      const userAuthorization = new UserAuthorization(page);
      await navBarpage.clickUserAuthorization();
      //await userAuthorization.hoverPendingUser();
      //await expect (page.getByRole("row", { name: /Pending/i })).toBeVisible();

    },
  );

  test(
    "Verify successful authorization of user",
    { tag: ["@smoke", "@TC_13", "@positive"] },
    async ({ page }) => {
        await loginPage.login(credentials.admin2.username, credentials.admin2.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      const userAuthorization = new UserAuthorization(page);
      await navBarpage.clickUserAuthorization();
      await expect(page.getByRole("button", { name: "User Authorization" })).toBeVisible();
      //await userAuthorization.verifyPendingUser();
      await userAuthorization.authorizeUser();
    },
  );
});
