import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { UserManagementPage } from "../../pages/user.management.page";
import { credentials } from "../resources/credentials";
import { UserRestrictionsPage } from "../../pages/user.restrictions.page";
import { NavBarPage } from "../../pages/navbar.page";
import { testdata } from "../resources/testdata";

test.describe("User Restrictions", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });

  test(
    "Verify navigation to User Restrictions page",
    { tag: ["@smoke", "@TC_30", "@positive"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      const userRestrictionsPage = new UserRestrictionsPage(page);
      await navBarpage.navigateUserRestrictions();
      // await userRestrictionsPage.hoverOnUserRestrictions();
      await expect(
        page.getByRole("heading", { name: "User Restrictions" }),
      ).toBeVisible();
    },
  );

  test(
    "Verify branch selection and user list display",
    { tag: ["@smoke", "@TC_31", "@positive"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      const userRestrictionsPage = new UserRestrictionsPage(page);
      await navBarpage.navigateUserRestrictions();
      // await userRestrictionsPage.hoverOnUserRestrictions();
      await expect(
        page.getByRole("heading", { name: "User Restrictions" }),
      ).toBeVisible();
      // await userRestrictionsPage.haverOnTheBranch();
      await expect(page.locator("#root_branchId")).toBeVisible();
    },
  );

  test(
    "Verify user selection from the list",
    { tag: ["@smoke", "@TC_32", "@positive"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      const userRestrictionsPage = new UserRestrictionsPage(page);
      await navBarpage.navigateUserRestrictions();
      // await userRestrictionsPage.hoverOnUserRestrictions();
      await expect(
        page.getByRole("heading", { name: "User Restrictions" }),
      ).toBeVisible();
      await userRestrictionsPage.selctBranch();
      await userRestrictionsPage.selectBranchByName(testdata.branchName);
      await userRestrictionsPage.clickUserId();
    },
  );

  test(
    "Verify adding a new restriction to the user",
    { tag: ["@smoke", "@TC_33", "@positive"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      const userRestrictionsPage = new UserRestrictionsPage(page);
      await navBarpage.navigateUserRestrictions();
      // await userRestrictionsPage.hoverOnUserRestrictions();
      await expect(
        page.getByRole("heading", { name: "User Restrictions" }),
      ).toBeVisible();
      await userRestrictionsPage.selctBranch();
      await userRestrictionsPage.selectBranchByName(testdata.branchName);
      await userRestrictionsPage.clickUserId();
      await userRestrictionsPage.selectUserId(testdata.userId_Restriction);
      await userRestrictionsPage.clickAdd();
    },
  );
});
