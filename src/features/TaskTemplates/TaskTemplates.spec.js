import React from "react";
import TaskTemplateManager from "./index";
import { Route } from "react-router-dom";
import { startApiServer } from "../../apiServer";
import { appPath, appLink } from "Config/appConfig";
import { waitFor } from "@testing-library/react";

let server;

beforeEach(() => {
  server = startApiServer();
});

afterEach(() => {
  server.shutdown();
});

describe("TaskTemplateManager --- Snapshot", () => {
  it("Capturing Snapshot of Task Templates", async () => {
    const { baseElement, getByText } = rtlContextRouterRender(
      <Route path={appPath.taskTemplates}>
        <TaskTemplateManager />
      </Route>,
      { route: appLink.taskTemplates() }
    );
    await waitFor(() => getByText(/Task manager/i));
    expect(baseElement).toMatchSnapshot();
  });
});
