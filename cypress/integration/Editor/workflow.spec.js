/// <reference types="Cypress" />
import { startApiServer } from "ApiServer";
import { appLink } from "Config/appConfig";

let server;

beforeEach(() => {
  server = startApiServer({ environment: "test" });
});

afterEach(() => {
  server.shutdown();
});

describe("Editor -- workflow", function () {
  beforeEach(() => {
    cy.visit(appLink.editorDesigner({ teamId: "5e3a35ad8c222700018ccd39", workflowId: "5eb2c4085a92d80001a16d87" }));
  });

  it("Workflow Render", function () {
    cy.wait(1000);
    cy.findByText("ML Train – Bot Efficiency").should("be.visible");
    cy.findByText("Editor").should("be.visible");
  });

  it("Select a task", function () {
    cy.wait(1000);
    cy.get("[data-testid=editor-task-search]").type("make");
    cy.findByText("github (1)").click();
    cy.findByText("Make Repositories Private").should("be.visible");
  });
});
