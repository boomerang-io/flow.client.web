import React from "react";
import Editor from "./index";
import { Route } from "react-router-dom";
import { startApiServer } from "ApiServer";
import { db } from "ApiServer/fixtures";
import { appPath, appLink } from "Config/appConfig";
import { waitFor } from "@testing-library/react";

let server;

beforeEach(() => {
  window.focus = jest.fn();
  server = startApiServer();
  server.db.loadData(db);
});

afterEach(() => {
  server.shutdown();
});

describe("Editor --- Snapshot", () => {
  it("Capturing Snapshot of Editor", async () => {
    const { baseElement, getByText } = rtlContextRouterRender(
      <Route path={appPath.editorDesigner}>
        <Editor />
      </Route>,
      { route: appLink.editorDesigner({ teamId: "5e3a35ad8c222700018ccd39", workflowId: "5eb2c4085a92d80001a16d87" }) }
    );
    await waitFor(() => getByText("Editor"));
    expect(baseElement).toMatchSnapshot();
  });
});
