import React from "react";
import { WorkflowsHome } from "./index";

const mockfn = jest.fn();
jest.mock("@boomerang/carbon-addons-boomerang-react", () => ({
  Error404: "Error404",
  LoadingAnimation: "LoadingAnimation",
  notify: "notify",
  Notification: "Notification"
}));

const props = {
  teamsActions: {
    fetch: () => new Promise(() => {}),
    setActiveTeam: mockfn,
    updateWorkflows: mockfn
  },
  appActions: {
    setActiveTeam: mockfn
  },
  teamsState: {
    isFetching: false,
    status: "success",
    error: "",
    data: []
  },
  history: {},
  importWorkflow: {},
  importWorkflowActions: {},
  onBoard: {
    show: false
  }
};

describe("WorkflowsHome --- Snapshot", () => {
  it("Capturing Snapshot of WorkflowsHome", () => {
    const { baseElement } = rtlRouterRender(<WorkflowsHome {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
