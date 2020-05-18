import React from "react";
import { Route } from "react-router-dom";
import { WorkflowManagerContainer as WorkflowManager } from "./index";

jest.mock("@boomerang/carbon-addons-boomerang-react", () => ({
  NoDisplay: "NoDisplay",
  LoadingAnimation: "LoadingAnimation",
  notify: "notify",
  Notification: "Notification"
}));

const mockfn = jest.fn();

const props = {
  tasks: {
    isFetching: false,
    status: "success",
    error: "",
    data: []
  },
  teams: {
    isFetching: false,
    status: "success",
    error: "",
    data: []
  },
  workflow: {
    isFetching: false,
    status: "success",
    error: "",
    data: []
  },
  workflowRevision: {
    isFetching: false,
    status: "success",
    error: "",
    data: []
  },
  workflowRevisionActions: {},
  workflowActions:{},
  appActions:{},
  history:{},
  tasksActions:{},
  match:{},
  isModalOpen: true
};

describe("WorkflowManager --- Snapshot", () => {
  it("Capturing Snapshot of WorkflowManager", () => {
    const { baseElement } = rtlReduxRouterRender(
      <Route path="/editor/:workflowId">
        <WorkflowManager {...props} />
      </Route>,
      { path: "/editor/1234" }
    );
    expect(baseElement).toMatchSnapshot();
  });
});
