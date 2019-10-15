import React from "react";
import Main from "./index";

jest.mock("@boomerang/boomerang-components", () => ({
  LoadingAnimation: "LoadingAnimation"
}));

const mockfn = jest.fn();

const props = {
  dag: {},
  taskId: "test",
  workflowData: {
    name: "Sparkle Flow with extra glitter and donuts on the side"
  },
  workflowExecutionData: {
    status: "inProgress",
    steps: []
  },
  version: 1,
  activityState: {
    status: "success"
  },
  setActiveTeam: mockfn,
  teamsState: {
    status: "success"
  },
  updateActiveNode: mockfn
};

describe("Main --- Snapshot", () => {
  it("Capturing Snapshot of Main", () => {
    const { baseElement } = rtlRouterRender(<Main {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
