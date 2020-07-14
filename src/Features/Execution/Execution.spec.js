import React from "react";
import WorkflowExecutionContainer from "./index";
import { startApiServer } from "ApiServer";
import { db } from "ApiServer/fixtures";
import { Route } from "react-router-dom";
import { queryCaches } from "react-query";

const workflowId = "5eb2c4085a92d80001a16d87";
const executionId = "5ec51eca5a92d80001a2005d";

let server;

beforeEach(() => {
  window.focus = jest.fn();
  server = startApiServer();
  server.db.loadData(db);
});

afterEach(() => {
  server.shutdown();
  queryCaches.forEach((queryCache) => queryCache.clear());
});

describe("Execution --- Snapshot", () => {
  it("Capturing Snapshot of WorkflowExecutionContainer", async () => {
    const { baseElement, findByText } = rtlRouterRender(
      <Route path="/activity/:workflowId/execution/:executionId">
        <WorkflowExecutionContainer />
      </Route>,
      { route: `/activity/${workflowId}/execution/${executionId}` }
    );
    await findByText(/Workflow run detail/);
    expect(baseElement).toMatchSnapshot();
  });
});
