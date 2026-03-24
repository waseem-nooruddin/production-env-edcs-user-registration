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
      await loginPage.login(
        credentials.admin2.username,
        credentials.admin2.password,
      );
      await page.waitForLoadState("networkidle");
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
      await loginPage.login(
        credentials.admin2.username,
        credentials.admin2.password,
      );
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      await navBarpage.navigateToAssignMultipleBranches();
      const assignMultipleBranches = new AssignMultipleBranches(page);
      await assignMultipleBranches.verifyAssignMultipleBranchesHeading();
      await assignMultipleBranches.selectUserId();
      await assignMultipleBranches.selectUser(testdata.userDetails.selectUser);
      await assignMultipleBranches.verifyDefaultDivision(
        testdata.Branch.Branch,
      );
    },
  );

  test(
    "Verify that can View all assigned divisions for a user",
    { tag: ["@smoke", "@TC_21", "@positive"] },
    async ({ page }) => {
      await loginPage.login(
        credentials.admin2.username,
        credentials.admin2.password,
      );
     const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      await navBarpage.navigateToAssignMultipleBranches();
      const assignMultipleBranches = new AssignMultipleBranches(page);
      await assignMultipleBranches.verifyAssignMultipleBranchesHeading();
      await assignMultipleBranches.selectUserId();
      await assignMultipleBranches.waitUntillUserId(); 
    },
  );
});
