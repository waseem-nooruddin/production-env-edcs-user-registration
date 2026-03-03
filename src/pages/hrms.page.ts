import { Page, expect } from "@playwright/test";
import path from "path";

export class HrmsPage {
  constructor(private page: Page) { }

  private async waitForPopoverClose() {
    await expect(
      this.page.locator('.MuiPopover-root').filter({ visible: true })
    ).toHaveCount(0);
  }

  // ================= Personal Details =================

  async selectHRMS() {
    await this.page
      .locator(
        "//div[contains(@class,'MuiCard-root') and .//p[normalize-space()='HRMS']]",
      )
      .click();
  }

  async clickRegisterEmployee() {
    await this.page
      .locator(
        "//div[@role='button' and .//p[normalize-space()='Register Employee']]",
      )
      .click();
  }

  async clickAddNew() {
    await this.page
      .locator("//button[.//span[normalize-space()='Add New']]")
      .click();
  }

  async selectTitle() {
    await this.page.locator("#root_title").click();
    await this.page
      .locator("//li[@role='option' and normalize-space()='Mr.']")
      .click();
  }

  async enterFullName(fullName: string) {
    await this.page.fill("#root_fullName", fullName);
  }

  async enterInitials(initials: string) {
    await this.page.fill("#root_initials", initials);
  }

  async enterSurName(surName: string) {
    await this.page.fill("#root_surName", surName);
  }

  async selectGender() {
    await this.page.locator("#root_gender").click();
    await this.page
      .locator("//li[@role='option' and @data-value='male']")
      .click();
  }

  async enterDOB(dob: string) {
    await this.page.fill("#root_dob", dob);
  }

  async enterPlaceOfBirth(place: string) {
    await this.page.fill("#root_placeOfBirth", place);
  }

  async selectBloodGroup() {
    await this.page.locator("#root_bloodGroup").click();
    await this.page.locator("//li[@data-value='A-']").click();
  }

  async enterNIC(nic: string) {
    await this.page.fill("#root_nicNo", nic);
  }

  async enterNicIssueDate(date: string) {
    await this.page.fill("#root_nicIssuedDate", date);
  }

  async enterMaritalStatus(status: string) {
    await this.page.locator("#root_civilStatus").click();
    await this.page.getByRole("option", { name: status }).click();
  }

  async clickSave() {
    await this.page
      .locator("//button[.//span[normalize-space()='SAVE']]")
      .click();
  }

  async clickNext() {
    await this.page
      .locator("//button[.//span[normalize-space()='NEXT']]")
      .click();
  }

  // ================= Employment Details =================

  async enterEmployeeNumber(enumber: string) {
    await this.page.fill("#root_empNumber", enumber);
  }

  async enterEmployeeEpfNumber(epf: string) {
    await this.page.fill("#root_epfNumber", epf);
  }

  async selectBranch(Branch: string) {
    await this.page.locator("#root_organizationDetails").click();
    await this.page.getByRole("option", { name: Branch }).click();
  }

  async selectDivision(Division: string) {
    await this.page.locator("#root_department").click();
    await this.page.getByRole("option", { name: Division }).click();
  }

  async selectResignedTerrminated(Resigned: string) {
    await this.page.locator("#root_isResignedTerrminated").click();
    await this.page.getByRole("option", { name: Resigned }).click();
  }

  async selectEmployeeType(EmployeeType: string) {
    await this.page.locator("#root_employeeType").click();
    await this.page.getByRole("option", { name: EmployeeType }).click();
  }

  async enterDateOfJoin(date: string) {
    await this.page.locator("#root_dateOfJoined").click();
    await this.page.locator("#root_dateOfJoined").fill(date);
  }

  async enterenterworkShipCategoryI(workShipCategoryId: string) {
    await this.page.locator("#root_workShipCategoryId").click();
    await this.page.getByRole("option", { name: workShipCategoryId }).click();
  }

  async enterpriorNotiePeriod(NoticeDate: string) {
    await this.page.locator("#root_priorNotiePeriod").first().click();
    await this.page.getByRole("option", { name: NoticeDate }).click();
  }

