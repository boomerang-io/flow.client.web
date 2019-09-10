import React from "react";
import { WorkflowManagerContainer as WorkflowManager } from "./index";

jest.mock("@boomerang/boomerang-components", () => ({
  NoDisplay: "NoDisplay",
  LoadingAnimation: "LoadingAnimation",
  notify: "notify",
  Notification: "Notification"
}));

const mockfn = jest.fn();

const props = {
  actions: {
    fetch: () => new Promise(() => {}),
    reset: mockfn
  },
  history: {},
  match: {},
  tasks: {
    isFetching: false,
    status: "success",
    error: "",
    data: []
  },
  tasksActions: {
    fetch: mockfn,
    reset: mockfn
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
  workflowActions: {
    reset: mockfn,
    create: mockfn,
    setHasUnsavedWorkflowUpdates: mockfn
  },
  workflowRevision: {
    isFetching: false,
    status: "success",
    error: "",
    data: []
  },
  workflowRevisionActions: {
    fetch: mockfn,
    create: mockfn,
    reset: mockfn
  }
};

describe("WorkflowManager --- Snapshot", () => {
  it("Capturing Snapshot of WorkflowManager", () => {
    const { baseElement } = rtlRouterRender(<WorkflowManager {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
