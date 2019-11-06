import React from "react";
import { WorkflowExecutionContainer } from "./index";

jest.mock("@boomerang/carbon-addons-boomerang-react", () => ({
  NoDisplay: "NoDisplay",
  LoadingAnimation: "LoadingAnimation",
  notify: "notify",
  Notification: "Notification"
}));

const mockfn = jest.fn();

const props = {
  appActions: {
    setActiveTeam: mockfn
  },
  match: { params: {} },
  tasks: {
    isFetching: false,
    status: "success",
    error: "",
    data: []
  },
  tasksActions: {
    fetch: () => new Promise(() => {}),
    reset: mockfn
  },
  workflowActions: {
    fetch: () => new Promise(() => {}),
    reset: mockfn
  },
  workflowExecutionActions: {
    fetch: () => new Promise(() => {}),
    reset: mockfn
  },
  workflowRevisionActions: {
    fetch: () => new Promise(() => {}),
    reset: mockfn
  },
  workflow: {
    isFetching: false,
    isUpdating: false,
    isCreating: false,
    fetchingStatus: "success",
    updatingStatus: "",
    creatingStatus: "",
    error: "",
    data: {
      name: "Sparkle Flow with extra glitter and donuts on the side"
    }
  },

  workflowExecution: {
    isFetching: false,
    status: "success",
    error: "",
    data: {
      status: "inProgress",
      setps: []
    }
  },
  // TO DO: To be removed if not used in future development
  // workflowExecutionActiveNode: {
  //   activeNode: {}
  // },
  workflowRevision: {
    isFetching: false,
    isCreating: false,
    fetchingStatus: "success",
    creatingStatus: "",
    error: "",
    dag: {},
    version: 1,
    config: {}
  },
  app: {
    activeNode: {
      dag: {
        id: "3f58d302-2a3c-4765-b606-7573d313a2fa",
        offsetX: -51.15583333333335,
        offsetY: 2.996013020833331,
        zoom: 100.01666666666667,
        gridSize: 0,
        links: [],
        nodes: [
          {
            id: "cbdc30f0-f8d5-4674-87d3-117787fe8263",
            type: "startend",
            selected: false,
            x: 300,
            y: 400,
            extras: {},
            ports: [
              {
                id: "6f1f5e66-9bc1-4675-a654-5f580036a173",
                type: "startend",
                selected: false,
                name: "right",
                parentNode: "cbdc30f0-f8d5-4674-87d3-117787fe8263",
                links: [],
                position: "right",
                nodePortId: "6f1f5e66-9bc1-4675-a654-5f580036a173"
              }
            ],
            passedName: "Start",
            nodeId: "cbdc30f0-f8d5-4674-87d3-117787fe8263"
          }
        ]
      }
    }
  }
};

describe("WorkflowExecutionContainer --- Snapshot", () => {
  it("Capturing Snapshot of WorkflowExecutionContainer", () => {
    const { baseElement } = rtlRouterRender(<WorkflowExecutionContainer {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
