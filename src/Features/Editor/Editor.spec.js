import React from "react";
import Editor from "./index";
import { Route } from "react-router-dom";
import { startApiServer } from "ApiServer";
import { db } from "ApiServer/fixtures";
import { AppPath, appLink } from "Config/appConfig";

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
    const { baseElement, findByText } = rtlContextRouterRender(
      <Route path={AppPath.EditorDesigner}>
        <Editor />
      </Route>,
      { route: appLink.editorDesigner({ workflowId: "5eb2c4085a92d80001a16d87" }) }
    );
    await findByText("Editor");
    expect(baseElement).toMatchSnapshot();
  });
});
