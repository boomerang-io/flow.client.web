import { startApiServer } from "../../../src/apiServer";
import { appLink } from "../../../src/config/appConfig";

let server;

beforeEach(() => {
    server = startApiServer({ environment: "test" });
});

afterEach(() => {
    server.shutdown();
});

describe("TeamProperties", function () {
    beforeEach(() => {
        cy.visit(appLink.teamProperties());
    });

    it("Filter by team and find properties", function () {
        cy.get('[data-cy=team-properties-comboBox]').click();
        cy.contains('IBM Services Engineering').click()
        cy.findByText("test label").should("be.visible");
        cy.findByText("test key").should("be.visible");
        cy.findByText("for testing purpose").should("be.visible");
    });

    it("Create a team Property", function () {
        cy.get('[data-cy=team-properties-comboBox]').click();
        cy.contains('IBM Services Engineering').click()
        cy.get('[data-cy=create-team-property-button]').click();
        cy.findByLabelText("Key").type("new key");
        cy.findByLabelText("Label").type("new label");
        cy.findByLabelText("Description").type("new description");
        cy.findByLabelText("Value").type("new value");
        cy.get('[data-cy=team-property-create-submission-button]').click();
        cy.wait(1000);
        cy.findByText("new label").should("be.visible");
        cy.findByText("new key").should("be.visible");
        cy.findByText("new description").should("be.visible");
        cy.findByText("new value").should("be.visible");

    });

    it("Delete a team Property", function () {
        cy.get('[data-cy=team-properties-comboBox]').click();
        cy.contains('IBM Services Engineering').click()
        cy.get('[data-cy=team-property-menu-button]').click();
        cy.contains('Delete').click()
        cy.get('.bx--btn--danger').click()
        cy.findByText("test label").should("not.exist");
        cy.findByText("test key").should("not.exist");
        cy.findByText("for testing purpose").should("not.exist");
    });
});