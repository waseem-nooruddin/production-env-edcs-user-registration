import { Page, Locator } from "@playwright/test";

export class RoleRestrictionPage {
  constructor(private readonly page: Page) {}

  async clickRoleRestriction(): Promise<void> {
    await this.page.getByRole("button", { name: "Role Restrictions" }).click();
  }

  async selectRandomUserRole(): Promise<string> {
  await this.page.locator("#root_userRoleId").click();

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
  async checkboxSelection(): Promise<void> {
    const checkbox = this.page.getByRole("checkbox");
  }

  async enterSubmitButton(): Promise<void> {
    await this.page.getByRole("button", { name: "Submit" }).click();
  }

  async enterRemoveExistingId(): Promise<void> {
    await this.page.getByRole("button", { name: "Reject" }).first().click();
  }
}
