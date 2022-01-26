import React from "react";
import { Route } from "react-router-dom";
import TaskTemplateManager from "./index";
import { startApiServer } from "ApiServer";
import { AppPath, appLink } from "Config/appConfig";
import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.setTimeout(60000);

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
      <Route path={AppPath.TaskTemplates}>
        <TaskTemplateManager />
      </Route>,
      { route: appLink.taskTemplates() }
    );
    await findByText(/Task manager/i);
    expect(baseElement).toMatchSnapshot();
  });
});

describe("TaskTemplateManager --- RTL", () => {
  test("Create new task", async () => {
    const { findByText, getByLabelText, getByText, getByPlaceholderText } = rtlContextRouterRender(
      <Route path={AppPath.TaskTemplates}>
        <TaskTemplateManager />
      </Route>,
      { route: appLink.taskTemplates() }
    );
    const createTaskButton = await findByText(/^Add a new task$/i);
    userEvent.click(createTaskButton);
    expect(await findByText(/^Create$/i)).toBeDisabled();
    userEvent.type(getByLabelText("Category"), "Test");
    userEvent.type(getByLabelText("Name"), "Test Name" );
    fireEvent.click(getByPlaceholderText("Choose an icon"));
    userEvent.click(getByText("Automated task"));
    userEvent.type(getByLabelText("Description"), "Test description");
    expect(await findByText(/^Create$/i)).toBeEnabled();
  });
});
