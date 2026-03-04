import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { ProductPage } from "../../pages/product.page";
import { UserManagementPage } from "../../pages/user.management.page";
import { MenuActionListPage } from "../../pages/menu.action.list.page";
import { credentials } from "../resources/credentials";
import { NavBarPage } from "../../pages/navbar.page";
import { testdata } from "../resources/testdata";

test.describe("Menu Action List Page", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });
  test(
    "Verify Menu Action List page loads correctly",
    { tag: ["@smoke", "@TC_22", "@positive"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      const menuActionListPage = new MenuActionListPage(page);
      await navBarpage.clickMenuActionList();
      await expect(
        page.getByRole("heading", { name: "Menu Action List" }),
      ).toBeVisible();
      await menuActionListPage.searchMenuActionList(testdata.searchMenuActionList);
      await expect(page.getByText(testdata.searchMenuActionList, { exact: false })).toBeVisible();
    },
  );
});
