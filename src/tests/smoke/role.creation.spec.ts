import { test, expect } from "@playwright/test";
import { credentials } from "../resources/credentials";
import { LoginPage } from "../../pages/login.page";
import { NavBarPage } from "../../pages/navbar.page";
import { RoleCreationPage } from "../../pages/role.creation.page";
import { testdata } from "../resources/testdata";

test.describe("Role Creation Page", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });

  test(
    "Verify navigation to Role Creation page",
    { tag: ["@smoke", "@TC_23", "@positive1"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      await navBarpage.clickRoleCreation();
      await expect(
        page.getByRole("heading", { name: "Role Creation" }),
      ).toBeVisible();
    },
  );

  test(
    "Verify Add New role action",
    { tag: ["@smoke", "@TC_24", "@positive1"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      await navBarpage.clickRoleCreation();
      await expect(
        page.getByRole("heading", { name: "Role Creation" }),
      ).toBeVisible();
      const roleCreationPage = new RoleCreationPage(page);
      await roleCreationPage.clickAddRoleCreation();
    },
  );

  test(
    "Verify successful creation of a new role",
    { tag: ["@smoke", "@TC_25", "@positive1"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      await navBarpage.clickRoleCreation();
      // await expect(
      //   page.getByRole("heading", { name: "Role Creation" }),
      // ).toBeVisible();
      const roleCreationPage = new RoleCreationPage(page);
      await roleCreationPage.clickAddRoleCreation();
      await roleCreationPage.enterRoleName(testdata.enterRoleName);
      await roleCreationPage.enterRoleDescription(
        testdata.enterRoleDescription,
      );
    },
  );
});
