import { Page, Locator, expect } from "@playwright/test";

export class AssignMultipleBranches {
  constructor(private readonly page: Page) {}

  async navigateToAssignMultipleBranches(): Promise<void> {
    await this.page
      .getByRole("button", { name: "Assign Multiple Branches" })
      .click();
  }

  async selectUserId() {
    const userIdInput = this.page.locator("#root_userId input");

    await userIdInput.click();
  }

async waitUntillUserId() {
  const listbox = this.page.getByRole("listbox");

  await expect(listbox).toBeVisible();

  const validOptions = listbox.locator('li[role="option"][data-value]');

  // Ensure at least one real selectable option exists
  await expect(validOptions.first()).toBeVisible();
}

  async selectUser(loginId: string) {
    await this.page
      .getByRole("option")
      .filter({ hasText: loginId })
      .first()
      .click();
  }

  // async addNewButton() {
  //   const addNewButton = this.page.getByRole("button", { name: "Add New" });
  //   await addNewButton.click();
  // }

  async selectBranchDeptId() {
    await this.page.locator("#root_brachDeptId").click();
  }

  // async slectBranch(value: string) {
  //   const listbox = this.page.getByRole("listbox");
  //   await expect(listbox).toBeVisible();

  //   const options = listbox.getByRole("option");
  //   await expect(options.first()).toBeVisible();

  //   const count = await options.count();

  //   if (count === 0) {
  //     console.log("No options available to select.");
  //   } else {
  //     const randomIndex = Math.floor(Math.random() * count);
  //     const selectedOption = options.nth(randomIndex);

  //     const selectedText = await selectedOption.textContent();
  //     console.log(`Randomly selected: ${selectedText}`);

  //     await selectedOption.click();
  //   }
  // }

  async selectBranch() {
    // await this.page.getByRole("option", { name: value }).first().click();

    // Ensure dropdown is already opened before this step

    const options = this.page.getByRole("option");

    // Get total number of options
    const count = await options.count();

    // Generate random index
    const randomIndex = Math.floor(Math.random() * count);

    // Select the random option
    const randomOption = options.nth(randomIndex);

    // Ensure it's visible (important for long lists)
    await randomOption.scrollIntoViewIfNeeded();

    // Click the option
    await randomOption.click();
  }

  async clickSaveButton() {
    await this.page.getByRole("button", { name: "Save" }).click();
  }

  async deleteData() {
    await this.page.getByRole("button", { name: "Delete" }).click();
    await this.page.getByRole("button", { name: "Continue" }).click();
  }

  async verifyAssignMultipleBranchesHeading() {
    const heading = this.page.getByRole("heading", {
      name: "Assign Multiple Branches",
      level: 3,
    });

    await expect(heading).toBeVisible();
  }

  async verifyDefaultDivision(expectedDivision: string) {
    const divisionDropdown = this.page.locator("#root_defaultBranch");

    await expect(divisionDropdown).toBeVisible();
    await expect(divisionDropdown).toHaveText(expectedDivision);
  }

  async verifyDivisionsCardLoaded() {
    // Scope to the specific card containing "Divisions Details"
    const divisionsCard = this.page.locator(".MuiCard-root").filter({
      has: this.page.locator(".MuiCardHeader-title p", {
        hasText: "Divisions Details",
      }),
    });

    const cardTitle = divisionsCard.locator(".MuiCardHeader-title p");
    const collapsePanel = divisionsCard.locator(".MuiCollapse-entered");
    const table = divisionsCard.locator('table[aria-label="simple table"]');

    await expect(cardTitle).toBeVisible();
    await expect(cardTitle).toHaveText("Divisions Details");
    await expect(collapsePanel).toBeVisible();
    await expect(table).toBeVisible();
  }

  async addNewButton() {
    const divisionsCard = this.page.locator(".MuiCard-root").filter({
      has: this.page.locator(".MuiCardHeader-title p", {
        hasText: "Divisions Details",
      }),
    });

    const addNewButton = divisionsCard.locator("button.iil-btn--success");

    await expect(addNewButton).toBeVisible();
    await expect(addNewButton).toBeEnabled();
    await addNewButton.click();
  }

  async verifyDivisionsCardPopUpLoaded() {
    const cardTitle = this.page.getByRole("heading", {
      name: "Division Details",
      level: 1,
    });

    await expect(cardTitle).toBeVisible();
    await expect(cardTitle).toHaveText("Division Details");
  }

  async fillToDate(date: string) {
    await this.page.locator("#root_to").fill(date);
  }

  async clickEditForRow(branchName: string) {
    await this.page
      .locator("button.orgHierachy-lvlConfigList__actionBtn")
      .first()
      .click();
  }

  async clickDeleteForRow(branchName: string) {
    await this.page.locator('button[title="Delete"]').first().click();
  }

  async verifyBranchRequiredError() {
    const errorMessage = this.page.locator("p.Mui-error#root_brachDeptId");

    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText("is a required property");
  }

  async verifySaveButtonNotVisible() {
    const saveButton = this.page.getByRole("button", {
      name: "Save",
      exact: true,
    });

    await expect(saveButton).not.toBeVisible();
  }

  async deleteFirstRow() {
     while (true) {
    const deleteButtons = this.page.locator("//button[@title='Delete']");
    const count = await deleteButtons.count();
    if (count === 0) break;
    await deleteButtons.first().click();
    // Optional: wait for the row to be removed before checking again
    await this.page.waitForTimeout(300);
  }
  }
}
