/* eslint-disable jest/no-commented-out-tests */
import React from "react";
import { Route } from "react-router-dom";
import CreateTemplateWorkflow from ".";
import { queryCaches } from "react-query";
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
  queryCaches.forEach((queryCache) => queryCache.clear());
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
      { route: appLink.workflowsTeams() }
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
//     fireEvent.click(getByText(/Templates/));
//     await findByTestId("initial-template-screen");
//     expect(await findByText("Next")).toBeDisabled();
//     fireEvent.click(getByText(/Test name/));
//     expect(getByText("Next")).toBeEnabled();
//     fireEvent.click(getByText(/Next/));
//     fireEvent.click(getByText(/^Create$/i));
//     expect(await findByText("Successfully created workflow from template")).toBeInTheDocument();
//   });
// });
