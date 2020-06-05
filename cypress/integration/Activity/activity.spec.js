import { startApiServer } from "../../../src/apiServer";
import { appLink } from "../../../src/config/appConfig";

let server;

beforeEach(() => {
  server = startApiServer({ environment: "test" });
});

afterEach(() => {
  server.shutdown();
});

describe("Activity", function () {
  beforeEach(() => {
    cy.visit(appLink.activity());
  });

  it("Show correct filters in url", function () {
    cy.get(".bx--tabs__nav-link", { timeout: 5000 }).contains("In Progress").click();
    cy.url().should("include", "statuses=inProgress");
    cy.findByText(/succeeded \(.+\)/i).click();
    cy.url().should("include", "statuses=completed");
    cy.get(".bx--tabs__nav-link").contains("Failed").click();
    cy.url().should("include", "statuses=failure");
    cy.get(".bx--tabs__nav-link").contains("Invalid").click();
    cy.url().should("include", "statuses=invalid");
    cy.findByPlaceholderText("Choose team(s)").click();
    cy.get(".bx--list-box__menu-item").contains("IBM Services").click();
    cy.url().should("include", "teamIds=5e3a35ad8c222700018ccd39");
    cy.findByPlaceholderText("Choose Workflow(s)").click();
    cy.get(".bx--list-box__menu-item").contains("ML Train").click();
    cy.url().should("include", "workflowIds=5eb2c4085a92d80001a16d87");
    cy.findByPlaceholderText("Choose trigger type(s)").click();
    cy.findByText("cron").click();
    cy.url().should("include", "triggers=cron");
    cy.findByText("manual").click();
    cy.findByText("webhook").click();
    cy.url().should("include", "triggers=cron%2Cmanual%2Cwebhook");
  });

  it("Redirects to execution view", function () {
    cy.contains("Iulian Corcoja", { timeout: 5000 });
    cy.get("tbody tr").contains("Succeeded").eq(0).click();
    cy.url().should("include", "execution");
  });
});
