import React from "react";
import Main from "./index";

const props = {
  dag: {},
  workflow: {
    isFetching: false,
    data: {
      name: "Sparkle Flow with extra glitter and donuts on the side"
    },
    fetchingStatus: "success"
  },
  workflowExecution: {
    status: "success",
    data: {
      status: "inProgress",
      steps: []
    }
  }
};

describe("Main --- Snapshot", () => {
  it("Capturing Snapshot of Main", () => {
    const { baseElement } = rtlRouterRender(<Main {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
