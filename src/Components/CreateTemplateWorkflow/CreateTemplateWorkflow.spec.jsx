import React from "react";
import { Route } from "react-router-dom";
import CreateTemplateWorkflow from ".";
import { AppPath, appLink } from "Config/appConfig";
import { startApiServer } from "ApiServer";

const team = {
  id: "1234",
  name: "Lucas' team",
  workflows: [
    {
      id: "hQDkX9v",
      name: "lucas-workflow-1",
      description: "blablabla",
      status: "published",
      icon: "utility",
    },
    {
      id: "456",
      name: "lucas-workflow-2",
      description: "blablabla",
      status: "published",
      icon: "utility",
    },
    {
      id: "789",
      name: "lucas-workflow-3",
      description: "blablabla",
      status: "draft",
      icon: "secure",
    },
  ],
};

let server;

beforeEach(() => {
  server = startApiServer();
});

afterEach(() => {
  server.shutdown();
});

const props = {
  scope: "user",
  teams: [team],
};

describe("CreateTemplateWorkflow --- Snapshot Test", () => {
  test("Capturing Snapshot of CreateTemplateWorkflow", () => {
    const { baseElement } = rtlContextRouterRender(
      <Route path={AppPath.WorkflowsTeams}>
        <CreateTemplateWorkflow {...props} />
      </Route>,
      { route: appLink.workflows() }
    );
    expect(baseElement).toMatchSnapshot();
  });
});

//Need to look a bit more on the issue here
// describe("CreateTemplateWorkflow --- RTL", () => {
//   it("Create Template", async () => {
//     const { getByText, findByTestId } = rtlContextRouterRender(
//       <Route path={AppPath.WorkflowsTeams}>
//         <CreateTemplateWorkflow {...props} />
//       </Route>,
//       { route: appLink.workflowsTeams() }
//     );
//     fireEvent.click(screen.getByText(/Templates/));
//     await findByTestId("initial-template-screen");
//     expect(await screen.findByText("Next")).toBeDisabled();
//     fireEvent.click(screen.getByText(/Test name/));
//     expect(screen.getByText("Next")).toBeEnabled();
//     fireEvent.click(screen.getByText(/Next/));
//     fireEvent.click(screen.getByText(/^Create$/i));
//     expect(await screen.findByText("Successfully created workflow from template")).toBeInTheDocument();
//   });
// });
