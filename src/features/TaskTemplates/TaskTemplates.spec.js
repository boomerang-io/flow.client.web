import React from "react";
import TaskTemplateManager from "./index";
import { Route } from "react-router-dom";
import { startApiServer } from "ApiServer";
import { appPath, appLink } from "Config/appConfig";

let server;

beforeEach(() => {
  server = startApiServer();
});

afterEach(() => {
  server.shutdown();
});

describe("TaskTemplateManager --- Snapshot", () => {
  it("Capturing Snapshot of Task Templates", async () => {
    const { baseElement, findByText } = rtlContextRouterRender(
      <Route path={appPath.taskTemplates}>
        <TaskTemplateManager />
      </Route>,
      { route: appLink.taskTemplates() }
    );
    await findByText(/Task manager/i);
    expect(baseElement).toMatchSnapshot();
  });
});
