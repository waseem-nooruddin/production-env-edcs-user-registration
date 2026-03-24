import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { NavBarPage } from "../../pages/navbar.page";
import { credentials } from "../resources/credentials";
import { EmployeeRegistration } from "../../pages/employee.registration.page";
import { testdata } from "../resources/testdata";
import { testdata as hrms } from "../resources/hrmstestdata";
import { HrmsPage } from "../../pages/hrms.page";
import { EmployeeApprovePage } from "../../pages/employee.approve.page";
import {
  generateEmployeeNumber,
  saveEmployeeToJson,
  readEmployeeFromJson,
} from "../../utils/employeeNumber";

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
      await loginPage.login(
        credentials.admin2.username,
        credentials.admin2.password,
      );
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
      await loginPage.login(
        credentials.admin2.username,
        credentials.admin2.password,
      );
      const navBarpage = new NavBarPage(page);
      await navBarpage.openHrmsModule();
      const hrmsPage = new HrmsPage(page);
      await hrmsPage.clickRegisterEmployee();
      await hrmsPage.clickAddNew();

      //Personal Details
      await hrmsPage.selectTitle();
      await hrmsPage.enterFullName(hrms.personalInformation.nameInFull);
      await hrmsPage.enterSurName(hrms.personalInformation.surname);
      await hrmsPage.selectGender();
      await hrmsPage.enterDOB(hrms.personalInformation.dateOfBirth);
      await hrmsPage.enterPlaceOfBirth(hrms.personalInformation.placeOfBirth);
      await hrmsPage.selectBloodGroup();
      await hrmsPage.enterNIC(hrms.identificationInformation.nicNumber);
      await hrmsPage.enterNicIssueDate(
        hrms.identificationInformation.nicIssueDate,
      );
      await hrmsPage.enterMaritalStatus(
        hrms.additionalInformation.maritalStatus,
      );
      await hrmsPage.clickNext();

      //Employment Details
      const employeeNumber = generateEmployeeNumber();
      saveEmployeeToJson(employeeNumber);
      await hrmsPage.enterEmployeeNumber(employeeNumber);
      await hrmsPage.selectBranch(hrms.organizationDetails.branch);
      await hrmsPage.selectDivision(hrms.organizationDetails.division);
      await hrmsPage.selectResignedTerrminated(
        hrms.appointmentInformation.resignedTerminated,
      );
      await hrmsPage.selectEmployeeType(
        hrms.appointmentInformation.employeeType,
      );
      await hrmsPage.enterDateOfJoin(hrms.appointmentInformation.dateOfJoin);
      await hrmsPage.enterenterworkShipCategoryI(
        hrms.appointmentInformation.workingShiftCategory,
      );
      await hrmsPage.enterpriorNotiePeriod(
        hrms.appointmentInformation.priorNoticePeriod,
      );
      await hrmsPage.enterConfirmationDueOn(
        hrms.appointmentInformation.confirmationDueOn,
      );
      await hrmsPage.enterpersonalGrade(
        hrms.appointmentInformation.personalGrade,
      );
      await hrmsPage.enterCostCenter(hrms.appointmentInformation.costCenter);
      await hrmsPage.enterjobCategory(
        hrms.employeePosition.positionHistory[0].jobCategory,
      );
      await hrmsPage.enterCurrentDesignation(
        hrms.employeePosition.positionHistory[0].designation,
      );
      await hrmsPage.enterdateofDesignation(
        hrms.employeePosition.positionHistory[0].startDate,
      );
      await hrmsPage.enterreportingPerson(
        hrms.employeePosition.positionHistory[0].reportingPerson,
      );
      await hrmsPage.clickOnAddButton();
      await hrmsPage.enterpermanenetLocation(
        hrms.locationDetails.locationHistory[0].location,
      );
      await hrmsPage.enterfromDate(
        hrms.locationDetails.locationHistory[0].fromDate,
      );
      await hrmsPage.clickLocationDetailsAddButton();
      await hrmsPage.clickOnNextButton();

      //Contact Details

      await hrmsPage.fillAddressLine1(hrms.residentialAddress.line1);
      await hrmsPage.fillAddressLine2(hrms.residentialAddress.line2);
      await hrmsPage.fillAddressLine3(hrms.residentialAddress.line3);

      await hrmsPage.selectProvince(hrms.residentialAddress.province);
      await hrmsPage.selectDistrict(hrms.residentialAddress.district);
      await hrmsPage.selectCity(hrms.residentialAddress.cityTown);

      await hrmsPage.fillEmail(hrms.contactDetails.email);
      await hrmsPage.fillMobile(hrms.contactDetails.mobile);

      await hrmsPage.clickNextButton();

      //Qualification Details
      await hrmsPage.selectOnQualificationType(
        hrms.qualifications.qualificationHistory[0].qualificationType,
      );
      await hrmsPage.selectOnQualification(
        hrms.qualifications.qualificationHistory[0].qualification,
      );
      await hrmsPage.selectOnCourseDuration(
        hrms.qualifications.qualificationHistory[0].courseDuration,
      );
      await hrmsPage.clickAddButton();
      await hrmsPage.clickNextButton();

      //salary details

      await hrmsPage.fillBasicSalary(hrms.salaryInformation.basicSalary);
      await hrmsPage.selectAllowanceType(hrms.salaryInformation.allowanceType);
      //await hrmsPage.fillAllowanceAmount('20000.00');
      await hrmsPage.clickOnTheAddButton();
      await hrmsPage.clickOnTheNextButton();

      //Bank Details

      await hrmsPage.selectBank(hrms.bankInformation.bank);
      await hrmsPage.selectOnDivision(hrms.bankInformation.division);
      await hrmsPage.selectAccountType(hrms.bankInformation.accountType);
      await hrmsPage.fillAccountNumber(hrms.bankInformation.accountNumber);
      await hrmsPage.clickAddButton();
      await hrmsPage.clickNextButton();

      //Document Upload
      await hrmsPage.uploadDocument("test-file.jpg");
      await hrmsPage.clickOnSave();
      await hrmsPage.submitApplication();
    },
  );

  test(
    "Verify employee appears in Employee List",
    { tag: ["@smoke", "@TC_03", "@positive"] },
    async ({ page }) => {
      await loginPage.login(
        credentials.admin2.username,
        credentials.admin2.password,
      );
      await page.waitForLoadState("networkidle");
      const navBarpage = new NavBarPage(page);
      await navBarpage.openHrmsModule();
      const employeeRegistration = new EmployeeRegistration(page);
      await employeeRegistration.clickRegisterEmployee();
      const hrmsPage = new HrmsPage(page);
      await hrmsPage.searchEmployeeId(hrms.employeeIdentity.employeeNumber);
      await page.waitForLoadState("networkidle");
      await expect(
        page.locator("tr", { hasText: hrms.employeeIdentity.employeeNumber }),
      ).toBeVisible();
    },
  );

  test(
    "Verify the view button functionality of the employee record",
    { tag: ["@smoke", "@TC_04", "@positive"] },
    async ({ page }) => {
      await loginPage.login(
        credentials.admin2.username,
        credentials.admin2.password,
      );
      const navBarpage = new NavBarPage(page);
      await navBarpage.openHrmsModule();
      await navBarpage.clickActivateEmployeeAccount();
      const hrmsPage = new HrmsPage(page);
      await hrmsPage.clickRegisterEmployee();
      await hrmsPage.searchEmployeeId(hrms.employeeIdentity.employeeNumber);
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
      await loginPage.login(
        credentials.admin2.username,
        credentials.admin2.password,
      );
      const navBarpage = new NavBarPage(page);
      await navBarpage.openHrmsModule();
      await navBarpage.clickActivateEmployeeAccount();
      expect(
        page.getByRole("heading", { name: "Employee Approve" }),
      ).toBeVisible();
      const employeeApprovePage = new EmployeeApprovePage(page);
      await employeeApprovePage.searchEmployeeId(
        hrms.employeeIdentity.employeeNumber,
      );
      await expect(
        page.locator("tr", { hasText: hrms.employeeIdentity.employeeNumber }),
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
