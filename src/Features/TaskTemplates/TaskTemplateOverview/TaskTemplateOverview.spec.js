import React from "react";
import { queryCaches } from "react-query";
import { Route } from "react-router-dom";
import TaskTemplateOverview from "./index";
import { startApiServer } from "ApiServer";
import { AppPath, appLink } from "Config/appConfig";
import { tasktemplate } from "ApiServer/fixtures";

let server;

beforeEach(() => {
  server = startApiServer();
});

afterEach(() => {
  server.shutdown();
  queryCaches.forEach((queryCache) => queryCache.clear());
});

const props = {
  taskTemplates: tasktemplate,
  updateTemplateInState: jest.fn(),
  editVerifiedTasksEnabled: true,
};

describe("TaskTemplateOverview --- Snapshot", () => {
  it("Capturing Snapshot of Task Templates", async () => {
    const { baseElement, findByText } = rtlContextRouterRender(
      <Route path={AppPath.TaskTemplateEdit}>
        <TaskTemplateOverview {...props} />
      </Route>,
      { route: appLink.taskTemplateEdit({id: "5e670a1e2d5e6a302de4f41d", version: "1"}) }
    );
    await findByText(/Build the definition requirements for this task/i);
    expect(baseElement).toMatchSnapshot();
  });
});
