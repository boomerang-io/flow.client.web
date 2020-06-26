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

describe("Editor -- properties", function () {
  beforeEach(() => {
    cy.visit(appLink.editorProperties({ teamId: "5e3a35ad8c222700018ccd39", workflowId: "5eb2c4085a92d80001a16d87" }));
  });

  it("Edit Property", function () {
    cy.wait(1000);
    cy.get("[data-cy=workflow-properties-edit-button]").eq(0).click();
    cy.findByLabelText("Default Value").type("testing default value");
    cy.get("[data-cy=property-modal-confirm-button]").eq(0).click();
    cy.findByText("testing default value").should("be.visible");
  });

  it("Create Property", function () {
    cy.wait(1000);
    cy.get("[data-cy=create-property-card-button]").click();
    cy.findByLabelText("Key").type("testingKey");
    cy.findByLabelText("Type").click();
    cy.findByText("Boolean").click();
    cy.findByLabelText("Label").type("testing label");

    // cy.findByLabelText('Required').scrollIntoView().click();
    cy.get("[data-cy=property-modal-confirm-button]").eq(0).click();
    cy.findByText("testingKey").should("be.visible");
    cy.findByText("testing label").should("be.visible");
  });

  it("Delete Property", function () {
    cy.wait(1000);
    cy.get("[data-cy=workflow-delete-property-button]").eq(0).click();
    cy.get(".bx--btn--danger").click();
    cy.findByText("Tenant ID").should("not.exist");
  });
});
