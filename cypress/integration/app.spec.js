/* eslint-disable jest/expect-expect */
import { startApiServer } from "../../src/apiServer";

let server;

beforeEach(() => {
  server = startApiServer({ environment: "test" });
});

afterEach(() => {
  server.shutdown();
});

it("Loads home", () => {
  cy.visit("/");
});
