import { Route } from "react-router-dom";
import TaskTemplateManager from "./index";
import { startApiServer } from "ApiServer";
import { AppPath, appLink } from "Config/appConfig";
import { screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

let server;

beforeEach(() => {
  server = startApiServer();
});

afterEach(() => {
  server.shutdown();
});

describe("TaskTemplateManager --- Snapshot", () => {
  it("Capturing Snapshot of Task Templates", async () => {
    const { baseElement } = rtlContextRouterRender(
      <Route path={AppPath.TaskTemplates}>
        <TaskTemplateManager />
      </Route>,
      { route: appLink.taskTemplates() }
    );
    await screen.findByText(/Task manager/i);
    expect(baseElement).toMatchSnapshot();
  });
});

describe("TaskTemplateManager --- RTL", () => {
  test("Create new task", async () => {
    rtlContextRouterRender(
      <Route path={AppPath.TaskTemplates}>
        <TaskTemplateManager />
      </Route>,
      { route: appLink.taskTemplates() }
    );
    const createTaskButton = await screen.findByText(/^Add a new task$/i);
    userEvent.click(createTaskButton);
    expect(await screen.findByText(/^Create$/i)).toBeDisabled();
    userEvent.type(screen.getByLabelText("Category"), "Test");
    userEvent.type(screen.getByLabelText("Name"), "Test Name");
    fireEvent.click(screen.getByPlaceholderText("Choose an icon"));
    userEvent.click(screen.getByText("Automated task"));
    userEvent.type(screen.getByLabelText("Description"), "Test description");
    expect(await screen.findByText(/^Create$/i)).toBeEnabled();
  });
});