  async enterConfirmationDueOn(date: string) {
    await this.page.locator("#root_confirmationdueon").click();
    await this.page.locator("#root_confirmationdueon").fill(date);
  }

  async enterpersonalGrade(grade: string) {
    await this.page.locator("#root_personalGrade").click();
    await this.page.getByRole("option", { name: grade }).click();
  }

  async enterCostCenter(costCenter: string) {
    await this.page.locator("#root_costCenter").click();
    await this.page.getByRole("option", { name: costCenter }).click();
  }

  async enterjobCategory(jobCategory: string) {
    await this.page.locator("#root_jobCategory").click();
    await this.page.getByRole("option", { name: jobCategory }).click();
    await this.waitForPopoverClose();
  }

  async enterCurrentDesignation(currentDesignation: string) {
    await this.waitForPopoverClose();
    await this.page.locator("#root_currentDesignation").click();
    await this.page.getByRole("option", { name: currentDesignation }).click();
  }

  async enterdateofDesignation(dateofDesignation: string) {
    await this.page.locator("#root_dateofDesignation").click();
    await this.page.locator("#root_dateofDesignation").fill(dateofDesignation);
  }

  async enterreportingPerson(reportingPerson: string) {
    await this.page.locator("#root_reportingPerson").click();
    await this.page.getByRole("option", { name: reportingPerson }).click();
  }

  async enterReportingDesignation(reportingDesignation: string) {
    await this.page.locator("#root_reportingDesignation").click();
    await this.page
      .locator("#root_reportingDesignation")
      .fill(reportingDesignation);
  }

  async clickOnAddButton() {
    await this.page.getByRole("button", { name: "ADD" }).first().click();
  }

  async enterpermanenetLocation(permanenetLocation: string) {
    await this.page.locator("#root_permanenetLocation").click();
    await this.page.getByRole("option", { name: permanenetLocation }).click();
  }

  async enterTemporaryLocation(temporaryLocation: string) {
    await this.page.locator("#root_temporaryLocation").click();
    await this.page.getByRole("option", { name: temporaryLocation }).click();
    await this.waitForPopoverClose();
  }

  async enterfromDate(fromDate: string) {
    await this.waitForPopoverClose();
    await this.page.locator("#root_fromDate").click();
    await this.page.locator("#root_fromDate").fill(fromDate);
  }

  async clickLocationDetailsAddButton() {
    const addButtons = this.page.getByRole("button", { name: "ADD" });

    await expect(addButtons).toHaveCount(2); // ensure 2 exist
    await addButtons.nth(1).click();
  }

  async clickOnNextButton() {
    await this.page.getByRole("button", { name: "Next" }).click();
  }

  /////

