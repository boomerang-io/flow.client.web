import React from "react";
import TaskTemplateManager from "./index";
import { Route } from "react-router-dom";
import { startApiServer } from "ApiServer";
import { AppPath, appLink } from "Config/appConfig";
import { queryCaches } from "react-query";

let server;

beforeEach(() => {
  server = startApiServer();
});

afterEach(() => {
  server.shutdown();
  queryCaches.forEach((queryCache) => queryCache.clear());
});

describe("TaskTemplateManager --- Snapshot", () => {
  it("Capturing Snapshot of Task Templates", async () => {
    const { baseElement, findByText } = rtlContextRouterRender(
      <Route path={AppPath.TaskTemplates}>
        <TaskTemplateManager />
      </Route>,
      { route: appLink.taskTemplates() }
    );
    await findByText(/Task manager/i);
    expect(baseElement).toMatchSnapshot();
  });
});
