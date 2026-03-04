import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { ProductPage } from "../../pages/product.page";
import { UserManagementPage } from "../../pages/user.management.page";
import { AssignMultipleBranches } from "../../pages/assign.multiple.branches.page";
import { credentials } from "../resources/credentials";
import { NavBarPage } from "../../pages/navbar.page";
import { testdata } from "../resources/testdata";

test.describe("assign multiple branches", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });
  test(
    "Verify Assigned default branch",
    { tag: ["@smoke", "@TC_19", "@positive"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      await navBarpage.navigateToAssignMultipleBranches();
      //expect(page.getByRole("heading", { name: "Assign Multiple Branches" })).toBeVisible();
    },
  );

  test(
    "Verify that can add a new branch",
    { tag: ["@smoke", "@TC_20", "@positive"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      const assignmultiplebranches = new AssignMultipleBranches(page);
      await navBarpage.navigateToAssignMultipleBranches();
      await assignmultiplebranches.selectUserId();
      //await assignmultiplebranches.waitUntillUserId();
      await assignmultiplebranches.selectUser(
        "166513rn - Testing Head Office System User",
      );
    },
  );

  test(
    "Verify that can View all assigned divisions for a user",
    { tag: ["@smoke", "@TC_21", "@positive"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      const assignmultiplebranches = new AssignMultipleBranches(page);
      await navBarpage.navigateToAssignMultipleBranches();
      await assignmultiplebranches.selectUserId();
      //await assignmultiplebranches.waitUntillUserId();
      await assignmultiplebranches.selectUser(testdata.selectUser);
      await assignmultiplebranches.addNewButton();
      await assignmultiplebranches.selectBranchDeptId();
      await assignmultiplebranches.slectBranch(testdata.slectBranch);
      await assignmultiplebranches.clickSaveButton();
    },
  );
});
