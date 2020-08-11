import { startApiServer } from "ApiServer";
import { appLink } from "Config/appConfig";

let server;

beforeEach(() => {
  server = startApiServer({ environment: "test" });
});

afterEach(() => {
  server.shutdown();
});

describe("Settings", function () {
  beforeEach(() => {
    cy.visit(appLink.settings());
  });

  it("Update a section", function () {
    cy.findByRole("heading", { name: /^Slack$/i }).click();
    cy.findByLabelText(/^Platform Users Channel$/i)
      .clear()
      .type("#bmrg-flow-users");
    cy.findAllByRole("button", { name: /save/i }).filter(":visible").click();
    cy.findByText(/Update Settings/i).should("be.visible");
    cy.findAllByRole("button", { name: /save/i }).filter(":visible").should("be.disabled");
  });
});
