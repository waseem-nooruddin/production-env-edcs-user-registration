import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { ProductPage } from "../../pages/product.page";
import { UserManagementPage } from "../../pages/user.management.page";
import { RoleRestrictionPage } from "../../pages/role.restriction.page";
import { credentials } from "../resources/credentials";
import { NavBarPage } from "../../pages/navbar.page";
import { testdata } from "../resources/testdata";

test.describe("role restriction Page", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });

  test(
    "Verify user page loads correctly",
    { tag: ["@smoke", "@TC_26", "@positive1"] },
    async ({ page }) => {
        await loginPage.login(credentials.admin2.username, credentials.admin2.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      await navBarpage.clickRoleRestriction();
    },
  );

  test(
    "Verify role selection and display of existing allowed actions",
    { tag: ["@smoke", "@TC_27", "@positive1"] },
    async ({ page }) => {
        await loginPage.login(credentials.admin2.username, credentials.admin2.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      const roleRestrictionPage = new RoleRestrictionPage(page);
      await navBarpage.clickRoleRestriction();
      await roleRestrictionPage.selectRandomUserRole();
      await expect(
        page.getByRole("heading", { name: "Role Restriction" }),
      ).toBeVisible();
    },
  );

  test(
    "Verify adding a new allowed action to a role",
    { tag: ["@smoke", "@TC_28", "@positive1"] },
    async ({ page }) => {
        await loginPage.login(credentials.admin2.username, credentials.admin2.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      const roleRestrictionPage = new RoleRestrictionPage(page);
      await navBarpage.clickRoleRestriction();
      await roleRestrictionPage.selectRandomUserRole();
      await expect(
        page.getByRole("heading", { name: "Role Restriction" }),
      ).toBeVisible();
      await roleRestrictionPage.checkboxSelection();
      await roleRestrictionPage.enterSubmitButton();
    },
  );

  test(
    "Verify restricting (removing) an existing action from a role",
    { tag: ["@smoke", "@TC_29", "@positive"] },
    async ({ page }) => {
        await loginPage.login(credentials.admin2.username, credentials.admin2.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      const roleRestrictionPage = new RoleRestrictionPage(page);
      await navBarpage.clickRoleRestriction();
      await roleRestrictionPage.selectRandomUserRole();
      await expect(
        page.getByRole("heading", { name: "Role Restriction" }),
      ).toBeVisible();
      await roleRestrictionPage.enterRemoveExistingId();
    },
  );
});
