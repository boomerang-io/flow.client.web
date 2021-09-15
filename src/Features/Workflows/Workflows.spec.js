import React from "react";
import { Route } from "react-router-dom";
import WorkflowsHome from "./index";
import { startApiServer } from "ApiServer";
import { queryCaches } from "react-query";
import { teams, profile } from "ApiServer/fixtures";
import { AppPath, appLink } from "Config/appConfig";
import { AppContextProvider } from "State/context";

jest.mock("@boomerang-io/carbon-addons-boomerang-react", () => ({
  ...jest.requireActual("@boomerang-io/carbon-addons-boomerang-react"),
  LoadingAnimation: "LoadingAnimation",
  notify: "notify",
  Notification: "Notification",
}));

const props = {
  teamsState: {
    isFetching: false,
    status: "success",
    error: "",
    data: [],
  },
  history: {},
  importWorkflow: {},
  importWorkflowActions: {},
  onBoard: {
    show: false,
  },
};

let server;

beforeEach(() => {
  server = startApiServer();
});

afterEach(() => {
  server.shutdown();
  queryCaches.forEach((queryCache) => queryCache.clear());
});

describe("WorkflowsHome --- Snapshot", () => {
  it("Capturing Snapshot of WorkflowsHome", () => {
    const { baseElement } = rtlContextRouterRender(
      <AppContextProvider
        value={{
          isTutorialActive: false,
          communityUrl: "www.ibm.com",
          setIsTutorialActive: () => {},
          user: profile,
          teams,
        }}
      >
        <Route path={AppPath.WorkflowsTeams}>
          <WorkflowsHome {...props} />
        </Route>
      </AppContextProvider>,
      { route: appLink.workflowsTeams() }
    );
    expect(baseElement).toMatchSnapshot();
  });
});
