import { Page, Locator } from "@playwright/test";

export class UserManagementPage {
  constructor(private readonly page: Page) { }

  async clickUserManagement(): Promise<void> {
    await this.page.getByRole("button", { name: "User Management" }).click();
  }

  async navigateToUserPage(): Promise<void> {
    await this.page.getByRole("button", { name: "Users" }).click();
  }

  async clickAddNewUser(): Promise<void> {
    await this.page.getByRole("button", { name: "Add New" }).click();
  }

  async enterLoginID(employeeId: string): Promise<void> {
    await this.page.locator("#root_employeeId").fill(employeeId);
  }

  async clickValidateButton(): Promise<void> {
    await this.page.getByRole("button", { name: "Validate" }).click();
  }

  async enterUserRoleId(): Promise<void> {
    await this.page.locator("#root_userRoleId").click();

  }
  // async selectUserRoleId(RoleId: string): Promise<void> {
  //   await this.page
  //     .getByRole("option", { name: RoleId })
  //     .waitFor({ state: "visible" });
  //   await this.page
  //     .getByRole("option", { name: RoleId })
  //     .click();
  // }

  async selectRandomUserRole(): Promise<string> {
  const dropdown = this.page.locator("#root_userRoleId");

  // ✅ Only open if not already expanded
  const isExpanded = await dropdown.getAttribute("aria-expanded");
  if (isExpanded !== "true") {
    await dropdown.click();
  }

  const options = this.page.getByRole("option");

  await options.first().waitFor({ state: "visible" });

  const count = await options.count();
  if (count === 0) throw new Error("No roles available");

  const randomIndex = Math.floor(Math.random() * count);
  const randomOption = options.nth(randomIndex);

  const selectedRole = (await randomOption.innerText()).trim();

  await randomOption.scrollIntoViewIfNeeded();
  await randomOption.click();

  console.log("Selected Role:", selectedRole);

  return selectedRole;
}

  async enterSubmitButton(): Promise<void> {
    await this.page.getByRole("button", { name: "Submit" }).click();
  }

  async EnterListNumber(outlined: string): Promise<void> {
    await this.page.locator("#outlined-basic").fill(outlined);
  }

  async isUserManagementPageLoad(): Promise<boolean> {
    return await this.page
      .locator(
        "//nav[@aria-label='breadcrumb']//p[normalize-space()='User Management']",
      )
      .isVisible();
  }
}
