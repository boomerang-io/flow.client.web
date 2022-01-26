import React from "react";
import ChangeLog from ".";
import { Route } from "react-router-dom";
import { waitFor } from "@testing-library/react";
import { AppPath, appLink } from "Config/appConfig";
import { startApiServer } from "ApiServer";

let server;

beforeEach(() => {
  server = startApiServer();
});

afterEach(() => {
  server.shutdown();
});

const props = {
  summaryData: {
    id: "5eb2c4085a92d80001a16d87",
    name: "Test name",
  },
};

describe("ChangeLog --- Snapshot Test", () => {
  it("Capturing Snapshot of ChangeLog", async () => {
    const { baseElement, findByText } = rtlContextRouterRender(
      <Route path={AppPath.EditorChangelog}>
        <ChangeLog {...props} />
      </Route>,
      { route: appLink.editorChangelog({ workflowId: "5eb2c4085a92d80001a16d87" }) }
    );
    await findByText("hello sir");
    expect(baseElement).toMatchSnapshot();
    await waitFor(() => {});
  });
});
