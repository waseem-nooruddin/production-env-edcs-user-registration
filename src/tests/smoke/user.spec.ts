import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { ProductPage } from "../../pages/product.page";
import { UserManagementPage } from "../../pages/user.management.page";
import { credentials } from "../resources/credentials";
import { NavBarPage } from "../../pages/navbar.page";
import { testdata } from "../resources/testdata";

test.describe("User Page", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });

  test(
    "Verify navigation to New User ID Creation screen",
    { tag: ["@smoke", "@TC_07", "@positive"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      await navBarpage.navigateToUserPage();
      await expect(page.getByRole("button", { name: "Users" })).toBeVisible();
    },
  );

  test(
    "Verify validation of Login ID and auto-population of user details",
    { tag: ["@smoke", "@TC_08", "@positive"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      await navBarpage.navigateToUserPage();
      const userManagementPage = new UserManagementPage(page);
      await userManagementPage.clickAddNewUser();
      await userManagementPage.enterLoginID(testdata.Employee_Number);
      const empNumber = await page.locator("#root_empNumber").inputValue();
      expect(empNumber).toBe("");
      await userManagementPage.clickValidateButton();
    },
  );

  test(
    "Verify successful creation of new user with selected role",
    { tag: ["@smoke", "@TC_09", "@positive"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      await navBarpage.navigateToUserPage();
      const userManagementPage = new UserManagementPage(page);
      await userManagementPage.clickAddNewUser();
      await userManagementPage.enterLoginID(testdata.Employee_Number);
      await userManagementPage.clickValidateButton();
      await userManagementPage.enterUserRoleId();
      await userManagementPage.enterSubmitButton();
    },
  );

  test(
    "Verify newly created user is displayed in View All Users grid",
    { tag: ["@smoke", "@TC_10", "@positive"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      await navBarpage.navigateToUserPage();
      await expect(page.locator('//div[@class="MuiCardContent-root formCard__body"]')).toBeVisible();
    },
  );
});