  async fillAddressLine1(value: string) {
    await this.page
      .getByRole("textbox", { name: /Residential Address \(Line 01/i })
      .fill(value);
  }

  async fillAddressLine2(value: string) {
    await this.page
      .getByRole("textbox", { name: /Residential Address \(Line 02/i })
      .fill(value);
  }

  async fillAddressLine3(value: string) {
    await this.page
      .getByRole("textbox", { name: /Residential Address \(Line 03/i })
      .fill(value);
  }

  async selectProvince(province: string) {
    await this.page.locator("#root_residentialprovince").click();
    await this.page.getByRole("option", { name: province }).first().click();
  }

  async selectDistrict(district: string) {
    // Wait for any MUI popover to finish closing
    const popover = this.page.locator('.MuiPopover-root');
    if (await popover.count()) {
      await expect(popover).toBeHidden();
    }

    // Scope strictly to Residential Address section
    const residentialSection = this.page.locator('div', {
      has: this.page.getByText('Residential Address', { exact: true }),
    });

    const districtButton = residentialSection.getByRole('button', {
      name: /^District\*/i,
    });

    await districtButton.click();

    // Target only visible listbox
    const listbox = this.page.getByRole('listbox').filter({ hasText: district });
    await expect(listbox).toBeVisible();

    await listbox.getByRole('option', { name: district }).click();
    await expect(listbox).toBeHidden();
  }

  async selectCity(city: string) {
    await this.page
      .getByRole('button', { name: /^City \/ Town\*/i })
      .first()
      .click();

    const option = this.page
      .getByRole('listbox')
      .filter({ has: this.page.getByRole('option', { name: city }) })
      .getByRole('option', { name: city });

    await expect(option).toBeVisible();
    await option.click();
  }

  async fillEmail(email: string) {
    await this.page.locator("#root_email").fill(email);
  }

  async fillMobile(mobile: string) {
    await this.page.locator("#root_mobile").fill(mobile);
  }

  async fillEmergencyName(name: string) {
    await this.page.getByRole("textbox", { name: /^Name\*/i }).fill(name);
  }

  async fillRelationship(value: string) {
    await this.page
      .getByRole("textbox", { name: /^Relationship\*/i })
      .fill(value);
  }

  async fillEmergencyMobile(value: string) {
    await this.page.getByRole("textbox", { name: /^Mobile No\*/i }).fill(value);
  }

  async fillTelephone(value: string) {
    await this.page.getByRole("textbox", { name: /^Telephone\*/i }).fill(value);
  }

  async selectOnQualificationType(option: string) {
    await this.page.getByRole("button", { name: "Qualification Type" }).click();
    await this.page.getByRole("option", { name: option }).click();
  }

  async selectOnQualification(option: string) {
    await this.page.getByRole("button", { name: "Qualification*" }).click();
    await this.page.getByRole("option", { name: option }).click();
  }

  async selectCourseDuration(option: string) {
    await this.page.getByRole("button", { name: "Duration of Course" }).click();
    await this.page.getByRole("option", { name: option }).click();
  }

  async clickAddButton() {
    await this.page.getByRole("button", { name: "ADD" }).click();
  }

  async clickNextButton() {
    await this.page.getByRole("button", { name: "NEXT" }).click();
  }

  async selectQualificationType(option: string) {
    await this.page.getByRole("button", { name: "Qualification Type" }).click();
    await this.page.getByRole("option", { name: option }).click();
  }

  async selectQualification(option: string) {
    await this.page.getByRole("button", { name: "Qualification*" }).click();
    await this.page.getByRole("option", { name: option }).click();
  }

  async selectOnCourseDuration(option: string) {
    await this.page.getByRole("button", { name: "Duration of Course" }).click();
    await this.page.getByRole("option", { name: option }).click();
  }

  async clickOnTheAddButton() {
    await this.page.getByRole("button", { name: "ADD" }).click();
  }

  async clickOnTheNextButton() {
    await this.page.getByRole("button", { name: "NEXT" }).click();
  }

  async fillBasicSalary(salary: string) {
    await this.page
      .getByRole("spinbutton", { name: "Basic Salary*" })
      .fill(salary);
  }

  async selectAllowanceType(type: string) {
    await this.page.getByRole("button", { name: "Allowance Type*" }).click();
    await this.page.getByRole("option", { name: type }).click();
  }

  async selectBank(bank: string) {
    await this.page.getByRole("button", { name: "Bank Name*" }).click();
    await this.page.getByRole("option", { name: bank }).click();
  }

  async selectOnDivision(division: string) {
    await this.page.getByRole("button", { name: "Division Name*" }).click();
    await this.page.getByRole("option", { name: division }).click();
  }

  async selectAccountType(type: string) {
    await this.page.getByRole("button", { name: "Account Type*" }).click();
    await this.page.getByRole("option", { name: type }).click();
  }

  async fillAccountNumber(number: string) {
    await this.page.getByRole("textbox", { name: "Account No*" }).fill(number);
  }

  async uploadDocument(filePath: string) {
    const fileInput = this.page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(filePath);
  }

  async clickOnSave() {
    await this.page.getByRole("button", { name: "Save" }).click();
  }

  async submitApplication() {
    await this.page.getByRole("button", { name: "SUBMIT" }).click();
    await this.page.getByRole("button", { name: "Continue" }).click();
  }

  ///search employee

  async searchEmployeeId(employeeId: string) {
    await this.page.locator("#outlined-basic").fill(employeeId);
    await this.page.getByRole("button", { name: "Search" }).click();
  }

  async clickEditButton() {
    await this.page.getByRole("button", { name: "View" }).first().click();
  }
}
