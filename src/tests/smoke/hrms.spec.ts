import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { NavBarPage } from "../../pages/navbar.page";
import { credentials } from "../resources/credentials";
import { EmployeeRegistration } from "../../pages/employee.registration.page";
import { testdata } from "../resources/testdata";
import { testdata as hrms } from "../resources/hrmstestdata";
import { HrmsPage } from "../../pages/hrms.page";
import { EmployeeApprovePage } from "../../pages/employee.approve.page";
import { generateEmployeeNumber, saveEmployeeToJson, readEmployeeFromJson } from "../../utils/employeeNumber";

test.describe("Employee Registration", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });
  test(
    "Verify access to Employee Registration form",
    { tag: ["@smoke", "@TC_01", "@positive"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.openHrmsModule();
      const employeeRegistration = new EmployeeRegistration(page);
      await employeeRegistration.clickRegisterEmployee();
      expect(
        page.getByRole("heading", { name: "Employee Registration List" }),
      ).toBeVisible();
    },
  );

  test(
    "Create employee with all mandatory fields",
    { tag: ["@smoke", "@TC_02", "@positive"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.openHrmsModule();
      const hrmsPage = new HrmsPage(page);
      await hrmsPage.clickRegisterEmployee();
      await hrmsPage.clickAddNew();

      //Personal Details
      await hrmsPage.selectTitle();
      await hrmsPage.enterFullName(hrms.hrms_enterFullName);
      await hrmsPage.enterSurName(hrms.hrms_enterSurName);
      await hrmsPage.selectGender();
      await hrmsPage.enterDOB(hrms.hrms_dateOfBirth);
      await hrmsPage.enterPlaceOfBirth(hrms.hrms_placeOfBirth);
      await hrmsPage.selectBloodGroup();
      await hrmsPage.enterNIC(hrms.hrms_nic);
      await hrmsPage.enterNicIssueDate(hrms.hrms_nicDateOfIssue);
      await hrmsPage.enterMaritalStatus(hrms.hrms_enterMaritalStatus);
      await hrmsPage.clickNext();

      //Employment Details
      const employeeNumber = generateEmployeeNumber();
      saveEmployeeToJson(employeeNumber);
      await hrmsPage.enterEmployeeNumber(employeeNumber);
      await hrmsPage.enterEmployeeEpfNumber(hrms.Emplloyee_EPFNumber);
      await hrmsPage.selectBranch(hrms.branchName);
      await hrmsPage.selectDivision(hrms.Division);
      await hrmsPage.selectResignedTerrminated(hrms.Resigned);
      await hrmsPage.selectEmployeeType(hrms.EmployeeType);
      await hrmsPage.enterDateOfJoin(hrms.hrms_dateOfJoin);
      await hrmsPage.enterenterworkShipCategoryI(hrms.hrms_workShipCategoryId);
      await hrmsPage.enterpriorNotiePeriod(hrms.hrms_noticeDate);
      await hrmsPage.enterConfirmationDueOn(hrms.hrms_enterConfirmationDueOn);
      await hrmsPage.enterpersonalGrade(hrms.hrms_personalGrade);
      await hrmsPage.enterCostCenter(hrms.hrms_costCenter);
      await hrmsPage.enterjobCategory(hrms.hrms_enterjobCategory);
      await hrmsPage.enterCurrentDesignation(hrms.hrms_enterCurrentDesignation);
      await hrmsPage.enterdateofDesignation(hrms.hrms_enterdateofDesignation);
      await hrmsPage.enterreportingPerson(hrms.hrms_enterreportingPerson);
      await hrmsPage.enterReportingDesignation(hrms.enterReportingDesignation);
      await hrmsPage.clickOnAddButton();
      await hrmsPage.enterpermanenetLocation(hrms.hrms_enterpermanenetLocation);
      await hrmsPage.enterTemporaryLocation(hrms.hrms_enterTemporaryLocation);
      await hrmsPage.enterfromDate(hrms.hrms_enterfromDate);
      await hrmsPage.clickLocationDetailsAddButton();
      await hrmsPage.clickOnNextButton();

      //Contact Details

      await hrmsPage.fillAddressLine1(hrms.hrms_AddressLine1);
      await hrmsPage.fillAddressLine2(hrms.hrms_AddressLine2);
      await hrmsPage.fillAddressLine3(hrms.hrms_AddressLine3);

      await hrmsPage.selectProvince(hrms.hrms_province);
      await hrmsPage.selectDistrict(hrms.hrms_district);
      await hrmsPage.selectCity(hrms.hrms_city);

      await hrmsPage.fillEmail(hrms.hrms_fillEmail);
      await hrmsPage.fillMobile(hrms.hrms_fillMobile);

      await hrmsPage.fillEmergencyName(hrms.hrms_fillEmergencyName);
      await hrmsPage.fillRelationship(hrms.hrms_fillRelationship);
      await hrmsPage.fillEmergencyMobile(hrms.hrms_fillEmergencyMobile);
      await hrmsPage.fillTelephone(hrms.hrms_fillTelephone);

      // await hrmsPage.clickNextButton();

      // //Qualification Details
      // await hrmsPage.selectOnQualificationType("Local");
      // await hrmsPage.selectOnQualification("Dip");
      // await hrmsPage.selectOnCourseDuration("1 Year");
      // await hrmsPage.clickAddButton();
      // await hrmsPage.clickNextButton();

      // //salary details

      // await hrmsPage.fillBasicSalary("100000.00");
      // await hrmsPage.selectAllowanceType('Transport');
      // //await hrmsPage.fillAllowanceAmount('20000.00');
      // await hrmsPage.clickOnTheAddButton();
      // await hrmsPage.clickOnTheNextButton();

      // //Bank Details

      // await hrmsPage.selectBank("Commercial Bank PLC");
      // await hrmsPage.selectOnDivision("Colombo");
      // await hrmsPage.selectAccountType("Savings");
      // await hrmsPage.fillAccountNumber("80002545");
      // await hrmsPage.clickAddButton();
      // await hrmsPage.clickNextButton();

      // //Document Upload
      // await hrmsPage.uploadDocument("test-file.jpg");
      // await hrmsPage.clickOnSave();
      // await hrmsPage.submitApplication();
    },
  );

  test(
    "Verify employee appears in Employee List",
    { tag: ["@smoke", "@TC_03", "@positive"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.openHrmsModule();
      await navBarpage.clickActivateEmployeeAccount();
      const hrmsPage = new HrmsPage(page);
      await hrmsPage.clickRegisterEmployee();
      await hrmsPage.searchEmployeeId(hrms.Employee_Number_1);
      await expect(
        page.locator("tr", { hasText: hrms.Employee_Number_1 }),
      ).toBeVisible();
    },
  );

  test(
    "Verify the view button functionality of the employee record",
    { tag: ["@smoke", "@TC_04", "@positive"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.openHrmsModule();
      await navBarpage.clickActivateEmployeeAccount();
      const hrmsPage = new HrmsPage(page);
      await hrmsPage.clickRegisterEmployee();
      await hrmsPage.searchEmployeeId(hrms.Employee_Number_1);
      await hrmsPage.clickEditButton();
      await expect(
        page.getByRole("heading", { name: "View Register Employee" }),
      ).toBeVisible();
    },
  );

  test(
    "Verify that HR admin user can approve employee details record",
    { tag: ["@smoke", "@TC_05", "@positive"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.openHrmsModule();
      await navBarpage.clickActivateEmployeeAccount();
      expect(
        page.getByRole("heading", { name: "Employee Approve" }),
      ).toBeVisible();
      const employeeApprovePage = new EmployeeApprovePage(page);
      await employeeApprovePage.searchEmployeeId(hrms.searchEmployeeId);
      await expect(
        page.locator("tr", { hasText: hrms.searchEmployeeId }),
      ).toBeVisible();
      // await employeeApprovePage.clickApproveButton();
      // await employeeApprovePage.clickApproveConfirm();
      // await expect(
      //   page.getByText("Approved Successfully !", { exact: true }),
      // ).toBeVisible();
      // await employeeApprovePage.clickApproveConfirmButton();
    },
  );
});
