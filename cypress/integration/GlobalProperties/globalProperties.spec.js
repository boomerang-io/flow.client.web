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

describe("globalProperties", function () {
  beforeEach(() => {
    cy.visit(appLink.properties());
  });

  it("Find properties", function () {
    cy.findByText("Test property").should("be.visible");
    cy.findByText("test.key").should("be.visible");
    cy.findByText("adding a test description").should("be.visible");
  });

  it("Create a team Property", function () {
    cy.get("[data-cy=create-global-property-button]").click();
    cy.get("[data-cy=create-property-key]").type("new key");
    cy.get("[data-cy=create-property-label]").type("new label");
    cy.get("[data-cy=create-property-description]").type("new description");
    cy.get("[data-cy=create-property-value]").type("new value");
    cy.get("[data-cy=global-property-create-submission-button]").click();
    cy.wait(1000);
    cy.findByText("new label").should("be.visible");
    cy.findByText("new key").should("be.visible");
    cy.findByText("new description").should("be.visible");
    cy.findByText("new value").should("be.visible");
  });

  it("Delete a team Property", function () {
    cy.get("[data-cy=global-property-menu-button]").eq(0).click();
    cy.contains("Delete").click();
    cy.get(".bx--btn--danger").click();
    cy.findByText("test label").should("not.exist");
    cy.findByText("test key").should("not.exist");
    cy.findByText("for testing purpose").should("not.exist");
  });
});
